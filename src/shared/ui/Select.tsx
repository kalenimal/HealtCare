import type { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, id, children, ...rest }: SelectProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left" htmlFor={id}>
      {label && <span className="text-sm font-medium text-navy-950">{label}</span>}
      <select
        id={id}
        className={clsx(
          'rounded-xl border border-navy-400/30 bg-mist-100 px-3.5 py-2.5 text-sm text-navy-950 outline-none transition-colors',
          'focus:border-navy-800 focus:ring-2 focus:ring-navy-800/15',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </label>
  );
}
