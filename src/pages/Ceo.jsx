import { useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import {
  TARGET_NEG_RATE, MONTHS, MONTHLY_SAVED, MONTHLY_LEAD,
  aggregate, ceoRows, hqContribution, maskName, maskAmount,
} from "../data.js";
import RingGauge from "../components/charts/RingGauge.jsx";
import SemiGauge from "../components/charts/SemiGauge.jsx";
import LineChart from "../components/charts/LineChart.jsx";
import HBar from "../components/charts/HBar.jsx";

function diffDays(a, b) {
  return Math.round((new Date(a) - new Date(b)) / 86400000);
}

export default function Ceo() {
  const { today, masked } = useApp();
  const agg = useMemo(() => aggregate(today), [today]);
  const rows = useMemo(() => ceoRows(), []);
  const contribution = useMemo(() => hqContribution(), []);
  const leadRingPct = Math.min(100, (18 / Math.max(1, agg.avgLead)) * 100);
  const completedPct = (agg.completed / agg.total) * 100;
  const negOver = agg.negRate > TARGET_NEG_RATE;

  return (
    <div>
      <div className="breadcrumb">메인 &gt; CEO 요약 뷰</div>
      <div className="page-head">
        <div>
          <h1>CEO 요약 보고</h1>
          <p>초안(CEO) 시트 기반 간소 체계 · 접수번호·계약유형·1·2차 협상·잔여일·리드타임</p>
        </div>
        <div className="page-actions">
          <span className="chip-danger">현재 권한: CEO·본부장 · 데이터 직접 입력 불가</span>
          <button className="btn btn-primary" onClick={() => window.print()}>요약 PDF</button>
        </div>
      </div>

      <div className="risk-zone" style={{ marginBottom: 14 }}>
        <div className="section-title">임원 관심 사안 — 즉시 의사결정 필요</div>
        <div className="grid grid-2">
          <div className="risk-item" style={{ background: "#FDECEA", color: "#43484F" }}>
            <div className="lbl" style={{ color: "var(--danger)", fontWeight: 700 }}>이해상충 검토 (critical)</div>
            <div style={{ fontSize: 12.5 }}>{agg.conflictCnt}건 이해상충 식별, 별도 검토 필요</div>
          </div>
          <div className="risk-item" style={{ background: "#FFF3E0", color: "#43484F" }}>
            <div className="lbl" style={{ color: "#B36A00", fontWeight: 700 }}>수의계약 비율 ({negOver ? "warn" : "success"})</div>
            <div style={{ fontSize: 12.5 }}>목표 20% 대비 {negOver ? "+" : ""}{(agg.negRate - TARGET_NEG_RATE).toFixed(1)}%p {negOver ? "초과" : "이내 유지"}</div>
          </div>
          <div className="risk-item" style={{ background: "#FDECEA", color: "#43484F" }}>
            <div className="lbl" style={{ color: "var(--danger)", fontWeight: 700 }}>구매품의 지연 (critical)</div>
            <div style={{ fontSize: 12.5 }}>스텝3 평균 지연 +{agg.stage3DelayDays}일 - 매입품의 정체</div>
          </div>
          <div className="risk-item" style={{ background: "#EAF4FF", color: "#43484F" }}>
            <div className="lbl" style={{ color: "var(--info)", fontWeight: 700 }}>분기 리포트 (blue)</div>
            <div style={{ fontSize: 12.5 }}>6월 분기 리포트 정상 진행 중</div>
          </div>
        </div>
      </div>

      <div className="section-title">4대 지표 링게이지</div>
      <div className="grid grid-4" style={{ marginBottom: 14 }}>
        <div className="card">
          <RingGauge percent={agg.achievementRate} color="#0046FF" centerLabel={`${agg.achievementRate.toFixed(0)}%`} subLabel={`연간 누적 절감액 / ${agg.totalSavedW.toFixed(1)}억 · 목표 10.9억`} />
        </div>
        <div className="card">
          <RingGauge percent={leadRingPct} color="#00A651" centerLabel={`${agg.avgLead}일`} subLabel="평균 리드타임 / 목표 18일" />
        </div>
        <div className="card">
          <RingGauge percent={agg.negRate} color="#FF9500" centerLabel={`${agg.negRate.toFixed(1)}%`} subLabel="수의계약 비율 / 20% 이하" />
        </div>
        <div className="card">
          <RingGauge percent={completedPct} color="#0046FF" centerLabel={`${completedPct.toFixed(0)}%`} subLabel={`체결 완료율 / 전체 ${agg.total}건`} />
        </div>
      </div>

      <div className="grid grid-12-5-7" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="section-title">수의계약 비율 — 게이지</div>
          <SemiGauge value={agg.negRate} target={TARGET_NEG_RATE} max={50} size={260} />
        </div>
        <div className="card">
          <div className="section-title">절감액·리드타임 추이 (월별)</div>
          <LineChart labels={MONTHS} seriesA={MONTHLY_SAVED} seriesB={MONTHLY_LEAD} nameA="절감액 억" nameB="리드타임 일" />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="section-title">CEO 보고 테이블 (간소 체계, 12행)</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>순번</th><th>접수번호</th><th>접수일자</th><th>요청본부</th><th>요청자</th><th>담당자</th>
                <th>구분</th><th>종류</th><th>1차협상</th><th>2차협상</th><th>이슈검토</th><th>계약완료예정</th><th>잔여일</th><th>리드타임</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const remaining = diffDays(r.completePlanDate, today);
                const lead = Math.max(1, diffDays(today, r.receiveDate) + 1);
                const tone = remaining < 0 ? "var(--danger)" : remaining <= 5 ? "var(--warning)" : "var(--success)";
                const label = remaining < 0 ? `+${Math.abs(remaining)}(지연)` : remaining <= 5 ? `-${remaining}(임박)` : `-${remaining}`;
                return (
                  <tr key={r.id}>
                    <td>{r.no}</td><td>{r.id}</td><td>{r.receiveDate}</td><td>{r.hq}</td>
                    <td>{maskName(r.requester, masked)}</td><td>{maskName(r.ownerPM, masked)}</td>
                    <td>{r.kind}</td><td>{r.type}</td>
                    <td>{r.stage2.approvalDate ?? "-"}</td><td>{r.stage2.contractStartDate ?? "-"}</td>
                    <td>{r.stage3.issue3Actual ?? "-"}</td><td>{r.completePlanDate}</td>
                    <td><span className="status-dot" style={{ background: tone }} />{label}</td>
                    <td>{lead}일</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="legend" style={{ marginTop: 10 }}>
          <span><span className="dot" style={{ background: "var(--success)" }} />정상</span>
          <span><span className="dot" style={{ background: "var(--warning)" }} />D-5 임박</span>
          <span><span className="dot" style={{ background: "var(--danger)" }} />지연</span>
          <span style={{ color: "var(--text-3)" }}>요청자·담당자 마스킹 {masked ? "적용중" : "해제"}</span>
        </div>
      </div>

      <div className="card">
        <div className="section-title">본부별 절감 기여 (백만원)</div>
        <HBar
          data={contribution}
          labelKey="hq" valueKey="savedM"
          formatValue={(d) => maskAmount(d.savedM, masked)}
        />
        {masked && <div className="kpi-foot">마스킹 ON — 본부별 절감 기여 금액은 ●●●M으로 표시됩니다</div>}
      </div>
    </div>
  );
}
