/**
 * Renders KNOWLEDGE_TOPICS (from knowledge-data.js) into the page.
 * Add new topics to that data file — this script never needs to change.
 */

function renderKnowledgeItem(item) {
    return `
        <div class="knowledge-card">
            <h3 class="knowledge-item-title">${item.title}</h3>
            <p class="knowledge-item-text">${item.text}</p>
        </div>
    `;
}

function renderKnowledge() {
    const container = document.getElementById("knowledge-container");
    if (!container) return;

    container.innerHTML = KNOWLEDGE_TOPICS.map((section) => `
        <h2 class="dua-category-title">${section.section}</h2>
        ${section.items.map(renderKnowledgeItem).join("")}
    `).join("");
}

document.addEventListener("DOMContentLoaded", renderKnowledge);
