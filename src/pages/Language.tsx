import { useState } from "react";
import DemoPatient from "../components/DemoPatient";

const languages = [
  ["English", "English"], ["हिन्दी", "Hindi"], ["বাংলা", "Bengali"], ["தமிழ்", "Tamil"],
  ["తెలుగు", "Telugu"], ["मराठी", "Marathi"], ["ગુજરાતી", "Gujarati"], ["ಕನ್ನಡ", "Kannada"],
  ["മലയാളം", "Malayalam"], ["ਪੰਜਾਬੀ", "Punjabi"], ["ଓଡ଼ିଆ", "Odia"]
];
const sample: Record<string, string> = {
  English: "Your health information can be viewed in simple language.",
  Hindi: "आपकी स्वास्थ्य जानकारी सरल भाषा में देखी जा सकती है।",
  Bengali: "আপনার স্বাস্থ্য তথ্য সহজ ভাষায় দেখা যাবে।",
  Tamil: "உங்கள் உடல்நலத் தகவலை எளிய மொழியில் பார்க்கலாம்.",
  Telugu: "మీ ఆరోగ్య సమాచారాన్ని సులభమైన భాషలో చూడవచ్చు.",
  Marathi: "तुमची आरोग्य माहिती सोप्या भाषेत पाहता येते.",
  Gujarati: "તમારી આરોગ્ય માહિતી સરળ ભાષામાં જોઈ શકાય છે.",
  Kannada: "ನಿಮ್ಮ ಆರೋಗ್ಯ ಮಾಹಿತಿಯನ್ನು ಸರಳ ಭಾಷೆಯಲ್ಲಿ ನೋಡಬಹುದು.",
  Malayalam: "നിങ്ങളുടെ ആരോഗ്യ വിവരങ്ങൾ ലളിതമായ ഭാഷയിൽ കാണാം.",
  Punjabi: "ਤੁਹਾਡੀ ਸਿਹਤ ਜਾਣਕਾਰੀ ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਵੇਖੀ ਜਾ ਸਕਦੀ ਹੈ।",
  Odia: "ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା ସରଳ ଭାଷାରେ ଦେଖିପାରିବେ।"
};

export default function Language() {
  const [selected, setSelected] = useState("English");
  return <section className="page">
    <DemoPatient compact />
    <div className="page-heading">
      <span className="eyebrow">NEW FEATURE · RD-2</span>
      <h2>Language & accessibility</h2>
      <p>Choose the patient's preferred Indian language. English remains the fallback. This demo localizes the new-feature experience without changing existing report data.</p>
    </div>
    <div className="card">
      <div className="language-grid">{languages.map(([label, value]) =>
        <button className={`language-option ${selected===value ? "selected":""}`} key={value} onClick={()=>setSelected(value)}>{label}<small>{value}</small></button>
      )}</div>
    </div>
    <div className="card language-preview">
      <span className="card-label">PREVIEW</span>
      <h3>{sample[selected]}</h3>
      <p>Selected language: <strong>{selected}</strong></p>
      <span className="badge">Voice input/output · fast-follow</span>
    </div>
  </section>;
}