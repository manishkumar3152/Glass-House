import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import GlassItemRow from './GlassItemRow';
import Button from '../common/Button';
import SelectionToolbar from '../common/SelectionToolbar';
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
  onBulkRemove,
  readOnly = false
}) => {
  const [selectedIndices, setSelectedIndices] = useState([]);

  // Keep selection clean if items array changes
  useEffect(() => {
    setSelectedIndices((prev) => prev.filter((i) => i < items.length));
  }, [items.length]);

  const lUnitLabel = String(lengthUnit).toUpperCase() === 'INCH' ? 'inch' : 'mm';
  const aUnitLabel = String(areaUnit).toUpperCase() === 'SQFT' ? 'Sqft' : 'Sqm';

  const toggleSelect = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === items.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(items.map((_, i) => i));
    }
  };

  const handleBulkDelete = () => {
    if (items.length - selectedIndices.length < 1) {
      toast.error('An invoice must have at least one glass item');
      return;
    }

    if (onBulkRemove) {
      onBulkRemove(selectedIndices);
    } else {
      // Remove in descending index order to avoid offset issues
      const sorted = [...selectedIndices].sort((a, b) => b - a);
      sorted.forEach((idx) => onRemoveItem(idx));
    }

    toast.success(`Removed ${selectedIndices.length} glass item(s)`);
    setSelectedIndices([]);
  };

  const handleBulkUnitChange = (newUnit) => {
    selectedIndices.forEach((idx) => {
      if (items[idx]) {
        onItemChange(idx, {
          ...items[idx],
          unit: newUnit
        });
      }
    });
    toast.success(`Updated unit to "${newUnit}" for ${selectedIndices.length} item(s)`);
    setSelectedIndices([]);
  };

  const isAllSelected = items.length > 0 && selectedIndices.length === items.length;

  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
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

      {/* Scrolls sideways on small screens; page itself never scrolls horizontally */}
      <div className="overflow-x-auto overscroll-x-contain max-h-[500px]">
        <table className="w-full text-left border-collapse min-w-[1150px]">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] sticky top-0 z-10 border-b border-slate-300">
            <tr className="whitespace-nowrap">
              {!readOnly && (
                <th className="p-2.5 min-w-[40px] w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                    title={isAllSelected ? 'Deselect all' : 'Select all'}
                  />
                </th>
              )}
              <th className="p-2.5 min-w-[240px]">Specification</th>
              <th className="p-2.5 text-right min-w-[96px]">L ({lUnitLabel})</th>
              <th className="p-2.5 text-right min-w-[96px]">W ({lUnitLabel})</th>
              <th className="p-2.5 text-right min-w-[72px]">Qty</th>
              <th className="p-2.5 text-center min-w-[80px]">Unit</th>
              <th className="p-2.5 text-right min-w-[110px]">Act Area ({aUnitLabel})</th>
              <th className="p-2.5 text-right min-w-[100px]">Weight (Kg)</th>
              <th className="p-2.5 text-right min-w-[110px]">Chrg Area ({aUnitLabel})</th>
              <th className="p-2.5 text-right min-w-[100px]">Rate (₹)</th>
              <th className="p-2.5 text-center min-w-[90px]">Per</th>
              <th className="p-2.5 text-right min-w-[130px]">Amount (₹)</th>
              {!readOnly && <th className="p-2.5 text-center min-w-[56px]">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 11 : 13}
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
                  isSelected={selectedIndices.includes(idx)}
                  onToggleSelect={toggleSelect}
                />
              ))
            )}
          </tbody>

          {/* Subtotal Row */}
          {items.length > 0 && (
            <tfoot className="bg-slate-100 font-bold text-xs text-slate-800 border-t-2 border-slate-300 whitespace-nowrap">
              <tr>
                {!readOnly && <td className="p-2.5"></td>}
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

      {/* Reusable SelectionToolbar for Invoice Glass Items */}
      {!readOnly && (
        <SelectionToolbar
          selectedCount={selectedIndices.length}
          totalCount={items.length}
          onClearSelection={() => setSelectedIndices([])}
          onSelectAll={toggleSelectAll}
          onDelete={handleBulkDelete}
          deleteLabel={`Delete (${selectedIndices.length})`}
          statusOptions={['unit', 'NOS', 'PCS']}
          onStatusChange={handleBulkUnitChange}
          statusLabel="Change Unit"
          itemLabel="glass items"
        />
      )}
    </div>
  );
};

export default GlassItemsTable;
