import { hashSeed, mulberry32 } from '@/shared/lib/random';
import type { MetricKey, MetricPoint } from './types';
import { metricCatalog } from './catalog';

const DAYS_OF_HISTORY = 120;

interface PatientProfile {
  base: Partial<Record<MetricKey, number>>;
  trendPerDay: Partial<Record<MetricKey, number>>;
  noise: Partial<Record<MetricKey, number>>;
}

const defaultBase: Record<MetricKey, number> = {
  bpSystolic: 118,
  bpDiastolic: 76,
  cigarettes: 0,
  kcal: 2100,
  steps: 8200,
  activityMinutes: 42,
  waterLiters: 1.75,
  stressLevel: 3,
  hb: 138,
  ferritin: 90,
  lymphocytes: 30,
};

const defaultNoise: Record<MetricKey, number> = {
  bpSystolic: 4,
  bpDiastolic: 3,
  cigarettes: 1,
  kcal: 120,
  steps: 900,
  activityMinutes: 8,
  waterLiters: 0.25,
  stressLevel: 1,
  hb: 3,
  ferritin: 6,
  lymphocytes: 2,
};

const patientProfiles: Record<string, PatientProfile> = {
  'p-1': {
    base: {},
    trendPerDay: {},
    noise: {},
  },
  'p-2': {
    base: { bpSystolic: 128, bpDiastolic: 82, cigarettes: 9, stressLevel: 5 },
    trendPerDay: { bpSystolic: 0.09, bpDiastolic: 0.05, cigarettes: 0.02 },
    noise: {},
  },
  'p-3': {
    base: { steps: 9200, activityMinutes: 55 },
    trendPerDay: { steps: 6, activityMinutes: 0.05, stressLevel: -0.01 },
    noise: {},
  },
  'p-4': {
    base: { kcal: 2900, steps: 4200, activityMinutes: 18, bpSystolic: 132, waterLiters: 1 },
    trendPerDay: { kcal: 1.5, steps: -8, bpSystolic: 0.05 },
    noise: {},
  },
  'p-5': {
    base: { hb: 118, ferritin: 32, lymphocytes: 24 },
    trendPerDay: { hb: -0.08, ferritin: -0.15 },
    noise: {},
  },
  'p-6': {
    base: { stressLevel: 4, waterLiters: 1.5, activityMinutes: 38 },
    trendPerDay: { stressLevel: 0.045, activityMinutes: -0.08, waterLiters: -0.004 },
    noise: {},
  },
};

function clampToSensibleBounds(key: MetricKey, value: number) {
  const bounds: Record<MetricKey, [number, number]> = {
    bpSystolic: [95, 175],
    bpDiastolic: [55, 110],
    cigarettes: [0, 30],
    kcal: [1400, 3600],
    steps: [500, 16000],
    activityMinutes: [0, 120],
    waterLiters: [0, 3.5],
    stressLevel: [0, 10],
    hb: [90, 175],
    ferritin: [8, 300],
    lymphocytes: [10, 48],
  };
  const [min, max] = bounds[key];
  return Math.min(max, Math.max(min, value));
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

const seriesCache = new Map<string, MetricPoint[]>();

export function getMetricSeries(patientId: string, metricKey: MetricKey): MetricPoint[] {
  const cacheKey = `${patientId}:${metricKey}`;
  const cached = seriesCache.get(cacheKey);
  if (cached) return cached;

  const profile = patientProfiles[patientId] ?? { base: {}, trendPerDay: {}, noise: {} };
  const base = profile.base[metricKey] ?? defaultBase[metricKey];
  const trendPerDay = profile.trendPerDay[metricKey] ?? 0;
  const noiseAmplitude = profile.noise[metricKey] ?? defaultNoise[metricKey];
  const decimals = metricCatalog[metricKey].decimals;

  const rand = mulberry32(hashSeed(cacheKey));
  const today = new Date();
  const points: MetricPoint[] = [];

  for (let i = DAYS_OF_HISTORY - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const daysFromStart = DAYS_OF_HISTORY - 1 - i;
    const trendOffset = trendPerDay * daysFromStart;
    const noise = (rand() - 0.5) * 2 * noiseAmplitude;
    const value = clampToSensibleBounds(metricKey, base + trendOffset + noise);
    points.push({ date: date.toISOString().slice(0, 10), value: round(value, decimals) });
  }

  seriesCache.set(cacheKey, points);
  return points;
}

export function filterSeriesByDays(points: MetricPoint[], days: number): MetricPoint[] {
  return points.slice(Math.max(0, points.length - days));
}

export function percentChange(points: MetricPoint[]): number {
  if (points.length < 2) return 0;
  const first = points[0].value;
  const last = points[points.length - 1].value;
  if (first === 0) return 0;
  return round(((last - first) / first) * 100, 1);
}

export function average(points: MetricPoint[]): number {
  if (points.length === 0) return 0;
  const sum = points.reduce((acc, p) => acc + p.value, 0);
  return sum / points.length;
}
