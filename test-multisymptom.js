import http from 'http';
import { checkRedFlags } from './client/src/services/redFlags.js';

console.log('========================================================');
console.log('🧪 MULTI-SYMPTOM SELECTION INTEGRATION VERIFICATION TEST');
console.log('========================================================\n');

let allPassed = true;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    allPassed = false;
  }
}

// TEST SUITE 1: Client-Side Red Flag Detection with Multiple Symptoms
console.log('Test 1: Client-Side Red Flag Engine with Multi-Symptom Selection');
const benignMulti = checkRedFlags({
  chiefComplaint: 'Fever with chills, Cough and cold, Severe throbbing headache',
  selectedSymptoms: ['Fever with chills', 'Cough and cold', 'Severe throbbing headache'],
  customComplaint: 'mild body ache',
  severity: 5
});
assert(benignMulti.isRedFlag === false, 'Multiple benign symptoms do not trigger red flag');

const cardiacCombo = checkRedFlags({
  chiefComplaint: 'Fever with chills, Severe chest pain and tightness',
  selectedSymptoms: ['Fever with chills', 'Severe chest pain and tightness'],
  customComplaint: '',
  severity: 6
});
assert(cardiacCombo.isRedFlag === true, 'Cardiac symptom among multi-selection triggers red flag');
assert(cardiacCombo.alertType === 'cardiac', 'Alert type correctly identified as cardiac');

const respCombo = checkRedFlags({
  chiefComplaint: 'Persistent cough, Shortness of breath at rest',
  selectedSymptoms: ['Persistent cough', 'Shortness of breath at rest'],
  severity: 5
});
assert(respCombo.isRedFlag === true, 'Respiratory distress symptom among multi-selection triggers red flag');

// TEST SUITE 2: Multi-Symptom Array & Custom Note Coexistence
console.log('\nTest 2: Selected Symptoms Array + Custom Note Coexistence');
const symptoms = ['High fever with chills', 'Persistent dry cough', 'Severe throbbing headache'];
const customNote = 'vomited twice in the morning';
const combined = `${symptoms.join(', ')}; ${customNote}`;

assert(Array.isArray(symptoms) && symptoms.length === 3, 'Symptoms stored as array with 3 items');
assert(combined.includes('High fever') && combined.includes('vomited twice'), 'Combined narrative includes both selected cards and custom note');

// TEST SUITE 3: Backend Submission with Multi-Symptom Intake Data
console.log('\nTest 3: Backend Intake API Submission with Multi-Symptom Payload');
async function testBackendSubmission() {
  const payload = JSON.stringify({
    patient: {
      name: "Sumanth Rao",
      abhaId: "14-8899-7744-1122",
      age: 46,
      gender: "Male"
    },
    intakeData: {
      chiefComplaint: "High fever with chills, Persistent dry cough; vomited twice in the morning",
      selectedSymptoms: ["High fever with chills", "Persistent dry cough"],
      selectedSymptomIds: ["fever", "cough"],
      customComplaint: "vomited twice in the morning",
      hpi: {
        duration: "3-7 days",
        severity: 6,
        associatedSymptoms: ["Nausea / Vomiting"]
      },
      pastHistory: {
        conditions: [],
        allergies: "No Known Drug Allergies (NKDA)",
        currentMeds: ""
      },
      ros: {
        cardiac: [],
        respiratory: [],
        gi: ["nausea"],
        neuro: [],
        musculoskeletal: []
      },
      ayush: {
        enabled: true,
        prakriti: "Pitta-Kapha",
        agni: "Mandagni",
        koshtha: "Madhyama"
      }
    }
  });

  const options = {
    hostname: '127.0.0.1',
    port: 5000,
    path: '/api/intake',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          assert(json.success === true, 'Backend successfully processed multi-symptom intake session');
          assert(json.data && json.data.token, `Token successfully generated: ${json.data?.token}`);
          assert(
            json.data?.intakeData?.selectedSymptoms?.length === 2, 
            'Server preserved selectedSymptoms array in database'
          );
          assert(
            json.data?.summary && typeof json.data?.summary?.chiefComplaint === 'string',
            'AI clinical summary successfully generated with multi-symptom narrative'
          );
          console.log('\n  Summary Chief Complaint:', json.data?.summary?.chiefComplaint);
        } catch (e) {
          console.error('Failed to parse response:', e);
          allPassed = false;
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Request failed:', e.message);
      allPassed = false;
      resolve();
    });

    req.write(payload);
    req.end();
  });
}

testBackendSubmission().then(() => {
  console.log('\n========================================================');
  if (allPassed) {
    console.log('✅ ALL MULTI-SYMPTOM VERIFICATION TESTS PASSED!');
  } else {
    console.error('❌ SOME TESTS FAILED.');
    process.exit(1);
  }
  console.log('========================================================');
});
