import React from 'react';
import Input from '../common/Input';

const CustomerDetailsForm = ({
  formData,
  customers = [],
  onChange,
  onCustomerSelect,
  readOnly = false
}) => {
  const handleSelectCustomer = (e) => {
    const customerId = e.target.value;
    const selected = customers.find((c) => c._id === customerId);
    if (selected) {
      onCustomerSelect(selected);
    } else {
      onCustomerSelect(null);
    }
  };

  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-primary-900 uppercase tracking-wide">
          Customer & Delivery Information
        </h3>
        {!readOnly && (
          <div className="w-full sm:w-72">
            <select
              value={formData.customer || ''}
              onChange={handleSelectCustomer}
              className="w-full px-3 py-1.5 text-xs font-semibold border border-primary-300 rounded-md bg-primary-50/50 text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Choose Existing Customer --</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName} ({c.city || 'N/A'})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Billing Address Column */}
        <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
            Buyer / Billing Address
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Billing Address *</label>
            <textarea
              rows={3}
              value={formData.billingAddress || ''}
              onChange={(e) => handleFieldChange('billingAddress', e.target.value)}
              disabled={readOnly}
              placeholder="Full billing address..."
              className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none disabled:bg-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Contact Person"
              value={formData.contactPerson || ''}
              onChange={(e) => handleFieldChange('contactPerson', e.target.value)}
              disabled={readOnly}
            />
            <Input
              label="Contact Phone"
              value={formData.contactNumber || ''}
              onChange={(e) => handleFieldChange('contactNumber', e.target.value)}
              disabled={readOnly}
            />
          </div>
          <div>
            <Input
              label="Customer GSTIN"
              value={formData.customerGSTIN || ''}
              onChange={(e) => handleFieldChange('customerGSTIN', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. 08AAACA5555M1Z2"
            />
          </div>
        </div>

        {/* Delivery / Shipping Column */}
        <div className="space-y-3 bg-slate-50/70 p-3.5 rounded-lg border border-slate-200">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-1">
            Consignee / Site Delivery
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700">Delivery Address</label>
            <textarea
              rows={3}
              value={formData.deliveryAddress || ''}
              onChange={(e) => handleFieldChange('deliveryAddress', e.target.value)}
              disabled={readOnly}
              placeholder="Site delivery address (leave blank to use billing address)..."
              className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none disabled:bg-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Expected Delivery Date"
              type="date"
              value={formData.deliveryDate ? formData.deliveryDate.split('T')[0] : ''}
              onChange={(e) => handleFieldChange('deliveryDate', e.target.value)}
              disabled={readOnly}
            />
            <Input
              label="PO Reference Number"
              value={formData.poNumber || ''}
              onChange={(e) => handleFieldChange('poNumber', e.target.value)}
              disabled={readOnly}
              placeholder="e.g. PO-8521"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsForm;
