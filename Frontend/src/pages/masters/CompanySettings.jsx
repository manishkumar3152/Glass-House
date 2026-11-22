// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCompany, updateCompany } from '../../redux/slices/masterSlice';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Loader from '../../components/common/Loader';
// import { IoSaveOutline, IoBusinessOutline } from 'react-icons/io5';

// const CompanySettings = () => {
//   const dispatch = useDispatch();
//   const { company, loading } = useSelector((state) => state.masters);

//   const [formData, setFormData] = useState({
//     companyName: '',
//     tagline: '',
//     address: '',
//     city: '',
//     state: '',
//     stateCode: '',
//     pinCode: '',
//     phone: '',
//     email: '',
//     website: '',
//     cin: '',
//     gstin: '',
//     bankName: '',
//     accountNumber: '',
//     ifscCode: '',
//     branch: '',
//     accountHolderName: '',
//     authorizedSignatory: ''
//   });

//   useEffect(() => {
//     dispatch(fetchCompany());
//   }, [dispatch]);

//   useEffect(() => {
//     if (company) {
//       setFormData({
//         companyName: company.companyName || '',
//         tagline: company.tagline || '',
//         address: company.address || '',
//         city: company.city || '',
//         state: company.state || '',
//         stateCode: company.stateCode || '07',
//         pinCode: company.pinCode || '',
//         phone: company.phone || '',
//         email: company.email || '',
//         website: company.website || '',
//         cin: company.cin || '',
//         gstin: company.gstin || '',
//         bankName: company.bankName || '',
//         accountNumber: company.accountNumber || '',
//         ifscCode: company.ifscCode || '',
//         branch: company.branch || '',
//         accountHolderName: company.accountHolderName || '',
//         authorizedSignatory: company.authorizedSignatory || 'Authorized Signatory'
//       });
//     }
//   }, [company]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(updateCompany(formData));
//   };

//   if (loading && !company) {
//     return <Loader text="Loading company details..." />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded bg-primary-50 flex items-center justify-center text-primary-900 shrink-0">
//             <IoBusinessOutline className="w-6 h-6" />
//           </div>
//           <div>
//             <h2 className="text-lg sm:text-xl font-bold text-slate-800">Company Master Settings</h2>
//             <p className="text-xs text-slate-500">
//               Details configured here automatically appear.
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
//         {/* Business Credentials */}
//         <Card title="Corporate Details & Registration">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
//             <Input
//               label="Company Legal Name"
//               name="companyName"
//               value={formData.companyName}
//               onChange={handleChange}
//               required
//             />
//             <Input
//               label="Tagline / Subheading"
//               name="tagline"
//               value={formData.tagline}
//               onChange={handleChange}
//             />
//             <Input
//               label="GSTIN"
//               name="gstin"
//               value={formData.gstin}
//               onChange={handleChange}
//               required
//             />
//             <Input
//               label="Corporate Identity Number (CIN)"
//               name="cin"
//               value={formData.cin}
//               onChange={handleChange}
//             />
//             <div className="md:col-span-2">
//               <label className="text-xs font-semibold text-slate-700">Works / Factory Address *</label>
//               <textarea
//                 name="address"
//                 rows={2}
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//                 className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none"
//               />
//             </div>
//             <Input label="City" name="city" value={formData.city} onChange={handleChange} />
//             <Input label="State" name="state" value={formData.state} onChange={handleChange} />
//             <Input label="State Code" name="stateCode" value={formData.stateCode} onChange={handleChange} />
//             <Input label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
//             <Input label="Office Phone" name="phone" value={formData.phone} onChange={handleChange} />
//             <Input label="Official Email" name="email" value={formData.email} onChange={handleChange} />
//             <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
//             <Input
//               label="Authorized Signatory Designation"
//               name="authorizedSignatory"
//               value={formData.authorizedSignatory}
//               onChange={handleChange}
//             />
//           </div>
//         </Card>

//         {/* Bank Credentials */}
//         <Card title="Bank Account Details (Appears on Page 2 for RTGS/NEFT)">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
//             <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
//             <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
//             <Input label="IFSC / RTGS Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
//             <Input label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
//             <div className="md:col-span-2">
//               <Input
//                 label="Account Beneficiary Name"
//                 name="accountHolderName"
//                 value={formData.accountHolderName}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         </Card>

//         <div className="flex justify-end">
//           <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline} size="lg">
//             Save Company Settings
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CompanySettings;





import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCompany, updateCompany } from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { IoSaveOutline, IoBusinessOutline, IoArrowBackOutline } from 'react-icons/io5';

// Each field sits in a grid cell that can shrink (min-w-0), keeps its label on one
// row (shows "…" if the column is too narrow) and makes the input fill the cell.
const fieldClass =
  'min-w-0 [&_label]:block [&_label]:whitespace-nowrap [&_label]:overflow-hidden [&_label]:text-ellipsis ' +
  '[&_input]:w-full [&_input]:min-w-0';

// Grid: 1 column on phones, 2 from sm (640px), 3 on wide screens (xl, 1280px)
const gridClass =
  'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5';

const CompanySettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 pb-4">
      {/* Page heading */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Back button (top left): goes to the previous page, or the dashboard if there is none */}
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Go back"
          title="Back"
          className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          <IoArrowBackOutline className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-primary-50 flex items-center justify-center text-primary-900 shrink-0">
          <IoBusinessOutline className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight">
            Company Master Settings
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Details configured here automatically appear.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Business Credentials */}
        <Card title="Corporate Details & Registration">
          <div className={gridClass}>
            <div className={fieldClass}>
              <Input
                label="Company Legal Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={fieldClass}>
              <Input
                label="Tagline / Subheading"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>
            <div className={fieldClass}>
              <Input
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                required
              />
            </div>
            <div className={fieldClass}>
              <Input
                label="Corporate Identity Number (CIN)"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
              />
            </div>

            {/* Full-width address (spans every column at every breakpoint) */}
            <div className="min-w-0 sm:col-span-2 xl:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 whitespace-nowrap">
                Works / Factory Address *
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full min-w-0 mt-1 px-3 py-1.5 text-xs sm:text-sm rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none resize-y"
              />
            </div>

            <div className={fieldClass}>
              <Input label="City" name="city" value={formData.city} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="State" name="state" value={formData.state} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="State Code" name="stateCode" value={formData.stateCode} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="PIN Code" name="pinCode" value={formData.pinCode} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="Office Phone" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="Official Email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="Website" name="website" value={formData.website} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input
                label="Authorized Signatory Designation"
                name="authorizedSignatory"
                value={formData.authorizedSignatory}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* Bank Credentials */}
        <Card title="Bank Account Details (Appears on Page 2 for RTGS/NEFT)">
          <div className={gridClass}>
            <div className={fieldClass}>
              <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="IFSC / RTGS Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            </div>
            <div className={fieldClass}>
              <Input label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
            </div>
            <div className={`${fieldClass} sm:col-span-2`}>
              <Input
                label="Account Beneficiary Name"
                name="accountHolderName"
                value={formData.accountHolderName}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        {/* Save: full width on phones, right-aligned on larger screens */}
        <div className="flex justify-stretch sm:justify-end">
          <div className="w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto [&_button]:whitespace-nowrap [&_button]:justify-center">
            <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline} size="lg">
              Save Company Settings
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;