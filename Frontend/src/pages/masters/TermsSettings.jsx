import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SelectionToolbar from '../../components/common/SelectionToolbar';
import toast from 'react-hot-toast';
import {
  IoReaderOutline,
  IoSaveOutline,
  IoArrowBackOutline,
  IoAddOutline,
  IoRefreshOutline,
  IoTrashOutline
} from 'react-icons/io5';

const initial15Terms = [
  'Goods once sold will not be taken back or exchanged under any circumstances.',
  'Any breakage, damage or shortage during transit shall be entirely at buyer\'s / customer\'s risk.',
  'Tolerance for cutting and toughening will be ± 2mm in length and width as per standard industry specifications.',
  'Due to high temperature tempering process, minor roller waves, bow, warp, and optical distortion are inherent characteristics of toughened glass and shall not be treated as defects.',
  'No cutting, drilling, notching, or grinding can be done after the glass is toughened. Any attempt to modify processed glass will cause spontaneous breakage.',
  'Delivery schedule is given in good faith and subject to force majeure, raw material availability, machine maintenance, and uninterrupted power supply.',
  'Payment terms: 100% advance or as agreed mutually in purchase order prior to dispatch.',
  'Interest @ 18% per annum will be charged on overdue payments beyond the agreed credit period.',
  'Inspection of materials must be done at the time of delivery / dispatch. No complaint will be entertained once the material leaves our factory premises.',
  'Insurance coverage during transit will only be applicable if requested specifically by the buyer and charged extra.',
  'Tax rates are subject to change as per statutory government notifications prevailing at the time of invoicing.',
  'Unloading of material at the destination site is the sole responsibility of the customer.',
  'Dimensions and processing details provided by customer in purchase order or approved drawings will be considered final and binding.',
  'Disputes, if any, arising out of this contract shall be subject to the exclusive jurisdiction of local courts only.',
  'This Proforma Invoice is valid for 15 days from the date of issue. Rates and raw material surcharges are subject to revision thereafter.'
];

const TermsSettings = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState(initial15Terms);
  const [selectedIndices, setSelectedIndices] = useState([]);

  const toggleSelect = (idx) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === terms.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(terms.map((_, i) => i));
    }
  };

  const handleTermChange = (index, value) => {
    const updated = [...terms];
    updated[index] = value;
    setTerms(updated);
  };

  const handleAddClause = () => {
    setTerms([...terms, '']);
    toast.success('Added new clause');
  };

  const handleDeleteSingle = (index) => {
    if (terms.length <= 1) {
      toast.error('You must retain at least one clause');
      return;
    }
    setTerms(terms.filter((_, i) => i !== index));
    setSelectedIndices((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
    toast.success('Clause removed');
  };

  const handleBulkDelete = () => {
    if (terms.length - selectedIndices.length < 1) {
      toast.error('You must retain at least one clause');
      return;
    }
    setTerms(terms.filter((_, idx) => !selectedIndices.includes(idx)));
    toast.success(`Removed ${selectedIndices.length} clause(s)`);
    setSelectedIndices([]);
  };

  const handleResetDefaults = () => {
    setTerms([...initial15Terms]);
    setSelectedIndices([]);
    toast.success('Reset all 15 standard clauses to defaults');
  };

  const handleSave = () => {
    toast.success('Terms and conditions saved for future invoices');
  };

  const isAllSelected = terms.length > 0 && selectedIndices.length === terms.length;

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6 pb-20">
      {/* Page heading: back icon (top left) + icon + title + actions */}
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
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800 leading-tight">
              Terms and Conditions Master
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Standard glass processing industry clauses printed on Page 2 of every Proforma Invoice.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button variant="outline" icon={IoAddOutline} size="sm" onClick={handleAddClause}>
            Add Clause
          </Button>
          <Button variant="outline" icon={IoRefreshOutline} size="sm" onClick={handleResetDefaults}>
            Reset Defaults
          </Button>
          <Button variant="primary" icon={IoSaveOutline} size="sm" onClick={handleSave}>
            Save All Terms
          </Button>
        </div>
      </div>

      <Card
        title={
          <div className="flex items-center justify-between w-full">
            <span>Page 2 Terms & Conditions ({terms.length} Clauses)</span>
            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                />
                <span>Select All</span>
              </label>
            </div>
          </div>
        }
      >
        <div className="space-y-2.5 sm:space-y-3">
          {terms.map((t, idx) => {
            const isSelected = selectedIndices.includes(idx);
            return (
              <div
                key={idx}
                className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded border transition-colors ${
                  isSelected
                    ? 'bg-primary-50/50 border-primary-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 pt-2 shrink-0">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(idx)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-500 cursor-pointer"
                    title={`Select clause ${idx + 1}`}
                  />
                  <span className="w-5 sm:w-6 font-bold text-primary-900 text-xs text-right">
                    {idx + 1}.
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={t}
                  onChange={(e) => handleTermChange(idx, e.target.value)}
                  aria-label={`Clause ${idx + 1}`}
                  placeholder="Enter clause text..."
                  className="flex-1 min-w-0 w-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm leading-relaxed rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 focus:outline-none bg-white resize-y"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteSingle(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors shrink-0 mt-1"
                  title="Delete clause"
                >
                  <IoTrashOutline className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Repeat the save button at the end */}
        <div className="flex justify-stretch sm:justify-end pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-slate-200">
          <div className="w-full sm:w-auto [&_button]:w-full sm:[&_button]:w-auto [&_button]:whitespace-nowrap [&_button]:justify-center">
            <Button variant="primary" icon={IoSaveOutline} size="sm" onClick={handleSave}>
              Save All Terms
            </Button>
          </div>
        </div>
      </Card>

      {/* SelectionToolbar for Terms Clauses */}
      <SelectionToolbar
        selectedCount={selectedIndices.length}
        totalCount={terms.length}
        onClearSelection={() => setSelectedIndices([])}
        onSelectAll={toggleSelectAll}
        onDelete={handleBulkDelete}
        deleteLabel={`Delete (${selectedIndices.length})`}
        itemLabel="clauses"
      />
    </div>
  );
};

export default TermsSettings;
