import { useMemo, useState } from "react";
import DemoPatient from "../components/DemoPatient";

const prompts = [
  "What symptoms or discomfort have you noticed?",
  "How long has this been happening?",
  "What has changed recently?",
  "Which medicines or supplements are you currently taking?",
];

export default function VisitPrep() {
  const [answers, setAnswers] = useState(["mild tiredness after a busy week", "about 2 weeks", "energy feels a little lower than usual", "iron supplement and prescribed medicines"]);
  const [generated, setGenerated] = useState<string[]>([]);

  const questions = useMemo(() => {
    const [symptoms, duration, changes, medicines] = answers;
    const q: string[] = [];
    if (symptoms.trim()) q.push(`Could you help me understand what might be causing my ${symptoms.trim()} and what I should keep track of?`);
    if (duration.trim()) q.push(`Does the duration (${duration.trim()}) change what I should mention or ask about during this visit?`);
    if (changes.trim()) q.push(`I noticed ${changes.trim()}. What would you like me to monitor or bring to our next discussion?`);
    if (medicines.trim()) q.push(`Could we review whether my current medicines (${medicines.trim()}) should be discussed in relation to my recent reports?`);
    if (!q.length) q.push("What are the most important things I should ask about my recent reports?");
    q.push("Which findings in my recent reports or trends should I specifically discuss with you?");
    return q;
  }, [answers]);

  return <section className="page">
    <DemoPatient compact />
    <div className="page-heading">
      <span className="eyebrow">NEW FEATURE · RD-1</span>
      <h2>Doctor Visit Prep Kit</h2>
      <p>Turn your notes into a simple question list to take to your appointment. This prepares questions only; it does not diagnose or prescribe.</p>
    </div>
    <div className="card">
      {prompts.map((p, i) => <label className="form-field" key={p}>{p}
        <textarea value={answers[i]} onChange={e => setAnswers(a => a.map((v,j)=>j===i?e.target.value:v))} placeholder="Optional" />
      </label>)}
      <button className="primary-button" onClick={() => setGenerated(questions)}>Generate question list</button>
    </div>
    {generated.length > 0 && <div className="card">
      <span className="card-label">YOUR APPOINTMENT QUESTIONS</span>
      <ol className="question-list">{generated.map((q,i)=><li key={i}>{q}</li>)}</ol>
      <button className="secondary-button" onClick={() => window.print()}>Print / save this kit</button>
    </div>}
  </section>;
}