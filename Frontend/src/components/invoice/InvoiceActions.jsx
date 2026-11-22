import React from 'react';
import Button from '../common/Button';
import {
  IoSaveOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCopyOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoEyeOutline
} from 'react-icons/io5';

const InvoiceActions = ({
  invoice,
  onSaveDraft,
  onApprove,
  onCancel,
  onDuplicate,
  onDownloadPdf,
  onPrint,
  onPreviewToggle,
  isPreviewMode = false,
  loading = false
}) => {
  const isApproved = invoice?.invoiceStatus === 'Approved';
  const isCancelled = invoice?.invoiceStatus === 'Cancelled';

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 sticky top-16 z-20 shadow-xs">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onPreviewToggle}
          icon={IoEyeOutline}
        >
          {isPreviewMode ? 'Back to Editor' : 'Exact PDF Preview'}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {/* Save Draft */}
        {!isApproved && !isCancelled && onSaveDraft && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onSaveDraft}
            loading={loading}
            icon={IoSaveOutline}
          >
            Save Draft
          </Button>
        )}

        {/* Approve */}
        {!isApproved && !isCancelled && onApprove && (
          <Button
            type="button"
            variant="success"
            size="sm"
            onClick={onApprove}
            loading={loading}
            icon={IoCheckmarkCircleOutline}
          >
            Approve & Lock
          </Button>
        )}

        {/* Duplicate */}
        {invoice?._id && onDuplicate && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onDuplicate}
            loading={loading}
            icon={IoCopyOutline}
          >
            Duplicate PI
          </Button>
        )}

        {/* Cancel */}
        {invoice?._id && !isCancelled && onCancel && (
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onCancel}
            loading={loading}
            icon={IoCloseCircleOutline}
          >
            Cancel PI
          </Button>
        )}

        {/* Download PDF */}
        {invoice?._id && onDownloadPdf && (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onDownloadPdf}
            icon={IoDownloadOutline}
          >
            Download PDF
          </Button>
        )}

        {/* Print */}
        {onPrint && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onPrint}
            icon={IoPrintOutline}
          >
            Print
          </Button>
        )}
      </div>
    </div>
  );
};

export default InvoiceActions;
