import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  fetchInvoices,
  approveInvoice,
  cancelInvoice,
  duplicateInvoice,
  deleteInvoice
} from '../../redux/slices/invoiceSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import { invoiceApi } from '../../api/invoiceApi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import SelectionToolbar from '../../components/common/SelectionToolbar';
import Loader from '../../components/common/Loader';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateFormatter';
import {
  IoAddOutline,
  IoSearchOutline,
  IoEyeOutline,
  IoCreateOutline,
  IoDownloadOutline,
  IoCopyOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTrashOutline,
  IoFilterOutline,
  IoArrowBackOutline
} from 'react-icons/io5';

const filterInputClass =
  'w-full min-w-0 px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500';

const filterLabelClass =
  'block text-[11px] font-semibold text-slate-600 mb-1 whitespace-nowrap overflow-hidden text-ellipsis';

const InvoiceList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { invoices, loading } = useSelector((state) => state.invoices);
  const { customers } = useSelector((state) => state.customers);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [customerFilter, setCustomerFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Row selection state
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Filters live in a bottom drawer opened by the filter icon.
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerShown, setDrawerShown] = useState(false);

  // Draft values edited inside the drawer; applied only when "Apply" is pressed
  const [draft, setDraft] = useState({
    status: '',
    customer: '',
    startDate: '',
    endDate: ''
  });

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    invoice: null
  });

  const activeFilterCount = [statusFilter, customerFilter, startDate, endDate].filter(Boolean).length;

  const getFilterParams = () => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (customerFilter) params.customer = customerFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    return params;
  };

  useEffect(() => {
    dispatch(fetchCustomers({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchInvoices(getFilterParams()));
    setSelectedIds([]);
  }, [dispatch, search, statusFilter, customerFilter, startDate, endDate]);

  const openDrawer = () => {
    setDraft({
      status: statusFilter,
      customer: customerFilter,
      startDate,
      endDate
    });
    setDrawerOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerShown(true)));
  };

  const closeDrawer = () => {
    setDrawerShown(false);
    setTimeout(() => setDrawerOpen(false), 250);
  };

  const applyFilters = () => {
    setStatusFilter(draft.status);
    setCustomerFilter(draft.customer);
    setStartDate(draft.startDate);
    setEndDate(draft.endDate);
    closeDrawer();
  };

  const clearFilters = () => {
    setDraft({ status: '', customer: '', startDate: '', endDate: '' });
    setStatusFilter('');
    setCustomerFilter('');
    setStartDate('');
    setEndDate('');
    closeDrawer();
  };

  // Lock page scroll and close on Escape while the drawer is open
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  // Selection handlers
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (invoices.length > 0 && selectedIds.length === invoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(invoices.map((inv) => inv._id));
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      await invoiceApi.bulkUpdateStatus(selectedIds, newStatus);
      toast.success(`Updated status to "${newStatus}" for ${selectedIds.length} invoice(s)`);
      setSelectedIds([]);
      dispatch(fetchInvoices(getFilterParams()));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update invoice statuses');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await invoiceApi.bulkDelete(selectedIds);
      toast.success(res.data?.message || `Deleted ${selectedIds.length} invoice(s) successfully`);
      setSelectedIds([]);
      dispatch(fetchInvoices(getFilterParams()));
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to delete selected invoices');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleAction = async () => {
    const { type, invoice } = confirmModal;
    if (!invoice) return;

    if (type === 'approve') {
      await dispatch(approveInvoice(invoice._id));
    } else if (type === 'cancel') {
      await dispatch(cancelInvoice(invoice._id));
    } else if (type === 'duplicate') {
      await dispatch(duplicateInvoice(invoice._id));
    } else if (type === 'delete') {
      await dispatch(deleteInvoice(invoice._id));
    }

    setConfirmModal({ isOpen: false, type: null, invoice: null });
  };

  const handleDownloadPdf = (invoice) => {
    window.open(invoiceApi.getPdfUrl(invoice._id), '_blank');
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
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
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight">Proforma Invoices (PI)</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
              Create, approve, search, and download proforma invoices.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full sm:w-auto [&_button]:whitespace-nowrap [&_button]:w-full sm:[&_button]:w-auto [&_button]:justify-center">
          <Link to="/invoices/create" className="block">
            <Button variant="primary" icon={IoAddOutline} size="sm">
              Create Proforma Invoice
            </Button>
          </Link>
        </div>
      </div>

      <Card noPadding>
        {/* Toolbar: search + filter icon (always one row); filters open in a bottom drawer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <IoSearchOutline className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search PI No, PO, Customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full min-w-0 pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            {/* Filter icon button */}
            <button
              type="button"
              onClick={openDrawer}
              aria-haspopup="dialog"
              aria-expanded={drawerOpen}
              aria-label="Toggle filters"
              title="Filters"
              className={`relative shrink-0 inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded border transition-colors whitespace-nowrap ${drawerOpen || activeFilterCount > 0
                  ? 'bg-primary-50 border-primary-300 text-primary-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
            >
              <IoFilterOutline className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary-900 text-white text-[10px] font-bold leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Invoices Table: scrolls sideways on small screens, never wraps cells */}
        <div className="overflow-x-auto overscroll-x-contain">
          {loading && invoices.length === 0 ? (
            <Loader text="Loading invoices..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[1100px] whitespace-nowrap">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={invoices.length > 0 && selectedIds.length === invoices.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      title="Select all invoices"
                    />
                  </th>
                  <th className="p-3 min-w-[150px]">PI Number</th>
                  <th className="p-3 min-w-[100px]">Date</th>
                  <th className="p-3 min-w-[180px]">Customer</th>
                  <th className="p-3 min-w-[100px]">PO Ref</th>
                  <th className="p-3 text-right min-w-[60px]">Qty</th>
                  <th className="p-3 text-right min-w-[100px]">Weight</th>
                  <th className="p-3 text-right min-w-[120px]">Before Tax</th>
                  <th className="p-3 text-right min-w-[130px]">Final Amount</th>
                  <th className="p-3 text-center min-w-[110px]">Status</th>
                  <th className="p-3 text-right min-w-[190px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="p-8 text-center text-slate-400 italic">
                      No invoices match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const isSelected = selectedIds.includes(inv._id);
                    const customerName =
                      inv.customerSnapshot?.customerName || inv.customer?.customerName || 'N/A';
                    return (
                      <tr
                        key={inv._id}
                        className={`transition-colors ${
                          isSelected ? 'bg-primary-50/70 hover:bg-primary-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(inv._id)}
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-primary-900">
                          <Link to={`/invoices/view/${inv._id}`} className="hover:underline">
                            {inv.invoiceNumber}
                          </Link>
                        </td>
                        <td className="p-3 text-slate-600">{formatDate(inv.invoiceDate)}</td>
                        <td className="p-3 font-medium text-slate-800 max-w-[240px] truncate" title={customerName}>
                          {customerName}
                        </td>
                        <td className="p-3 font-mono text-slate-600">{inv.poNumber || '-'}</td>
                        <td className="p-3 text-right font-medium">{inv.totalQuantity || 0}</td>
                        <td className="p-3 text-right text-slate-600">
                          {Number(inv.totalWeight || 0).toFixed(2)} kg
                        </td>
                        <td className="p-3 text-right text-slate-700 font-medium">
                          ₹{formatCurrency(inv.taxableAmount)}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 text-sm">
                          ₹{formatCurrency(inv.roundedAmount)}
                        </td>
                        <td className="p-3 text-center">
                          <Badge status={inv.invoiceStatus} />
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/invoices/view/${inv._id}`}
                              className="p-1 text-slate-500 hover:text-primary-900 rounded"
                              title="View Invoice"
                            >
                              <IoEyeOutline className="w-4 h-4" />
                            </Link>

                            {inv.invoiceStatus !== 'Approved' && inv.invoiceStatus !== 'Cancelled' && (
                              <Link
                                to={`/invoices/edit/${inv._id}`}
                                className="p-1 text-slate-500 hover:text-blue-600 rounded"
                                title="Edit Draft"
                              >
                                <IoCreateOutline className="w-4 h-4" />
                              </Link>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDownloadPdf(inv)}
                              className="p-1 text-slate-500 hover:text-emerald-700 rounded"
                              title="Download PDF"
                            >
                              <IoDownloadOutline className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                 isOpen: true,
                                 type: 'duplicate',
                                 invoice: inv
                                })
                              }
                              className="p-1 text-slate-500 hover:text-indigo-600 rounded"
                              title="Duplicate as new draft"
                            >
                              <IoCopyOutline className="w-4 h-4" />
                            </button>

                            {inv.invoiceStatus !== 'Approved' && inv.invoiceStatus !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'approve',
                                    invoice: inv
                                  })
                                }
                                className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                                title="Approve & Lock Invoice"
                              >
                                <IoCheckmarkCircleOutline className="w-4 h-4" />
                              </button>
                            )}

                            {inv.invoiceStatus === 'Draft' && (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmModal({
                                    isOpen: true,
                                    type: 'delete',
                                    invoice: inv
                                  })
                                }
                                className="p-1 text-slate-400 hover:text-rose-600 rounded"
                                title="Delete Draft"
                              >
                                <IoTrashOutline className="w-4 h-4" />
                              </button>
                            )}
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

      {/* Floating Selection Toolbar for Bulk Operations */}
      <SelectionToolbar
        selectedCount={selectedIds.length}
        totalCount={invoices.length}
        itemLabel="invoices"
        statusOptions={['Draft', 'Pending Approval', 'Approved', 'Cancelled']}
        statusLabel="Change Status"
        onStatusChange={handleBulkStatusChange}
        onDelete={handleBulkDelete}
        deleteLabel={`Delete (${selectedIds.length})`}
        deleteLoading={bulkLoading}
        statusLoading={bulkLoading}
        onClearSelection={() => setSelectedIds([])}
        onSelectAll={() => setSelectedIds(invoices.map((i) => i._id))}
      />

      {/* Bottom filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Filter invoices">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-200 ${
              drawerShown ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeDrawer}
          />

          {/* Sheet */}
          <div
            className={`absolute bottom-0 left-1/2 w-full max-w-2xl -translate-x-1/2 bg-white rounded-t-2xl shadow-2xl flex flex-col max-h-[85vh] transition-transform duration-200 ease-out ${
              drawerShown ? 'translate-y-0' : 'translate-y-full'
            }`}
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Grab handle */}
            <div className="pt-2.5 pb-1 flex justify-center">
              <span className="w-10 h-1 rounded-full bg-slate-300" aria-hidden="true" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <IoFilterOutline className="w-4 h-4 text-primary-900" />
                <h3 className="text-sm font-bold text-slate-800">Filter Invoices</h3>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-900">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close filters"
                className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Form body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="min-w-0">
                  <label className={filterLabelClass}>Invoice Status</label>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                    className={filterInputClass}
                  >
                    <option value="">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="min-w-0">
                  <label className={filterLabelClass}>Customer</label>
                  <select
                    value={draft.customer}
                    onChange={(e) => setDraft((d) => ({ ...d, customer: e.target.value }))}
                    className={filterInputClass}
                  >
                    <option value="">All Customers</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.customerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className={filterLabelClass}>From Date</label>
                  <input
                    type="date"
                    value={draft.startDate}
                    onChange={(e) => setDraft((d) => ({ ...d, startDate: e.target.value }))}
                    className={filterInputClass}
                  />
                </div>

                <div className="min-w-0">
                  <label className={filterLabelClass}>To Date</label>
                  <input
                    type="date"
                    value={draft.endDate}
                    onChange={(e) => setDraft((d) => ({ ...d, endDate: e.target.value }))}
                    className={filterInputClass}
                  />
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 border-t border-slate-200 bg-slate-50 rounded-b-none">
              <button
                type="button"
                onClick={clearFilters}
                className="flex-1 sm:flex-none sm:min-w-[120px] text-xs font-semibold text-slate-700 hover:text-rose-600 px-3 py-2 border border-slate-300 rounded bg-white whitespace-nowrap"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={applyFilters}
                className="flex-1 sm:flex-none sm:min-w-[140px] text-xs font-semibold text-white bg-primary-900 hover:bg-primary-800 px-3 py-2 rounded whitespace-nowrap sm:ml-auto"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null, invoice: null })}
        onConfirm={handleAction}
        title={
          confirmModal.type === 'approve'
            ? 'Approve Proforma Invoice'
            : confirmModal.type === 'duplicate'
              ? 'Duplicate Proforma Invoice'
              : confirmModal.type === 'cancel'
                ? 'Cancel Proforma Invoice'
                : 'Delete Draft Invoice'
        }
        message={
          confirmModal.type === 'approve'
            ? `Are you sure you want to approve and lock "${confirmModal.invoice?.invoiceNumber}"? Once approved, the calculations and snapshots cannot be altered.`
            : confirmModal.type === 'duplicate'
              ? `Duplicate "${confirmModal.invoice?.invoiceNumber}"? A new draft invoice will be created with the next sequential PI number.`
              : confirmModal.type === 'cancel'
                ? `Cancel invoice "${confirmModal.invoice?.invoiceNumber}"?`
                : `Permanently delete draft invoice "${confirmModal.invoice?.invoiceNumber}"?`
        }
        confirmText={
          confirmModal.type === 'approve'
            ? 'Approve & Lock'
            : confirmModal.type === 'duplicate'
              ? 'Duplicate'
              : confirmModal.type === 'cancel'
                ? 'Cancel Invoice'
                : 'Delete Draft'
        }
        confirmVariant={confirmModal.type === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
};

export default InvoiceList;
