// 반원 게이지 (수의계약 비율 등에 사용, target/max 임계 표기)
export default function SemiGauge({ value, target, max = 50, label, valueLabel, size = 220 }) {
  const w = size;
  const h = size * 0.62;
  const r = size * 0.36;
  const cx = w / 2;
  const cy = h - 6;
  const pct = Math.max(0, Math.min(1, value / max));
  const targetPct = Math.max(0, Math.min(1, target / max));

  const polarToCartesian = (angleDeg) => {
    const a = (Math.PI * angleDeg) / 180;
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
  };
  const arcPath = (fromPct, toPct) => {
    const a1 = 180 - fromPct * 180;
    const a2 = 180 - toPct * 180;
    const [x1, y1] = polarToCartesian(a1);
    const [x2, y2] = polarToCartesian(a2);
    const large = a1 - a2 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const [tx, ty] = polarToCartesian(180 - targetPct * 180);
  const over = value > target;

  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} width="100%" height={h + 24}>
      <path d={arcPath(0, 1)} fill="none" stroke="var(--section)" strokeWidth={size * 0.09} strokeLinecap="round" />
      <path d={arcPath(0, pct)} fill="none" stroke={over ? "#FF9500" : "#0046FF"} strokeWidth={size * 0.09} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="#B36A00" strokeDasharray="3 3" strokeWidth="1.5" />
      <text x={cx} y={cy - r * 0.35} textAnchor="middle" fontSize={size * 0.13} fontWeight="800" fill="var(--primary-dark)">
        {valueLabel ?? `${value.toFixed(1)}%`}
      </text>
      <text x={cx} y={h + 18} textAnchor="middle" fontSize={size * 0.055} fill="var(--text-3)">
        {label ?? `target ${target} · max ${max}`}
      </text>
    </svg>
  );
}
