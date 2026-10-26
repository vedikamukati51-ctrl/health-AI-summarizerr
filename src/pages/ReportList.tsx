import { useEffect, useState } from "react";
import { api, demo } from "../services/api";
import type { Report } from "../types";
import ReportCard from "../components/ReportCard";

export default function ReportList() {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reports, setReports] = useState<Report[]>(demo.reports);

  async function searchReports() {
    try {
      setReports(await api.getReports({ search, from, to }));
    } catch {
      const term = search.toLowerCase();
      setReports(demo.reports.filter(r => !term || r.fileName.toLowerCase().includes(term)));
    }
  }

  useEffect(() => { searchReports(); }, []);

  return (
    <section className="page">
      <span className="eyebrow">FEATURES 11–12</span>
      <h2>Find your reports</h2>
      <p>Search by report name/text and filter by date range.</p>

      <div className="card filters">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search e.g. hemoglobin" />
        <label>From <input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
        <label>To <input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
        <button className="primary-button" onClick={searchReports}>Search</button>
      </div>

      <div className="stack">
        {reports.map(r => <ReportCard key={r.id} report={r} />)}
        {!reports.length && <div className="empty">No reports found.</div>}
      </div>
    </section>
  );
}