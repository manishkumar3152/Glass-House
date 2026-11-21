import { roundNumber, parseDimensionValue, calculateActualArea } from './areaCalculator';

const SQM_TO_SQFT = 10.7639104167;

/**
 * Calculates chargeable area with EXTRA (additional inches) and STANDARD (ceiling rounding).
 * 
 * Logic (Section 7):
 * IF Standard = TRUE:
 *     BaseLength = Math.ceil(OriginalLength)
 *     BaseWidth = Math.ceil(OriginalWidth)
 * ELSE:
 *     BaseLength = OriginalLength
 *     BaseWidth = OriginalWidth
 * 
 * FinalLength = BaseLength + Extra
 * FinalWidth = BaseWidth + Extra
 * 
 * ChargeableArea = (FinalLength * FinalWidth * Quantity) / 144
 * ActualArea = (OriginalLength * OriginalWidth * Quantity) / 144
 * 
 * @param {number|string} length - Original length
 * @param {number|string} width - Original width
 * @param {number} quantity - Quantity of pieces
 * @param {number|Object} extra - Extra inches (or options object)
 * @param {boolean} standard - Standard ceiling rounding flag
 * @param {string} lengthUnit - 'INCH', 'MM', 'CM'
 * @param {string} areaUnit - 'SQFT', 'SQM'
 * @param {number|null} manualOverride - Manual override value
 * @returns {Object} Complete calculation details
 */
export const calculateChargeableAreaDetails = (
  length,
  width,
  quantity = 1,
  extra = 0,
  standard = false,
  lengthUnit = 'INCH',
  areaUnit = 'SQFT',
  manualOverride = null
) => {
  // Support legacy signature or options object
  if (typeof extra === 'string' && ['MM', 'INCH', 'CM'].includes(extra.toUpperCase())) {
    lengthUnit = extra;
    areaUnit = standard || 'SQM';
    manualOverride = lengthUnit !== undefined && typeof lengthUnit === 'number' ? lengthUnit : null;
    extra = 0;
    standard = false;
  } else if (typeof extra === 'object' && extra !== null) {
    const opts = extra;
    extra = opts.extra !== undefined ? opts.extra : 0;
    standard = opts.standard !== undefined ? opts.standard : false;
    lengthUnit = opts.lengthUnit || lengthUnit;
    areaUnit = opts.areaUnit || areaUnit;
    manualOverride = opts.manualOverride !== undefined ? opts.manualOverride : manualOverride;
  }

  const l = parseDimensionValue(length);
  const w = parseDimensionValue(width);
  const q = Number(quantity) || 0;
  const extraNum = Number(extra) || 0;
  const isStandard = Boolean(standard);

  if (l <= 0 || w <= 0 || q <= 0) {
    return {
      originalLength: l,
      originalWidth: w,
      quantity: q,
      extra: extraNum,
      standard: isStandard,
      baseLength: 0,
      baseWidth: 0,
      adjustedLength: 0,
      adjustedWidth: 0,
      actualArea: 0,
      chargeableArea: 0
    };
  }

  const lUnit = String(lengthUnit || 'INCH').toUpperCase();
  const aUnit = String(areaUnit || 'SQFT').toUpperCase();

  // If manual override is explicitly provided
  if (manualOverride !== null && manualOverride !== undefined && manualOverride !== '') {
    const overrideVal = roundNumber(Number(manualOverride), 3);
    return {
      originalLength: l,
      originalWidth: w,
      quantity: q,
      extra: extraNum,
      standard: isStandard,
      baseLength: l,
      baseWidth: w,
      adjustedLength: l,
      adjustedWidth: w,
      actualArea: calculateActualArea(length, width, q, lUnit, aUnit),
      chargeableArea: overrideVal
    };
  }

  let baseLength = l;
  let baseWidth = w;
  let adjustedLength = l;
  let adjustedWidth = w;
  let actualArea = 0;
  let chargeableArea = 0;

  if (lUnit === 'INCH') {
    // Length in Inches, Extra in Inches, Standard = Math.ceil whole inch
    baseLength = isStandard ? Math.ceil(l) : l;
    baseWidth = isStandard ? Math.ceil(w) : w;
    adjustedLength = baseLength + extraNum;
    adjustedWidth = baseWidth + extraNum;

    actualArea = (l * w * q) / 144;
    chargeableArea = (adjustedLength * adjustedWidth * q) / 144;

    if (aUnit === 'SQM') {
      actualArea = actualArea / SQM_TO_SQFT;
      chargeableArea = chargeableArea / SQM_TO_SQFT;
    }
  } else if (lUnit === 'MM') {
    // Length in MM, Extra in MM, Standard = Math.ceil whole MM
    if (!isStandard && extraNum === 0) {
      const slab = 20;
      baseLength = Math.ceil(l / slab) * slab;
      baseWidth = Math.ceil(w / slab) * slab;
      adjustedLength = baseLength;
      adjustedWidth = baseWidth;
    } else {
      baseLength = isStandard ? Math.ceil(l) : l;
      baseWidth = isStandard ? Math.ceil(w) : w;
      adjustedLength = baseLength + extraNum;
      adjustedWidth = baseWidth + extraNum;
    }

    const actAreaSqm = (l * w * q) / 1000000;
    const chrgAreaSqm = (adjustedLength * adjustedWidth * q) / 1000000;

    actualArea = aUnit === 'SQFT' ? actAreaSqm * SQM_TO_SQFT : actAreaSqm;
    chargeableArea = aUnit === 'SQFT' ? chrgAreaSqm * SQM_TO_SQFT : chrgAreaSqm;
  } else if (lUnit === 'CM') {
    // Length in CM, Extra in CM, Standard = Math.ceil whole CM
    baseLength = isStandard ? Math.ceil(l) : l;
    baseWidth = isStandard ? Math.ceil(w) : w;
    adjustedLength = baseLength + extraNum;
    adjustedWidth = baseWidth + extraNum;

    const actAreaSqm = (l * w * q) / 10000;
    const chrgAreaSqm = (adjustedLength * adjustedWidth * q) / 10000;

    actualArea = aUnit === 'SQFT' ? actAreaSqm * SQM_TO_SQFT : actAreaSqm;
    chargeableArea = aUnit === 'SQFT' ? chrgAreaSqm * SQM_TO_SQFT : chrgAreaSqm;
  }

  return {
    originalLength: l,
    originalWidth: w,
    quantity: q,
    extra: extraNum,
    standard: isStandard,
    baseLength: roundNumber(baseLength, 4),
    baseWidth: roundNumber(baseWidth, 4),
    adjustedLength: roundNumber(adjustedLength, 4),
    adjustedWidth: roundNumber(adjustedWidth, 4),
    actualArea: roundNumber(actualArea, 3),
    chargeableArea: roundNumber(chargeableArea, 3)
  };
};

/**
 * Returns single chargeable area number for direct use.
 */
export const calculateChargeableArea = (
  length,
  width,
  quantity = 1,
  extra = 0,
  standard = false,
  lengthUnit = 'INCH',
  areaUnit = 'SQFT',
  manualOverride = null
) => {
  const details = calculateChargeableAreaDetails(
    length,
    width,
    quantity,
    extra,
    standard,
    lengthUnit,
    areaUnit,
    manualOverride
  );
  return details.chargeableArea;
};
