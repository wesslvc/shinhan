import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { STAGE_DEFS } from "../stageDefs.js";

function fmt(d) {
  return d.toISOString().slice(0, 10);
}
function addDays(dateStr, days) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return fmt(d);
}
function diffDays(a, b) {
  return Math.round((new Date(a) - new Date(b)) / 86400000);
}
function nextContractId(drafts) {
  const n = 240 + drafts.length + 1;
  return `CT-2026-${String(n).padStart(4, "0")}`;
}

const STEP_KEYS = ["stage1", "stage2", "stage3"];

function defaultsFor(def, today) {
  const base = {
    [def.baseline.key]: fmt(today),
    __receiveDate: def.key === "stage1" ? fmt(today) : addDays(fmt(today), def.key === "stage2" ? -12 : -20),
  };
  def.fields.forEach((f) => {
    if (f.type === "ox") base[f.key] = "O";
    else if (f.type === "combo") base[f.key] = f.options[0];
    else if (f.type === "date") base[f.key] = addDays(fmt(today), -3);
    else base[f.key] = "";
  });
  (def.purchaseOnlyFields || []).forEach((f) => {
    if (f.type === "combo") base[f.key] = f.options[0];
    else base[f.key] = "";
  });
  (def.manualClosureFields || []).forEach((f) => { base[f.key] = "O"; });
  (def.extraFields || []).forEach((f) => { base[f.key] = ""; });
  return base;
}

