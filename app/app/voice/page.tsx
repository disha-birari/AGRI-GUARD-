"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Send, Volume2, User, Bot, Leaf } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";

interface Msg { 
  role: "user" | "bot"; 
  text: string; 
  time: string; 
  keywords?: string[];
}

interface KeywordInfo {
  label: string;
  category: "crop" | "symptom" | "action";
  matches: string[];
}

const KEYWORD_DICT: KeywordInfo[] = [
  { label: "Tomato", category: "crop", matches: ["tomato", "tomatoes", "टमाटर", "தக்காளி", "thakkali"] },
  { label: "Onion", category: "crop", matches: ["onion", "onions", "प्याज", "வெங்காயம்", "vengayam"] },
  { label: "Wheat", category: "crop", matches: ["wheat", "wheats", "गेहूं", "गेहूँ", "கோதுமை", "godhumai"] },
  { label: "Yellow Leaves", category: "symptom", matches: ["yellow", "पीला", "पीले", "மஞ்சள்", "manjal", "yellowing"] },
  { label: "Late Blight", category: "symptom", matches: ["blight", "झुलसा", "கருகல்", "karugal"] },
  { label: "Fungicide", category: "action", matches: ["fungicide", "fungicides", "कवकनाशी", "பூஞ்சைக்கொல்லி"] },
  { label: "Spray", category: "action", matches: ["spray", "spraying", "छिड़काव", "தெளி", "theli", "sprayer"] },
  { label: "Harvest", category: "action", matches: ["harvest", "harvesting", "कटाई", "அறுவடை", "aruvadai"] },
];

const QUICK = [
  "Tomato leaves turning yellow?",
  "Best time to spray fungicide?",
  "How to treat Late Blight?",
  "Onion storage tips?",
  "When to harvest wheat?",
];

