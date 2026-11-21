const { calculateActualArea } = require('../calculators/areaCalculator');
const { calculateWeight } = require('../calculators/weightCalculator');
const { calculateChargeableAreaDetails } = require('../calculators/chargeableAreaCalculator');
const { calculateGlassAmount } = require('../calculators/glassAmountCalculator');
const roundNumber = require('../utils/roundNumber');

/**
 * Calculates all glass items with Extra & Standard rounding support and returns summarized totals.
 * 
 * @param {Array} rawItems
 * @param {string} lengthUnit - 'MM', 'INCH', 'CM'
 * @param {string} areaUnit - 'SQM', 'SQFT'
 * @returns {Object}
 */
const processGlassItems = (
  rawItems = [],
  lengthUnit = 'INCH',
  areaUnit = 'SQFT',
  defaultExtra = 0,
  defaultStandard = false
) => {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      items: [],
      totalQuantity: 0,
      totalActualArea: 0,
      totalWeight: 0,
      totalChargeableArea: 0,
      glassTotal: 0
    };
  }

  let totalQuantity = 0;
  let totalActualArea = 0;
  let totalWeight = 0;
  let totalChargeableArea = 0;
  let glassTotal = 0;

  const extraNum = Number(defaultExtra) || 0;
  const isStd = Boolean(defaultStandard);

  const items = rawItems.map((item) => {
    const originalLength = item.originalLength !== undefined && item.originalLength !== null && item.originalLength !== ''
      ? item.originalLength
      : item.length;
    const originalWidth = item.originalWidth !== undefined && item.originalWidth !== null && item.originalWidth !== ''
      ? item.originalWidth
      : item.width;
    const quantity = Number(item.quantity ?? item.qty) || 0;
    const extra = item.extra !== undefined && item.extra !== null && item.extra !== ''
      ? Number(item.extra)
      : extraNum;
    const standard = item.standard !== undefined && item.standard !== null
      ? Boolean(item.standard)
      : isStd;
    const thickness = Number(item.thickness) || 6;
    const density = Number(item.density) || 2.475;
    const unit = item.unit || 'unit';
    const per = item.per || 'Sqft';
    const rate = Number(item.rate) || 0;

    // Calculate details (Extra + Standard)
    const areaDetails = calculateChargeableAreaDetails(
      originalLength,
      originalWidth,
      quantity,
      extra,
      standard,
      lengthUnit,
      areaUnit,
      item.isManualChrgArea ? item.chrgArea : null
    );

    const actualArea = item.isManualActArea && item.actArea !== undefined && item.actArea !== null && item.actArea !== ''
      ? roundNumber(Number(item.actArea), 3)
      : areaDetails.actualArea;

    const chargeableArea = areaDetails.chargeableArea;

    // Weight (Kg)
    const weight = item.isManualWeight && item.weight !== undefined && item.weight !== null && item.weight !== ''
      ? roundNumber(Number(item.weight), 2)
      : calculateWeight(chargeableArea || actualArea, thickness, density, null, areaUnit);

    // Amount (₹)
    const amount = calculateGlassAmount(chargeableArea, quantity, rate, per, areaUnit);

    totalQuantity += quantity;
    totalActualArea += actualArea;
    totalWeight += weight;
    totalChargeableArea += chargeableArea;
    glassTotal += amount;

    return {
      itemCode: item.itemCode || '',
      remarks: item.remarks || '',
      specification: item.specification || '',
      specificationId: item.specificationId || null,
      originalLength,
      originalWidth,
      length: originalLength,
      width: originalWidth,
      quantity,
      extra,
      standard,
      adjustedLength: areaDetails.adjustedLength,
      adjustedWidth: areaDetails.adjustedWidth,
      actualArea,
      chargeableArea,
      actArea: actualArea,
      chrgArea: chargeableArea,
      rate,
      per,
      amount,
      weight,
      unit,
      thickness,
      density
    };
  });

  return {
    items,
    totalQuantity,
    totalActualArea: roundNumber(totalActualArea, 3),
    totalWeight: roundNumber(totalWeight, 2),
    totalChargeableArea: roundNumber(totalChargeableArea, 3),
    glassTotal: roundNumber(glassTotal, 2)
  };
};

module.exports = {
  processGlassItems
};
