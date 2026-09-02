/**
 * Date Converter — Gregorian <-> Hijri
 * Uses the free AlAdhan API conversion endpoints.
 */

const HIJRI_MONTHS = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
    "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah",
];

function showResult(html) {
    const el = document.getElementById("converter-result");
    el.innerHTML = html;
    el.hidden = false;
}

function showError(message) {
    showResult(`<p class="converter-error">${message}</p>`);
}

async function convertGregorianToHijri() {
    const dateInput = document.getElementById("greg-date").value; // yyyy-mm-dd
    if (!dateInput) {
        alert("Please choose a Gregorian date.");
        return;
    }

    const [year, month, day] = dateInput.split("-");
    const formatted = `${day}-${month}-${year}`; // AlAdhan expects DD-MM-YYYY

    showResult(`<p class="converter-loading">Converting…</p>`);

    try {
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${formatted}`);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const data = await response.json();
        if (data.code !== 200) throw new Error("Unexpected API response");

        const h = data.data.hijri;
        showResult(`
            <p class="converter-result-label">Hijri Date</p>
            <h2 class="converter-result-value">${h.day} ${h.month.en} ${h.year} AH</h2>
            <p class="converter-result-sub">${h.weekday.en} &middot; ${data.data.gregorian.day} ${data.data.gregorian.month.en} ${data.data.gregorian.year} CE</p>
        `);
    } catch (err) {
        console.error("Conversion failed:", err);
        showError("Couldn't convert this date. Please check your connection and try again.");
    }
}

async function convertHijriToGregorian() {
    const day = document.getElementById("hijri-day").value;
    const month = document.getElementById("hijri-month").value;
    const year = document.getElementById("hijri-year").value;

    if (!day || !year) {
        alert("Please enter a day and year.");
        return;
    }

    const formatted = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;

    showResult(`<p class="converter-loading">Converting…</p>`);

    try {
        const response = await fetch(`https://api.aladhan.com/v1/hToG?date=${formatted}`);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const data = await response.json();
        if (data.code !== 200) throw new Error("Unexpected API response");

        const g = data.data.gregorian;
        showResult(`
            <p class="converter-result-label">Gregorian Date</p>
            <h2 class="converter-result-value">${g.day} ${g.month.en} ${g.year} CE</h2>
            <p class="converter-result-sub">${g.weekday.en} &middot; ${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year} AH</p>
        `);
    } catch (err) {
        console.error("Conversion failed:", err);
        showError("Couldn't convert this date. Please double-check the values and try again.");
    }
}

// ---------- Tab switching ----------

function switchMode(mode) {
    document.querySelectorAll(".converter-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.mode === mode);
    });
    document.getElementById("g-to-h-form").hidden = mode !== "g-to-h";
    document.getElementById("h-to-g-form").hidden = mode !== "h-to-g";
    document.getElementById("converter-result").hidden = true;
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".converter-tab").forEach((tab) => {
        tab.addEventListener("click", () => switchMode(tab.dataset.mode));
    });

    document.getElementById("convert-g-to-h-btn").addEventListener("click", convertGregorianToHijri);
    document.getElementById("convert-h-to-g-btn").addEventListener("click", convertHijriToGregorian);

    // Default the date picker to today for convenience
    const todayStr = new Date().toISOString().split("T")[0];
    document.getElementById("greg-date").value = todayStr;
});
