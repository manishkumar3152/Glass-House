import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
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
  IoFilterOutline
} from 'react-icons/io5';

const InvoiceList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { invoices, pagination, loading } = useSelector((state) => state.invoices);
  const { customers } = useSelector((state) => state.customers);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [customerFilter, setCustomerFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null,
    invoice: null
  });

  useEffect(() => {
    dispatch(fetchCustomers({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (customerFilter) params.customer = customerFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    dispatch(fetchInvoices(params));
  }, [dispatch, search, statusFilter, customerFilter, startDate, endDate]);

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
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">Proforma Invoices (PI)</h2>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Create, approve, search, and download exact two-page proforma invoices.
          </p>
        </div>
        <div className="self-start sm:self-auto">
          <Link to="/invoices/create">
            <Button variant="primary" icon={IoAddOutline} size="sm">
              Create Proforma Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <Card noPadding>
        <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search PI No, PO, Customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Customer Filter */}
          <div>
            <select
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.customerName}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              title="From Date"
            />
          </div>

          {/* End Date */}
          <div>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
              title="To Date"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          {loading && invoices.length === 0 ? (
            <Loader text="Loading invoices..." />
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[850px]">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">PI Number</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">PO Ref</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Weight</th>
                  <th className="p-3 text-right">Before Tax</th>
                  <th className="p-3 text-right">Final Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-400 italic">
                      No invoices match the specified criteria.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary-900">
                        <Link to={`/invoices/view/${inv._id}`} className="hover:underline">
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="p-3 text-slate-600">{formatDate(inv.invoiceDate)}</td>
                      <td className="p-3 font-medium text-slate-800">
                        {inv.customerSnapshot?.customerName || inv.customer?.customerName || 'N/A'}
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

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
