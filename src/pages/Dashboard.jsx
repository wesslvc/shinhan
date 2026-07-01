import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import {
  CONTRACTS, TARGET_NEG_RATE, STAGE_LABELS,
  aggregate, aggByHQ, aggByTeam, sensitivityData, top5Delayed,
} from "../data.js";
import ProcessMap from "../components/ProcessMap.jsx";
import RiskZone from "../components/RiskZone.jsx";
import KpiCard from "../components/KpiCard.jsx";
import SemiGauge from "../components/charts/SemiGauge.jsx";
import HBar from "../components/charts/HBar.jsx";
import StackedHBar from "../components/charts/StackedHBar.jsx";
import Donut from "../components/charts/Donut.jsx";

export default function Dashboard() {
  const { view, today } = useApp();
  const navigate = useNavigate();
  const agg = useMemo(() => aggregate(today), [today]);
  const hqAgg = useMemo(() => aggByHQ(), [today]);
  const teamAgg = useMemo(() => aggByTeam(), [today]);
  const sens = useMemo(() => sensitivityData(), []);
  const [stageFilter, setStageFilter] = useState({ stage1: true, stage2: true, stage3: true });
  const top5 = useMemo(() => top5Delayed(stageFilter), [stageFilter]);

  const label = view.isBiz ? "본부(사업 본부) 뷰" : "구매계약팀 뷰";

  return (
    <div>
      <div className="breadcrumb">메인 &gt; 대시보드 &gt; {label}</div>
      <div className="page-head">
        <div>
          <h1>{view.isBiz ? "본부 대시보드" : "구매계약팀 대시보드"}</h1>
          <p>제안품의 → 수행품의 → 구매품의 3단계 진척 · 내부 통제 상태를 한 화면에서 확인</p>
        </div>
        <div className="page-actions">
          <button className="btn">필터</button>
          <button className="btn">리포트 내려받기</button>
          <button className="btn btn-primary" onClick={() => navigate("/stage/1")}>신규 등록</button>
        </div>
      </div>

      <div className="user-banner">
        <span>{label} · {view.scope}</span>
        {view.isBiz && <span className="chip-warn">절감액·수의비율 비노출</span>}
      </div>

      {/* KPI Row */}
      <div className={`grid ${view.isBiz ? "grid-2" : "grid-4"}`} style={{ marginBottom: 14 }}>
        {view.showSavings && (
          <KpiCard
            primary
            label="연간 누적 절감액"
            value={`${agg.totalSavedW.toFixed(1)}억`}
            foot={`목표 대비 ${agg.achievementRate.toFixed(0)}% 달성`}
          />
        )}
        <KpiCard label="평균 리드타임 D-7" value="-" foot="LLM 적용 후 정밀 산출 예정" />
        {view.showNegRate && (
          <KpiCard
            label="수의계약 비율"
            value={`${agg.negRate.toFixed(1)}%`}
            foot="목표 20% 대비"
            valueClass="warning"
          />
        )}
        <KpiCard
          label="이해상충 (현재 진행)"
          value={`${agg.conflictIng}건`}
          foot={`진행 중 계약 기준 · 누적 ${agg.conflictCnt}건`}
          valueClass="danger"
        />
      </div>

      <ProcessMap contracts={CONTRACTS} />
      <RiskZone negRate={agg.negRate} conflictIng={agg.conflictIng} delayIng={agg.delayIng} />

      {view.isBiz ? (
        <div className="grid grid-3">
          <div className="card">
            <div className="section-title">수의계약 비율</div>
            <SemiGauge value={agg.negRate} target={TARGET_NEG_RATE} max={50} />
          </div>
          <div className="card">
            <div className="section-title">팀별 누적 이해상충 비율</div>
            <HBar data={teamAgg} labelKey="team" valueKey="conflictRate" unit="%" highlightAbove={15} />
          </div>
          <div className="card">
            <div className="section-title">팀별 진행중 지연 건수</div>
            <HBar data={teamAgg} labelKey="team" valueKey="delayIngCnt" color="#E53935" unit="건" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-12-7-5" style={{ marginBottom: 14 }}>
            <div className="card">
              <div className="section-title">본부별 중요 지연 — 7일 이상 (누적)</div>
              <StackedHBar
                data={hqAgg.map((h) => ({ hq: h.hq, ...h.delay7 }))}
                keys={["stage1", "stage2", "stage3"]}
                labelKey="hq"
                legend={["제출일0", "계약시작일-7", "계약시작일-1"]}
              />
            </div>
            <div className="card">
              <div className="section-title">본부별 수의계약 비율</div>
              <div style={{ display: "flex", height: 18, borderRadius: 4, overflow: "hidden", background: "var(--section)", marginBottom: 14 }}>
                <div style={{ width: `${agg.negRate}%`, background: "var(--primary)" }} />
              </div>
              <HBar data={hqAgg} labelKey="hq" valueKey="negRate" unit="%" highlightAbove={TARGET_NEG_RATE} />
            </div>
          </div>

          <div className="grid grid-12-5-7" style={{ marginBottom: 14 }}>
            <div className="card">
              <div className="section-title">이해상충 협력사 민감도</div>
              <Donut data={sens} labelKey="grade" valueKey="count" />
            </div>
            <div className="card">
              <div className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>프로젝트별 지연일수 — Top 5</span>
                <span style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 600, color: "var(--text-2)" }}>
                  {["stage1", "stage2", "stage3"].map((k) => (
                    <label key={k} style={{ display: "flex", gap: 4, alignItems: "center", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={stageFilter[k]}
                        onChange={(e) => setStageFilter((f) => ({ ...f, [k]: e.target.checked }))}
                      />
                      {STAGE_LABELS[k]}
                    </label>
                  ))}
                </span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>순위</th><th>계약번호</th><th>계약명</th><th>수행부서</th><th>현재단계</th><th>지연사유</th><th>총소요일</th></tr>
                  </thead>
                  <tbody>
                    {top5.map((r, i) => (
                      <tr key={`${r.id}-${r.stage}`}>
                        <td>{i + 1}</td><td>{r.id}</td><td>{r.projectName}</td><td>{r.performDept}</td>
                        <td>{r.stage}</td><td>{r.reason}</td><td>+{r.days}일</td>
                      </tr>
                    ))}
                    {top5.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--text-3)" }}>선택된 단계에 지연 건이 없습니다</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="card">
              <div className="section-title">절감액 달성 현황</div>
              <div className="progress-preview">
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.min(100, agg.achievementRate)}%`, background: "var(--primary)" }} />
                  <span className="bar-label">{agg.achievementRate.toFixed(0)}%</span>
                </div>
              </div>
              <div className="kpi-foot">누적 {agg.totalSavedW.toFixed(1)}억 / 목표 10.9억</div>
            </div>
            <div className="card">
              <div className="section-title">외주 도입 절감액</div>
              <div className="kpi-value">{(agg.outsourceSum / 1000000).toFixed(0)}M</div>
              <div className="kpi-foot">{agg.outsourceCnt}건 등록</div>
            </div>
            <div className="card">
              <div className="section-title">이해상충 비율 (누적)</div>
              <div style={{ display: "flex", height: 18, borderRadius: 4, overflow: "hidden", background: "var(--section)" }}>
                <div style={{ width: `${(agg.conflictCnt / agg.total) * 100}%`, background: "var(--danger)" }} />
              </div>
              <div className="kpi-foot">정상 / 이해상충 — 누적 {agg.conflictCnt}건 ({((agg.conflictCnt / agg.total) * 100).toFixed(1)}%)</div>
            </div>
            <div className="card">
              <div className="section-title">수의계약 비율 (게이지)</div>
              <SemiGauge value={agg.negRate} target={TARGET_NEG_RATE} max={50} size={180} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
