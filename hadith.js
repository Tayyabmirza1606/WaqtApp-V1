/**
 * Hadith — browse by book/chapter, or search directly.
 * Powered by the free, no-key hadith-api by fawazahmed0, via jsDelivr.
 *
 * Chapters are derived from each hadith's own `reference.book` field
 * (present in this API's data) rather than a separately-fetched schema,
 * so this stays robust even without being able to verify every endpoint
 * live. metadata.sections (if present) supplies proper chapter titles;
 * otherwise falls back to "Book N".
 */

const HADITH_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const PAGE_SIZE = 50;
const MAX_SEARCH_RESULTS = 100;
const FETCH_TIMEOUT_MS = 15000;

const COLLECTION_NAMES = {
    bukhari: "Sahih al-Bukhari",
    muslim: "Sahih Muslim",
};

let allHadiths = [];   // full loaded collection: [{ number, english, arabic, book }]
let chapters = [];     // [{ bookNumber, title, first, last, count }]
let filteredHadiths = [];
let renderedCount = 0;
let currentView = "chapters"; // "chapters" | "hadiths"

async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
    }
}

function setStatus(message) {
    document.getElementById("hadith-status").textContent = message;
}

// ---------- Loading & chapter derivation ----------

async function loadCollection(collection) {
    setStatus(`Loading ${COLLECTION_NAMES[collection]}… this may take a moment.`);
    document.getElementById("chapter-list").innerHTML = "";
    document.getElementById("hadith-list").innerHTML = "";
    document.getElementById("load-more-btn").hidden = true;
    document.getElementById("hadith-breadcrumb").hidden = true;
    allHadiths = [];
    chapters = [];
    currentView = "chapters";

    try {
        const [englishRes, arabicRes] = await Promise.all([
            fetchWithTimeout(`${HADITH_BASE}/eng-${collection}.json`),
            fetchWithTimeout(`${HADITH_BASE}/ara-${collection}.json`),
        ]);

        if (!englishRes.ok) throw new Error(`English edition returned ${englishRes.status}`);

        const englishData = await englishRes.json();
        const arabicData = arabicRes.ok ? await arabicRes.json() : null;

        const englishList = englishData.hadiths || [];
        const arabicList = arabicData ? (arabicData.hadiths || []) : [];
        const sectionTitles = (englishData.metadata && englishData.metadata.sections) || {};

        allHadiths = englishList.map((h, i) => ({
            number: h.hadithnumber,
            english: h.text,
            arabic: arabicList[i] ? arabicList[i].text : null,
            book: h.reference && h.reference.book != null ? h.reference.book : null,
        }));

        chapters = deriveChapters(allHadiths, sectionTitles);

        setStatus(`${COLLECTION_NAMES[collection]} — ${chapters.length} chapters, ${allHadiths.length.toLocaleString()} hadiths.`);
        renderChapterList(collection);
    } catch (err) {
        console.error("Failed to load collection:", err);
        setStatus(`Couldn't load ${COLLECTION_NAMES[collection]}. Please check your connection and try again.`);
    }
}

function deriveChapters(hadiths, sectionTitles) {
    // Group consecutive hadiths by their book number, preserving order of first appearance
    const order = [];
    const groups = {};

    hadiths.forEach((h) => {
        const key = h.book != null ? h.book : "unknown";
        if (!groups[key]) {
            groups[key] = [];
            order.push(key);
        }
        groups[key].push(h);
    });

    return order.map((key) => {
        const items = groups[key];
        const title = sectionTitles[key] || (key === "unknown" ? "General" : `Book ${key}`);
        return {
            bookKey: key,
            title,
            first: items[0].number,
            last: items[items.length - 1].number,
            count: items.length,
        };
    });
}

// ---------- Chapter list view ----------

function renderChapterList(collection) {
    currentView = "chapters";
    document.getElementById("hadith-breadcrumb").hidden = true;
    document.getElementById("hadith-list").innerHTML = "";
    document.getElementById("load-more-btn").hidden = true;

    const container = document.getElementById("chapter-list");
    container.innerHTML = chapters.map((ch) => `
        <button class="chapter-card" data-book-key="${ch.bookKey}">
            <span class="chapter-title">${ch.title}</span>
            <span class="chapter-meta">Hadith ${ch.first}–${ch.last} &middot; ${ch.count} hadiths</span>
        </button>
    `).join("");

    container.querySelectorAll(".chapter-card").forEach((card) => {
        card.addEventListener("click", () => openChapter(card.dataset.bookKey, collection));
    });
}

