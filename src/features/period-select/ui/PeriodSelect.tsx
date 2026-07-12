import clsx from 'clsx';

export const periodOptions = [
  { days: 7, label: '7 дней' },
  { days: 30, label: '30 дней' },
  { days: 90, label: '90 дней' },
  { days: 120, label: '120 дней' },
];

export function PeriodSelect({
  value,
  onChange,
}: {
  value: number;
  onChange: (days: number) => void;
}) {
  return (
    <div className="flex rounded-xl bg-mist-100 p-1 shadow-sm">
      {periodOptions.map((option) => (
        <button
          key={option.days}
          type="button"
          onClick={() => onChange(option.days)}
          className={clsx(
            'cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            value === option.days
              ? 'bg-navy-800 text-mist-100 shadow-sm'
              : 'text-navy-800 hover:bg-navy-400/15',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
