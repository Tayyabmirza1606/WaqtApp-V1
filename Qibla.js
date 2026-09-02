/**
 * Qibla Direction
 * Calculates the great-circle bearing from the user's location to the Kaaba,
 * and renders it as a rotated needle on a compass ring.
 *
 * Shares the same "waqt_location" localStorage key as the Prayer Times page,
 * so a location set on either page is reused on the other.
 */

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const EARTH_RADIUS_KM = 6371;

const LOCATION_STORAGE_KEY = "waqt_location"; // shared with script.js (Prayer Times page)

function toRadians(deg) { return (deg * Math.PI) / 180; }
function toDegrees(rad) { return (rad * 180) / Math.PI; }

function calculateBearing(lat1, lng1, lat2, lng2) {
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δλ = toRadians(lng2 - lng1);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    return (toDegrees(θ) + 360) % 360;
}

function calculateDistanceKm(lat1, lng1, lat2, lng2) {
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lng2 - lng1);

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
}

function renderQibla(lat, lng, label) {
    const bearing = calculateBearing(lat, lng, KAABA_LAT, KAABA_LNG);
    const distanceKm = calculateDistanceKm(lat, lng, KAABA_LAT, KAABA_LNG);

    document.getElementById("qibla-needle").style.transform = `rotate(${bearing}deg)`;
    document.getElementById("qibla-bearing").textContent = `${Math.round(bearing)}° from North`;
    document.getElementById("qibla-distance").textContent =
        `Approx. ${Math.round(distanceKm).toLocaleString()} km to the Kaaba`;
    document.getElementById("qibla-location-text").textContent = label;
}

// ---------- Location handling ----------

function saveLocation(location) {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
}

function loadSavedLocation() {
    try {
        const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function detectLocation() {
    document.getElementById("qibla-location-text").textContent = "Detecting your location…";

    if (!navigator.geolocation) {
        showManualForm("Geolocation isn't supported on this browser — please enter your city.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const location = {
                type: "coords",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                label: "Your current location",
            };
            saveLocation(location);
            renderQibla(location.latitude, location.longitude, location.label);
        },
        () => {
            showManualForm("Couldn't access your location — please enter your city instead.");
        }
    );
}

function showManualForm(message) {
    document.getElementById("qibla-location-text").textContent = message || "Enter your city below.";
    document.getElementById("qibla-manual-form").hidden = false;
}

// Nominatim (OpenStreetMap) — free, no API key, used here for city -> coordinates lookup
async function geocodeCity(city, country) {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&format=json&limit=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Geocoding failed: ${response.status}`);
    const results = await response.json();
    if (!results.length) throw new Error("Location not found");
    return { latitude: parseFloat(results[0].lat), longitude: parseFloat(results[0].lon) };
}

async function handleManualSubmit() {
    const city = document.getElementById("qibla-city-input").value.trim();
    const country = document.getElementById("qibla-country-input").value.trim();

    if (!city || !country) {
        alert("Please enter both a city and a country.");
        return;
    }

    document.getElementById("qibla-location-text").textContent = "Looking up location…";

    try {
        const coords = await geocodeCity(city, country);
        const location = {
            type: "coords",
            latitude: coords.latitude,
            longitude: coords.longitude,
            label: `${city}, ${country}`,
        };
        saveLocation(location);
        document.getElementById("qibla-manual-form").hidden = true;
        renderQibla(location.latitude, location.longitude, location.label);
    } catch (err) {
        console.error("Geocoding error:", err);
        document.getElementById("qibla-location-text").textContent =
            "Couldn't find that city. Please check the spelling and try again.";
    }
}

// ---------- Init ----------

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("qibla-detect-btn").addEventListener("click", detectLocation);
    document.getElementById("qibla-manual-toggle-btn").addEventListener("click", () => {
        document.getElementById("qibla-manual-form").hidden = false;
    });
    document.getElementById("qibla-manual-submit-btn").addEventListener("click", handleManualSubmit);

    const saved = loadSavedLocation();
    if (saved && saved.type === "coords") {
        renderQibla(saved.latitude, saved.longitude, saved.label);
    } else if (saved && saved.type === "city") {
        // Previously saved as city-only (from Prayer Times page) — geocode it now to get real coordinates
        geocodeCity(saved.city, saved.country)
            .then((coords) => renderQibla(coords.latitude, coords.longitude, saved.label))
            .catch(() => detectLocation());
    } else {
        detectLocation();
    }
});
