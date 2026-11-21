import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createCustomer } from '../../redux/slices/customerSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { IoArrowBackOutline, IoSaveOutline } from 'react-icons/io5';

const CreateCustomer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.customers);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createCustomer(formData));
    if (createCustomer.fulfilled.match(result)) {
      navigate('/customers');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/customers"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Add New Customer</h2>
            <p className="text-xs text-slate-500">Register customer master record</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="Customer Master Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Customer / Business Name"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="e.g. Ajay Glass House"
            />

            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              placeholder="e.g. 08AAACA5555M1Z2"
            />

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Billing Address *</label>
              <textarea
                name="billingAddress"
                rows={2}
                value={formData.billingAddress}
                onChange={handleChange}
                required
                placeholder="Full billing address..."
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
                placeholder="Default delivery / warehouse site address..."
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <Input
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. Mr. Ajay Sharma"
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98290 85210"
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. ajayglasshouse@gmail.com"
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Jaipur"
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Rajasthan"
            />

            <Input
              label="State Code"
              name="stateCode"
              value={formData.stateCode}
              onChange={handleChange}
              placeholder="e.g. 08"
            />

            <Input
              label="PIN Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="e.g. 302013"
            />

            <div>
              <label className="text-xs font-semibold text-slate-700">Customer Type</label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
              >
                <option value="B2B">B2B (Business)</option>
                <option value="Dealer">Dealer</option>
                <option value="Contractor">Contractor</option>
                <option value="Fabricator">Fabricator</option>
                <option value="Retailer">Retailer</option>
                <option value="B2C">B2C (Individual)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-200">
            <Link to="/customers">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline}>
              Save Customer
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CreateCustomer;
