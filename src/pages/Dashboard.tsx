import { useEffect, useState } from "react";
import { api, demo } from "../services/api";
import type { DashboardData } from "../types";
import StatusMessage from "../components/StatusMessage";
import DemoPatient from "../components/DemoPatient";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>(demo.dashboard);
  const [loading, setLoading] = useState(true);
  const [usingDemo, setUsingDemo] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then((result) => {
        setData(result);
        setUsingDemo(true);
      })
      .catch(() => setUsingDemo(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">DEMO PATIENT · HEALTH AI SUMMARIZER</span>
          <h2>Your latest health summary</h2>
          <p>A simple view of the latest processed report.</p>
        </div>
      </div>

      <DemoPatient />
      {usingDemo && <StatusMessage type="info">Presentation mode is active — all data shown in this build is simulated demo data. No backend is required.</StatusMessage>}
      {loading && <StatusMessage type="info">Loading latest report…</StatusMessage>}

      <div className="grid three">
        <div className="card large">
          <span className="card-label">AI HEALTH SUMMARY</span>
          <h3>In simple words</h3>
          <p>{data.summary}</p>
        </div>

        <div className="card">
          <span className="card-label">KEY FINDINGS</span>
          <ul className="clean-list">
            {data.keyFindings.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="card attention">
          <span className="card-label">ATTENTION NEEDED</span>
          <ul className="clean-list">
            {data.attentionNeeded.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="card disclaimer">
        <strong>Important:</strong> This is an informational AI summary, not a diagnosis or a replacement for a healthcare professional.
      </div>
    </section>
  );
}