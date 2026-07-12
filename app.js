const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const scoreComponents = [
  { key: "multi", label: "다면역량진단", score: 38, max: 50, detail: "윤리·전문성·주도성·협업·책임" },
  { key: "career", label: "경력", score: 16, max: 20, detail: "직급 체류 및 유관 경력" },
  { key: "degree", label: "학위", score: 5, max: 10, detail: "석사" },
  { key: "certificate", label: "자격증", score: 9, max: 20, detail: "고급 2 · 초급 1" },
  { key: "contribution", label: "조직역량기여", score: 2, max: 8, detail: "사내 멘토링 1건" },
];

const radarData = [
  { label: "윤리", me: 84, team: 82 }, { label: "업무 전문성", me: 72, team: 78 },
  { label: "자발적 행동", me: 80, team: 75 }, { label: "변화 추진", me: 68, team: 73 },
  { label: "소통·협업", me: 88, team: 80 }, { label: "실행·책임", me: 76, team: 79 },
];

const certificates = [
  { name: "정보보안기사", grade: "고급", points: 4 },
  { name: "PMP", grade: "고급", points: 4 },
  { name: "정보처리기사", grade: "초급", points: 1 },
];

const education = [
  { name: "SW Test Manager", points: 5, completed: true },
  { name: "SP인증 SW교육", points: 5, completed: true },
  { name: "AWS DevOps", points: 2, completed: false },
];

let members = [
  { id: 1, name: "직원 A", department: "디지털혁신팀", job: "QA", grade: "S2", level: 6, score: 81, previous: 76, multi: 86, tech: 83, industry: 78, cert: 12, status: "우수", watch: false },
  { id: 2, name: "직원 B", department: "디지털혁신팀", job: "QA", grade: "S2", level: 5, score: 70, previous: 67, multi: 76, tech: 72, industry: 66, cert: 9, status: "적정", watch: false },
  { id: 3, name: "직원 C", department: "보안서비스팀", job: "보안컨설팅", grade: "S2", level: 5, score: 68, previous: 71, multi: 72, tech: 74, industry: 61, cert: 8, status: "관찰", watch: true },
  { id: 4, name: "직원 D", department: "디지털혁신팀", job: "TA", grade: "S1", level: 4, score: 62, previous: 58, multi: 69, tech: 60, industry: 57, cert: 6, status: "적정", watch: false },
  { id: 5, name: "직원 E", department: "데이터플랫폼팀", job: "Application Engineering", grade: "S1", level: 3, score: 56, previous: 61, multi: 64, tech: 51, industry: 53, cert: 4, status: "관찰", watch: true },
  { id: 6, name: "직원 F", department: "클라우드플랫폼팀", job: "클라우드 운영", grade: "L", level: 6, score: 84, previous: 79, multi: 88, tech: 87, industry: 77, cert: 14, status: "전문가", watch: false },
  { id: 7, name: "직원 G", department: "보안서비스팀", job: "모의해킹", grade: "M2", level: 3, score: 57, previous: 63, multi: 66, tech: 58, industry: 45, cert: 7, status: "미응시", watch: true },
  { id: 8, name: "직원 H", department: "데이터플랫폼팀", job: "DBA", grade: "S2", level: 5, score: 73, previous: 70, multi: 75, tech: 82, industry: 62, cert: 11, status: "적정", watch: false },
];

let jobs = [
  { id: "R0001", group: "개발", name: "Application Engineering", purpose: "비즈니스 요구를 안정적인 디지털 서비스로 구현하고 End-to-End 품질을 책임집니다.", people: 42, level: 7, skills: ["Java/Spring", "API 설계", "클라우드", "DevOps"], certs: ["정보처리기사", "AWS SAA", "PMP"], updated: "2026-05-28" },
  { id: "R0002", group: "인프라", name: "DBA", purpose: "DBMS의 안정적 운영과 성능 최적화를 통해 서비스 신뢰성과 가용성을 확보합니다.", people: 18, level: 7, skills: ["Oracle/MSSQL", "성능 튜닝", "백업·복구", "보안"], certs: ["OCP", "SQLP", "DAsP"], updated: "2026-06-11" },
  { id: "R0003", group: "보안", name: "보안컨설팅", purpose: "보안 위험을 진단하고 규제·인증 요구에 맞는 개선 체계를 설계합니다.", people: 26, level: 7, skills: ["ISMS-P", "위험평가", "컴플라이언스", "보고서"], certs: ["CISSP", "ISMS-P", "정보보안기사"], updated: "2026-04-19" },
  { id: "R0004", group: "품질", name: "QA", purpose: "품질 기준과 테스트 전략을 수립하고 제품 릴리스의 신뢰성을 보증합니다.", people: 31, level: 6, skills: ["테스트 설계", "자동화", "품질 지표", "요구공학"], certs: ["ISTQB", "CSTS", "PMP"], updated: "2026-06-02" },
];

let multiAnswers = [4, 3, 4, 2, 5, 4];
let learningState = new Set(["AWS DevOps"]);
let resultWeights = { multi: 40, tech: 35, industry: 25 };
let filteredMembers = [...members];

const pageMeta = {
  levels: ["PEOPLE ANALYTICS", "역량 Level 조회", "조직·직무·직급별 역량 분포와 개인의 변화를 한눈에 확인합니다."],
  jobs: ["JOB ARCHITECTURE", "직무 정의서", "직무 목적, 핵심 업무, 수준별 요구역량과 추천 자격을 관리합니다."],
  multi: ["MULTI-RATER REVIEW", "다면역량진단", "상사·동료·본인의 관점으로 행동역량을 진단하고 성장 피드백을 남깁니다."],
  tech: ["TECHNICAL ASSESSMENT", "기술역량평가", "평가 회차, 대상자, 문항과 외부 결과 데이터를 통합 관리합니다."],
  results: ["ASSESSMENT RESULT", "평가 결과", "평가별 가중치를 시뮬레이션하고 최종 역량점수를 확정합니다."],
  learning: ["GROWTH PATH", "추천 교육·자격", "직무 Gap과 성장 목표에 맞는 학습·자격 로드맵을 실행합니다."],
};

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2300);
}