export default function StageRegister({ stage }) {
  const { today, view } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const def = STAGE_DEFS[stage];
  const stageIdx = STEP_KEYS.indexOf(stage);

  const [drafts, setDrafts] = useState([]);
  const [contractId, setContractId] = useState(params.get("id") || "");
  const [form, setForm] = useState(() => defaultsFor(def, today));
  const [hitlChecked, setHitlChecked] = useState(false);
  const [toast, setToast] = useState("");
  const [repeaterItems, setRepeaterItems] = useState([{ partner: "", periodStart: "", periodEnd: "", amount: "", priceSaving: "" }]);

  useEffect(() => {
    setForm(defaultsFor(def, today));
    setHitlChecked(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    const id = params.get("id");
    if (id) setContractId(id);
    else if (stage === "stage1") setContractId(nextContractId(drafts));
  }, [params, stage, drafts]);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const baselineDate = form[def.baseline.key];
  const outputs = useMemo(() => {
    return def.outputs.map((o) => {
      const date = addDays(baselineDate, o.days);
      const delta = date ? diffDays(date, fmt(today)) : null;
      return { ...o, date, delta };
    });
  }, [def, baselineDate, today]);

  const leadTime = useMemo(() => {
    return Math.max(1, diffDays(fmt(today), form.__receiveDate || fmt(today)) + 1);
  }, [today, form.__receiveDate]);

  const requiredMissing = useMemo(() => {
    const missing = [];
    if (!baselineDate) missing.push(def.baseline.label);
    def.fields.filter((f) => f.required).forEach((f) => {
      if (!form[f.key]) missing.push(f.label);
    });
    return missing;
  }, [def, form, baselineDate]);

  const canSubmit = requiredMissing.length === 0 && hitlChecked;

  const closureVerdict = stage === "stage3"
    ? (form.electronic === "O" || (form.sent === "O" && form.received === "O"))
    : null;

  function handleSubmit() {
    if (!canSubmit) return;
    const draft = { id: contractId, stage, form, repeaterItems, ts: fmt(today) };
    setDrafts((d) => [...d.filter((x) => x.id !== contractId), draft]);
    setToast(`${contractId} · ${def.title} 등록 완료 (세션 임시저장 · 실제 저장/채번은 미구현)`);
    setTimeout(() => setToast(""), 3200);
  }

  function goStage(n) {
    navigate(`/stage/${n}?id=${contractId}`);
  }

  const progressPct = baselineDate ? Math.max(4, Math.min(100, 100 - Math.max(0, diffDays(baselineDate, fmt(today))) * 4)) : 10;
  const isDelayed = baselineDate && diffDays(baselineDate, fmt(today)) < 0;

  return (
    <div>
      <div className="breadcrumb">메인 &gt; 단계별 등록 &gt; {def.title}</div>
      <div className="page-head">
        <div>
          <h1>{def.title} 등록</h1>
          <p>계약번호 <code>{contractId}</code> · 입력 주체: {def.persona} · {def.erpNote}</p>
        </div>
      </div>

      <div className="step-indicator">
        {STEP_KEYS.map((k, i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "0 0 auto" }}>
            <div className={`step ${i === stageIdx ? "active" : i < stageIdx ? "done" : ""}`}>
              <span className="num">{i + 1}</span>
              <span className="lbl">{STAGE_DEFS[k].title}{i > stageIdx ? " (대기)" : ""}</span>
            </div>
            {i < 2 && <div className="line" />}
          </div>
        ))}
      </div>

      {view.readOnly && (
        <div className="callout warn">경영진(ceo) 뷰는 읽기전용입니다. 등록 화면은 사업부·구매계약팀 role에서 사용하세요.</div>
      )}

      <div className="grid grid-12-7-5">
        <div className="form-card">
          <div className="form-head">
            <h3>입력값</h3>
            <span className="persona-badge">{def.persona}</span>
          </div>

          <div className="field full" style={{ marginBottom: 12, background: "var(--section)" }}>
            <label>계약번호 (자동) <span className="req">*</span></label>
            <div className="value-preview">{contractId} — 자동 채번 (방식 미확정, O-12) · 접수일 = 리드타임 기준</div>
          </div>

          <div className="field-grid">
            {def.fields.map((f) => (
              <FieldInput key={f.key} f={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
            ))}
          </div>

          <div className="field full highlight" style={{ marginTop: 12 }}>
            <label>{def.baseline.label} {def.baseline.required && <span className="req">*</span>}</label>
            <input type="date" value={baselineDate || ""} onChange={(e) => set(def.baseline.key, e.target.value)} />
            {def.baseline.note && <div className="kpi-foot" style={{ marginTop: 4 }}>{def.baseline.note}</div>}
          </div>

          {def.purchaseOnlyFields && (
            <div className="stage-block">
              <h4>구매계약팀 전용 필드 (권한: 구매계약팀)</h4>
              <div className="field-grid">
                {def.purchaseOnlyFields.map((f) => (
                  <FieldInput
                    key={f.key} f={f}
                    value={f.key === "costSaving" ? computeCostSaving(form) : form[f.key]}
                    onChange={(v) => set(f.key, v)}
                  />
                ))}
              </div>
              {form.conflict === "이해상충" && (
                <div className="callout warn" style={{ marginTop: 10 }}>
                  이해상충 선택 → 별도 검토 워크플로우 자동 발화 (담당 구매계약팀장 · 기한 D+3, m3 모달)
                </div>
              )}
              {form.negotiated === "수의계약" && (
                <div className="callout" style={{ marginTop: 10 }}>수의계약 비율 KPI 원천 · 목표 20% 모니터링 대상에 포함됩니다.</div>
              )}
            </div>
          )}

          {def.manualClosureFields && (
            <div className="stage-block">
              <h4>수동 종결 항목 (전자계약 제외, 3단계 전용)</h4>
              <p className="kpi-foot" style={{ marginBottom: 10 }}>전자계약 외 공급처는 수기 발송 — 전자계약=X 선택 시 아래 항목이 체결 판정에 반영됩니다.</p>
              <div className="field-grid">
                {def.manualClosureFields.map((f) => (
                  <FieldInput key={f.key} f={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
                ))}
              </div>
              <div className="callout" style={{ marginTop: 10, background: closureVerdict ? "#E7F7EE" : "#FFF3E0", color: "#43484F" }}>
                체결 완료 판정(산출): 전자계약=O OR (발송=O AND 회신=O) → <b style={{ color: "#24272D" }}>{closureVerdict ? "체결 완료" : "미완료"}</b>
              </div>
            </div>
          )}

          {def.repeater && (
            <div className="stage-block">
              <h4>{def.repeater.label} <span className="kpi-foot">(추정·미구현 권고, FR-16)</span></h4>
              {repeaterItems.map((item, idx) => (
                <div key={idx} className="repeater-item">
                  {repeaterItems.length > 1 && (
                    <button className="repeater-remove" onClick={() => setRepeaterItems((r) => r.filter((_, i) => i !== idx))}>삭제</button>
                  )}
                  <div className="field-grid">
                    {def.repeater.itemFields.map((f) => (
                      <FieldInput
                        key={f.key} f={f} value={item[f.key]}
                        onChange={(v) => setRepeaterItems((r) => r.map((it, i) => (i === idx ? { ...it, [f.key]: v } : it)))}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <button className="add-btn" onClick={() => setRepeaterItems((r) => [...r, { partner: "", periodStart: "", periodEnd: "", amount: "", priceSaving: "" }])}>
                + 매입처 추가
              </button>
            </div>
          )}

          {def.extraFields && (
            <details style={{ marginTop: 14 }}>
              <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: "var(--primary)" }}>
                확장 항목 (LawData 근거 · 추정·미구현 권고 {def.extraFields.length}종) 펼치기
              </summary>
              <div className="field-grid" style={{ marginTop: 10 }}>
                {def.extraFields.map((f) => (
                  <FieldInput key={f.key} f={f} value={form[f.key]} onChange={(v) => set(f.key, v)} />
                ))}
              </div>
            </details>
          )}

          <div className="hitl-box">
            <h4>HITL · Human in the Loop 검증 <span className={`hitl-badge${hitlChecked ? " ok" : ""}`}>{hitlChecked ? "확인 완료" : "검증 대기"}</span></h4>
            <p style={{ margin: "0 0 8px" }}>AI 산출값(리드타임·잔여·지연)을 담당자가 최종 확인한 후 등록합니다.</p>
            <label style={{ display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={hitlChecked} onChange={(e) => setHitlChecked(e.target.checked)} />
              산출값을 확인했습니다
            </label>
          </div>

          {requiredMissing.length > 0 && (
            <div className="callout warn" style={{ marginTop: 10 }}>필수 입력 누락: {requiredMissing.join(", ")}</div>
          )}

          <div className="page-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-primary" disabled={!canSubmit} onClick={handleSubmit} style={!canSubmit ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
              등록
            </button>
            {stage === "stage1" && <button className="btn" onClick={() => goStage(2)}>2단계로 이동 →</button>}
            {stage === "stage2" && <button className="btn" onClick={() => goStage(3)}>3단계로 이동 →</button>}
            {stage !== "stage1" && <button className="btn" onClick={() => goStage(stageIdx)}>이전 단계 ←</button>}
          </div>
        </div>

        <div>
          <div className="output-card">
            <div className="section-title">자동 산출값 (출력)</div>
            <div className="kpi-foot" style={{ marginBottom: 10 }}>단계별 today 파라미터 · 실시간 · 계산값 비저장(DR-02)</div>
            {outputs.map((o) => (
              <div className="output-row" key={o.label}>
                <div className="k">{o.label}: {o.date || "-"}</div>
                <div className="v">{o.note}</div>
              </div>
            ))}
            <div className="output-row">
              <div className="k">리드타임: {leadTime}일</div>
              <div className="v">= (Today+1) - 접수일</div>
            </div>
          </div>

          <div className="output-card progress-preview">
            <div className="section-title">단계별 진척 미리보기</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${progressPct}%`, background: "var(--primary)" }} />
              <span className="bar-label">{progressPct}%</span>
            </div>
            {isDelayed && (
              <div className="bar-track">
                <div className="bar-fill" style={{ width: "60%", background: "var(--danger)" }} />
                <span className="bar-label">지연 +{Math.abs(diffDays(baselineDate, fmt(today)))}일</span>
              </div>
            )}
            <div className="kpi-foot">표기 규칙: 잔여(-N) / 지연(+N) · 프로그레스바 + 아이콘 + 텍스트 3중 채널 (색상 단독 금지, NFR-08)</div>
          </div>

          {toast && <div className="toast">{toast}</div>}
        </div>
      </div>
    </div>
  );
}

function computeCostSaving(form) {
  return "산식 미확정 (O-10)";
}

function FieldInput({ f, value, onChange }) {
  if (f.type === "ox") {
    return (
      <div className="field">
        <label>{f.label} {f.required && <span className="req">*</span>}</label>
        <div className="oxbool">
          <button className={value === "O" ? "active" : ""} onClick={() => onChange("O")}>O</button>
          <button className={value === "X" ? "active x-active" : ""} onClick={() => onChange("X")}>X</button>
        </div>
      </div>
    );
  }
  if (f.type === "combo") {
    return (
      <div className="field">
        <label>{f.label} {f.required && <span className="req">*</span>}</label>
        <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (f.type === "readonly-number") {
    return (
      <div className="field">
        <label>{f.label}</label>
        <div className="value-preview">{value}</div>
        {f.note && <div className="kpi-foot" style={{ marginTop: 4 }}>{f.note}</div>}
      </div>
    );
  }
  if (f.type === "number") {
    return (
      <div className="field">
        <label>{f.label}</label>
        <input type="number" value={value || ""} onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }
  if (f.type === "date") {
    return (
      <div className="field">
        <label>{f.label} {f.required && <span className="req">*</span>}</label>
        <input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} />
        {f.note && <div className="kpi-foot" style={{ marginTop: 4 }}>{f.note}</div>}
      </div>
    );
  }
  return (
    <div className="field">
      <label>{f.label}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
