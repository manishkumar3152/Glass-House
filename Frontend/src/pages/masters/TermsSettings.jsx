import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { IoReaderOutline, IoSaveOutline } from 'react-icons/io5';

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
  const [terms, setTerms] = useState(initial15Terms);

  const handleTermChange = (index, value) => {
    const updated = [...terms];
    updated[index] = value;
    setTerms(updated);
  };

  const handleSave = () => {
    toast.success('Terms and conditions saved for future invoices');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-900 shrink-0">
            <IoReaderOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Terms and Conditions Master</h2>
            <p className="text-xs text-slate-500">
              All 15 standard glass processing industry clauses printed on Page 2 of every Proforma Invoice.
            </p>
          </div>
        </div>
        <div className="self-start sm:self-auto">
          <Button variant="primary" icon={IoSaveOutline} size="sm" onClick={handleSave}>
            Save All Terms
          </Button>
        </div>
      </div>

      <Card title="Page 2 Terms & Conditions (15 Clauses)">
        <div className="space-y-3">
          {terms.map((t, idx) => (
            <div key={idx} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="w-7 sm:w-8 font-bold text-primary-900 text-xs pt-1 shrink-0">{idx + 1}.</span>
              <textarea
                rows={2}
                value={t}
                onChange={(e) => handleTermChange(idx, e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-primary-500 bg-white"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TermsSettings;
