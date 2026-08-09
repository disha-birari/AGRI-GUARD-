"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, User, Bot, Sparkles, Globe, VolumeX } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";

interface Msg { 
  role: "user" | "bot"; 
  text: string; 
  time: string; 
  source?: string;
  tokensSaved?: boolean;
}

const INDIAN_LANGUAGES = [
  { label: "मराठी (Marathi)", code: "mr-IN", name: "Marathi" },
  { label: "हिंदी (Hindi)", code: "hi-IN", name: "Hindi" },
  { label: "English (India)", code: "en-IN", name: "English" },
  { label: "தமிழ் (Tamil)", code: "ta-IN", name: "Tamil" },
  { label: "తెలుగు (Telugu)", code: "te-IN", name: "Telugu" },
  { label: "ಕನ್ನಡ (Kannada)", code: "kn-IN", name: "Kannada" },
  { label: "ગુજરાતી (Gujarati)", code: "gu-IN", name: "Gujarati" },
  { label: "বাংলা (Bengali)", code: "bn-IN", name: "Bengali" },
  { label: "ਪੰਜਾਬੀ (Punjabi)", code: "pa-IN", name: "Punjabi" },
];

const REGIONAL_QUICK_QUESTIONS: Record<string, string[]> = {
  Marathi: [
    "कांद्यावरील करप्यावर कोणती फवारणी करावी?",
    "टोमॅटोची पाने पिवळी पडत आहेत, काय उपाय आहे?",
    "आज कीटकनाशक फवारणीसाठी योग्य वेळ कोणती?",
    "सोयाबीन पिकातील मावा व तुडतुडे नियंत्रणासाठी काय करावे?",
    "कांदा साठवणुकीसाठी काय काळजी घ्यावी?",
  ],
  Hindi: [
    "टमाटर की पत्तियां पीली क्यों हो रही हैं?",
    "कीटनाशक छिड़काव के लिए आज सही समय क्या है?",
    "गेहूं में पीला रतुआ का इलाज कैसे करें?",
    "प्याज भंडारण के लिए क्या सावधानियां बरतें?",
    "फसल में दीमक की रोकथाम कैसे करें?",
  ],
  English: [
    "Tomato leaves turning yellow, what is the remedy?",
    "What is the best time to spray fungicide today?",
    "How to treat Late Blight on vegetables?",
    "Onion storage & shelf life preservation tips?",
    "How to control aphids and thrips organically?",
  ],
  Tamil: [
    "தக்காளி இலைகள் மஞ்சள் நிறமாக மாறுகிறது, என்ன தீர்வு?",
    "இன்று மருந்து தெளிக்க சிறந்த நேரம் எது?",
    "வெங்காய சேமிப்பு முறைகள் என்ன?",
  ]
};

function now() { 
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); 
}

