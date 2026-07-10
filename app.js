const scoreComponents = [
  { key:"multi", label:"다면역량진단", score:38, max:50, detail:"윤리·전문성·주도성·협업·책임" },
  { key:"career", label:"경력", score:16, max:20, detail:"직급 체류 및 유관 경력" },
  { key:"degree", label:"학위", score:5, max:10, detail:"석사" },
  { key:"certificate", label:"자격증", score:9, max:20, detail:"고급 2 · 초급 1" },
  { key:"contribution", label:"조직역량기여", score:2, max:8, detail:"사내 멘토링 1건" }
];
const radarData = [
  { label:"윤리", me:84, team:82 }, { label:"업무 전문성", me:72, team:78 },
  { label:"자발적 행동", me:80, team:75 }, { label:"변화 추진", me:68, team:73 },
  { label:"소통·협업", me:88, team:80 }, { label:"실행·책임", me:76, team:79 }
];
const certificates = [
  { name:"정보보안기사", grade:"고급", points:4 }, { name:"PMP", grade:"고급", points:4 }, { name:"정보처리기사", grade:"초급", points:1 }
];
const education = [
  { name:"SW Test Manager", points:5, completed:true }, { name:"SP인증 SW교육", points:5, completed:true }, { name:"AWS DevOps", points:2, completed:false }
];
let members = [
  { id:1,name:"직원 A",department:"디지털혁신팀",job:"QA",grade:"S2",level:6,score:81,previous:76,multi:86,cert:12,status:"우수",watch:false },
  { id:2,name:"직원 B",department:"디지털혁신팀",job:"QA",grade:"S2",level:5,score:70,previous:67,multi:76,cert:9,status:"적정",watch:false },
  { id:3,name:"직원 C",department:"보안서비스팀",job:"보안컨설팅",grade:"S2",level:5,score:68,previous:71,multi:72,cert:8,status:"관찰",watch:true },
  { id:4,name:"직원 D",department:"디지털혁신팀",job:"TA",grade:"S1",level:4,score:62,previous:58,multi:69,cert:6,status:"적정",watch:false },
  { id:5,name:"직원 E",department:"데이터플랫폼팀",job:"Application Engineering",grade:"S1",level:3,score:56,previous:61,multi:64,cert:4,status:"관찰",watch:true },
  { id:6,name:"직원 F",department:"클라우드플랫폼팀",job:"클라우드 운영",grade:"L",level:6,score:84,previous:79,multi:88,cert:14,status:"전문가",watch:false },
  { id:7,name:"직원 G",department:"보안서비스팀",job:"모의해킹",grade:"M2",level:3,score:57,previous:63,multi:66,cert:7,status:"미응시",watch:true }
];
let filteredMembers = [...members];

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2200)}

