import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.join(__dirname, ".env");
const altEnvPath = path.join(__dirname, "..", ".env");

dotenv.config({ path: rootEnvPath });
if (!process.env.MONGODB_URI && !process.env.GEMINI_API_KEY) {
  dotenv.config({ path: altEnvPath });
}

const app = express();
const BASE_PORT = Number(process.env.PORT || 5000);
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
let mongoReady = false;

function listenOnPort(port) {
  const server = app.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Retrying on ${nextPort}.`);
      listenOnPort(nextPort);
      return;
    }

    console.error("Server startup error:", error);
    process.exit(1);
  });
}

app.use(cors({ origin: "*" }));
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }
});

const demoDashboard = {
  summary: "Ananya's latest blood report is mostly within the expected range. Hemoglobin is shown as slightly lower than the previous sample, while creatinine and glucose are within the report's reference range.",
  keyFindings: ["Hemoglobin: 14.2 g/dL", "Creatinine: 1.1 mg/dL", "Blood glucose: 92 mg/dL"],
  attentionNeeded: ["Hemoglobin has moved down slightly compared with the previous sample; discuss any concern at the next visit."]
};

const demoReports = [
  { _id: "r3", fileName: "Ananya_Blood_Report_September.pdf", reportDate: "2026-09-15", createdAt: new Date("2026-09-15T00:00:00.000Z"), fileSize: 240000 },
  { _id: "r2", fileName: "Ananya_CBC_August.pdf", reportDate: "2026-08-20", createdAt: new Date("2026-08-20T00:00:00.000Z"), fileSize: 180000 },
  { _id: "r1", fileName: "Ananya_Health_Check_July.jpg", reportDate: "2026-07-12", createdAt: new Date("2026-07-12T00:00:00.000Z"), fileSize: 920000 }
];

const demoDetail = {
  _id: "r3",
  fileName: "Ananya_Blood_Report_September.pdf",
  reportDate: "2026-09-15",
  fileSize: 240000,
  createdAt: new Date("2026-09-15T00:00:00.000Z"),
  extractedText: "Patient: Ananya Sharma\nHemoglobin: 14.2 g/dL\nCreatinine: 1.1 mg/dL\nBlood glucose: 92 mg/dL\nWBC Count: 6,400 /µL",
  parameters: [
    { name: "Hemoglobin", value: 14.2, unit: "g/dL", status: "NORMAL" },
    { name: "Creatinine", value: 1.1, unit: "mg/dL", status: "NORMAL" },
    { name: "Blood glucose", value: 92, unit: "mg/dL", status: "NORMAL" },
    { name: "WBC Count", value: 6400, unit: "/µL", status: "NORMAL" }
  ]
};

const demoCompare = {
  before: { id: "r2", fileName: "Ananya_CBC_August.pdf", reportDate: "2026-08-20", fileSize: 180000 },
  latest: { id: "r3", fileName: "Ananya_Blood_Report_September.pdf", reportDate: "2026-09-15", fileSize: 240000 },
  rows: [
    { param: "Hemoglobin", before: 14.8, latest: 14.2, diff: -0.6, status: "DECREASED" },
    { param: "Creatinine", before: 1.0, latest: 1.1, diff: 0.1, status: "INCREASED" },
    { param: "Blood glucose", before: 95, latest: 92, diff: -3, status: "DECREASED" }
  ],
  explanation: "The demo comparison highlights how Health AI Summarizer can make changes between two reports easier to notice. It is informational and not a diagnosis."
};

const demoTrends = {
  hemoglobin: [{ date: "2026-06-15", value: 15.1 }, { date: "2026-07-15", value: 14.9 }, { date: "2026-08-20", value: 14.8 }, { date: "2026-09-15", value: 14.2 }],
  creatinine: [{ date: "2026-06-15", value: 1.0 }, { date: "2026-07-15", value: 1.0 }, { date: "2026-08-20", value: 1.0 }, { date: "2026-09-15", value: 1.1 }],
  glucose: [{ date: "2026-06-15", value: 98 }, { date: "2026-07-15", value: 96 }, { date: "2026-08-20", value: 95 }, { date: "2026-09-15", value: 92 }]
};

const ParameterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    unit: { type: String, default: "" },
    status: { type: String, default: "NORMAL" }
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  reportDate: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  extractedText: { type: String, default: "" },
  summary: { type: String, default: "" },
  keyFindings: [{ type: String }],
  attentionNeeded: [{ type: String }],
  parameters: [ParameterSchema],
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", ReportSchema);

function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

function toReportDTO(doc) {
  const id = doc && doc._id ? doc._id.toString() : doc?.id || "demo-id";
  return {
    id,
    fileName: doc.fileName,
    reportDate: doc.reportDate,
    createdAt: doc.createdAt ? (doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt) : undefined,
    fileSize: doc.fileSize
  };
}

function toReportDetailDTO(doc) {
  return {
    ...toReportDTO(doc),
    extractedText: doc.extractedText || "",
    parameters: doc.parameters || []
  };
}

function makeDemoUploadedReport(file) {
  const reportDate = new Date().toISOString().split("T")[0];
  const entity = {
    _id: `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    fileName: file.originalname,
    reportDate,
    fileSize: file.size,
    createdAt: new Date(),
    extractedText: `Patient report uploaded: ${file.originalname}\nHemoglobin: 14.2 g/dL\nCreatinine: 1.1 mg/dL\nBlood glucose: 92 mg/dL`,
    summary: "The sample report is within expected range and shows stable lab values.",
    keyFindings: ["Hemoglobin: 14.2 g/dL", "Creatinine: 1.1 mg/dL", "Blood glucose: 92 mg/dL"],
    attentionNeeded: ["No immediate concern identified in this demo sample."],
    parameters: [
      { name: "Hemoglobin", value: 14.2, unit: "g/dL", status: "NORMAL" },
      { name: "Creatinine", value: 1.1, unit: "mg/dL", status: "NORMAL" },
      { name: "Blood glucose", value: 92, unit: "mg/dL", status: "NORMAL" }
    ]
  };

  demoReports.unshift(entity);
  return entity;
}

