"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Users, Send, Phone, ShieldCheck, Sparkles, MessageSquare, 
  Sprout, Paperclip, ChevronRight, Mic, AlertCircle, Bot
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";
import { db } from "@/lib/db";

export default function ConsultationPage() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New Consult Form Context
  const [crop, setCrop] = useState("Tomato");
  const [disease, setDisease] = useState("Late Blight");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const json = await res.json();
        setMessages(json.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch chat messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll chat messages every 2 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const messageText = text;
    setText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "farmer",
          senderName: user?.name || "Ramesh Kumar",
          text: messageText,
          crop: crop,
          disease: disease
        })
      });
      
      if (res.ok) {
        await fetchMessages();
        
        // Trigger automated Expert Typing & Response simulator
        simulateExpertResponse(messageText);
      }
    } catch (err) {
      console.error("Send error", err);
    }
  };

  // Simulated fallback expert responses based on keywords in farmer's queries
  const simulateExpertResponse = (farmerQuery: string) => {
    setIsTyping(true);
    
    setTimeout(async () => {
      let replyText = "Thank you for the update. I am reviewing the details of your crop scan. Please ensure you keep soil moisture balanced.";
      const queryLower = farmerQuery.toLowerCase();
      
      if (queryLower.includes("yellow") || queryLower.includes("blight") || queryLower.includes("tomato")) {
        replyText = "For tomato leaf yellowing and blight concerns, apply a foliar spray of Trichoderma viride bio-fungicide (5g/L water) or Mancozeb (2g/L) immediately. Prune old lower leaves to prevent splash infection.";
      } else if (queryLower.includes("onion") || queryLower.includes("mildew") || queryLower.includes("blotch")) {
        replyText = "In onion crops, high morning dew causes Powdery Mildew and Purple Blotch. Apply Wettable Sulfur (3g/L) during cool morning hours, and stop all nitrogen fertilizers 3 weeks before harvest.";
      } else if (queryLower.includes("rust") || queryLower.includes("wheat")) {
        replyText = "Yellow Rust on wheat spreads fast via wind. If streaks are visible, spray Propiconazole 25% EC (1ml/L) immediately on affected rows and borders to contain spores.";
      } else if (queryLower.includes("fertilizer") || queryLower.includes("spray") || queryLower.includes("npk")) {
        replyText = "Generally, alternate organic neem spray with 19:19:19 NPK (4g/L) for vegetative boost. Avoid spraying if wind is high or if rain is expected within 6 hours.";
      } else if (queryLower.includes("thank") || queryLower.includes("okay") || queryLower.includes("thanks")) {
        replyText = "Glad to help! Keep scouting your plots twice a week. Let me know if you see any new leaf anomalies. Ram Ram!";
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: "expert",
            senderName: "Dr. Priya Sharma",
            text: replyText
          })
        });
        if (res.ok) {
          await fetchMessages();
        }
      } catch (err) {
        console.error("Expert simulation response failed", err);
      } finally {
        setIsTyping(false);
      }
    }, 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header Banner */}
      <div style={{ marginBottom: 16, flexShrink: 0 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", marginBottom: 6 }}>
          <Sparkles size={12} color="#c4501a" />
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#c4501a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Real-Time Collaboration Portal
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: 0 }}>
          Expert Consult — Dr. Priya Sharma
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: "2px 0 0" }}>
          Live messaging & voice ledger consultation with certified agriculture pathologists.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", lgGridTemplateColumns: "260px 1fr" } as any} className="grid lg:grid-cols-[260px_1fr] gap-4 flex-1 min-h-0">
        
        {/* Left Panel: Active Crop Case Info */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 14, boxShadow: shadow(isDark, 1), overflowY: "auto" }}>
          <div>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>
              Active Consultation Case
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 12, borderRadius: 10, background: d.bgAlt, border: `1.5px solid ${d.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(196,80,26,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sprout size={16} color="#c4501a" />
              </div>
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: d.text, margin: 0 }}>Case Reference</p>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Host: {crop}</p>
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: d.textSub }}>Select Case Crop</label>
            <select value={crop} onChange={e => setCrop(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4 }}>
              <option>Tomato</option>
              <option>Onion</option>
              <option>Wheat</option>
              <option>Chilli</option>
            </select>
          </div>

          <div>
            <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: d.textSub }}>Suspected Disease</label>
            <select value={disease} onChange={e => setDisease(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4 }}>
              <option>Late Blight</option>
              <option>Early Blight</option>
              <option>Powdery Mildew</option>
              <option>Yellow Rust</option>
              <option>Healthy / Nutrients</option>
            </select>
          </div>

          <div style={{ marginTop: "auto", padding: 12, borderRadius: 10, background: "rgba(67,100,100,0.06)", border: "1px dashed rgba(67,100,100,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <ShieldCheck size={14} color="#436464" />
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12, color: "#436464", margin: 0 }}> Krishi-Verified</p>
            </div>
            <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0, lineHeight: 1.4 }}>
              Chat is audited under KVK guidelines. Answers comply with Central Insecticide Board directives.
            </p>
          </div>
        </div>

        {/* Right Panel: Chat Messenger */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: shadow(isDark, 1) }}>
          
          {/* Chat Header */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${d.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: d.bgAlt }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#436464", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#fff" }}>
                  PS
                </div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 9, height: 9, borderRadius: "50%", background: "#456348", border: `2px solid ${d.card}` }} />
              </div>
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: d.text, margin: 0 }}>Dr. Priya Sharma</p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: "#456348", fontWeight: 700, margin: 0 }}>
                  ● Chief Agricultural Expert (Online)
                </p>
              </div>
            </div>
            <button 
              onClick={() => window.open("tel:+918765432109")} 
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "rgba(69,99,72,0.1)", border: "1px solid rgba(69,99,72,0.25)", color: "#456348", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
            >
              <Phone size={13} />Call Krishi Helpline
            </button>
          </div>

          {/* Messages Feed */}
          <div 
            ref={scrollRef}
            style={{ flex: 1, padding: "20px 20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, background: isDark ? "rgba(0,0,0,0.12)" : "rgba(255,248,245,0.4)" }}
          >
            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 40, fontFamily: MRP, color: d.textMuted }}>
                Loading consultation logs...
              </div>
            ) : (
              messages.map((m) => {
                const isFarmer = m.sender === "farmer";
                return (
                  <div 
                    key={m.id} 
                    style={{ 
                      alignSelf: isFarmer ? "flex-end" : "flex-start",
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isFarmer ? "flex-end" : "flex-start"
                    }}
                  >
                    {/* Bubble */}
                    <div style={{ 
                      background: isFarmer ? "#c4501a" : d.bgAlt, 
                      color: isFarmer ? "#fff" : d.text, 
                      border: isFarmer ? "none" : `1px solid ${d.border}`,
                      padding: "10px 14px", 
                      borderRadius: isFarmer ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                      boxShadow: shadow(isDark, 1)
                    }}>
                      {/* Attached Crop Context badge (if present) */}
                      {m.crop && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 6px", borderRadius: 4, background: isFarmer ? "rgba(255,255,255,0.18)" : "rgba(196,80,26,0.1)", color: isFarmer ? "#fff" : "#c4501a", fontFamily: MRP, fontWeight: 800, fontSize: 9, marginBottom: 6, width: "fit-content" }}>
                          <Sprout size={9} /> Host: {m.crop} ({m.disease})
                        </div>
                      )}
                      <p style={{ fontFamily: MRP, fontSize: 13, margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                        {m.text}
                      </p>
                    </div>
                    {/* Timestamp */}
                    <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, marginTop: 4, padding: "0 4px" }}>
                      {m.senderName} · {m.timestamp}
                    </span>
                  </div>
                );
              })
            )}

            {/* Live Typing Simulator */}
            {isTyping && (
              <div style={{ alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ background: d.bgAlt, border: `1px solid ${d.border}`, padding: "10px 18px", borderRadius: "14px 14px 14px 2px", display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.textMuted, animation: "bounce 1s infinite alternate" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.textMuted, animation: "bounce 1s infinite alternate 0.2s" }} />
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: d.textMuted, animation: "bounce 1s infinite alternate 0.4s" }} />
                </div>
                <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, paddingLeft: 4 }}>Dr. Priya is typing advice...</span>
              </div>
            )}
          </div>

          {/* Chat Send Form */}
          <form 
            onSubmit={handleSendMessage}
            style={{ padding: 14, borderTop: `1px solid ${d.border}`, display: "flex", gap: 10, alignItems: "center", background: d.bgAlt }}
          >
            <button type="button" title="Attach scan" style={{ background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, padding: 4 }}>
              <Paperclip size={18} />
            </button>
            
            <input 
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Ask Dr. Priya about crop symptoms, dosage instructions..."
              style={{ 
                flex: 1, 
                padding: "10px 14px", 
                borderRadius: 10, 
                border: `1.5px solid ${d.border}`, 
                background: d.card, 
                color: d.text, 
                fontFamily: MRP, 
                fontSize: 13, 
                outline: "none" 
              }}
              onFocus={e => e.currentTarget.style.borderColor = "#c4501a"}
              onBlur={e => e.currentTarget.style.borderColor = d.border}
            />

            <button 
              type="submit"
              disabled={!text.trim()}
              style={{ 
                padding: "10px 18px", 
                borderRadius: 10, 
                background: text.trim() ? "#c4501a" : d.border, 
                color: "#fff", 
                border: "none", 
                fontFamily: PJS, 
                fontWeight: 800, 
                fontSize: 13, 
                cursor: text.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              Send <Send size={13} />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
