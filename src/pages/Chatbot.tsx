import { useState } from "react";
import DemoPatient from "../components/DemoPatient";

const replies: Record<string,string> = {
  hemoglobin: "Hemoglobin is a protein in red blood cells that carries oxygen. I can explain the term or value in your stored report, but I cannot diagnose a condition or tell you what medicine to take.",
  creatinine: "Creatinine is a waste product commonly measured in blood tests to help assess kidney function. Your report's value should be interpreted in its own reference range and discussed with a healthcare professional when needed.",
  glucose: "Blood glucose is the amount of sugar in your blood at the time of the test. I can explain what the number and unit mean, but I cannot diagnose diabetes from a chat.",
  default: "I can explain medical terms and values from your reports in simple language, help you navigate this app, and point you toward the Specialist Locator. For symptoms or treatment decisions, please speak with a qualified healthcare professional."
};

export default function Chatbot() {
  const [input,setInput]=useState("");
  const [messages,setMessages]=useState<{from:string;text:string}[]>([
    {from:"assistant",text:"Hi Ananya! I can help you understand a term or value from your September blood report and navigate the app. I do not diagnose or prescribe."}
  ]);
  function send(){
    const text=input.trim(); if(!text)return;
    const key=Object.keys(replies).find(k=>k!=="default" && text.toLowerCase().includes(k)) || "default";
    setMessages(m=>[...m,{from:"you",text},{from:"assistant",text:replies[key]}]); setInput("");
  }
  return <section className="page">
    <DemoPatient compact />
    <div className="page-heading"><span className="eyebrow">NEW FEATURE · RD-3</span><h2>Patient Health Assistant</h2><p>Plain-language education grounded around this app's patient data. It is non-diagnostic and never recommends treatment.</p></div>
    <div className="chat-card">
      <div className="chat-messages">{messages.map((m,i)=><div key={i} className={`chat-bubble ${m.from}`}>{m.text}</div>)}</div>
      <div className="chat-input"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask about a report term or value…" /><button className="primary-button" onClick={send}>Send</button></div>
    </div>
    <div className="disclaimer card"><strong>Safety:</strong> symptom-related questions should be discussed with a doctor. This assistant does not diagnose or prescribe.</div>
  </section>;
}