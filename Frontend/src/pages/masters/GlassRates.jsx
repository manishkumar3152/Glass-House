import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGlassRates,
  fetchGlassSpecifications,
  createGlassRate,
  updateGlassRate,
  deleteGlassRate
} from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/dateFormatter';
import { IoAddOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

const GlassRates = () => {
  const dispatch = useDispatch();
  const { glassRates, glassSpecifications, loading } = useSelector((state) => state.masters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    glassSpecification: '',
    rate: 72,
    per: 'SQFT',
    status: 'Active'
  });

  useEffect(() => {
    dispatch(fetchGlassRates());
    dispatch(fetchGlassSpecifications());
  }, [dispatch]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        glassSpecification: item.glassSpecification?._id || item.glassSpecification,
        rate: item.rate,
        per: item.per || 'SQFT',
        status: item.status || 'Active'
      });
    } else {
      setEditingItem(null);
      setFormData({
        glassSpecification: glassSpecifications[0]?._id || '',
        rate: 72,
        per: 'SQFT',
        status: 'Active'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await dispatch(updateGlassRate({ id: editingItem._id, data: formData }));
    } else {
      await dispatch(createGlassRate(formData));
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteGlassRate(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Glass Rate Master</h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard pricing per Sqft / Sqm applied during invoice generation.
          </p>
        </div>
        <Button variant="primary" icon={IoAddOutline} size="sm" onClick={() => handleOpenModal()}>
          Add Rate
        </Button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          {loading && glassRates.length === 0 ? (
            <Loader text="Loading rates..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Glass Specification</th>
                  <th className="p-3">Thickness</th>
                  <th className="p-3 text-right">Rate (₹)</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3">Effective Date</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {glassRates.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">
                      {r.glassSpecification?.glassName || 'Generic'}
                    </td>
                    <td className="p-3 text-slate-600">
                      {r.glassSpecification?.thickness ? `${r.glassSpecification.thickness} mm` : '-'}
                    </td>
                    <td className="p-3 text-right font-bold text-primary-900 text-sm">
                      ₹{Number(r.rate).toFixed(2)}
                    </td>
                    <td className="p-3 text-center font-medium">{r.per}</td>
                    <td className="p-3 text-slate-600">{formatDate(r.effectiveDate)}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(r)}
                          className="p-1 text-slate-500 hover:text-primary-900"
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(r)}
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

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Glass Rate' : 'Add Glass Rate'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Glass Specification *</label>
            <select
              value={formData.glassSpecification}
              onChange={(e) => setFormData({ ...formData, glassSpecification: e.target.value })}
              required
              className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
            >
              <option value="">-- Choose Specification --</option>
              {glassSpecifications.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.glassName} ({s.thickness}mm)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rate (₹)"
              type="number"
              step="0.5"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              required
            />
            <div>
              <label className="text-xs font-semibold text-slate-700">Per (Unit)</label>
              <select
                value={formData.per}
                onChange={(e) => setFormData({ ...formData, per: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="SQFT">SQFT</option>
                <option value="SQM">SQM</option>
                <option value="NOS">NOS</option>
                <option value="UNIT">UNIT</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Rate</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Rate"
        message="Are you sure you want to delete this rate?"
      />
    </div>
  );
};

export default GlassRates;
