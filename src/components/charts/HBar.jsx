// 수평 막대 리스트 - 팀별/본부별 지표 비교에 사용
export default function HBar({ data, valueKey, labelKey, color = "#0046FF", highlightAbove, unit = "", max, formatValue }) {
  const maxVal = max ?? Math.max(1, ...data.map((d) => d[valueKey]));
  return (
    <div>
      {data.map((d) => {
        const v = d[valueKey];
        const pct = Math.max(2, (v / maxVal) * 100);
        const hi = highlightAbove != null && v > highlightAbove;
        const display = formatValue
          ? formatValue(d)
          : `${typeof v === "number" ? (Number.isInteger(v) ? v : v.toFixed(1)) : v}${unit}`;
        return (
          <div key={d[labelKey]} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 76, fontSize: 11, color: "var(--text-2)", flex: "0 0 auto", textAlign: "right" }}>{d[labelKey]}</div>
            <div style={{ flex: 1, background: "var(--section)", borderRadius: 4, height: 14, position: "relative" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: hi ? "#FF9500" : color }} />
            </div>
            <div style={{ width: 52, fontSize: 10.5, fontWeight: 700, color: hi ? "#B36A00" : "var(--text-2)" }}>
              {display}
            </div>
          </div>
        );
      })}
    </div>
  );
}