function openModal(title, eyebrow, body) {
  $("#modalTitle").textContent = title;
  $("#modalEyebrow").textContent = eyebrow;
  $("#modalBody").innerHTML = body;
  $("#modal").classList.add("open");
  $("#modal").setAttribute("aria-hidden", "false");
}

function closeModal() {
  $("#modal").classList.remove("open");
  $("#modal").setAttribute("aria-hidden", "true");
}

function downloadCsv(filename, header, rows) {
  const csv = "\ufeff" + [header, ...rows].map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
  toast("조회 결과를 CSV로 저장했습니다.");
}

function renderRadar() {
  const size = 300, center = 150, radius = 95;
  const point = (index, value) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / radarData.length;
    const r = radius * (value / 100);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  };
  const polygon = (key, override) => radarData.map((item, index) => point(index, override ?? item[key]).join(",")).join(" ");
  $("#radarChart").innerHTML = `<svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="역량별 본인과 조직 평균 비교">${[20, 40, 60, 80, 100].map(value => `<polygon points="${polygon("me", value)}" class="radar-grid"/>`).join("")}${radarData.map((_, index) => { const p = point(index, 100); return `<line x1="${center}" y1="${center}" x2="${p[0]}" y2="${p[1]}" class="radar-axis"/>`; }).join("")}<polygon points="${polygon("team")}" class="radar-team"/><polygon points="${polygon("me")}" class="radar-me"/>${radarData.map((item, index) => { const p = point(index, 120); return `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle">${item.label}</text>`; }).join("")}</svg><div class="chart-legend"><span><i></i>본인</span><span><i class="team"></i>조직 평균</span></div>`;
}

function renderComponents() {
  $("#scoreComponents").innerHTML = scoreComponents.map((item, index) => `<button class="${index === 0 ? "active" : ""}" data-score-key="${item.key}"><span>${item.label}<small>${item.detail}</small></span><div class="meter"><i style="width:${item.score / item.max * 100}%"></i></div><b>${item.score}<em>/${item.max}</em></b></button>`).join("");
  $$('[data-score-key]').forEach(button => button.addEventListener("click", () => {
    $$('[data-score-key]').forEach(item => item.classList.remove("active"));
    button.classList.add("active");
  }));
}

function renderLists() {
  $("#certificateList").innerHTML = certificates.map(item => `<div><span class="item-icon">✓</span><span><b>${item.name}</b><small>${item.grade} · 현 직무 매칭</small></span><strong>+${item.points}</strong></div>`).join("");
  $("#educationList").innerHTML = education.map(item => `<div><span class="item-icon ${item.completed ? "" : "todo"}">${item.completed ? "✓" : "·"}</span><span><b>${item.name}</b><small>${item.completed ? "이수 완료" : "직무 필수 · 미이수"}</small></span><strong>${item.completed ? `+${item.points}` : "필요"}</strong></div>`).join("");
}

const summaryContent = {
  performance: [["업무성과평가", "82점", "직급 평균 78점"], ["조직평가", "88점", "본부 평균 81점"], ["목표 달성률", "94%", "전년 대비 +6%p"]],
  work: [["근속년수", "3년 2개월", "경력점수 16점"], ["현 직무 수행", "1년 8개월", "QA 직무"], ["승진 허들", "2/3 충족", "필수 교육 보완"]],
  total: [["역량 Level", "Lv.5", "2027 예측 Lv.6"], ["성과 수준", "상위 28%", "조직 평균 이상"], ["직무 적합도", "78%", "요건 2개 보완"]],
};

function renderSummary(type) {
  $("#summaryCards").innerHTML = summaryContent[type].map(item => `<article class="surface summary-card"><span>${item[0]}</span><strong>${item[1]}</strong><small>${item[2]}</small></article>`).join("");
}

function unique(key) { return ["전체", ...new Set(members.map(item => item[key]))]; }
function fillSelect(id, key) { $(id).innerHTML = unique(key).map(item => `<option value="${item}">${item}</option>`).join(""); }

function applyFilters() {
  const department = $("#departmentFilter").value;
  const grade = $("#gradeFilter").value;
  const job = $("#jobFilter").value;
  filteredMembers = members.filter(item => (department === "전체" || item.department === department) && (grade === "전체" || item.grade === grade) && (job === "전체" || item.job === job));
  renderOrg();
}

