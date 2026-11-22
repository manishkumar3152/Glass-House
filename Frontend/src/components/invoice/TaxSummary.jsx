import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';

const TaxSummary = ({ calculation = {}, readOnly = false, onTaxTypeToggle }) => {
  const {
    glassTotal = 0,
    totalProcessingCost = 0,
    totalCost = 0,
    additionalCharges = {},
    totalAdditionalCharges = 0,
    taxableAmount = 0,
    taxDetails = {},
    finalAmount = 0,
    roundedAmount = 0,
    roundOffDifference = 0,
    amountInWords = ''
  } = calculation;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3.5 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 border-b border-slate-200 pb-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-primary-900 uppercase tracking-wide">
          4. Invoice Financial Summary & Tax
        </h3>
        {!readOnly && onTaxTypeToggle && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-600 font-medium">Tax Mode:</span>
            <button
              type="button"
              onClick={() => onTaxTypeToggle(!taxDetails.isInterState)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 transition-colors"
            >
              {taxDetails.isInterState ? 'IGST (Inter-State 18%)' : 'CGST + SGST (Intra-State 9%+9%)'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
        {/* Left pane: Words & Notes */}
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Amount Chargeable (in words):
            </div>
            <div className="text-sm font-bold text-slate-900 italic">
              {amountInWords || 'Rupees Zero Only'}
            </div>
          </div>

          <div className="text-xs text-slate-500 space-y-1 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
            <div className="font-semibold text-primary-900">Summary Rules Applied:</div>
            <div>• Total Cost = Glass Subtotal + Processing Cost</div>
            <div>• Insurance ({additionalCharges.insurancePercent || 2}%) calculated on Total Cost</div>
            <div>• Taxable Amount = Total Cost + Total Additional Charges</div>
            <div>• Rounding to nearest Indian Rupee with fractional round-off difference</div>
          </div>
        </div>

        {/* Right pane: Figures Breakdown */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-200/80">
              <tr>
                <td className="py-1.5 text-slate-600 font-medium">Glass Total:</td>
                <td className="py-1.5 text-right font-semibold text-slate-900">₹{formatCurrency(glassTotal)}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-600 font-medium">Total Processing Cost:</td>
                <td className="py-1.5 text-right font-semibold text-slate-900">₹{formatCurrency(totalProcessingCost)}</td>
              </tr>
              <tr className="bg-slate-100/70">
                <td className="py-1.5 font-bold text-slate-800">Total Cost (Glass + Process):</td>
                <td className="py-1.5 text-right font-bold text-slate-900">₹{formatCurrency(totalCost)}</td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-600 font-medium">
                  Insurance & Handling ({additionalCharges.insurancePercent || 2}%):
                </td>
                <td className="py-1.5 text-right font-semibold text-slate-900">
                  ₹{formatCurrency(additionalCharges.insuranceAmount)}
                </td>
              </tr>
              <tr>
                <td className="py-1.5 text-slate-600 font-medium">Document Charge:</td>
                <td className="py-1.5 text-right font-semibold text-slate-900">
                  ₹{formatCurrency(additionalCharges.documentCharge)}
                </td>
              </tr>
              {additionalCharges.otherCharges > 0 && (
                <tr>
                  <td className="py-1.5 text-slate-600 font-medium">Other Charges:</td>
                  <td className="py-1.5 text-right font-semibold text-slate-900">
                    ₹{formatCurrency(additionalCharges.otherCharges)}
                  </td>
                </tr>
              )}
              <tr>
                <td className="py-1.5 font-bold text-slate-700">Total Additional Charges:</td>
                <td className="py-1.5 text-right font-bold text-slate-900">₹{formatCurrency(totalAdditionalCharges)}</td>
              </tr>
              <tr className="bg-slate-100 font-bold">
                <td className="py-2 text-slate-800">Total Amount Before Tax:</td>
                <td className="py-2 text-right text-slate-900">₹{formatCurrency(taxableAmount)}</td>
              </tr>

              {taxDetails.isInterState ? (
                <tr>
                  <td className="py-1.5 text-slate-700 font-medium">IGST @ {taxDetails.igstRate || 18}%:</td>
                  <td className="py-1.5 text-right font-bold text-slate-900">₹{formatCurrency(taxDetails.igstAmount)}</td>
                </tr>
              ) : (
                <>
                  <tr>
                    <td className="py-1.5 text-slate-700 font-medium">CGST @ {taxDetails.cgstRate || 9}%:</td>
                    <td className="py-1.5 text-right font-semibold text-slate-900">₹{formatCurrency(taxDetails.cgstAmount)}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 text-slate-700 font-medium">SGST @ {taxDetails.sgstRate || 9}%:</td>
                    <td className="py-1.5 text-right font-semibold text-slate-900">₹{formatCurrency(taxDetails.sgstAmount)}</td>
                  </tr>
                </>
              )}

              <tr>
                <td className="py-1.5 text-slate-700 font-medium">Total Amount After Tax:</td>
                <td className="py-1.5 text-right font-bold text-slate-900">₹{formatCurrency(finalAmount)}</td>
              </tr>
              <tr>
                <td className="py-1 text-slate-500">Round Off:</td>
                <td className="py-1 text-right text-slate-600 font-mono">
                  {roundOffDifference >= 0 ? '+' : ''}{Number(roundOffDifference).toFixed(2)}
                </td>
              </tr>
              <tr className="bg-primary-900 text-white font-extrabold text-sm rounded">
                <td className="py-2.5 px-2 rounded-l">Rounded Amount:</td>
                <td className="py-2.5 px-2 text-right rounded-r text-base">₹{formatCurrency(roundedAmount)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaxSummary;
