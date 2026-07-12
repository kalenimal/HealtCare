import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MetricDefinition, MetricPoint } from '@/entities/health-metric';
import { palette } from '@/shared/config/palette';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

export function HealthChart({
  data,
  metric,
}: {
  data: MetricPoint[];
  metric: MetricDefinition;
}) {
  const [normalMin, normalMax] = metric.normalRange;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -12 }}>
        <CartesianGrid stroke={palette.navy400} strokeOpacity={0.15} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: palette.navy800, fontSize: 12 }}
          axisLine={{ stroke: palette.navy400, strokeOpacity: 0.3 }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: palette.navy800, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        {normalMax > 0 && (
          <ReferenceArea
            y1={normalMin}
            y2={normalMax}
            fill={palette.navy400}
            fillOpacity={0.12}
            strokeOpacity={0}
          />
        )}
        <Tooltip
          labelFormatter={(label) => formatDate(String(label))}
          formatter={(value) => [`${value} ${metric.unit}`, metric.label]}
          contentStyle={{
            borderRadius: 12,
            borderColor: palette.navy400,
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={palette.navy800}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 4, fill: palette.navy950 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
