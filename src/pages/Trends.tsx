import { useEffect, useState } from "react";
import { api } from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TrendPoint } from "../types";

const demoTrend: TrendPoint[] = [
  { date: "2026-01-15", value: 15 },
  { date: "2026-02-15", value: 14.5 },
  { date: "2026-03-15", value: 14 },
  { date: "2026-04-15", value: 13.9 },
];

export default function Trends() {
  const [parameter, setParameter] = useState("hemoglobin");
  const [data, setData] = useState<TrendPoint[]>(demoTrend);
  const [live, setLive] = useState(false);

  useEffect(() => {
    api.getTrends(parameter).then(d => { setData(d); setLive(true); }).catch(() => setLive(false));
  }, [parameter]);

  return (
    <section className="page">
      <span className="eyebrow">FEATURES 13–15</span>
      <h2>Health trends</h2>
      <p>See how a selected parameter changes across your reports.</p>

      <div className="card">
        <div className="row-between">
          <label className="select-label">Parameter
            <select value={parameter} onChange={e => setParameter(e.target.value)}>
              <option value="hemoglobin">Hemoglobin</option>
              <option value="creatinine">Creatinine</option>
              <option value="glucose">Glucose</option>
            </select>
          </label>
          <span className="badge">{live ? "LIVE API" : "DEMO"}</span>
        </div>

        <div className="chart">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <span className="card-label">AI TREND INSIGHT</span>
        <p>{live ? "Trend data was returned by the backend. The backend can provide its AI explanation alongside the trend response." : "The demo trend moves downward. In the integrated version, display the AI explanation returned by your backend here."}</p>
      </div>
    </section>
  );
}