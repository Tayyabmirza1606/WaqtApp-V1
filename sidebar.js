/**
 * Shared Sidebar Navigation
 * Single source of truth for the nav menu — add a new page here once,
 * and it appears on every page automatically. No more editing every
 * HTML file's sidebar copy by hand.
 *
 * Usage: each page just needs an empty <div id="sidebar-placeholder"></div>
 * and <script src="sidebar.js"></script>, with a matching data-page="..."
 * attribute on <body> to mark which link should be highlighted active.
 */

const SIDEBAR_LINKS = [
    { page: "home", href: "index.html", label: "Home" },
    { page: "prayer-times", href: "index.html#prayer-times", label: "Prayer Times" },
    { page: "islamic-calendar", href: "islamic-calendar.html", label: "Islamic Calendar" },
    { page: "quran", href: "quran.html", label: "Al Quran" },
    { page: "hadith", href: "hadith.html", label: "Hadith" },
    { page: "duas", href: "duas.html", label: "Duas" },
    { page: "special-days", href: "special-islamic-days.html", label: "Special Islamic Days" },
    { page: "qibla", href: "qibla.html", label: "Qibla Direction" },
    { page: "date-converter", href: "date-converter.html", label: "Date Converter" },
    { page: "knowledge", href: "knowledge.html", label: "Knowledge" },
    { page: "gallery", href: "gallery.html", label: "Islamic Gallery" },
    { page: "places", href: "places.html", label: "Islamic Places" },
    { page: "prayerbook", href: "prayerbook.html", label: "Prayerbook" },
    { page: "zakat", href: "zakat-calculator.html", label: "Zakat Calculator" },
];

function renderSidebar() {
    const placeholder = document.getElementById("sidebar-placeholder");
    if (!placeholder) return;

    const activePage = document.body.dataset.page || "";

    const linksHtml = SIDEBAR_LINKS.map((link) => {
        const isActive = link.page === activePage;
        return `<a href="${link.href}" class="sidebar-link${isActive ? " active" : ""}">${link.label}</a>`;
    }).join("");

    placeholder.outerHTML = `
        <aside class="sidebar">
            <div class="sidebar-logo">
                <span class="sidebar-logo-icon">☾</span>
                <span class="sidebar-logo-text">Waqt</span>
            </div>
            <nav class="sidebar-nav">
                ${linksHtml}
            </nav>
        </aside>
    `;
}

// Render immediately (before DOMContentLoaded isn't necessary here since
// this script tag sits right where the sidebar should appear in the HTML)
renderSidebar();
