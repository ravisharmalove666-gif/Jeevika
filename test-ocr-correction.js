// Test script for intelligent OCR error-correction API
async function testOCRCorrection() {
  console.log('Testing MediKiosk POST /api/ocr-correct...');

  // Test Case 1: Prescriptions with character recognition error: "Sayesh Mathur", "TELMISARTN 40M6"
  const rawSample1 = `DR. S.K. SHARRMA, MD (MEDICINE) - MAX 0PD CLINIC
REG NO: MCI-4428l | DATE: 28-AUG-2026
PATIENT: Sayesh Mathur, AGE: 42/M
DIAGNOSIS: HYPERTENSION

RX:
1. TAB. TELMISARTN 40M6 - 1 TAB 0D (MORNING)
2. TAB. METFORNIN 500M6 SR - 1 TAB BD AFTER FOOD
3. TAB. ATORVASTTN l0MG - 1 TAB HS`;

  const res = await fetch('http://localhost:5000/api/ocr-correct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      rawText: rawSample1,
      patientContext: { name: 'Jayesh Mathur', age: 42 }
    })
  });

  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status} ${res.statusText}`);
  }

  const result = await res.json();
  console.log('Response status:', res.status);
  console.log('Was corrected:', result.data.wasCorrected);
  console.log('Low confidence / flagged words:', result.data.lowConfidenceWords);
  console.log('--- CORRECTED TEXT ---');
  console.log(result.data.correctedText);
  console.log('----------------------');

  // Assertions
  const text = result.data.correctedText;
  const passedJayesh = text.includes('Jayesh Mathur');
  const passedTelmisartan = text.includes('TELMISARTAN');
  const passedMetformin = text.includes('METFORMIN');
  const passedAtorvastatin = text.includes('ATORVASTATIN');
  const passedDosage = text.includes('40MG') && text.includes('10MG');
  const hasFlags = Array.isArray(result.data.lowConfidenceWords) && result.data.lowConfidenceWords.length > 0;

  if (passedJayesh && passedTelmisartan && passedMetformin && passedAtorvastatin && passedDosage && hasFlags) {
    console.log('✅ ALL TEST ASSERTIONS PASSED: OCR misreadings successfully corrected and flagged!');
    process.exit(0);
  } else {
    console.error('❌ SOME TEST ASSERTIONS FAILED:', {
      passedJayesh,
      passedTelmisartan,
      passedMetformin,
      passedAtorvastatin,
      passedDosage,
      hasFlags
    });
    process.exit(1);
  }
}

testOCRCorrection().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
