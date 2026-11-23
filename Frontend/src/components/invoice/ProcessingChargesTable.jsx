import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import SelectionToolbar from '../common/SelectionToolbar';
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5';

const ProcessingChargesTable = ({
  items = [],
  totalProcessingCost = 0,
  processingMaster = [],
  onChange,
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
    if (onBulkRemove) {
      onBulkRemove(selectedIndices);
    } else {
      const sorted = [...selectedIndices].sort((a, b) => b - a);
      sorted.forEach((idx) => onRemoveItem(idx));
    }
    toast.success(`Removed ${selectedIndices.length} processing charge(s)`);
    setSelectedIndices([]);
  };

  const handleBulkUnitChange = (newUnit) => {
    selectedIndices.forEach((idx) => {
      if (items[idx]) {
        onChange(idx, {
          ...items[idx],
          unit: newUnit,
          per: newUnit
        });
      }
    });
    toast.success(`Updated unit to "${newUnit}" for ${selectedIndices.length} charge(s)`);
    setSelectedIndices([]);
  };

  const handleSelectPredefined = (index, chargeId) => {
    const selected = processingMaster.find((p) => p._id === chargeId);
    if (selected) {
      const current = items[index];
      onChange(index, {
        ...current,
        name: selected.name,
        processingId: selected._id,
        rate: selected.rate,
        unit: selected.unit,
        per: selected.unit
      });
    }
  };

  const handleFieldChange = (index, field, value) => {
    const current = items[index];
    const nextQty = field === 'quantity' ? value : current.quantity;
    const nextRate = field === 'rate' ? value : current.rate;
    const q = Number(nextQty) || 0;
    const r = Number(nextRate) || 0;
    const amount = q > 0 && r > 0 ? Number((q * r).toFixed(2)) : 0;

    onChange(index, {
      ...current,
      [field]: value,
      amount
    });
  };

  const isAllSelected = items.length > 0 && selectedIndices.length === items.length;

  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-xs">
      <div className="px-3.5 sm:px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <h3 className="text-xs sm:text-sm font-bold text-primary-900 uppercase tracking-wide">
          2. Processing & Value-Added Charges ({items.length})
        </h3>
        {!readOnly && (
          <div className="self-start sm:self-auto">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onAddItem}
              icon={IoAddOutline}
            >
              Add Processing Charge
            </Button>
          </div>
        )}
      </div>

      {/* Scrolls sideways on small screens; page itself never scrolls horizontally */}
      <div className="overflow-x-auto overscroll-x-contain">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-300">
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
              <th className="p-2.5 min-w-[340px]">Charge Name / Description</th>
              <th className="p-2.5 text-right min-w-[90px]">Qty</th>
              <th className="p-2.5 text-center min-w-[90px]">Unit</th>
              <th className="p-2.5 text-right min-w-[110px]">Rate (₹)</th>
              <th className="p-2.5 text-center min-w-[80px]">Per</th>
              <th className="p-2.5 text-right min-w-[130px]">Amount (₹)</th>
              {!readOnly && <th className="p-2.5 text-center min-w-[56px]">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 6 : 8}
                  className="p-4 text-center text-slate-400 italic"
                >
                  No processing charges added.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const isSelected = selectedIndices.includes(idx);
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 whitespace-nowrap transition-colors ${
                      isSelected ? 'bg-primary-50/40' : ''
                    }`}
                  >
                    {!readOnly && (
                      <td className="p-2 min-w-[40px] w-10 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(idx)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                          title="Select charge"
                        />
                      </td>
                    )}
                    <td className="p-2 min-w-[340px]">
                      {readOnly ? (
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      ) : (
                        <div className="flex gap-2">
                          <select
                            value={item.processingId || ''}
                            onChange={(e) => handleSelectPredefined(idx, e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded text-xs w-48 shrink-0 font-medium"
                          >
                            <option value="">-- Preset Charge --</option>
                            {processingMaster.map((p) => (
                              <option key={p._id} value={p._id}>
                                {p.name} (₹{p.rate}/{p.unit})
                              </option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="Custom charge name"
                            value={item.name || ''}
                            onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
                            className="flex-1 min-w-[140px] px-2 py-1 border border-slate-300 rounded text-xs"
                          />
                        </div>
                      )}
                    </td>
                    <td className="p-2 min-w-[90px]">
                      {readOnly ? (
                        <span className="text-right block">{item.quantity}</span>
                      ) : (
                        <input
                          type="text"
                          inputMode="decimal"
                          value={item.quantity !== undefined ? item.quantity : ''}
                          onChange={(e) => handleFieldChange(idx, 'quantity', e.target.value)}
                          className="w-full text-right px-2 py-1 border border-slate-300 rounded text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Qty"
                        />
                      )}
                    </td>
                    <td className="p-2 min-w-[90px] text-center">
                      {readOnly ? (
                        <span>{item.unit || 'unit'}</span>
                      ) : (
                        <select
                          value={item.unit || 'unit'}
                          onChange={(e) => handleFieldChange(idx, 'unit', e.target.value)}
                          className="w-full px-1 py-1 border border-slate-300 rounded text-xs text-center"
                        >
                          <option value="unit">unit</option>
                          <option value="NOS">NOS</option>
                          <option value="RFT">RFT</option>
                          <option value="SQFT">SQFT</option>
                          <option value="PCS">PCS</option>
                        </select>
                      )}
                    </td>
                    <td className="p-2 min-w-[110px]">
                      {readOnly ? (
                        <span className="text-right block">{item.rate !== '' && !isNaN(item.rate) ? Number(item.rate).toFixed(2) : ''}</span>
                      ) : (
                        <input
                          type="text"
                          inputMode="decimal"
                          value={item.rate !== undefined ? item.rate : ''}
                          onChange={(e) => handleFieldChange(idx, 'rate', e.target.value)}
                          className="w-full text-right px-2 py-1 border border-slate-300 rounded text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="0.00"
                        />
                      )}
                    </td>
                    <td className="p-2 min-w-[80px] text-center">
                      <span>{item.per || item.unit || 'NOS'}</span>
                    </td>
                    <td className="p-2 min-w-[130px] text-right font-bold text-slate-900">
                      ₹{Number(item.amount || 0).toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </td>
                    {!readOnly && (
                      <td className="p-2 min-w-[56px] text-center">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete row"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>

          {items.length > 0 && (
            <tfoot className="bg-slate-100 font-bold text-xs border-t-2 border-slate-300 whitespace-nowrap">
              <tr>
                <td colSpan={readOnly ? 5 : 6} className="p-2.5 text-right uppercase text-slate-900">
                  Total Processing Cost:
                </td>
                <td className="p-2.5 text-right text-primary-900 font-extrabold">
                  ₹{Number(totalProcessingCost || 0).toLocaleString('en-IN', {
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

      {/* Reusable SelectionToolbar for Processing Charges */}
      {!readOnly && (
        <SelectionToolbar
          selectedCount={selectedIndices.length}
          totalCount={items.length}
          onClearSelection={() => setSelectedIndices([])}
          onSelectAll={toggleSelectAll}
          onDelete={handleBulkDelete}
          deleteLabel={`Delete (${selectedIndices.length})`}
          statusOptions={['unit', 'NOS', 'RFT', 'SQFT', 'SQM', 'PCS']}
          onStatusChange={handleBulkUnitChange}
          statusLabel="Change Unit"
          itemLabel="processing items"
        />
      )}
    </div>
  );
};

export default ProcessingChargesTable;