const REPLIES: Record<string, Record<string, string>> = {
  English: {
    default: "I understand your concern. Based on your recent scans and current weather in Nashik, I recommend monitoring closely. Apply Mancozeb 2g/L spray after 4 PM today — rain clears by 3:30 PM. If symptoms worsen in 48 hours, please consult an expert through the Review section.",
    yellow: "Yellow leaves often indicate nitrogen deficiency or Early Blight. Check for spots: if present → apply Chlorothalonil 2g/L. If no spots → apply 19:19:19 NPK fertilizer at 5g/L. Avoid waterlogging. Ensure proper drainage.",
    spray: "Best spray window today: before 9 AM or after 5 PM. Wind speed is optimal (8–12 km/h). Avoid spraying tomorrow — heavy rain expected Tuesday afternoon. Next good window: Wednesday after 2 PM.",
    blight: "For Late Blight: 1) Remove and burn infected leaves immediately. 2) Apply Mancozeb 2g/L or Metalaxyl-M 2.5g/L. 3) Spray every 7 days. 4) Avoid overhead watering. Severity in your area is currently HIGH — act within 24 hours.",
    onion: "Store onions in a cool, dry, well-ventilated area at 25–30°C. Avoid moisture. Cure harvested onions in the field for 7–10 days before storing. Sort and remove damaged bulbs to prevent rotting.",
    wheat: "Wheat is ready to harvest when grain moisture drops to 14–16% and stalks turn golden yellow. Check: bite a grain — it should be hard and not doughy. Nashik region optimal window: usually February–March.",
  },
  Hindi: {
    default: "मुझे आपकी चिंता समझ में आ रही है। नासिक में हालिया स्कैन और मौसम को देखते हुए, मैं निगरानी रखने की सलाह देता हूं। आज शाम 4 बजे के बाद मैनकोज़ेब 2 ग्राम/लीटर का छिड़काव करें। यदि लक्षण 48 घंटों में खराब होते हैं, तो कृपया विशेषज्ञ समीक्षा अनुभाग से संपर्क करें।",
    yellow: "पीले पत्ते अक्सर नाइट्रोजन की कमी या अगेती झुलसा (Early Blight) का संकेत देते हैं। धब्बे देखें: यदि मौजूद हैं → क्लोरोथैलोनिल 2 ग्राम/लीटर लगाएं। यदि कोई धब्बा नहीं है → 5 ग्राम/लीटर पर 19:19:19 NPK उर्वरक लगाएं। जलभराव से बचें।",
    spray: "छिड़काव के लिए आज सबसे अच्छा समय: सुबह 9 बजे से पहले या शाम 5 बजे के बाद। हवा की गति अनुकूल है (8-12 किमी/घंटा)। कल छिड़काव करने से बचें - मंगलवार दोपहर को भारी बारिश की संभावना है। अगला अच्छा समय: बुधवार दोपहर 2 बजे के बाद।",
    blight: "पछैती झुलसा (Late Blight) के लिए: 1) संक्रमित पत्तियों को तुरंत हटाकर जला दें। 2) मैनकोज़ेब 2 ग्राम/लीटर या मेटलैक्सिल-एम 2.5 ग्राम/लीटर लगाएं। 3) हर 7 दिन में छिड़काव करें। 4) सिंचाई शाम को न करें। आपके क्षेत्र में प्रकोप अभी उच्च है।",
    onion: "प्याज को ठंडी, सूखी, हवादार जगह पर 25-30 डिग्री सेल्सियस पर स्टोर करें। नमी से बचाएं। खेत में 7-10 दिनों तक सुखाएं। सड़ने से बचाने के लिए खराब प्याज को छांटकर अलग कर दें।",
    wheat: "गेहूं कटाई के लिए तब तैयार होता है जब अनाज की नमी 14-16% तक गिर जाती है और डंठल सुनहरे पीले हो जाते हैं। दाने को काटकर देखें - यह कड़ा होना चाहिए, आटा जैसा नहीं। नासिक क्षेत्र के लिए अनुकूल समय: फरवरी-मार्च।",
  },
  Tamil: {
    default: "உங்கள் கவலை எனக்குப் புரிகிறது. உங்கள் சமீபத்திய ஸ்கேன்கள் மற்றும் நாசிக்கில் தற்போதைய வானிலை அடிப்படையில், நெருக்கமாக கண்காணிக்க பரிந்துரைக்கிறேன். இன்று மாலை 4 மணிக்கு மேல் மேன்கோசெப் 2 கிராம்/லி தெளிக்கவும். அறிகுறிகள் 48 மணிநேரத்தில் மோசமடைந்தால், நிபுணரைத் தொடர்பு கொள்ளவும்.",
    yellow: "மஞ்சள் இலைகள் பெரும்பாலும் நைட்ரஜன் குறைபாடு அல்லது ஆரம்ப கருகல் நோயைக் குறிக்கின்றன. புள்ளிகள் உள்ளதா எனப் பார்க்கவும்: இருந்தால் → குளோரோதலோனில் 2 கிராம்/லி தெளிக்கவும். புள்ளிகள் இல்லையென்றால் → 19:19:19 NPK உரத்தை 5 கிராம்/லி அளவில் பயன்படுத்தவும். நீர் தேங்குவதைத் தவிர்க்கவும்.",
    spray: "இன்று மருந்து தெளிக்க சிறந்த நேரம்: காலை 9 மணிக்கு முன் அல்லது மாலை 5 மணிக்கு பின். காற்றின் வேகம் உகந்தது (8-12 கிமீ/ம). நாளை தெளிப்பதைத் தவிர்க்கவும் - செவ்வாய் மதியம் கனமழை எதிர்பார்க்கப்படுகிறது. அடுத்த நல்ல நேரம்: புதன்பிழமை மதியம் 2 மணிக்கு மேல்.",
    blight: "பிந்தைய கருகல் நோய்க்கு (Late Blight): 1) பாதிக்கப்பட்ட இலைகளை உடனடியாக அகற்றி எரிக்கவும். 2) மேன்கோசெப் 2 கிராம்/லி அல்லது மெட்டாலாக்ஸைல்-எம் 2.5 கிராம்/லி பயன்படுத்தவும். 3) 7 நாட்களுக்கு ஒருமுறை தெளிக்கவும். உங்கள் பகுதியில் தீவிரம் அதிகமாக உள்ளது.",
    onion: "வெங்காயத்தை குளிர்ச்சியான, உலர்ந்த, காற்றோட்டமான இடத்தில் 25-30°C வெப்பநிலையில் சேமிக்கவும். வெங்காயத்தை சேமிப்பதற்கு முன் 7-10 நாட்கள் களத்தில் காயவைக்கவும். சேதமடைந்த வெங்காயத்தை அகற்றவும்.",
    wheat: "தானியத்தின் ஈரப்பதம் 14-16% ஆகக் குறைந்து, தண்டுகள் பொன்னிறமாக மாறும்போது கோதுமை அறுவடைக்கு தயாராகிறது. நாசிக் பகுதிக்கு உகந்த அறுவடை காலம்: பொதுவாக பிப்ரவரி-மார்ச்.",
  }
};

function detectLanguage(text: string): "English" | "Hindi" | "Tamil" {
  if (/[\u0900-\u097F]/.test(text)) {
    return "Hindi";
  }
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return "Tamil";
  }
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  
  const hindiKeywords = ["kya", "patta", "pila", "tamatar", "nuksan", "ilaaj", "paani", "khad", "mitti", "fasal", "kheti", "rog"];
  const tamilKeywords = ["enna", "thakkali", "manjal", "nooi", "tannir", "marundu", "valarchi"];
  
  if (hindiKeywords.some(w => words.includes(w))) return "Hindi";
  if (tamilKeywords.some(w => words.includes(w))) return "Tamil";

  return "English";
}

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];
  KEYWORD_DICT.forEach(item => {
    if (item.matches.some(m => lower.includes(m.toLowerCase()))) {
      found.push(item.label);
    }
  });
  return found;
}

