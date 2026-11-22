// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   fetchGlassSpecifications,
//   createGlassSpecification,
//   updateGlassSpecification,
//   deleteGlassSpecification
// } from '../../redux/slices/masterSlice';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Input from '../../components/common/Input';
// import Modal from '../../components/common/Modal';
// import ConfirmationDialog from '../../components/common/ConfirmationDialog';
// import Loader from '../../components/common/Loader';
// import { IoAddOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

// const GlassSpecifications = () => {
//   const dispatch = useDispatch();
//   const { glassSpecifications, loading } = useSelector((state) => state.masters);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [deleteTarget, setDeleteTarget] = useState(null);

//   const [formData, setFormData] = useState({
//     glassName: '',
//     glassCode: '',
//     thickness: 6,
//     glassType: 'Clear Toughened',
//     description: '',
//     density: 2.5,
//     defaultRate: 72,
//     rateUnit: 'SQFT',
//     status: 'Active'
//   });

//   useEffect(() => {
//     dispatch(fetchGlassSpecifications());
//   }, [dispatch]);

//   const handleOpenModal = (item = null) => {
//     if (item) {
//       setEditingItem(item);
//       setFormData({
//         glassName: item.glassName,
//         glassCode: item.glassCode || '',
//         thickness: item.thickness,
//         glassType: item.glassType || 'Clear Toughened',
//         description: item.description || '',
//         density: item.density || 2.5,
//         defaultRate: item.defaultRate || 0,
//         rateUnit: item.rateUnit || 'SQFT',
//         status: item.status || 'Active'
//       });
//     } else {
//       setEditingItem(null);
//       setFormData({
//         glassName: '',
//         glassCode: '',
//         thickness: 6,
//         glassType: 'Clear Toughened',
//         description: '',
//         density: 2.5,
//         defaultRate: 72,
//         rateUnit: 'SQFT',
//         status: 'Active'
//       });
//     }
//     setModalOpen(true);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editingItem) {
//       await dispatch(updateGlassSpecification({ id: editingItem._id, data: formData }));
//     } else {
//       await dispatch(createGlassSpecification(formData));
//     }
//     setModalOpen(false);
//   };

//   const handleDelete = async () => {
//     if (deleteTarget) {
//       await dispatch(deleteGlassSpecification(deleteTarget._id));
//       setDeleteTarget(null);
//     }
//   };

//   return (
//     <div className="space-y-5">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 bg-white p-4 sm:p-5 rounded border border-slate-200 shadow-xs">
//         <div>
//           <h2 className="text-lg sm:text-xl font-bold text-slate-800">Glass Specification Master</h2>
//           <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
//             Configure glass types, thickness, densities, and default rates.
//           </p>
//         </div>
//         <div className="self-start sm:self-auto">
//           <Button variant="primary" icon={IoAddOutline} size="sm" onClick={() => handleOpenModal()}>
//             Add Specification
//           </Button>
//         </div>
//       </div>

//       <Card noPadding>
//         <div className="overflow-x-auto">
//           {loading && glassSpecifications.length === 0 ? (
//             <Loader text="Loading specifications..." />
//           ) : (
//             <table className="w-full text-left border-collapse text-xs min-w-[700px]">
//               <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
//                 <tr>
//                   <th className="p-3">Specification Name</th>
//                   <th className="p-3">Code</th>
//                   <th className="p-3 text-right">Thickness</th>
//                   <th className="p-3">Type</th>
//                   <th className="p-3 text-right">Density</th>
//                   <th className="p-3 text-right">Default Rate</th>
//                   <th className="p-3 text-center">Unit</th>
//                   <th className="p-3 text-center">Status</th>
//                   <th className="p-3 text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {glassSpecifications.map((s) => (
//                   <tr key={s._id} className="hover:bg-slate-50">
//                     <td className="p-3 font-semibold text-slate-900">{s.glassName}</td>
//                     <td className="p-3 font-mono text-slate-600">{s.glassCode || '-'}</td>
//                     <td className="p-3 text-right font-bold text-slate-800">{s.thickness} mm</td>
//                     <td className="p-3 text-slate-600">{s.glassType}</td>
//                     <td className="p-3 text-right text-slate-600">{s.density} kg/m²·mm</td>
//                     <td className="p-3 text-right font-bold text-primary-900">₹{s.defaultRate}</td>
//                     <td className="p-3 text-center font-medium">{s.rateUnit}</td>
//                     <td className="p-3 text-center">
//                       <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
//                         {s.status}
//                       </span>
//                     </td>
//                     <td className="p-3 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <button
//                           onClick={() => handleOpenModal(s)}
//                           className="p-1 text-slate-500 hover:text-primary-900"
//                         >
//                           <IoCreateOutline className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => setDeleteTarget(s)}
//                           className="p-1 text-slate-400 hover:text-rose-600"
//                         >
//                           <IoTrashOutline className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </Card>

