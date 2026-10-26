export default function DemoPatient({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`demo-patient ${compact ? "compact" : ""}`}>
      <div className="demo-avatar">AS</div>
      <div>
        <strong>Ananya Sharma</strong>
        <span>42 years · Female · Demo patient</span>
      </div>
      <span className="demo-badge">DEMO DATA</span>
    </div>
  );
}
