export const roundNumber = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

export const parseDimensionValue = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val).replace(/["']/g, '').trim();
  if (!str) return 0;

  // Check for mixed fraction like "89 3/4" or "89-3/4"
  const mixedMatch = str.match(/^(\d+)\s*[- ]\s*(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]) || 0;
    const num = Number(mixedMatch[2]) || 0;
    const den = Number(mixedMatch[3]) || 1;
    return whole + (num / den);
  }

  // Check for simple fraction like "3/4"
  const fracMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const num = Number(fracMatch[1]) || 0;
    const den = Number(fracMatch[2]) || 1;
    return num / den;
  }

  const parsed = parseFloat(str);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateActualArea = (length, width, quantity = 1, lengthUnit = 'MM', areaUnit = 'SQM') => {
  const l = parseDimensionValue(length);
  const w = parseDimensionValue(width);
  const q = Number(quantity) || 0;

  if (l <= 0 || w <= 0 || q <= 0) return 0;

  const lUnit = String(lengthUnit || 'MM').toUpperCase();
  const aUnit = String(areaUnit || 'SQM').toUpperCase();

  let areaInSqm = 0;
  let areaInSqft = 0;

  if (lUnit === 'INCH') {
    areaInSqft = (l * w * q) / 144;
    areaInSqm = areaInSqft / 10.7639104167;
  } else if (lUnit === 'CM') {
    areaInSqm = (l * 10 * w * 10 * q) / 1000000;
    areaInSqft = areaInSqm * 10.7639104167;
  } else {
    // MM default
    areaInSqm = (l * w * q) / 1000000;
    areaInSqft = areaInSqm * 10.7639104167;
  }

  return aUnit === 'SQFT' ? roundNumber(areaInSqft, 3) : roundNumber(areaInSqm, 3);
};
