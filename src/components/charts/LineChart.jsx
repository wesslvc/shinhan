// 라인 차트 - 절감액/리드타임 월별 추이 (2계열)
export default function LineChart({ labels, seriesA, seriesB, colorA = "#0046FF", colorB = "#00A651", nameA, nameB }) {
  const w = 480, h = 160, pad = 24;
  const all = [...seriesA, ...seriesB];
  const min = Math.min(...all) * 0.9;
  const max = Math.max(...all) * 1.1;
  const x = (i) => pad + (i / (labels.length - 1)) * (w - pad * 2);
  const y = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const line = (series) => series.map((v, i) => `${x(i)},${y(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      {labels.map((l, i) => (
        <text key={l} x={x(i)} y={h - 6} fontSize="9" fill="var(--text-3)" textAnchor="middle">{l}</text>
      ))}
      <polyline points={line(seriesA)} fill="none" stroke={colorA} strokeWidth="2.5" />
      <polyline points={line(seriesB)} fill="none" stroke={colorB} strokeWidth="2.5" strokeDasharray="4 3" />
      {seriesA.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill={colorA} />)}
      {seriesB.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="2.5" fill={colorB} />)}
      <text x={w - pad} y={14} fontSize="9.5" fill={colorA} textAnchor="end">{nameA}</text>
      <text x={w - pad} y={28} fontSize="9.5" fill={colorB} textAnchor="end">{nameB}</text>
    </svg>
  );
}
