import type { MetricKey } from '@/entities/health-metric';

export interface ReportRow {
  patientId: string;
  patientName: string;
  average: number;
  changePercent: number;
  latestValue: number;
}

export interface GroupReport {
  groupId: string;
  groupName: string;
  metricKey: MetricKey;
  periodDays: number;
  rows: ReportRow[];
  groupAverage: number;
  groupChangePercent: number;
}
