import React from 'react';
import { STATUS_COLORS } from '../../constants/invoiceConstants';

const Badge = ({ status, className = '' }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;
