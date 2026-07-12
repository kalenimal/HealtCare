import clsx from 'clsx';
import type { MetricDefinition, MetricKey } from '@/entities/health-metric';
import { TrendBadge } from '@/shared/ui/TrendBadge';

export interface HealthTableRow {
  metric: MetricDefinition;
  average: number;
  latestValue: number;
  changePercent: number;
}

export function HealthTable({
  rows,
  selectedMetric,
  onSelectMetric,
}: {
  rows: HealthTableRow[];
  selectedMetric: MetricKey;
  onSelectMetric: (key: MetricKey) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-navy-400/20 text-left text-navy-800/60">
            <th className="py-2 pr-3 font-medium">Показатель</th>
            <th className="py-2 pr-3 font-medium">Текущее значение</th>
            <th className="py-2 pr-3 font-medium">Среднее за период</th>
            <th className="py-2 pr-3 font-medium">Динамика</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.metric.key}
              onClick={() => onSelectMetric(row.metric.key)}
              className={clsx(
                'cursor-pointer border-b border-navy-400/10 transition-colors hover:bg-navy-400/5',
                selectedMetric === row.metric.key && 'bg-navy-800/5',
              )}
            >
              <td className="py-2.5 pr-3 font-medium text-navy-950">{row.metric.label}</td>
              <td className="py-2.5 pr-3 text-navy-950">
                {row.latestValue} <span className="text-navy-800/50">{row.metric.unit}</span>
              </td>
              <td className="py-2.5 pr-3 text-navy-950">
                {Math.round(row.average * 10) / 10}{' '}
                <span className="text-navy-800/50">{row.metric.unit}</span>
              </td>
              <td className="py-2.5 pr-3">
                <TrendBadge
                  changePercent={row.changePercent}
                  higherIsBetter={row.metric.higherIsBetter}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
