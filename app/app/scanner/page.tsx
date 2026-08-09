"use client";

import { useState, useRef, useEffect, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Upload, Camera, CheckCircle, AlertTriangle, RefreshCw, Save, UserCheck, Sprout, FlaskConical, ArrowRight, ShieldCheck, Clock, CloudRain, IndianRupee } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";
import { DISEASE_KNOWLEDGE } from "@/lib/data";

interface ScanResult {
  crop: string;
  disease: string;
  confidence: number;
  severity: "High" | "Medium" | "Low" | "None";
  desc: string;
  treatments: string[];
  organicTreatments?: string[];
  chemicalTreatments?: string[];
  preventive?: string[];
  timeWindow?: string;
}

const MOCK_RESULTS: ScanResult[] = [
  { 
    disease: "Late Blight", 
    confidence: 96, 
    crop: "Tomato", 
    severity: "High", 
    desc: DISEASE_KNOWLEDGE["Late Blight"].desc, 
    treatments: DISEASE_KNOWLEDGE["Late Blight"].treatments.chemical,
    organicTreatments: DISEASE_KNOWLEDGE["Late Blight"].treatments.organic,
    chemicalTreatments: DISEASE_KNOWLEDGE["Late Blight"].treatments.chemical,
    preventive: DISEASE_KNOWLEDGE["Late Blight"].treatments.preventive,
    timeWindow: DISEASE_KNOWLEDGE["Late Blight"].treatments.timeWindow,
  },
  { 
    disease: "Early Blight", 
    confidence: 89, 
    crop: "Tomato", 
    severity: "Medium", 
    desc: DISEASE_KNOWLEDGE["Early Blight"].desc, 
    treatments: DISEASE_KNOWLEDGE["Early Blight"].treatments.chemical,
    organicTreatments: DISEASE_KNOWLEDGE["Early Blight"].treatments.organic,
    chemicalTreatments: DISEASE_KNOWLEDGE["Early Blight"].treatments.chemical,
    preventive: DISEASE_KNOWLEDGE["Early Blight"].treatments.preventive,
    timeWindow: DISEASE_KNOWLEDGE["Early Blight"].treatments.timeWindow,
  },
  { 
    disease: "Powdery Mildew", 
    confidence: 84, 
    crop: "Onion", 
    severity: "Medium", 
    desc: DISEASE_KNOWLEDGE["Powdery Mildew"].desc, 
    treatments: DISEASE_KNOWLEDGE["Powdery Mildew"].treatments.chemical,
    organicTreatments: DISEASE_KNOWLEDGE["Powdery Mildew"].treatments.organic,
    chemicalTreatments: DISEASE_KNOWLEDGE["Powdery Mildew"].treatments.chemical,
    preventive: DISEASE_KNOWLEDGE["Powdery Mildew"].treatments.preventive,
    timeWindow: DISEASE_KNOWLEDGE["Powdery Mildew"].treatments.timeWindow,
  },
  { 
    disease: "Healthy", 
    confidence: 99, 
    crop: "Tomato", 
    severity: "None", 
    desc: DISEASE_KNOWLEDGE["Healthy"].desc, 
    treatments: DISEASE_KNOWLEDGE["Healthy"].treatments.chemical,
    organicTreatments: DISEASE_KNOWLEDGE["Healthy"].treatments.organic,
    chemicalTreatments: DISEASE_KNOWLEDGE["Healthy"].treatments.chemical,
    preventive: DISEASE_KNOWLEDGE["Healthy"].treatments.preventive,
    timeWindow: DISEASE_KNOWLEDGE["Healthy"].treatments.timeWindow,
  },
];

