import type { MetricKey } from '@/entities/health-metric';
import { average, filterSeriesByDays, getMetricSeries, percentChange } from '@/entities/health-metric';
import { findGroupById } from '@/entities/group';
import { findUserById, fullName } from '@/entities/user';
import type { GroupReport, ReportRow } from '../model/types';

export function buildGroupReport(
  groupId: string,
  metricKey: MetricKey,
  periodDays: number,
): GroupReport | null {
  const group = findGroupById(groupId);
  if (!group) return null;

  const rows: ReportRow[] = group.patientIds.map((patientId) => {
    const patient = findUserById(patientId);
    const series = filterSeriesByDays(getMetricSeries(patientId, metricKey), periodDays);
    return {
      patientId,
      patientName: patient ? fullName(patient) : patientId,
      average: average(series),
      changePercent: percentChange(series),
      latestValue: series[series.length - 1]?.value ?? 0,
    };
  });

  const groupAverage = rows.reduce((acc, r) => acc + r.average, 0) / (rows.length || 1);
  const groupChangePercent = rows.reduce((acc, r) => acc + r.changePercent, 0) / (rows.length || 1);

  return {
    groupId: group.id,
    groupName: group.name,
    metricKey,
    periodDays,
    rows,
    groupAverage,
    groupChangePercent: Math.round(groupChangePercent * 10) / 10,
  };
}
