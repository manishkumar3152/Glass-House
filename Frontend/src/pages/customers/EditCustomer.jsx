import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchCustomerById, updateCustomer } from '../../redux/slices/customerSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { IoArrowBackOutline, IoSaveOutline } from 'react-icons/io5';

const EditCustomer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedCustomer, loading } = useSelector((state) => state.customers);

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

  useEffect(() => {
    if (id) {
      dispatch(fetchCustomerById(id));
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
    }
  }, [selectedCustomer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateCustomer({ id, data: formData }));
    if (updateCustomer.fulfilled.match(result)) {
      navigate('/customers');
    }
  };

  if (loading && !selectedCustomer) {
    return <Loader text="Loading customer details..." />;
  }

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
            <h2 className="text-lg font-bold text-slate-800">Edit Customer Master</h2>
            <p className="text-xs text-slate-500">{formData.customerName}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="Update Customer Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

          <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-slate-200">
            <Link to="/customers">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline}>
              Update Customer
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default EditCustomer;
