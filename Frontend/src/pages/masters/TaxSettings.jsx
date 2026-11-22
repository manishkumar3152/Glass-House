// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchTaxConfig, updateTaxConfig } from '../../redux/slices/masterSlice';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Loader from '../../components/common/Loader';
// import { IoSaveOutline, IoCashOutline } from 'react-icons/io5';

// const TaxSettings = () => {
//   const dispatch = useDispatch();
//   const { taxConfig, loading } = useSelector((state) => state.masters);

//   const [formData, setFormData] = useState({
//     taxName: 'GST',
//     gstPercentage: 18,
//     cgstPercentage: 9,
//     sgstPercentage: 9,
//     igstPercentage: 18,
//     taxApplicability: 'Standard GST on Toughened Glass'
//   });

//   useEffect(() => {
//     dispatch(fetchTaxConfig());
//   }, [dispatch]);

//   useEffect(() => {
//     if (taxConfig) {
//       setFormData({
//         taxName: taxConfig.taxName || 'GST',
//         gstPercentage: taxConfig.gstPercentage || 18,
//         cgstPercentage: taxConfig.cgstPercentage || 9,
//         sgstPercentage: taxConfig.sgstPercentage || 9,
//         igstPercentage: taxConfig.igstPercentage || 18,
//         taxApplicability: taxConfig.taxApplicability || ''
//       });
//     }
//   }, [taxConfig]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'gstPercentage') {
//       const gst = Number(value) || 0;
//       setFormData({
//         ...formData,
//         gstPercentage: gst,
//         igstPercentage: gst,
//         cgstPercentage: gst / 2,
//         sgstPercentage: gst / 2
//       });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     dispatch(updateTaxConfig(formData));
//   };

//   if (loading && !taxConfig) {
//     return <Loader text="Loading tax configuration..." />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0">
//             <IoCashOutline className="w-6 h-6" />
//           </div>
//           <div>
//             <h2 className="text-lg sm:text-xl font-bold text-slate-800">Tax & GST Configuration</h2>
//             <p className="text-xs text-slate-500">
//               Configure statutory Goods and Services Tax slabs for inter-state and intra-state invoicing.
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit}>
//         <Card title="GST Slabs & Rules">
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
//             <Input
//               label="Standard Tax Name"
//               name="taxName"
//               value={formData.taxName}
//               onChange={handleChange}
//               required
//             />

//             <Input
//               label="Overall GST Slab (%)"
//               name="gstPercentage"
//               type="number"
//               step="1"
//               value={formData.gstPercentage}
//               onChange={handleChange}
//               required
//               helperText="Updates IGST (100%) and CGST+SGST (50% each)"
//             />

//             <Input
//               label="IGST Rate (%) - Inter-State"
//               name="igstPercentage"
//               type="number"
//               step="0.5"
//               value={formData.igstPercentage}
//               onChange={handleChange}
//               required
//             />

//             <div className="grid grid-cols-2 gap-3">
//               <Input
//                 label="CGST Rate (%)"
//                 name="cgstPercentage"
//                 type="number"
//                 step="0.5"
//                 value={formData.cgstPercentage}
//                 onChange={handleChange}
//                 required
//               />
//               <Input
//                 label="SGST Rate (%)"
//                 name="sgstPercentage"
//                 type="number"
//                 step="0.5"
//                 value={formData.sgstPercentage}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="md:col-span-2">
//               <Input
//                 label="Statutory Applicability Note"
//                 name="taxApplicability"
//                 value={formData.taxApplicability}
//                 onChange={handleChange}
//                 placeholder="e.g. Standard GST on Finished Toughened Glass"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end pt-5 mt-5 border-t border-slate-200">
//             <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline}>
//               Update Tax Configuration
//             </Button>
//           </div>
//         </Card>
//       </form>
//     </div>
//   );
// };

// export default TaxSettings;




import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTaxConfig, updateTaxConfig } from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import { IoSaveOutline, IoCashOutline, IoArrowBackOutline } from 'react-icons/io5';

