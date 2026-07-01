import { useState } from "react";
import { stageStats, STAGE_LABELS } from "../data.js";

const PERIODS = ["최근 30일", "분기 누적", "연 누적", "사용자 지정"];

export default function ProcessMap({ contracts }) {
  const [period, setPeriod] = useState("최근 30일");
  const [custom, setCustom] = useState({ from: "2026-04-01", to: "2026-05-19" });
  const stats = stageStats(contracts);

  return (
    <div className="process-map">
      <div className="pm-head">
        <h3>계약 프로세스 맵 — 제안품의 → 수행품의 → 구매품의</h3>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {period === "사용자 지정" && (
            <div className="period-custom">
              <input type="date" value={custom.from} onChange={(e) => setCustom((c) => ({ ...c, from: e.target.value }))} />
              <span style={{ fontSize: 11, color: "var(--text-3)" }}>~</span>
              <input type="date" value={custom.to} onChange={(e) => setCustom((c) => ({ ...c, to: e.target.value }))} />
            </div>
          )}
          <div className="period-seg">
            {PERIODS.map((p) => (
              <button key={p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="pm-steps">
        {["stage1", "stage2", "stage3"].map((key, i) => (
          <div key={key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <div className="pm-step" style={{ flex: 1 }}>
              <h4>STEP{i + 1} {STAGE_LABELS[key]} · 총 {stats[key].total}건</h4>
              <div className="pm-mini">
                <span className="d">지연 {stats[key].delay}</span>
                <span className="p">진행 {stats[key].progress}</span>
                <span className="c">완료 {stats[key].done}</span>
              </div>
            </div>
            {i < 2 && <span className="pm-chev">›</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
