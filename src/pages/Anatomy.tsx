import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import DemoPatient from "../components/DemoPatient";
const regions=[ ["Head","headache","Neurologist"],["Chest","chest","Cardiologist"],["Abdomen","stomach","Gastroenterologist"],["Arm","joint","Orthopedist"],["Leg","knee","Orthopedist"],["Skin","skin","Dermatologist"] ];
export default function Anatomy(){
 const [angle,setAngle]=useState(0); const [selected,setSelected]=useState("Chest"); const [model,setModel]=useState("Female"); const [symptom,setSymptom]=useState("chest discomfort"); const start=useRef<number|null>(null); const startAngle=useRef(0);
 const matched=regions.find(r=>symptom && symptom.toLowerCase().includes(String(r[1]))); const active=matched || regions.find(r=>r[0]===selected) || regions[1];
 return <section className="page">
  <DemoPatient compact />
  <div className="page-heading"><span className="eyebrow">NEW FEATURE · RD-5 · FLAGSHIP</span><h2>3D Interactive Anatomy</h2><p>Demo mode uses an interactive illustrative body model. Type a symptom, select a region, rotate the model, then continue to the mapped specialist.</p></div>
  <div className="card anatomy-demo-banner"><strong>Demo scenario:</strong> Ananya has entered “chest discomfort”. The model highlights the Chest region and connects the orientation step to the Specialist Locator.</div>
  <div className="anatomy-layout">
   <div className="card anatomy-stage" aria-label={`${model} anatomy model`} onPointerDown={e=>{start.current=e.clientX;startAngle.current=angle}} onPointerMove={e=>{if(start.current!==null)setAngle(startAngle.current+(e.clientX-start.current)*0.7)}} onPointerUp={()=>start.current=null} onPointerLeave={()=>start.current=null}>
    <div className="body-model" style={{transform:`rotateY(${angle}deg)`}}>
      <div className="model-switch"><button className={model==="Female"?"selected":""} onClick={()=>setModel("Female")}>Female</button><button className={model==="Male"?"selected":""} onClick={()=>setModel("Male")}>Male</button></div>
      <div className="body-head"/><div className="body-neck"/><div className="body-torso">{active[0]==="Chest" && <button className="region chest active">Chest</button>}</div>
      <div className="body-arm left"/><div className="body-arm right"/><div className="body-leg left"/><div className="body-leg right"/>
      <div className={`body-marker marker-${String(active[0]).toLowerCase()}`}>{active[0]}</div>
    </div><p className="drag-hint">Drag horizontally to rotate · illustrative only</p>
   </div>
   <div className="card"><span className="card-label">DESCRIBE A SYMPTOM OR BODY AREA</span><input value={symptom} onChange={e=>setSymptom(e.target.value)} placeholder="e.g. knee pain, chest discomfort, skin rash" /><div style={{height:14}}/><span className="card-label">BODY REGION</span><div className="region-list">{regions.map(r=><button className={active[0]===r[0]?"selected":""} key={r[0]} onClick={()=>setSelected(r[0])}>{r[0]}<small>{r[2]}</small></button>)}</div><div className="anatomy-result"><strong>{active[0]}</strong><p>Selected for orientation. Relevant specialist mapping: <b>{active[2]}</b>.</p><Link className="secondary-button" to={`/specialists?problem=${encodeURIComponent(String(active[1]))}`}>Open Specialist Locator</Link></div></div>
  </div>
  <div className="card disclaimer"><strong>Safety:</strong> This visual is for orientation and understanding only. It is not a diagnostic or anatomically exact medical device.</div>
 </section>
}
