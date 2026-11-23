import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchProcessingCharges,
  createProcessingCharge,
  updateProcessingCharge,
  deleteProcessingCharge
} from '../../redux/slices/masterSlice';
import processingApi from '../../api/processingApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Loader from '../../components/common/Loader';
import SelectionToolbar from '../../components/common/SelectionToolbar';
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
  name: '',
  unit: 'NOS',
  rate: 45,
  description: '',
  status: 'Active'
};

const ProcessingCharges = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { processingCharges, loading } = useSelector((state) => state.masters);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Bulk selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

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
      setFormData(EMPTY_FORM);
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
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget._id));
      setDeleteTarget(null);
    }
  };

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === processingCharges.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processingCharges.map((p) => p._id));
    }
  };

  // Bulk Actions
  const handleBulkStatusChange = async (newStatus) => {
    try {
      setBulkLoading(true);
      await processingApi.bulkUpdateChargeStatus(selectedIds, newStatus);
      toast.success(`Updated ${selectedIds.length} charges to "${newStatus}"`);
      dispatch(fetchProcessingCharges());
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update charge status');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setBulkLoading(true);
      await processingApi.bulkDeleteCharges(selectedIds);
      toast.success(`Successfully deleted ${selectedIds.length} charges`);
      dispatch(fetchProcessingCharges());
      setSelectedIds([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete charges');
    } finally {
      setBulkLoading(false);
    }
  };

  const isAllSelected =
    processingCharges.length > 0 && selectedIds.length === processingCharges.length;

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Page header: back icon (top left) + title + add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ">
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
              Processing Charges Master
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
              Holes, cutting, grinding, polishing, beveling and notching charges.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto [&_button]:whitespace-nowrap [&_button]:w-full sm:[&_button]:w-auto [&_button]:justify-center">
          <Button variant="primary" icon={IoAddOutline} size="sm" onClick={() => handleOpenModal()}>
            Add Processing Charge
          </Button>
        </div>
      </div>

      <Card noPadding>
        {/* Table scrolls sideways on small screens; cells never wrap */}
        <div className="overflow-x-auto overscroll-x-contain">
          {loading && processingCharges.length === 0 ? (
            <Loader text="Loading processing charges..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[780px] whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-2.5 sm:p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                      title={isAllSelected ? 'Deselect all' : 'Select all'}
                    />
                  </th>
                  <th className="p-2.5 sm:p-3 min-w-[220px]">Processing Name</th>
                  <th className="p-2.5 sm:p-3 text-center min-w-[70px]">Unit</th>
                  <th className="p-2.5 sm:p-3 text-right min-w-[150px]">Standard Rate (₹)</th>
                  <th className="p-2.5 sm:p-3 min-w-[200px]">Description</th>
                  <th className="p-2.5 sm:p-3 text-center min-w-[90px]">Status</th>
                  <th className="p-2.5 sm:p-3 text-right min-w-[90px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processingCharges.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                      No processing charges added yet.
                    </td>
                  </tr>
                ) : (
                  processingCharges.map((p) => {
                    const isSelected = selectedIds.includes(p._id);
                    return (
                      <tr
                        key={p._id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isSelected ? 'bg-primary-50/40' : ''
                        }`}
                      >
                        <td className="p-2.5 sm:p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(p._id)}
                            className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-2.5 sm:p-3 font-semibold text-slate-900">{p.name}</td>
                        <td className="p-2.5 sm:p-3 text-center font-medium">{p.unit}</td>
                        <td className="p-2.5 sm:p-3 text-right font-bold text-primary-900 text-sm">
                          ₹{Number(p.rate).toFixed(2)}
                        </td>
                        <td
                          className="p-2.5 sm:p-3 text-slate-500 max-w-[280px] truncate"
                          title={p.description || ''}
                        >
                          {p.description || '-'}
                        </td>
                        <td className="p-2.5 sm:p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              p.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {p.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-2.5 sm:p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(p)}
                              className="p-1 text-slate-500 hover:text-primary-900"
                              title="Edit charge"
                              aria-label="Edit charge"
                            >
                              <IoCreateOutline className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(p)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                              title="Delete charge"
                              aria-label="Delete charge"
                            >
                              <IoTrashOutline className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Reusable SelectionToolbar */}
      <SelectionToolbar
        selectedCount={selectedIds.length}
        totalCount={processingCharges.length}
        onClearSelection={() => setSelectedIds([])}
        onSelectAll={toggleSelectAll}
        onDelete={handleBulkDelete}
        deleteLoading={bulkLoading}
        deleteLabel={`Delete (${selectedIds.length})`}
        statusOptions={['Active', 'Inactive']}
        onStatusChange={handleBulkStatusChange}
        statusLoading={bulkLoading}
        statusLabel="Set Status"
        itemLabel="charges"
      />

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Processing Charge' : 'Add Processing Charge'}
      >
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <div className={fieldClass}>
            <Input
              label="Charge Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g. Small Hole (Up to 25mm)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="min-w-0">
              <label className="block text-xs font-semibold text-slate-700 whitespace-nowrap">Billing Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full min-w-0 mt-1 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white"
              >
                <option value="NOS">NOS (Per Piece/Hole)</option>
                <option value="RFT">RFT (Running Feet)</option>
                <option value="SQFT">SQFT (Square Feet)</option>
                <option value="SQM">SQM (Square Meter)</option>
                <option value="PCS">PCS</option>
              </select>
            </div>
            <div className={fieldClass}>
              <Input
                label="Rate (₹)"
                type="number"
                step="0.5"
                value={formData.rate}
                onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                required
              />
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