function openChapter(bookKey, collection) {
    currentView = "hadiths";
    const normalizedKey = bookKey === "unknown" ? "unknown" : Number(bookKey);
    const chapter = chapters.find((c) => String(c.bookKey) === String(bookKey));

    filteredHadiths = allHadiths.filter((h) => String(h.book != null ? h.book : "unknown") === String(bookKey));
    renderedCount = 0;

    document.getElementById("chapter-list").innerHTML = "";
    document.getElementById("hadith-list").innerHTML = "";
    document.getElementById("hadith-breadcrumb").hidden = false;
    document.getElementById("hadith-search-input").value = "";
    setStatus(`${chapter ? chapter.title : "Chapter"} — ${filteredHadiths.length} hadiths.`);

    renderNextPage(collection);
}

// ---------- Hadith rendering & pagination ----------

function renderHadithCard(hadith, collection) {
    const hasEnglishText = hadith.english && hadith.english.trim().length > 0;
    const hasArabicText = hadith.arabic && hadith.arabic.trim().length > 0;

    if (!hasEnglishText && !hasArabicText) {
        return `
            <div class="hadith-card hadith-card-empty">
                <p class="hadith-collection-label">${COLLECTION_NAMES[collection]} — Hadith ${hadith.number}</p>
                <p class="hadith-empty-note">No separate text is recorded for this entry in this dataset. In Sahih Muslim, consecutive hadiths sometimes share the same core text but list different chains of narration (isnads) — often only the first in the group carries the full wording. Please check sunnah.com for hadith ${hadith.number} to see the full chain.</p>
            </div>
        `;
    }

    return `
        <div class="hadith-card">
            <p class="hadith-collection-label">${COLLECTION_NAMES[collection]} — Hadith ${hadith.number}</p>
            ${hasArabicText ? `<p class="hadith-arabic">${hadith.arabic}</p>` : ""}
            ${hasEnglishText ? `<p class="hadith-english">${hadith.english}</p>` : ""}
        </div>
    `;
}

function renderNextPage(collection) {
    const list = document.getElementById("hadith-list");
    const nextBatch = filteredHadiths.slice(renderedCount, renderedCount + PAGE_SIZE);

    list.insertAdjacentHTML("beforeend", nextBatch.map((h) => renderHadithCard(h, collection)).join(""));
    renderedCount += nextBatch.length;

    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.hidden = renderedCount >= filteredHadiths.length;
}

// ---------- Search (works across the whole collection, independent of chapter) ----------

function applySearch(query) {
    const collection = document.getElementById("collection-select").value;
    const list = document.getElementById("hadith-list");
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) {
        // Empty search: return to chapter browsing view
        renderChapterList(collection);
        setStatus(`${COLLECTION_NAMES[collection]} — ${chapters.length} chapters, ${allHadiths.length.toLocaleString()} hadiths.`);
        return;
    }

    currentView = "hadiths";
    document.getElementById("chapter-list").innerHTML = "";
    document.getElementById("hadith-breadcrumb").hidden = false;

    const isNumberSearch = /^\d+$/.test(trimmed);
    const matches = allHadiths.filter((h) => {
        if (isNumberSearch) return String(h.number) === trimmed || String(h.number).startsWith(trimmed);
        return h.english.toLowerCase().includes(trimmed);
    });

    filteredHadiths = matches.slice(0, MAX_SEARCH_RESULTS);
    renderedCount = 0;
    list.innerHTML = "";

    if (matches.length === 0) {
        setStatus("No matching hadiths found.");
    } else if (matches.length > MAX_SEARCH_RESULTS) {
        setStatus(`Showing first ${MAX_SEARCH_RESULTS} of ${matches.length.toLocaleString()} matches — refine your search for more specific results.`);
    } else {
        setStatus(`${matches.length.toLocaleString()} matching hadith${matches.length === 1 ? "" : "s"} found.`);
    }

    document.getElementById("load-more-btn").hidden = true;
    renderNextPage(collection);
}

let searchDebounceTimer = null;
function handleSearchInput(e) {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => applySearch(e.target.value), 250);
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
    const collectionSelect = document.getElementById("collection-select");

    collectionSelect.addEventListener("change", () => {
        document.getElementById("hadith-search-input").value = "";
        loadCollection(collectionSelect.value);
    });

    document.getElementById("hadith-search-input").addEventListener("input", handleSearchInput);

    document.getElementById("load-more-btn").addEventListener("click", () => {
        renderNextPage(collectionSelect.value);
    });

    document.getElementById("back-to-chapters-btn").addEventListener("click", () => {
        document.getElementById("hadith-search-input").value = "";
        renderChapterList(collectionSelect.value);
        setStatus(`${COLLECTION_NAMES[collectionSelect.value]} — ${chapters.length} chapters, ${allHadiths.length.toLocaleString()} hadiths.`);
    });

    loadCollection(collectionSelect.value);
});
