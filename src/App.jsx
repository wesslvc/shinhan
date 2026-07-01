import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Header from "./components/layout/Header.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Ceo from "./pages/Ceo.jsx";
import StageRegister from "./pages/StageRegister.jsx";

function Shell() {
  const { role, theme } = useApp();

  // data-theme must live on <html> (above <body>) so that body's own
  // `color: var(--text-1)` re-resolves against the override instead of
  // inheriting the light-mode value computed before the override applies.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={role === "ceo" ? <Ceo /> : <Dashboard />} />
            <Route path="/stage/1" element={<StageRegister stage="stage1" />} />
            <Route path="/stage/2" element={<StageRegister stage="stage2" />} />
            <Route path="/stage/3" element={<StageRegister stage="stage3" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
