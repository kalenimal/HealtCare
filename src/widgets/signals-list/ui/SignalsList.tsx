import { useNavigate } from 'react-router-dom';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { metricCatalog } from '@/entities/health-metric';
import { useSignalStore, type Signal } from '@/entities/signal';
import { findUserById, fullName } from '@/entities/user';

const severityTone = { critical: 'critical', warning: 'warning', info: 'info' } as const;
const severityLabel = { critical: 'Критично', warning: 'Внимание', info: 'Информация' } as const;

export function SignalsList({ signals }: { signals: Signal[] }) {
  const navigate = useNavigate();
  const markReviewed = useSignalStore((s) => s.markReviewed);

  if (signals.length === 0) {
    return (
      <p className="text-sm text-navy-800/60">
        Активных сигналов нет — все участники в пределах нормы.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {signals.map((signal) => {
        const patient = findUserById(signal.patientId);
        const metric = metricCatalog[signal.metricKey];
        return (
          <div
            key={signal.id}
            className="flex flex-col gap-3 rounded-xl border border-navy-400/15 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={severityTone[signal.severity]}>
                  {severityLabel[signal.severity]}
                </Badge>
                <span className="text-sm font-semibold text-navy-950">
                  {patient ? fullName(patient) : signal.patientId}
                </span>
                <span className="text-xs text-navy-800/50">
                  {metric.label} · {signal.changePercent > 0 ? '+' : ''}
                  {signal.changePercent}%
                </span>
              </div>
              <p className="text-sm text-navy-950/70">{signal.reason}</p>
              <span className="text-xs text-navy-800/40">
                {new Date(signal.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/specialist/participants/${signal.patientId}`)}
              >
                Профиль участника
              </Button>
              <Button variant="ghost" size="sm" onClick={() => markReviewed(signal.id)}>
                Отметить проверенным
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
