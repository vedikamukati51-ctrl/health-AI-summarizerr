import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import DemoPatient from "../components/DemoPatient";

const mapping: Record<string,string> = {
  knee:"Orthopedist", joint:"Orthopedist", bone:"Orthopedist", skin:"Dermatologist", rash:"Dermatologist",
  stomach:"Gastroenterologist", digestion:"Gastroenterologist", eye:"Ophthalmologist", vision:"Ophthalmologist",
  heart:"Cardiologist", chest:"Cardiologist", breathing:"Pulmonologist", lung:"Pulmonologist",
  kidney:"Nephrologist", urine:"Urologist", headache:"Neurologist", nerve:"Neurologist"
};
const clinics = [
  {name:"Aarogya Ortho Care", specialty:"Orthopedist", distance:"2.1 km", address:"Demo clinic · Jaipur"},
  {name:"City Skin Care Centre", specialty:"Dermatologist", distance:"3.4 km", address:"Demo clinic · Jaipur"},
  {name:"Heart & Medicine Centre", specialty:"Cardiologist", distance:"4.0 km", address:"Demo clinic · Jaipur"}
];

export default function SpecialistLocator(){
 const [params] = useSearchParams();
 const [problem,setProblem]=useState(params.get("problem") || "knee pain"); const [permission,setPermission]=useState(false);
 const specialty=Object.entries(mapping).find(([k])=>problem.toLowerCase().includes(k))?.[1] || "General physician";
 const results=clinics.filter(c=>c.specialty===specialty || specialty==="General physician");
 function locate(){navigator.geolocation?.getCurrentPosition(()=>setPermission(true),()=>setPermission(false));}
 return <section className="page">
  <DemoPatient compact />
  <div className="page-heading"><span className="eyebrow">NEW FEATURE · RD-4</span><h2>Specialist Locator</h2><p>Demo mode shows how a symptom is mapped to a relevant specialist and displayed on a live map. No API key or backend is required.</p></div>
  <div className="card locator-form"><input value={problem} onChange={e=>setProblem(e.target.value)} placeholder="e.g. knee pain, skin rash, headache" /><button className="secondary-button" onClick={locate}>Use my location</button><button className="primary-button">Find specialists</button></div>
  <div className="card"><span className="card-label">MAPPED SPECIALTY</span><h3>{specialty}</h3><p>{permission ? "Location permission granted for this session." : "Demo map is centered on Jaipur. Real location is optional and only used with permission."}</p></div>
  <div className="card map-card">
    <div className="row-between"><div><span className="card-label">LIVE MAP · DEMO LOCATION</span><h3>Nearby specialist options</h3></div><span className="badge">OpenStreetMap tiles</span></div>
    <iframe title="Live OpenStreetMap demo map" className="live-map" src="https://www.openstreetmap.org/export/embed.html?bbox=75.755%2C26.88%2C75.83%2C26.94&layer=mapnik&marker=26.9124%2C75.7873" />
    <p className="map-note">The map loads live map tiles from OpenStreetMap. Internet is required for the map itself; the rest of the demo works without a backend.</p>
  </div>
  <div className="grid two">{results.map(r=><div className="card specialist-card" key={r.name}><span className="badge">{r.specialty}</span><h3>{r.name}</h3><p>{r.address}</p><strong>{r.distance}</strong></div>)}</div>
 </section>
}