// Each field sits in a grid cell that can shrink (min-w-0), keeps its label on one
// row (shows "…" if the column is too narrow) and makes the input fill the cell.
// Helper text (<p>) also stays on one line and truncates.
const fieldClass =
  'min-w-0 [&_label]:block [&_label]:whitespace-nowrap [&_label]:overflow-hidden [&_label]:text-ellipsis ' +
  '[&_p]:overflow-hidden [&_p]:text-ellipsis ' +
  '[&_input]:w-full [&_input]:min-w-0';

const TaxSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { taxConfig, loading } = useSelector((state) => state.masters);

  const [formData, setFormData] = useState({
    taxName: 'GST',
    gstPercentage: 18,
    cgstPercentage: 9,
    sgstPercentage: 9,
    igstPercentage: 18,
    taxApplicability: 'Standard GST on Toughened Glass'
  });

  useEffect(() => {
    dispatch(fetchTaxConfig());
  }, [dispatch]);

  useEffect(() => {
    if (taxConfig) {
      setFormData({
        taxName: taxConfig.taxName || 'GST',
        gstPercentage: taxConfig.gstPercentage || 18,
        cgstPercentage: taxConfig.cgstPercentage || 9,
        sgstPercentage: taxConfig.sgstPercentage || 9,
        igstPercentage: taxConfig.igstPercentage || 18,
        taxApplicability: taxConfig.taxApplicability || ''
      });
    }
  }, [taxConfig]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'gstPercentage') {
      const gst = Number(value) || 0;
      setFormData({
        ...formData,
        gstPercentage: gst,
        igstPercentage: gst,
        cgstPercentage: gst / 2,
        sgstPercentage: gst / 2
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateTaxConfig(formData));
  };

  if (loading && !taxConfig) {
    return <Loader text="Loading tax configuration..." />;
  }

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 pb-4">
      {/* Page heading: back icon (top left) + icon + title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          aria-label="Go back"
          title="Back"
          className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          <IoArrowBackOutline className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight">
            Tax & GST Configuration
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Configure Tax slabs for inter-state and intra-state invoicing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card title="GST Slabs & Rules">
          {/* 1 column on phones, 2 from sm (640px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
            <div className={fieldClass}>
              <Input
                label="Standard Tax Name"
                name="taxName"
                value={formData.taxName}
                onChange={handleChange}
                required
              />
            </div>

            <div className={fieldClass}>
              <Input
                label="Overall GST Slab (%)"
                name="gstPercentage"
                type="number"
                step="1"
                value={formData.gstPercentage}
                onChange={handleChange}
                required
                helperText="Updates IGST (100%) and CGST+SGST (50% each)"
              />
            </div>

            <div className={fieldClass}>
              <Input
                label="IGST Rate (%) - Inter-State"
                name="igstPercentage"
                type="number"
                step="0.5"
                value={formData.igstPercentage}
                onChange={handleChange}
                required
              />
            </div>

            {/* CGST + SGST stay side by side at every size (2 short number fields) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 min-w-0">
              <div className={fieldClass}>
                <Input
                  label="CGST Rate (%)"
                  name="cgstPercentage"
                  type="number"
                  step="0.5"
                  value={formData.cgstPercentage}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={fieldClass}>
                <Input
                  label="SGST Rate (%)"
                  name="sgstPercentage"
                  type="number"
                  step="0.5"
                  value={formData.sgstPercentage}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Full width (fixes md:col-span-2 on a grid that is 2-col from sm) */}
            <div className={`${fieldClass} sm:col-span-2`}>
              <Input
                label="Statutory Applicability Note"
                name="taxApplicability"
                value={formData.taxApplicability}
                onChange={handleChange}
                placeholder="e.g. Standard GST on Finished Toughened Glass"
              />
            </div>
          </div>

          {/* Save: full width on phones, right-aligned on larger screens */}
          <div className="flex justify-stretch sm:justify-end pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-slate-200">
            <div className="w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto [&_button]:whitespace-nowrap [&_button]:justify-center">
              <Button type="submit" variant="primary" loading={loading} icon={IoSaveOutline}>
                Update Tax Configuration
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default TaxSettings;