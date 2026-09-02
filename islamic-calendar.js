/**
 * Islamic Calendar — monthly grid showing Gregorian dates with their
 * corresponding Hijri date underneath, using AlAdhan's gToHCalendar endpoint.
 */

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1; // 1-12

async function loadCalendarMonth(year, month) {
    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = `<p class="converter-loading">Loading calendar…</p>`;

    try {
        const response = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`);
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        const data = await response.json();
        if (data.code !== 200) throw new Error("Unexpected API response");

        renderCalendar(data.data, year, month);
    } catch (err) {
        console.error("Failed to load calendar:", err);
        grid.innerHTML = `<p class="converter-error">Couldn't load the calendar. Please check your connection and try again.</p>`;
    }
}

function renderCalendar(days, year, month) {
    const monthNameEl = document.getElementById("calendar-month-title");
    const firstDay = days[0];
    monthNameEl.textContent = `${firstDay.gregorian.month.en} ${year}`;

    const grid = document.getElementById("calendar-grid");

    // Figure out what weekday the 1st of the month falls on, to pad the grid correctly
    const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0 = Sunday

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;

    let html = "";

    // Leading blank cells
    for (let i = 0; i < firstWeekday; i++) {
        html += `<div class="calendar-cell calendar-cell-empty"></div>`;
    }

    days.forEach((day) => {
        const gregDay = parseInt(day.gregorian.day, 10);
        const isToday = isCurrentMonth && gregDay === today.getDate();

        html += `
            <div class="calendar-cell${isToday ? " calendar-cell-today" : ""}">
                <span class="calendar-greg-day">${gregDay}</span>
                <span class="calendar-hijri-day">${day.hijri.day} ${day.hijri.month.en.slice(0, 3)}</span>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    } else if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }
    loadCalendarMonth(currentYear, currentMonth);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("prev-month-btn").addEventListener("click", () => changeMonth(-1));
    document.getElementById("next-month-btn").addEventListener("click", () => changeMonth(1));
    loadCalendarMonth(currentYear, currentMonth);
});
