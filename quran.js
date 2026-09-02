/**
 * Al Quran — AlQuran Cloud API (api.alquran.cloud).
 * Tajweed edition + verse-by-verse recitation from the same API. No key required.
 */

const QURAN_API_BASE = "https://api.alquran.cloud/v1";
const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128";
const RECITER_STORAGE_KEY = "waqt_quran_reciter";
const TAJWEED_STORAGE_KEY = "waqt_quran_tajweed";

const RECITERS = [
    { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
    { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
    { id: "ar.husarymujawwad", name: "Al-Husary (Mujawwad)" },
    { id: "ar.abdurrahmaansudais", name: "Abdurrahman As-Sudais" },
    { id: "ar.mahermuaiqly", name: "Maher Al Muaiqly" },
];

const TAJWEED_RULES = {
    h: { className: "ham_wasl", title: "Hamzat ul Wasl" },
    s: { className: "slnt", title: "Silent letter" },
    l: { className: "laam_shamsiyah", title: "Laam Shamsiyyah" },
    n: { className: "madda_normal", title: "Madd (normal)" },
    p: { className: "madda_permissible", title: "Madd (permissible)" },
    m: { className: "madda_necessary", title: "Madd (necessary)" },
    q: { className: "qalaqah", title: "Qalqalah" },
    o: { className: "madda_obligatory", title: "Madd (obligatory)" },
    c: { className: "ikhafa_shafawi", title: "Ikhfa shafawi" },
    f: { className: "ikhafa", title: "Ikhfa" },
    w: { className: "idgham_shafawi", title: "Idgham shafawi" },
    i: { className: "iqlab", title: "Iqlab" },
    a: { className: "idgham_ghunnah", title: "Idgham with ghunnah" },
    u: { className: "idgham_wo_ghunnah", title: "Idgham without ghunnah" },
    d: { className: "idgham_mutajanisayn", title: "Idgham mutajanisayn" },
    b: { className: "idgham_mutaqaribayn", title: "Idgham mutaqaribayn" },
    g: { className: "ghunnah", title: "Ghunnah" },
};

let loadedSurah = null;
let playIndex = -1;
let playThroughSurah = false;

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function parseTajweed(text) {
    const re = /\[([a-z])(?::\d+)?\[(.*?)\]/g;
    let html = "";
    let last = 0;
    let match;

    while ((match = re.exec(text))) {
        html += escapeHtml(text.slice(last, match.index));
        const rule = TAJWEED_RULES[match[1]];
        const inner = escapeHtml(match[2]);
        html += rule
            ? `<span class="tajweed ${rule.className}" title="${rule.title}">${inner}</span>`
            : inner;
        last = re.lastIndex;
    }

    html += escapeHtml(text.slice(last));
    return html;
}

function stripTajweedMarkup(text) {
    return text.replace(/\[([a-z])(?::\d+)?\[(.*?)\]/g, "$2");
}

function getSelectedReciter() {
    return document.getElementById("reciter-select").value || RECITERS[0].id;
}

function isTajweedEnabled() {
    return document.getElementById("tajweed-toggle").checked;
}

function audioUrl(ayahNumber) {
    return `${AUDIO_CDN}/${getSelectedReciter()}/${ayahNumber}.mp3`;
}

function populateReciters() {
    const select = document.getElementById("reciter-select");
    const saved = localStorage.getItem(RECITER_STORAGE_KEY) || RECITERS[0].id;
    select.innerHTML = RECITERS.map((reciter) =>
        `<option value="${reciter.id}"${reciter.id === saved ? " selected" : ""}>${reciter.name}</option>`
    ).join("");
}

async function loadSurahList() {
    const select = document.getElementById("surah-select");
    try {
        const response = await fetch(`${QURAN_API_BASE}/surah`);
        const data = await response.json();
        if (data.code !== 200) throw new Error("Unexpected API response");

        select.innerHTML = data.data.map((surah) =>
            `<option value="${surah.number}">${surah.number}. ${surah.englishName} (${surah.englishNameTranslation})</option>`
        ).join("");
        select.value = "1";
        await loadSurah(1);
    } catch (err) {
        console.error("Failed to load surah list:", err);
        select.innerHTML = `<option value="">Couldn't load surah list</option>`;
    }
}

async function loadSurah(surahNumber, scrollToFirstAyah = false) {
    stopAudio();
    const container = document.getElementById("surah-content");
    container.innerHTML = `<p class="converter-loading">Loading surah…</p>`;

    try {
        const response = await fetch(
            `${QURAN_API_BASE}/surah/${surahNumber}/editions/quran-tajweed,en.sahih,ur.jalandhry`
        );
        const data = await response.json();
        if (data.code !== 200 || !Array.isArray(data.data) || data.data.length < 3) {
            throw new Error("Unexpected API response");
        }

        loadedSurah = {
            tajweed: data.data[0],
            english: data.data[1],
            urdu: data.data[2],
        };
        renderSurah(scrollToFirstAyah);
    } catch (err) {
        console.error("Failed to load surah:", err);
        loadedSurah = null;
        container.innerHTML = `<p class="converter-error">Couldn't load this surah. Please check your connection and try again.</p>`;
    }
}

function renderSurah(scrollToFirstAyah = false) {
    if (!loadedSurah) return;

    const { tajweed, english } = loadedSurah;
    const container = document.getElementById("surah-content");
    const showTajweed = isTajweedEnabled();
    const translation = getWaqtLanguage() === "urdu" ? loadedSurah.urdu : english;

    const header = `
        <div class="surah-header">
            <p class="surah-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            <p class="surah-bismillah-translation">${getWaqtLanguage() === "urdu" ? "اللہ کے نام سے جو نہایت مہربان، ہمیشہ رحم فرمانے والا ہے۔" : "In the name of Allah, the Most Gracious, the Most Merciful."}</p>
            <h2 class="surah-arabic-name">${escapeHtml(tajweed.name)}</h2>
            <p class="surah-english-name">${escapeHtml(tajweed.englishName)} — ${escapeHtml(tajweed.englishNameTranslation)}</p>
            <p class="surah-meta">${escapeHtml(tajweed.revelationType)} &middot; ${tajweed.numberOfAyahs} verses</p>
            <div class="surah-audio-actions">
                <button type="button" id="play-surah-btn" class="btn-primary">Play surah</button>
                <button type="button" id="stop-audio-btn" class="btn-secondary surah-stop-btn">Stop</button>
            </div>
        </div>
    `;

    const ayahs = tajweed.ayahs.map((ayah, i) => {
        const arabicHtml = showTajweed
            ? parseTajweed(ayah.text)
            : escapeHtml(stripTajweedMarkup(ayah.text));
        const ayahTranslation = translation.ayahs[i] ? translation.ayahs[i].text : "";

        return `
            <div class="ayah-block" data-ayah-index="${i}" data-ayah-number="${ayah.number}">
                <div class="ayah-toolbar">
                    <button type="button" class="ayah-play-btn" data-play-index="${i}" aria-label="Play ayah ${ayah.numberInSurah}">▶</button>
                    <span class="ayah-toolbar-label">Ayah ${ayah.numberInSurah}</span>
                </div>
                <p class="ayah-arabic">${arabicHtml} <span class="ayah-number">﴿${ayah.numberInSurah}﴾</span></p>
                <p class="ayah-translation">${escapeHtml(ayahTranslation)}</p>
            </div>
        `;
    }).join("");

    container.innerHTML = header + ayahs;

    if (scrollToFirstAyah) {
        container.querySelector(".ayah-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function getAudioEl() {
    return document.getElementById("ayah-audio");
}

function stopAudio() {
    const audio = getAudioEl();
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    playIndex = -1;
    playThroughSurah = false;
    clearPlayingState();
}

function clearPlayingState() {
    document.querySelectorAll(".ayah-block.is-playing").forEach((el) => {
        el.classList.remove("is-playing");
    });
    document.querySelectorAll(".ayah-play-btn.is-active").forEach((btn) => {
        btn.classList.remove("is-active");
        btn.textContent = "▶";
        btn.setAttribute("aria-label", btn.getAttribute("aria-label").replace("Pause", "Play"));
    });
}

function setPlayingState(index) {
    clearPlayingState();
    const block = document.querySelector(`.ayah-block[data-ayah-index="${index}"]`);
    const btn = document.querySelector(`.ayah-play-btn[data-play-index="${index}"]`);
    if (block) {
        block.classList.add("is-playing");
        block.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    if (btn) {
        btn.classList.add("is-active");
        btn.textContent = "❚❚";
        btn.setAttribute("aria-label", `Pause ayah ${index + 1}`);
    }
}

function playAyah(index, continueAfter) {
    if (!loadedSurah) return;
    const ayah = loadedSurah.tajweed.ayahs[index];
    if (!ayah) return;

    const audio = getAudioEl();
    playThroughSurah = Boolean(continueAfter);
    playIndex = index;
    audio.src = audioUrl(ayah.number);
    setPlayingState(index);
    audio.play().catch((err) => {
        console.error("Couldn't play ayah audio:", err);
        stopAudio();
    });
}

function toggleAyah(index) {
    const audio = getAudioEl();
    if (playIndex === index && !audio.paused) {
        audio.pause();
        clearPlayingState();
        return;
    }
    playAyah(index, false);
}

document.addEventListener("DOMContentLoaded", () => {
    populateReciters();
    loadSurahList();

    const tajweedToggle = document.getElementById("tajweed-toggle");
    const savedTajweed = localStorage.getItem(TAJWEED_STORAGE_KEY);
    if (savedTajweed === "off") tajweedToggle.checked = false;

    document.getElementById("load-surah-btn").addEventListener("click", () => {
        const surahNumber = document.getElementById("surah-select").value;
        if (surahNumber) loadSurah(surahNumber, true);
    });

    document.getElementById("reciter-select").addEventListener("change", () => {
        localStorage.setItem(RECITER_STORAGE_KEY, getSelectedReciter());
        if (playIndex >= 0 && !getAudioEl().paused) {
            playAyah(playIndex, playThroughSurah);
        }
    });

    tajweedToggle.addEventListener("change", () => {
        localStorage.setItem(TAJWEED_STORAGE_KEY, tajweedToggle.checked ? "on" : "off");
        const keepIndex = playIndex;
        const keepThrough = playThroughSurah;
        const wasPlaying = keepIndex >= 0 && !getAudioEl().paused;
        renderSurah();
        if (wasPlaying) playAyah(keepIndex, keepThrough);
        else if (keepIndex >= 0) setPlayingState(keepIndex);
    });

    document.addEventListener("waqt-language-change", () => {
        if (loadedSurah) renderSurah();
    });

    document.getElementById("tajweed-legend-btn").addEventListener("click", () => {
        const legend = document.getElementById("tajweed-legend");
        legend.hidden = !legend.hidden;
    });

    document.getElementById("surah-content").addEventListener("click", (event) => {
        const playBtn = event.target.closest("[data-play-index]");
        if (playBtn) {
            toggleAyah(Number(playBtn.dataset.playIndex));
            return;
        }
        if (event.target.id === "play-surah-btn") {
            playAyah(0, true);
            return;
        }
        if (event.target.id === "stop-audio-btn") {
            stopAudio();
        }
    });

    getAudioEl().addEventListener("ended", () => {
        if (playThroughSurah && loadedSurah && playIndex + 1 < loadedSurah.tajweed.ayahs.length) {
            playAyah(playIndex + 1, true);
            return;
        }
        stopAudio();
    });
});
