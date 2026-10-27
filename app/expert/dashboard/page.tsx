"use client";

import { useState, useEffect } from "react";
import type { ReactNode, CSSProperties } from "react";
import { CheckCircle, Clock, AlertTriangle, MessageSquare, User, Eye } from "lucide-react";
import { useTheme } from "@/lib/context";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";

function Card({ children, style = {}, d, isDark }: { children: ReactNode; style?: CSSProperties; d: any; isDark: boolean }) {
  return (
    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1), ...style }}>
      {children}
    </div>
  );
}

export default function ExpertDashboard() {
  const { d, isDark } = useTheme();
  const [queue, setQueue] = useState<any[]>([]);
  const [activeReview, setActiveReview] = useState<any | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"reviews" | "chats">("reviews");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [expertMsg, setExpertMsg] = useState("");

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const data = await db.getExpertQueue();
        if (active) setQueue(data);
      } catch (err) {
        console.error("Failed to load expert review queue", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, []);

  const pending = queue.filter(q => q.status === "pending");
  const answered = queue.filter(q => q.status === "answered");

  // Poll chat messages every 2 seconds when chat tab is active
  useEffect(() => {
    if (tab !== "chats") return;

    let active = true;
    async function fetchChats() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const json = await res.json();
          if (active) setChatMessages(json.messages || []);
        }
      } catch (err) {
        console.error("Failed to load expert chats", err);
      }
    }
    fetchChats();
    const interval = setInterval(fetchChats, 2000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [tab]);

  const sendExpertMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expertMsg.trim()) return;

    const textToSend = expertMsg;
    setExpertMsg("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "expert",
          senderName: "Dr. Priya Sharma",
          text: textToSend
        })
      });
      if (res.ok) {
        const fetchRes = await fetch("/api/chat");
        if (fetchRes.ok) {
          const json = await fetchRes.json();
          setChatMessages(json.messages || []);
        }
      }
    } catch (err) {
      console.error("Failed to send expert message", err);
    }
  };

  const submitReview = async () => {
    if (!activeReview || !response) return;
    setQueue(q => q.map(item => item.id === activeReview.id ? { ...item, status: "answered" } : item));

    try {
      await db.createExpertQuery({
        farmer_name: activeReview.farmer_name || activeReview.farmer || "Farmer",
        crop: activeReview.crop,
        disease: activeReview.disease,
        conf: activeReview.conf,
        query: activeReview.query,
        status: "answered"
      });
    } catch (e) {
      console.error(e);
    }

    setActiveReview(null);
    setResponse("");
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Expert Dashboard</h1>
          <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Review farmer scan submissions and answer queries.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: "flex", gap: 6, background: d.bgMuted, borderRadius: 10, padding: 4 }}>
          <button 
            onClick={() => setTab("reviews")} 
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: tab === "reviews" ? d.card : "transparent", color: tab === "reviews" ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            Review Queue ({pending.length})
          </button>
          <button 
            onClick={() => setTab("chats")} 
            style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: tab === "chats" ? d.card : "transparent", color: tab === "chats" ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            Live Farmer Chat <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c4501a" }} />
          </button>
        </div>
      </div>

      {tab === "reviews" ? (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Pending Review", val: pending.length,  icon: Clock,        col: "#c4501a" },
              { label: "Answered",       val: answered.length, icon: CheckCircle,  col: "#456348" },
              { label: "Total Queries",  val: queue.length,    icon: MessageSquare,col: "#436464" },
              { label: "Avg. Conf.",     val: "89%",           icon: AlertTriangle,col: "#8b5e3c" },
            ].map((s, i) => (
              <Card key={i} d={d} isDark={isDark} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
            <Card d={d} isDark={isDark}>
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
                          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: 0 }}>{q.farmer_name || q.farmer}</p>
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
              <Card d={d} isDark={isDark}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>Review: {activeReview.farmer_name || activeReview.farmer}</p>
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
              <Card d={d} isDark={isDark}>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Recent Answers ({answered.length})</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {answered.map(q => (
                    <div key={q.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 14px", borderRadius: 10, background: "rgba(69,99,72,0.05)", border: "1px solid rgba(69,99,72,0.15)" }}>
                      <CheckCircle size={16} color="#456348" style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{q.farmer_name || q.farmer}</p>
                        <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{q.crop} · {q.disease} · {q.date}</p>
                      </div>
                      <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: "#456348", background: "rgba(69,99,72,0.1)", padding: "2px 9px", borderRadius: 999 }}>Answered</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </>
      ) : (
        /* Live consultations Chat Dashboard */
        <div style={{ display: "grid", gridTemplateColumns: "1fr", lgGridTemplateColumns: "240px 1fr" } as any} className="grid lg:grid-cols-[240px_1fr] gap-4 min-h-[460px]">
          {/* Farmer lists sidebar */}
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Active Discussions</p>
            <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.25)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PJS, fontWeight: 800, fontSize: 11, color: "#fff" }}>RK</div>
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: 0 }}>Ramesh Kumar</p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: "#456348", margin: 0, fontWeight: 700 }}>Active consult</p>
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "12px 18px", borderBottom: `1px solid ${d.border}`, background: d.bgAlt, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: d.text, margin: 0 }}>Ramesh Kumar (Farmer)</p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Plot: Igatpuri, Nashik · Rabi Crop Case</p>
              </div>
              <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#456348", background: "rgba(69,99,72,0.1)", padding: "3px 10px", borderRadius: 6 }}>Verifying</span>
            </div>

            {/* Chat Board */}
            <div style={{ flex: 1, padding: "16px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, minHeight: 320, background: isDark ? "rgba(0,0,0,0.12)" : "rgba(255,248,245,0.4)" }}>
              {chatMessages.map(m => {
                const isExpert = m.sender === "expert";
                return (
                  <div key={m.id} style={{ alignSelf: isExpert ? "flex-end" : "flex-start", maxWidth: "80%", display: "flex", flexDirection: "column", alignItems: isExpert ? "flex-end" : "flex-start" }}>
                    <div style={{ background: isExpert ? "#436464" : d.bgAlt, color: isExpert ? "#fff" : d.text, border: isExpert ? "none" : `1px solid ${d.border}`, padding: "8px 12px", borderRadius: isExpert ? "12px 12px 2px 12px" : "12px 12px 12px 2px", boxShadow: shadow(isDark, 1) }}>
                      {m.crop && (
                        <p style={{ fontFamily: MRP, fontWeight: 800, fontSize: 9, margin: "0 0 4px", color: isExpert ? "#fff" : "#c4501a" }}>🌾 Context: {m.crop} ({m.disease})</p>
                      )}
                      <p style={{ fontFamily: MRP, fontSize: 12, margin: 0, lineHeight: 1.45 }}>{m.text}</p>
                    </div>
                    <span style={{ fontFamily: MRP, fontSize: 9, color: d.textMuted, marginTop: 2 }}>{m.senderName} · {m.timestamp}</span>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={sendExpertMessage} style={{ padding: 12, borderTop: `1px solid ${d.border}`, display: "flex", gap: 8, background: d.bgAlt }}>
              <input 
                type="text" 
                value={expertMsg} 
                onChange={e => setExpertMsg(e.target.value)} 
                placeholder="Write your professional expert response to Ramesh Kumar..." 
                style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.card, color: d.text, fontFamily: MRP, fontSize: 12, outline: "none" }} 
              />
              <button type="submit" disabled={!expertMsg.trim()} style={{ padding: "8px 16px", borderRadius: 8, background: expertMsg.trim() ? "#436464" : d.border, color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: expertMsg.trim() ? "pointer" : "not-allowed" }}>
                Send Reply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
