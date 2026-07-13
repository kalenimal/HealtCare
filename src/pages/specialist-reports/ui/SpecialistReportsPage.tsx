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
import { exportSheetsToXlsx, type XlsxSheet } from '@/shared/lib/export-xlsx';

export function SpecialistReportsPage() {
  const [groupId, setGroupId] = useState(mockGroups[0].id);
  const [metricKey, setMetricKey] = useState<MetricKey>('bpSystolic');
  const [periodDays, setPeriodDays] = useState(30);
  const [report, setReport] = useState<GroupReport | null>(null);

  const [compareKeys, setCompareKeys] = useState<MetricKey[]>([]);
  const [comparing, setComparing] = useState(false);

  const handleGenerate = () => {
    setReport(buildGroupReport(groupId, metricKey, periodDays));
  };

  const metric = metricCatalog[metricKey];
  const selectedGroup = mockGroups.find((g) => g.id === groupId);

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

  const toggleCompareKey = (key: MetricKey) => {
    setCompareKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleExportComparison = async () => {
    if (compareKeys.length === 0) return;
    setComparing(true);
    try {
      const reports = compareKeys
        .map((key) => buildGroupReport(groupId, key, periodDays))
        .filter((r): r is GroupReport => r !== null);
      if (reports.length === 0) return;

      const summarySheet: XlsxSheet = {
        sheetName: 'Сравнение',
        columns: [
          { header: 'Участник', key: 'name', width: 28 },
          ...reports.map((r) => ({
            header: `${metricCatalog[r.metricKey].label}, ${metricCatalog[r.metricKey].unit}`,
            key: r.metricKey,
            width: 24,
          })),
        ],
        rows: reports[0].rows.map((row, idx) => {
          const record: Record<string, string | number> = { name: row.patientName };
          reports.forEach((r) => {
            record[r.metricKey] = Math.round((r.rows[idx]?.average ?? 0) * 10) / 10;
          });
          return record;
        }),
      };

      const detailSheets: XlsxSheet[] = reports.map((r) => ({
        sheetName: metricCatalog[r.metricKey].shortLabel,
        columns: [
          { header: 'Участник', key: 'name', width: 28 },
          { header: 'Среднее значение', key: 'average', width: 20 },
          { header: 'Текущее значение', key: 'latest', width: 18 },
          { header: 'Динамика, %', key: 'change', width: 16 },
        ],
        rows: r.rows.map((row) => ({
          name: row.patientName,
          average: Math.round(row.average * 10) / 10,
          latest: row.latestValue,
          change: row.changePercent,
        })),
      }));

      await exportSheetsToXlsx(`group-comparison-${groupId}`, [summarySheet, ...detailSheets]);
    } finally {
      setComparing(false);
    }
  };

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

        <Card>
          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-navy-950">Сравнение по нескольким показателям</h2>
                <p className="text-sm text-navy-800/60">
                  Выберите показатели, чтобы выгрузить один отчёт для сравнения по группе
                  {selectedGroup ? ` «${selectedGroup.name}»` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setCompareKeys(metricKeys)}>
                  Выбрать все
                </Button>
                <Button variant="ghost" size="sm" type="button" onClick={() => setCompareKeys([])}>
                  Очистить
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {metricKeys.map((key) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-navy-400/15 px-3 py-2 text-sm text-navy-950 hover:bg-navy-400/5"
                >
                  <input
                    type="checkbox"
                    checked={compareKeys.includes(key)}
                    onChange={() => toggleCompareKey(key)}
                    className="h-4 w-4 rounded border-navy-400/40 accent-navy-800"
                  />
                  {metricCatalog[key].label}
                </label>
              ))}
            </div>

            <div>
              <Button onClick={handleExportComparison} disabled={compareKeys.length === 0 || comparing}>
                {comparing
                  ? 'Формируем файл…'
                  : `Экспортировать сравнение (${compareKeys.length})`}
              </Button>
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
