// import React from 'react';
// import Input from '../common/Input';
// import Badge from '../common/Badge';

// const InvoiceHeaderForm = ({
//   formData,
//   onChange,
//   readOnly = false
// }) => {
//   const handleFieldChange = (field, value) => {
//     onChange({
//       ...formData,
//       [field]: value
//     });
//   };

//   const lUnitUpper = String(formData.lengthUnit || 'MM').toUpperCase();
//   const extraUnitLabel = lUnitUpper === 'INCH' ? 'Inches' : lUnitUpper;

//   return (
//     <div className="bg-white rounded border border-slate-200 p-3.5 sm:p-5 shadow-xs">
//       {/* Top Header: Custom PI Number & Status */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
//         <div className="flex-1 w-full max-w-lg">
//           <label className="block text-xs font-bold text-primary-900 uppercase tracking-wider mb-1">
//             Proforma Invoice (PI) Number
//           </label>
//           {readOnly ? (
//             <span className="font-mono font-bold text-base sm:text-lg text-primary-900">
//               {formData.invoiceNumber || 'Auto-generated on Save'}
//             </span>
//           ) : (
//             <div>
//               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
//                 <input
//                   type="text"
//                   value={formData.invoiceNumber || ''}
//                   onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
//                   placeholder="e.g. PI-26-27-8521 (Leave blank for auto sequence)"
//                   className="w-full px-3 py-1.5 border border-primary-300 rounded font-mono font-bold text-primary-900 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 bg-amber-50/30"
//                 />
//                 {formData.invoiceNumber && (
//                   <button
//                     type="button"
//                     onClick={() => handleFieldChange('invoiceNumber', '')}
//                     className="text-xs text-slate-500 hover:text-rose-600 px-2.5 py-1.5 border border-slate-200 rounded whitespace-nowrap bg-white self-start sm:self-auto"
//                     title="Clear custom PI Number to use system auto-sequence"
//                   >
//                     Reset to Auto
//                   </button>
//                 )}
//               </div>
//               <span className="text-[11px] text-slate-500 mt-1 block">
//                 Type any custom PI number (e.g. <b>PI-26-27-8521</b>) or leave empty for auto-generated sequence.
//               </span>
//             </div>
//           )}
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto">
//           <span className="text-xs font-medium text-slate-500">Status:</span>
//           <Badge status={formData.invoiceStatus || 'Draft'} />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
//         {/* PI Date */}
//         <div>
//           <Input
//             label="Proforma Invoice Date"
//             type="date"
//             value={formData.invoiceDate ? formData.invoiceDate.split('T')[0] : ''}
//             onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
//             disabled={readOnly}
//             required
//           />
//         </div>

//         {/* PO Number */}
//         <div>
//           <Input
//             label="Customer PO Ref No"
//             value={formData.poNumber || ''}
//             onChange={(e) => handleFieldChange('poNumber', e.target.value)}
//             disabled={readOnly}
//             placeholder="e.g. PO-8521"
//           />
//         </div>

//         {/* Area Unit */}
//         <div>
//           <label className="text-xs font-semibold text-slate-700">Area Unit</label>
//           <select
//             value={formData.areaUnit || 'SQM'}
//             onChange={(e) => handleFieldChange('areaUnit', e.target.value)}
//             disabled={readOnly}
//             className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
//           >
//             <option value="SQM">SQM (Square Meter)</option>
//             <option value="SQFT">SQFT (Square Feet)</option>
//           </select>
//         </div>

//         {/* Length Unit */}
//         <div>
//           <label className="text-xs font-semibold text-slate-700">Length Unit</label>
//           <select
//             value={formData.lengthUnit || 'MM'}
//             onChange={(e) => handleFieldChange('lengthUnit', e.target.value)}
//             disabled={readOnly}
//             className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
//           >
//             <option value="MM">MM (Millimeter)</option>
//             <option value="INCH">INCH (Inches)</option>
//             <option value="CM">CM (Centimeter)</option>
//           </select>
//         </div>

//         {/* Extra (Matching Length Unit: MM, Inches, CM) */}
//         <div>
//           <label
//             className="text-xs font-semibold text-slate-700"
//             title={`Additional ${extraUnitLabel} added to both Length and Width before calculating Chargeable Area`}
//           >
//             Extra ({extraUnitLabel})
//           </label>
//           <input
//             type="text"
//             inputMode="decimal"
//             value={formData.extra !== undefined ? formData.extra : 0}
//             onChange={(e) => handleFieldChange('extra', e.target.value)}
//             disabled={readOnly}
//             placeholder="0"
//             className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white text-center font-bold text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//             title={`Extra ${extraUnitLabel} added to both L & W for all items in this PI`}
//           />
//         </div>

//         {/* Standard (Ceiling Rounding Up to Whole Inch) */}
//         <div>
//           <label className="text-xs font-semibold text-slate-700" title="Round both L & W up to the next whole inch (Math.ceil)">
//             Standard (Std)
//           </label>
//           <div className="mt-1 h-[30px] flex items-center px-2 py-1 bg-slate-50 border border-slate-300 rounded">
//             <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-800">
//               <input
//                 type="checkbox"
//                 checked={Boolean(formData.standard)}
//                 onChange={(e) => handleFieldChange('standard', e.target.checked)}
//                 disabled={readOnly}
//                 className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500 cursor-pointer accent-primary-600"
//               />
//               <span className="text-[11px] whitespace-nowrap">Round Up (Ceil)</span>
//             </label>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvoiceHeaderForm;





import React from 'react';
import Input from '../common/Input';
import Badge from '../common/Badge';

