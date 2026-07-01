// 도넛 차트 - 이해상충 협력사 민감도(상/중/하)
const COLORS = { 상: "#E53935", 중: "#FF9500", 하: "#00A651" };
export default function Donut({ data, labelKey, valueKey, size = 150 }) {
  const total = data.reduce((s, d) => s + d[valueKey], 0) || 1;
  const r = size * 0.32;
  const cx = size / 2;
  const cy = size / 2;
  let acc = 0;
  const arcs = data.map((d) => {
    const frac = d[valueKey] / total;
    const start = acc;
    acc += frac;
    const end = acc;
    const a1 = start * 2 * Math.PI - Math.PI / 2;
    const a2 = end * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const large = end - start > 0.5 ? 1 : 0;
    return { path: `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`, color: COLORS[d[labelKey]] || "#999", d };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--section)" strokeWidth={size * 0.16} />
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth={size * 0.16} />
        ))}
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size * 0.09} fontWeight="700" fill="var(--primary-dark)">
          총 {total}건
        </text>
      </svg>
      <div style={{ fontSize: 12, color: "var(--text-2)" }}>
        {data.map((d) => (
          <div key={d[labelKey]} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[d[labelKey]] || "#999", display: "inline-block" }} />
            {d[labelKey]}({d[labelKey] === "상" ? "高" : d[labelKey] === "중" ? "中" : "低"}) 등급 · {d[valueKey]}건
          </div>
        ))}
      </div>
    </div>
  );
}
