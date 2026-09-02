/**
 * Waqt — Prayer Times
 * Uses the free, no-key AlAdhan API (https://aladhan.com/prayer-times-api)
 */

const PRAYER_ORDER = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];
const COUNTDOWN_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]; // Sunrise excluded — not a prayer

const LOCATION_STORAGE_KEY = "waqt_location";
const METHOD_STORAGE_KEY = "waqt_method";
const SCHOOL_STORAGE_KEY = "waqt_school";

let currentTimings = null;
let countdownInterval = null;

// ---------- Location handling ----------

function saveLocation(location) {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
}

function loadSavedLocation() {
    try {
        const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function detectLocation() {
    document.getElementById("location-text").textContent = "Detecting your location…";

    if (!navigator.geolocation) {
        showManualForm("Geolocation isn't supported on this browser — please enter your city.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const location = {
                type: "coords",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                label: "Your current location",
            };
            saveLocation(location);
            loadPrayerTimes(location);
        },
        () => {
            showManualForm("Couldn't access your location — please enter your city instead.");
        }
    );
}

function showManualForm(message) {
    document.getElementById("location-text").textContent = message || "Enter your city below.";
    document.getElementById("manual-form").hidden = false;
}

function handleManualSubmit() {
    const city = document.getElementById("city-input").value.trim();
    const country = document.getElementById("country-input").value.trim();

    if (!city || !country) {
        alert("Please enter both a city and a country.");
        return;
    }

    const location = { type: "city", city, country, label: `${city}, ${country}` };
    saveLocation(location);
    document.getElementById("manual-form").hidden = true;
    loadPrayerTimes(location);
}

// ---------- API ----------

function getSelectedMethod() {
    return document.getElementById("method-select").value;
}

function getSelectedSchool() {
    return document.getElementById("school-select").value;
}

async function loadPrayerTimes(location) {
    document.getElementById("location-text").textContent = `Loading times for ${location.label}…`;

    const method = getSelectedMethod();
    const school = getSelectedSchool();
    let url;

    if (location.type === "coords") {
        url = `https://api.aladhan.com/v1/timings/${todayTimestamp()}?latitude=${location.latitude}&longitude=${location.longitude}&method=${method}&school=${school}`;
    } else {
        url = `https://api.aladhan.com/v1/timingsByCity/${todayTimestamp()}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}&method=${method}&school=${school}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const data = await response.json();

        if (data.code !== 200) throw new Error("Unexpected API response");

        currentTimings = data.data.timings;
        renderDate(data.data.date);
        renderTimingsGrid(currentTimings);
        document.getElementById("location-text").textContent = location.label;

        startCountdown();
    } catch (err) {
        console.error("Failed to load prayer times:", err);
        document.getElementById("location-text").textContent =
            "Couldn't load prayer times. Please check your connection and try again.";
    }
}

function todayTimestamp() {
    return Math.floor(Date.now() / 1000);
}

// ---------- Rendering ----------

function cleanTime(timeStr) {
    // AlAdhan sometimes returns "05:12 (PKT)" — strip the timezone suffix for display/parsing
    return timeStr.split(" ")[0];
}

function renderDate(dateInfo) {
    document.getElementById("gregorian-date").textContent = dateInfo.readable;
    document.getElementById("hijri-date").textContent =
        `${dateInfo.hijri.day} ${dateInfo.hijri.month.en} ${dateInfo.hijri.year} AH`;
}

function renderTimingsGrid(timings) {
    const grid = document.getElementById("timings-grid");
    grid.innerHTML = PRAYER_ORDER.map((name) => `
        <div class="timing-card" data-prayer="${name}">
            <p class="timing-name">${name}</p>
            <p class="timing-value">${cleanTime(timings[name])}</p>
        </div>
    `).join("");
}

// ---------- Next prayer countdown ----------

function parseTimeToDate(timeStr, dayOffset = 0) {
    const [hours, minutes] = cleanTime(timeStr).split(":").map(Number);
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

function getNextPrayer() {
    if (!currentTimings) return null;

    const now = new Date();

    for (const name of COUNTDOWN_PRAYERS) {
        const prayerTime = parseTimeToDate(currentTimings[name]);
        if (prayerTime > now) {
            return { name, time: prayerTime };
        }
    }

    // All of today's prayers have passed — next one is tomorrow's Fajr.
    // Using today's Fajr time as an approximation; exact time may shift by a minute or two.
    const tomorrowFajr = parseTimeToDate(currentTimings["Fajr"], 1);
    return { name: "Fajr", time: tomorrowFajr };
}

function formatCountdown(msRemaining) {
    const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateCountdownDisplay() {
    const next = getNextPrayer();
    if (!next) return;

    document.getElementById("next-prayer-name").textContent = next.name;
    document.getElementById("next-prayer-time").textContent =
        next.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const msRemaining = next.time - new Date();
    document.getElementById("next-prayer-countdown").textContent = formatCountdown(msRemaining);

    // Highlight the active card in the grid
    document.querySelectorAll(".timing-card").forEach((card) => {
        card.classList.toggle("is-active", card.dataset.prayer === next.name);
    });

    // If we've crossed midnight, refresh from the API for a new day's data
    const lastCheckedDay = window._waqtLastDay;
    const today = new Date().toDateString();
    if (lastCheckedDay && lastCheckedDay !== today) {
        const savedLocation = loadSavedLocation();
        if (savedLocation) loadPrayerTimes(savedLocation);
    }
    window._waqtLastDay = today;
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    updateCountdownDisplay();
    countdownInterval = setInterval(updateCountdownDisplay, 1000);
}

// ---------- Monthly timetable ----------

let monthlyLoaded = false;

async function loadMonthlyTimetable(location) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const method = getSelectedMethod();
    const school = getSelectedSchool();

    let url;
    if (location.type === "coords") {
        url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.latitude}&longitude=${location.longitude}&method=${method}&school=${school}`;
    } else {
        url = `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}&method=${method}&school=${school}`;
    }

    const tbody = document.getElementById("monthly-tbody");
    tbody.innerHTML = `<tr><td colspan="7" class="monthly-loading">Loading timetable…</td></tr>`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const data = await response.json();
        if (data.code !== 200) throw new Error("Unexpected API response");

        document.getElementById("monthly-title").textContent =
            now.toLocaleDateString(undefined, { month: "long", year: "numeric" });

        tbody.innerHTML = data.data.map((day) => `
            <tr${isToday(day.date.gregorian) ? ' class="is-today-row"' : ""}>
                <td>${day.date.gregorian.day} ${day.date.gregorian.month.en.slice(0, 3)}</td>
                <td>${cleanTime(day.timings.Fajr)}</td>
                <td>${cleanTime(day.timings.Sunrise)}</td>
                <td>${cleanTime(day.timings.Dhuhr)}</td>
                <td>${cleanTime(day.timings.Asr)}</td>
                <td>${cleanTime(day.timings.Maghrib)}</td>
                <td>${cleanTime(day.timings.Isha)}</td>
            </tr>
        `).join("");
    } catch (err) {
        console.error("Failed to load monthly timetable:", err);
        tbody.innerHTML = `<tr><td colspan="7" class="monthly-loading">Couldn't load the monthly timetable. Please try again.</td></tr>`;
    }
}

