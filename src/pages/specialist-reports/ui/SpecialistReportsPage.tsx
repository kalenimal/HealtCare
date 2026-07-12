import { useState } from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Card, CardBody, CardHeader } from '@/shared/ui/Card';
import { Select } from '@/shared/ui/Select';
import { Button } from '@/shared/ui/Button';
import { TrendBadge } from '@/shared/ui/TrendBadge';
import { mockGroups } from '@/entities/group';
import { metricCatalog, metricKeys, type MetricKey } from '@/entities/health-metric';
import { buildGroupReport, type GroupReport } from '@/entities/report';
import { PeriodSelect } from '@/features/period-select/ui/PeriodSelect';
import { ExportButton } from '@/features/export-xls/ui/ExportButton';

export function SpecialistReportsPage() {
  const [groupId, setGroupId] = useState(mockGroups[0].id);
  const [metricKey, setMetricKey] = useState<MetricKey>('bpSystolic');
  const [periodDays, setPeriodDays] = useState(30);
  const [report, setReport] = useState<GroupReport | null>(null);

  const handleGenerate = () => {
    setReport(buildGroupReport(groupId, metricKey, periodDays));
  };

  const metric = metricCatalog[metricKey];

  const exportColumns = [
    { header: 'Участник', key: 'name', width: 28 },
    { header: 'Среднее значение', key: 'average', width: 20 },
    { header: 'Текущее значение', key: 'latest', width: 18 },
    { header: 'Динамика, %', key: 'change', width: 16 },
  ];

  const exportRows =
    report?.rows.map((row) => ({
      name: row.patientName,
      average: Math.round(row.average * 10) / 10,
      latest: row.latestValue,
      change: row.changePercent,
    })) ?? [];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-semibold text-mist-100">Отчёты по группам</h1>
          <p className="text-sm text-mist-100/70">
            Сформируйте отчёт по показателю для выбранной группы участников
          </p>
        </div>

        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Select label="Группа" value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                {mockGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </Select>
              <Select
                label="Показатель"
                value={metricKey}
                onChange={(e) => setMetricKey(e.target.value as MetricKey)}
              >
                {metricKeys.map((key) => (
                  <option key={key} value={key}>
                    {metricCatalog[key].label}
                  </option>
                ))}
              </Select>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-navy-950">Период</span>
                <PeriodSelect value={periodDays} onChange={setPeriodDays} />
              </div>
            </div>
            <div>
              <Button onClick={handleGenerate}>Сформировать отчёт</Button>
            </div>
          </CardBody>
        </Card>

        {report && (
          <Card>
            <CardHeader className="flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-navy-950">
                  {report.groupName} · {metric.label}
                </h2>
                <p className="text-sm text-navy-800/60">
                  Среднее по группе: {Math.round(report.groupAverage * 10) / 10} {metric.unit}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <TrendBadge
                  changePercent={report.groupChangePercent}
                  higherIsBetter={metric.higherIsBetter}
                />
                <ExportButton
                  fileName={`report-${report.groupId}-${report.metricKey}`}
                  sheetName="Отчёт по группе"
                  columns={exportColumns}
                  rows={exportRows}
                  label="Экспорт в XLS"
                />
              </div>
            </CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-navy-400/20 text-left text-navy-800/60">
                      <th className="py-2 pr-3 font-medium">Участник</th>
                      <th className="py-2 pr-3 font-medium">Текущее значение</th>
                      <th className="py-2 pr-3 font-medium">Среднее за период</th>
                      <th className="py-2 pr-3 font-medium">Динамика</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((row) => (
                      <tr key={row.patientId} className="border-b border-navy-400/10">
                        <td className="py-2.5 pr-3 font-medium text-navy-950">
                          {row.patientName}
                        </td>
                        <td className="py-2.5 pr-3 text-navy-950">
                          {row.latestValue} <span className="text-navy-800/50">{metric.unit}</span>
                        </td>
                        <td className="py-2.5 pr-3 text-navy-950">
                          {Math.round(row.average * 10) / 10}{' '}
                          <span className="text-navy-800/50">{metric.unit}</span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <TrendBadge
                            changePercent={row.changePercent}
                            higherIsBetter={metric.higherIsBetter}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
