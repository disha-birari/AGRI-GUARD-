"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Camera, Mic, TrendingUp, CheckCircle, ArrowRight, Star, CloudRain, IndianRupee, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

function RevealOnScroll({ children, delay = 0, y = 24 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div
      ref={setRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ── bullock cart SVG ── */
function BullockCartSVG() {
  return (
    <svg viewBox="0 0 500 96" width="500" height="96" aria-hidden>
      {/* Group the front wheel and spokes to rotate them */}
      <g style={{ transformOrigin: "64px 70px", animation: "spinWheel 1s linear infinite" }}>
        <circle cx="64" cy="70" r="25" fill="none" stroke="#231a13" strokeWidth="3.5"/>
        <circle cx="64" cy="70" r="5" fill="#231a13"/>
        <line x1="64" y1="45" x2="64" y2="95" stroke="#231a13" strokeWidth="2"/>
        <line x1="39" y1="70" x2="89" y2="70" stroke="#231a13" strokeWidth="2"/>
        <line x1="46" y1="52" x2="82" y2="88" stroke="#231a13" strokeWidth="1.5"/>
        <line x1="82" y1="52" x2="46" y2="88" stroke="#231a13" strokeWidth="1.5"/>
        <line x1="49" y1="48" x2="79" y2="92" stroke="#231a13" strokeWidth="1.5"/>
        <line x1="79" y1="48" x2="49" y2="92" stroke="#231a13" strokeWidth="1.5"/>
      </g>
      <path d="M 42 48 L 192 48 L 196 73 L 40 73 Z" fill="#231a13"/>
      <rect x="50" y="26" width="5" height="24" rx="1" fill="#231a13"/>
      <rect x="63" y="24" width="5" height="26" rx="1" fill="#231a13"/>
      <rect x="76" y="23" width="5" height="27" rx="1" fill="#231a13"/>
      <rect x="89" y="24" width="5" height="26" rx="1" fill="#231a13"/>
      <rect x="102" y="26" width="5" height="24" rx="1" fill="#231a13"/>
      <rect x="48" y="23" width="61" height="5" rx="2" fill="#231a13"/>
      <ellipse cx="156" cy="39" rx="14" ry="12" fill="#231a13"/>
      <circle cx="158" cy="22" r="10" fill="#231a13"/>
      <ellipse cx="158" cy="14" rx="9" ry="5" fill="#231a13"/>
      <rect x="147" y="11" width="24" height="4" rx="2" fill="#231a13"/>
      <path d="M 166 30 C 177 20 188 12 210 2" stroke="#231a13" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 148 50 L 140 73" stroke="#231a13" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <path d="M 160 51 L 165 72" stroke="#231a13" strokeWidth="6" strokeLinecap="round" fill="none"/>
      {/* Group the rear wheel and spokes to rotate them */}
      <g style={{ transformOrigin: "208px 73px", animation: "spinWheel 0.84s linear infinite" }}>
        <circle cx="208" cy="73" r="21" fill="none" stroke="#231a13" strokeWidth="3"/>
        <circle cx="208" cy="73" r="4" fill="#231a13"/>
        <line x1="208" y1="52" x2="208" y2="94" stroke="#231a13" strokeWidth="1.5"/>
        <line x1="187" y1="73" x2="229" y2="73" stroke="#231a13" strokeWidth="1.5"/>
        <line x1="193" y1="58" x2="223" y2="88" stroke="#231a13" strokeWidth="1.5"/>
        <line x1="223" y1="58" x2="193" y2="88" stroke="#231a13" strokeWidth="1.5"/>
      </g>
      <path d="M 194 65 L 256 59" stroke="#231a13" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="256" y1="51" x2="256" y2="67" stroke="#231a13" strokeWidth="3.5"/>
      <line x1="256" y1="53" x2="282" y2="51" stroke="#231a13" strokeWidth="2"/>
      <line x1="256" y1="65" x2="282" y2="63" stroke="#231a13" strokeWidth="2"/>
      <ellipse cx="328" cy="64" rx="40" ry="14" fill="#2d1f16" opacity="0.72"/>
      <path d="M 358 54 Q 370 46 378 46" stroke="#2d1f16" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.72"/>
      <ellipse cx="386" cy="46" rx="16" ry="11" fill="#2d1f16" opacity="0.72"/>
      <path d="M 380 37 Q 371 22 379 15" stroke="#2d1f16" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.72"/>
      <path d="M 394 37 Q 401 22 396 15" stroke="#2d1f16" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.72"/>
      <rect x="292" y="76" width="5" height="20" rx="2" fill="#2d1f16" opacity="0.72"/>
      <rect x="307" y="76" width="5" height="20" rx="2" fill="#2d1f16" opacity="0.72"/>
      <rect x="350" y="76" width="5" height="20" rx="2" fill="#2d1f16" opacity="0.72"/>
      <rect x="365" y="76" width="5" height="20" rx="2" fill="#2d1f16" opacity="0.72"/>
      <ellipse cx="334" cy="58" rx="38" ry="13" fill="#231a13"/>
      <path d="M 362 48 Q 374 40 382 41" stroke="#231a13" strokeWidth="12" fill="none" strokeLinecap="round"/>
      <ellipse cx="390" cy="41" rx="15" ry="10" fill="#231a13"/>
      <ellipse cx="403" cy="44" rx="7" ry="5" fill="#231a13"/>
      <path d="M 384 32 Q 375 17 383 10" stroke="#231a13" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M 397 32 Q 404 17 399 10" stroke="#231a13" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <rect x="298" y="69" width="5" height="22" rx="2" fill="#231a13"/>
      <rect x="313" y="69" width="5" height="22" rx="2" fill="#231a13"/>
      <rect x="355" y="69" width="5" height="22" rx="2" fill="#231a13"/>
      <rect x="370" y="69" width="5" height="22" rx="2" fill="#231a13"/>
      <line x1="452" y1="96" x2="446" y2="54" stroke="#231a13" strokeWidth="2.5" opacity="0.5"/>
      <ellipse cx="446" cy="50" rx="5" ry="9" fill="#231a13" opacity="0.5"/>
      <line x1="470" y1="96" x2="475" y2="48" stroke="#231a13" strokeWidth="2" opacity="0.38"/>
      <ellipse cx="475" cy="44" rx="4" ry="8" fill="#231a13" opacity="0.38"/>
      <ellipse cx="210" cy="94" rx="180" ry="5" fill="#231a13" opacity="0.18"/>
    </svg>
  );
}

function LoadingScreen({ show }: { show: boolean }) {
  return (
    <>
      <style>{`
        @keyframes agriCart { from{transform:translateX(-560px)}to{transform:translateX(110vw)} }
        @keyframes agriFade { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes agriBar  { from{width:0%}to{width:100%} }
        @keyframes floatCard { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes floatImage { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes heroSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 6px 24px rgba(196,80,26,0.3), 0 0 0 rgba(196,80,26,0); }
          50% { box-shadow: 0 10px 32px rgba(196,80,26,0.5), 0 0 16px rgba(196,80,26,0.35); }
        }
        @keyframes spinWheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes floatGlow1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(25px, -15px) scale(1.08); }
        }
        @keyframes floatGlow2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-15px, 20px) scale(1.05); }
        }
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes leafSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        @keyframes ctaGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .nav-link {
          transition: all 0.25s ease !important;
        }
        .nav-link:hover {
          color: #c4501a !important;
          transform: translateY(-1px) scale(1.05);
        }
        .btn-pulse {
          animation: glowPulse 2.5s infinite ease-in-out;
          transition: all 0.3s ease !important;
        }
        .btn-pulse:hover {
          transform: translateY(-2px) scale(1.04) !important;
          opacity: 0.95;
        }
        .btn-secondary-hover {
          transition: all 0.3s ease !important;
        }
        .btn-secondary-hover:hover {
          transform: translateY(-2px) scale(1.03) !important;
          background: rgba(196,80,26,0.06) !important;
        }
        .feature-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .feature-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          border-color: #c4501a !important;
        }
        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.12) translateY(-2px);
          box-shadow: 0 4px 12px rgba(196,80,26,0.15);
        }
        .stat-card {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          padding: 12px;
          border-radius: 12px;
        }
        .stat-card:hover {
          transform: translateY(-5px) scale(1.05) !important;
          background: rgba(196,80,26,0.05) !important;
          box-shadow: 0 10px 30px rgba(196,80,26,0.06);
        }
        .hero-img-container {
          animation: floatImage 6s infinite ease-in-out;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hero-diag-card {
          animation: floatCard 4s infinite ease-in-out;
        }
        .hero-glow-1 {
          animation: floatGlow1 8s infinite ease-in-out;
        }
        .hero-glow-2 {
          animation: floatGlow2 10s infinite ease-in-out;
        }
        .animated-gradient-crisis {
          background: linear-gradient(135deg, #c4501a, #e67e22, #c4501a);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 4s linear infinite;
        }
        .animated-gradient-profit {
          background: linear-gradient(135deg, #436464, #70a1a1, #456348);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientFlow 5s linear infinite;
        }
        .logo-container:hover .logo-leaf {
          animation: leafSway 0.6s ease-in-out;
        }
        .cta-section {
          background: linear-gradient(270deg, #140a04, #2d170a, #140a04) !important;
          background-size: 400% 400% !important;
          animation: ctaGradient 12s ease infinite !important;
        }
      `}</style>
      <div style={{ position:"fixed",inset:0,zIndex:200,overflow:"hidden", opacity:show?1:0, transition:"opacity 0.9s ease", pointerEvents:show?"all":"none" }}>
        <div style={{ position:"absolute",inset:0, background:"linear-gradient(to bottom,#f06830 0%,#c84010 32%,#8c1e06 60%,#3a0e02 80%,#180600 100%)" }}/>
        <div style={{ position:"absolute",bottom:"28%",left:0,right:0,height:90, background:"linear-gradient(to bottom,transparent,rgba(180,60,10,0.55))" }}/>
        <div style={{ position:"absolute",bottom:"29%",left:"50%",transform:"translateX(-50%)", width:160,height:160,borderRadius:"50%", background:"radial-gradient(circle,#ffe55a 15%,#ffaa28 55%,rgba(240,104,48,0) 100%)", filter:"blur(3px)" }}/>
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"28%",background:"#220b01" }}/>
        <svg style={{ position:"absolute",bottom:"26%",left:24 }} viewBox="0 0 56 88" width="56" height="88">
          <path d="M 28 88 Q 26 66 28 46 Q 30 28 24 6" stroke="#160500" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 24 8 Q 4 -2 -4 10 Q 10 16 14 26" fill="#160500"/>
          <path d="M 24 8 Q 42 -4 52 10 Q 36 16 32 26" fill="#160500"/>
          <path d="M 24 8 Q 12 0 4 18 Q 18 20 22 28" fill="#160500"/>
          <path d="M 24 8 Q 34 2 44 20 Q 30 20 28 28" fill="#160500"/>
        </svg>
        <svg style={{ position:"absolute",bottom:"26%",right:28 }} viewBox="0 0 56 88" width="56" height="88">
          <path d="M 28 88 Q 26 66 28 46 Q 30 28 24 6" stroke="#160500" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 24 8 Q 4 -2 -4 10 Q 10 16 14 26" fill="#160500"/>
          <path d="M 24 8 Q 42 -4 52 10 Q 36 16 32 26" fill="#160500"/>
          <path d="M 24 8 Q 12 0 4 18 Q 18 20 22 28" fill="#160500"/>
          <path d="M 24 8 Q 34 2 44 20 Q 30 20 28 28" fill="#160500"/>
        </svg>
        <div style={{ position:"absolute",bottom:"22%", animation:"agriCart 3.8s linear forwards" }}>
          <BullockCartSVG />
        </div>
        <div style={{ position:"absolute",top:"22%",left:"50%",transform:"translateX(-50%)", textAlign:"center", animation:"agriFade 0.8s ease 0.3s both", whiteSpace:"nowrap" }}>
          <p style={{ fontFamily:PJS,fontSize:"clamp(36px,8vw,52px)",fontWeight:800,color:"#fff8f5",letterSpacing:"-0.02em",lineHeight:1,textShadow:"0 2px 24px rgba(0,0,0,0.35)" }}>AgriGuard</p>
          <p style={{ fontFamily:MRP,fontSize:13,fontWeight:600,color:"rgba(255,248,245,0.65)",letterSpacing:"0.14em",textTransform:"uppercase",marginTop:8 }}>Your AI Farming Companion</p>
          <div style={{ marginTop:28,width:180,height:3,background:"rgba(255,248,245,0.18)",borderRadius:999,overflow:"hidden",margin:"28px auto 0" }}>
            <div style={{ height:"100%",borderRadius:999,background:"linear-gradient(90deg,#ffe55a,#ffaa28)",animation:"agriBar 3.6s linear forwards" }}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Landing() {
  const router = useRouter();
  const { isDark, toggle, d } = useTheme();
  const [showLoader, setShowLoader] = useState(true);
  const [loaderMounted, setLoaderMounted] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowLoader(false), 3800);
    const t2 = setTimeout(() => setLoaderMounted(false), 4700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const FEATURES = [
    { tag:"SEE", icon:Camera, color:"#c4501a", title:"AI Eye — Instant Diagnosis", desc:"Point your phone at any leaf. AI identifies disease in 10 seconds with confidence score.", bullets:["50+ major Indian crops","Works offline","96% accuracy"] },
    { tag:"PREDICT", icon:Mic, color:"#436464", title:"Agri-Voice — Smart Advisor", desc:"Speak in Hindi, Tamil, Telugu and 9 more languages. Weather-aware treatment plans.", bullets:["12 Indian languages","Weather-integrated","Voice + text output"] },
    { tag:"EARN", icon:TrendingUp, color:"#456348", title:"Mandi-Pro — Market Prices", desc:"Live government AGMARKNET prices updated every 15 minutes. Profit calculator built in.", bullets:["Government data","Profit calculator","Best mandi directions"] },
  ];

  return (
    <div style={{ fontFamily:MRP, background:d.bg, color:d.text, minHeight:"100vh" }}>
      {loaderMounted && <LoadingScreen show={showLoader} />}

      {/* NAV */}
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100, borderBottom:scrolled?`1px solid ${d.border}`:"none", background:scrolled?(isDark?"rgba(28,16,9,0.96)":"rgba(255,248,245,0.96)"):"transparent", backdropFilter:scrolled?"blur(16px)":"none", transition:"all 0.3s" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"0 32px",height:68,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div className="logo-container" style={{ display:"flex",alignItems:"center",gap:9, cursor:"pointer" }}>
            <div className="logo-leaf" style={{ width:32,height:32,borderRadius:9,background:"#c4501a",display:"flex",alignItems:"center",justifyContent:"center", transition:"transform 0.3s ease" }}><Leaf size={15} color="#fff"/></div>
            <span style={{ fontFamily:PJS,fontWeight:800,fontSize:19,color:d.text,letterSpacing:"-0.01em" }}>AgriGuard</span>
          </div>
          <div className="hidden md:flex" style={{ gap:28,alignItems:"center" }}>
            {["Features","How It Works","Markets"].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(" ","-")}`} className="nav-link" style={{ fontFamily:MRP,fontWeight:600,fontSize:14,color:d.textMuted,textDecoration:"none" }}>{l}</a>
            ))}
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <button onClick={toggle} style={{ width:34,height:34,borderRadius:"50%",border:`1px solid ${d.border}`,background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:d.textMuted }}>
              {isDark?<Sun size={14}/>:<Moon size={14}/>}
            </button>
            <button onClick={() => router.push("/login")} className="hidden md:block" style={{ padding:"8px 18px",borderRadius:7,border:`1.5px solid ${d.border}`,background:"transparent",color:d.text,fontFamily:PJS,fontWeight:600,fontSize:14,cursor:"pointer" }}>Sign In</button>
            <button onClick={() => router.push("/signup")} className="hidden md:block" style={{ padding:"8px 20px",borderRadius:7,background:"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:14,border:"none",cursor:"pointer" }}>Download Free</button>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background:"transparent",border:"none",cursor:"pointer",color:d.text }}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ background:d.card,borderTop:`1px solid ${d.border}`,padding:"16px 24px 20px" }}>
            <button onClick={() => router.push("/login")} style={{ display:"block",width:"100%",marginBottom:10,padding:12,borderRadius:8,border:`1.5px solid ${d.border}`,background:"transparent",color:d.text,fontFamily:PJS,fontWeight:600,fontSize:15,cursor:"pointer" }}>Sign In</button>
            <button onClick={() => router.push("/signup")} style={{ display:"block",width:"100%",padding:12,borderRadius:8,background:"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:15,border:"none",cursor:"pointer" }}>Get Started Free</button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ position:"relative", overflow:"hidden" }}>

        {/* soft warm glow — sits behind content */}
        <div className="hero-glow-1" style={{ position:"absolute", top:-100, left:-80, width:560, height:560, borderRadius:"50%", zIndex:0, pointerEvents:"none",
          background:"radial-gradient(circle, rgba(196,80,26,0.08) 0%, transparent 70%)" }}/>
        {/* soft teal glow — sits behind content */}
        <div className="hero-glow-2" style={{ position:"absolute", bottom:-80, right:-60, width:480, height:480, borderRadius:"50%", zIndex:0, pointerEvents:"none",
          background:"radial-gradient(circle, rgba(67,100,100,0.07) 0%, transparent 70%)" }}/>

        {/* ── content at z-index 1 ── */}
        <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"120px 32px 80px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:48, alignItems:"center" }}>

            {/* left — copy */}
            <div>
              <div style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"5px 14px",borderRadius:999,border:"1px solid rgba(196,80,26,0.25)",background:"rgba(196,80,26,0.06)",marginBottom:22 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:"#c4501a" }}/>
                <span style={{ fontFamily:MRP,fontWeight:700,fontSize:11,color:"#c4501a",letterSpacing:"0.1em",textTransform:"uppercase" }}>Zero Cost · AI-Powered · 12+ Languages</span>
              </div>

              <h1 style={{ fontFamily:PJS,fontWeight:800,fontSize:"clamp(38px,6.5vw,64px)",lineHeight:1.0,letterSpacing:"-0.025em",color:d.text,margin:"0 0 20px", animation: "heroSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
                From <span className="animated-gradient-crisis">Crisis</span><br/>
                to <span className="animated-gradient-profit">Profit</span><br/>
                in Seconds.
              </h1>

              <p style={{ fontFamily:MRP,fontSize:16,lineHeight:1.7,color:d.textSub,margin:"0 0 28px",maxWidth:440, animation: "heroSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }}>
                Your AI farming companion that diagnoses crop diseases instantly, gives weather-smart treatment plans in your language, and finds you the best mandi price — completely free.
              </p>

              <div style={{ display:"flex",flexWrap:"wrap",gap:12,marginBottom:32, animation: "heroSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }}>
                <button onClick={() => router.push("/signup")} className="btn-pulse" style={{ display:"flex",alignItems:"center",gap:8,padding:"13px 26px",borderRadius:8,background:"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:15,border:"none",cursor:"pointer",boxShadow:"0 6px 24px rgba(196,80,26,0.3)" }}>
                  <Camera size={16}/>Scan Your Crop Free
                </button>
                <button onClick={() => router.push("/login")} className="btn-secondary-hover" style={{ display:"flex",alignItems:"center",gap:8,padding:"13px 22px",borderRadius:8,background:"transparent",color:d.text,fontFamily:PJS,fontWeight:600,fontSize:15,border:`1.5px solid ${d.border}`,cursor:"pointer" }}>
                  Watch Demo<ArrowRight size={15}/>
                </button>
              </div>

              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ display:"flex" }}>
                  {[["RK","#c4501a"],["PD","#436464"],["SS","#456348"]].map(([i,c],idx) => (
                    <div key={idx} style={{ width:32,height:32,borderRadius:"50%",background:c,border:`2px solid ${d.bg}`,marginLeft:idx?-8:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:PJS,fontWeight:800,fontSize:10,color:"#fff" }}>{i}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display:"flex",gap:2,marginBottom:2 }}>{[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ fill:"#f59e0b",color:"#f59e0b" }}/>)}</div>
                  <p style={{ fontFamily:MRP,fontSize:12,color:d.textMuted,margin:0 }}>Trusted by <strong style={{ color:d.text }}>2,40,000+</strong> farmers</p>
                </div>
              </div>
            </div>

            {/* right — produce image with floating card */}
            <div className="hero-img-container" style={{ position:"relative", borderRadius:20, overflow:"hidden", border:`1px solid ${d.border}`, boxShadow:shadow(isDark,3), animation: "heroSlideUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" }}>
              <img
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=680&h=460&fit=crop&auto=format"
                alt="Fresh farm produce — vegetables and crops"
                style={{ width:"100%", height:380, objectFit:"cover", display:"block" }}
              />
              <div style={{ position:"absolute",inset:0,background:`linear-gradient(to top,${d.bg} 0%,transparent 50%)` }}/>
              {/* floating diagnosis card */}
              <div className="hero-diag-card" style={{ position:"absolute",bottom:20,left:16,right:16,background:isDark?"rgba(38,28,19,0.96)":"rgba(255,255,255,0.97)",backdropFilter:"blur(14px)",border:`1px solid ${d.border}`,borderRadius:14,padding:"14px 18px",boxShadow:shadow(isDark,2) }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <div>
                    <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:3 }}>
                      <CheckCircle size={13} color="#456348"/>
                      <span style={{ fontFamily:PJS,fontWeight:700,fontSize:12,color:"#456348" }}>Late Blight Detected — 96%</span>
                    </div>
                    <p style={{ fontFamily:MRP,fontSize:11,color:d.textMuted,margin:0 }}>Spray after 4 PM · Rain clears at 3:30 PM</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:MRP,fontSize:10,color:d.textMuted,margin:"0 0 1px" }}>Best mandi</p>
                    <p style={{ fontFamily:PJS,fontWeight:800,fontSize:17,color:"#c4501a",margin:0 }}>₹3,100/qtl</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── checkered grid overlay ── */}
        <div style={{
          position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
          backgroundImage: isDark
            ? "linear-gradient(rgba(255,248,245,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,248,245,0.045) 1px,transparent 1px)"
            : "linear-gradient(rgba(35,26,19,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(35,26,19,0.07) 1px,transparent 1px)",
          backgroundSize:"44px 44px",
        }}/>

      </section>

      {/* STATS */}
      <div style={{ borderTop:`1px solid ${d.border}`,borderBottom:`1px solid ${d.border}`,background:isDark?"rgba(38,28,19,0.5)":"rgba(254,234,222,0.5)" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"24px 32px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16 }}>
          {[["30s","Detection time","vs 3 days before"],["40%","Less crop loss","from early diagnosis"],["30%","Higher earnings","with mandi prices"],["96%","AI accuracy","on 50+ crops"]].map(([v,l,s],i) => (
            <RevealOnScroll key={i} delay={i * 0.08} y={16}>
              <div className="stat-card" style={{ textAlign:"center", cursor: "pointer" }}>
                <p style={{ fontFamily:PJS,fontWeight:800,fontSize:28,color:"#c4501a",margin:0 }}>{v}</p>
                <p style={{ fontFamily:MRP,fontWeight:600,fontSize:13,color:d.text,margin:"2px 0 0" }}>{l}</p>
                <p style={{ fontFamily:MRP,fontSize:11,color:d.textMuted,margin:"1px 0 0" }}>{s}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" style={{ maxWidth:1280,margin:"0 auto",padding:"80px 32px" }}>
        <RevealOnScroll>
          <div style={{ textAlign:"center",marginBottom:52 }}>
            <p style={{ fontFamily:MRP,fontWeight:700,fontSize:11,color:"#c4501a",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 10px" }}>The See–Predict–Earn Workflow</p>
            <h2 style={{ fontFamily:PJS,fontWeight:800,fontSize:"clamp(28px,4vw,40px)",letterSpacing:"-0.01em",color:d.text,margin:0 }}>Three Tools. One Mission.</h2>
          </div>
        </RevealOnScroll>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:20 }}>
          {FEATURES.map((f,i) => (
            <RevealOnScroll key={i} delay={i * 0.15}>
              <div className="feature-card" style={{ padding:28,borderRadius:16,border:`1px solid ${d.border}`,background:d.card,boxShadow:shadow(isDark,1), cursor: "pointer" }}>
                <div className="feature-icon-wrapper" style={{ display:"inline-flex",alignItems:"center",gap:7,padding:"4px 12px",borderRadius:999,background:`${f.color}14`,border:`1px solid ${f.color}30`,marginBottom:18, transition:"all 0.3s ease" }}>
                  <f.icon size={13} color={f.color}/>
                  <span style={{ fontFamily:MRP,fontWeight:700,fontSize:11,color:f.color,textTransform:"uppercase",letterSpacing:"0.08em" }}>{f.tag}</span>
                </div>
                <h3 style={{ fontFamily:PJS,fontWeight:700,fontSize:18,color:d.text,margin:"0 0 10px" }}>{f.title}</h3>
                <p style={{ fontFamily:MRP,fontSize:14,color:d.textSub,lineHeight:1.6,margin:"0 0 18px" }}>{f.desc}</p>
                {f.bullets.map((b,j) => (
                  <div key={j} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:j<f.bullets.length-1?8:0 }}>
                    <CheckCircle size={13} color={f.color}/>
                    <span style={{ fontFamily:MRP,fontWeight:600,fontSize:13,color:d.text }}>{b}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ background:isDark?"#140a04":"#231a13",padding:"72px 32px",textAlign:"center", position:"relative", overflow:"hidden" }}>
        {/* Soft background aura inside CTA */}
        <div style={{ position:"absolute", top:"-50%", left:"-30%", width:360, height:360, borderRadius:"50%", zIndex:0, pointerEvents:"none",
          background:"radial-gradient(circle, rgba(196,80,26,0.1) 0%, transparent 70%)" }}/>
        <div style={{ position:"absolute", bottom:"-50%", right:"-20%", width:420, height:420, borderRadius:"50%", zIndex:0, pointerEvents:"none",
          background:"radial-gradient(circle, rgba(67,100,100,0.08) 0%, transparent 70%)" }}/>
        
        <div style={{ position:"relative", zIndex:1 }}>
          <RevealOnScroll>
            <p style={{ fontFamily:MRP,fontWeight:700,fontSize:11,color:"rgba(255,181,153,0.7)",letterSpacing:"0.12em",textTransform:"uppercase",margin:"0 0 14px" }}>Free. Forever. For Every Farmer.</p>
            <h2 style={{ fontFamily:PJS,fontWeight:800,fontSize:"clamp(28px,4vw,44px)",letterSpacing:"-0.02em",color:"#fff8f5",margin:"0 0 14px" }}>Your farm deserves smarter tools.</h2>
            <p style={{ fontFamily:MRP,fontSize:16,color:"rgba(255,248,245,0.6)",margin:"0 0 32px",maxWidth:440,marginLeft:"auto",marginRight:"auto" }}>
              Join 2,40,000+ farmers already protecting their crops and earning more.
            </p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:12,justifyContent:"center" }}>
              <button onClick={() => router.push("/signup")} className="btn-pulse" style={{ display:"flex",alignItems:"center",gap:8,padding:"13px 28px",borderRadius:8,background:"#c4501a",color:"#fff",fontFamily:PJS,fontWeight:700,fontSize:15,border:"none",cursor:"pointer",boxShadow:"0 6px 24px rgba(196,80,26,0.35)" }}>
                Create Free Account<ArrowRight size={15}/>
              </button>
              <button onClick={() => router.push("/login")} className="btn-secondary-hover" style={{ padding:"13px 24px",borderRadius:8,background:"transparent",color:"rgba(255,248,245,0.8)",fontFamily:PJS,fontWeight:600,fontSize:15,border:"1.5px solid rgba(255,248,245,0.2)",cursor:"pointer" }}>Sign In</button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background:isDark?"#0c0502":"#1a0f07",borderTop:"1px solid rgba(255,248,245,0.06)",padding:"32px 32px 24px" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:16 }}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:26,height:26,borderRadius:7,background:"#c4501a",display:"flex",alignItems:"center",justifyContent:"center" }}><Leaf size={12} color="#fff"/></div>
            <span style={{ fontFamily:PJS,fontWeight:800,fontSize:16,color:"#fff8f5" }}>AgriGuard</span>
          </div>
          <p style={{ fontFamily:MRP,fontSize:12,color:"rgba(255,248,245,0.35)",margin:0 }}>© 2024 AgriGuard · Made for Indian Farmers · Kisan Mitr</p>
        </div>
      </footer>
    </div>
  );
}
