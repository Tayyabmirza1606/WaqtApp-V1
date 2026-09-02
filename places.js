/**
 * Renders PLACES (from places-data.js) grouped by category, each with a
 * Google Maps link. Add new places to that data file — this script never
 * needs to change.
 */

function renderPlaceCard(place) {
    return `
        <div class="place-card">
            <div class="place-info">
                <h3 class="place-name">${place.name}</h3>
                <p class="place-location">${place.location}</p>
                <p class="place-description">${place.description}</p>
            </div>
            <a href="${buildMapUrl(place)}" target="_blank" rel="noopener noreferrer" class="place-map-link">View on Map →</a>
        </div>
    `;
}

function renderPlaces() {
    const container = document.getElementById("places-container");
    if (!container) return;

    container.innerHTML = PLACES.map((category) => `
        <h2 class="dua-category-title">${category.category}</h2>
        ${category.items.map(renderPlaceCard).join("")}
    `).join("");
}

document.addEventListener("DOMContentLoaded", renderPlaces);
