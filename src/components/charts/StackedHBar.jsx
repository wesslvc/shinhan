// 누적 가로막대 - 본부별 중요 지연(3색: 제출일0 / 계약시작일-7 / 계약시작일-1)
const COLORS = ["#002D85", "#2E6CB8", "#5B8FD4"];
export default function StackedHBar({ data, keys, labelKey, legend }) {
  const totals = data.map((d) => keys.reduce((s, k) => s + d[k], 0));
  const maxVal = Math.max(1, ...totals);
  return (
    <div>
      {data.map((d, i) => (
        <div key={d[labelKey]} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 84, fontSize: 11, color: "var(--text-2)", flex: "0 0 auto", textAlign: "right" }}>{d[labelKey]}</div>
          <div style={{ flex: 1, display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: "var(--section)" }}>
            {keys.map((k, ki) => {
              const w = (d[k] / maxVal) * 100;
              return w > 0 ? <div key={k} style={{ width: `${w}%`, background: COLORS[ki % COLORS.length] }} title={`${k}: ${d[k]}`} /> : null;
            })}
          </div>
          <div style={{ width: 30, fontSize: 10.5, fontWeight: 700, color: "var(--text-2)" }}>{totals[i]}</div>
        </div>
      ))}
      {legend && (
        <div style={{ display: "flex", gap: 14, marginTop: 6, fontSize: 9.5, color: "var(--text-3)" }}>
          {legend.map((l, i) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: COLORS[i % COLORS.length], display: "inline-block" }} />
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
