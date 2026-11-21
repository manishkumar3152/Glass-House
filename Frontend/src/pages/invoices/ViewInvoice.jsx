import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchInvoiceById,
  approveInvoice,
  cancelInvoice,
  duplicateInvoice
} from '../../redux/slices/invoiceSlice';
import { invoiceApi } from '../../api/invoiceApi';
import InvoicePreview from '../../components/invoice/InvoicePreview';
import InvoiceActions from '../../components/invoice/InvoiceActions';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Loader from '../../components/common/Loader';
import { IoArrowBackOutline, IoCreateOutline } from 'react-icons/io5';

const ViewInvoice = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentInvoice, loading } = useSelector((state) => state.invoices);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null });

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  const handleDownloadPdf = () => {
    if (currentInvoice) {
      window.open(invoiceApi.getPdfUrl(currentInvoice._id), '_blank');
    }
  };

  const handleAction = async () => {
    const { type } = confirmModal;
    if (type === 'approve') {
      await dispatch(approveInvoice(id));
    } else if (type === 'cancel') {
      await dispatch(cancelInvoice(id));
    } else if (type === 'duplicate') {
      const res = await dispatch(duplicateInvoice(id));
      if (duplicateInvoice.fulfilled.match(res)) {
        navigate(`/invoices/edit/${res.payload._id}`);
      }
    }
    setConfirmModal({ isOpen: false, type: null });
  };

  if (loading || !currentInvoice) {
    return <Loader text="Loading proforma invoice..." />;
  }

  const isApproved = currentInvoice.invoiceStatus === 'Approved';
  const isCancelled = currentInvoice.invoiceStatus === 'Cancelled';

  return (
    <div className="space-y-5 pb-16">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/invoices"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{currentInvoice.invoiceNumber}</h2>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isApproved
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : isCancelled
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}
              >
                {currentInvoice.invoiceStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Customer: {currentInvoice.customerSnapshot?.customerName || currentInvoice.customer?.customerName}
            </p>
          </div>
        </div>

        {!isApproved && !isCancelled && (
          <Link
            to={`/invoices/edit/${currentInvoice._id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <IoCreateOutline className="w-4 h-4 text-blue-600" />
            Edit Invoice
          </Link>
        )}
      </div>

      {/* Invoice Actions Bar */}
      <InvoiceActions
        invoice={currentInvoice}
        onApprove={!isApproved && !isCancelled ? () => setConfirmModal({ isOpen: true, type: 'approve' }) : null}
        onCancel={!isCancelled ? () => setConfirmModal({ isOpen: true, type: 'cancel' }) : null}
        onDuplicate={() => setConfirmModal({ isOpen: true, type: 'duplicate' })}
        onDownloadPdf={handleDownloadPdf}
        onPrint={() => window.print()}
      />

      {/* Exact 2-Page Visual Representation */}
      <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md">
        <InvoicePreview invoice={currentInvoice} company={currentInvoice.companySnapshot} />
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: null })}
        onConfirm={handleAction}
        title={
          confirmModal.type === 'approve'
            ? 'Approve Invoice'
            : confirmModal.type === 'cancel'
            ? 'Cancel Invoice'
            : 'Duplicate Invoice'
        }
        message={
          confirmModal.type === 'approve'
            ? 'Approve and lock this invoice? Once approved, it cannot be modified.'
            : confirmModal.type === 'cancel'
            ? 'Cancel this proforma invoice?'
            : 'Duplicate this invoice to create a new draft with the next PI number?'
        }
        confirmText={
          confirmModal.type === 'approve'
            ? 'Approve & Lock'
            : confirmModal.type === 'cancel'
            ? 'Cancel Invoice'
            : 'Duplicate'
        }
        confirmVariant={confirmModal.type === 'approve' ? 'success' : 'danger'}
      />
    </div>
  );
};

export default ViewInvoice;
