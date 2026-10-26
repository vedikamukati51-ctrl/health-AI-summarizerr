import { Link } from "react-router-dom";
import type { Report } from "../types";

export default function ReportCard({ report }: { report: Report }) {
  return (
    <article className="report-card">
      <div className="file-icon">PDF</div>
      <div className="report-main">
        <strong>{report.fileName}</strong>
        <span>{new Date(report.reportDate).toLocaleDateString()}</span>
      </div>
      <Link className="secondary-button" to={`/reports/${report.id}`}>View</Link>
    </article>
  );
}