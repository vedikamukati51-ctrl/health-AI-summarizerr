import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadArea from "./pages/UploadArea";
import Timeline from "./pages/Timeline";
import Compare from "./pages/Compare";
import ReportList from "./pages/ReportList";
import ReportDetail from "./pages/ReportDetail";
import Trends from "./pages/Trends";
import Glossary from "./pages/Glossary";
import VisitPrep from "./pages/VisitPrep";
import Language from "./pages/Language";
import Chatbot from "./pages/Chatbot";
import SpecialistLocator from "./pages/SpecialistLocator";
import Anatomy from "./pages/Anatomy";

const nav = [
  ["Dashboard", "/"],
  ["Upload", "/upload"],
  ["Timeline", "/timeline"],
  ["Reports", "/reports"],
  ["Trends", "/trends"],
  ["Glossary", "/glossary"],
  ["Visit Prep", "/visit-prep"],
  ["Languages", "/language"],
  ["Health Assistant", "/chatbot"],
  ["Specialist Locator", "/specialists"],
  ["3D Anatomy", "/anatomy"],
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">H</div>
          <div>
            <strong>Health AI Summarizer</strong>
            <span>Health Journey</span>
          </div>
        </div>

        <nav className="nav">
          {nav.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Demo mode</strong>
          <p>Use simulated reports for the hackathon. Do not upload real patient data.</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">PATIENT HEALTH JOURNEY</span>
            <h1>Understand your reports, simply.</h1>
          </div>
          <NavLink className="primary-button" to="/upload">+ Upload report</NavLink>
        </header>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadArea />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/reports" element={<ReportList />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/visit-prep" element={<VisitPrep />} />
          <Route path="/language" element={<Language />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/specialists" element={<SpecialistLocator />} />
          <Route path="/anatomy" element={<Anatomy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}