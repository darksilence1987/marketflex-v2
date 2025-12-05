import {type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, leftIcon, rightIcon, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full h-12 bg-slate-900/50 border border-slate-800 rounded-xl
              text-white placeholder:text-slate-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
              transition-all duration-200
              ${leftIcon ? 'pl-12' : 'pl-4'}
              ${rightIcon ? 'pr-12' : 'pr-4'}
              ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
