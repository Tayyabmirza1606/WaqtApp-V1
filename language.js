const WAQT_LANGUAGE_KEY = "waqt_language";
const WAQT_LANGUAGES = {
    urdu: "Urdu",
    english: "English",
};

function getWaqtLanguage() {
    return localStorage.getItem(WAQT_LANGUAGE_KEY) || "urdu";
}

function setupLanguagePicker() {
    const select = document.getElementById("language-select");
    if (!select) return;

    select.value = getWaqtLanguage();
    select.addEventListener("change", () => {
        localStorage.setItem(WAQT_LANGUAGE_KEY, select.value);
        document.dispatchEvent(new CustomEvent("waqt-language-change", { detail: select.value }));
    });
}

document.addEventListener("DOMContentLoaded", setupLanguagePicker);
