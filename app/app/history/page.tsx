"use client";

import { useState, useEffect } from "react";
import type { ElementType } from "react";
import { Camera, Mic, CheckCircle, Clock, AlertTriangle, ExternalLink, Award, TrendingUp, Sprout, FlaskConical, Download } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";
import { SEASON_REPORT } from "@/lib/data";

type Tab = "scans" | "voice" | "records" | "season";

const STATUS_STYLE: Record<string, [string,string]> = {
  treated:    ["#456348","rgba(69,99,72,0.12)"],
  consulting: ["#c4501a","rgba(196,80,26,0.12)"],
  healthy:    ["#436464","rgba(67,100,100,0.12)"],
};

const FARM_RECORDS = [
  { id: "r1", type: "Fertilizer", note: "Applied 19:19:19 NPK — 5kg/acre on Tomato field", date: "Jan 12, 2024" },
  { id: "r2", type: "Irrigation", note: "Drip irrigation set to 45 min/day — moisture optimal", date: "Jan 10, 2024" },
  { id: "r3", type: "Treatment",  note: "Mancozeb 2g/L applied across 3 acres after Late Blight diagnosis", date: "Jan 8, 2024" },
  { id: "r4", type: "Harvest",    note: "Partial onion harvest — 800 kg sold at Azadpur ₹2,840/qtl", date: "Dec 28, 2023" },
  { id: "r5", type: "Planting",   note: "Sown 2 acres wheat — Sharbati variety, recommended spacing", date: "Dec 10, 2023" },
];

export default function HistoryAndSeasonReport() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("scans");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [scans, setScans] = useState<any[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const fetchedScans = await db.getScans(user?.id);
        const fetchedVoice = await db.getVoiceLogs(user?.id);
        if (active) {
          setScans(fetchedScans);
          setVoiceLogs(fetchedVoice);
        }
      } catch (err) {
        console.error("Failed to load history lists", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, [user?.id]);

  const tabs: { id: Tab; label: string; icon: ElementType }[] = [
    { id: "scans",   label: "Scan History",   icon: Camera },
    { id: "season",  label: "Season Report",  icon: Award },
    { id: "voice",   label: "Voice Queries",  icon: Mic },
    { id: "records", label: "Farm Records",   icon: CheckCircle },
  ];

  return (
    <div>
      {/* Flow Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(69,99,72,0.08)", border: "1px solid rgba(69,99,72,0.2)", marginBottom: 8 }}>
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#456348", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flow: Save to History → Season Report
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>
          Farm History & Season Report
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          All your saved leaf diagnoses, AI voice consultations, and comprehensive seasonal profitability reports.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: d.bgMuted, borderRadius: 12, padding: 4, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, minWidth: 120, padding: "9px 12px", borderRadius: 9, border: "none", background: tab === t.id ? d.card : "transparent", color: tab === t.id ? (t.id === "season" ? "#c4501a" : d.text) : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: tab === t.id ? shadow(isDark, 1) : "none", transition: "all 0.2s" }}>
            <t.icon size={15} color={tab === t.id && t.id === "season" ? "#c4501a" : undefined} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── SEASON REPORT (Flowchart node: Save to History -> Season Report) ── */}
      {tab === "season" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Season Highlights Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(196,80,26,0.12) 0%, rgba(69,99,72,0.1) 100%)", 
            border: "1.5px solid rgba(196,80,26,0.25)", 
            borderRadius: 16, 
            padding: 22, 
            boxShadow: shadow(isDark, 1) 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: "#c4501a", background: "rgba(196,80,26,0.15)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Active Season Analytics
                </span>
                <h2 style={{ fontFamily: PJS, fontWeight: 900, fontSize: 22, color: d.text, margin: "6px 0 2px" }}>
                  {SEASON_REPORT.seasonName} · Performance Summary
                </h2>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0 }}>
                  Farmer: <strong>{user?.name || "Ramesh Kumar"}</strong> · Village: <strong>{user?.village || "Igatpuri"}, {user?.district || "Nashik"}</strong>
                </p>
              </div>

              <button onClick={() => alert("Season Report PDF Generated!")} style={{ padding: "8px 16px", borderRadius: 8, background: "#c4501a", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={14} />Export Report PDF
              </button>
            </div>

            {/* Metric KPI Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
              {[
                { label: "Net Profit Gain", val: `+₹${SEASON_REPORT.netFinancialGainINR.toLocaleString("en-IN")}`, desc: "Via best mandi pricing", col: "#456348" },
                { label: "Crop Saved", val: `${SEASON_REPORT.estimatedYieldSavedKg} kg`, desc: "Yield loss prevented", col: "#c4501a" },
                { label: "Healthy Scans", val: `${SEASON_REPORT.healthyPercent}%`, desc: `${SEASON_REPORT.totalScans} Total leaf scans`, col: "#436464" },
                { label: "Diseases Stopped", val: `${SEASON_REPORT.diseasesPrevented}`, desc: "Early stage treatments", col: "#8b5e3c" },
              ].map((kpi, idx) => (
                <div key={idx} style={{ padding: "12px 14px", borderRadius: 12, background: d.card, border: `1px solid ${d.border}` }}>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 2px" }}>{kpi.label}</p>
                  <p style={{ fontFamily: PJS, fontWeight: 900, fontSize: 20, color: kpi.col, margin: "0 0 2px" }}>{kpi.val}</p>
                  <p style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, margin: 0 }}>{kpi.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Distribution & Timeline */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {/* Organic vs Chemical Distribution */}
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1) }}>
              <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
                Treatment Methodology Distribution
              </p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: "#456348", display: "flex", alignItems: "center", gap: 4 }}>
                      <Sprout size={14} />Organic Remedies
                    </span>
                    <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#456348" }}>68%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                    <div style={{ width: "68%", height: "100%", background: "#456348", borderRadius: 999 }} />
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: "#c4501a", display: "flex", alignItems: "center", gap: 4 }}>
                      <FlaskConical size={14} />Chemical Pesticides
                    </span>
                    <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#c4501a" }}>32%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                    <div style={{ width: "32%", height: "100%", background: "#c4501a", borderRadius: 999 }} />
                  </div>
                </div>
              </div>

              <div style={{ padding: "10px 12px", borderRadius: 8, background: "rgba(69,99,72,0.08)", border: "1px solid rgba(69,99,72,0.2)" }}>
                <p style={{ fontFamily: MRP, fontSize: 12, color: "#456348", margin: 0 }}>
                  🌱 <strong>Eco-Friendly Badge:</strong> You used 68% organic bio-inputs this season, saving an estimated ₹6,800 in synthetic pesticide costs.
                </p>
              </div>
            </div>

            {/* Season Timeline Milestones */}
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1) }}>
              <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>
                Season Milestones Achieved
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {SEASON_REPORT.milestones.map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.status === "profit" ? "rgba(196,80,26,0.15)" : "rgba(69,99,72,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {m.status === "profit" ? <TrendingUp size={14} color="#c4501a" /> : <CheckCircle size={14} color="#456348" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: 0 }}>{m.title}</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scans Tab */}
      {tab === "scans" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {scans.map(scan => {
            const [col, bg] = STATUS_STYLE[scan.status] ?? ["#8b7168","rgba(139,113,104,0.1)"];
            const isExp = expanded === scan.id;
            return (
              <div key={scan.id} style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden", boxShadow: shadow(isDark, 1) }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 18px", cursor: "pointer" }} onClick={() => setExpanded(isExp ? null : scan.id)}>
                  <img src={`https://images.unsplash.com/photo-${scan.img}?w=64&h=64&fit=crop&auto=format`} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>{scan.disease}</p>
                      <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: col, background: bg, padding: "3px 10px", borderRadius: 999 }}>{scan.status}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{scan.crop}</p>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: d.textMuted }} />
                      <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{scan.date}</p>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: d.textMuted }} />
                      <p style={{ fontFamily: MRP, fontSize: 12, color: scan.confidence >= 90 ? "#456348" : "#c4501a", margin: 0, fontWeight: 700 }}>{scan.confidence}% conf.</p>
                    </div>
                  </div>
                  <ExternalLink size={14} color={d.textMuted} />
                </div>
                {isExp && (
                  <div style={{ padding: "12px 18px 16px", borderTop: `1px solid ${d.border}`, background: isDark ? "rgba(255,248,245,0.02)" : d.bgAlt }}>
                    <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Details</p>
                    <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 10px" }}>Severity: <strong>{scan.severity}</strong> · AI Confidence: <strong style={{ color: scan.confidence >= 90 ? "#456348" : "#c4501a" }}>{scan.confidence}%</strong></p>
                    <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Treatment logged · Synced to Season Report</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Voice Tab */}
      {tab === "voice" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {voiceLogs.map(log => (
            <div key={log.id} style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 18, boxShadow: shadow(isDark, 1) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(67,100,100,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mic size={14} color="#436464" />
                  </div>
                  <div>
                    <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{log.query}</p>
                    <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{log.date} · {log.lang}</p>
                  </div>
                </div>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: 10, background: isDark ? "rgba(255,248,245,0.04)" : d.bgMuted, border: `1px solid ${d.border}` }}>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0, lineHeight: 1.55 }}>{log.response}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Farm Records Tab */}
      {tab === "records" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FARM_RECORDS.map(r => {
            const typeColors: Record<string, string> = { Fertilizer:"#436464", Irrigation:"#456348", Treatment:"#c4501a", Harvest:"#8b5e3c", Planting:"#456348" };
            const col = typeColors[r.type] ?? "#8b7168";
            return (
              <div key={r.id} style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start", boxShadow: shadow(isDark, 1) }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${col}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={16} color={col} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: col, background: `${col}12`, padding: "2px 9px", borderRadius: 999 }}>{r.type}</span>
                    <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>{r.date}</span>
                  </div>
                  <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0, lineHeight: 1.5 }}>{r.note}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

