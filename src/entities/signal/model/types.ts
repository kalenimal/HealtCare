import type { MetricKey } from '@/entities/health-metric';

export type SignalSeverity = 'critical' | 'warning' | 'info';
export type SignalStatus = 'new' | 'reviewed';

export interface Signal {
  id: string;
  patientId: string;
  metricKey: MetricKey;
  severity: SignalSeverity;
  status: SignalStatus;
  changePercent: number;
  reason: string;
  createdAt: string;
}
