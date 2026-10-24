const fs = require('fs');
const path = require('path');

console.log('==============================================');
console.log('🧪 MEDIKIOSK MULTILINGUAL 13-LANGUAGE TEST SUITE');
console.log('==============================================\n');

const localesDir = path.join(__dirname, 'client', 'src', 'locales');
const expectedLanguages = [
  'en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'as'
];

let failed = false;

// Test 1: Validate all 13 JSON files
console.log('Test 1: Validating all 13 translation JSON files...');
const translations = {};
expectedLanguages.forEach(code => {
  const filePath = path.join(localesDir, `${code}.json`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing translation file for language: ${code}`);
    failed = true;
    return;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    translations[code] = parsed;
    const keyCount = Object.keys(parsed).length;
    console.log(`  ✓ [${code}] ${code.toUpperCase()} file valid JSON (${keyCount} keys)`);
  } catch (err) {
    console.error(`❌ [${code}] Failed to parse JSON: ${err.message}`);
    failed = true;
  }
});

// Test 2: Check critical keys in all 13 languages
console.log('\nTest 2: Verifying critical keys in every language...');
const criticalKeys = [
  'appTitle', 'appSubtitle', 'step', 'of', 'next', 'previous', 'finish',
  'step1Title', 'commonSymptoms', 'symChestPain', 'symChestPainVal',
  'symBreathlessness', 'symBreathlessnessVal', 'prakritiTitle',
  'prakritiVata', 'prakritiPitta', 'prakritiKapha',
  'urgentCareNoticeTitle', 'urgentCareMainPrompt', 'urgentCareSubMessage',
  'urgentCareAlertSent', 'urgentNotifiedButton', 'urgentStaffOverrideButton',
  'overrideUsername', 'overridePassword'
];

expectedLanguages.forEach(code => {
  const dict = translations[code];
  if (!dict) return;
  const missing = criticalKeys.filter(k => !dict[k]);
  if (missing.length > 0) {
    console.error(`❌ [${code}] Missing critical keys: ${missing.join(', ')}`);
    failed = true;
  } else {
    console.log(`  ✓ [${code}] All ${criticalKeys.length} critical keys present`);
  }
});

// Test 3: Verify Urdu RTL configuration
console.log('\nTest 3: Verifying RTL configuration in i18n.js & LanguageContext...');
const i18nConfigPath = path.join(__dirname, 'client', 'src', 'i18n', 'i18n.js');
const i18nContent = fs.readFileSync(i18nConfigPath, 'utf8');
if (i18nContent.includes("code: 'ur'") && i18nContent.includes("dir: 'rtl'") && i18nContent.includes("document.documentElement.dir = dir")) {
  console.log('  ✓ i18n.js configured with Urdu rtl direction and dynamic document.documentElement.dir sync');
} else {
  console.error('❌ i18n.js RTL logic check failed');
  failed = true;
}

// Test 4: Verify Voice BCP-47 Mapping
console.log('\nTest 4: Verifying BCP-47 Voice map in voice.js...');
const voicePath = path.join(__dirname, 'client', 'src', 'services', 'voice.js');
const voiceContent = fs.readFileSync(voicePath, 'utf8');
const bcp47Codes = [
  'en-IN', 'hi-IN', 'bn-IN', 'mr-IN', 'te-IN', 'ta-IN', 
  'gu-IN', 'ur-IN', 'kn-IN', 'or-IN', 'ml-IN', 'pa-IN', 'as-IN'
];
const missingBcp = bcp47Codes.filter(c => !voiceContent.includes(c));
if (missingBcp.length === 0) {
  console.log(`  ✓ All ${bcp47Codes.length} Indian BCP-47 language codes present in voice.js`);
} else {
  console.error(`❌ Missing BCP-47 codes: ${missingBcp.join(', ')}`);
  failed = true;
}

async function run() {
// Test 5: Verify red flag detection with multiple Indic languages
console.log('\nTest 5: Testing red flag triggers across languages...');
const redFlagsEngine = await import('./client/src/services/redFlags.js');
// Check redFlags.js exports or evaluate
const testIntakes = [
  { lang: 'en', complaint: 'Severe chest pain and tightness', shouldFlag: true },
  { lang: 'hi', complaint: 'सीने में दर्द और जकड़न', shouldFlag: true },
  { lang: 'bn', complaint: 'বুকে তীব্র ব্যথা এবং চাপ', shouldFlag: true },
  { lang: 'ta', complaint: 'நெஞ்சில் கடுமையான வலி மற்றும் பாரம்', shouldFlag: true },
  { lang: 'ur', complaint: 'سینے میں شدید درد اور جکڑن', shouldFlag: true },
  { lang: 'te', complaint: 'ఛాతీలో తీవ్రమైన నొప్పి మరియు బిగుతు', shouldFlag: true },
  { lang: 'en-mild', complaint: 'Mild fever and cough', shouldFlag: false }
];

testIntakes.forEach(tc => {
  const res = redFlagsEngine.checkRedFlags({ chiefComplaint: tc.complaint, severity: 5 });
  if (res.isRedFlag === tc.shouldFlag) {
    console.log(`  ✓ [${tc.lang}] "${tc.complaint.substring(0, 25)}..." -> RedFlag: ${res.isRedFlag} (Expected: ${tc.shouldFlag})`);
  } else {
    console.error(`❌ [${tc.lang}] RedFlag failed for "${tc.complaint}". Got: ${res.isRedFlag}, Expected: ${tc.shouldFlag}`);
    failed = true;
  }
});

// Test 6: Verify Native Language Names in i18n.js & KioskLanding
console.log('\nTest 6: Verifying Native Script Language names in i18n.js & KioskLanding...');
const landingPath = path.join(__dirname, 'client', 'src', 'components', 'kiosk', 'KioskLanding.jsx');
const landingContent = fs.readFileSync(landingPath, 'utf8');
const nativeNames = ['English', 'हिन्दी', 'বাংলা', 'मराठी', 'తెలుగు', 'தமிழ்', 'ગુજરાતી', 'اردو', 'ಕನ್ನಡ', 'ଓଡ଼ିଆ', 'മലയാളം', 'ਪੰਜਾਬੀ', 'অসমীয়া'];

const missingInConfig = nativeNames.filter(n => !i18nContent.includes(n));
const mapsNativeNames = landingContent.includes('l.nativeName');

if (missingInConfig.length === 0 && mapsNativeNames) {
  console.log(`  ✓ All ${nativeNames.length} native-script language names configured and rendered via l.nativeName in KioskLanding`);
} else {
  console.error(`❌ Missing in config: ${missingInConfig.join(', ')} (mapsNativeNames: ${mapsNativeNames})`);
  failed = true;
}

console.log('\n==============================================');
if (failed) {
  console.error('❌ MULTILINGUAL TEST SUITE FAILED');
  process.exit(1);
} else {
  console.log('✅ ALL MULTILINGUAL TESTS PASSED SUCCESSFULLY!');
  console.log('==============================================');
  process.exit(0);
}
}

run().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
