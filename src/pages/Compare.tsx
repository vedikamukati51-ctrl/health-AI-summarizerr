import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api, demo } from "../services/api";
import type { CompareData } from "../types";
import StatusMessage from "../components/StatusMessage";

const demoCompare: CompareData = {
  rows: [
    { param: "Hemoglobin", before: 15, latest: 14, diff: -1, status: "DECREASED" },
    { param: "Creatinine", before: 1.0, latest: 1.1, diff: 0.1, status: "INCREASED" },
  ],
  explanation: "The latest report shows a small change in the selected parameters. Use the original reports to verify values and discuss clinically important changes with a professional.",
};

export default function Compare() {
  const [params] = useSearchParams();
  const beforeId = params.get("beforeId") || demo.reports[1].id;
  const latestId = params.get("latestId") || demo.reports[0].id;
  const [data, setData] = useState<CompareData>(demoCompare);
  const [error, setError] = useState("");

  useEffect(() => {
    api.compareReports(beforeId, latestId).then(setData).catch((e) => setError(e instanceof Error ? e.message : "Could not compare reports."));
  }, [beforeId, latestId]);

  return (
    <section className="page">
      <span className="eyebrow">FEATURE 10 + 15</span>
      <h2>What changed?</h2>
      <p>Side-by-side comparison of two reports.</p>
      {error && <StatusMessage type="info">Backend comparison unavailable — showing demo comparison.</StatusMessage>}

      <div className="card table-card">
        <table>
          <thead><tr><th>Parameter</th><th>Before</th><th>Latest</th><th>Difference</th><th>Status</th></tr></thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i}>
                <td><strong>{row.param}</strong></td>
                <td>{row.before}</td>
                <td>{row.latest}</td>
                <td>{row.diff ?? "—"}</td>
                <td><span className="badge">{row.status ?? "—"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.explanation && (
        <div className="card">
          <span className="card-label">AI EXPLANATION</span>
          <p>{data.explanation}</p>
        </div>
      )}
    </section>
  );
}