function renderRadar(){
  const size=300, center=150, radius=95;
  const point=(index,value)=>{const angle=-Math.PI/2+(index*Math.PI*2)/radarData.length;const r=radius*(value/100);return [center+Math.cos(angle)*r,center+Math.sin(angle)*r]};
  const polygon=(key,valueOverride)=>radarData.map((d,i)=>point(i,valueOverride ?? d[key]).join(",")).join(" ");
  $("#radarChart").innerHTML=`<svg viewBox="0 0 ${size} ${size}" class="radar-svg" role="img" aria-label="역량별 본인과 조직 평균 비교">${[20,40,60,80,100].map(v=>`<polygon points="${polygon("me",v)}" class="radar-grid"/>`).join("")}${radarData.map((_,i)=>{const p=point(i,100);return `<line x1="${center}" y1="${center}" x2="${p[0]}" y2="${p[1]}" class="radar-axis"/>`}).join("")}<polygon points="${polygon("team")}" class="radar-team"/><polygon points="${polygon("me")}" class="radar-me"/>${radarData.map((d,i)=>{const p=point(i,120);return `<text x="${p[0]}" y="${p[1]}" text-anchor="middle" dominant-baseline="middle">${d.label}</text>`}).join("")}</svg><div class="chart-legend"><span><i></i>본인</span><span><i class="team"></i>조직 평균</span></div>`;
}
function renderComponents(){
  $("#scoreComponents").innerHTML=scoreComponents.map((x,i)=>`<button class="${i===0?"active":""}" data-score-key="${x.key}"><span>${x.label}<small>${x.detail}</small></span><div class="meter"><i style="width:${x.score/x.max*100}%"></i></div><b>${x.score}<em>/${x.max}</em></b></button>`).join("");
  $$('[data-score-key]').forEach(button=>button.addEventListener("click",()=>{$$('[data-score-key]').forEach(x=>x.classList.remove("active"));button.classList.add("active")}));
}
function renderLists(){
  $("#certificateList").innerHTML=certificates.map(x=>`<div><span class="item-icon">✓</span><span><b>${x.name}</b><small>${x.grade} · 현 직무 매칭</small></span><strong>+${x.points}</strong></div>`).join("");
  $("#educationList").innerHTML=education.map(x=>`<div><span class="item-icon ${x.completed?"":"todo"}">${x.completed?"✓":"·"}</span><span><b>${x.name}</b><small>${x.completed?"이수 완료":"직무 필수 · 미이수"}</small></span><strong>${x.completed?`+${x.points}`:"필요"}</strong></div>`).join("");
}
const summaryContent={
  performance:[["업무성과평가","82점","직급 평균 78점"],["조직평가","88점","본부 평균 81점"],["목표 달성률","94%","전년 대비 +6%p"]],
  work:[["근속년수","3년 2개월","경력점수 16점"],["현 직무 수행","1년 8개월","QA 직무"],["승진 허들","2/3 충족","필수 교육 보완"]],
  total:[["역량 Level","Lv.5","2027 예측 Lv.6"],["성과 수준","상위 28%","조직 평균 이상"],["직무 적합도","78%","요건 2개 보완"]]
};
function renderSummary(type){$("#summaryCards").innerHTML=summaryContent[type].map(x=>`<article class="surface summary-card"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("")}

function setupViews(){
  $$('[data-view]').forEach(button=>button.addEventListener("click",()=>{$$('[data-view]').forEach(x=>x.classList.toggle("active",x===button));$("#myView").classList.toggle("active",button.dataset.view==="my");$("#orgView").classList.toggle("active",button.dataset.view==="org");if(button.dataset.view==="org") renderOrg()}));
  $$('[data-tab]').forEach(button=>button.addEventListener("click",()=>{
    $$('[data-tab]').forEach(x=>x.classList.toggle("active",x===button));$$('.tab-panel').forEach(x=>x.classList.remove("active"));
    const tab=button.dataset.tab;if(tab==="competency") $("#competencyTab").classList.add("active");else if(tab==="skills") $("#skillsTab").classList.add("active");else{renderSummary(tab);$("#summaryTab").classList.add("active")}
  }));
}
function unique(key){return ["전체",...new Set(members.map(x=>x[key]))]}
function fillSelect(id,key){$(id).innerHTML=unique(key).map(x=>`<option value="${x}">${x}</option>`).join("")}
function applyFilters(){const d=$("#departmentFilter").value,g=$("#gradeFilter").value,j=$("#jobFilter").value;filteredMembers=members.filter(x=>(d==="전체"||x.department===d)&&(g==="전체"||x.grade===g)&&(j==="전체"||x.job===j));renderOrg()}
function renderOrg(){
  const avg=filteredMembers.length?Math.round(filteredMembers.reduce((s,x)=>s+x.score,0)/filteredMembers.length):0;
  const kpis=[["조회 인원",`${filteredMembers.length}명`,`평가 대상 ${members.length}명`,""],["평균 역량점수",`${avg}점`,`전사 평균 69점`,""],["Lv.5 이상",`${filteredMembers.filter(x=>x.level>=5).length}명`,`핵심·전문 인력`,""],["관리 필요",`${filteredMembers.filter(x=>x.watch).length}명`,`미응시·하락 포함`,"risk"]];
  $("#orgKpis").innerHTML=kpis.map(x=>`<article class="surface kpi-card ${x[3]}"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("");
  $("#memberBars").innerHTML=filteredMembers.map(x=>`<div><span>${x.name}</span><div class="bar-track"><i class="${x.score<x.previous?"down":""}" style="width:${x.score}%"></i><b style="left:${Math.min(98,x.previous)}%" title="직전 ${x.previous}점"></b></div><strong>${x.score}</strong></div>`).join("");
  const watches=members.filter(x=>x.watch);$("#watchCount").textContent=`${watches.length}명`;$("#watchList").innerHTML=watches.length?watches.map(x=>`<div><span class="mini-avatar">${x.name[0]}</span><span><b>${x.name}</b><small>${x.job} · ${x.grade}</small></span><em>${x.status==="미응시"?"평가 미응시":`직전 대비 ${x.score-x.previous}점`}</em><button data-unwatch="${x.id}" aria-label="${x.name} 관심 해제">×</button></div>`).join(""):`<p class="watch-empty">관심 직원이 없습니다.</p>`;
  $("#memberTable").innerHTML=filteredMembers.map(x=>{const up=x.score>=x.previous;const risk=x.status==="관찰"||x.status==="미응시";return `<tr><td><button class="star ${x.watch?"active":""}" data-watch="${x.id}" aria-label="${x.name} 관심 ${x.watch?"해제":"등록"}">${x.watch?"★":"☆"}</button></td><td><b>${x.name}</b></td><td>${x.department}</td><td>${x.job}</td><td>${x.grade}</td><td><span class="level-badge">Lv.${x.level}</span></td><td><b>${x.score}</b> <small class="trend ${up?"up":"down"}">${up?"▲":"▼"}${Math.abs(x.score-x.previous)}</small></td><td>${x.multi}</td><td>${x.cert}점</td><td><span class="status ${risk?"risk":""}">${x.status}</span></td></tr>`}).join("");
  $("#emptyState").classList.toggle("show",filteredMembers.length===0);
  $$('[data-watch],[data-unwatch]').forEach(button=>button.addEventListener("click",()=>toggleWatch(Number(button.dataset.watch||button.dataset.unwatch))));
}
function toggleWatch(id){members=members.map(x=>x.id===id?{...x,watch:!x.watch}:x);applyFilters();const member=members.find(x=>x.id===id);toast(`${member.name}님을 관심 직원에서 ${member.watch?"등록":"해제"}했습니다.`)}
function setupFilters(){fillSelect("#departmentFilter","department");fillSelect("#gradeFilter","grade");fillSelect("#jobFilter","job");["#departmentFilter","#gradeFilter","#jobFilter"].forEach(id=>$(id).addEventListener("change",applyFilters));$("#resetFilters").addEventListener("click",()=>{["#departmentFilter","#gradeFilter","#jobFilter"].forEach(id=>$(id).value="전체");applyFilters()})}
function downloadCsv(){const header=["성명","조직","직무","직급","역량Level","점수","다면진단","자격증","상태"];const rows=filteredMembers.map(x=>[x.name,x.department,x.job,x.grade,`Lv.${x.level}`,x.score,x.multi,x.cert,x.status]);const csv="\ufeff"+[header,...rows].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="전문역량_조직분석_202606.csv";a.click();URL.revokeObjectURL(url);toast("조회 결과를 CSV로 저장했습니다.")}
function setupTheme(){const saved=localStorage.getItem("meta-theme");if(saved)document.documentElement.dataset.theme=saved;$("#themeButton").addEventListener("click",()=>{const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;localStorage.setItem("meta-theme",next)})}

renderRadar();renderComponents();renderLists();setupViews();setupFilters();setupTheme();renderOrg();$("#downloadCsv").addEventListener("click",downloadCsv);
