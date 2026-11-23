import React, { useState } from 'react';
import {
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoChevronDownOutline,
  IoAlertCircleOutline
} from 'react-icons/io5';
import Modal from './Modal';
import Button from './Button';

/**
 * SelectionToolbar Component
 *
 * Appears when items are selected in tables / lists.
 * Provides bulk delete functionality, bulk status change functionality,
 * select all / deselect all, and optional custom actions.
 */
const SelectionToolbar = ({
  selectedCount = 0,
  totalCount,
  onClearSelection,
  onSelectAll,
  onDelete,
  deleteLabel,
  deleteLoading = false,
  statusOptions = [],
  onStatusChange,
  statusLoading = false,
  statusLabel = 'Change Status',
  itemLabel = 'items',
  position = 'floating', // 'floating' | 'inline'
  className = '',
  children
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (selectedCount <= 0) return null;

  const handleDeleteClick = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteOpen(false);
    if (onDelete) {
      await onDelete();
    }
  };

  const handleStatusSelect = async (e) => {
    const val = e.target.value;
    if (!val) return;
    if (onStatusChange) {
      await onStatusChange(val);
    }
    e.target.value = '';
  };

  const containerClasses = position === 'inline'
    ? `w-full bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 my-3 ${className}`
    : `fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-2xl bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/90 px-3.5 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-200 ${className}`;

  return (
    <>
      <div className={containerClasses} role="toolbar" aria-label="Selection Actions">
        {/* Left: Count, Select All, and Clear */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-primary-900/80 text-primary-200 border border-primary-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
            <span className="font-bold text-white text-xs sm:text-sm">{selectedCount}</span>
            <span className="text-[11px] sm:text-xs text-primary-200">{itemLabel} selected</span>
          </div>

          {onSelectAll && totalCount && selectedCount < totalCount && (
            <button
              type="button"
              onClick={onSelectAll}
              className="text-xs text-primary-300 hover:text-white underline font-medium transition-colors hidden sm:inline-block"
            >
              Select all {totalCount}
            </button>
          )}

          {onClearSelection && (
            <button
              type="button"
              onClick={onClearSelection}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs"
              title="Clear selection"
            >
              <IoCloseOutline className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden md:inline text-[11px]">Deselect</span>
            </button>
          )}
        </div>

        {/* Right: Status Change, Delete, and Custom Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Change Dropdown */}
          {statusOptions && statusOptions.length > 0 && onStatusChange && (
            <div className="flex items-center gap-1.5">
              <label htmlFor="selection-status-select" className="text-xs text-slate-400 font-medium hidden md:inline">
                Status:
              </label>
              <div className="relative">
                <select
                  id="selection-status-select"
                  disabled={statusLoading}
                  onChange={handleStatusSelect}
                  defaultValue=""
                  className="appearance-none text-xs bg-slate-800 border border-slate-700 text-slate-100 hover:bg-slate-700/80 rounded-lg pl-3 pr-7 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium cursor-pointer transition-colors disabled:opacity-50"
                >
                  <option value="" disabled>
                    {statusLoading ? 'Updating...' : statusLabel}
                  </option>
                  {statusOptions.map((opt) => {
                    const value = typeof opt === 'object' ? opt.value : opt;
                    const label = typeof opt === 'object' ? opt.label : opt;
                    return (
                      <option key={value} value={value} className="bg-slate-900 text-slate-100">
                        {label}
                      </option>
                    );
                  })}
                </select>
                <IoChevronDownOutline className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Delete Action Button */}
          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={deleteLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-600/90 hover:bg-rose-600 active:bg-rose-700 text-white shadow-sm transition-colors disabled:opacity-50"
              title={`Delete ${selectedCount} selected ${itemLabel}`}
            >
              <IoTrashOutline className="w-4 h-4" />
              <span>{deleteLoading ? 'Deleting...' : (deleteLabel || `Delete (${selectedCount})`)}</span>
            </button>
          )}

          {/* Custom children / extra actions */}
          {children}
        </div>
      </div>

      {/* Built-in Delete Confirmation Dialog */}
      {onDelete && (
        <Modal
          isOpen={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          title={`Confirm Deletion`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-rose-100 text-rose-600 shrink-0">
                <IoAlertCircleOutline className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  Delete {selectedCount} selected {itemLabel}?
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete these {selectedCount} {itemLabel}? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setConfirmDeleteOpen(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDelete}
                loading={deleteLoading}
                icon={IoTrashOutline}
              >
                Delete {selectedCount} {itemLabel}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SelectionToolbar;
