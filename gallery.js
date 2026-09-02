/**
 * Renders GALLERY_ITEMS (embedded, license-confirmed photos) and
 * GALLERY_LINKS (link-out cards) from gallery-data.js.
 */

function renderGalleryItem(item) {
    return `
        <div class="gallery-card">
            <img src="${item.image}" alt="${item.name}" loading="lazy" class="gallery-image">
            <div class="gallery-info">
                <h3 class="gallery-name">${item.name}</h3>
                <p class="gallery-location">${item.location}</p>
                <p class="gallery-description">${item.description}</p>
                <a href="${item.sourceUrl}" target="_blank" rel="noopener noreferrer" class="gallery-attribution">${item.attribution}</a>
            </div>
        </div>
    `;
}

function renderGalleryLink(link) {
    return `
        <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="gallery-link-card">
            <h3 class="gallery-name">${link.name}</h3>
            <p class="gallery-location">${link.location}</p>
            <span class="gallery-view-link">View photos on Wikimedia Commons →</span>
        </a>
    `;
}

function renderGallery() {
    const itemsContainer = document.getElementById("gallery-items");
    const linksContainer = document.getElementById("gallery-links");

    if (itemsContainer) {
        itemsContainer.innerHTML = GALLERY_ITEMS.map(renderGalleryItem).join("");
    }
    if (linksContainer) {
        linksContainer.innerHTML = GALLERY_LINKS.map(renderGalleryLink).join("");
    }
}

document.addEventListener("DOMContentLoaded", renderGallery);
