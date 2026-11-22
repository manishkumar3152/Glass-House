import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{message}</p>
        <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={loading} size="sm">
            {cancelText}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading} size="sm">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
