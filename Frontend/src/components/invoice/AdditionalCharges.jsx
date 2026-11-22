// import React from 'react';
// import Input from '../common/Input';

// const AdditionalCharges = ({
//   charges = {},
//   onChange,
//   readOnly = false
// }) => {
//   const handleChange = (field, value) => {
//     onChange({
//       ...charges,
//       [field]: value
//     });
//   };

//   return (
//     <div className="bg-white rounded border border-slate-200 p-3.5 sm:p-5 shadow-xs">
//       <h3 className="text-xs sm:text-sm font-bold text-primary-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">
//         3. Additional Charges Configuration
//       </h3>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
//         {/* Insurance % */}
//         <div>
//           <Input
//             label="Insurance & Handling (%)"
//             type="text"
//             inputMode="decimal"
//             placeholder="0.00"
//             value={charges.insurancePercent !== undefined ? charges.insurancePercent : ''}
//             onChange={(e) => handleChange('insurancePercent', e.target.value)}
//             disabled={readOnly}
//             helperText={`Amount: ₹${Number(charges.insuranceAmount || 0).toFixed(2)}`}
//           />
//         </div>

//         {/* Document Charge */}
//         <div>
//           <Input
//             label="Document Charge (₹)"
//             type="text"
//             inputMode="decimal"
//             placeholder="0.00"
//             value={charges.documentCharge !== undefined ? charges.documentCharge : ''}
//             onChange={(e) => handleChange('documentCharge', e.target.value)}
//             disabled={readOnly}
//             helperText="Default standard administrative charge"
//           />
//         </div>

//         {/* Other Additional Charges */}
//         <div>
//           <Input
//             label="Other Additional Charges (₹)"
//             type="text"
//             inputMode="decimal"
//             value={charges.otherCharges !== undefined ? charges.otherCharges : ''}
//             onChange={(e) => handleChange('otherCharges', e.target.value)}
//             disabled={readOnly}
//             placeholder="0.00"
//             helperText="Freight / packing / special surcharges"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdditionalCharges;




import React from 'react';
import Input from '../common/Input';

// Keeps each label and helper line on a single row (truncates with "…" if the
// column is too narrow) without needing changes inside the shared Input component.
const fieldClass =
  'min-w-0 [&_label]:block [&_label]:whitespace-nowrap [&_label]:overflow-hidden [&_label]:text-ellipsis ' +
  '[&_p]:whitespace-nowrap [&_p]:overflow-hidden [&_p]:text-ellipsis ' +
  '[&_input]:w-full [&_input]:min-w-0';

const AdditionalCharges = ({
  charges = {},
  onChange,
  readOnly = false
}) => {
  const handleChange = (field, value) => {
    onChange({
      ...charges,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded border border-slate-200 p-3.5 sm:p-5 shadow-xs">
      <h3 className="text-xs sm:text-sm font-bold text-primary-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">
        3. Additional Charges Configuration
      </h3>

      {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {/* Insurance % */}
        <div className={fieldClass}>
          <Input
            label="Insurance & Handling (%)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={charges.insurancePercent !== undefined ? charges.insurancePercent : ''}
            onChange={(e) => handleChange('insurancePercent', e.target.value)}
            disabled={readOnly}
            helperText={`Amount: ₹${Number(charges.insuranceAmount || 0).toFixed(2)}`}
          />
        </div>

        {/* Document Charge */}
        <div className={fieldClass}>
          <Input
            label="Document Charge (₹)"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={charges.documentCharge !== undefined ? charges.documentCharge : ''}
            onChange={(e) => handleChange('documentCharge', e.target.value)}
            disabled={readOnly}
            helperText="Default standard administrative charge"
          />
        </div>

        {/* Other Additional Charges */}
        <div className={`${fieldClass} sm:col-span-2 lg:col-span-1`}>
          <Input
            label="Other Additional Charges (₹)"
            type="text"
            inputMode="decimal"
            value={charges.otherCharges !== undefined ? charges.otherCharges : ''}
            onChange={(e) => handleChange('otherCharges', e.target.value)}
            disabled={readOnly}
            placeholder="0.00"
            helperText="Freight / packing / special surcharges"
          />
        </div>
      </div>
    </div>
  );
};

export default AdditionalCharges;