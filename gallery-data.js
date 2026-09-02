/**
 * Islamic Gallery Data
 * Embedded images use Wikimedia Commons' Special:FilePath (redirects to the
 * real file), and only ones with a personally-verified, explicit CC license
 * are embedded directly. Landmarks where I could not confirm an exact
 * license from the source snippet link out to the Commons category instead —
 * safer than guessing.
 */

const GALLERY_ITEMS = [
    {
        name: "Masjid al-Haram",
        location: "Makkah, Saudi Arabia",
        description: "The Grand Mosque surrounding the Kaaba, Islam's holiest site and the direction (Qibla) all Muslims face in prayer.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Masjid_al-Haram.JPG",
        attribution: "Wikimedia Commons — licensed under CC BY 3.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Masjid_al-Haram.JPG",
    },
    {
        name: "Masjid an-Nabawi",
        location: "Madinah, Saudi Arabia",
        description: "The Prophet's Mosque, the second holiest site in Islam, built adjacent to the resting place of Prophet Muhammad ﷺ.",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/MasjidNabawi.jpg",
        attribution: "Wikimedia Commons — Public Domain (CC0)",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:MasjidNabawi.jpg",
    },
    {
        name: "Al-Aqsa Mosque",
        location: "Jerusalem",
        description: "The third holiest site in Islam, located within the Al-Aqsa compound, and the location from which the Prophet ﷺ is believed to have undertaken the night journey (Isra and Mi'raj).",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Jerusalem-2013-Temple%20Mount-Al-Aqsa%20Mosque%20(NE%20exposure).jpg",
        attribution: "Wikimedia Commons — licensed under CC BY-SA 4.0 (Featured Picture)",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Jerusalem-2013-Temple_Mount-Al-Aqsa_Mosque_(NE_exposure).jpg",
    },
];

// Landmarks shown as link-outs rather than embedded images — license on the
// specific best photo wasn't confirmed with full certainty, so linking to
// the real Commons category is the honest, safe choice.
const GALLERY_LINKS = [
    { name: "Badshahi Mosque", location: "Lahore, Pakistan", url: "https://commons.wikimedia.org/wiki/Category:Badshahi_Mosque" },
    { name: "Faisal Mosque", location: "Islamabad, Pakistan", url: "https://commons.wikimedia.org/wiki/Category:Faisal_Mosque" },
    { name: "Sheikh Zayed Grand Mosque", location: "Abu Dhabi, UAE", url: "https://commons.wikimedia.org/wiki/Category:Sheikh_Zayed_Grand_Mosque" },
    { name: "Blue Mosque", location: "Istanbul, Turkey", url: "https://commons.wikimedia.org/wiki/Category:Sultan_Ahmed_Mosque" },
];
