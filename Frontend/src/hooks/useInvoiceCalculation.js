import { useMemo } from 'react';
import { calculateActualArea, roundNumber, parseDimensionValue } from '../calculators/areaCalculator';
import { calculateWeight } from '../calculators/weightCalculator';
import { calculateChargeableAreaDetails } from '../calculators/chargeableAreaCalculator';
import { calculateGlassAmount } from '../calculators/amountCalculator';
import { calculateGst } from '../calculators/gstCalculator';
import { amountInWords } from '../utils/numberToWords';

export const useInvoiceCalculation = ({
  glassItems = [],
  processingItems = [],
  additionalCharges = {},
  taxConfig = {},
  lengthUnit = 'MM',
  areaUnit = 'SQM',
  extra = 0,
  standard = false,
  companyStateCode = '07',
  customerStateCode = ''
}) => {
  return useMemo(() => {
    let totalQuantity = 0;
    let totalActualArea = 0;
    let totalWeight = 0;
    let totalChargeableArea = 0;
    let glassTotal = 0;

    const computedGlassItems = glassItems.map((item) => {
      const originalLength = item.originalLength !== undefined && item.originalLength !== null && item.originalLength !== ''
        ? item.originalLength
        : item.length;
      const originalWidth = item.originalWidth !== undefined && item.originalWidth !== null && item.originalWidth !== ''
        ? item.originalWidth
        : item.width;
      const quantity = Number(item.quantity ?? item.qty) || 0;
      const activeExtra = item.extra !== undefined && item.extra !== null && item.extra !== ''
        ? Number(item.extra)
        : (Number(extra) || 0);
      const activeStandard = item.standard !== undefined && item.standard !== null
        ? Boolean(item.standard)
        : Boolean(standard);
      const thickness = Number(item.thickness) || 6;
      const density = Number(item.density) || 2.475;
      const unit = item.unit || 'unit';
      const per = item.per || 'Sqft';
      const rate = Number(item.rate) || 0;

      const lVal = parseDimensionValue(originalLength);
      const wVal = parseDimensionValue(originalWidth);
      const hasDims = lVal > 0 && wVal > 0 && quantity > 0;

      const areaDetails = hasDims
        ? calculateChargeableAreaDetails(
            originalLength,
            originalWidth,
            quantity,
            activeExtra,
            activeStandard,
            lengthUnit,
            areaUnit,
            item.isManualChrgArea ? item.chrgArea : null
          )
        : null;

      const actualArea = item.isManualActArea && item.actArea !== undefined && item.actArea !== null && item.actArea !== ''
        ? roundNumber(Number(item.actArea), 3)
        : (areaDetails ? areaDetails.actualArea : '');

      const chargeableArea = item.isManualChrgArea && item.chrgArea !== undefined && item.chrgArea !== null && item.chrgArea !== ''
        ? roundNumber(Number(item.chrgArea), 3)
        : (areaDetails ? areaDetails.chargeableArea : '');

      const chrgNum = Number(chargeableArea) || 0;
      const actNum = Number(actualArea) || 0;

      const weight = item.isManualWeight && item.weight !== undefined && item.weight !== null && item.weight !== ''
        ? roundNumber(Number(item.weight), 2)
        : (chrgNum > 0 ? calculateWeight(chrgNum, thickness, density, null, areaUnit) : '');

      const amount = chrgNum > 0 && rate > 0
        ? calculateGlassAmount(chrgNum, quantity, rate, per, areaUnit)
        : 0;

      totalQuantity += quantity;
      totalActualArea += actNum;
      totalWeight += Number(weight) || 0;
      totalChargeableArea += chrgNum;
      glassTotal += amount;

      return {
        ...item,
        originalLength,
        originalWidth,
        length: originalLength !== undefined ? originalLength : '',
        width: originalWidth !== undefined ? originalWidth : '',
        quantity: item.quantity !== undefined ? item.quantity : '',
        extra: item.extra !== undefined ? item.extra : 0,
        standard,
        adjustedLength: areaDetails ? areaDetails.adjustedLength : 0,
        adjustedWidth: areaDetails ? areaDetails.adjustedWidth : 0,
        thickness,
        density,
        unit,
        per,
        rate: item.rate !== undefined ? item.rate : '',
        actArea: actualArea,
        actualArea,
        chrgArea: chargeableArea,
        chargeableArea,
        weight: item.isManualWeight && item.weight !== '' ? item.weight : (chrgNum > 0 ? weight : ''),
        amount
      };
    });

    let totalProcessingCost = 0;
    const computedProcessingItems = processingItems.map((p) => {
      const qty = Number(p.quantity ?? p.qty) || 0;
      const rate = Number(p.rate) || 0;
      const amount = roundNumber(qty * rate, 2);
      totalProcessingCost += amount;

      return {
        ...p,
        quantity: p.quantity !== undefined ? p.quantity : (qty > 0 ? qty : ''),
        rate: p.rate !== undefined ? p.rate : (rate > 0 ? rate : ''),
        amount
      };
    });

    const totalCost = roundNumber(glassTotal + totalProcessingCost, 2);

    const baseForInsurance = additionalCharges.insuranceOnGlassOnly ? glassTotal : totalCost;
    const insurancePercent = additionalCharges.insurancePercent !== undefined && additionalCharges.insurancePercent !== ''
      ? Number(additionalCharges.insurancePercent)
      : 0;
    const insuranceAmount = roundNumber((baseForInsurance * insurancePercent) / 100, 2);
    const documentCharge = additionalCharges.documentCharge !== undefined && additionalCharges.documentCharge !== ''
      ? Number(additionalCharges.documentCharge)
      : 0;
    const otherCharges = Number(additionalCharges.otherCharges) || 0;

    const totalAdditionalCharges = roundNumber(insuranceAmount + documentCharge + otherCharges, 2);
    const taxableAmount = roundNumber(totalCost + totalAdditionalCharges, 2);

    const taxDetails = calculateGst(taxableAmount, {
      isInterState: taxConfig.isInterState,
      gstRate: taxConfig.gstRate,
      cgstRate: taxConfig.cgstRate,
      sgstRate: taxConfig.sgstRate,
      companyStateCode,
      customerStateCode
    });

    const finalAmount = roundNumber(taxableAmount + taxDetails.totalGst, 2);
    const roundedAmount = Math.round(finalAmount);
    const roundOffDifference = roundNumber(roundedAmount - finalAmount, 2);
    const words = amountInWords(roundedAmount);

    return {
      glassItems: computedGlassItems,
      totalQuantity,
      totalActualArea: roundNumber(totalActualArea, 3),
      totalWeight: roundNumber(totalWeight, 2),
      totalChargeableArea: roundNumber(totalChargeableArea, 3),
      glassTotal: roundNumber(glassTotal, 2),

      processingItems: computedProcessingItems,
      totalProcessingCost: roundNumber(totalProcessingCost, 2),

      totalCost,
      additionalCharges: {
        insurancePercent: additionalCharges.insurancePercent !== undefined ? additionalCharges.insurancePercent : '',
        insuranceAmount,
        documentCharge: additionalCharges.documentCharge !== undefined ? additionalCharges.documentCharge : '',
        otherCharges,
        insuranceOnGlassOnly: Boolean(additionalCharges.insuranceOnGlassOnly)
      },
      totalAdditionalCharges,
      taxableAmount,
      taxDetails,
      totalGST: taxDetails.totalGst,

      finalAmount,
      roundedAmount,
      roundOffDifference,
      amountInWords: words
    };
  }, [
    glassItems,
    processingItems,
    additionalCharges,
    taxConfig,
    lengthUnit,
    areaUnit,
    extra,
    standard,
    companyStateCode,
    customerStateCode
  ]);
};
