const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'client', 'src', 'locales');

const translationsToAdd = {
  en: {
    ayushAssociatedHeading: "Commonly associated with:",
    ayushDisclaimer: "This is general Ayurvedic reference information and not a diagnosis."
  },
  hi: {
    ayushAssociatedHeading: "सामान्य संबंधित लक्षण व रोग:",
    ayushDisclaimer: "यह सामान्य आयुर्वेदिक संदर्भ जानकारी है, कोई चिकित्सीय निदान नहीं।"
  },
  bn: {
    ayushAssociatedHeading: "সাধারণত সম্পর্কিত লক্ষণ ও সমস্যা:",
    ayushDisclaimer: "এটি সাধারণ আয়ুর্বেদিক নির্দেশিকা, কোনো চিকিৎসা সংক্রান্ত রোগনির্ণয় নয়।"
  },
  mr: {
    ayushAssociatedHeading: "सामान्य संबंधित लक्षणे व विकार:",
    ayushDisclaimer: "ही सामान्य आयुर्वेदिक माहिती आहे, कोणताही वैद्यकीय निदान नाही."
  },
  te: {
    ayushAssociatedHeading: "సాధారణంగా సంబంధిత లక్షణాలు మరియు సమస్యలు:",
    ayushDisclaimer: "ఇది సాధారణ ఆయుర్వేద సూచన సమాచారం మాత్రమే, వైద్య నిర్ధారణ కాదు."
  },
  ta: {
    ayushAssociatedHeading: "பொதுவாக தொடர்புடைய அறிகுறிகள்:",
    ayushDisclaimer: "இது பொதுவான ஆயுர்வேத குறிப்புத் தகவல் மட்டுமே, மருத்துவ நோய் கண்டறிதல் அல்ல."
  },
  gu: {
    ayushAssociatedHeading: "સામાન્ય રીતે સંબંધિત લક્ષણો અને તકલીફો:",
    ayushDisclaimer: "આ સામાન્ય આયુર્વેદિક સંદર્ભ માહિતી છે, કોઈ તબીબી નિદાન નથી."
  },
  ur: {
    ayushAssociatedHeading: "عام طور پر متعلقہ علامات و عوارض:",
    ayushDisclaimer: "یہ عمومی آیورویدک رہنمائی ہے، کوئی طبی تشخیص نہیں۔"
  },
  kn: {
    ayushAssociatedHeading: "ಸಾಮಾನ್ಯವಾಗಿ ಸಂಬಂಧಿಸಿದ ಲಕ್ಷಣಗಳು:",
    ayushDisclaimer: "ಇದು ಸಾಮಾನ್ಯ ಆಯುರ್ವೇದ ಉಲ್ಲೇಖ ಮಾಹಿತಿ ಮಾತ್ರ, ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ."
  },
  or: {
    ayushAssociatedHeading: "ସାଧାରଣତଃ ସମ୍ପର୍କିତ ଲକ୍ଷଣ ଓ ସମସ୍ୟା:",
    ayushDisclaimer: "ଏହା ସାଧାରଣ ଆୟୁର୍ବେଦିକ ସନ୍ଦର୍ଭ ସୂଚନା, କୌଣସି ଚିକିତ୍ସା ନିଦାନ ନୁହେଁ।"
  },
  ml: {
    ayushAssociatedHeading: "സാധാരണയായി ബന്ധപ്പെട്ട ലക്ഷണങ്ങൾ:",
    ayushDisclaimer: "ഇത് പൊതുവായ ആയുർവേദ റഫറൻസ് വിവരങ്ങൾ മാത്രമാണ്, രോഗനിർണയമല്ല."
  },
  pa: {
    ayushAssociatedHeading: "ਆਮ ਤੌਰ 'ਤੇ ਸੰਬੰਧਿਤ ਲੱਛਣ ਅਤੇ ਬਿਮਾਰੀਆਂ:",
    ayushDisclaimer: "ਇਹ ਆਮ ਆਯੁਰਵੈਦਿਕ ਜਾਣਕਾਰੀ ਹੈ, ਕੋਈ ਡਾਕਟਰੀ ਨਿਦਾਨ ਨਹੀਂ।"
  },
  as: {
    ayushAssociatedHeading: "সাধাৰণতে সম্পৰ্কিত লক্ষণ আৰু সমস্যাসমূহ:",
    ayushDisclaimer: "এইটো সাধাৰণ আয়ুৰ্বেদিক নিৰ্দেশনাহে, কোনো চিকিৎসা নিদান নহয়।"
  }
};

Object.keys(translationsToAdd).forEach(code => {
  const filePath = path.join(localesDir, `${code}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  data.ayushAssociatedHeading = translationsToAdd[code].ayushAssociatedHeading;
  data.ayushDisclaimer = translationsToAdd[code].ayushDisclaimer;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${code}.json with AYUSH reference translation keys`);
});
