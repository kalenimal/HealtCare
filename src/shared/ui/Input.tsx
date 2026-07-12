import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    return (
      <label className="flex flex-col gap-1.5 text-left" htmlFor={id}>
        {label && (
          <span className="text-sm font-medium text-navy-950">{label}</span>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'rounded-xl border bg-mist-100 px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors',
            'placeholder:text-navy-400/70 focus:border-navy-800 focus:ring-2 focus:ring-navy-800/15',
            error ? 'border-sand-300 ring-1 ring-sand-300/40' : 'border-navy-400/30',
            className,
          )}
          {...rest}
        />
        {error && <span className="text-xs text-navy-950/70">{error}</span>}
      </label>
    );
  },
);
Input.displayName = 'Input';
