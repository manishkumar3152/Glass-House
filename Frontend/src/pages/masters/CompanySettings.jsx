import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompany, updateCompany } from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { IoSaveOutline, IoBusinessOutline } from 'react-icons/io5';

const CompanySettings = () => {
  const dispatch = useDispatch();
  const { company, loading } = useSelector((state) => state.masters);

  const [formData, setFormData] = useState({
    companyName: '',
    tagline: '',
    address: '',
    city: '',
    state: '',
    stateCode: '',
    pinCode: '',
    phone: '',
    email: '',
    website: '',
    cin: '',
    gstin: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    accountHolderName: '',
    authorizedSignatory: ''
  });

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        tagline: company.tagline || '',
        address: company.address || '',
        city: company.city || '',
        state: company.state || '',
        stateCode: company.stateCode || '07',
        pinCode: company.pinCode || '',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        cin: company.cin || '',
        gstin: company.gstin || '',
        bankName: company.bankName || '',
        accountNumber: company.accountNumber || '',
        ifscCode: company.ifscCode || '',
        branch: company.branch || '',
        accountHolderName: company.accountHolderName || '',
        authorizedSignatory: company.authorizedSignatory || 'Authorized Signatory'
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateCompany(formData));
  };

  if (loading && !company) {
    return <Loader text="Loading company details..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-900 shrink-0">
            <IoBusinessOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Company Master Settings</h2>
            <p className="text-xs text-slate-500">
              Details configured here automatically appear on all generated proforma invoices and bank receipts.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        {/* Business Credentials */}
        <Card title="Corporate Details & Registration">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <Input
              label="Company Legal Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <Input
              label="Tagline / Subheading"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
            />
            <Input
              label="GSTIN"
              name="gstin"
              value={formData.gstin}
              onChange={handleChange}
              required
            />
            <Input
              label="Corporate Identity Number (CIN)"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700">Works / Factory Address *</label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            <Input label="State Code" name="stateCode" value={formData.stateCode} onChange={handleChange} />
            <Input label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
            <Input label="Office Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Official Email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
            <Input
              label="Authorized Signatory Designation"
              name="authorizedSignatory"
              value={formData.authorizedSignatory}
              onChange={handleChange}
            />
          </div>
        </Card>

        {/* Bank Credentials */}
        <Card title="Bank Account Details (Appears on Page 2 for RTGS/NEFT)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
            <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            <Input label="IFSC / RTGS Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            <Input label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
            <div className="md:col-span-2">
              <Input
                label="Account Beneficiary Name"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline} size="lg">
            Save Company Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
