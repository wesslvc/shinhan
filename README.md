# 구매계약 대시보드 (V3.05 요건분석 기반)

Shinhan DS 구매계약팀 계약 대시보드 MVP 시안. `A01._____________________V3.05_20260701_V0.1.html` 요건분석 문서(대시보드 3뷰 + 등록 3단계, 6화면)를 근거로 구현한 React + Vite SPA입니다.

## 화면 구성

- **대시보드 3뷰** (헤더 페르소나 스위치로 전환)
  - 사업부서 대시보드 (officer) — 본부 진척·지연 중심, 절감액·수의비율 미노출, 팀별 3단 위젯
  - 구매계약팀 대시보드 (manager) — 전사 통제, 절감액·수의비율·본부별 위젯·Top5 지연표 등 전체 위젯
  - 경영진 대시보드 (ceo) — 읽기전용 요약 뷰, 4대 링게이지, CEO 보고 테이블, 마스킹
- **등록 3단계** (사이드바 "단계별 등록")
  - 1단계 제안품의 / 2단계 수행품의 / 3단계 구매품의 — 계약번호 승계, 기준일 자동 산출(D-10/-7/-3 등), HITL 검증 체크, 3단계 수동 종결항목·매입계약 1:N 반복

데이터는 세션 내 240건 mock(`src/data.js`)이며 저장·채번·ERP 연계는 미구현(시안) 상태입니다.

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # oxlint
```

## 구조

```
src/
  data.js            mock 계약 240건 + 집계 함수
  stageDefs.js        등록 3단계 필드 정의(STAGE_DEFS)
  context/            role/기준일/마스킹/테마 전역 상태
  components/
    layout/            Header · Sidebar · Footer
    charts/            SemiGauge · RingGauge · HBar · StackedHBar · Donut · LineChart
    ProcessMap.jsx, RiskZone.jsx, KpiCard.jsx
  pages/
    Dashboard.jsx       화면1·2 (role로 위젯 분기)
    Ceo.jsx             화면3
    StageRegister.jsx   화면4·5·6 (STAGE_DEFS 기반 공용 컴포넌트)
```
