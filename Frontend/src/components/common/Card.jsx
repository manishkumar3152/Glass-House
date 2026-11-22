import React from 'react';

const Card = ({ children, title, subtitle, headerActions, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white rounded border border-slate-200 shadow-xs overflow-hidden ${className}`}>
      {(title || headerActions) && (
        <div className="px-3.5 sm:px-5 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="min-w-0">
            {title && <h3 className="font-semibold text-slate-800 text-sm sm:text-base truncate">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex flex-wrap items-center gap-2 shrink-0">{headerActions}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-3.5 sm:p-5'}>{children}</div>
    </div>
  );
};

export default Card;
