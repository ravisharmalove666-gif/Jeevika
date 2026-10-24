const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'client', 'src', 'locales');

const translations = {
  en: {
    viewOnBody: "View on 3D Body",
    bodyModelTitle: "Ayurvedic 3D Physiological Map",
    dragToRotate: "Drag to rotate • Scroll to zoom",
    resetView: "Reset View",
    bodyModelDisclaimer: "Illustrative reference only, not a medical diagnosis.",
    highlightedSystemLabel: "Highlighted System"
  },
  hi: {
    viewOnBody: "3D शरीर पर देखें",
    bodyModelTitle: "आयुर्वेदिक 3D शरीर प्रणाली",
    dragToRotate: "घुमाने के लिए ड्रैग करें • ज़ूम करने के लिए स्क्रॉल करें",
    resetView: "व्यू रीसेट करें",
    bodyModelDisclaimer: "केवल सांकेतिक संदर्भ हेतु, चिकित्सीय निदान नहीं।",
    highlightedSystemLabel: "चिह्नित शरीर प्रणाली"
  },
  bn: {
    viewOnBody: "3D শরীরে দেখুন",
    bodyModelTitle: "আয়ুর্বেদিক 3D শারীরবৃত্তীয় মানচিত্র",
    dragToRotate: "ঘোরাতে টেনে আনুন • জুম করতে স্ক্রোল করুন",
    resetView: "ভিউ রিসেট করুন",
    bodyModelDisclaimer: "শুধুমাত্র দৃষ্টান্তমূলক রেফারেন্সের জন্য, কোনো চিকিৎসা নির্ণয় নয়।",
    highlightedSystemLabel: "চিহ্নিত শারীরিক ব্যবস্থা"
  },
  mr: {
    viewOnBody: "3D शरीरावर पहा",
    bodyModelTitle: "आयुर्वेदिक 3D शरीर प्रणाली",
    dragToRotate: "फिरवण्यासाठी ड्रॅग करा • झूम करण्यासाठी स्क्रोल करा",
    resetView: "दृश्य पूर्ववत करा",
    bodyModelDisclaimer: "केवळ संदर्भासाठी, वैद्यकीय निदान नाही.",
    highlightedSystemLabel: "हायलाइट केलेली शरीर प्रणाली"
  },
  te: {
    viewOnBody: "3D శరీరంలో చూడండి",
    bodyModelTitle: "ఆయుర్వేద 3D శరీర వ్యవస్థ",
    dragToRotate: "తిప్పడానికి లాగండి • జూమ్ చేయడానికి స్క్రోల్ చేయండి",
    resetView: "వ్యూ రీసెట్ చేయండి",
    bodyModelDisclaimer: "కేవలం అవగాహన కొరకు మాత్రమే, ఇది వైద్య నిర్ధారణ కాదు.",
    highlightedSystemLabel: "హైలైట్ చేసిన శరీర వ్యవస్థ"
  },
  ta: {
    viewOnBody: "3D உடலில் காண்க",
    bodyModelTitle: "ஆயுர்வேத 3D உடலியல் வரைபடம்",
    dragToRotate: "சுழற்ற இழுக்கவும் • பெரிதாக்க உருட்டவும்",
    resetView: "பார்வையை மீட்டமை",
    bodyModelDisclaimer: "விளக்கக் குறிப்புக்கு மட்டுமே, மருத்துவ நோயறிதல் அல்ல.",
    highlightedSystemLabel: "முன்னிலைப்படுத்தப்பட்ட அமைப்பு"
  },
  gu: {
    viewOnBody: "3D શરીર પર જુઓ",
    bodyModelTitle: "આયુર્વેદિક 3D શરીર પ્રણાલી",
    dragToRotate: "ફેરવવા માટે ખેંચો • ઝૂમ કરવા માટે સ્ક્રોલ કરો",
    resetView: "વ્યૂ રીસેટ કરો",
    bodyModelDisclaimer: "માત્ર સંદર્ભ માટે, કોઈ તબીબી નિદાન નથી.",
    highlightedSystemLabel: "હાઇલાઇટ કરેલ શરીર પ્રણાલી"
  },
  ur: {
    viewOnBody: "3D جسم پر دیکھیں",
    bodyModelTitle: "آیورویدک 3D جسمانی نقشہ",
    dragToRotate: "گھمانے کے لیے ڈریگ کریں • زوم کے لیے اسکرول کریں",
    resetView: "ویو ری سیٹ کریں",
    bodyModelDisclaimer: "صرف وضاحتی حوالہ کے لیے، طبی تشخیص نہیں۔",
    highlightedSystemLabel: "نمایاں کردہ جسمانی نظام"
  },
  kn: {
    viewOnBody: "3D ದೇಹದಲ್ಲಿ ವೀಕ್ಷಿಸಿ",
    bodyModelTitle: "ಆಯುರ್ವೇದ 3D ಶಾರೀರಿಕ ನಕ್ಷೆ",
    dragToRotate: "ತಿರುಗಿಸಲು ಎಳೆಯಿರಿ • ಜೂಮ್ ಮಾಡಲು ಸ್ಕ್ರಾಲ್ ಮಾಡಿ",
    resetView: "ವೀಕ್ಷಣೆ ಮರುಹೊಂದಿಸಿ",
    bodyModelDisclaimer: "ಕೇವಲ ಉಲ್ಲೇಖಕ್ಕಾಗಿ ಮಾತ್ರ, ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ.",
    highlightedSystemLabel: "ಹೈಲೈಟ್ ಮಾಡಲಾದ ವ್ಯವಸ್ಥೆ"
  },
  or: {
    viewOnBody: "3D ଶରୀରରେ ଦେଖନ୍ତୁ",
    bodyModelTitle: "ଆୟୁର୍ବେଦିକ 3D ଶରୀର ପ୍ରଣାଳୀ",
    dragToRotate: "ଘୁରାଇବାକୁ ଟାଣନ୍ତୁ • ଜୁମ୍ ପାଇଁ ସ୍କ୍ରୋଲ କରନ୍ତୁ",
    resetView: "ଦୃଶ୍ୟ ପୁନଃସ୍ଥାପନ କରନ୍ତୁ",
    bodyModelDisclaimer: "କେବଳ ଦୃଷ୍ଟାନ୍ତମୂଳକ ସନ୍ଦର୍ଭ ପାଇଁ, ଚିକିତ୍ସା ନିଦାନ ନୁହେଁ।",
    highlightedSystemLabel: "ଚିହ୍ନିତ ଶରୀର ପ୍ରଣାଳୀ"
  },
  ml: {
    viewOnBody: "3D ശരീരത്തിൽ കാണുക",
    bodyModelTitle: "ആയുർവേദ 3D ശരീര മാപ്പ്",
    dragToRotate: "തിരിക്കാൻ വലിക്കുക • സൂം ചെയ്യാൻ സ്ക്രോൾ ചെയ്യുക",
    resetView: "കാഴ്ച പുനഃക്രമീകരിക്കുക",
    bodyModelDisclaimer: "വിശദീകരണത്തിനായി മാത്രം, വൈദ്യശാസ്ത്രപരമായ രോഗനിർണയമല്ല.",
    highlightedSystemLabel: "തിരഞ്ഞെടുത്ത ശരീര വ്യവസ്ഥ"
  },
  pa: {
    viewOnBody: "3D ਸਰੀਰ 'ਤੇ ਦੇਖੋ",
    bodyModelTitle: "ਆਯੁਰਵੈਦਿਕ 3D ਸਰੀਰ ਪ੍ਰਣਾਲੀ",
    dragToRotate: "ਘੁਮਾਉਣ ਲਈ ਖਿੱਚੋ • ਜ਼ੂਮ ਲਈ ਸਕ੍ਰੌਲ ਕਰੋ",
    resetView: "ਵਿਊ ਰੀਸੈਟ ਕਰੋ",
    bodyModelDisclaimer: "ਸਿਰਫ਼ ਸੰਦਰਭ ਲਈ ਹੈ, ਕੋਈ ਡਾਕਟਰੀ ਨਿਦਾਨ ਨਹੀਂ।",
    highlightedSystemLabel: "ਹਾਈਲਾਈਟ ਕੀਤੀ ਸਰੀਰ ਪ੍ਰਣਾਲੀ"
  },
  as: {
    viewOnBody: "3D শৰীৰত চাওক",
    bodyModelTitle: "আয়ুৰ্বেদিক 3D শৰীৰ মানচিত্ৰ",
    dragToRotate: "ঘূৰাবলৈ টানক • জুম কৰিবলৈ স্ক্ৰল কৰক",
    resetView: "ভিউ ৰিছেট কৰক",
    bodyModelDisclaimer: "কেৱল দৃষ্টান্তমূলক প্ৰসংগৰ বাবে, কোনো চিকিৎসা নিৰ্ণয় নহয়।",
    highlightedSystemLabel: "চিহ্নিত শাৰীৰিক ব্যৱস্থা"
  }
};

Object.entries(translations).forEach(([lang, keys]) => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`Locale file missing: ${lang}.json`);
    return;
  }
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(json, keys);
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
  console.log(`Updated ${lang}.json with 3D body model keys.`);
});

console.log('All 13 locales updated successfully!');
