import clsx from 'clsx';
import type { UserRole } from '@/entities/user';

const options: { value: UserRole; label: string }[] = [
  { value: 'patient', label: 'Я пациент' },
  { value: 'specialist', label: 'Я специалист' },
];

export function RoleSwitch({
  value,
  onChange,
}: {
  value: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <div className="flex rounded-xl bg-navy-400/10 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={clsx(
            'flex-1 cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            value === option.value
              ? 'bg-navy-800 text-mist-100 shadow-sm'
              : 'text-navy-800 hover:bg-navy-400/10',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
