export default function RiskZone({ negRate, conflictIng, delayIng }) {
  return (
    <div className="risk-zone">
      <div className="section-title">통합 리스크 관리 존</div>
      <div className="grid grid-3">
        <div className="risk-item">
          <div className="lbl">수의계약 비율</div>
          <div className="val" style={{ color: "var(--warning)" }}>목표 20% · 현재 {negRate.toFixed(1)}%</div>
        </div>
        <div className="risk-item">
          <div className="lbl">이해상충 (현재 진행)</div>
          <div className="val" style={{ color: "var(--danger)" }}>{conflictIng}건</div>
        </div>
        <div className="risk-item">
          <div className="lbl">지연 발생 (현재 진행)</div>
          <div className="val" style={{ color: "var(--danger)" }}>{delayIng}건</div>
        </div>
      </div>
    </div>
  );
}
