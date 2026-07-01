import { useApp } from "../../context/AppContext.jsx";

function fmtDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function Header() {
  const { role, setRole, dayOffset, setDayOffset, today, masked, setMasked, theme, setTheme } = useApp();

  return (
    <header className="app-header">
      <div className="brand">
        SHINHAN DS <small>| 구매계약팀 계약 대시보드</small>
      </div>
      <span className="badge-pill">MVP v3.05</span>
      <span className="badge-pill">더미 240건</span>

      <div className="persona-switch">
        <button className={role === "officer" ? "active" : ""} onClick={() => setRole("officer")}>사업부서</button>
        <button className={role === "manager" ? "active" : ""} onClick={() => setRole("manager")}>구매계약팀</button>
        <button className={role === "ceo" ? "active" : ""} onClick={() => setRole("ceo")}>경영진</button>
      </div>

      <div className="header-spacer" />

      <div className="header-control">
        기준일
        <input
          type="range" min={-30} max={45} value={dayOffset}
          onChange={(e) => setDayOffset(Number(e.target.value))}
        />
        <span>{fmtDate(today)}</span>
      </div>

      <div className="toggle">
        <button className={masked ? "active" : ""} onClick={() => setMasked(true)}>마스킹 ON</button>
        <button className={!masked ? "active" : ""} onClick={() => setMasked(false)}>OFF</button>
      </div>

      <button className="icon-btn" title="테마 전환" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <button className="icon-btn" title="알림">🔔</button>
    </header>
  );
}
