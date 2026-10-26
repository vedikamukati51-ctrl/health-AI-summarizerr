import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, demo } from "../services/api";
import type { Report } from "../types";
import StatusMessage from "../components/StatusMessage";

export default function Timeline() {
  const [reports, setReports] = useState<Report[]>(demo.reports);
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    api.getTimeline().then((data) => {
      setReports(data);
      setDemoMode(false);
    }).catch(() => {});
  }, []);

  return (
    <section className="page">
      <span className="eyebrow">FEATURES 9–10</span>
      <h2>Medical timeline</h2>
      <p>See reports from oldest to newest and choose reports to compare.</p>
      {demoMode && <StatusMessage type="info">Demo timeline is shown until the backend responds.</StatusMessage>}

      <div className="timeline">
        {[...reports].sort((a,b) => a.reportDate.localeCompare(b.reportDate)).map((report) => (
          <div className="timeline-item" key={report.id}>
            <div className="timeline-dot" />
            <div className="timeline-content">
              <span className="date">{new Date(report.reportDate).toLocaleDateString()}</span>
              <h3>{report.fileName}</h3>
              <div className="actions">
                <Link className="secondary-button" to={`/reports/${report.id}`}>View report</Link>
                <Link className="secondary-button" to={`/compare?beforeId=${report.id}&latestId=${reports[reports.length-1]?.id}`}>Compare</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}