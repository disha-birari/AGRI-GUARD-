"use client";

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { CheckCircle, Clock, AlertTriangle, MessageSquare, User, Eye } from "lucide-react";
import { useTheme } from "@/lib/context";
import { EXPERT_QUEUE } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

export default function ExpertDashboard() {
  const { d, isDark } = useTheme();
  const [queue, setQueue] = useState(EXPERT_QUEUE);
  const [activeReview, setActiveReview] = useState<typeof EXPERT_QUEUE[0] | null>(null);
  const [response, setResponse] = useState("");

  const pending = queue.filter(q => q.status === "pending");
  const answered = queue.filter(q => q.status === "answered");

  const submitReview = () => {
    if (!activeReview || !response) return;
    setQueue(q => q.map(item => item.id === activeReview.id ? { ...item, status: "answered" } : item));
    setActiveReview(null);
    setResponse("");
  };

  const Card = ({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) => (
    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1), ...style }}>
      {children}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Expert Dashboard</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Review farmer scan submissions and answer queries.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Pending Review", val: pending.length,  icon: Clock,        col: "#c4501a" },
          { label: "Answered",       val: answered.length, icon: CheckCircle,  col: "#456348" },
          { label: "Total Queries",  val: queue.length,    icon: MessageSquare,col: "#436464" },
          { label: "Avg. Conf.",     val: "89%",           icon: AlertTriangle,col: "#8b5e3c" },
        ].map((s, i) => (
          <Card key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.col}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <s.icon size={17} color={s.col} />
            </div>
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: 0 }}>{s.val}</p>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>

        {/* Pending queue */}
        <Card>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>Pending Reviews ({pending.length})</p>
          {pending.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <CheckCircle size={28} color="#456348" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0 }}>All caught up! No pending reviews.</p>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pending.map(q => (
              <div key={q.id} style={{ padding: "14px 16px", borderRadius: 12, border: `1px solid rgba(196,80,26,0.25)`, background: "rgba(196,80,26,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(196,80,26,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={13} color="#c4501a" />
                    </div>
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: 0 }}>{q.farmer}</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{q.crop} · {q.date}</p>
                    </div>
                  </div>
                  <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: q.conf >= 90 ? "#456348" : "#c4501a", background: q.conf >= 90 ? "rgba(69,99,72,0.1)" : "rgba(196,80,26,0.1)", padding: "2px 8px", borderRadius: 999 }}>{q.conf}% AI conf.</span>
                </div>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 10px", lineHeight: 1.45 }}>"{q.query}"</p>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: "#c4501a", background: "rgba(196,80,26,0.1)", padding: "2px 8px", borderRadius: 999 }}>{q.disease}</span>
                  <button onClick={() => { setActiveReview(q); setResponse(""); }} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 7, background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 11, border: "none", cursor: "pointer" }}>
                    <Eye size={11} />Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Review panel or answered list */}
        {activeReview ? (
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>Review: {activeReview.farmer}</p>
              <button onClick={() => setActiveReview(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, fontFamily: MRP, fontSize: 12 }}>Cancel</button>
            </div>

            <div style={{ padding: "12px 14px", borderRadius: 10, background: isDark ? "rgba(255,248,245,0.04)" : d.bgMuted, border: `1px solid ${d.border}`, marginBottom: 14 }}>
              <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 12, color: d.textMuted, margin: "0 0 4px" }}>Farmer's Query</p>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.text, margin: 0 }}>"{activeReview.query}"</p>
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(196,80,26,0.06)", border: "1px solid rgba(196,80,26,0.2)", flex: 1 }}>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 2px" }}>AI Diagnosis</p>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: "#c4501a", margin: 0 }}>{activeReview.disease}</p>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: 10, background: activeReview.conf >= 90 ? "rgba(69,99,72,0.06)" : "rgba(196,80,26,0.06)", border: `1px solid ${activeReview.conf >= 90 ? "rgba(69,99,72,0.2)" : "rgba(196,80,26,0.2)"}`, flex: 1 }}>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 2px" }}>Confidence</p>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: activeReview.conf >= 90 ? "#456348" : "#c4501a", margin: 0 }}>{activeReview.conf}%</p>
              </div>
            </div>

            <label style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: d.textSub, display: "block", marginBottom: 8 }}>Your Expert Response</label>
            <textarea value={response} onChange={e => setResponse(e.target.value)} rows={5} placeholder="Write your diagnosis and treatment recommendation for the farmer…"
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${d.border}`, background: isDark ? "rgba(255,248,245,0.05)" : "#feeade", color: d.text, fontFamily: MRP, fontSize: 13, outline: "none", resize: "vertical", boxSizing: "border-box", lineHeight: 1.55 }}
              onFocus={e => (e.target.style.borderColor = "#436464")}
              onBlur={e => (e.target.style.borderColor = d.border)}
            />

            <button onClick={submitReview} disabled={!response.trim()} style={{ marginTop: 12, width: "100%", padding: 12, borderRadius: 8, background: response.trim() ? "#436464" : d.border, color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 14, border: "none", cursor: response.trim() ? "pointer" : "not-allowed" }}>
              Submit Response to Farmer
            </button>
          </Card>
        ) : (
          <Card>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Recent Answers ({answered.length})</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {answered.map(q => (
                <div key={q.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "rgba(69,99,72,0.05)", border: "1px solid rgba(69,99,72,0.15)" }}>
                  <CheckCircle size={16} color="#456348" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{q.farmer}</p>
                    <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{q.crop} · {q.disease} · {q.date}</p>
                  </div>
                  <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: "#456348", background: "rgba(69,99,72,0.1)", padding: "2px 9px", borderRadius: 999 }}>Answered</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