//       {/* Add / Edit Modal */}
//       <Modal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         title={editingItem ? 'Edit Glass Specification' : 'Add Glass Specification'}
//       >
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <Input
//             label="Glass Name"
//             value={formData.glassName}
//             onChange={(e) => setFormData({ ...formData, glassName: e.target.value })}
//             required
//             placeholder="e.g. 6mm Clear Flat Tuff Glass"
//           />

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
//             <Input
//               label="Glass Code"
//               value={formData.glassCode}
//               onChange={(e) => setFormData({ ...formData, glassCode: e.target.value })}
//               placeholder="e.g. GL-6MM-CFT"
//             />
//             <Input
//               label="Thickness (mm)"
//               type="number"
//               step="0.5"
//               value={formData.thickness}
//               onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
//               required
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
//             <Input
//               label="Glass Type"
//               value={formData.glassType}
//               onChange={(e) => setFormData({ ...formData, glassType: e.target.value })}
//             />
//             <Input
//               label="Density (kg/m² per mm)"
//               type="number"
//               step="0.05"
//               value={formData.density}
//               onChange={(e) => setFormData({ ...formData, density: e.target.value })}
//             />
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
//             <Input
//               label="Default Rate (₹)"
//               type="number"
//               step="0.5"
//               value={formData.defaultRate}
//               onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
//               required
//             />
//             <div>
//               <label className="text-xs font-semibold text-slate-700">Rate Unit</label>
//               <select
//                 value={formData.rateUnit}
//                 onChange={(e) => setFormData({ ...formData, rateUnit: e.target.value })}
//                 className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
//               >
//                 <option value="SQFT">SQFT</option>
//                 <option value="SQM">SQM</option>
//                 <option value="NOS">NOS</option>
//                 <option value="UNIT">UNIT</option>
//               </select>
//             </div>
//           </div>

//           <Input
//             label="Description"
//             value={formData.description}
//             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           />

//           <div className="flex justify-end gap-2 pt-3 border-t">
//             <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
//             <Button type="submit" variant="primary">Save Specification</Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Delete Dialog */}
//       <ConfirmationDialog
//         isOpen={!!deleteTarget}
//         onClose={() => setDeleteTarget(null)}
//         onConfirm={handleDelete}
//         title="Delete Specification"
//         message={`Delete "${deleteTarget?.glassName}"?`}
//       />
//     </div>
//   );
// };

// export default GlassSpecifications;





import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchGlassSpecifications,
  createGlassSpecification,
  updateGlassSpecification,
  deleteGlassSpecification
} from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Loader from '../../components/common/Loader';
import {
  IoAddOutline,
  IoCreateOutline,
  IoTrashOutline,
  IoArrowBackOutline
} from 'react-icons/io5';

// Each field sits in a grid cell that can shrink (min-w-0), keeps its label on one
// row (shows "…" if the column is too narrow) and makes the input fill the cell.
const fieldClass =
  'min-w-0 [&_label]:block [&_label]:whitespace-nowrap [&_label]:overflow-hidden [&_label]:text-ellipsis ' +
  '[&_input]:w-full [&_input]:min-w-0';

const EMPTY_FORM = {
  glassName: '',
  glassCode: '',
  thickness: 6,
  glassType: 'Clear Toughened',
  description: '',
  density: 2.5,
  defaultRate: 72,
  rateUnit: 'SQFT',
  status: 'Active'
};

const GlassSpecifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { glassSpecifications, loading } = useSelector((state) => state.masters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    dispatch(fetchGlassSpecifications());
  }, [dispatch]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        glassName: item.glassName,
        glassCode: item.glassCode || '',
        thickness: item.thickness,
        glassType: item.glassType || 'Clear Toughened',
        description: item.description || '',
        density: item.density || 2.5,
        defaultRate: item.defaultRate || 0,
        rateUnit: item.rateUnit || 'SQFT',
        status: item.status || 'Active'
      });
    } else {
      setEditingItem(null);
      setFormData(EMPTY_FORM);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await dispatch(updateGlassSpecification({ id: editingItem._id, data: formData }));
    } else {
      await dispatch(createGlassSpecification(formData));
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteGlassSpecification(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Page header: back icon (top left) + title + add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 ">
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
              Glass Specification Master
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
              Configure glass types, thickness, densities, and default rates.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-auto shrink-0 w-full sm:w-auto [&_button]:whitespace-nowrap [&_button]:w-full sm:[&_button]:w-auto [&_button]:justify-center">
          <Button variant="primary" icon={IoAddOutline} size="sm" onClick={() => handleOpenModal()}>
            Add Specification
          </Button>
        </div>
      </div>

      <Card noPadding>
        {/* Table scrolls sideways on small screens; cells never wrap */}
        <div className="overflow-x-auto overscroll-x-contain">
          {loading && glassSpecifications.length === 0 ? (
            <Loader text="Loading specifications..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[960px] whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 sm:p-3 min-w-[220px]">Specification Name</th>
                  <th className="p-2.5 sm:p-3 min-w-[110px]">Code</th>
                  <th className="p-2.5 sm:p-3 text-right min-w-[100px]">Thickness</th>
                  <th className="p-2.5 sm:p-3 min-w-[140px]">Type</th>
                  <th className="p-2.5 sm:p-3 text-right min-w-[130px]">Density</th>
                  <th className="p-2.5 sm:p-3 text-right min-w-[120px]">Default Rate</th>
                  <th className="p-2.5 sm:p-3 text-center min-w-[70px]">Unit</th>
                  <th className="p-2.5 sm:p-3 text-center min-w-[90px]">Status</th>
                  <th className="p-2.5 sm:p-3 text-right min-w-[90px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {glassSpecifications.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400 italic">
                      No glass specifications added yet.
                    </td>
                  </tr>
                ) : (
                  glassSpecifications.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50">
                      <td className="p-2.5 sm:p-3 font-semibold text-slate-900">{s.glassName}</td>
                      <td className="p-2.5 sm:p-3 font-mono text-slate-600">{s.glassCode || '-'}</td>
                      <td className="p-2.5 sm:p-3 text-right font-bold text-slate-800">{s.thickness} mm</td>
                      <td className="p-2.5 sm:p-3 text-slate-600">{s.glassType}</td>
                      <td className="p-2.5 sm:p-3 text-right text-slate-600">{s.density} kg/m²·mm</td>
                      <td className="p-2.5 sm:p-3 text-right font-bold text-primary-900">₹{s.defaultRate}</td>
                      <td className="p-2.5 sm:p-3 text-center font-medium">{s.rateUnit}</td>
                      <td className="p-2.5 sm:p-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {s.status}
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(s)}
                            className="p-1 text-slate-500 hover:text-primary-900"
                            title="Edit specification"
                            aria-label="Edit specification"
                          >
                            <IoCreateOutline className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(s)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                            title="Delete specification"
                            aria-label="Delete specification"
                          >
                            <IoTrashOutline className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Glass Specification' : 'Add Glass Specification'}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div className={fieldClass}>
            <Input
              label="Glass Name"
              value={formData.glassName}
              onChange={(e) => setFormData({ ...formData, glassName: e.target.value })}
              required
              placeholder="e.g. 6mm Clear Flat Tuff Glass"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className={fieldClass}>
              <Input
                label="Glass Code"
                value={formData.glassCode}
                onChange={(e) => setFormData({ ...formData, glassCode: e.target.value })}
                placeholder="e.g. GL-6MM-CFT"
              />
            </div>
            <div className={fieldClass}>
              <Input
                label="Thickness (mm)"
                type="number"
                step="0.5"
                value={formData.thickness}
                onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className={fieldClass}>
              <Input
                label="Glass Type"
                value={formData.glassType}
                onChange={(e) => setFormData({ ...formData, glassType: e.target.value })}
              />
            </div>
            <div className={fieldClass}>
              <Input
                label="Density (kg/m² per mm)"
                type="number"
                step="0.05"
                value={formData.density}
                onChange={(e) => setFormData({ ...formData, density: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className={fieldClass}>
              <Input
                label="Default Rate (₹)"
                type="number"
                step="0.5"
                value={formData.defaultRate}
                onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
                required
              />
            </div>
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-700 whitespace-nowrap">Rate Unit</label>
              <select
                value={formData.rateUnit}
                onChange={(e) => setFormData({ ...formData, rateUnit: e.target.value })}
                className="w-full min-w-0 mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="SQFT">SQFT</option>
                <option value="SQM">SQM</option>
                <option value="NOS">NOS</option>
                <option value="UNIT">UNIT</option>
              </select>
            </div>
          </div>

          <div className={fieldClass}>
            <Input
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Buttons: stacked full-width on phones (Save on top), side by side from sm up */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-200 [&_button]:whitespace-nowrap [&_button]:w-full sm:[&_button]:w-auto [&_button]:justify-center">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Specification</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Specification"
        message={`Delete "${deleteTarget?.glassName}"?`}
      />
    </div>
  );
};

export default GlassSpecifications;