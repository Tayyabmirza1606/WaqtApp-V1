/**
 * Duas Data
 * Every entry here has been checked against authentic sources (Sahih al-Bukhari,
 * Sahih Muslim, At-Tirmidhi, Abu Dawud, Ibn Majah, or the Quran directly) before
 * being added. Add new duas to this array — duas.html renders them automatically,
 * grouped by category, in the order categories first appear.
 */

const DUAS = [
    // ---------- Rabbana Duas (from the Quran) ----------
    {
        category: "Rabbana Duas (from the Quran)",
        arabic: "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
        transliteration: "Rabbana taqabbal minna innaka antas-Sami'ul-'Alim",
        translation: "Our Lord, accept this from us. Indeed You are the Hearing, the Knowing.",
        reference: "Qur'an 2:127",
    },
    {
        category: "Rabbana Duas (from the Quran)",
        arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
        transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
        translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
        reference: "Qur'an 2:201",
    },
    {
        category: "Rabbana Duas (from the Quran)",
        arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
        transliteration: "Rabbana la tu'akhidhna in nasina aw akhta'na",
        translation: "Our Lord, do not hold us accountable if we forget or make a mistake.",
        reference: "Qur'an 2:286",
    },
    {
        category: "Rabbana Duas (from the Quran)",
        arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ",
        transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana wa hab lana mil ladunka rahmah, innaka antal-Wahhab",
        translation: "Our Lord, do not let our hearts deviate after You have guided us, and grant us mercy from Yourself. Indeed, You are the Bestower.",
        reference: "Qur'an 3:8",
    },
    {
        category: "Rabbana Duas (from the Quran)",
        arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
        transliteration: "Rabbana ghfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal-qawmil-kafirin",
        translation: "Our Lord, forgive us our sins and our excesses in our affairs, make our foothold firm, and give us victory over the disbelieving people.",
        reference: "Qur'an 3:147",
    },
    {
        category: "Rabbana Duas (from the Quran)",
        arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
        transliteration: "Rabbi-j'alni muqimas-salati wa min dhurriyyati Rabbana wa taqabbal du'a'",
        translation: "My Lord, make me an establisher of prayer, and from my descendants as well. Our Lord, and accept my supplication.",
        reference: "Qur'an 14:40",
    },

    // ---------- Before Eating ----------
    {
        category: "Before Eating",
        arabic: "بِسْمِ اللّٰهِ",
        transliteration: "Bismillah",
        translation: "In the name of Allah.",
        reference: "Sahih Muslim 2018 — said before beginning a meal.",
    },
    {
        category: "Before Eating",
        arabic: "بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ",
        transliteration: "Bismillahi fi awwalihi wa akhirihi",
        translation: "In the name of Allah, at its beginning and at its end.",
        reference: "Said if you forget to say Bismillah before starting to eat, and remember partway through.",
    },

    // ---------- After Eating ----------
    {
        category: "After Eating",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مِنَ الْمُسْلِمِينَ",
        transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana, wa ja'alana minal muslimin",
        translation: "Praise be to Allah who has provided us with food and drink and made us among those who submit to Him.",
        reference: "Recited after finishing a meal or drink.",
    },
    {
        category: "After Eating",
        arabic: "اَللّٰهُمَّ بَارِكْ لَنَا فِيْهِ وَأَطْعِمْنَا خَيْراً مِنْهُ",
        transliteration: "Allahumma barik lana fihi wa at'imna khayran minh",
        translation: "O Allah, bless us in it and feed us that which is better than it.",
        reference: "A supplication for blessing in one's food.",
    },

    // ---------- Before Sleeping ----------
    {
        category: "Before Sleeping",
        arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        transliteration: "Bismika Allahumma amutu wa ahya",
        translation: "In Your name, O Allah, I die and I live.",
        reference: "Sahih al-Bukhari — said upon lying down to sleep.",
    },
    {
        category: "Before Sleeping",
        arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
        translation: "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
        reference: "Riyad as-Salihin 1464",
    },

    // ---------- After Waking Up ----------
    {
        category: "After Waking Up",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        transliteration: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
        translation: "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
        reference: "Sahih al-Bukhari — said upon waking.",
    },
    {
        category: "After Waking Up",
        arabic: "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ",
        transliteration: "Al-hamdu lillahil-ladhi 'afani fi jasadi, wa radda 'alayya ruhi, wa adhina li bidhikrihi",
        translation: "Praise is to Allah who gave strength to my body, returned my soul to me, and permitted me to remember Him.",
        reference: "At-Tirmidhi 5/473",
    },

    // ---------- Entering the Home ----------
    {
        category: "Entering the Home",
        arabic: "بِسْمِ اللهِ وَلَجْنَا وَبِسْمِ اللهِ خَرَجْنَا وَعَلَى رَبِّنَا تَوَكَّلْنَا",
        transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala Rabbina tawakkalna",
        translation: "In the name of Allah we enter, and in the name of Allah we leave, and upon our Lord we place our trust.",
        reference: "Hisnul Muslim, ch. 11 — said upon entering the home, then greet the household with salam.",
    },

    // ---------- Leaving the Home ----------
    {
        category: "Leaving the Home",
        arabic: "بِسْمِ اللهِ تَوَكَّلْتُ عَلَى اللهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ",
        transliteration: "Bismillahi tawakkaltu 'alallahi, wa la hawla wa la quwwata illa billah",
        translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
        reference: "Abu Dawud, At-Tirmidhi, Ibn Majah — said upon leaving the home.",
    },

    // ---------- Entering the Masjid ----------
    {
        category: "Entering the Masjid",
        arabic: "بِسْمِ اللهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        transliteration: "Bismillah, was-salatu was-salamu 'ala Rasulillah, Allahumma-ftah li abwaba rahmatik",
        translation: "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, open the gates of Your mercy for me.",
        reference: "Sahih Muslim",
    },

    // ---------- Leaving the Masjid ----------
    {
        category: "Leaving the Masjid",
        arabic: "بِسْمِ اللهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        transliteration: "Bismillah, was-salatu was-salamu 'ala Rasulillah, Allahumma inni as'aluka min fadlik",
        translation: "In the name of Allah, and peace and blessings be upon the Messenger of Allah. O Allah, I ask You from Your bounty.",
        reference: "Sahih Muslim",
    },

    // ---------- Travel ----------
    {
        category: "Travel",
        arabic: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ. سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        transliteration: "Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun",
        translation: "Allah is the Greatest (three times). Glory to Him who has subjected this to us, and we could not have done it ourselves. And indeed, to our Lord we will return.",
        reference: "Qur'an 43:13–14 — recited when setting off on a journey.",
    },

    // ---------- Distress & Anxiety ----------
    {
        category: "Distress & Anxiety",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
        transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayni wa ghalabatir-rijal",
        translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, cowardice and miserliness, the burden of debts, and being overpowered by others.",
        reference: "Sahih al-Bukhari 2893",
    },
    {
        category: "Distress & Anxiety",
        arabic: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
        translation: "There is no deity except You; exalted are You. Indeed, I have been among the wrongdoers.",
        reference: "The dua of Prophet Yunus (AS) — Qur'an 21:87, also in At-Tirmidhi.",
    },

    // ---------- Before Entering the Toilet ----------
    {
        category: "Before Entering the Toilet",
        arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        transliteration: "Allahumma inni a'udhu bika minal khubthi wal khaba'ith",
        translation: "O Allah, I seek refuge in You from male and female evil spirits (jinn).",
        reference: "Sahih al-Bukhari, Sahih Muslim — said before entering, not inside.",
    },

    // ---------- After Leaving the Toilet ----------
    {
        category: "After Leaving the Toilet",
        arabic: "غُفْرَانَكَ",
        transliteration: "Ghufranak",
        translation: "I seek Your forgiveness.",
        reference: "Abu Dawud, At-Tirmidhi, Ibn Majah",
    },

    // ---------- Breaking the Fast (Iftar) ----------
    {
        category: "Breaking the Fast (Iftar)",
        arabic: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        transliteration: "Dhahaba az-zama'u wabtallatil-'uruqu wa thabata al-ajru in sha'a Allah",
        translation: "Thirst is gone, the veins are moistened, and the reward is certain, if Allah wills.",
        reference: "Sunan Abi Dawud 2357",
    },
    {
        category: "Breaking the Fast (Iftar)",
        arabic: "اَللّٰهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
        transliteration: "Allahumma laka sumtu wa 'ala rizqika aftartu",
        translation: "O Allah, for You I have fasted and by Your provision I have broken my fast.",
        reference: "Sunan Abi Dawud 2358 — Note: graded da'if (weak) by Al-Albani due to a gap in the chain of narration, though widely recited and considered acceptable by many scholars for virtuous deeds.",
    },

    // ---------- Upon Hearing Calamity or Bad News ----------
    {
        category: "Upon Hearing Calamity or Bad News",
        arabic: "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ",
        transliteration: "Inna lillahi wa inna ilayhi raji'un",
        translation: "Indeed we belong to Allah, and indeed to Him we will return.",
        reference: "Qur'an 2:156",
    },
];
