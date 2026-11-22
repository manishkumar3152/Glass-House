const assert = require('assert');
const {
  calculateChargeableArea,
  calculateChargeableAreaDetails
} = require('../calculators/chargeableAreaCalculator');
const { calculateActualArea } = require('../calculators/areaCalculator');
const { processGlassItems } = require('../services/glassCalculationService');

console.log('--- RUNNING EXTRA + STANDARD CHARGEABLE AREA TESTS ---');

// Test Case 1: L=89.75, W=47.5, Extra=0, Standard=OFF
{
  const details = calculateChargeableAreaDetails(89.75, 47.5, 1, 0, false, 'INCH', 'SQFT');
  console.log('Test 1: 89.75 x 47.5, Extra 0, Std OFF =>', details.chargeableArea, '(Act:', details.actualArea, ')');
  assert.strictEqual(details.baseLength, 89.75);
  assert.strictEqual(details.baseWidth, 47.5);
  assert.strictEqual(details.adjustedLength, 89.75);
  assert.strictEqual(details.adjustedWidth, 47.5);
  // (89.75 * 47.5) / 144 = 29.60503... rounded to 29.605
  assert.ok(Math.abs(details.chargeableArea - 29.605) <= 0.001);
  assert.ok(Math.abs(details.actualArea - 29.605) <= 0.001);
}

// Test Case 2: L=89.75, W=47.5, Extra=1, Standard=OFF
{
  const details = calculateChargeableAreaDetails(89.75, 47.5, 1, 1, false, 'INCH', 'SQFT');
  console.log('Test 2: 89.75 x 47.5, Extra 1, Std OFF =>', details.chargeableArea, '(AdjL:', details.adjustedLength, 'AdjW:', details.adjustedWidth, ')');
  assert.strictEqual(details.baseLength, 89.75);
  assert.strictEqual(details.baseWidth, 47.5);
  assert.strictEqual(details.adjustedLength, 90.75);
  assert.strictEqual(details.adjustedWidth, 48.5);
  // (90.75 * 48.5) / 144 = 30.56510...
  assert.ok(Math.abs(details.chargeableArea - 30.565) <= 0.001);
  // Actual area MUST be unchanged by Extra
  assert.ok(Math.abs(details.actualArea - 29.605) <= 0.001);
}

// Test Case 3: L=89.75, W=47.5, Extra=0, Standard=ON
{
  const details = calculateChargeableAreaDetails(89.75, 47.5, 1, 0, true, 'INCH', 'SQFT');
  console.log('Test 3: 89.75 x 47.5, Extra 0, Std ON =>', details.chargeableArea, '(BaseL:', details.baseLength, 'BaseW:', details.baseWidth, ')');
  assert.strictEqual(details.baseLength, 90);
  assert.strictEqual(details.baseWidth, 48);
  assert.strictEqual(details.adjustedLength, 90);
  assert.strictEqual(details.adjustedWidth, 48);
  // (90 * 48) / 144 = 30.000
  assert.strictEqual(details.chargeableArea, 30.000);
  // Actual area MUST be unchanged by Standard
  assert.ok(Math.abs(details.actualArea - 29.605) <= 0.001);
}

// Test Case 4: L=89.75, W=47.5, Extra=1, Standard=ON (Combined)
{
  const details = calculateChargeableAreaDetails(89.75, 47.5, 1, 1, true, 'INCH', 'SQFT');
  console.log('Test 4: 89.75 x 47.5, Extra 1, Std ON =>', details.chargeableArea, '(FinalL:', details.adjustedLength, 'FinalW:', details.adjustedWidth, ')');
  // Step 1: Math.ceil(89.75) = 90, Math.ceil(47.5) = 48
  assert.strictEqual(details.baseLength, 90);
  assert.strictEqual(details.baseWidth, 48);
  // Step 2: 90 + 1 = 91, 48 + 1 = 49
  assert.strictEqual(details.adjustedLength, 91);
  assert.strictEqual(details.adjustedWidth, 49);
  // Step 3: (91 * 49) / 144 = 30.96527...
  assert.ok(Math.abs(details.chargeableArea - 30.965) <= 0.015);
  // Actual area MUST be unchanged
  assert.ok(Math.abs(details.actualArea - 29.605) <= 0.001);
}

// Test Case 5: L=90, W=48, Extra=0, Standard=ON
{
  const details = calculateChargeableAreaDetails(90, 48, 1, 0, true, 'INCH', 'SQFT');
  console.log('Test 5: 90 x 48, Extra 0, Std ON =>', details.chargeableArea);
  assert.strictEqual(details.baseLength, 90);
  assert.strictEqual(details.baseWidth, 48);
  assert.strictEqual(details.chargeableArea, 30.000);
}

