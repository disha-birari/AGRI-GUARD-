"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, User, Bot, Leaf } from "lucide-react";
import { useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

interface Msg { role: "user" | "bot"; text: string; time: string; }

const QUICK = [
  "Tomato leaves turning yellow?",
  "Best time to spray fungicide?",
  "How to treat Late Blight?",
  "Onion storage tips?",
  "When to harvest wheat?",
];

const BOT_REPLIES: Record<string, string> = {
  default: "I understand your concern. Based on your recent scans and current weather in Nashik, I recommend monitoring closely. Apply Mancozeb 2g/L spray after 4 PM today — rain clears by 3:30 PM. If symptoms worsen in 48 hours, please consult an expert through the Review section.",
  yellow: "Yellow leaves often indicate nitrogen deficiency or Early Blight. Check for spots: if present → apply Chlorothalonil 2g/L. If no spots → apply 19:19:19 NPK fertilizer at 5g/L. Avoid waterlogging. Ensure proper drainage.",
  spray: "Best spray window today: before 9 AM or after 5 PM. Wind speed is optimal (8–12 km/h). Avoid spraying tomorrow — heavy rain expected Tuesday afternoon. Next good window: Wednesday after 2 PM.",
  blight: "For Late Blight: 1) Remove and burn infected leaves immediately. 2) Apply Mancozeb 2g/L or Metalaxyl-M 2.5g/L. 3) Spray every 7 days. 4) Avoid overhead watering. Severity in your area is currently HIGH — act within 24 hours.",
  onion: "Store onions in a cool, dry, well-ventilated area at 25–30°C. Avoid moisture. Cure harvested onions in the field for 7–10 days before storing. Sort and remove damaged bulbs to prevent rotting.",
  wheat: "Wheat is ready to harvest when grain moisture drops to 14–16% and stalks turn golden yellow. Check: bite a grain — it should be hard and not doughy. Nashik region optimal window: usually February–March.",
};

function getReply(q: string): string {
  const l = q.toLowerCase();
  if (l.includes("yellow")) return BOT_REPLIES.yellow;
  if (l.includes("spray") || l.includes("fungicide")) return BOT_REPLIES.spray;
  if (l.includes("blight")) return BOT_REPLIES.blight;
  if (l.includes("onion")) return BOT_REPLIES.onion;
  if (l.includes("wheat") || l.includes("harvest")) return BOT_REPLIES.wheat;
  return BOT_REPLIES.default;
}

function now() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }

