export type MetricKey =
  | 'bpSystolic'
  | 'bpDiastolic'
  | 'cigarettes'
  | 'kcal'
  | 'steps'
  | 'activityMinutes'
  | 'waterLiters'
  | 'stressLevel'
  | 'hb'
  | 'ferritin'
  | 'lymphocytes';

export interface MetricDefinition {
  key: MetricKey;
  label: string;
  shortLabel: string;
  unit: string;
  group: 'vitals' | 'lifestyle' | 'labs';
  normalRange: [number, number];
  higherIsBetter: boolean;
  decimals: number;
}

export interface MetricPoint {
  date: string; // ISO date
  value: number;
}

export interface MetricComment {
  id: string;
  patientId: string;
  date: string;
  author: 'system' | 'specialist';
  authorName: string;
  metricKey: MetricKey | null;
  text: string;
  tone: 'info' | 'warning' | 'critical';
}
