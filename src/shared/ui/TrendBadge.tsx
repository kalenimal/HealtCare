import { Badge } from './Badge';

export function TrendBadge({
  changePercent,
  higherIsBetter,
}: {
  changePercent: number;
  higherIsBetter: boolean;
}) {
  if (Math.abs(changePercent) < 0.5) {
    return <Badge tone="neutral">без изменений</Badge>;
  }

  const isPositiveDirection = changePercent > 0 === higherIsBetter;
  const arrow = changePercent > 0 ? '↑' : '↓';

  return (
    <Badge tone={isPositiveDirection ? 'success' : 'warning'}>
      {arrow} {Math.abs(changePercent)}%
    </Badge>
  );
}