function renderOrg() {
  const average = filteredMembers.length ? Math.round(filteredMembers.reduce((sum, item) => sum + item.score, 0) / filteredMembers.length) : 0;
  const kpis = [["조회 인원", `${filteredMembers.length}명`, `평가 대상 ${members.length}명`, ""], ["평균 역량점수", `${average}점`, "전사 평균 69점", ""], ["Lv.5 이상", `${filteredMembers.filter(item => item.level >= 5).length}명`, "핵심·전문 인력", ""], ["관리 필요", `${filteredMembers.filter(item => item.watch).length}명`, "미응시·하락 포함", "risk"]];
  $("#orgKpis").innerHTML = kpis.map(item => `<article class="surface kpi-card ${item[3]}"><span>${item[0]}</span><strong>${item[1]}</strong><small>${item[2]}</small></article>`).join("");
  $("#memberBars").innerHTML = filteredMembers.map(item => `<div><span>${item.name}</span><div class="bar-track"><i class="${item.score < item.previous ? "down" : ""}" style="width:${item.score}%"></i><b style="left:${Math.min(98, item.previous)}%" title="직전 ${item.previous}점"></b></div><strong>${item.score}</strong></div>`).join("");
  const watches = members.filter(item => item.watch);
  $("#watchCount").textContent = `${watches.length}명`;
  $("#watchList").innerHTML = watches.length ? watches.map(item => `<div><span class="mini-avatar">${item.name.slice(-1)}</span><span><b>${item.name}</b><small>${item.job} · ${item.grade}</small></span><em>${item.status === "미응시" ? "평가 미응시" : `직전 대비 ${item.score - item.previous}점`}</em><button data-unwatch="${item.id}" aria-label="${item.name} 관심 해제">×</button></div>`).join("") : `<p class="watch-empty">관심 직원이 없습니다.</p>`;
  $("#memberTable").innerHTML = filteredMembers.map(item => { const up = item.score >= item.previous; const risk = item.status === "관찰" || item.status === "미응시"; return `<tr><td><button class="star ${item.watch ? "active" : ""}" data-watch="${item.id}" aria-label="${item.name} 관심 ${item.watch ? "해제" : "등록"}">${item.watch ? "★" : "☆"}</button></td><td><b>${item.name}</b></td><td>${item.department}</td><td>${item.job}</td><td>${item.grade}</td><td><span class="level-badge">Lv.${item.level}</span></td><td><b>${item.score}</b> <small class="trend ${up ? "up" : "down"}">${up ? "▲" : "▼"}${Math.abs(item.score - item.previous)}</small></td><td>${item.multi}</td><td>${item.cert}점</td><td><span class="status ${risk ? "risk" : ""}">${item.status}</span></td></tr>`; }).join("");
  $("#emptyState").classList.toggle("show", filteredMembers.length === 0);
  $$('[data-watch],[data-unwatch]').forEach(button => button.addEventListener("click", () => toggleWatch(Number(button.dataset.watch || button.dataset.unwatch))));
}

function toggleWatch(id) {
  members = members.map(item => item.id === id ? { ...item, watch: !item.watch } : item);
  applyFilters();
  const member = members.find(item => item.id === id);
  toast(`${member.name}을 관심 직원에서 ${member.watch ? "등록" : "해제"}했습니다.`);
}

function pageHeader(page, actions = "") {
  const [eyebrow, title, description] = pageMeta[page];
  return `<div class="breadcrumb">e-HR <span>›</span> ${page === "learning" ? "성장지원" : page === "levels" || page === "jobs" ? "인재성장" : "평가관리"} <span>›</span> ${title}</div><section class="page-heading feature-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div><div class="page-actions">${actions}</div></section>`;
}

function renderLevelPage() {
  const distribution = [1, 2, 2, 1, 1, 1, 0];
  $("#featurePage").innerHTML = `${pageHeader("levels", `<button class="secondary-button" data-action="level-export">CSV 다운로드</button><button class="primary-button" data-action="batch">월말 배치 실행</button>`)}
    <div class="feature-kpis"><article class="surface"><span>평균 Level</span><strong>Lv.4.6</strong><small>전월 대비 +0.2</small></article><article class="surface"><span>평균 점수</span><strong>68.9</strong><small>전사 기준</small></article><article class="surface"><span>상향 예측</span><strong>3명</strong><small>차기 월말 기준</small></article><article class="surface risk"><span>저역량 관리</span><strong>2명</strong><small>Lv.3 이하</small></article></div>
    <div class="feature-grid split"><article class="surface feature-card"><div class="section-head"><div><p class="eyebrow">LEVEL DISTRIBUTION</p><h2>역량 Level 분포</h2></div><span class="soft-badge">총 ${members.length}명</span></div><div class="level-distribution">${distribution.map((count, index) => `<div><span>Lv.${index + 1}</span><div><i style="height:${Math.max(8, count * 36)}px"></i></div><b>${count}</b></div>`).join("")}</div></article><article class="surface feature-card"><div class="section-head"><div><p class="eyebrow">LEVEL RULE</p><h2>산정 기준</h2></div><button class="text-button" data-action="rule-edit">기준 편집</button></div><div class="rule-list">${[["Lv.7", "인사위원회 심의"], ["Lv.6", "80점 이상"], ["Lv.5", "65점 이상"], ["Lv.4", "60점 이상"], ["Lv.3", "55점 이상"], ["Lv.2", "50점 이상"], ["Lv.1", "50점 미만"]].map(item => `<div><b>${item[0]}</b><span>${item[1]}</span></div>`).join("")}</div></article></div>
    <article class="surface feature-card"><div class="table-toolbar"><div><p class="eyebrow">EMPLOYEE LEVEL</p><h2>직원별 역량 Level</h2></div><div class="compact-filters"><input id="levelSearch" type="search" placeholder="성명 또는 직무 검색"><select id="levelDepartment">${unique("department").map(item => `<option>${item}</option>`).join("")}</select></div></div><div class="table-scroll"><table><thead><tr><th>직원</th><th>조직</th><th>직무</th><th>직급</th><th>현재 Level</th><th>점수</th><th>전월</th><th>예측</th><th></th></tr></thead><tbody id="levelTable">${levelRows(members)}</tbody></table></div></article>`;
}

function levelRows(rows) {
  return rows.map(item => `<tr><td><span class="person-cell"><i>${item.name.slice(-1)}</i><b>${item.name}</b></span></td><td>${item.department}</td><td>${item.job}</td><td>${item.grade}</td><td><span class="level-badge">Lv.${item.level}</span></td><td><b>${item.score}</b></td><td><small class="trend ${item.score >= item.previous ? "up" : "down"}">${item.score >= item.previous ? "▲" : "▼"} ${Math.abs(item.score - item.previous)}</small></td><td>Lv.${item.score >= 78 ? Math.min(7, item.level + 1) : item.level}</td><td><button class="row-button" data-action="member-detail" data-id="${item.id}">상세</button></td></tr>`).join("");
}

function renderJobsPage() {
  $("#featurePage").innerHTML = `${pageHeader("jobs", `<button class="secondary-button" data-action="job-export">목록 다운로드</button><button class="primary-button" data-action="job-add">+ 직무 등록</button>`)}
    <article class="surface feature-card toolbar-card"><div class="search-field"><span>⌕</span><input id="jobSearch" type="search" placeholder="직무명, 코드, 핵심 역량 검색"></div><select id="jobGroup"><option>전체 직군</option><option>개발</option><option>인프라</option><option>보안</option><option>품질</option></select><span class="result-count">총 <b id="jobCount">${jobs.length}</b>개 직무</span></article><div id="jobCards" class="job-grid">${jobCards(jobs)}</div>`;
}