function now() { return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }

export default function AgriVoice() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Namaste! I'm your Agri-Voice AI advisor. Ask me anything about your crops, diseases, weather timing, or market prices — in Hindi or English.", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [lang, setLang] = useState("English");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef("");

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  // Sync with profile language if available
  useEffect(() => {
    if (user?.language) {
      if (user.language.startsWith("hi")) setLang("Hindi");
      else if (user.language.startsWith("ta")) setLang("Tamil");
      else setLang("English");
    }
  }, [user?.language]);

  // Pre-fetch voices on mount
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const handleVoices = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoices;
      handleVoices();
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string, language: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (language === "Hindi") {
      utterance.lang = "hi-IN";
    } else if (language === "Tamil") {
      utterance.lang = "ta-IN";
    } else {
      utterance.lang = "en-IN";
    }

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(utterance.lang.substring(0, 2)));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeak = (text: string, index: number, language: string) => {
    if (speakingIndex === index) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingIndex(null);
    } else {
      setSpeakingIndex(index);
      speakText(text, language);
    }
  };

  const send = async (text: string) => {
    if (!text.trim() || thinking) return;
    
    // Extract keywords from the text/voice input
    const extracted = extractKeywords(text);
    
    const userMsg: Msg = { 
      role: "user", 
      text, 
      time: now(),
      keywords: extracted 
    };
    
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setThinking(true);

    // Auto-detect only if they speak in native script, otherwise respect current user selected language
    let activeLang = lang;
    if (/[\u0900-\u097F]/.test(text)) {
      activeLang = "Hindi";
      setLang("Hindi");
    } else if (/[\u0B80-\u0BFF]/.test(text)) {
      activeLang = "Tamil";
      setLang("Tamil");
    }

    try {
      // Call real-time Gemini LLM Agri-Voice API
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          language: activeLang,
          location: `${user?.village || "Nashik"}, ${user?.district || "Maharashtra"}`,
          cropContext: user?.crops?.join(", ") || "Tomato, Onion, Wheat"
        }),
      });

      let replyText = "";
      if (res.ok) {
        const json = await res.json();
        replyText = json.response;
      } else {
        throw new Error("Voice API returned error");
      }

      const newBotMsg: Msg = { role: "bot", text: replyText, time: now() };
      setMsgs(m => {
        const updated = [...m, newBotMsg];
        const newIndex = updated.length - 1;
        setSpeakingIndex(newIndex);
        speakText(replyText, activeLang);
        return updated;
      });
      setThinking(false);

      try {
        await db.createVoiceLog({
          user_id: user?.id || null,
          query: text,
          response: replyText,
          lang: activeLang
        });
      } catch (e) {
        console.error("Failed to log voice consultation to Supabase", e);
      }
    } catch (err) {
      console.warn("Live Voice API fallback:", err);
      // Fallback
      let key = "default";
      if (extracted.includes("Yellow Leaves")) key = "yellow";
      else if (extracted.includes("Fungicide") || extracted.includes("Spray")) key = "spray";
      else if (extracted.includes("Late Blight")) key = "blight";
      else if (extracted.includes("Onion")) key = "onion";
      else if (extracted.includes("Wheat") || extracted.includes("Harvest")) key = "wheat";

      const fallbackReply = REPLIES[activeLang]?.[key] || REPLIES[activeLang]?.default || REPLIES.English.default;
      const newBotMsg: Msg = { role: "bot", text: fallbackReply, time: now() };
      setMsgs(m => {
        const updated = [...m, newBotMsg];
        const newIndex = updated.length - 1;
        setSpeakingIndex(newIndex);
        speakText(fallbackReply, activeLang);
        return updated;
      });
      setThinking(false);
    }
  };

  const startRecording = () => {
    if (typeof window === "undefined") return;
    
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome, Safari, or Microsoft Edge.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      
      if (lang === "Hindi") {
        rec.lang = "hi-IN";
      } else if (lang === "Tamil") {
        rec.lang = "ta-IN";
      } else {
        rec.lang = "en-IN";
      }
      
      rec.onstart = () => {
        setRecording(true);
        setInput("");
        transcriptRef.current = "";
      };
      
      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        const currentText = finalTranscript || interimTranscript;
        if (currentText) {
          setInput(currentText);
          if (finalTranscript) {
            transcriptRef.current = finalTranscript;
          }
        }
      };
      
      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        setRecording(false);
      };
      
      rec.onend = () => {
        setRecording(false);
        const spokenText = transcriptRef.current || input;
        if (spokenText && spokenText.trim()) {
          send(spokenText);
        }
      };
      
      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  const toggleRecord = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 150px)" }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Agri-Voice Advisor</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Speak or type your farming problem. Available in multiple Indian languages with auto-detection.</p>
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
                    
                    {/* Render extracted keyword chips under user query */}
                    {m.role === "user" && m.keywords && m.keywords.length > 0 && (
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                        {m.keywords.map(kw => (
                          <span key={kw} style={{ 
                            fontFamily: MRP, 
                            fontSize: 10, 
                            fontWeight: 700,
                            color: "#fff", 
                            background: "rgba(255, 255, 255, 0.22)", 
                            padding: "2px 7px", 
                            borderRadius: 6,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3
                          }}>
                            🔍 {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                    <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted }}>{m.time}</span>
                    {m.role === "bot" && (
                      <button 
                        onClick={() => toggleSpeak(m.text, i, lang)} 
                        style={{ 
                          background: "transparent", 
                          border: "none", 
                          cursor: "pointer", 
                          color: speakingIndex === i ? "#c4501a" : d.textMuted, 
                          padding: 4, 
                          display: "flex",
                          alignItems: "center",
                          borderRadius: 4,
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                        title={speakingIndex === i ? "Stop speaking" : "Listen to answer"}
                      >
                        {speakingIndex === i ? (
                          <div style={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                            {[1, 2, 3].map(bar => (
                              <span key={bar} style={{ 
                                width: 2, 
                                height: 8, 
                                background: "#c4501a", 
                                animation: `speakerWave 0.5s ${bar * 0.15}s infinite alternate ease-in-out` 
                              }} />
                            ))}
                          </div>
                        ) : (
                          <Volume2 size={14} />
                        )}
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
            {recording && (
              <div style={{ display: "flex", justifyContent: "center", gap: 3, height: 16, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => {
                  const h = 4 + Math.sin(i) * 10;
                  return (
                    <div key={i} style={{
                      width: 3,
                      height: `${Math.abs(h)}px`,
                      backgroundColor: "#ba1a1a",
                      borderRadius: 2,
                      animation: `pulseHeight 0.6s ${i * 0.08}s infinite alternate ease-in-out`
                    }}/>
                  );
                })}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Mic button */}
              <button 
                onClick={toggleRecord} 
                style={{ 
                  width: 42, 
                  height: 42, 
                  borderRadius: "50%", 
                  border: "none", 
                  cursor: "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0, 
                  background: recording ? "#ba1a1a" : "rgba(196,80,26,0.1)", 
                  transition: "all 0.2s", 
                  animation: recording ? "recordPulse 1.5s infinite" : "none",
                  boxShadow: recording ? "0 0 0 4px rgba(186,26,26,0.2)" : "none" 
                }}
                title={recording ? "Stop Recording (Autosend)" : "Start Recording"}
              >
                {recording ? <MicOff size={17} color="#fff" /> : <Mic size={17} color="#c4501a" />}
              </button>

              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
                placeholder={recording ? "Listening..." : "Type or speak your question…"}
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
                Speaking... Stop speaking or click Mic to send query.
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

          {/* Keyword Dictionary Visual Display */}
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 18, boxShadow: shadow(isDark, 1) }}>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Supported Keyword Tags</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {KEYWORD_DICT.map(kw => {
                let color = "#436464";
                if (kw.category === "crop") color = "#c4501a";
                if (kw.category === "symptom") color = "#8b5e3c";
                return (
                  <span key={kw.label} style={{ 
                    fontFamily: MRP, 
                    fontSize: 11, 
                    fontWeight: 600,
                    color, 
                    background: `${color}12`, 
                    padding: "3px 8px", 
                    borderRadius: 6,
                    border: `1.2px solid ${color}22`
                  }}>
                    {kw.label}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ background: "rgba(67,100,100,0.06)", border: "1px solid rgba(67,100,100,0.2)", borderRadius: 14, padding: 18 }}>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#436464", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Safety & Language Settings</p>
            <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 10px", lineHeight: 1.55 }}>
              Agri-Voice auto-detects English, Hindi, and Tamil speech transcripts and responds in the matching native language with voice output.
            </p>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0, lineHeight: 1.5 }}>
              Your profile default: <strong>{user?.language === "hi" ? "Hindi" : user?.language === "ta" ? "Tamil" : "English"}</strong>
            </p>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-4px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes pulseHeight {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1.8); }
        }
        @keyframes speakerWave {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1.5); }
        }
        @keyframes recordPulse {
          0% { box-shadow: 0 0 0 0px rgba(186, 26, 26, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(186, 26, 26, 0); }
          100% { box-shadow: 0 0 0 0px rgba(186, 26, 26, 0); }
        }
      `}</style>
    </div>
  );
}