export default function AgriVoice() {
  const { d, isDark } = useTheme();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Namaste! I'm your Agri-Voice AI advisor. Ask me anything about your crops, diseases, weather timing, or market prices — in Hindi or English.", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lang, setLang] = useState("English");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: Msg = { role: "user", text, time: now() };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role: "bot", text: getReply(text), time: now() }]);
      setThinking(false);
    }, 1200 + Math.random() * 600);
  };

  const toggleRecord = () => {
    setRecording(r => !r);
    if (!recording) {
      // Simulate speech input after a short delay
      setTimeout(() => {
        send("Tomato leaves turning yellow, what should I do?");
        setRecording(false);
      }, 3000);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 150px)" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Agri-Voice Advisor</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Speak or type your farming problem. Available in 12 Indian languages.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16, flex: 1, minHeight: 0 }}>

        {/* Chat */}
        <div style={{ display: "flex", flexDirection: "column", background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, overflow: "hidden", boxShadow: shadow(isDark, 1), height: "100%" }}>
          {/* Header */}
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${d.border}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(67,100,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={18} color="#436464" />
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>AI Advisor</p>
              <p style={{ fontFamily: MRP, fontSize: 11, color: "#456348", margin: 0 }}>● Online · Powered by Llama-3</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
              {["EN","HI","TA"].map(l => (
                <button key={l} onClick={() => setLang(l === "EN" ? "English" : l === "HI" ? "Hindi" : "Tamil")}
                  style={{ padding: "3px 8px", borderRadius: 6, border: `1px solid ${lang.startsWith(l === "EN" ? "E" : l === "HI" ? "H" : "T") ? "#436464" : d.border}`, background: lang.startsWith(l === "EN" ? "E" : l === "HI" ? "H" : "T") ? "rgba(67,100,100,0.1)" : "transparent", color: lang.startsWith(l === "EN" ? "E" : l === "HI" ? "H" : "T") ? "#436464" : d.textMuted, fontFamily: MRP, fontWeight: 700, fontSize: 10, cursor: "pointer" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 8, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.role === "user" ? "#c4501a" : "rgba(67,100,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {m.role === "user" ? <User size={13} color="#fff" /> : <Leaf size={13} color="#436464" />}
                </div>
                <div style={{ maxWidth: "75%" }}>
                  <div style={{ padding: "10px 14px", borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px", background: m.role === "user" ? "#c4501a" : (isDark ? "rgba(255,248,245,0.06)" : d.bgMuted), border: m.role === "bot" ? `1px solid ${d.border}` : "none" }}>
                    <p style={{ fontFamily: MRP, fontSize: 13, color: m.role === "user" ? "#fff" : d.text, margin: 0, lineHeight: 1.55 }}>{m.text}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                    <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted }}>{m.time}</span>
                    {m.role === "bot" && (
                      <button style={{ background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, padding: 0, display: "flex" }}>
                        <Volume2 size={11} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {thinking && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(67,100,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><Leaf size={13} color="#436464" /></div>
                <div style={{ padding: "12px 16px", borderRadius: "4px 14px 14px 14px", background: isDark ? "rgba(255,248,245,0.06)" : d.bgMuted, border: `1px solid ${d.border}` }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#436464", animation: `bounce 1s ${i*0.2}s infinite` }}/>)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 14px", borderTop: `1px solid ${d.border}` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Mic button */}
              <button onClick={toggleRecord} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: recording ? "#ba1a1a" : "rgba(196,80,26,0.1)", transition: "all 0.2s", boxShadow: recording ? "0 0 0 4px rgba(186,26,26,0.2)" : "none" }}>
                {recording ? <MicOff size={17} color="#fff" /> : <Mic size={17} color="#c4501a" />}
              </button>

              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
                placeholder="Type or speak your question…"
                style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${d.border}`, background: isDark ? "rgba(255,248,245,0.05)" : d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, outline: "none" }}
                onFocus={e => (e.target.style.borderColor = "#436464")}
                onBlur={e => (e.target.style.borderColor = d.border)}
              />

              <button onClick={() => send(input)} disabled={!input.trim() || thinking}
                style={{ width: 42, height: 42, borderRadius: "50%", border: "none", cursor: !input.trim() ? "not-allowed" : "pointer", background: input.trim() && !thinking ? "#436464" : d.border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                <Send size={16} color="#fff" />
              </button>
            </div>
            {recording && (
              <p style={{ fontFamily: MRP, fontSize: 11, color: "#ba1a1a", textAlign: "center", margin: "8px 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ba1a1a", display: "inline-block", animation: "pulse 1s infinite" }}/>
                Listening… Click mic to stop or wait for simulation response.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar: quick questions + info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 18, boxShadow: shadow(isDark, 1) }}>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>Quick Questions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {QUICK.map((q, i) => (
                <button key={i} onClick={() => send(q)} style={{ padding: "10px 14px", borderRadius: 9, border: `1px solid ${d.border}`, background: "transparent", color: d.textSub, fontFamily: MRP, fontWeight: 600, fontSize: 13, cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#436464"; e.currentTarget.style.color = "#436464"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = d.border; e.currentTarget.style.color = d.textSub; }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "rgba(67,100,100,0.06)", border: "1px solid rgba(67,100,100,0.2)", borderRadius: 14, padding: 18 }}>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#436464", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Safety Note</p>
            <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0, lineHeight: 1.55 }}>
              Agri-Voice only provides agricultural advice. It will not respond to non-farming questions. All advice is based on your farm location and recent scan history. Consult a certified agronomist for critical decisions.
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>
    </div>
  );
}
