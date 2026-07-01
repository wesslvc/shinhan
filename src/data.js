// Mock data layer for the 구매계약 대시보드 (V3.05 요건분석 기반 시각 데모)
// 240건 계약 mock — 저장/채번/ERP 연계는 동작하지 않는 시안(미구현) 데이터입니다.

export const HEADQUARTERS = ["AI플랫폼본부", "클라우드사업본부", "SI사업본부", "SM사업본부", "데이터사업본부", "디지털사업본부"];
export const TEAMS = ["AI운영팀", "클라우드팀", "SI 1팀", "SI 2팀", "SM팀", "데이터팀"];
export const STAFF = ["김민수", "이서연", "박지훈", "최유진", "정하은", "강도윤", "윤서준", "장예린", "임채원", "한지호"];
export const STATUS_OPTS = ["사전검토", "법무검토", "협상중", "결재대기", "결재완료", "계약대기", "체결완료", "보류", "반려"];
export const STAGE_LABELS = { stage1: "제안품의", stage2: "수행품의", stage3: "구매품의" };
export const DELAY_REASONS = ["검토 지연", "자료 보완", "결재선 변경", "기타"];

export const BASE_DATE = new Date("2026-05-19");
export const TARGET_SAVED_W = 10.9; // 억원 목표
export const TARGET_NEG_RATE = 20; // %

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}
const rnd = seededRandom(20260519);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const int = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};
const fmt = (d) => d.toISOString().slice(0, 10);

function genContract(i) {
  const no = i + 1;
  const hq = pick(HEADQUARTERS);
  const performDept = pick(TEAMS);
  const kind = rnd() > 0.4 ? "매출" : "매입";
  const type = rnd() > 0.5 ? "SI" : "ASP";
  const receiveDate = addDays(BASE_DATE, -int(0, 55));
  const conflict = rnd() < 0.12 ? "이해상충" : "정상";
  const conflictPartner = conflict === "이해상충" ? pick(["A파트너스", "B시스템", "C테크", "D솔루션"]) : null;
  const conflictGrade = conflict === "이해상충" ? pick(["상", "중", "하"]) : null;
  const negotiated = rnd() < 0.24;
  const statusRoll = rnd();
  const status = statusRoll < 0.14 ? "반려" : statusRoll < 0.5 ? "체결완료" : "진행중";

  const stage1Delay = rnd() < 0.22;
  const stage2Delay = rnd() < 0.2;
  const stage3Delay = rnd() < 0.26;
  const stage3DelayDays = stage3Delay ? int(1, 14) : 0;

  const proposalDate = fmt(addDays(receiveDate, int(1, 3)));
  const vrb1 = rnd() > 0.3 ? fmt(addDays(receiveDate, -10 + int(-2, 2))) : null;
  const vrb2 = rnd() > 0.3 ? fmt(addDays(receiveDate, -3 + int(-1, 1))) : null;

  const contractStart = addDays(receiveDate, int(10, 40));
  const quoteActual = rnd() > 0.3 ? fmt(addDays(contractStart, -7)) : null;
  const issueDate2 = rnd() > 0.4 ? fmt(addDays(contractStart, -6)) : null;

  const purchaseStart = addDays(contractStart, int(3, 20));
  const completePlan = addDays(purchaseStart, int(5, 25));
  const issue3 = rnd() > 0.4 ? fmt(addDays(purchaseStart, -1)) : null;
  const purchaseApproval = rnd() > 0.35 ? fmt(addDays(purchaseStart, -1)) : null;

  const planProfit = int(3000, 40000) * 1000;
  const performProfit = planProfit + int(-3000, 6000) * 1000;
  const saved = Math.max(0, performProfit - planProfit) + int(0, 2000) * 1000;
  const outsourceSaving = kind === "매입" ? int(0, 1500) * 1000 : 0;

  const stage3Status = ["체결완료", "진행중"].includes(status) ? pick(STATUS_OPTS) : "반려";

  return {
    id: `CT-2026-${String(no).padStart(4, "0")}`,
    no,
    hq,
    performDept,
    kind,
    type,
    projectName: `${hq.replace("본부", "")} ${type} ${no}차 프로젝트`,
    requester: pick(STAFF),
    ownerPM: pick(STAFF),
    status,
    conflict,
    conflictPartner,
    conflictGrade,
    negotiated,
    receiveDate: fmt(receiveDate),
    planProfit,
    performProfit,
    saved,
    outsourceSaving,
    delayReason: stage3Delay ? pick(DELAY_REASONS) : null,
    stage1: {
      proposalDate,
      vrb1,
      vrb2,
      submitDate: proposalDate,
      delay: stage1Delay,
    },
    stage2: {
      quoteActual,
      issueDate: issueDate2,
      contractStartDate: fmt(contractStart),
      approvalDate: rnd() > 0.3 ? fmt(addDays(contractStart, -5)) : null,
      progress: stage3Status,
      delay: stage2Delay,
    },
    stage3: {
      issue3Actual: issue3,
      purchaseApprovalDate: purchaseApproval,
      completePlanDate: fmt(completePlan),
      purchaseStartDate: fmt(purchaseStart),
      progress: stage3Status,
      delay: stage3Delay,
      delayDays: stage3DelayDays,
      electronic: rnd() > 0.35,
      sent: rnd() > 0.4,
      received: rnd() > 0.5,
      insurance: rnd() > 0.6,
    },
  };
}

export const CONTRACTS = Array.from({ length: 240 }, (_, i) => genContract(i));

function stageOf(c) {
  if (c.status === "반려") return null;
  if (c.stage3.progress === "체결완료") return 3;
  if (c.stage2.contractStartDate && new Date(c.stage2.contractStartDate) <= new Date()) return 3;
  if (c.stage2.approvalDate) return 2;
  return 1;
}