function jobCards(rows) {
  return rows.map(job => `<article class="surface job-card"><header><span class="job-code">${job.id}</span><span class="soft-badge">${job.group}</span><button data-action="job-menu" data-id="${job.id}" aria-label="${job.name} 편집">•••</button></header><h2>${job.name}</h2><p>${job.purpose}</p><dl><div><dt>재직 인원</dt><dd>${job.people}명</dd></div><div><dt>최고 Level</dt><dd>Lv.${job.level}</dd></div><div><dt>최종 개정</dt><dd>${job.updated}</dd></div></dl><div class="tag-row">${job.skills.map(skill => `<span>${skill}</span>`).join("")}</div><footer><span>추천 자격 ${job.certs.length}개</span><button data-action="job-view" data-id="${job.id}">정의서 보기 →</button></footer></article>`).join("");
}

function renderMultiPage() {
  const completed = multiAnswers.filter(value => value > 0).length;
  $("#featurePage").innerHTML = `${pageHeader("multi", `<span class="period-chip"><i></i>2026년 정기진단 · D-8</span>`)}
    <div class="feature-kpis"><article class="surface"><span>전체 대상</span><strong>128명</strong><small>평가자 312명</small></article><article class="surface"><span>제출 완료</span><strong>74%</strong><small>231 / 312명</small></article><article class="surface"><span>내 평가 과제</span><strong>4건</strong><small>완료 2 · 진행 1</small></article><article class="surface risk"><span>미제출</span><strong>81건</strong><small>리마인드 필요</small></article></div>
    <div class="feature-grid evaluation-layout"><article class="surface feature-card"><div class="section-head"><div><p class="eyebrow">MY ASSIGNMENTS</p><h2>나의 평가 과제</h2></div><span class="soft-badge">4명</span></div><div class="assignment-list"><button class="active"><i>완료</i><span><b>직원 A</b><small>동료 · QA</small></span><em>100%</em></button><button><i>완료</i><span><b>직원 C</b><small>동료 · 보안컨설팅</small></span><em>100%</em></button><button><i class="doing">진행</i><span><b>직원 D</b><small>협업 · TA</small></span><em>${Math.round(completed / multiAnswers.length * 100)}%</em></button><button><i class="todo">대기</i><span><b>직원 E</b><small>협업 · Application Engineering</small></span><em>0%</em></button></div></article>
    <article class="surface feature-card questionnaire"><div class="question-head"><div><span class="person-avatar">D</span><div><p class="eyebrow">PEER REVIEW</p><h2>직원 D · 행동역량 진단</h2><small>응답은 익명으로 집계되며 성장 목적으로만 활용됩니다.</small></div></div><strong id="answerProgress">${completed}/${multiAnswers.length}</strong></div><div id="questions">${multiQuestions()}</div><label class="comment-field">종합 피드백<textarea id="multiComment" placeholder="강점과 성장에 도움이 될 구체적인 행동 피드백을 작성해주세요."></textarea></label><div class="form-actions"><button class="secondary-button" data-action="multi-save">임시 저장</button><button class="primary-button" data-action="multi-submit">평가 제출</button></div></article></div>`;
}

function multiQuestions() {
  const labels = ["업무의 핵심을 정확히 파악하고 적절한 해결방안을 제시한다.", "필요한 사항을 스스로 판단하고 주도적으로 실행한다.", "새로운 기술과 방법을 활용해 업무 개선을 시도한다.", "상대가 이해하기 쉽도록 의견을 논리적으로 전달한다.", "갈등 상황에서도 상대를 존중하며 공동 목표에 기여한다.", "문제 발생 시 책임을 회피하지 않고 끝까지 해결한다."];
  return labels.map((label, index) => `<div class="question-item"><div><span>${String(index + 1).padStart(2, "0")}</span><p>${label}</p></div><div class="rating" data-question="${index}">${[1, 2, 3, 4, 5].map(value => `<button class="${multiAnswers[index] === value ? "active" : ""}" data-action="rate" data-index="${index}" data-value="${value}">${value}<small>${["전혀 아니다", "아니다", "보통", "그렇다", "매우 그렇다"][value - 1]}</small></button>`).join("")}</div></div>`).join("");
}

