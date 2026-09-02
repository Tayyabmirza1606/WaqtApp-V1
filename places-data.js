/**
 * Islamic Places Data
 * A directory of significant Islamic sites — holy sites, historical mosques,
 * and historically significant cities. Map links use Google's plain search
 * URL pattern (no API key needed, always accurate since it's just a query).
 */

const PLACES = [
    {
        category: "Holy Sites",
        items: [
            { name: "Masjid al-Haram", location: "Makkah, Saudi Arabia", description: "Islam's holiest site, surrounding the Kaaba — the direction all Muslims face in prayer, and the destination of Hajj and Umrah." },
            { name: "Masjid an-Nabawi", location: "Madinah, Saudi Arabia", description: "The Prophet's Mosque, the second holiest site in Islam, built adjacent to the resting place of Prophet Muhammad ﷺ." },
            { name: "Al-Aqsa Mosque", location: "Jerusalem", description: "The third holiest site in Islam, and the location associated with the Prophet's ﷺ night journey (Isra and Mi'raj)." },
        ],
    },
    {
        category: "Historical Mosques",
        items: [
            { name: "Badshahi Mosque", location: "Lahore, Pakistan", description: "Built by Mughal Emperor Aurangzeb in 1673, one of the largest mosques from the Mughal era and a landmark of Lahore." },
            { name: "Faisal Mosque", location: "Islamabad, Pakistan", description: "The national mosque of Pakistan, notable for its modern, tent-inspired architectural design without a traditional dome." },
            { name: "Sheikh Zayed Grand Mosque", location: "Abu Dhabi, UAE", description: "One of the largest mosques in the world, known for its extensive use of white marble and intricate inlay work." },
            { name: "Sultan Ahmed Mosque (Blue Mosque)", location: "Istanbul, Turkey", description: "An early 17th-century Ottoman mosque famous for the blue Iznik tiles lining its interior walls." },
            { name: "Great Mosque of Cordoba", location: "Córdoba, Spain", description: "A masterpiece of Moorish architecture built in the 8th century, reflecting Islam's historical presence in Al-Andalus." },
        ],
    },
];

function buildMapUrl(place) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ", " + place.location)}`;
}
