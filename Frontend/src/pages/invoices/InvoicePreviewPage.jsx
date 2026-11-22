import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchInvoiceById } from '../../redux/slices/invoiceSlice';
import { invoiceApi } from '../../api/invoiceApi';
import InvoicePreview from '../../components/invoice/InvoicePreview';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { IoArrowBackOutline, IoDownloadOutline, IoPrintOutline } from 'react-icons/io5';

const InvoicePreviewPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentInvoice, loading } = useSelector((state) => state.invoices);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  if (loading || !currentInvoice) {
    return <Loader text="Loading invoice preview..." />;
  }

  return (
    <div className="min-h-screen bg-slate-700">
      {/* Floating control bar */}
      <div className="sticky top-0 z-50 bg-slate-900 text-white px-3 sm:px-6 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 no-print shadow-md">
        <Link
          to={`/invoices/view/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <IoArrowBackOutline className="w-4 h-4" />
          Back to Invoice
        </Link>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button
            size="sm"
            variant="secondary"
            icon={IoPrintOutline}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={IoDownloadOutline}
            onClick={() => window.open(invoiceApi.getPdfUrl(id), '_blank')}
          >
            Download Official PDF
          </Button>
        </div>
      </div>

      <div className="py-6">
        <InvoicePreview invoice={currentInvoice} company={currentInvoice.companySnapshot} />
      </div>
    </div>
  );
};

export default InvoicePreviewPage;
