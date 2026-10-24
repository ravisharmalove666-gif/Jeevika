const fs = require('fs');
const path = require('path');

async function testAyurvedicReferenceData() {
  console.log('=== Running Ayurvedic Reference Data & Info Dropdown Verification ===\n');

  // 1. Dynamic import of client/src/data/ayurvedicReferenceData.js
  const refDataPath = path.join(__dirname, 'client', 'src', 'data', 'ayurvedicReferenceData.js');
  const fileContent = fs.readFileSync(refDataPath, 'utf8');

  // Verify file parses and exports
  const { AYURVEDIC_REFERENCE_DATA, getAyurvedicInfo } = await import('file://' + refDataPath.replace(/\\/g, '/'));

  const expectedKeys = [
    // Prakriti (6)
    'vata', 'pitta', 'kapha', 'vata_pitta', 'pitta_kapha', 'tridosha',
    // Agni (4)
    'mandagni', 'vishamagni', 'tikshnagni', 'samagni',
    // Koshtha (3)
    'krura', 'madhyama', 'mridu',
    // Dashavidha - Bala (3)
    'bala_pravara', 'bala_madhyama', 'bala_avara',
    // Dashavidha - Satmya (3)
    'satmya_pravara', 'satmya_madhyama', 'satmya_avara',
    // Dashavidha - Nidra (3)
    'nidra_sukha', 'nidra_alpa', 'nidra_ati'
  ];

  console.log(`Checking ${expectedKeys.length} Ayurvedic parameter options...`);
  let optionErrors = 0;

  expectedKeys.forEach(key => {
    const data = AYURVEDIC_REFERENCE_DATA[key];
    if (!data) {
      console.error(`❌ Missing data for key: ${key}`);
      optionErrors++;
      return;
    }

    const enCount = data.symptoms?.en?.length || 0;
    const hiCount = data.symptoms?.hi?.length || 0;

    if (enCount < 4 || enCount > 6) {
      console.error(`❌ Key ${key} EN symptoms count (${enCount}) is not between 4 and 6`);
      optionErrors++;
    }
    if (hiCount < 4 || hiCount > 6) {
      console.error(`❌ Key ${key} HI symptoms count (${hiCount}) is not between 4 and 6`);
      optionErrors++;
    }
  });

  if (optionErrors === 0) {
    console.log(`✅ All ${expectedKeys.length} parameter options have 4-6 authentic symptoms in both EN and HI.\n`);
  } else {
    throw new Error(`Encountered ${optionErrors} errors in Ayurvedic reference data.`);
  }

  // 2. Check all 13 translation files
  console.log('Checking i18n translation files for ayushAssociatedHeading & ayushDisclaimer...');
  const localesDir = path.join(__dirname, 'client', 'src', 'locales');
  const locales = ['en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'as'];
  let localeErrors = 0;

  locales.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Locale file missing: ${lang}.json`);
      localeErrors++;
      return;
    }

    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!json.ayushAssociatedHeading) {
      console.error(`❌ Missing ayushAssociatedHeading in ${lang}.json`);
      localeErrors++;
    }
    if (!json.ayushDisclaimer) {
      console.error(`❌ Missing ayushDisclaimer in ${lang}.json`);
      localeErrors++;
    }
  });

  if (localeErrors === 0) {
    console.log(`✅ All ${locales.length} languages contain 'ayushAssociatedHeading' and 'ayushDisclaimer'.\n`);
  } else {
    throw new Error(`Encountered ${localeErrors} errors in translation files.`);
  }

  // 3. Test getAyurvedicInfo helper function
  console.log('Testing getAyurvedicInfo() helper with mock i18n t function...');
  const mockT = (key, defaultVal) => defaultVal || key;

  // Test with EN
  const vataEn = getAyurvedicInfo('vata', 'en', mockT);
  if (!vataEn || vataEn.symptoms.length !== 6 || !vataEn.disclaimer || !vataEn.heading) {
    throw new Error('getAyurvedicInfo(vata, en) failed: ' + JSON.stringify(vataEn));
  }
  console.log(`- Vata (EN): Name="${vataEn.name}", ${vataEn.symptoms.length} symptoms`);

  // Test with HI
  const tikshnagniHi = getAyurvedicInfo('tikshnagni', 'hi', mockT);
  if (!tikshnagniHi || tikshnagniHi.symptoms.length < 4) {
    throw new Error('getAyurvedicInfo(tikshnagni, hi) failed: ' + JSON.stringify(tikshnagniHi));
  }
  console.log(`- Tikshnagni (HI): Name="${tikshnagniHi.name}", ${tikshnagniHi.symptoms.length} symptoms`);

  // Test with regional language fallback
  const kruraBn = getAyurvedicInfo('krura', 'bn', mockT);
  if (!kruraBn || kruraBn.symptoms.length < 4) {
    throw new Error('getAyurvedicInfo(krura, bn) failed fallback: ' + JSON.stringify(kruraBn));
  }
  console.log(`- Krura (BN fallback): Name="${kruraBn.name}", ${kruraBn.symptoms.length} symptoms`);

  // Test invalid key
  const invalid = getAyurvedicInfo('nonexistent', 'en', mockT);
  if (invalid !== null) {
    throw new Error('Expected null for nonexistent key');
  }

  console.log('\n🎉 ALL AYURVEDIC INFO VERIFICATIONS PASSED SUCCESSFULLY!');
}

testAyurvedicReferenceData().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
