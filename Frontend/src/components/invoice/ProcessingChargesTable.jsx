import React from 'react';
import Button from '../common/Button';
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5';

const ProcessingChargesTable = ({
  items = [],
  totalProcessingCost = 0,
  processingMaster = [],
  onChange,
  onAddItem,
  onRemoveItem,
  readOnly = false
}) => {
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

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wide">
          2. Processing & Value-Added Charges ({items.length})
        </h3>
        {!readOnly && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onAddItem}
            icon={IoAddOutline}
          >
            Add Processing Charge
          </Button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-300">
            <tr>
              <th className="p-2.5">Charge Name / Description</th>
              <th className="p-2.5 text-right w-24">Qty</th>
              <th className="p-2.5 text-center w-20">Unit</th>
              <th className="p-2.5 text-right w-28">Rate (₹)</th>
              <th className="p-2.5 text-center w-20">Per</th>
              <th className="p-2.5 text-right w-32">Amount (₹)</th>
              {!readOnly && <th className="p-2.5 text-center w-12">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={readOnly ? 6 : 7}
                  className="p-4 text-center text-slate-400 italic"
                >
                  No processing charges added.
                </td>
              </tr>
            ) : (
              items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2">
                    {readOnly ? (
                      <span className="font-semibold text-slate-800">{item.name}</span>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          value={item.processingId || ''}
                          onChange={(e) => handleSelectPredefined(idx, e.target.value)}
                          className="px-2 py-1 border border-slate-300 rounded text-xs w-48 font-medium"
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
                          className="flex-1 px-2 py-1 border border-slate-300 rounded text-xs"
                        />
                      </div>
                    )}
                  </td>
                  <td className="p-2 w-24">
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
                  <td className="p-2 w-20 text-center">
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
                  <td className="p-2 w-28">
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
                  <td className="p-2 w-20 text-center">
                    <span>{item.per || item.unit || 'NOS'}</span>
                  </td>
                  <td className="p-2 w-32 text-right font-bold text-slate-900">
                    ₹{Number(item.amount || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  {!readOnly && (
                    <td className="p-2 w-12 text-center">
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      >
                        <IoTrashOutline className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>

          {items.length > 0 && (
            <tfoot className="bg-slate-100 font-bold text-xs border-t-2 border-slate-300">
              <tr>
                <td colSpan={5} className="p-2.5 text-right uppercase text-slate-900">
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
    </div>
  );
};

export default ProcessingChargesTable;
