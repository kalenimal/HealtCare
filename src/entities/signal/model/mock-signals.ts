import type { Signal } from './types';

export const mockSignals: Signal[] = [
  {
    id: 'sig-1',
    patientId: 'p-2',
    metricKey: 'bpSystolic',
    severity: 'critical',
    status: 'new',
    changePercent: 8.4,
    reason: 'Систолическое давление резко выросло за последние 30 дней, одновременно увеличилось число выкуриваемых сигарет.',
    createdAt: '2026-07-11',
  },
  {
    id: 'sig-2',
    patientId: 'p-4',
    metricKey: 'kcal',
    severity: 'warning',
    status: 'new',
    changePercent: 12.1,
    reason: 'Рост калорийности рациона на фоне снижения количества шагов и физической активности.',
    createdAt: '2026-07-10',
  },
  {
    id: 'sig-3',
    patientId: 'p-5',
    metricKey: 'hb',
    severity: 'warning',
    status: 'new',
    changePercent: -9.6,
    reason: 'Устойчивое снижение гемоглобина и ферритина по лабораторным данным за последний месяц.',
    createdAt: '2026-07-09',
  },
  {
    id: 'sig-4',
    patientId: 'p-6',
    metricKey: 'stressLevel',
    severity: 'critical',
    status: 'new',
    changePercent: 22.3,
    reason: 'Значительный рост уровня стресса при одновременном снижении физической активности.',
    createdAt: '2026-07-11',
  },
  {
    id: 'sig-5',
    patientId: 'p-2',
    metricKey: 'cigarettes',
    severity: 'warning',
    status: 'reviewed',
    changePercent: 15.0,
    reason: 'Постепенный рост количества выкуриваемых сигарет в день на протяжении трёх недель.',
    createdAt: '2026-06-28',
  },
];

export function getSignalsForPatient(patientId: string): Signal[] {
  return mockSignals.filter((s) => s.patientId === patientId);
}

export function getActiveSignals(): Signal[] {
  return mockSignals
    .filter((s) => s.status === 'new')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
