import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchCustomerById, updateCustomer } from '../../redux/slices/customerSlice';
import { fetchGlassSpecifications } from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { IoArrowBackOutline, IoSaveOutline, IoRefreshOutline } from 'react-icons/io5';

const EditCustomer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCustomer, loading } = useSelector((state) => state.customers);
  const { glassSpecifications } = useSelector((state) => state.masters);

  const [formData, setFormData] = useState({
    customerName: '',
    billingAddress: '',
    deliveryAddress: '',
    city: '',
    state: '',
    stateCode: '',
    pinCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    gstin: '',
    customerType: 'B2B',
    status: 'Active'
  });

  // Rates for this customer: { [specId]: { rate: '', per: 'SQFT' } }
  const [customerRates, setCustomerRates] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
      dispatch(fetchGlassSpecifications());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData({
        customerName: selectedCustomer.customerName || '',
        billingAddress: selectedCustomer.billingAddress || '',
        deliveryAddress: selectedCustomer.deliveryAddress || '',
        city: selectedCustomer.city || '',
        state: selectedCustomer.state || '',
        stateCode: selectedCustomer.stateCode || '',
        pinCode: selectedCustomer.pinCode || '',
        contactPerson: selectedCustomer.contactPerson || '',
        phone: selectedCustomer.phone || '',
        email: selectedCustomer.email || '',
        gstin: selectedCustomer.gstin || '',
        customerType: selectedCustomer.customerType || 'B2B',
        status: selectedCustomer.status || 'Active'
      });

      // Pre-populate customer rates from existing customer record
      const initialRates = {};
      if (selectedCustomer.glassRates && Array.isArray(selectedCustomer.glassRates)) {
        selectedCustomer.glassRates.forEach((r) => {
          const specId = r.glassSpecification?._id || r.glassSpecification;
          if (specId) {
            initialRates[specId] = {
              rate: r.rate !== undefined && r.rate !== null ? r.rate : '',
              per: r.per || 'SQFT'
            };
          }
        });
      }
      setCustomerRates(initialRates);
    }
  }, [selectedCustomer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRateChange = (specId, field, value) => {
    setCustomerRates((prev) => {
      const existing = prev[specId] || {};
      return {
        ...prev,
        [specId]: {
          ...existing,
          [field]: value
        }
      };
    });
  };

  const handleResetRate = (specId, defaultPer) => {
    setCustomerRates((prev) => {
      const next = { ...prev };
      delete next[specId];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare customer specific glass rates
    const glassRatesPayload = Object.entries(customerRates)
      .filter(([specId, data]) => data && data.rate !== '' && !isNaN(data.rate) && Number(data.rate) > 0)
      .map(([specId, data]) => ({
        glassSpecification: specId,
        rate: Number(data.rate),
        per: data.per || 'SQFT'
      }));

    const payload = {
      ...formData,
      glassRates: glassRatesPayload
    };

    const result = await dispatch(updateCustomer({ id, data: payload }));
    if (updateCustomer.fulfilled.match(result)) {
      navigate('/customers');
    }
  };

  if (loading && !selectedCustomer) {
    return <Loader text="Loading customer details..." />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/customers"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Edit Customer Master</h2>
            <p className="text-xs text-slate-500 truncate max-w-sm">{formData.customerName}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="Update Customer Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5">
            <Input
              label="Customer / Business Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />

            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
            />

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Billing Address *</label>
              <textarea
                name="billingAddress"
                rows={2}
                value={formData.billingAddress}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Delivery Address</label>
              <textarea
                name="deliveryAddress"
                rows={2}
                value={formData.deliveryAddress}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <Input
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />

            <Input
              label="State Code"
              name="stateCode"
              value={formData.stateCode}
              onChange={handleChange}
            />

            <Input
              label="PIN Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
            />

            <div>
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Customer Specific Glass Rates Card */}
        <div className="mt-5">
          <Card
            title="Customer Specific Glass Rates"
            subtitle="Configure custom glass rates for this customer. If left blank or 0, the specification's default master rate will be automatically picked up when creating invoices."
          >
            {glassSpecifications && glassSpecifications.length > 0 ? (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse text-xs min-w-[680px]">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-300">
                    <tr>
                      <th className="p-3">Glass Specification</th>
                      <th className="p-3 text-center w-24">Thickness</th>
                      <th className="p-3 text-right w-36">Master Default Rate</th>
                      <th className="p-3 text-right w-44">Customer Rate (₹)</th>
                      <th className="p-3 text-center w-32">Rate Unit (Per)</th>
                      <th className="p-3 text-center w-24">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {glassSpecifications.map((spec) => {
                      const specId = spec._id;
                      const current = customerRates[specId] || { rate: '', per: spec.rateUnit || 'SQFT' };
                      const hasCustom = current.rate !== '' && !isNaN(current.rate) && Number(current.rate) > 0;
                      return (
                        <tr
                          key={specId}
                          className={hasCustom ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'}
                        >
                          <td className="p-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-2">
                              <span>{spec.glassName}</span>
                              {hasCustom && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                                  Custom
                                </span>
                              )}
                            </div>
                            {spec.glassCode && (
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">Code: {spec.glassCode}</div>
                            )}
                          </td>
                          <td className="p-3 text-center font-mono font-medium text-slate-600">
                            {spec.thickness} mm
                          </td>
                          <td className="p-3 text-right font-mono text-slate-600">
                            ₹{Number(spec.defaultRate || 0).toFixed(2)} / {spec.rateUnit || 'SQFT'}
                          </td>
                          <td className="p-3 text-right">
                            <div className="relative">
                              <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">₹</span>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={current.rate !== undefined ? current.rate : ''}
                                onChange={(e) => handleRateChange(specId, 'rate', e.target.value)}
                                placeholder={`Default (${Number(spec.defaultRate || 0).toFixed(2)})`}
                                className="w-full pl-6 pr-2 py-1 text-right text-xs font-bold text-slate-900 border border-slate-300 rounded focus:ring-1 focus:ring-primary-500 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={current.per || spec.rateUnit || 'SQFT'}
                              onChange={(e) => handleRateChange(specId, 'per', e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white text-center font-medium"
                            >
                              <option value="SQFT">Sqft</option>
                              <option value="SQM">Sqm</option>
                              <option value="NOS">NOS</option>
                              <option value="UNIT">UNIT</option>
                            </select>
                          </td>
                          <td className="p-3 text-center">
                            {hasCustom ? (
                              <button
                                type="button"
                                onClick={() => handleResetRate(specId, spec.rateUnit)}
                                className="text-[11px] text-rose-600 hover:text-rose-800 font-medium underline"
                                title="Reset back to specification default rate"
                              >
                                Reset
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">Default</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs italic">
                No glass specifications found. Please configure specifications in Glass Specs Master.
              </div>
            )}
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-end gap-2.5 sm:gap-3 pt-4 sm:pt-5 mt-4 sm:mt-5">
          <Link to="/customers">
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline}>
            Update Customer & Rates
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
