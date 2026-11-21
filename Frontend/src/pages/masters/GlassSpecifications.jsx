import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { IoAddOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

const GlassSpecifications = () => {
  const dispatch = useDispatch();
  const { glassSpecifications, loading } = useSelector((state) => state.masters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    glassName: '',
    glassCode: '',
    thickness: 6,
    glassType: 'Clear Toughened',
    description: '',
    density: 2.5,
    defaultRate: 72,
    rateUnit: 'SQFT',
    status: 'Active'
  });

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
      setFormData({
        glassName: '',
        glassCode: '',
        thickness: 6,
        glassType: 'Clear Toughened',
        description: '',
        density: 2.5,
        defaultRate: 72,
        rateUnit: 'SQFT',
        status: 'Active'
      });
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
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Glass Specification Master</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure glass types, thickness, densities, and default rates.
          </p>
        </div>
        <Button variant="primary" icon={IoAddOutline} size="sm" onClick={() => handleOpenModal()}>
          Add Specification
        </Button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          {loading && glassSpecifications.length === 0 ? (
            <Loader text="Loading specifications..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Specification Name</th>
                  <th className="p-3">Code</th>
                  <th className="p-3 text-right">Thickness</th>
                  <th className="p-3">Type</th>
                  <th className="p-3 text-right">Density</th>
                  <th className="p-3 text-right">Default Rate</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {glassSpecifications.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{s.glassName}</td>
                    <td className="p-3 font-mono text-slate-600">{s.glassCode || '-'}</td>
                    <td className="p-3 text-right font-bold text-slate-800">{s.thickness} mm</td>
                    <td className="p-3 text-slate-600">{s.glassType}</td>
                    <td className="p-3 text-right text-slate-600">{s.density} kg/m²·mm</td>
                    <td className="p-3 text-right font-bold text-primary-900">₹{s.defaultRate}</td>
                    <td className="p-3 text-center font-medium">{s.rateUnit}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(s)}
                          className="p-1 text-slate-500 hover:text-primary-900"
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <IoTrashOutline className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Glass Name"
            value={formData.glassName}
            onChange={(e) => setFormData({ ...formData, glassName: e.target.value })}
            required
            placeholder="e.g. 6mm Clear Flat Tuff Glass"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Glass Code"
              value={formData.glassCode}
              onChange={(e) => setFormData({ ...formData, glassCode: e.target.value })}
              placeholder="e.g. GL-6MM-CFT"
            />
            <Input
              label="Thickness (mm)"
              type="number"
              step="0.5"
              value={formData.thickness}
              onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Glass Type"
              value={formData.glassType}
              onChange={(e) => setFormData({ ...formData, glassType: e.target.value })}
            />
            <Input
              label="Density (kg/m² per mm)"
              type="number"
              step="0.05"
              value={formData.density}
              onChange={(e) => setFormData({ ...formData, density: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Default Rate (₹)"
              type="number"
              step="0.5"
              value={formData.defaultRate}
              onChange={(e) => setFormData({ ...formData, defaultRate: e.target.value })}
              required
            />
            <div>
              <label className="text-xs font-semibold text-slate-700">Rate Unit</label>
              <select
                value={formData.rateUnit}
                onChange={(e) => setFormData({ ...formData, rateUnit: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="SQFT">SQFT</option>
                <option value="SQM">SQM</option>
                <option value="NOS">NOS</option>
                <option value="UNIT">UNIT</option>
              </select>
            </div>
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
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