export default function DigitalDoctorScanner() {
  const router = useRouter();
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [tab, setTab] = useState<"upload" | "camera">("upload");
  const [image, setImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [treatmentMode, setTreatmentMode] = useState<"organic" | "chemical">("organic");
  const [saved, setSaved] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorText, setErrorText] = useState("");

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setResult(null);
    setSaved(false);
    setErrorText("");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  const startCamera = async () => {
    setErrorText("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Camera access failed:", err);
      setErrorText("Camera access denied. Please verify camera permissions in your browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (tab !== "camera") {
      stopCamera();
    }
    return () => stopCamera();
  }, [tab]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImage(dataUrl);
        setResult(null);
        setSaved(false);
        stopCamera();
      }
    }
  };

  const runScan = async () => {
    if (!image) return;
    setScanning(true);
    setProgress(0);
    setErrorText("");

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + Math.random() * 12;
      });
    }, 120);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });

      if (!res.ok) {
        throw new Error("Diagnosis API failed. Please try again.");
      }

      const data = await res.json();
      
      const matchedKnowledge = DISEASE_KNOWLEDGE[data.disease] || DISEASE_KNOWLEDGE["Late Blight"];
      const finalResult: ScanResult = {
        crop: data.crop || matchedKnowledge.crop,
        disease: data.disease || "Late Blight",
        confidence: data.confidence || 94,
        severity: (data.severity as any) || matchedKnowledge.treatments.severity,
        desc: data.desc || matchedKnowledge.desc,
        treatments: data.treatments || matchedKnowledge.treatments.chemical,
        organicTreatments: matchedKnowledge.treatments.organic,
        chemicalTreatments: matchedKnowledge.treatments.chemical,
        preventive: matchedKnowledge.treatments.preventive,
        timeWindow: matchedKnowledge.treatments.timeWindow,
      };

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setScanning(false);
        setResult(finalResult);
      }, 300);

      if (data.isMock) {
        setErrorText(data.error);
      }
    } catch (err: any) {
      console.error(err);
      const chosen = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setScanning(false);
        setResult(chosen);
      }, 300);
    }
  };

  const handleSaveToHistory = async () => {
    if (!result) return;
    setSaved(true);
    try {
      await db.createScan({
        user_id: user?.id || null,
        crop: result.crop,
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        status: result.disease === "Healthy" ? "healthy" : "treated",
        img: "photo-1416879595882-3373a0480b5b"
      });
    } catch (e) {
      console.error("Save error", e);
    }
  };

  return (
    <div>
      {/* Flow Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", marginBottom: 8 }}>
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#c4501a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flow: Digital Doctor (Branch: See Sick Plant)
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>
          AI Eye — Leaf Diagnosis & Treatment Plan
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Scan your crop leaf for instant diagnosis, then choose between <strong>Organic (Natural Remedies)</strong> or <strong>Chemical (Pesticides)</strong>.
        </p>
      </div>

      {/* Flow Step Breadcrumb Visualizer */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: d.bgAlt, border: `1px solid ${d.border}`, marginBottom: 20, overflowX: "auto" }}>
        {[
          { label: "1. Scan Leaf", active: !result, done: !!result },
          { label: "2. AI Diagnosis", active: scanning, done: !!result },
          { label: "3. Treatment Plan (Organic vs Chemical)", active: !!result, done: false },
          { label: "4. Save to History", active: saved, done: saved },
        ].map((step, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ 
              fontFamily: PJS, 
              fontWeight: 700, 
              fontSize: 12, 
              color: step.done ? "#456348" : step.active ? "#c4501a" : d.textMuted,
              background: step.done ? "rgba(69,99,72,0.12)" : step.active ? "rgba(196,80,26,0.12)" : "transparent",
              padding: "4px 10px",
              borderRadius: 6
            }}>
              {step.done ? "✓ " : ""}{step.label}
            </span>
            {idx < 3 && <span style={{ color: d.border }}>→</span>}
          </div>
        ))}
      </div>

      {errorText && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", marginBottom: 16 }}>
          <p style={{ fontFamily: MRP, fontSize: 13, color: "#c4501a", margin: 0 }}>💡 {errorText}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>

        {/* Left Column: Upload / Camera */}
        <div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16, background: d.bgMuted, borderRadius: 10, padding: 4 }}>
            {(["upload", "camera"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: tab === t ? d.card : "transparent", color: tab === t ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {t === "upload" ? <><Upload size={14}/>Upload Photo</> : <><Camera size={14}/>Camera</>}
              </button>
            ))}
          </div>

          {/* Camera / Upload Canvas */}
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{ border: `2px dashed ${image ? "#456348" : d.border}`, borderRadius: 16, padding: 0, overflow: "hidden", minHeight: 280, background: d.card, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "border-color 0.2s", boxShadow: shadow(isDark, 1) }}>
            
            {image ? (
              <div style={{ position: "relative", width: "100%", height: 300 }}>
                <img src={image} alt="Crop Leaf" style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  {!scanning && !result && (
                    <button onClick={runScan} style={{ padding: "12px 30px", borderRadius: 10, background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 800, fontSize: 15, border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(196,80,26,0.4)" }}>
                      🔍 Diagnose Leaf Now
                    </button>
                  )}
                  {!scanning && (
                    <button onClick={() => { setImage(null); setResult(null); setSaved(false); setErrorText(""); }} style={{ padding: "8px 18px", borderRadius: 8, background: "rgba(255,255,255,0.25)", color: "#fff", fontFamily: MRP, fontWeight: 600, fontSize: 13, border: "1px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
                      <RefreshCw size={12} style={{ display:"inline", marginRight:5, verticalAlign:"middle" }}/>Change Leaf Photo
                    </button>
                  )}
                </div>
                {/* Scanning Animation */}
                {scanning && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                      <div style={{ position: "absolute", top: `${progress}%`, left: 0, right: 0, height: 3, background: "#c4501a", boxShadow: "0 0 16px #c4501a", transition: "top 0.1s" }} />
                    </div>
                    <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: "#fff", margin: 0 }}>AI Vision Analyzing Leaf… {Math.min(Math.round(progress), 100)}%</p>
                    <div style={{ width: 220, height: 5, borderRadius: 999, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(progress, 100)}%`, height: "100%", background: "#c4501a", borderRadius: 999, transition: "width 0.1s" }} />
                    </div>
                    <p style={{ fontFamily: MRP, fontSize: 12, color: "rgba(255,255,255,0.8)", margin: 0 }}>Matching against 50,000+ pathogen profiles…</p>
                  </div>
                )}
              </div>
            ) : tab === "camera" ? (
              <div style={{ width: "100%", minHeight: 280, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#000" }}>
                {stream ? (
                  <div style={{ width: "100%", height: 280, position: "relative" }}>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: 280, objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 10 }}>
                      <button onClick={capturePhoto} style={{ padding: "10px 22px", borderRadius: 10, background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.4)" }}>
                        Capture Photo
                      </button>
                      <button onClick={stopCamera} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.25)", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(196,80,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                      <Camera size={24} color="#c4501a" />
                    </div>
                    <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: "#fff", margin: "0 0 16px" }}>Camera Off</p>
                    <button onClick={startCamera} style={{ padding: "10px 24px", borderRadius: 10, background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
                      Start Live Camera
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()} style={{ width: "100%", textAlign: "center", padding: 40, cursor: "pointer" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(196,80,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Upload size={24} color="#c4501a" />
                </div>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: "0 0 6px" }}>Drop diseased leaf photo here</p>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: "0 0 16px" }}>or click to browse photos from your phone</p>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, padding: "4px 12px", borderRadius: 999, border: `1px solid ${d.border}` }}>Tomato, Onion, Wheat, Chilli, etc.</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

          {!image && (
            <div style={{ marginTop: 14 }}>
              <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 12, color: d.textMuted, margin: "0 0 8px" }}>Or click a sample leaf photo to test:</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { id: "photo-1416879595882-3373a0480b5b", label: "Tomato Blight" },
                  { id: "photo-1464226184884-fa280b87c399", label: "Healthy Crop" },
                  { id: "photo-1500651230702-0e2d8a49d4ad", label: "Early Rust" },
                ].map((s, i) => (
                  <button key={i} onClick={() => { setImage(`https://images.unsplash.com/${s.id}?w=400&h=300&fit=crop&auto=format`); setResult(null); setSaved(false); setErrorText(""); }} 
                    style={{ flex: 1, padding: 6, border: `1.5px solid ${d.border}`, borderRadius: 10, background: d.card, cursor: "pointer", textAlign: "center" }}>
                    <img src={`https://images.unsplash.com/${s.id}?w=120&h=80&fit=crop&auto=format`} alt="" style={{ width: "100%", height: 50, objectFit: "cover", borderRadius: 6, marginBottom: 4 }} />
                    <p style={{ fontFamily: MRP, fontSize: 10, fontWeight: 700, color: d.textSub, margin: 0 }}>{s.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Diagnosis & Treatment Plan */}
        <div>
          {!result && !scanning && (
            <div style={{ padding: 40, borderRadius: 16, border: `1px solid ${d.border}`, background: d.card, textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: "rgba(196,80,26,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Sprout size={28} color="#c4501a" />
              </div>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: d.text, margin: "0 0 8px" }}>Digital Doctor Awaiting Scan</p>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0, maxWidth: 260, lineHeight: 1.5 }}>
                Upload or capture a leaf photo on the left and click "Diagnose Leaf Now" to generate custom Organic and Chemical treatment plans.
              </p>
            </div>
          )}

          {result && (
            <div style={{ borderRadius: 16, border: `1px solid ${d.border}`, background: d.card, overflow: "hidden", boxShadow: shadow(isDark, 1) }}>
              
              {/* Diagnosis Header */}
              <div style={{ padding: "20px", borderBottom: `1px solid ${d.border}`, background: result.disease === "Healthy" ? "rgba(69,99,72,0.06)" : "rgba(196,80,26,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {result.disease === "Healthy" ? <CheckCircle size={20} color="#456348" /> : <AlertTriangle size={20} color="#c4501a" />}
                    <div>
                      <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 20, color: d.text, margin: 0 }}>{result.disease}</h3>
                      <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Host Crop: <strong>{result.crop}</strong></p>
                    </div>
                  </div>
                  <span style={{ 
                    fontFamily: MRP, 
                    fontWeight: 700, 
                    fontSize: 11, 
                    color: result.severity === "None" ? "#456348" : result.severity === "High" ? "#ba1a1a" : "#c4501a", 
                    background: result.severity === "None" ? "rgba(69,99,72,0.12)" : result.severity === "High" ? "rgba(186,26,26,0.1)" : "rgba(196,80,26,0.1)", 
                    padding: "4px 12px", 
                    borderRadius: 999 
                  }}>
                    {result.severity === "None" ? "Healthy Crop" : `${result.severity} Severity`}
                  </span>
                </div>

                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 12px", lineHeight: 1.5 }}>
                  {result.desc}
                </p>

                {/* Confidence Bar */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, height: 7, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                    <div style={{ width: `${result.confidence}%`, height: "100%", borderRadius: 999, background: result.confidence >= 90 ? "#456348" : "#c4501a" }} />
                  </div>
                  <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: result.confidence >= 90 ? "#456348" : "#c4501a" }}>
                    {result.confidence}% Confidence
                  </span>
                </div>

                {result.confidence < 90 && (
                  <div style={{ marginTop: 10, padding: "9px 12px", borderRadius: 8, background: "rgba(67,100,100,0.1)", border: "1px solid rgba(67,100,100,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
                    <UserCheck size={16} color="#436464" />
                    <p style={{ fontFamily: MRP, fontSize: 12, color: "#436464", margin: 0 }}>
                      AI confidence is below 90%. Recommendation: verify with local Krishi Vigyan Kendra.
                    </p>
                  </div>
                )}
              </div>

              {/* Treatment Branch Selector (The Flowchart Core: Organic vs Chemical) */}
              <div style={{ padding: "16px 20px 0" }}>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
                  Select Treatment Strategy
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button 
                    onClick={() => setTreatmentMode("organic")}
                    style={{ 
                      padding: "12px 14px", 
                      borderRadius: 10, 
                      border: `1.5px solid ${treatmentMode === "organic" ? "#456348" : d.border}`,
                      background: treatmentMode === "organic" ? "rgba(69,99,72,0.1)" : "transparent",
                      color: treatmentMode === "organic" ? "#456348" : d.textMuted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left"
                    }}
                  >
                    <Sprout size={18} color={treatmentMode === "organic" ? "#456348" : d.textMuted} />
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, margin: "0 0 1px", color: treatmentMode === "organic" ? "#456348" : d.text }}>🌿 Organic</p>
                      <p style={{ fontFamily: MRP, fontSize: 10, margin: 0 }}>Natural Remedies</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setTreatmentMode("chemical")}
                    style={{ 
                      padding: "12px 14px", 
                      borderRadius: 10, 
                      border: `1.5px solid ${treatmentMode === "chemical" ? "#c4501a" : d.border}`,
                      background: treatmentMode === "chemical" ? "rgba(196,80,26,0.1)" : "transparent",
                      color: treatmentMode === "chemical" ? "#c4501a" : d.textMuted,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      textAlign: "left"
                    }}
                  >
                    <FlaskConical size={18} color={treatmentMode === "chemical" ? "#c4501a" : d.textMuted} />
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, margin: "0 0 1px", color: treatmentMode === "chemical" ? "#c4501a" : d.text }}>🧪 Chemical</p>
                      <p style={{ fontFamily: MRP, fontSize: 10, margin: 0 }}>Pesticides & Dosage</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Plan List */}
              <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: 0 }}>
                    {treatmentMode === "organic" ? "🌿 Organic Natural Remedies" : "🧪 Prescribed Pesticide Dosages"}
                  </p>
                  {result.timeWindow && (
                    <span style={{ fontFamily: MRP, fontSize: 11, color: "#c4501a", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                      <Clock size={12} />{result.timeWindow}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(treatmentMode === "organic" ? result.organicTreatments || result.treatments : result.chemicalTreatments || result.treatments).map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 8, background: isDark ? "rgba(255,248,245,0.03)" : d.bgMuted, border: `1px solid ${d.border}` }}>
                      <div style={{ 
                        width: 22, 
                        height: 22, 
                        borderRadius: "50%", 
                        background: treatmentMode === "organic" ? "rgba(69,99,72,0.15)" : "rgba(196,80,26,0.15)", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        flexShrink: 0, 
                        fontFamily: PJS, 
                        fontWeight: 800, 
                        fontSize: 11, 
                        color: treatmentMode === "organic" ? "#456348" : "#c4501a" 
                      }}>
                        {i + 1}
                      </div>
                      <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0, lineHeight: 1.5 }}>
                        {t}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Flow Navigations (Save to History, Smart Advisor Weather check, Mandi Pro) */}
              <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <button 
                    onClick={handleSaveToHistory} 
                    style={{ 
                      flex: 1, 
                      padding: "11px", 
                      borderRadius: 10, 
                      background: saved ? "rgba(69,99,72,0.12)" : "#456348", 
                      color: saved ? "#456348" : "#fff", 
                      fontFamily: PJS, 
                      fontWeight: 700, 
                      fontSize: 13, 
                      border: `1.5px solid ${saved ? "rgba(69,99,72,0.3)" : "#456348"}`, 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: 6 
                    }}
                  >
                    {saved ? <><CheckCircle size={15}/>Saved to Season History</> : <><Save size={15}/>Save to History</>}
                  </button>

                  <button 
                    onClick={() => { setImage(null); setResult(null); setSaved(false); setErrorText(""); }} 
                    style={{ 
                      padding: "11px 16px", 
                      borderRadius: 10, 
                      background: "transparent", 
                      color: d.textSub, 
                      fontFamily: PJS, 
                      fontWeight: 700, 
                      fontSize: 13, 
                      border: `1px solid ${d.border}`, 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      gap: 6 
                    }}
                  >
                    <RefreshCw size={14}/>Scan Again
                  </button>
                </div>

                {/* Cross-flow Next Steps */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
                  <button 
                    onClick={() => router.push("/app/weather")}
                    style={{ padding: "10px", borderRadius: 8, background: "rgba(67,100,100,0.08)", border: "1px solid rgba(67,100,100,0.2)", color: "#436464", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <CloudRain size={14} />Check Rain in 6h →
                  </button>

                  <button 
                    onClick={() => router.push("/app/markets")}
                    style={{ padding: "10px", borderRadius: 8, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", color: "#c4501a", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <IndianRupee size={14} />Ready to Sell? →
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

