import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, demo } from "../services/api";
import type { ReportDetailData } from "../types";

export default function ReportDetail() {
  const { id = "r3" } = useParams();
  const [data, setData] = useState<ReportDetailData>(demo.detail);

  useEffect(() => {
    api.getReport(id).then(setData).catch(() => {
      if (id === demo.detail.id) setData(demo.detail);
    });
  }, [id]);

  return (
    <section className="page">
      <div className="row-between">
        <div>
          <span className="eyebrow">FEATURE 12</span>
          <h2>{data.fileName}</h2>
          <p>{new Date(data.reportDate).toLocaleDateString()}</p>
        </div>
        <Link className="secondary-button" to="/reports">← Back</Link>
      </div>

      <div className="grid two">
        <div className="card">
          <span className="card-label">EXTRACTED TEXT</span>
          <pre className="extracted">{data.extractedText || "No extracted text returned."}</pre>
        </div>

        <div className="card">
          <span className="card-label">EXTRACTED PARAMETERS</span>
          <table>
            <thead><tr><th>Name</th><th>Value</th><th>Unit</th><th>Status</th></tr></thead>
            <tbody>
              {data.parameters.map((p, i) => (
                <tr key={i}><td>{p.name}</td><td>{p.value}</td><td>{p.unit || "—"}</td><td><span className="badge">{p.status || "—"}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}