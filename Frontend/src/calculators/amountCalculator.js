import { roundNumber } from './areaCalculator';

const SQM_TO_SQFT = 10.7639104167;

export const calculateGlassAmount = (chargeableArea, quantity, rate, per = 'SQFT', areaUnit = 'SQM') => {
  const chrg = Number(chargeableArea) || 0;
  const qty = Number(quantity) || 0;
  const r = Number(rate) || 0;
  const rateUnit = String(per || 'SQFT').toUpperCase();
  const aUnit = String(areaUnit || 'SQM').toUpperCase();

  if (r <= 0) return 0;

  let amount = 0;
  if (rateUnit === 'SQFT') {
    if (aUnit === 'SQFT') {
      // Area is already in Sqft
      amount = chrg * r;
    } else {
      // Area is in Sqm, convert to Sqft
      amount = chrg * SQM_TO_SQFT * r;
    }
  } else if (rateUnit === 'SQM') {
    if (aUnit === 'SQM') {
      amount = chrg * r;
    } else {
      amount = (chrg / SQM_TO_SQFT) * r;
    }
  } else if (rateUnit === 'NOS' || rateUnit === 'UNIT' || rateUnit === 'PCS') {
    amount = qty * r;
  } else {
    amount = aUnit === 'SQFT' ? chrg * r : chrg * SQM_TO_SQFT * r;
  }

  return roundNumber(amount, 2);
};