app.get("/api/dashboard", async (req, res) => {
  try {
    if (isMongoReady()) {
      const latest = await Report.findOne().sort({ reportDate: -1, createdAt: -1 });
      if (!latest) {
        return res.json({ summary: "No reports uploaded yet. Upload a report to view insights.", keyFindings: [], attentionNeeded: ["No medical records found in database."] });
      }
      return res.json({ summary: latest.summary, keyFindings: latest.keyFindings || [], attentionNeeded: latest.attentionNeeded || [] });
    }

    return res.json(demoDashboard);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/reports/upload", upload.array("files"), async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "No files uploaded." });
    }

    const savedReports = [];

    for (const file of files) {
      if (isMongoReady() && ai) {
        const base64Data = file.buffer.toString("base64");
        const prompt = `
Analyze this medical document and extract clinical data.
Return ONLY valid JSON matching this structure without markdown wraps:
{
  "reportDate": "YYYY-MM-DD",
  "summary": "Plain-language summary of 2-3 sentences for the patient.",
  "keyFindings": ["3-5 concise bullet points of test names, values, and units"],
  "attentionNeeded": ["Any abnormal, high, or low markers needing review"],
  "extractedText": "Complete visible text transcribed from the document",
  "parameters": [{"name":"Parameter name","value":14.2,"unit":"g/dL","status":"NORMAL|HIGH|LOW"}]
}
`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            prompt,
            { inlineData: { mimeType: file.mimetype, data: base64Data } }
          ]
        });

        const cleaned = (response.text || "").replace(/```json\s*|\s*```/g, "").trim();
        const extracted = JSON.parse(cleaned);

        const reportDoc = new Report({
          fileName: file.originalname,
          reportDate: extracted.reportDate || new Date().toISOString().split("T")[0],
          fileSize: file.size,
          extractedText: extracted.extractedText || "",
          summary: extracted.summary || "",
          keyFindings: extracted.keyFindings || [],
          attentionNeeded: extracted.attentionNeeded || [],
          parameters: extracted.parameters || []
        });

        const saved = await reportDoc.save();
        savedReports.push(toReportDTO(saved));
        continue;
      }

      const generated = makeDemoUploadedReport(file);
      savedReports.push(toReportDTO(generated));
    }

    return res.status(201).json({ summary: `${savedReports.length} report${savedReports.length > 1 ? "s" : ""} processed successfully.`, reports: savedReports });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Failed to process medical report." });
  }
});

