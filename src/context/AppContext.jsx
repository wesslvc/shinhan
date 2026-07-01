import { createContext, useContext, useMemo, useState } from "react";
import { BASE_DATE } from "../data.js";

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState("manager"); // officer | manager | ceo
  const [dayOffset, setDayOffset] = useState(0); // -30 ~ +45
  const [masked, setMasked] = useState(true);
  const [theme, setTheme] = useState("light");
  const [contracts, setContracts] = useState(null); // lazily set from data.js CONTRACTS + registered

  const today = useMemo(() => {
    const d = new Date(BASE_DATE);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const view = useMemo(() => {
    if (role === "officer") return { isBiz: true, showSavings: false, showNegRate: false, showHQ: false, scope: "내 본부 프로젝트 진척·지연 중심" };
    if (role === "ceo") return { isBiz: false, showSavings: true, showNegRate: true, showHQ: true, scope: "전 본부 통제·지연 관리 (경영진과 동일 구성)", readOnly: true };
    return { isBiz: false, showSavings: true, showNegRate: true, showHQ: true, scope: "전 본부 통제·지연 관리 (경영진과 동일 구성)" };
  }, [role]);

  const value = { role, setRole, dayOffset, setDayOffset, today, masked, setMasked, theme, setTheme, view, contracts, setContracts };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