function renderTechPage() {
  $("#featurePage").innerHTML = `${pageHeader("tech", `<button class="secondary-button" data-action="tech-template">업로드 양식</button><button class="primary-button" data-action="tech-new">+ 평가 회차 생성</button>`)}
    <div class="feature-grid split"><article class="surface feature-card assessment-hero"><div><span class="live-badge"><i></i>진행 중</span><p class="eyebrow">2026-01 TECH ASSESSMENT</p><h2>2026년 상반기 기술역량평가</h2><p>IT 트렌드 · 개발 · 보안 · 인프라 / S1~M2 대상</p></div><dl><div><dt>평가 기간</dt><dd>06.10 - 06.28</dd></div><div><dt>대상자</dt><dd>128명</dd></div><div><dt>응시율</dt><dd>82%</dd></div><div><dt>평균</dt><dd>71.4점</dd></div></dl><div class="progress-line"><i style="width:82%"></i></div><footer><span>105명 응시 · 23명 미응시</span><button data-action="tech-config">설정 관리</button></footer></article><article class="surface feature-card"><div class="section-head"><div><p class="eyebrow">DATA INTEGRATION</p><h2>결과 데이터 연동</h2></div><span class="soft-badge">최근 06.24</span></div><div class="upload-zone" data-action="tech-upload"><span>⇧</span><b>결과 파일 업로드</b><small>CSV 또는 XLSX · 최대 10MB</small><input id="resultUpload" type="file" accept=".csv,.xlsx" hidden></div><div class="integration-log"><div><i class="ok">✓</i><span><b>답안지_20260624.csv</b><small>105명 · 2,100문항</small></span><em>정상</em></div><div><i>↻</i><span><b>외부 실기평가 연동</b><small>클라우드 · 보안</small></span><em>대기</em></div></div></article></div>
    <div class="feature-grid split"><article class="surface feature-card"><div class="section-head"><div><p class="eyebrow">QUESTION BANK</p><h2>문항 관리</h2></div><button class="text-button" data-action="question-add">+ 문항 추가</button></div><div class="question-stats"><div><strong>240</strong><span>전체 문항</span></div><div><strong>72</strong><span>개발</span></div><div><strong>58</strong><span>보안</span></div><div><strong>64</strong><span>인프라</span></div><div><strong>46</strong><span>IT 트렌드</span></div></div><div class="difficulty-bars"><div><span>초급</span><i><b style="width:35%"></b></i><em>84</em></div><div><span>중급</span><i><b style="width:46%"></b></i><em>110</em></div><div><span>고급</span><i><b style="width:19%"></b></i><em>46</em></div></div></article><article class="surface feature-card"><div class="section-head"><div><p class="eyebrow">CANDIDATE STATUS</p><h2>응시 현황</h2></div><button class="text-button" data-action="remind">미응시자 알림</button></div><div class="candidate-ring"><div style="--value:295deg"><strong>82%</strong><span>응시율</span></div><ul><li><i class="blue"></i>응시 완료 <b>105</b></li><li><i class="amber"></i>진행 중 <b>8</b></li><li><i></i>미응시 <b>15</b></li></ul></div></article></div>`;
}

function renderResultsPage() {
  $("#featurePage").innerHTML = `${pageHeader("results", `<button class="secondary-button" data-action="result-export">결과 다운로드</button><button class="primary-button" data-action="result-finalize">결과 확정</button>`)}
    <div class="feature-grid results-layout"><article class="surface feature-card weight-card"><div class="section-head"><div><p class="eyebrow">WEIGHT SIMULATION</p><h2>평가 가중치</h2></div><span id="weightTotal" class="soft-badge">합계 100%</span></div>${[["multi", "다면역량진단", resultWeights.multi], ["tech", "기술역량평가", resultWeights.tech], ["industry", "산업역량진단", resultWeights.industry]].map(item => `<label class="weight-control"><span>${item[1]}<b id="${item[0]}Value">${item[2]}%</b></span><input type="range" min="0" max="100" value="${item[2]}" data-weight="${item[0]}"></label>`).join("")}<button class="primary-button full" data-action="recalculate">가중치 적용·재계산</button><p class="form-note">가중치 변경은 화면 시뮬레이션에만 반영됩니다. 결과 확정 전까지 원본 점수는 유지됩니다.</p></article><article class="surface feature-card result-summary"><div class="section-head"><div><p class="eyebrow">RESULT SUMMARY</p><h2>재산정 영향</h2></div><span class="soft-badge">8명 표본</span></div><div class="impact-number"><strong id="resultAverage">69.9</strong><span>평균 최종점수</span><em id="resultDelta">+1.0</em></div><div class="impact-grid"><div><span>Level 상승</span><b id="levelUps">2명</b></div><div><span>Level 하락</span><b>0명</b></div><div><span>최대 변동</span><b id="maxChange">+2.6</b></div></div></article></div>
    <article class="surface feature-card"><div class="table-toolbar"><div><p class="eyebrow">FINAL SCORE</p><h2>개인별 평가 결과</h2></div><div class="compact-filters"><input id="resultSearch" type="search" placeholder="성명 또는 직무 검색"><select id="resultStatus"><option>전체 상태</option><option>확정</option><option>검토 필요</option></select></div></div><div class="table-scroll"><table><thead><tr><th>직원</th><th>직무</th><th>다면진단</th><th>기술평가</th><th>산업진단</th><th>최종 점수</th><th>Level</th><th>상태</th><th></th></tr></thead><tbody id="resultTable">${resultRows()}</tbody></table></div></article>`;
}

function calculatedScore(member) { return member.multi * resultWeights.multi / 100 + member.tech * resultWeights.tech / 100 + member.industry * resultWeights.industry / 100; }
function resultRows(rows = members) {
  return rows.map(item => { const final = calculatedScore(item).toFixed(1); const status = item.status === "관찰" || item.status === "미응시" ? "검토 필요" : "확정"; return `<tr><td><span class="person-cell"><i>${item.name.slice(-1)}</i><b>${item.name}</b></span></td><td>${item.job}</td><td>${item.multi}</td><td>${item.tech}</td><td>${item.industry}</td><td><b class="score-big">${final}</b></td><td><span class="level-badge">Lv.${item.level}</span></td><td><span class="status ${status === "검토 필요" ? "risk" : ""}">${status}</span></td><td><button class="row-button" data-action="result-detail" data-id="${item.id}">상세</button></td></tr>`; }).join("");
}

