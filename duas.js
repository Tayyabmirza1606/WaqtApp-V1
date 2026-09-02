/**
 * Renders the DUAS array (from duas-data.js) grouped by category, with a
 * quick-nav bar of category pills at the top so the page is browsable
 * category-wise, similar to IslamicFinder's Duas page structure.
 *
 * Adding a new dua only requires editing duas-data.js — this file
 * never needs to change when new duas are added.
 */

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderDuaCard(dua, index) {
    const translation = getWaqtLanguage() === "urdu"
        ? DUA_URDU_TRANSLATIONS[index]
        : dua.translation;

    return `
        <article class="dua-card">
            <p class="dua-arabic">${dua.arabic}</p>
            <p class="dua-transliteration">${dua.transliteration}</p>
            <p class="dua-translation ${getWaqtLanguage() === "urdu" ? "translation-urdu" : ""}">${translation || dua.translation}</p>
            <p class="dua-reference">${dua.reference}</p>
        </article>
    `;
}

function groupByCategory() {
    const categories = [];
    const grouped = {};

    DUAS.forEach((dua) => {
        if (!grouped[dua.category]) {
            grouped[dua.category] = [];
            categories.push(dua.category);
        }

        grouped[dua.category].push(dua);
    });

    return { categories, grouped };
}

function renderCategoryNav(categories) {
    const nav = document.getElementById("dua-category-nav");

    if (!nav) return;

    nav.innerHTML = categories.map((category) => {
        const slug = slugify(category);

        return `
            <a href="#${slug}" class="dua-category-pill">
                ${category}
            </a>
        `;
    }).join("");
}

function renderDuas() {
    const container = document.getElementById("duas-container");

    if (!container) return;

    const { categories, grouped } = groupByCategory();

    renderCategoryNav(categories);

    container.innerHTML = categories.map((category) => {
        const slug = slugify(category);

        return `
            <h2 class="dua-category-title" id="${slug}">
                ${category}
            </h2>

            ${grouped[category].map((dua) => renderDuaCard(dua, DUAS.indexOf(dua))).join("")}
        `;
    }).join("");
}

document.addEventListener("DOMContentLoaded", renderDuas);
document.addEventListener("waqt-language-change", renderDuas);