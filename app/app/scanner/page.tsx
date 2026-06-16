"use client";

import { useState, useRef, type DragEvent } from "react";
import { Upload, Camera, CheckCircle, AlertTriangle, RefreshCw, Save, UserCheck } from "lucide-react";
import { useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

const DISEASES: Record<string, { desc: string; treatments: string[]; severity: string }> = {
  "Late Blight":    { severity:"High",   desc:"Caused by Phytophthora infestans. Brown lesions on leaves with white mold in humid conditions.", treatments:["Apply Mancozeb 2g/L immediately","Remove infected leaves and burn","Avoid overhead irrigation","Spray Copper Oxychloride after rain"] },
  "Early Blight":   { severity:"Medium", desc:"Caused by Alternaria solani. Dark brown spots with concentric rings on older leaves.", treatments:["Apply Chlorothalonil 2g/L","Improve air circulation between plants","Reduce leaf wetness by drip irrigation","Spray neem oil (5ml/L) weekly"] },
  "Healthy":        { severity:"None",   desc:"No disease detected. Your crop appears healthy. Continue regular monitoring.", treatments:["Continue regular watering schedule","Apply balanced NPK fertilizer","Monitor for early signs weekly","Maintain proper plant spacing"] },
  "Powdery Mildew": { severity:"Medium", desc:"Fungal disease appearing as white powdery coating on leaves and stems.", treatments:["Apply Sulfur-based fungicide","Spray potassium bicarbonate solution","Improve air circulation","Avoid excess nitrogen fertilizer"] },
};

const MOCK_RESULTS = [
  { disease:"Late Blight", confidence:96, crop:"Tomato" },
  { disease:"Early Blight", confidence:89, crop:"Tomato" },
  { disease:"Healthy", confidence:99, crop:"Tomato" },
  { disease:"Powdery Mildew", confidence:84, crop:"Onion" },
];

export default function Scanner() {
  const { d, isDark } = useTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<"upload"|"camera">("upload");
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<typeof MOCK_RESULTS[0] | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
    setResult(null);
    setSaved(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const runScan = () => {
    setScanning(true);
    setProgress(0);
    const chosen = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setScanning(false); setResult(chosen); return 100; }
        return p + Math.random() * 12;
      });
    }, 150);
  };

  const info = result ? DISEASES[result.disease] : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>AI Eye — Disease Scanner</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Upload or capture a photo of your crop to get an instant AI diagnosis.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>

        {/* Upload panel */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, background: d.bgMuted, borderRadius: 10, padding: 4 }}>
            {(["upload","camera"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: tab === t ? d.card : "transparent", color: tab === t ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {t === "upload" ? <><Upload size={14}/>Upload</> : <><Camera size={14}/>Camera</>}
              </button>
            ))}
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !image && fileRef.current?.click()}
            style={{ border: `2px dashed ${image ? "#456348" : d.border}`, borderRadius: 16, padding: 0, cursor: image ? "default" : "pointer", overflow: "hidden", minHeight: 260, background: d.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s", boxShadow: shadow(isDark, 1) }}>
            {image ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img src={image} alt="Crop" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {!scanning && !result && (
                    <button onClick={runScan} style={{ padding: "12px 28px", borderRadius: 10, background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                      Analyse Crop
                    </button>
                  )}
                  {!scanning && (
                    <button onClick={() => { setImage(null); setResult(null); setSaved(false); }} style={{ padding: "8px 18px", borderRadius: 8, background: "rgba(255,255,255,0.2)", color: "#fff", fontFamily: MRP, fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
                      <RefreshCw size={12} style={{ display:"inline",marginRight:5,verticalAlign:"middle" }}/>Change Photo
                    </button>
                  )}
                </div>
                {/* Scanning overlay */}
                {scanning && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    {/* scanner line */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                      <div style={{ position: "absolute", top: `${progress}%`, left: 0, right: 0, height: 2, background: "#c4501a", boxShadow: "0 0 12px #c4501a", transition: "top 0.1s" }} />
                    </div>
                    <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: "#fff", margin: 0 }}>Analysing… {Math.min(Math.round(progress), 100)}%</p>
                    <div style={{ width: 200, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: "#c4501a", borderRadius: 999, transition: "width 0.1s" }} />
                    </div>
                    <p style={{ fontFamily: MRP, fontSize: 12, color: "rgba(255,255,255,0.7)", margin: 0 }}>Running disease detection model…</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 40 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(196,80,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Upload size={24} color="#c4501a" />
                </div>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: "0 0 6px" }}>Drop photo here</p>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: "0 0 16px" }}>or click to browse your gallery</p>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, padding: "4px 12px", borderRadius: 999, border: `1px solid ${d.border}` }}>JPG, PNG, WEBP up to 10MB</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

          {!image && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 12, color: d.textMuted, margin: "0 0 10px" }}>Or try with sample images:</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["photo-1416879595882-3373a0480b5b","photo-1464226184884-fa280b87c399","photo-1500651230702-0e2d8a49d4ad"].map((id, i) => (
                  <button key={i} onClick={() => { setImage(`https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&auto=format`); setResult(null); setSaved(false); }} style={{ padding: 0, border: `2px solid ${d.border}`, borderRadius: 8, overflow: "hidden", cursor: "pointer", width: 60, height: 60 }}>
                    <img src={`https://images.unsplash.com/photo-${id}?w=60&h=60&fit=crop&auto=format`} alt="" style={{ width: 60, height: 60, objectFit: "cover", display: "block" }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results panel */}
        <div>
          {!result && !scanning && (
            <div style={{ padding: 32, borderRadius: 16, border: `1px solid ${d.border}`, background: d.card, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(196,80,26,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <Camera size={24} color="#c4501a" />
              </div>
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 16, color: d.text, margin: "0 0 8px" }}>Results appear here</p>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0, maxWidth: 220 }}>Upload a photo and click "Analyse Crop" to get your AI diagnosis.</p>
            </div>
          )}

          {scanning && !result && (
            <div style={{ padding: 32, borderRadius: 16, border: `1px solid ${d.border}`, background: d.card, textAlign: "center" }}>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted }}>Processing…</p>
            </div>
          )}

          {result && info && (
            <div style={{ borderRadius: 16, border: `1px solid ${d.border}`, background: d.card, overflow: "hidden", boxShadow: shadow(isDark, 1) }}>
              {/* Result header */}
              <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${d.border}`, background: result.disease === "Healthy" ? "rgba(69,99,72,0.06)" : "rgba(196,80,26,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {result.disease === "Healthy" ? <CheckCircle size={18} color="#456348" /> : <AlertTriangle size={18} color="#c4501a" />}
                    <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: d.text, margin: 0 }}>{result.disease}</h3>
                  </div>
                  <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: info.severity === "None" ? "#456348" : info.severity === "High" ? "#ba1a1a" : "#c4501a", background: info.severity === "None" ? "rgba(69,99,72,0.12)" : info.severity === "High" ? "rgba(186,26,26,0.1)" : "rgba(196,80,26,0.1)", padding: "3px 10px", borderRadius: 999 }}>{info.severity === "None" ? "Healthy" : `${info.severity} Risk`}</span>
                </div>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 12px" }}>{result.crop} · {info.desc}</p>
                {/* Confidence */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                    <div style={{ width: `${result.confidence}%`, height: "100%", borderRadius: 999, background: result.confidence >= 90 ? "#456348" : "#c4501a" }} />
                  </div>
                  <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: result.confidence >= 90 ? "#456348" : "#c4501a" }}>{result.confidence}% Confidence</span>
                </div>
                {result.confidence < 90 && (
                  <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(67,100,100,0.1)", border: "1px solid rgba(67,100,100,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                    <UserCheck size={14} color="#436464" />
                    <p style={{ fontFamily: MRP, fontSize: 12, color: "#436464", margin: 0 }}>Confidence below 90%. <strong>Consult an expert for verification.</strong></p>
                  </div>
                )}
              </div>

              {/* Treatments */}
              <div style={{ padding: "16px 20px" }}>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Recommended Actions</p>
                {info.treatments.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < info.treatments.length - 1 ? 10 : 0 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(196,80,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: PJS, fontWeight: 800, fontSize: 10, color: "#c4501a" }}>{i+1}</div>
                    <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0, lineHeight: 1.5 }}>{t}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
                <button onClick={() => setSaved(true)} style={{ flex: 1, padding: "10px", borderRadius: 8, background: saved ? "rgba(69,99,72,0.1)" : "rgba(196,80,26,0.08)", color: saved ? "#456348" : "#c4501a", fontFamily: PJS, fontWeight: 700, fontSize: 13, border: `1px solid ${saved ? "rgba(69,99,72,0.25)" : "rgba(196,80,26,0.2)"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {saved ? <><CheckCircle size={13}/>Saved to History</> : <><Save size={13}/>Save Result</>}
                </button>
                <button onClick={() => { setImage(null); setResult(null); setSaved(false); }} style={{ flex: 1, padding: "10px", borderRadius: 8, background: "transparent", color: d.textSub, fontFamily: PJS, fontWeight: 700, fontSize: 13, border: `1px solid ${d.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <RefreshCw size={13}/>Scan Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