function renderLearningPage() {
  const courses = [
    { id: "AWS DevOps", type: "교육", title: "AWS DevOps Professional", provider: "AWS Skill Builder", hours: 24, match: 96, points: 5, reason: "클라우드 운영 역량 Gap", enrolled: learningState.has("AWS DevOps") },
    { id: "요구공학", type: "필수", title: "실무자를 위한 요구공학", provider: "사내 Academy", hours: 12, match: 92, points: 3, reason: "QA 직무 필수 교육", enrolled: learningState.has("요구공학") },
    { id: "ISTQB", type: "자격", title: "ISTQB Advanced Test Analyst", provider: "KSTQB", hours: 32, match: 88, points: 4, reason: "QA Level 6 추천 자격", enrolled: learningState.has("ISTQB") },
    { id: "AI Literacy", type: "교육", title: "AI Literacy for Business", provider: "Digital Campus", hours: 8, match: 84, points: 2, reason: "변화 추진 역량 보완", enrolled: learningState.has("AI Literacy") },
  ];
  $("#featurePage").innerHTML = `${pageHeader("learning", `<button class="secondary-button" data-action="plan-view">나의 성장 계획</button>`)}
    <article class="surface growth-banner"><div><span class="growth-icon">↗</span><div><p class="eyebrow">NEXT LEVEL PATH</p><h2>Lv.6까지 6점이 남았습니다</h2><p>필수 교육 1개와 고급 자격 1개를 완료하면 차기 배치에서 승급 가능성이 높습니다.</p></div></div><div class="growth-progress"><span><b>70</b> / 80점</span><i><b style="width:70%"></b></i><small>예정 학습 반영 시 79점</small></div></article>
    <div class="learning-toolbar"><div class="filter-pills"><button class="active" data-learning-filter="전체">전체</button><button data-learning-filter="교육">교육</button><button data-learning-filter="자격">자격</button><button data-learning-filter="필수">필수 과정</button></div><select id="learningSort"><option>적합도순</option><option>학습시간순</option><option>포인트순</option></select></div><div id="courseGrid" class="course-grid">${courseCards(courses)}</div>
    <article class="surface feature-card roadmap"><div class="section-head"><div><p class="eyebrow">2026 GROWTH ROADMAP</p><h2>나의 성장 로드맵</h2></div><span class="soft-badge">진행률 50%</span></div><div class="roadmap-steps"><div class="done"><i>✓</i><span><b>다면역량진단 완료</b><small>2026.03 · 38/50점</small></span></div><div class="done"><i>✓</i><span><b>정보보안기사 취득</b><small>2026.05 · +4점</small></span></div><div class="current"><i>3</i><span><b>AWS DevOps 과정</b><small>2026.07 예정 · +5점</small></span></div><div><i>4</i><span><b>ISTQB Advanced</b><small>2026.09 목표 · +4점</small></span></div></div></article>`;
}

function courseCards(courses) {
  return courses.map(item => `<article class="surface course-card" data-course-type="${item.type}"><header><span class="course-type ${item.type === "필수" ? "required" : ""}">${item.type}</span><strong>${item.match}% match</strong></header><div class="course-art"><span>${item.type === "자격" ? "CERT" : "LEARN"}</span></div><h2>${item.title}</h2><p>${item.provider} · ${item.hours}시간 · ${item.points}점</p><div class="recommend-reason">${item.reason}</div><footer><button class="secondary-button" data-action="course-detail" data-id="${item.id}">상세</button><button class="${item.enrolled ? "enrolled-button" : "primary-button"}" data-action="course-enroll" data-id="${item.id}">${item.enrolled ? "✓ 계획에 추가됨" : "성장 계획에 추가"}</button></footer></article>`).join("");
}

function renderFeature(page) {
  ({ levels: renderLevelPage, jobs: renderJobsPage, multi: renderMultiPage, tech: renderTechPage, results: renderResultsPage, learning: renderLearningPage })[page]();
  bindFeatureEvents(page);
}

function showMemberDetail(id) {
  const member = members.find(item => item.id === id);
  openModal(`${member.name} 역량 상세`, "EMPLOYEE INSIGHT", `<div class="modal-profile"><span>${member.name.slice(-1)}</span><div><h3>${member.name}</h3><p>${member.department} · ${member.job} · ${member.grade}</p></div><strong>Lv.${member.level}</strong></div><div class="modal-score-grid"><div><span>최종 점수</span><b>${member.score}</b></div><div><span>다면진단</span><b>${member.multi}</b></div><div><span>기술평가</span><b>${member.tech}</b></div><div><span>산업진단</span><b>${member.industry}</b></div></div><h4>최근 변화</h4><div class="history-list"><div><i></i><span><b>2026년 6월 월말 배치</b><small>${member.previous} → ${member.score}점</small></span></div><div><i></i><span><b>자격·교육 점수 반영</b><small>샘플 학습 이력 기반</small></span></div></div>`);
}

function openJobForm(job = null) {
  openModal(job ? "직무 정의서 편집" : "새 직무 등록", "JOB PROFILE", `<form id="jobForm" class="modal-form"><input type="hidden" name="originalId" value="${job?.id || ""}"><div class="form-grid"><label>직무 코드<input name="id" required value="${job?.id || `R${String(jobs.length + 1).padStart(4, "0")}`}"></label><label>직군<select name="group"><option ${job?.group === "개발" ? "selected" : ""}>개발</option><option ${job?.group === "인프라" ? "selected" : ""}>인프라</option><option ${job?.group === "보안" ? "selected" : ""}>보안</option><option ${job?.group === "품질" ? "selected" : ""}>품질</option></select></label><label class="wide">직무명<input name="name" required value="${job?.name || ""}" placeholder="예: Cloud Architect"></label><label class="wide">직무 목적<textarea name="purpose" required>${job?.purpose || ""}</textarea></label><label>재직 인원<input name="people" type="number" min="0" value="${job?.people || 0}"></label><label>최고 Level<input name="level" type="number" min="1" max="7" value="${job?.level || 7}"></label><label class="wide">핵심 역량 (쉼표 구분)<input name="skills" value="${job?.skills.join(", ") || ""}"></label><label class="wide">추천 자격 (쉼표 구분)<input name="certs" value="${job?.certs.join(", ") || ""}"></label></div><div class="form-actions">${job ? `<button type="button" class="danger-button" data-action="job-delete" data-id="${job.id}">삭제</button>` : ""}<span></span><button type="button" class="secondary-button" data-close-modal>취소</button><button type="submit" class="primary-button">저장</button></div></form>`);
  $("#jobForm").addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const item = { id: data.get("id"), group: data.get("group"), name: data.get("name"), purpose: data.get("purpose"), people: Number(data.get("people")), level: Number(data.get("level")), skills: data.get("skills").split(",").map(value => value.trim()).filter(Boolean), certs: data.get("certs").split(",").map(value => value.trim()).filter(Boolean), updated: new Date().toISOString().slice(0, 10) };
    const originalId = data.get("originalId");
    jobs = originalId ? jobs.map(existing => existing.id === originalId ? item : existing) : [...jobs, item];
    closeModal();
    renderFeature("jobs");
    toast(originalId ? "직무 정의서를 수정했습니다." : "새 직무를 등록했습니다.");
  });
}