function isToday(gregorianDate) {
    const today = new Date();
    return (
        parseInt(gregorianDate.day, 10) === today.getDate()
    );
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("detect-btn").addEventListener("click", detectLocation);
    document.getElementById("manual-toggle-btn").addEventListener("click", () => {
        document.getElementById("manual-form").hidden = false;
    });
    document.getElementById("manual-submit-btn").addEventListener("click", handleManualSubmit);

    const methodSelect = document.getElementById("method-select");
    const savedMethod = localStorage.getItem(METHOD_STORAGE_KEY);
    if (savedMethod) methodSelect.value = savedMethod;

    const schoolSelect = document.getElementById("school-select");
    const savedSchool = localStorage.getItem(SCHOOL_STORAGE_KEY);
    if (savedSchool) schoolSelect.value = savedSchool;

    function refreshAll() {
        const savedLocation = loadSavedLocation();
        if (!savedLocation) return;
        loadPrayerTimes(savedLocation);
        if (monthlyLoaded) loadMonthlyTimetable(savedLocation);
    }

    methodSelect.addEventListener("change", () => {
        localStorage.setItem(METHOD_STORAGE_KEY, methodSelect.value);
        refreshAll();
    });

    schoolSelect.addEventListener("change", () => {
        localStorage.setItem(SCHOOL_STORAGE_KEY, schoolSelect.value);
        refreshAll();
    });

    document.getElementById("monthly-toggle-btn").addEventListener("click", () => {
        const wrap = document.getElementById("monthly-wrap");
        const btn = document.getElementById("monthly-toggle-btn");
        const isHidden = wrap.hidden;
        wrap.hidden = !isHidden;
        btn.textContent = isHidden ? "Hide Monthly Timetable" : "View Monthly Timetable";

        if (isHidden) {
            const savedLocation = loadSavedLocation();
            if (savedLocation) {
                loadMonthlyTimetable(savedLocation);
                monthlyLoaded = true;
            }
        }
    });

    const savedLocation = loadSavedLocation();
    if (savedLocation) {
        loadPrayerTimes(savedLocation);
    } else {
        detectLocation();
    }
});