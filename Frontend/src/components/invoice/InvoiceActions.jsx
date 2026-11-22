// import React from 'react';
// import Button from '../common/Button';
// import {
//   IoSaveOutline,
//   IoCheckmarkCircleOutline,
//   IoCloseCircleOutline,
//   IoCopyOutline,
//   IoDownloadOutline,
//   IoPrintOutline,
//   IoEyeOutline
// } from 'react-icons/io5';

// const InvoiceActions = ({
//   invoice,
//   onSaveDraft,
//   onApprove,
//   onCancel,
//   onDuplicate,
//   onDownloadPdf,
//   onPrint,
//   onPreviewToggle,
//   isPreviewMode = false,
//   loading = false
// }) => {
//   const isApproved = invoice?.invoiceStatus === 'Approved';
//   const isCancelled = invoice?.invoiceStatus === 'Cancelled';

//   return (
//     <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2 sm:gap-3 sticky top-16 z-20 shadow-xs">
//       <div className="flex items-center gap-2">
//         <Button
//           type="button"
//           variant="secondary"
//           size="sm"
//           onClick={onPreviewToggle}
//           icon={IoEyeOutline}
//         >
//           {isPreviewMode ? 'Back to Editor' : 'Exact PDF Preview'}
//         </Button>
//       </div>

//       <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
//         {/* Save Draft */}
//         {!isApproved && !isCancelled && onSaveDraft && (
//           <Button
//             type="button"
//             variant="secondary"
//             size="sm"
//             onClick={onSaveDraft}
//             loading={loading}
//             icon={IoSaveOutline}
//           >
//             Save Draft
//           </Button>
//         )}

//         {/* Approve */}
//         {!isApproved && !isCancelled && onApprove && (
//           <Button
//             type="button"
//             variant="success"
//             size="sm"
//             onClick={onApprove}
//             loading={loading}
//             icon={IoCheckmarkCircleOutline}
//           >
//             Approve & Lock
//           </Button>
//         )}

//         {/* Duplicate */}
//         {invoice?._id && onDuplicate && (
//           <Button
//             type="button"
//             variant="secondary"
//             size="sm"
//             onClick={onDuplicate}
//             loading={loading}
//             icon={IoCopyOutline}
//           >
//             Duplicate PI
//           </Button>
//         )}

//         {/* Cancel */}
//         {invoice?._id && !isCancelled && onCancel && (
//           <Button
//             type="button"
//             variant="danger"
//             size="sm"
//             onClick={onCancel}
//             loading={loading}
//             icon={IoCloseCircleOutline}
//           >
//             Cancel PI
//           </Button>
//         )}

//         {/* Download PDF */}
//         {invoice?._id && onDownloadPdf && (
//           <Button
//             type="button"
//             variant="primary"
//             size="sm"
//             onClick={onDownloadPdf}
//             icon={IoDownloadOutline}
//           >
//             Download PDF
//           </Button>
//         )}

//         {/* Print */}
//         {onPrint && (
//           <Button
//             type="button"
//             variant="secondary"
//             size="sm"
//             onClick={onPrint}
//             icon={IoPrintOutline}
//           >
//             Print
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InvoiceActions;





import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import {
  IoSaveOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCopyOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoEyeOutline,
  IoArrowBackOutline
} from 'react-icons/io5';

// Wrapper for every action button.
// - Phones: buttons share the row equally (flex-1) and fill their slot.
// - sm and up: buttons keep their natural width.
const slotClass =
  'min-w-0 flex-1 sm:flex-none [&_button]:w-full sm:[&_button]:w-auto [&_button]:whitespace-nowrap [&_button]:justify-center';

const InvoiceActions = ({
  invoice,
  title = 'Create Proforma Invoice',
  subtitle = 'Fill in the details below, then save as draft or approve.',
  onBack,
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
  const navigate = useNavigate();
  const isApproved = invoice?.invoiceStatus === 'Approved';
  const isCancelled = invoice?.invoiceStatus === 'Cancelled';

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    // Sticky only from sm up: on phones the bar is two rows tall, so it scrolls away to save screen space.
    <div className="bg-white border-b border-slate-200 shadow-xs sm:sticky sm:top-16 z-20">
      <div className="flex flex-col lg:flex-row lg:items-center gap-2.5 sm:gap-3 lg:gap-4  py-2.5 sm:py-3.5">
        {/* ===== Heading: back icon (top left) + main title ===== */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            title="Back"
            className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          >
            <IoArrowBackOutline className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/*
          ===== Actions =====
          Phones (below sm): two rows.
            Row 1: Approve & Lock (full width)
            Row 2: the remaining buttons (Preview, Save Draft, Print) share the row equally
          sm and up: one row, right-aligned (scrolls sideways if it ever runs out of room).
        */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 lg:ml-auto sm:justify-end sm:overflow-x-auto sm:overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Preview toggle (short label on phones) */}
          <div className={slotClass}>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onPreviewToggle}
              icon={IoEyeOutline}
            >
              <span className="sm:hidden">{isPreviewMode ? 'Editor' : 'Preview'}</span>
              <span className="hidden sm:inline">{isPreviewMode ? 'Back to Editor' : 'Exact PDF Preview'}</span>
            </Button>
          </div>

          {/* Save Draft */}
          {!isApproved && !isCancelled && onSaveDraft && (
            <div className={slotClass}>
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
            </div>
          )}

          {/* Approve & Lock: its own full-width first row on phones, normal position from sm up */}
          {!isApproved && !isCancelled && onApprove && (
            <div className={`${slotClass} order-first basis-full sm:basis-auto sm:order-none`}>
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
            </div>
          )}

          {/* Duplicate */}
          {invoice?._id && onDuplicate && (
            <div className={slotClass}>
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
            </div>
          )}

          {/* Cancel */}
          {invoice?._id && !isCancelled && onCancel && (
            <div className={slotClass}>
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
            </div>
          )}

          {/* Download PDF */}
          {invoice?._id && onDownloadPdf && (
            <div className={slotClass}>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onDownloadPdf}
                icon={IoDownloadOutline}
              >
                Download PDF
              </Button>
            </div>
          )}

          {/* Print */}
          {onPrint && (
            <div className={slotClass}>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onPrint}
                icon={IoPrintOutline}
              >
                Print
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceActions;