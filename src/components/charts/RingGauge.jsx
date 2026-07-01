// 원형 링 게이지 (CEO 뷰 4대 지표)
export default function RingGauge({ percent, color = "#0046FF", centerLabel, subLabel, size = 140 }) {
  const r = size * 0.32;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, percent));
  const dash = `${(clamped / 100) * c} ${c}`;
  const cx = size / 2;
  const cy = size / 2 - 4;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--section)" strokeWidth={size * 0.085} />
      <circle
        cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={size * 0.085}
        strokeDasharray={dash} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text x={cx} y={cy + size * 0.045} textAnchor="middle" fontSize={size * 0.1} fontWeight="800" fill="var(--primary-dark)">
        {centerLabel}
      </text>
      <text x={cx} y={size - 6} textAnchor="middle" fontSize={size * 0.075} fill="var(--text-2)">
        {subLabel}
      </text>
    </svg>
  );
}