function bindFeatureEvents(page) {
  const root = $("#featurePage");
  root.onclick = event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const id = button.dataset.id;
    if (action === "member-detail" || action === "result-detail") showMemberDetail(Number(id));
    if (action === "level-export") downloadCsv("역량_Level_조회.csv", ["직원", "조직", "직무", "Level", "점수"], members.map(item => [item.name, item.department, item.job, item.level, item.score]));
    if (action === "batch") { button.disabled = true; button.textContent = "배치 실행 중…"; setTimeout(() => { button.disabled = false; button.textContent = "월말 배치 실행"; toast("샘플 배치를 완료했습니다. 3명의 예측 점수가 갱신되었습니다."); }, 850); }
    if (action === "rule-edit") openModal("역량 Level 산정 기준", "LEVEL RULE", `<div class="editable-rules">${[7, 6, 5, 4, 3, 2, 1].map((level, index) => `<label><b>Lv.${level}</b><input value="${["인사위원회 심의", "80점 이상", "65점 이상", "60점 이상", "55점 이상", "50점 이상", "50점 미만"][index]}"></label>`).join("")}</div><div class="form-actions"><span></span><button class="primary-button" data-close-modal onclick="document.querySelector('#toast').textContent='산정 기준을 저장했습니다.'">저장</button></div>`);
    if (action === "job-add") openJobForm();
    if (action === "job-view" || action === "job-menu") openJobForm(jobs.find(item => item.id === id));
    if (action === "job-export") downloadCsv("직무_정의서_목록.csv", ["코드", "직군", "직무명", "인원", "Level"], jobs.map(item => [item.id, item.group, item.name, item.people, item.level]));
    if (action === "rate") { multiAnswers[Number(button.dataset.index)] = Number(button.dataset.value); renderFeature("multi"); }
    if (action === "multi-save") toast("작성 중인 평가를 임시 저장했습니다.");
    if (action === "multi-submit") { if (multiAnswers.some(value => !value)) toast("모든 문항에 응답해주세요."); else { button.textContent = "제출 완료 ✓"; button.disabled = true; toast("다면역량진단을 제출했습니다."); } }
    if (action === "tech-upload" && event.target.id !== "resultUpload") $("#resultUpload").click();
    if (action === "tech-template") downloadCsv("기술평가_업로드_양식.csv", ["사번", "성명", "직무", "점수"], [["SAMPLE-001", "직원 A", "QA", ""]]);
    if (action === "tech-new" || action === "tech-config") openModal("기술역량평가 설정", "ASSESSMENT SETUP", `<form class="modal-form" id="techForm"><div class="form-grid"><label>평가 연도<select><option>2026</option><option>2027</option></select></label><label>회차<input value="2026-01"></label><label>시작일<input type="date" value="2026-06-10"></label><label>종료일<input type="date" value="2026-06-28"></label><label class="wide">대상 직무<input value="개발, 보안, 인프라, IT 트렌드"></label><label class="wide">대상 직급<input value="S1, S2, L, M1, M2"></label></div><div class="form-actions"><span></span><button type="button" class="secondary-button" data-close-modal>취소</button><button class="primary-button">저장</button></div></form>`);
    if (action === "question-add") openModal("평가 문항 추가", "QUESTION BANK", `<form class="modal-form"><div class="form-grid"><label>직무 구분<select><option>개발</option><option>보안</option><option>인프라</option></select></label><label>난이도<select><option>초급</option><option>중급</option><option>고급</option></select></label><label class="wide">문항<textarea placeholder="문항 내용을 입력하세요"></textarea></label><label class="wide">정답 및 해설<textarea placeholder="정답과 해설을 입력하세요"></textarea></label></div><div class="form-actions"><span></span><button type="button" class="secondary-button" data-close-modal>취소</button><button class="primary-button" data-close-modal>문항 저장</button></div></form>`);
    if (action === "remind") toast("미응시자 15명에게 알림을 발송했습니다.");
    if (action === "recalculate") { const total = Object.values(resultWeights).reduce((sum, value) => sum + value, 0); if (total !== 100) toast("가중치 합계를 100%로 맞춰주세요."); else { $("#resultTable").innerHTML = resultRows(); const average = members.reduce((sum, item) => sum + calculatedScore(item), 0) / members.length; $("#resultAverage").textContent = average.toFixed(1); toast("변경된 가중치로 결과를 재산정했습니다."); } }
    if (action === "result-export") downloadCsv("평가_최종결과.csv", ["직원", "직무", "다면", "기술", "산업", "최종"], members.map(item => [item.name, item.job, item.multi, item.tech, item.industry, calculatedScore(item).toFixed(1)]));
    if (action === "result-finalize") { openModal("평가 결과 확정", "FINAL CONFIRMATION", `<div class="confirmation"><span>!</span><h3>현재 시뮬레이션 결과를 확정할까요?</h3><p>확정 후에는 인사관리자만 결과를 재개방할 수 있습니다.</p><div class="form-actions"><button class="secondary-button" data-close-modal>취소</button><button class="primary-button" id="confirmFinalize">결과 확정</button></div></div>`); $("#confirmFinalize").addEventListener("click", () => { closeModal(); toast("2026년 상반기 평가 결과를 확정했습니다."); }); }
    if (action === "course-enroll") { learningState.has(id) ? learningState.delete(id) : learningState.add(id); renderFeature("learning"); toast(learningState.has(id) ? "성장 계획에 추가했습니다." : "성장 계획에서 제외했습니다."); }
    if (action === "course-detail") openModal(id, "LEARNING DETAIL", `<div class="learning-detail"><span class="course-type">추천 과정</span><h3>${id}</h3><p>직무 요구역량과 현재 Gap을 기반으로 추천된 샘플 과정입니다.</p><dl><div><dt>예상 학습시간</dt><dd>24시간</dd></div><div><dt>반영 포인트</dt><dd>최대 5점</dd></div><div><dt>수료 기준</dt><dd>진도 90% + 평가 70점</dd></div></dl></div>`);
    if (action === "plan-view") toast(`성장 계획에 ${learningState.size}개 항목이 등록되어 있습니다.`);
  };

  if (page === "levels") {
    const filter = () => { const query = $("#levelSearch").value.toLowerCase(); const department = $("#levelDepartment").value; const rows = members.filter(item => (!query || `${item.name} ${item.job}`.toLowerCase().includes(query)) && (department === "전체" || item.department === department)); $("#levelTable").innerHTML = levelRows(rows); };
    $("#levelSearch").addEventListener("input", filter); $("#levelDepartment").addEventListener("change", filter);
  }
  if (page === "jobs") {
    const filter = () => { const query = $("#jobSearch").value.toLowerCase(); const group = $("#jobGroup").value; const rows = jobs.filter(item => (!query || `${item.id} ${item.name} ${item.skills.join(" ")}`.toLowerCase().includes(query)) && (group === "전체 직군" || item.group === group)); $("#jobCards").innerHTML = jobCards(rows); $("#jobCount").textContent = rows.length; };
    $("#jobSearch").addEventListener("input", filter); $("#jobGroup").addEventListener("change", filter);
  }
  if (page === "tech") $("#resultUpload").addEventListener("change", event => { if (event.target.files[0]) toast(`${event.target.files[0].name} 파일을 검증 후 반영했습니다.`); });
  if (page === "results") {
    $$('[data-weight]').forEach(input => input.addEventListener("input", () => { resultWeights[input.dataset.weight] = Number(input.value); $(`#${input.dataset.weight}Value`).textContent = `${input.value}%`; const total = Object.values(resultWeights).reduce((sum, value) => sum + value, 0); $("#weightTotal").textContent = `합계 ${total}%`; $("#weightTotal").classList.toggle("invalid", total !== 100); }));
    $("#resultSearch").addEventListener("input", event => { const query = event.target.value.toLowerCase(); $("#resultTable").innerHTML = resultRows(members.filter(item => `${item.name} ${item.job}`.toLowerCase().includes(query))); });
  }
  if (page === "learning") {
    $$('[data-learning-filter]').forEach(button => button.addEventListener("click", () => { $$('[data-learning-filter]').forEach(item => item.classList.toggle("active", item === button)); $$('.course-card').forEach(card => card.hidden = button.dataset.learningFilter !== "전체" && card.dataset.courseType !== button.dataset.learningFilter); }));
  }
}

