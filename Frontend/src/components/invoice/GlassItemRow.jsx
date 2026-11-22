import React from 'react';
import { IoTrashOutline } from 'react-icons/io5';
import { parseDimensionValue, calculateActualArea } from '../../calculators/areaCalculator';
import { calculateChargeableArea, calculateChargeableAreaDetails } from '../../calculators/chargeableAreaCalculator';
import { calculateWeight } from '../../calculators/weightCalculator';
import { calculateGlassAmount } from '../../calculators/amountCalculator';

const GlassItemRow = ({
  item,
  index,
  specifications = [],
  rates = [],
  lengthUnit = 'MM',
  areaUnit = 'SQM',
  extra = 0,
  standard = false,
  onChange,
  onRemove,
  readOnly = false
}) => {
  const thickness = Number(item.thickness) || 6;
  const density = Number(item.density) || 2.475;

  const handleSpecChange = (e) => {
    const specId = e.target.value;
    const selectedSpec = specifications.find((s) => s._id === specId);
    if (selectedSpec) {
      const matchingRate = rates.find((r) => r.glassSpecification?._id === specId);
      const appliedRate = matchingRate ? matchingRate.rate : selectedSpec.defaultRate || '';
      const appliedPer = matchingRate ? matchingRate.per : selectedSpec.rateUnit || 'Sqft';
      const specThickness = selectedSpec.thickness || 6;
      const specDensity = selectedSpec.density || 2.475;

      const chrg = Number(item.chrgArea) || Number(item.actArea) || 0;
      const newWeight = chrg > 0 ? calculateWeight(chrg, specThickness, specDensity, null, areaUnit) : (item.weight || '');
      const newAmount = chrg > 0 && appliedRate !== '' ? calculateGlassAmount(chrg, item.quantity, appliedRate, appliedPer, areaUnit) : 0;

      onChange(index, {
        ...item,
        specification: selectedSpec.glassName,
        specificationId: selectedSpec._id,
        thickness: specThickness,
        density: specDensity,
        rate: appliedRate,
        per: appliedPer,
        weight: item.isManualWeight ? item.weight : newWeight,
        amount: newAmount
      });
    } else {
      onChange(index, {
        ...item,
        specification: e.target.value,
        specificationId: null
      });
    }
  };

  // Called when dimension (length, width, quantity) changes:
  // Dynamically recalculates Act Area, Chrg Area (using PI-level Extra & Standard policy), Weight, and Amount!
  const handleDimensionChange = (field, rawValue) => {
    const nextL = field === 'length' ? rawValue : item.length;
    const nextW = field === 'width' ? rawValue : item.width;
    const nextQty = field === 'quantity' ? rawValue : item.quantity;
    const activeExtra = Number(extra) || 0;
    const activeStandard = Boolean(standard);

    const lNum = parseDimensionValue(nextL);
    const wNum = parseDimensionValue(nextW);
    const qNum = Number(nextQty) || 0;

    let newActArea = '';
    let newChrgArea = '';
    let newWeight = '';
    let newAmount = 0;
    let adjL = 0;
    let adjW = 0;

    if (lNum > 0 && wNum > 0 && qNum > 0) {
      newActArea = calculateActualArea(nextL, nextW, qNum, lengthUnit, areaUnit);
      const details = calculateChargeableAreaDetails(
        nextL,
        nextW,
        qNum,
        activeExtra,
        activeStandard,
        lengthUnit,
        areaUnit
      );
      newChrgArea = details.chargeableArea;
      adjL = details.adjustedLength;
      adjW = details.adjustedWidth;

      newWeight = calculateWeight(newChrgArea, thickness, density, null, areaUnit);
      const rateNum = Number(item.rate) || 0;
      newAmount = calculateGlassAmount(newChrgArea, qNum, rateNum, item.per || 'Sqft', areaUnit);
    }

    onChange(index, {
      ...item,
      [field]: rawValue,
      originalLength: nextL,
      originalWidth: nextW,
      extra: activeExtra,
      standard: activeStandard,
      adjustedLength: adjL,
      adjustedWidth: adjW,
      actArea: newActArea,
      actualArea: newActArea,
      chrgArea: newChrgArea,
      chargeableArea: newChrgArea,
      weight: newWeight,
      amount: newAmount,
      isManualActArea: false,
      isManualChrgArea: false,
      isManualWeight: false
    });
  };

  // Called when user directly types into Act Area
  const handleActAreaChange = (val) => {
    if (val === '') {
      onChange(index, {
        ...item,
        actArea: '',
        actualArea: '',
        chrgArea: item.isManualChrgArea ? item.chrgArea : '',
        chargeableArea: item.isManualChrgArea ? item.chrgArea : '',
        weight: item.isManualWeight ? item.weight : '',
        amount: item.isManualChrgArea && item.chrgArea !== '' ? item.amount : 0,
        isManualActArea: false
      });
      return;
    }
    const act = Number(val) || 0;
    const activeExtra = Number(extra) || 0;
    const activeStandard = Boolean(standard);
    const newChrg = item.isManualChrgArea && item.chrgArea !== ''
      ? (Number(item.chrgArea) || act)
      : calculateChargeableArea(item.length, item.width, item.quantity, activeExtra, activeStandard, lengthUnit, areaUnit) || act;
    const newWeight = item.isManualWeight && item.weight !== ''
      ? item.weight
      : calculateWeight(newChrg, thickness, density, null, areaUnit);
    const rateNum = Number(item.rate) || 0;
    const newAmount = calculateGlassAmount(newChrg, item.quantity, rateNum, item.per || 'Sqft', areaUnit);

    onChange(index, {
      ...item,
      actArea: val,
      actualArea: act,
      chrgArea: newChrg,
      chargeableArea: newChrg,
      weight: newWeight,
      amount: newAmount,
      isManualActArea: true
    });
  };

  // Called when user directly types into Chrg Area
  const handleChrgAreaChange = (val) => {
    if (val === '') {
      onChange(index, {
        ...item,
        chrgArea: '',
        chargeableArea: '',
        weight: item.isManualWeight ? item.weight : '',
        amount: 0,
        isManualChrgArea: true
      });
      return;
    }
    const chrg = Number(val) || 0;
    const newWeight = item.isManualWeight && item.weight !== ''
      ? item.weight
      : calculateWeight(chrg, thickness, density, null, areaUnit);
    const rateNum = Number(item.rate) || 0;
    const newAmount = calculateGlassAmount(chrg, item.quantity, rateNum, item.per || 'Sqft', areaUnit);

    onChange(index, {
      ...item,
      chrgArea: val,
      chargeableArea: chrg,
      weight: newWeight,
      amount: newAmount,
      isManualChrgArea: true
    });
  };

  // Called when user directly types into Weight
  const handleWeightChange = (val) => {
    onChange(index, {
      ...item,
      weight: val,
      isManualWeight: true
    });
  };

  // Called when user changes Rate or Per
  const handleRateOrPerChange = (field, val) => {
    const nextRate = field === 'rate' ? val : item.rate;
    const nextPer = field === 'per' ? val : (item.per || 'Sqft');
    const chrg = Number(item.chrgArea) || 0;
    const newAmount = chrg > 0 && nextRate !== ''
      ? calculateGlassAmount(chrg, item.quantity, nextRate, nextPer, areaUnit)
      : 0;

    onChange(index, {
      ...item,
      [field]: val,
      amount: newAmount
    });
  };

  const handleSimpleFieldChange = (field, val) => {
    onChange(index, {
      ...item,
      [field]: val
    });
  };

  const lengthPlaceholder = String(lengthUnit).toUpperCase() === 'INCH' ? '89 3/4"' : 'L';
  const widthPlaceholder = String(lengthUnit).toUpperCase() === 'INCH' ? '47 1/2"' : 'W';

  return (
    <tr className="hover:bg-slate-50 transition-colors border-b border-slate-200 text-xs">
      {/* 1. Item Code & Specification */}
      <td className="p-2 min-w-[220px]">
        {readOnly ? (
          <div>
            <div className="font-semibold text-slate-800">
              {item.itemCode && <span className="text-primary-700 font-bold mr-1.5">{item.itemCode}</span>}
              {item.specification}
            </div>
            {item.remarks && <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.remarks}</div>}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Code (e.g. G1)"
                value={item.itemCode || ''}
                onChange={(e) => handleSimpleFieldChange('itemCode', e.target.value)}
                className="w-16 px-1.5 py-1 border border-slate-300 rounded text-xs font-bold text-primary-800 placeholder:font-normal placeholder:text-[10px]"
                title="Item Code (e.g. G1, G2)"
              />
              <select
                value={item.specificationId || ''}
                onChange={handleSpecChange}
                className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-primary-500 font-medium"
              >
                <option value="">-- Select Spec --</option>
                {specifications.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.glassName} ({s.thickness}mm)
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              placeholder="Remarks / Process (e.g. BS, DRAW, Drawing)"
              value={item.remarks || ''}
              onChange={(e) => handleSimpleFieldChange('remarks', e.target.value)}
              className="w-full px-1.5 py-0.5 border border-slate-200 rounded text-[11px] text-slate-600 placeholder:text-slate-400 font-mono"
            />
          </div>
        )}
      </td>

      {/* 2. Length (L) - Supports fractions like 89 3/4" or mm like 2063 */}
      <td className="p-2 w-24">
        {readOnly ? (
          <span className="text-right block font-mono">{item.originalLength !== undefined ? item.originalLength : item.length}</span>
        ) : (
          <input
            type="text"
            value={item.length !== undefined ? item.length : ''}
            onChange={(e) => handleDimensionChange('length', e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold focus:ring-1 focus:ring-primary-500 font-mono"
            placeholder={lengthPlaceholder}
            title={String(lengthUnit).toUpperCase() === 'INCH' ? 'Enter inches (e.g. 89 3/4 or 89.75)' : 'Enter length in mm'}
          />
        )}
      </td>

      {/* 3. Width (W) - Supports fractions like 47 1/2" or mm like 800 */}
      <td className="p-2 w-24">
        {readOnly ? (
          <span className="text-right block font-mono">{item.originalWidth !== undefined ? item.originalWidth : item.width}</span>
        ) : (
          <input
            type="text"
            value={item.width !== undefined ? item.width : ''}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold focus:ring-1 focus:ring-primary-500 font-mono"
            placeholder={widthPlaceholder}
            title={String(lengthUnit).toUpperCase() === 'INCH' ? 'Enter inches (e.g. 47 1/2 or 47.5)' : 'Enter width in mm'}
          />
        )}
      </td>

      {/* 4. Quantity - NO SPINNERS */}
      <td className="p-2 w-16">
        {readOnly ? (
          <span className="text-right block font-bold text-slate-900">{item.quantity}</span>
        ) : (
          <input
            type="text"
            inputMode="numeric"
            value={item.quantity !== undefined ? item.quantity : ''}
            onChange={(e) => handleDimensionChange('quantity', e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Qty"
          />
        )}
      </td>

      {/* 5. Unit */}
      <td className="p-2 w-16 text-center">
        {readOnly ? (
          <span>{item.unit || 'unit'}</span>
        ) : (
          <select
            value={item.unit || 'unit'}
            onChange={(e) => handleSimpleFieldChange('unit', e.target.value)}
            className="w-full px-1 py-1 border border-slate-300 rounded text-xs text-center font-medium"
          >
            <option value="unit">unit</option>
            <option value="NOS">NOS</option>
            <option value="PCS">PCS</option>
          </select>
        )}
      </td>

      {/* 6. Act Area (Sqm or Sqft) - DYNAMIC & EDITABLE, NO SPINNER */}
      <td className="p-2 w-24 text-right">
        {readOnly ? (
          <span className="font-mono text-slate-700">{item.actArea !== '' && !isNaN(item.actArea) ? Number(item.actArea).toFixed(3) : ''}</span>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={item.actArea !== undefined ? item.actArea : ''}
            onChange={(e) => handleActAreaChange(e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-slate-300 rounded text-xs font-mono font-medium text-slate-700 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.000"
            title={`Actual Area (${areaUnit}) - Always uses original dimensions (L*W*Qty/144)`}
          />
        )}
      </td>

      {/* 7. Weight (Kg) - DYNAMIC & EDITABLE, NO SPINNER */}
      <td className="p-2 w-20 text-right">
        {readOnly ? (
          <span className="font-mono text-slate-700">{item.weight !== '' && !isNaN(item.weight) ? Number(item.weight).toFixed(2) : ''}</span>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={item.weight !== undefined ? item.weight : ''}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-slate-300 rounded text-xs font-mono font-medium text-slate-700 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
            title="Weight in Kg - Formula: Chrg Area in Sqm * Thickness * 2.475"
          />
        )}
      </td>

      {/* 8. Chrg Area (Sqm or Sqft) - DYNAMIC & EDITABLE, NO SPINNER */}
      <td className="p-2 w-24 text-right">
        {readOnly ? (
          <span className="font-mono font-bold text-slate-900">{item.chrgArea !== '' && !isNaN(item.chrgArea) ? Number(item.chrgArea).toFixed(3) : ''}</span>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={item.chrgArea !== undefined ? item.chrgArea : ''}
            onChange={(e) => handleChrgAreaChange(e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-primary-300 rounded text-xs font-mono font-bold text-slate-900 bg-amber-50/40 focus:bg-white focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.000"
            title="Chargeable Area - Updates Weight and Amount automatically."
          />
        )}
      </td>

      {/* 9. Rate (₹) - NO SPINNER */}
      <td className="p-2 w-24 text-right">
        {readOnly ? (
          <span className="font-mono">{item.rate !== '' && !isNaN(item.rate) ? Number(item.rate).toFixed(2) : ''}</span>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={item.rate !== undefined ? item.rate : ''}
            onChange={(e) => handleRateOrPerChange('rate', e.target.value)}
            className="w-full text-right px-1.5 py-1 border border-slate-300 rounded text-xs font-semibold focus:ring-1 focus:ring-primary-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
          />
        )}
      </td>

      {/* 10. Per */}
      <td className="p-2 w-20 text-center">
        {readOnly ? (
          <span className="font-medium text-slate-600">{item.per || 'Sqft'}</span>
        ) : (
          <select
            value={item.per || 'Sqft'}
            onChange={(e) => handleRateOrPerChange('per', e.target.value)}
            className="w-full px-1 py-1 border border-slate-300 rounded text-xs text-center font-medium"
          >
            <option value="Sqft">Sqft</option>
            <option value="Sqm">Sqm</option>
            <option value="unit">unit</option>
            <option value="NOS">NOS</option>
          </select>
        )}
      </td>

      {/* 11. Amount (₹) */}
      <td className="p-2 w-28 text-right font-bold text-slate-900 font-mono">
        ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>

      {/* Action */}
      {!readOnly && (
        <td className="p-2 w-12 text-center">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
            title="Delete row"
          >
            <IoTrashOutline className="w-4 h-4" />
          </button>
        </td>
      )}
    </tr>
  );
};

export default GlassItemRow;
