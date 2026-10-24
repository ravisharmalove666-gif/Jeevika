const fs = require('fs');
const path = require('path');

async function testAyurvedic3DMapping() {
  console.log('=== Running Ayurvedic 3D Body Mapping & Integration Verification ===\n');

  // 1. Dynamic import of client/src/data/ayurvedicBodyMapping.js
  const mappingFilePath = path.join(__dirname, 'client', 'src', 'data', 'ayurvedicBodyMapping.js');
  const {
    ALL_BODY_PARTS,
    AYURVEDIC_BODY_MAPPINGS,
    getBodyMapping
  } = await import('file://' + mappingFilePath.replace(/\\/g, '/'));

  console.log(`Total defined 3D body parts: ${ALL_BODY_PARTS.length}`);
  const validPartsSet = new Set(ALL_BODY_PARTS);

  const expectedOptions = [
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

  console.log(`Checking all ${expectedOptions.length} Ayurvedic parameter options in 3D mapping...`);
  let mappingErrors = 0;

  expectedOptions.forEach(optId => {
    const mapping = getBodyMapping(optId);
    if (!mapping) {
      console.error(`❌ Missing 3D mapping for option: ${optId}`);
      mappingErrors++;
      return;
    }

    if (!mapping.regionTitle || !mapping.description || !mapping.highlightColor) {
      console.error(`❌ Incomplete metadata for option ${optId}: regionTitle, description, or highlightColor missing`);
      mappingErrors++;
    }

    if (!Array.isArray(mapping.highlightedParts) || mapping.highlightedParts.length === 0) {
      console.error(`❌ Option ${optId} has no highlighted parts array`);
      mappingErrors++;
    } else {
      mapping.highlightedParts.forEach(part => {
        if (!validPartsSet.has(part)) {
          console.error(`❌ Option ${optId} references invalid mesh part: '${part}'`);
          mappingErrors++;
        }
      });
    }

    console.log(`  ✓ [${mapping.category}] ${optId} -> ${mapping.regionTitle} (${mapping.highlightedParts.length} parts, color: ${mapping.highlightColor})`);
  });

  if (mappingErrors > 0) {
    throw new Error(`Encountered ${mappingErrors} errors in Ayurvedic 3D body mapping.`);
  }
  console.log(`\n✅ All ${expectedOptions.length} options mapped to valid 3D body meshes!\n`);

  // 2. Check 3D keys in all 13 translation files
  console.log('Checking all 13 translation files for 3D body viewer keys...');
  const localesDir = path.join(__dirname, 'client', 'src', 'locales');
  const locales = ['en', 'hi', 'bn', 'mr', 'te', 'ta', 'gu', 'ur', 'kn', 'or', 'ml', 'pa', 'as'];
  const requiredKeys = [
    'viewOnBody',
    'bodyModelTitle',
    'dragToRotate',
    'resetView',
    'bodyModelDisclaimer',
    'highlightedSystemLabel'
  ];

  let translationErrors = 0;

  locales.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    requiredKeys.forEach(k => {
      if (!json[k]) {
        console.error(`❌ Missing key '${k}' in ${lang}.json`);
        translationErrors++;
      }
    });
    console.log(`  ✓ [${lang}] All 6 3D keys present`);
  });

  if (translationErrors > 0) {
    throw new Error(`Encountered ${translationErrors} translation errors.`);
  }
  console.log(`\n✅ All 13 locales contain complete 3D body model keys!\n`);

  console.log('🎉 ALL 3D BODY MODEL AND MAPPING TESTS PASSED SUCCESSFULLY!');
}

testAyurvedic3DMapping().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});