export function stageStats(contracts) {
  const stats = { stage1: { delay: 0, progress: 0, done: 0, total: 0 }, stage2: { delay: 0, progress: 0, done: 0, total: 0 }, stage3: { delay: 0, progress: 0, done: 0, total: 0 } };
  contracts.forEach((c) => {
    const st = stageOf(c) || 1;
    for (let s = 1; s <= st; s++) {
      const key = `stage${s}`;
      stats[key].total++;
      const delayed = c[key].delay;
      const done = s < st || c.status === "체결완료";
      if (c.status !== "체결완료" && delayed && s === st) stats[key].delay++;
      else if (done) stats[key].done++;
      else stats[key].progress++;
    }
  });
  return stats;
}

export function aggregate(today = BASE_DATE) {
  const total = CONTRACTS.length;
  const negCnt = CONTRACTS.filter((c) => c.negotiated).length;
  const negRate = (negCnt / total) * 100;
  const conflictCnt = CONTRACTS.filter((c) => c.conflict === "이해상충").length;
  const conflictIng = CONTRACTS.filter((c) => c.conflict === "이해상충" && !["체결완료", "반려"].includes(c.status)).length;
  const totalSavedW = CONTRACTS.reduce((sum, c) => sum + c.saved, 0) / 100000000;
  const achievementRate = Math.min(120, (totalSavedW / TARGET_SAVED_W) * 100);
  const completed = CONTRACTS.filter((c) => c.status === "체결완료").length;
  const delayIng = CONTRACTS.filter((c) => (c.stage1.delay || c.stage2.delay || c.stage3.delay) && !["체결완료", "반려"].includes(c.status)).length;
  const leadTimes = CONTRACTS.map((c) => {
    const d = new Date(today) - new Date(c.receiveDate);
    return Math.max(1, Math.round(d / 86400000) + 1);
  });
  const avgLead = Math.round(leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length);
  const stage3DelayDays = CONTRACTS.filter((c) => c.stage3.delay).reduce((a, c) => a + c.delayDays, 0) / Math.max(1, CONTRACTS.filter((c) => c.stage3.delay).length);
  const outsourceSum = CONTRACTS.reduce((s, c) => s + c.outsourceSaving, 0);
  const outsourceCnt = CONTRACTS.filter((c) => c.outsourceSaving > 0).length;

  return {
    total, negCnt, negRate, conflictCnt, conflictIng, totalSavedW, achievementRate,
    completed, delayIng, avgLead, stage3DelayDays: Math.round(stage3DelayDays || 0),
    outsourceSum, outsourceCnt,
  };
}

export function aggByHQ() {
  return HEADQUARTERS.map((hq) => {
    const list = CONTRACTS.filter((c) => c.hq === hq);
    const total = list.length || 1;
    const negCnt = list.filter((c) => c.negotiated).length;
    const negRate = (negCnt / total) * 100;
    const delay7 = {
      stage1: list.filter((c) => c.stage1.delay).length,
      stage2: list.filter((c) => c.stage2.delay).length,
      stage3: list.filter((c) => c.stage3.delay).length,
    };
    return { hq, total: list.length, negRate, negCnt, delay7 };
  });
}

export function aggByTeam() {
  return TEAMS.map((team) => {
    const list = CONTRACTS.filter((c) => c.performDept === team);
    const conflictCnt = list.filter((c) => c.conflict === "이해상충").length;
    const conflictRate = list.length ? (conflictCnt / list.length) * 100 : 0;
    const delayIngCnt = list.filter((c) => (c.stage1.delay || c.stage2.delay || c.stage3.delay) && !["체결완료", "반려"].includes(c.status)).length;
    return { team, conflictRate, conflictCnt, delayIngCnt };
  });
}

export function sensitivityData() {
  const conf = CONTRACTS.filter((c) => c.conflict === "이해상충");
  const grades = ["상", "중", "하"];
  return grades.map((g) => ({ grade: g, count: conf.filter((c) => c.conflictGrade === g).length }));
}

export function top5Delayed(stageFilter = { stage1: true, stage2: true, stage3: true }) {
  const rows = [];
  CONTRACTS.forEach((c) => {
    [1, 2, 3].forEach((s) => {
      const key = `stage${s}`;
      if (!stageFilter[key]) return;
      if (c[key].delay) {
        rows.push({
          id: c.id,
          projectName: c.projectName,
          performDept: c.performDept,
          hq: c.hq,
          stage: STAGE_LABELS[key],
          reason: c.delayReason || pick(DELAY_REASONS),
          days: s === 3 ? c.stage3.delayDays || int(3, 15) : int(3, 15),
        });
      }
    });
  });
  return rows.sort((a, b) => b.days - a.days).slice(0, 5);
}

export const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월"];
export const MONTHLY_SAVED = [0.6, 1.1, 1.9, 3.0, 4.2, 5.6]; // 억원 누적
export const MONTHLY_LEAD = [24, 23, 21, 20, 19, 18.4]; // 일

export function hqContribution() {
  return HEADQUARTERS.map((hq) => {
    const list = CONTRACTS.filter((c) => c.hq === hq);
    const savedSum = Math.round(list.reduce((s, c) => s + c.saved, 0) / 1000000);
    return { hq, savedM: savedSum };
  });
}

export function ceoRows() {
  return CONTRACTS.slice(0, 12).map((c) => ({
    ...c,
    completePlanDate: c.stage3.completePlanDate,
  }));
}

export function maskName(name, masked) {
  if (!masked) return name;
  return "●".repeat(name.length);
}

export function maskAmount(value, masked, suffix = "M") {
  if (!masked) return `${value}${suffix}`;
  return `●●●${suffix}`;
}
