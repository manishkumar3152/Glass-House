import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProcessingCharges,
  createProcessingCharge,
  updateProcessingCharge,
  deleteProcessingCharge
} from '../../redux/slices/masterSlice';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Loader from '../../components/common/Loader';
import { IoAddOutline, IoCreateOutline, IoTrashOutline } from 'react-icons/io5';

const ProcessingCharges = () => {
  const dispatch = useDispatch();
  const { processingCharges, loading } = useSelector((state) => state.masters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    unit: 'NOS',
    rate: 45,
    description: '',
    status: 'Active'
  });

  useEffect(() => {
    dispatch(fetchProcessingCharges());
  }, [dispatch]);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        unit: item.unit || 'NOS',
        rate: item.rate,
        description: item.description || '',
        status: item.status || 'Active'
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        unit: 'NOS',
        rate: 45,
        description: '',
        status: 'Active'
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingItem) {
      await dispatch(updateProcessingCharge({ id: editingItem._id, data: formData }));
    } else {
      await dispatch(createProcessingCharge(formData));
    }
    setModalOpen(false);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await dispatch(deleteProcessingCharge(deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Processing Charges Master</h2>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Holes, cutting, grinding, polishing, beveling and notching charges.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <Button variant="primary" icon={IoAddOutline} size="sm" onClick={() => handleOpenModal()}>
            Add Processing Charge
          </Button>
        </div>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          {loading && processingCharges.length === 0 ? (
            <Loader text="Loading processing charges..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[620px]">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Processing Name</th>
                  <th className="p-3 text-center">Unit</th>
                  <th className="p-3 text-right">Standard Rate (₹)</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processingCharges.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50">
                    <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="p-3 text-center font-medium">{p.unit}</td>
                    <td className="p-3 text-right font-bold text-primary-900 text-sm">
                      ₹{Number(p.rate).toFixed(2)}
                    </td>
                    <td className="p-3 text-slate-500">{p.description || '-'}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(p)}
                          className="p-1 text-slate-500 hover:text-primary-900"
                        >
                          <IoCreateOutline className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
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
        title={editingItem ? 'Edit Processing Charge' : 'Add Processing Charge'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Charge Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g. Small Hole (Up to 25mm)"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Billing Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="NOS">NOS (Per Piece/Hole)</option>
                <option value="RFT">RFT (Running Feet)</option>
                <option value="SQFT">SQFT (Square Feet)</option>
                <option value="SQM">SQM (Square Meter)</option>
                <option value="PCS">PCS</option>
              </select>
            </div>
            <Input
              label="Rate (₹)"
              type="number"
              step="0.5"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              required
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-3 border-t">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Charge</Button>
          </div>
        </form>
      </Modal>

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Charge"
        message="Are you sure you want to delete this processing charge?"
      />
    </div>
  );
};

export default ProcessingCharges;
