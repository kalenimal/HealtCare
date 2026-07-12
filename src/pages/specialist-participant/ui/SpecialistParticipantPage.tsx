import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { TrendBadge } from '@/shared/ui/TrendBadge';
import { Button } from '@/shared/ui/Button';
import { findUserById, fullName } from '@/entities/user';
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
import { getSignalsForPatient } from '@/entities/signal';
import { PeriodSelect } from '@/features/period-select/ui/PeriodSelect';
import { HealthTable, type HealthTableRow } from '@/widgets/health-table/ui/HealthTable';
import { HealthChart } from '@/widgets/health-chart/ui/HealthChart';
import { SignalsList } from '@/widgets/signals-list/ui/SignalsList';

const toneByCommentTone = { info: 'info', warning: 'warning', critical: 'critical' } as const;

export function SpecialistParticipantPage() {
  const { patientId = '' } = useParams();
  const navigate = useNavigate();
  const patient = findUserById(patientId);

  const [periodDays, setPeriodDays] = useState(30);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('bpSystolic');

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
  const signals = useMemo(() => getSignalsForPatient(patientId), [patientId]);

  if (!patient) {
    return (
      <PageContainer>
        <p className="text-mist-100">Участник не найден.</p>
        <Button variant="secondary" onClick={() => navigate('/specialist')} className="mt-4">
          Назад к списку
        </Button>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <button
          onClick={() => navigate('/specialist')}
          className="w-fit cursor-pointer text-sm font-medium text-mist-100 hover:underline"
        >
          ← Назад к участникам
        </button>

        <Card>
          <CardBody className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar name={fullName(patient)} size={64} />
              <div>
                <h1 className="text-xl font-semibold text-navy-950">{fullName(patient)}</h1>
                <p className="text-sm text-navy-800/60">{patient.organization}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="text-center">
                <p className="text-navy-800/50">Возраст</p>
                <p className="font-semibold text-navy-950">{patient.vitals.age}</p>
              </div>
              <div className="text-center">
                <p className="text-navy-800/50">Рост</p>
                <p className="font-semibold text-navy-950">{patient.vitals.heightCm} см</p>
              </div>
              <div className="text-center">
                <p className="text-navy-800/50">Вес</p>
                <p className="font-semibold text-navy-950">{patient.vitals.weightKg} кг</p>
              </div>
              <div className="text-center">
                <p className="text-navy-800/50">Телефон</p>
                <p className="font-semibold text-navy-950">{patient.phone}</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {signals.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-navy-950">Сигналы по участнику</h2>
            </CardHeader>
            <CardBody>
              <SignalsList signals={signals} />
            </CardBody>
          </Card>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-mist-100">Агрегированные показатели</h2>
          <PeriodSelect value={periodDays} onChange={setPeriodDays} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
          <Card>
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
                <h2 className="font-semibold text-navy-950">{selectedRow?.metric.label ?? ''}</h2>
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
              <div key={comment.id} className="rounded-xl border border-navy-400/15 p-4">
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
