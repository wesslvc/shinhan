import { NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";

export default function Sidebar() {
  const { role } = useApp();
  return (
    <aside className="app-sidebar">
      <div className="sb-group">
        <h4>메인</h4>
        <NavLink to="/" end className={({ isActive }) => `sb-item${isActive ? " active" : ""}`}>
          <span className="sb-dot" />{role === "ceo" ? "CEO 요약 뷰" : "대시보드"}
        </NavLink>
      </div>
      <div className="sb-group">
        <h4>단계별 등록</h4>
        {role !== "ceo" && (
          <>
            <NavLink to="/stage/1" className={({ isActive }) => `sb-item${isActive ? " active" : ""}`}>
              <span className="sb-dot" />1단계 제안품의
            </NavLink>
            <NavLink to="/stage/2" className={({ isActive }) => `sb-item${isActive ? " active" : ""}`}>
              <span className="sb-dot" />2단계 수행품의
            </NavLink>
            <NavLink to="/stage/3" className={({ isActive }) => `sb-item${isActive ? " active" : ""}`}>
              <span className="sb-dot" />3단계 구매품의
            </NavLink>
          </>
        )}
        {role === "ceo" && (
          <div className="sb-item disabled"><span className="sb-dot" />입력 권한 없음</div>
        )}
      </div>
      <div className="sb-group">
        <h4>조회/보고</h4>
        <div className="sb-item disabled"><span className="sb-dot" />계약 목록 (미구현)</div>
        <div className="sb-item disabled"><span className="sb-dot" />리포트 (미구현)</div>
      </div>
      <div className="sb-group">
        <h4>확장</h4>
        <div className="sb-item disabled"><span className="sb-dot" />ERP 연계 (미구현)</div>
      </div>
      <div className="sb-group">
        <h4>환경</h4>
        <div className="sb-item disabled"><span className="sb-dot" />권한·설정 (미구현)</div>
      </div>
    </aside>
  );
}