function navigate(page) {
  $$('[data-page]').forEach(link => link.classList.toggle("active", link.dataset.page === page));
  const isMeta = page === "meta";
  $("#metaPage").classList.toggle("active", isMeta);
  $("#featurePage").classList.toggle("active", !isMeta);
  if (!isMeta) renderFeature(page);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupBaseEvents() {
  $$('[data-view]').forEach(button => button.addEventListener("click", () => {
    $$('[data-view]').forEach(item => item.classList.toggle("active", item === button));
    $("#myView").classList.toggle("active", button.dataset.view === "my");
    $("#orgView").classList.toggle("active", button.dataset.view === "org");
    if (button.dataset.view === "org") renderOrg();
  }));
  $$('[data-tab]').forEach(button => button.addEventListener("click", () => {
    $$('[data-tab]').forEach(item => item.classList.toggle("active", item === button));
    $$('.tab-panel').forEach(item => item.classList.remove("active"));
    const tab = button.dataset.tab;
    if (tab === "competency") $("#competencyTab").classList.add("active");
    else if (tab === "skills") $("#skillsTab").classList.add("active");
    else { renderSummary(tab); $("#summaryTab").classList.add("active"); }
  }));
  $$('[data-page]').forEach(link => link.addEventListener("click", event => { event.preventDefault(); history.replaceState(null, "", link.href); navigate(link.dataset.page); }));
  $$('[data-close-modal]').forEach(item => item.addEventListener("click", closeModal));
  document.addEventListener("click", event => {
    if (event.target.closest("[data-close-modal]")) closeModal();
    const deleteButton = event.target.closest('[data-action="job-delete"]');
    if (deleteButton) {
      jobs = jobs.filter(item => item.id !== deleteButton.dataset.id);
      closeModal();
      renderFeature("jobs");
      toast("직무 정의서를 삭제했습니다.");
    }
  });
  document.addEventListener("submit", event => {
    if (event.target.closest("#modal") && event.target.id !== "jobForm") {
      event.preventDefault();
      closeModal();
      toast("설정을 저장했습니다.");
    }
  });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });
  $("#downloadCsv").addEventListener("click", () => downloadCsv("전문역량_조직분석_202606.csv", ["성명", "조직", "직무", "직급", "역량Level", "점수", "다면진단", "자격증", "상태"], filteredMembers.map(item => [item.name, item.department, item.job, item.grade, `Lv.${item.level}`, item.score, item.multi, item.cert, item.status])));
  $("#resetFilters").addEventListener("click", () => { ["#departmentFilter", "#gradeFilter", "#jobFilter"].forEach(id => $(id).value = "전체"); applyFilters(); });
  ["#departmentFilter", "#gradeFilter", "#jobFilter"].forEach(id => $(id).addEventListener("change", applyFilters));
  $("#themeButton").addEventListener("click", () => { const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark"; document.documentElement.dataset.theme = next; localStorage.setItem("meta-theme", next); });
}

renderRadar();
renderComponents();
renderLists();
fillSelect("#departmentFilter", "department");
fillSelect("#gradeFilter", "grade");
fillSelect("#jobFilter", "job");
renderOrg();
setupBaseEvents();
const savedTheme = localStorage.getItem("meta-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
const initialPage = location.hash.slice(1);
if (pageMeta[initialPage]) navigate(initialPage);
