import { useMemo, useState } from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { TrendBadge } from '@/shared/ui/TrendBadge';
import { useSessionStore } from '@/entities/user';
import {
  average,
  filterSeriesByDays,
  getCommentsForPatient,
  getMetricSeries,
  metricCatalog,
  metricKeys,
  percentChange,
  type MetricKey,
} from '@/entities/health-metric';
import { PeriodSelect } from '@/features/period-select/ui/PeriodSelect';
import { ExportButton } from '@/features/export-xls/ui/ExportButton';
import { HealthTable, type HealthTableRow } from '@/widgets/health-table/ui/HealthTable';
import { HealthChart } from '@/widgets/health-chart/ui/HealthChart';

const toneByCommentTone = { info: 'info', warning: 'warning', critical: 'critical' } as const;

export function HealthStatsPage() {
  const currentUser = useSessionStore((s) => s.currentUser);
  const [periodDays, setPeriodDays] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('bpSystolic');

  const patientId = currentUser?.id ?? '';

  const rows: HealthTableRow[] = useMemo(
    () =>
      metricKeys.map((key) => {
        const series = filterSeriesByDays(getMetricSeries(patientId, key), periodDays);
        return {
          metric: metricCatalog[key],
          average: average(series),
          latestValue: series[series.length - 1]?.value ?? 0,
          changePercent: percentChange(series),
        };
      }),
    [patientId, periodDays],
  );

  const selectedSeries = useMemo(
    () => filterSeriesByDays(getMetricSeries(patientId, selectedMetric), periodDays),
    [patientId, selectedMetric, periodDays],
  );

  const selectedRow = rows.find((r) => r.metric.key === selectedMetric);
  const comments = useMemo(() => getCommentsForPatient(patientId), [patientId]);

  const exportColumns = [
    { header: 'Показатель', key: 'metric', width: 28 },
    { header: 'Текущее значение', key: 'latest', width: 18 },
    { header: 'Среднее за период', key: 'average', width: 20 },
    { header: 'Динамика, %', key: 'change', width: 16 },
    { header: 'Единица измерения', key: 'unit', width: 18 },
  ];

  const exportRows = rows.map((row) => ({
    metric: row.metric.label,
    latest: row.latestValue,
    average: Math.round(row.average * 10) / 10,
    change: row.changePercent,
    unit: row.metric.unit,
  }));

  if (!currentUser) return null;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-mist-100">Показатели здоровья</h1>
            <p className="text-sm text-mist-100/70">Динамика ваших показателей за период</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PeriodSelect value={periodDays} onChange={setPeriodDays} />
            <ExportButton
              fileName={`health-stats-${patientId}`}
              sheetName="Показатели здоровья"
              columns={exportColumns}
              rows={exportRows}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-navy-950">Сводная таблица</h2>
            </CardHeader>
            <CardBody>
              <HealthTable
                rows={rows}
                selectedMetric={selectedMetric}
                onSelectMetric={setSelectedMetric}
              />
            </CardBody>
          </Card>

          <Card className="lg:sticky lg:top-6">
            <CardHeader className="flex-wrap">
              <div>
                <h2 className="font-semibold text-navy-950">
                  {selectedRow?.metric.label ?? ''}
                </h2>
                {selectedRow && (
                  <p className="text-sm text-navy-800/60">
                    {selectedRow.changePercent === 0
                      ? 'Показатель стабилен за выбранный период'
                      : `Показатель ${
                          selectedRow.changePercent > 0 ? 'вырос' : 'снизился'
                        } на ${Math.abs(selectedRow.changePercent)}% за выбранный период`}
                  </p>
                )}
              </div>
              {selectedRow && (
                <TrendBadge
                  changePercent={selectedRow.changePercent}
                  higherIsBetter={selectedRow.metric.higherIsBetter}
                />
              )}
            </CardHeader>
            <CardBody>
              <HealthChart data={selectedSeries} metric={metricCatalog[selectedMetric]} />
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-navy-950">Комментарии и рекомендации</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-3">
            {comments.length === 0 && (
              <p className="text-sm text-navy-800/60">Пока нет комментариев.</p>
            )}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="rounded-xl border border-navy-400/15 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-navy-950">
                      {comment.authorName}
                    </span>
                    <Badge tone="neutral">
                      {comment.author === 'system' ? 'Система' : 'Специалист'}
                    </Badge>
                  </div>
                  <span className="text-xs text-navy-800/50">
                    {new Date(comment.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="text-sm text-navy-950/80">{comment.text}</p>
                <div className="mt-2">
                  <Badge tone={toneByCommentTone[comment.tone]}>
                    {comment.tone === 'critical'
                      ? 'Требует внимания'
                      : comment.tone === 'warning'
                        ? 'Рекомендация'
                        : 'Информация'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}