export default function AgriVoicePage() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  
  const [selectedLang, setSelectedLang] = useState<string>("Marathi");
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [recording, setRecording] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "bot",
      text: "नमस्कार शेतकरी मित्र! मी तुमचा 'Agri-Voice' कृषी सल्लागार आहे. तुम्ही मराठी, हिंदी किंवा कोणत्याही भारतीय भाषेत बोलून अथवा लिहून शेतीविषयक प्रश्न विचारू शकता.",
      time: now()
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs, thinking]);

  // Handle Speech Synthesis
  const speakText = (text: string, langName: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const langObj = INDIAN_LANGUAGES.find(l => l.name === langName) || INDIAN_LANGUAGES[0];
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langObj.code;
    utterance.rate = 0.95; // Clear natural cadence

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeak = (text: string, index: number) => {
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      speakText(text, selectedLang);
    }
  };

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || thinking) return;

    const userMsg: Msg = { role: "user", text: queryText, time: now() };
    setMsgs(prev => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: queryText,
          language: selectedLang,
          location: `${user?.village || "Nashik"}, ${user?.district || "Maharashtra"}`,
          cropContext: user?.crops?.join(", ") || "Tomato, Onion, Wheat"
        })
      });

      let replyText = "";
      let source = "local_icar_rag";
      let tokensSaved = true;

      if (res.ok) {
        const json = await res.json();
        replyText = json.response;
        source = json.source || "local_icar_rag";
        tokensSaved = json.tokensSaved !== false;
      } else {
        throw new Error("Voice API response error");
      }

      const botMsg: Msg = { role: "bot", text: replyText, time: now(), source, tokensSaved };
      setMsgs(prev => {
        const updated = [...prev, botMsg];
        const newIdx = updated.length - 1;
        setSpeakingIndex(newIdx);
        speakText(replyText, selectedLang);
        return updated;
      });

      // Save to Supabase
      try {
        await db.createVoiceLog({
          user_id: user?.id || null,
          query: queryText,
          response: replyText,
          lang: selectedLang
        });
      } catch (e) {
        console.error("Failed to log voice consultation", e);
      }
    } catch (err) {
      console.warn("Agri-voice fallback triggered", err);
      const fallback = selectedLang === "Marathi"
        ? "पानांवर डाग किंवा करपा आढळल्यास मॅनकोझेब (२ ग्रॅम/लिटर) फवारावे. पाऊस येण्यापूर्वी औषध फवारणी करू नये."
        : "पत्तियों पर धब्बे दिखने पर मैंकोजेब (2g/L) का छिड़काव करें। बारिश से पहले दवा न डालें।";

      const botMsg: Msg = { role: "bot", text: fallback, time: now() };
      setMsgs(prev => [...prev, botMsg]);
    } finally {
      setThinking(false);
    }
  };

  // Speech Recognition (Microphone)
  const startRecording = () => {
    if (typeof window === "undefined") return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type your query in the box.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    const langObj = INDIAN_LANGUAGES.find(l => l.name === selectedLang) || INDIAN_LANGUAGES[0];
    recognition.lang = langObj.code;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setRecording(true);
    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        sendQuery(transcript);
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  const quickQuestions = REGIONAL_QUICK_QUESTIONS[selectedLang] || REGIONAL_QUICK_QUESTIONS.Marathi;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: "rgba(67,100,100,0.1)", border: "1px solid rgba(67,100,100,0.25)", marginBottom: 4 }}>
            <Sparkles size={12} color="#436464" />
            <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#436464", textTransform: "uppercase" }}>
              Multilingual Indian Agri-LLM
            </span>
          </div>
          <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 2px" }}>
            🎙️ Agri-Voice — AI शेतकरी मित्र (Mother Tongue Assistant)
          </h1>
          <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0 }}>
            Understands Marathi, Hindi, English, and all Indian languages (including Marathlish/Hinglish). Speak or type your problem!
          </p>
        </div>

        {/* Indian Language Selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: d.card, border: `1.5px solid ${d.border}`, padding: "6px 12px", borderRadius: 10, boxShadow: shadow(isDark, 1) }}>
          <Globe size={16} color="#436464" />
          <select 
            value={selectedLang} 
            onChange={e => setSelectedLang(e.target.value)}
            style={{ border: "none", background: "transparent", color: d.text, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", outline: "none" }}
          >
            {INDIAN_LANGUAGES.map(l => (
              <option key={l.code} value={l.name} style={{ background: isDark ? "#2d1a0e" : "#fff", color: isDark ? "#fff" : "#000" }}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Prompts Chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: 12 }}>
        {quickQuestions.map((q, i) => (
          <button 
            key={i} 
            onClick={() => sendQuery(q)}
            style={{ 
              whiteSpace: "nowrap", 
              padding: "6px 12px", 
              borderRadius: 999, 
              border: `1px solid ${d.border}`, 
              background: d.bgAlt, 
              color: d.textSub, 
              fontFamily: MRP, 
              fontSize: 12, 
              cursor: "pointer",
              flexShrink: 0
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div style={{ flex: 1, overflowY: "auto", background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 18, marginBottom: 14, boxShadow: shadow(isDark, 1), display: "flex", flexDirection: "column", gap: 14 }}>
        {msgs.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} style={{ display: "flex", gap: 10, justifyContent: isUser ? "flex-end" : "flex-start", alignItems: "flex-start" }}>
              {!isUser && (
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(67,100,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bot size={18} color="#436464" />
                </div>
              )}

              <div style={{ 
                maxWidth: "80%", 
                padding: "12px 16px", 
                borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px", 
                background: isUser ? "#c4501a" : (isDark ? "rgba(255,248,245,0.06)" : "#feeade"), 
                color: isUser ? "#fff" : d.text,
                boxShadow: shadow(isDark, 1)
              }}>
                <p style={{ fontFamily: MRP, fontSize: 14, lineHeight: 1.55, margin: "0 0 6px" }}>
                  {m.text}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontFamily: MRP, fontSize: 10, color: isUser ? "rgba(255,255,255,0.7)" : d.textMuted }}>
                      {m.time}
                    </span>
                    {!isUser && (
                      <span style={{ 
                        fontFamily: MRP, 
                        fontWeight: 700, 
                        fontSize: 9, 
                        color: m.source?.includes("local") ? "#456348" : "#436464", 
                        background: m.source?.includes("local") ? "rgba(69,99,72,0.12)" : "rgba(67,100,100,0.12)",
                        padding: "1px 6px",
                        borderRadius: 4
                      }}>
                        {m.source?.includes("local") ? "⚡ ICAR RAG (Saved API Limit)" : "🌐 Augmented AI"}
                      </span>
                    )}
                  </div>

                  {!isUser && (
                    <button 
                      onClick={() => toggleSpeak(m.text, idx)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: speakingIndex === idx ? "#456348" : d.textMuted, display: "flex", alignItems: "center", gap: 4, padding: 0 }}
                      title="Speak / Stop"
                    >
                      {speakingIndex === idx ? <VolumeX size={14} color="#ba1a1a" /> : <Volume2 size={14} color="#436464" />}
                      <span style={{ fontSize: 11, fontFamily: MRP, fontWeight: 700 }}>
                        {speakingIndex === idx ? "थांबवा" : "ऐका (Audio)"}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <User size={16} color="#fff" />
                </div>
              )}
            </div>
          );
        })}

        {thinking && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(67,100,100,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={18} color="#436464" />
            </div>
            <div style={{ padding: "10px 16px", borderRadius: 14, background: d.bgAlt, color: d.textMuted, fontFamily: MRP, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={14} color="#436464" />
              <span>कृषी सल्लागार विचार करत आहे... (Analyzing in {selectedLang})</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button 
          onClick={recording ? stopRecording : startRecording}
          style={{ 
            width: 48, 
            height: 48, 
            borderRadius: "50%", 
            background: recording ? "#ba1a1a" : "#436464", 
            color: "#fff", 
            border: "none", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            flexShrink: 0,
            boxShadow: recording ? "0 0 15px rgba(186,26,26,0.6)" : "0 4px 12px rgba(67,100,100,0.3)"
          }}
          title={recording ? "Stop Recording" : "Speak in your Mother Tongue"}
        >
          {recording ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendQuery(input); }}
          placeholder={selectedLang === "Marathi" ? "तुमचा प्रश्न येथे लिहा किंवा बोला (उदा. कांद्यावरील करपा कसा रोखावा?)..." : "Ask your farming question in any Indian language..."}
          style={{ 
            flex: 1, 
            padding: "13px 18px", 
            borderRadius: 999, 
            border: `1.5px solid ${d.border}`, 
            background: d.card, 
            color: d.text, 
            fontFamily: MRP, 
            fontSize: 14, 
            outline: "none" 
          }}
        />

        <button 
          onClick={() => sendQuery(input)}
          disabled={!input.trim() || thinking}
          style={{ 
            width: 48, 
            height: 48, 
            borderRadius: "50%", 
            background: input.trim() ? "#c4501a" : d.border, 
            color: "#fff", 
            border: "none", 
            cursor: input.trim() ? "pointer" : "default", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            flexShrink: 0 
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
