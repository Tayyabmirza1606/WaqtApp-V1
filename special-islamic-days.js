/**
 * Special Islamic Days
 * Fetches the current Hijri year, then converts each occasion's fixed
 * Hijri day/month to its Gregorian equivalent for that year via AlAdhan's hToG endpoint.
 */

const OCCASIONS = [
    { name: "Islamic New Year", day: 1, month: 1, description: "The first day of Muharram, marking the start of the Hijri year." },
    { name: "Day of Ashura", day: 10, month: 1, description: "The 10th of Muharram, a day of significance and recommended fasting." },
    { name: "Mawlid al-Nabi", day: 12, month: 3, description: "Commemoration of the birth of Prophet Muhammad ﷺ, observed by many (date debated among scholars)." },
    { name: "Start of Ramadan", day: 1, month: 9, description: "The beginning of the month of fasting." },
    { name: "Laylat al-Qadr (commonly observed)", day: 27, month: 9, description: "The Night of Decree — sought on any odd night in the last ten nights of Ramadan; the 27th is the most commonly marked date." },
    { name: "Eid al-Fitr", day: 1, month: 10, description: "The festival marking the end of Ramadan." },
    { name: "Day of Arafah", day: 9, month: 12, description: "A day of fasting and significance during the Hajj season." },
    { name: "Eid al-Adha", day: 10, month: 12, description: "The Festival of Sacrifice, marking the culmination of Hajj." },
];

const FETCH_TIMEOUT_MS = 10000;

/** Wraps fetch with a timeout, so a stalled/silently-blocked request can't hang the page forever. */
async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function getCurrentHijriYear() {
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;
    const response = await fetchWithTimeout(`https://api.aladhan.com/v1/gToH?date=${formatted}`);
    const data = await response.json();
    if (data.code !== 200) throw new Error("Couldn't determine current Hijri year");
    return parseInt(data.data.hijri.year, 10);
}

async function getGregorianDateFor(day, month, hijriYear) {
    const formatted = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${hijriYear}`;
    const response = await fetchWithTimeout(`https://api.aladhan.com/v1/hToG?date=${formatted}`);
    const data = await response.json();
    if (data.code !== 200) throw new Error("Conversion failed");
    const g = data.data.gregorian;
    return `${g.day} ${g.month.en} ${g.year}`;
}

async function loadSpecialDays() {
    const list = document.getElementById("special-days-list");

    try {
        const hijriYear = await getCurrentHijriYear();
        document.getElementById("hijri-year-sub").textContent = `Major occasions in ${hijriYear} AH.`;

        // Fetch sequentially (not Promise.all) — firing 8 requests at once to a
        // free, unauthenticated API risks triggering rate limiting, which was
        // causing some occasions to randomly fail with "Unable to calculate."
        const results = [];
        for (const occasion of OCCASIONS) {
            try {
                const gregorianDate = await getGregorianDateFor(occasion.day, occasion.month, hijriYear);
                results.push({ ...occasion, gregorianDate });
            } catch {
                results.push({ ...occasion, gregorianDate: "Unable to calculate" });
            }
        }

        list.innerHTML = results.map((occasion) => `
            <div class="special-day-card">
                <div class="special-day-info">
                    <h3 class="special-day-name">${occasion.name}</h3>
                    <p class="special-day-desc">${occasion.description}</p>
                </div>
                <div class="special-day-date">${occasion.gregorianDate}</div>
            </div>
        `).join("");

    } catch (err) {
        console.error("Failed to load special days:", err);
        list.innerHTML = `<p class="converter-error">Couldn't load these dates. Please check your connection and try again.</p>`;
    }
}

document.addEventListener("DOMContentLoaded", loadSpecialDays);