// Keeps each label on a single row (shows "…" if the column is too narrow)
// and lets inputs shrink inside grid cells without overflowing.
const fieldClass =
  'min-w-0 [&_label]:block [&_label]:whitespace-nowrap [&_label]:overflow-hidden [&_label]:text-ellipsis ' +
  '[&_input]:w-full [&_input]:min-w-0';

const labelClass =
  'block text-xs font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis';

const InvoiceHeaderForm = ({
  formData,
  onChange,
  readOnly = false
}) => {
  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const lUnitUpper = String(formData.lengthUnit || 'MM').toUpperCase();
  const extraUnitLabel = lUnitUpper === 'INCH' ? 'Inches' : lUnitUpper;

  return (
    <div className="bg-white rounded border border-slate-200 p-3.5 sm:p-5 shadow-xs">
      {/* Top Header: Custom PI Number & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-3">
        <div className="flex-1 min-w-0 w-full max-w-lg">
          <label className="block text-xs font-bold text-primary-900 uppercase tracking-wider mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
            Proforma Invoice (PI) Number
          </label>
          {readOnly ? (
            <span className="font-mono font-bold text-base sm:text-lg text-primary-900 break-all">
              {formData.invoiceNumber || 'Auto-generated on Save'}
            </span>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={formData.invoiceNumber || ''}
                  onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                  placeholder="e.g. PI-26-27-8521 (Leave blank for auto sequence)"
                  className="w-full min-w-0 px-3 py-1.5 border border-primary-300 rounded font-mono font-bold text-primary-900 text-xs sm:text-sm focus:ring-2 focus:ring-primary-500 bg-amber-50/30"
                />
                {formData.invoiceNumber && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange('invoiceNumber', '')}
                    className="shrink-0 text-xs text-slate-500 hover:text-rose-600 px-2.5 py-1.5 border border-slate-200 rounded whitespace-nowrap bg-white self-start sm:self-auto"
                    title="Clear custom PI Number to use system auto-sequence"
                  >
                    Reset to Auto
                  </button>
                )}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Type any custom PI number (e.g. <b>PI-26-27-8521</b>) or leave empty for auto-generated sequence.
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto shrink-0 whitespace-nowrap">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          <Badge status={formData.invoiceStatus || 'Draft'} />
        </div>
      </div>

      {/* 1 col phone, 2 col small tablet, 3 col tablet/laptop, 6 col wide desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
        {/* PI Date */}
        <div className={fieldClass}>
          <Input
            label="Proforma Invoice Date"
            type="date"
            value={formData.invoiceDate ? formData.invoiceDate.split('T')[0] : ''}
            onChange={(e) => handleFieldChange('invoiceDate', e.target.value)}
            disabled={readOnly}
            required
          />
        </div>

        {/* PO Number */}
        <div className={fieldClass}>
          <Input
            label="Customer PO Ref No"
            value={formData.poNumber || ''}
            onChange={(e) => handleFieldChange('poNumber', e.target.value)}
            disabled={readOnly}
            placeholder="e.g. PO-8521"
          />
        </div>

        {/* Area Unit */}
        <div className="min-w-0">
          <label className={labelClass}>Area Unit</label>
          <select
            value={formData.areaUnit || 'SQM'}
            onChange={(e) => handleFieldChange('areaUnit', e.target.value)}
            disabled={readOnly}
            className="w-full min-w-0 mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
          >
            <option value="SQM">SQM (Square Meter)</option>
            <option value="SQFT">SQFT (Square Feet)</option>
          </select>
        </div>

        {/* Length Unit */}
        <div className="min-w-0">
          <label className={labelClass}>Length Unit</label>
          <select
            value={formData.lengthUnit || 'MM'}
            onChange={(e) => handleFieldChange('lengthUnit', e.target.value)}
            disabled={readOnly}
            className="w-full min-w-0 mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
          >
            <option value="MM">MM (Millimeter)</option>
            <option value="INCH">INCH (Inches)</option>
            <option value="CM">CM (Centimeter)</option>
          </select>
        </div>

        {/* Extra (Matching Length Unit: MM, Inches, CM) */}
        <div className="min-w-0">
          <label
            className={labelClass}
            title={`Additional ${extraUnitLabel} added to both Length and Width before calculating Chargeable Area`}
          >
            Extra ({extraUnitLabel})
          </label>
          <input
            type="text"
            inputMode="decimal"
            value={formData.extra !== undefined ? formData.extra : 0}
            onChange={(e) => handleFieldChange('extra', e.target.value)}
            disabled={readOnly}
            placeholder="0"
            className="w-full min-w-0 mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white text-center font-bold text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            title={`Extra ${extraUnitLabel} added to both L & W for all items in this PI`}
          />
        </div>

        {/* Standard (Ceiling Rounding Up to Whole Inch) */}
        <div className="min-w-0">
          <label className={labelClass} title="Round both L & W up to the next whole inch (Math.ceil)">
            Standard (Std)
          </label>
          <div className="mt-1 h-[30px] flex items-center px-2 py-1 bg-slate-50 border border-slate-300 rounded">
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-800">
              <input
                type="checkbox"
                checked={Boolean(formData.standard)}
                onChange={(e) => handleFieldChange('standard', e.target.checked)}
                disabled={readOnly}
                className="w-4 h-4 shrink-0 text-primary-600 rounded border-slate-300 focus:ring-primary-500 cursor-pointer accent-primary-600"
              />
              <span className="text-[11px] whitespace-nowrap">Round Up (Ceil)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeaderForm;