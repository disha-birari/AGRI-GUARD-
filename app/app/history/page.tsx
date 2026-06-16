"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { Camera, Mic, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";
import { useTheme } from "@/lib/context";
import { SCANS, VOICE_LOGS } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

type Tab = "scans" | "voice" | "records";

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

export default function History() {
  const { d, isDark } = useTheme();
  const [tab, setTab] = useState<Tab>("scans");
  const [expanded, setExpanded] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: ElementType }[] = [
    { id: "scans",   label: "Scan History",  icon: Camera },
    { id: "voice",   label: "Voice Queries", icon: Mic },
    { id: "records", label: "Farm Records",  icon: CheckCircle },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>My History</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>All your scans, voice queries, and farm activity in one place.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, background: d.bgMuted, borderRadius: 12, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", background: tab === t.id ? d.card : "transparent", color: tab === t.id ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: tab === t.id ? shadow(isDark, 1) : "none", transition: "all 0.2s" }}>
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      {/* Scans */}
      {tab === "scans" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {SCANS.map(scan => {
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
                    <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Treatment logged · Follow-up scheduled in 7 days</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Voice */}
      {tab === "voice" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {VOICE_LOGS.map(log => (
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

      {/* Records */}
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
          <button style={{ padding: "12px", borderRadius: 10, border: `1.5px dashed ${d.border}`, background: "transparent", color: d.textMuted, fontFamily: PJS, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
            <AlertTriangle size={14} />Add Farm Record
          </button>
        </div>
      )}
    </div>
  );
}
