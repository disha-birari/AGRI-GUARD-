"use client";

import { useState } from "react";
import { 
  ShieldAlert, Camera, CloudRain, CheckCircle, Download, 
  MapPin, Clock, AlertTriangle, FileText, ArrowRight
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

export default function CropInsuranceLossPage() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();

  const [perilType, setPerilType] = useState("Hailstorm Damage");
  const [crop, setCrop] = useState("Tomato");
  const [affectedAcres, setAffectedAcres] = useState(2.0);
  const [sumInsuredPerAcre, setSumInsuredPerAcre] = useState(45000);
  const [damageEstimatedPercent, setDamageEstimatedPercent] = useState(70);
  const [uploadedImage, setUploadedImage] = useState<string | null>("https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop");
  const [claimGenerated, setClaimGenerated] = useState(false);

  const estimatedCompensation = Math.round((affectedAcres * sumInsuredPerAcre) * (damageEstimatedPercent / 100));

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(186,26,26,0.1)", border: "1px solid rgba(186,26,26,0.25)", marginBottom: 8 }}>
          <ShieldAlert size={13} color="#ba1a1a" />
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#ba1a1a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Breakthrough: Instant PMFBY Crop Loss Claim Estimator
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: "0 0 6px" }}>
          🛡️ AI Crop Crisis & Hailstorm Loss Assessment (PMFBY)
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Fast-track your Pradhan Mantri Fasal Bima Yojana insurance claim. Geo-tag field damage photos, calculate loss compensation, and generate a standardized claim dossier in seconds.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        
        {/* Left Column: Loss Incident Input */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 20, boxShadow: shadow(isDark, 1) }}>
          <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: "0 0 14px" }}>
            Crisis Event Details
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Calamity / Peril Type</label>
              <select value={perilType} onChange={e => setPerilType(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4 }}>
                <option>Hailstorm Damage (Lodging & Shatter)</option>
                <option>Unseasonal Heavy Rainfall / Inundation</option>
                <option>Severe Drought / Dry Spell</option>
                <option>Pest / Epidemic Outbreak</option>
              </select>
            </div>

            <div>
              <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Insured Crop</label>
              <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4 }}>
                <option>Tomato (Horticulture)</option>
                <option>Onion (Kharif/Rabi)</option>
                <option>Wheat (Rabi Foodgrain)</option>
                <option>Cotton (Commercial)</option>
                <option>Grapes (Perennial)</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Damaged Area (Acres)</label>
                <input type="number" min={0.5} max={50} step={0.5} value={affectedAcres} onChange={e => setAffectedAcres(+e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Sum Insured/Acre (₹)</label>
                <input type="number" step={5000} value={sumInsuredPerAcre} onChange={e => setSumInsuredPerAcre(+e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4, boxSizing: "border-box" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Estimated Damage Percentage</label>
                <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: "#ba1a1a" }}>{damageEstimatedPercent}% Crop Loss</span>
              </div>
              <input type="range" min={20} max={100} value={damageEstimatedPercent} onChange={e => setDamageEstimatedPercent(+e.target.value)} style={{ width: "100%", accentColor: "#ba1a1a" }} />
            </div>

            <button 
              onClick={() => setClaimGenerated(true)}
              style={{ width: "100%", padding: "12px", borderRadius: 8, background: "#ba1a1a", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <FileText size={15} />Generate PMFBY Claim Dossier →
            </button>
          </div>
        </div>

        {/* Right Column: Compensation & Claim Dossier Preview */}
        <div style={{ background: "linear-gradient(135deg, rgba(186,26,26,0.1) 0%, rgba(196,80,26,0.04) 100%)", border: "1.5px solid rgba(186,26,26,0.25)", borderRadius: 16, padding: 22, boxShadow: shadow(isDark, 1), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: "#ba1a1a", background: "rgba(186,26,26,0.15)", padding: "3px 10px", borderRadius: 4, textTransform: "uppercase" }}>
              Instant Loss Compensation Assessment
            </span>

            <h2 style={{ fontFamily: PJS, fontWeight: 900, fontSize: 26, color: "#ba1a1a", margin: "10px 0 2px" }}>
              ₹{estimatedCompensation.toLocaleString("en-IN")}
            </h2>
            <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 16px" }}>
              Estimated payout on <strong>{affectedAcres} acres of {crop}</strong> ({damageEstimatedPercent}% loss)
            </p>

            <div style={{ padding: "14px 16px", borderRadius: 12, background: d.card, border: `1px solid ${d.border}`, marginBottom: 16 }}>
              <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", margin: "0 0 6px" }}>Geo-Tagged Telemetry Evidence</p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "0 0 3px" }}>
                📍 Coordinates: <strong>19.9975° N, 73.7898° E (Nashik, MH)</strong>
              </p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "0 0 3px" }}>
                🌦️ Weather Satellite Stamp: <strong>Unseasonal hail recorded (42mm rain)</strong>
              </p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: "#456348", margin: 0, fontWeight: 700 }}>
                ✓ Pre-filled for PMFBY Portal / Agriculture Insurance Company (AIC)
              </p>
            </div>
          </div>

          <div>
            <button 
              onClick={() => alert("PMFBY Claim Dossier PDF downloaded successfully!")}
              style={{ width: "100%", padding: "12px", borderRadius: 8, background: "#456348", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            >
              <Download size={15} />Download Official Claim PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
