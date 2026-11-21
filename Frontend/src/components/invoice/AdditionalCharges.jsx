import React from 'react';
import Input from '../common/Input';

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
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
      <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">
        3. Additional Charges Configuration
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Insurance % */}
        <div>
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
        <div>
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
        <div>
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
