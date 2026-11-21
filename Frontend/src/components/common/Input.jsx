import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  step,
  min,
  max
}, ref) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        step={step}
        min={min}
        max={max}
        className={`w-full px-3 py-1.5 text-sm rounded border ${
          error ? 'border-rose-400 focus:ring-rose-500' : 'border-slate-300 focus:ring-primary-500'
        } focus:outline-none focus:ring-1 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 transition-colors`}
      />
      {error && <span className="text-xs text-rose-500">{error}</span>}
      {helperText && !error && <span className="text-xs text-slate-500">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
