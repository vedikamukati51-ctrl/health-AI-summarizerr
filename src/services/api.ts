import type {
  CompareData,
  DashboardData,
  GlossaryData,
  Report,
  ReportDetailData,
  TrendPoint,
} from "../types";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const UPLOAD_FIELD = import.meta.env.VITE_UPLOAD_FIELD || "files";
// Demo mode is the default so the frontend can be presented without a backend.
// Set VITE_DEMO_MODE=false later when you want to connect the real API.
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || `API request failed (${response.status})`);
  }
  return response.json();
}

export const api = {
  getDashboard: () => DEMO_MODE ? Promise.resolve(demo.dashboard) : request<DashboardData>("/api/dashboard"),
  uploadReports: async (files: File[]) => {
    if (DEMO_MODE) {
      await new Promise(r => setTimeout(r, 700));
      return { summary: `${files.length} demo report${files.length > 1 ? "s" : ""} processed successfully. Sample patient data has been used for this presentation.` };
    }
    const formData = new FormData();
    files.forEach((file) => formData.append(UPLOAD_FIELD, file));
    return request<any>("/api/reports/upload", { method: "POST", body: formData });
  },
  getTimeline: () => DEMO_MODE ? Promise.resolve(demo.reports) : request<Report[]>("/api/timeline"),
  getReports: (params: { search?: string; from?: string; to?: string }) => {
    if (DEMO_MODE) {
      const term = (params.search || "").toLowerCase();
      return Promise.resolve(demo.reports.filter(r => !term || r.fileName.toLowerCase().includes(term)));
    }
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);
    return request<Report[]>(`/api/reports?${query.toString()}`);
  },
  getReport: (id: string) => DEMO_MODE ? Promise.resolve(id === demo.detail.id ? demo.detail : demo.detail) : request<ReportDetailData>(`/api/reports/${encodeURIComponent(id)}`),
  compareReports: (beforeId: string, latestId: string) => DEMO_MODE ? Promise.resolve(demo.compare) : request<CompareData>(`/api/compare?beforeId=${encodeURIComponent(beforeId)}&latestId=${encodeURIComponent(latestId)}`),
  getTrends: (parameter: string) => DEMO_MODE ? Promise.resolve(demo.trends[parameter] || demo.trends.hemoglobin) : request<TrendPoint[]>(`/api/trends?parameter=${encodeURIComponent(parameter)}`),
  explainTerm: (term: string) => {
    if (DEMO_MODE) {
      const t = term.toLowerCase();
      if (t.includes("hemoglobin")) return Promise.resolve({ definition: "Hemoglobin is a protein in red blood cells that carries oxygen around the body.", whyItMatters: "It helps you understand one important part of a blood test." });
      if (t.includes("creatinine")) return Promise.resolve({ definition: "Creatinine is a waste product measured in blood tests and is commonly used when looking at kidney function.", whyItMatters: "The value is interpreted together with the report's reference range and other information." });
      return Promise.resolve({ definition: "This demo explains medical terms in simple language. In the connected version, the explanation can be grounded in the patient's report context.", whyItMatters: "Always discuss important findings with a qualified healthcare professional." });
    }
    return request<GlossaryData>(`/api/glossary/explain?term=${encodeURIComponent(term)}`);
  },
};

export const demo = {
  dashboard: {
    summary: "Ananya's latest blood report is mostly within the expected range. Hemoglobin is shown as slightly lower than the previous sample, while creatinine and glucose are within the report's reference range.",
    keyFindings: ["Hemoglobin: 14.2 g/dL", "Creatinine: 1.1 mg/dL", "Blood glucose: 92 mg/dL"],
    attentionNeeded: ["Hemoglobin has moved down slightly compared with the previous sample; discuss any concern at the next visit."],
  } satisfies DashboardData,
  reports: [
    { id: "r3", fileName: "Ananya_Blood_Report_September.pdf", reportDate: "2026-09-15", fileSize: 240000 },
    { id: "r2", fileName: "Ananya_CBC_August.pdf", reportDate: "2026-08-20", fileSize: 180000 },
    { id: "r1", fileName: "Ananya_Health_Check_July.jpg", reportDate: "2026-07-12", fileSize: 920000 },
  ] satisfies Report[],
  detail: {
    id: "r3", fileName: "Ananya_Blood_Report_September.pdf", reportDate: "2026-09-15", fileSize: 240000,
    extractedText: "Patient: Ananya Sharma\nHemoglobin: 14.2 g/dL\nCreatinine: 1.1 mg/dL\nBlood glucose: 92 mg/dL\nWBC Count: 6,400 /µL",
    parameters: [
      { name: "Hemoglobin", value: 14.2, unit: "g/dL", status: "NORMAL" },
      { name: "Creatinine", value: 1.1, unit: "mg/dL", status: "NORMAL" },
      { name: "Blood glucose", value: 92, unit: "mg/dL", status: "NORMAL" },
      { name: "WBC Count", value: 6400, unit: "/µL", status: "NORMAL" },
    ],
  } satisfies ReportDetailData,
  compare: {
    rows: [
      { param: "Hemoglobin", before: 14.8, latest: 14.2, diff: -0.6, status: "DECREASED" },
      { param: "Creatinine", before: 1.0, latest: 1.1, diff: 0.1, status: "INCREASED" },
      { param: "Blood glucose", before: 95, latest: 92, diff: -3, status: "DECREASED" },
    ],
    explanation: "The demo comparison highlights how Health AI Summarizer can make changes between two reports easier to notice. It is informational and not a diagnosis.",
  } satisfies CompareData,
  trends: {
    hemoglobin: [{ date: "2026-06-15", value: 15.1 }, { date: "2026-07-15", value: 14.9 }, { date: "2026-08-20", value: 14.8 }, { date: "2026-09-15", value: 14.2 }],
    creatinine: [{ date: "2026-06-15", value: 1.0 }, { date: "2026-07-15", value: 1.0 }, { date: "2026-08-20", value: 1.0 }, { date: "2026-09-15", value: 1.1 }],
    glucose: [{ date: "2026-06-15", value: 98 }, { date: "2026-07-15", value: 96 }, { date: "2026-08-20", value: 95 }, { date: "2026-09-15", value: 92 }],
  } as Record<string, TrendPoint[]>,
};
