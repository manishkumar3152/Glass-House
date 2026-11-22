import React from 'react';
import GlassItemRow from './GlassItemRow';
import Button from '../common/Button';
import { IoAddOutline } from 'react-icons/io5';

const GlassItemsTable = ({
  items = [],
  totals = {},
  specifications = [],
  customerRates = [],
  rates = [],
  lengthUnit = 'MM',
  areaUnit = 'SQM',
  extra = 0,
  standard = false,
  onItemChange,
  onAddItem,
  onRemoveItem,
  readOnly = false
}) => {
  const lUnitLabel = String(lengthUnit).toUpperCase() === 'INCH' ? 'inch' : 'mm';
  const aUnitLabel = String(areaUnit).toUpperCase() === 'SQFT' ? 'Sqft' : 'Sqm';

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
      <div className="px-3.5 sm:px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h3 className="text-xs sm:text-sm font-bold text-primary-900 uppercase tracking-wide">
            1. Glass Specifications & Items ({items.length})
          </h3>
          <span className="text-[11px] sm:text-xs text-slate-600 font-medium bg-slate-200/70 px-2 sm:px-2.5 py-0.5 rounded">
            Dimensions in {lengthUnit} | Area in {areaUnit} | Weight in KG
          </span>
        </div>
        {!readOnly && (
          <div className="self-start sm:self-auto">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddItem}
              icon={IoAddOutline}
            >
              Add Glass Item
            </Button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto max-h-[500px]">
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] sticky top-0 z-10 border-b border-slate-300">
            <tr>
              <th className="p-2.5">Specification</th>
              <th className="p-2.5 text-right w-24">L ({lUnitLabel})</th>
              <th className="p-2.5 text-right w-24">W ({lUnitLabel})</th>
              <th className="p-2.5 text-right w-16">Qty</th>
              <th className="p-2.5 text-center w-16">Unit</th>
              <th className="p-2.5 text-right w-24">Act Area ({aUnitLabel})</th>
              <th className="p-2.5 text-right w-20">Weight (Kg)</th>
              <th className="p-2.5 text-right w-24">Chrg Area ({aUnitLabel})</th>
              <th className="p-2.5 text-right w-24">Rate (₹)</th>
              <th className="p-2.5 text-center w-20">Per</th>
              <th className="p-2.5 text-right w-28">Amount (₹)</th>
              {!readOnly && <th className="p-2.5 text-center w-12">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 11 : 12}
                  className="p-8 text-center text-slate-400 text-xs italic"
                >
                  No glass items added yet. Click &quot;Add Glass Item&quot; to begin.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <GlassItemRow
                  key={idx}
                  item={item}
                  index={idx}
                  specifications={specifications}
                  customerRates={customerRates}
                  rates={rates}
                  lengthUnit={lengthUnit}
                  areaUnit={areaUnit}
                  extra={extra}
                  standard={standard}
                  onChange={onItemChange}
                  onRemove={onRemoveItem}
                  readOnly={readOnly}
                />
              ))
            )}
          </tbody>

          {/* Subtotal Row */}
          {items.length > 0 && (
            <tfoot className="bg-slate-100 font-bold text-xs text-slate-800 border-t-2 border-slate-300">
              <tr>
                <td colSpan={3} className="p-2.5 text-slate-900 uppercase">
                  Total Glass Subtotal:
                </td>
                <td className="p-2.5 text-right">{totals.totalQuantity || 0}</td>
                <td className="p-2.5 text-center text-slate-500">unit</td>
                <td className="p-2.5 text-right text-slate-700">
                  {Number(totals.totalActualArea || 0).toFixed(3)}
                </td>
                <td className="p-2.5 text-right text-slate-700">
                  {Number(totals.totalWeight || 0).toFixed(2)}
                </td>
                <td className="p-2.5 text-right text-slate-900">
                  {Number(totals.totalChargeableArea || 0).toFixed(3)}
                </td>
                <td colSpan={2} className="p-2.5 text-right uppercase text-slate-900">
                  Glass Total:
                </td>
                <td className="p-2.5 text-right text-primary-900 font-extrabold">
                  ₹{Number(totals.glassTotal || 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
                {!readOnly && <td></td>}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default GlassItemsTable;