app.get("/api/timeline", async (req, res) => {
  try {
    if (isMongoReady()) {
      const reports = await Report.find().sort({ reportDate: 1 });
      return res.json(reports.map(toReportDTO));
    }

    return res.json(demoReports.map(toReportDTO));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/reports", async (req, res) => {
  try {
    if (isMongoReady()) {
      const { search, from, to } = req.query;
      const query = {};

      if (search) query.fileName = { $regex: String(search), $options: "i" };
      if (from || to) {
        query.reportDate = {};
        if (from) query.reportDate.$gte = String(from);
        if (to) query.reportDate.$lte = String(to);
      }

      const reports = await Report.find(query).sort({ reportDate: -1 });
      return res.json(reports.map(toReportDTO));
    }

    const { search = "" } = req.query;
    const term = String(search).toLowerCase();
    const filtered = demoReports.filter((item) => !term || item.fileName.toLowerCase().includes(term));
    return res.json(filtered.map(toReportDTO));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/reports/:id", async (req, res) => {
  try {
    if (isMongoReady()) {
      const report = await Report.findById(req.params.id);
      if (!report) return res.status(404).json({ error: "Report not found." });
      return res.json(toReportDetailDTO(report));
    }

    const matchItem = demoReports.find((item) => item._id === req.params.id) || demoDetail;
    if (req.params.id === "demo-id") return res.json(toReportDetailDTO(demoDetail));
    if (!matchItem) return res.status(404).json({ error: "Report not found." });
    return res.json(toReportDetailDTO({ ...demoDetail, _id: matchItem._id, fileName: matchItem.fileName, reportDate: matchItem.reportDate, fileSize: matchItem.fileSize }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/compare", async (req, res) => {
  try {
    const { beforeId, latestId } = req.query;
    if (isMongoReady()) {
      const [before, latest] = await Promise.all([Report.findById(beforeId), Report.findById(latestId)]);
      if (!before || !latest) return res.status(404).json({ error: "One or both reports not found." });

      const beforeMap = new Map((before.parameters || []).map((p) => [p.name.trim().toLowerCase(), p]));
      const rows = [];
      const visited = new Set();

      (latest.parameters || []).forEach((latestP) => {
        const key = latestP.name.trim().toLowerCase();
        visited.add(key);
        const beforeP = beforeMap.get(key);
        const beforeVal = beforeP ? beforeP.value : "-";
        const latestVal = latestP.value;

        let diff = "-";
        let status = "UNCHANGED";
        if (typeof beforeVal === "number" && typeof latestVal === "number") {
          const delta = Number((latestVal - beforeVal).toFixed(2));
          diff = delta > 0 ? `+${delta}` : `${delta}`;
          status = delta > 0 ? "INCREASED" : delta < 0 ? "DECREASED" : "UNCHANGED";
        }

        rows.push({ param: latestP.name, before: beforeVal, latest: latestVal, diff, status });
      });

      for (const [key, beforeP] of beforeMap.entries()) {
        if (!visited.has(key)) rows.push({ param: beforeP.name, before: beforeP.value, latest: "-", diff: "-", status: "REMOVED" });
      }

      let explanation = "Comparison generated successfully.";
      if (ai) {
        try {
          const prompt = `Explain in 2 simple sentences what changed between these two medical lab results:\nEarlier: ${JSON.stringify(before.parameters)}\nLatest: ${JSON.stringify(latest.parameters)}`;
          const geminiRes = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
          if (geminiRes.text) explanation = geminiRes.text.trim();
        } catch (_) {}
      }

      return res.json({ before: toReportDTO(before), latest: toReportDTO(latest), rows, explanation });
    }

    return res.json(demoCompare);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/trends", async (req, res) => {
  try {
    const { parameter } = req.query;
    if (!parameter) return res.status(400).json({ error: "Missing parameter query." });

    if (isMongoReady()) {
      const regex = new RegExp(`^${String(parameter).trim()}$`, "i");
      const reports = await Report.find({ "parameters.name": { $regex: regex } }).sort({ reportDate: 1 });
      const points = [];
      reports.forEach((doc) => {
        const found = doc.parameters.find((p) => regex.test(p.name.trim()));
        if (found && !isNaN(Number(found.value))) points.push({ date: doc.reportDate, value: Number(found.value) });
      });
      return res.json(points);
    }

    const key = String(parameter).toLowerCase();
    return res.json(demoTrends[key] || demoTrends.hemoglobin);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/glossary/explain", async (req, res) => {
  try {
    const { term } = req.query;
    if (!term) return res.status(400).json({ error: "Missing term query." });

    if (ai) {
      const prompt = `Explain the medical term "${term}" in plain language. Return ONLY valid JSON: {"definition":"...","whyItMatters":"..."}`;
      const result = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
      const cleaned = (result.text || "").replace(/```json\s*|\s*```/g, "").trim();
      return res.json(JSON.parse(cleaned));
    }

    const t = String(term).toLowerCase();
    if (t.includes("hemoglobin")) {
      return res.json({ definition: "Hemoglobin is a protein in red blood cells that carries oxygen around the body.", whyItMatters: "It helps you understand one important part of a blood test." });
    }
    if (t.includes("creatinine")) {
      return res.json({ definition: "Creatinine is a waste product measured in blood tests and is commonly used when looking at kidney function.", whyItMatters: "The value is interpreted together with the report's reference range and other information." });
    }
    return res.json({ definition: "This demo explains medical terms in simple language. In the connected version, the explanation can be grounded in the patient's report context.", whyItMatters: "Always discuss important findings with a qualified healthcare professional." });
  } catch (err) {
    return res.status(500).json({ definition: "Unable to generate term explanation.", whyItMatters: "Consult your doctor for specific test details." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    mode: mongoReady ? "live" : "demo",
    mongoReady,
    aiReady: Boolean(ai),
    timestamp: new Date().toISOString()
  });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      mongoReady = true;
      console.log("Connected to MongoDB.");
    } catch (error) {
      mongoReady = false;
      console.warn("MongoDB unavailable; continuing in demo-memory mode.", error.message);
    }
  } else {
    console.warn("MONGODB_URI not set; continuing in demo-memory mode.");
  }

  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY not set; AI features will use demo responses.");
  }

  listenOnPort(BASE_PORT);
}

start().catch((err) => {
  console.error("Startup failure:", err);
  process.exit(1);
});