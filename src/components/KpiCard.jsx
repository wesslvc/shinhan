export default function KpiCard({ label, value, foot, primary, valueClass }) {
  return (
    <div className={`kpi-card${primary ? " primary" : ""}`}>
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${valueClass ? ` ${valueClass}` : ""}`}>{value}</div>
      {foot && <div className="kpi-foot">{foot}</div>}
    </div>
  );
}
