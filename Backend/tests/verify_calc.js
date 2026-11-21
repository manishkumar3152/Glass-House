const { processGlassItems } = require('../services/glassCalculationService');

console.log('--- TEST 1: INCH MODE (12mm PDF) ---');
const inchResult = processGlassItems([
  {
    itemCode: 'G1',
    remarks: 'Drawing',
    length: '89 3/4"',
    width: '47 1/2"',
    quantity: 1,
    thickness: 12,
    density: 2.475,
    rate: 137.50,
    per: 'Sqft'
  }
], 'INCH', 'SQFT');

const it1 = inchResult.items[0];
console.log('Act Area:', it1.actArea, 'Expected: 29.605', it1.actArea === 29.605 ? '✅' : '❌');
console.log('Chrg Area:', it1.chrgArea, 'Expected: 29.941', it1.chrgArea === 29.941 ? '✅' : '❌');
console.log('Weight:', it1.weight, 'Expected: 82.61', it1.weight === 82.61 ? '✅' : '❌');
console.log('Amount:', it1.amount, 'Expected: 4116.89', it1.amount === 4116.89 ? '✅' : '❌');

console.log('\n--- TEST 2: MM MODE (6mm PDF - G1) ---');
const mmResult = processGlassItems([
  {
    itemCode: 'G1',
    remarks: 'BS',
    length: 2063,
    width: 800,
    quantity: 2,
    thickness: 6,
    density: 2.475,
    rate: 72.00,
    per: 'Sqft'
  }
], 'MM', 'SQM');

const it2 = mmResult.items[0];
console.log('Act Area:', it2.actArea, 'Expected: 3.301', it2.actArea === 3.301 ? '✅' : '❌');
console.log('Chrg Area:', it2.chrgArea, 'Expected: 3.328', it2.chrgArea === 3.328 ? '✅' : '❌');
console.log('Weight:', it2.weight, 'Expected: 49.42', it2.weight === 49.42 ? '✅' : '❌');
console.log('Amount:', it2.amount, 'Expected: 2579.21', it2.amount === 2579.21 ? '✅' : '❌');