// Test Case 6: L=90.1, W=48.1, Extra=0, Standard=ON
{
  const details = calculateChargeableAreaDetails(90.1, 48.1, 1, 0, true, 'INCH', 'SQFT');
  console.log('Test 6: 90.1 x 48.1, Extra 0, Std ON =>', details.chargeableArea, '(BaseL:', details.baseLength, 'BaseW:', details.baseWidth, ')');
  // Math.ceil(90.1) = 91, Math.ceil(48.1) = 49
  assert.strictEqual(details.baseLength, 91);
  assert.strictEqual(details.baseWidth, 49);
  assert.ok(Math.abs(details.chargeableArea - 30.965) <= 0.015);
}

// Test Case 7: Verification through processGlassItems (Backend Service)
{
  const result = processGlassItems([
    {
      itemCode: 'G1',
      specification: '12mm Clear Flat',
      length: '89.75',
      width: '47.5',
      quantity: 1,
      extra: 1,
      standard: true,
      thickness: 12,
      density: 2.475,
      rate: 137.50,
      per: 'Sqft'
    }
  ], 'INCH', 'SQFT');

  const item = result.items[0];
  console.log('\n--- processGlassItems Verification ---');
  console.log('originalLength:', item.originalLength);
  console.log('originalWidth:', item.originalWidth);
  console.log('extra:', item.extra);
  console.log('standard:', item.standard);
  console.log('adjustedLength:', item.adjustedLength);
  console.log('adjustedWidth:', item.adjustedWidth);
  console.log('actualArea:', item.actualArea);
  console.log('chargeableArea:', item.chargeableArea);
  console.log('amount:', item.amount);

  assert.strictEqual(item.originalLength, '89.75');
  assert.strictEqual(item.originalWidth, '47.5');
  assert.strictEqual(item.extra, 1);
  assert.strictEqual(item.standard, true);
  assert.strictEqual(item.adjustedLength, 91);
  assert.strictEqual(item.adjustedWidth, 49);
  assert.ok(item.actualArea > 29.6 && item.actualArea < 29.61);
  assert.ok(item.chargeableArea > 30.95 && item.chargeableArea < 30.98);
  assert.ok(item.amount > 0);
}

// Test Case 8: MM Unit with Extra (MM)
{
  const details = calculateChargeableAreaDetails(2063, 800, 2, 10, false, 'MM', 'SQM');
  console.log('Test 8: MM Unit 2063 x 800, Extra 10mm, Std OFF =>', details.chargeableArea, '(AdjL:', details.adjustedLength, 'AdjW:', details.adjustedWidth, ')');
  assert.strictEqual(details.adjustedLength, 2073);
  assert.strictEqual(details.adjustedWidth, 810);
  assert.strictEqual(details.chargeableArea, 3.358);
  assert.strictEqual(details.actualArea, 3.301);
}

// Test Case 9: User's exact scenario: L=48, W=12, Qty=1, Rate=148, Thickness=12, Density=2.5, Extra=1
{
  const result = processGlassItems([
    {
      itemCode: 'G1',
      specification: '12mm Clear Flat Tuff Glass (12mm)',
      length: '48',
      width: '12',
      quantity: 1,
      extra: 0, // item has 0, but header passes defaultExtra=1
      thickness: 12,
      density: 2.5,
      rate: 148,
      per: 'Sqft'
    }
  ], 'INCH', 'SQFT', 1, false);

  const item = result.items[0];
  console.log('\n--- Test 9: User Scenario (L=48, W=12, Extra=1, Rate=148) ---');
  console.log('originalLength:', item.originalLength);
  console.log('originalWidth:', item.originalWidth);
  console.log('adjustedLength:', item.adjustedLength, '(Expected: 49)');
  console.log('adjustedWidth:', item.adjustedWidth, '(Expected: 13)');
  console.log('actualArea:', item.actualArea, '(Expected: 4.000 - Unchanged by Extra)');
  console.log('chargeableArea:', item.chargeableArea, '(Expected: 4.424)');
  console.log('weight:', item.weight, '(Expected: 12.33)');
  console.log('amount:', item.amount, '(Expected: 654.75)');

  assert.strictEqual(item.adjustedLength, 49);
  assert.strictEqual(item.adjustedWidth, 13);
  assert.strictEqual(item.actualArea, 4.000);
  assert.strictEqual(item.chargeableArea, 4.424);
  assert.strictEqual(item.weight, 12.33);
  assert.strictEqual(item.amount, 654.75);
}

console.log('--- ALL EXTRA + STANDARD TESTS PASSED SUCCESSFULLY! ✅ ---');
