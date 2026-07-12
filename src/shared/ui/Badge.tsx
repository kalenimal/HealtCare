import type { ReactNode } from 'react';
import clsx from 'clsx';

type Tone = 'neutral' | 'warning' | 'critical' | 'success' | 'info';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-navy-400/15 text-navy-800',
  warning: 'bg-sand-300/40 text-navy-950',
  critical: 'bg-navy-950 text-mist-100',
  success: 'bg-emerald-100 text-emerald-800',
  info: 'bg-navy-800/10 text-navy-800',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
