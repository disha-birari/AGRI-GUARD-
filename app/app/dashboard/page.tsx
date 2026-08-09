"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode, CSSProperties, ElementType } from "react";
import { Camera, Mic, CloudRain, IndianRupee, AlertTriangle, TrendingUp, CheckCircle, Clock, Award, Radar, ArrowRight, ShieldCheck, Ban, Sparkles } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth, useTheme } from "@/lib/context";
import { WEATHER, MARKETS, HEALTH_CHART, COMMUNITY_ALERTS, SEASON_REPORT } from "@/lib/data";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";

function Card({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  const { d, isDark } = useTheme();
  return (
    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1), ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  const { d } = useTheme();
  return <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>{children}</p>;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    treated:    ["#456348","rgba(69,99,72,0.12)"],
    consulting: ["#c4501a","rgba(196,80,26,0.12)"],
    healthy:    ["#436464","rgba(67,100,100,0.12)"],
    high:       ["#ba1a1a","rgba(186,26,26,0.1)"],
    medium:     ["#c4501a","rgba(196,80,26,0.1)"],
    low:        ["#456348","rgba(69,99,72,0.1)"],
  };
  const [col, bg] = map[status.toLowerCase()] ?? ["#8b7168","rgba(139,113,104,0.1)"];
  return <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: col, background: bg, padding: "3px 10px", borderRadius: 999 }}>{status}</span>;
}

export default function MainDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { d, isDark } = useTheme();

  const [scans, setScans] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const fetchedScans = await db.getScans(user?.id);
        const fetchedNotifs = await db.getNotifications(user?.id);
        if (active) {
          setScans(fetchedScans);
          setNotifications(fetchedNotifs);
        }
      } catch (err) {
        console.error("Failed to load dashboard data from Supabase", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, [user?.id]);

  const lastScan = scans[0] || { crop: "Tomato", disease: "Late Blight", confidence: 96, date: "Recent", status: "treated", img: "photo-1416879595882-3373a0480b5b", severity: "High" };
  const bestMarket = MARKETS[0];
  const nearestCommunityAlert = COMMUNITY_ALERTS[0];

  // The 3 Core Flowchart Branches
  const flowchartBranches = [
    {
      branchTag: "Branch 1: See Sick Plant",
      title: "Digital Doctor",
      desc: "Instant camera leaf diagnosis + Organic & Chemical treatment plans.",
      icon: Camera,
      color: "#c4501a",
      path: "/app/scanner",
      buttonText: "Scan Leaf Now →"
    },
    {
      branchTag: "Branch 2: Need Advice",
      title: "Smart Advisor",
      desc: "GPS weather check (Rain in 6h?) + Multilingual Agri-Voice assistant.",
      icon: CloudRain,
      color: "#436464",
      path: "/app/weather",
      buttonText: "Check Spray Window →"
    },
    {
      branchTag: "Branch 3: Ready to Sell",
      title: "Mandi Pro",
      desc: "Real-time AGMARKNET prices, price heatmap & GPS route navigation.",
      icon: IndianRupee,
      color: "#456348",
      path: "/app/markets",
      buttonText: "Find Best Market →"
    },
  ];

  return (
    <div>
      {/* Welcome & Farmer Context Header */}
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", marginBottom: 6 }}>
            <Sparkles size={12} color="#c4501a" />
            <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#c4501a", textTransform: "uppercase" }}>AGRI-GUARD · Central Farming Hub</span>
          </div>
          <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: "0 0 4px" }}>
            Namaste, {user?.name?.split(" ")[0] || "Kisan Mitr"}! 🌾
          </h1>
          <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
            {user?.village && `${user.village}, `}{user?.district || "Nashik"} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>

        {/* Quick Report Access */}
        <button 
          onClick={() => router.push("/app/history")}
          style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(69,99,72,0.1)", border: "1px solid rgba(69,99,72,0.3)", color: "#456348", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Award size={15} />View Season Report →
        </button>
      </div>

      {/* ── FLOWCHART 3 PRIMARY PATHWAYS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 20 }}>
        {flowchartBranches.map((b) => (
          <div 
            key={b.title} 
            style={{ 
              padding: "18px 20px", 
              borderRadius: 16, 
              border: `1.5px solid ${b.color}35`, 
              background: isDark ? `${b.color}0d` : `${b.color}06`, 
              boxShadow: shadow(isDark, 1),
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: b.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {b.branchTag}
                </span>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${b.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <b.icon size={18} color={b.color} />
                </div>
              </div>
              <h2 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: d.text, margin: "0 0 6px" }}>
                {b.title}
              </h2>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 16px", lineHeight: 1.45 }}>
                {b.desc}
              </p>
            </div>

            <button 
              onClick={() => router.push(b.path)}
              style={{ 
                width: "100%", 
                padding: "9px 14px", 
                borderRadius: 8, 
                background: b.color, 
                color: "#fff", 
                border: "none", 
                fontFamily: PJS, 
                fontWeight: 700, 
                fontSize: 13, 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              {b.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* ── REAL-WORLD AGRI-GUARD BREAKTHROUGHS ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
            ⚡ Advanced Enterprise & Community Tools
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 12 }}>
          {[
            {
              title: "Kisan-to-Kitchen",
              tag: "Direct Sale",
              desc: "Sell direct to consumers at +168% higher margins.",
              path: "/app/direct",
              col: "#456348"
            },
            {
              title: "Glut Early Warning",
              tag: "AI Predictor",
              desc: "14-day advance crash alerts & cold storage booking.",
              path: "/app/glut-forecast",
              col: "#ba1a1a"
            },
            {
              title: "Krishi-Share Rental",
              tag: "P2P Machinery",
              desc: "Rent tractors, harvesters & drones on-demand.",
              path: "/app/machinery",
              col: "#c4501a"
            },
            {
              title: "Smart Drip Ledger",
              tag: "FAO-56 ET",
              desc: "Precision irrigation schedule saving 42% water.",
              path: "/app/irrigation",
              col: "#436464"
            },
            {
              title: "PMFBY Loss Claim",
              tag: "Crisis Shield",
              desc: "Instant claim dossiers for hailstorm & flood damage.",
              path: "/app/insurance",
              col: "#8b5e3c"
            },
          ].map((tool, idx) => (
            <div
              key={idx}
              onClick={() => router.push(tool.path)}
              style={{
                padding: "14px 16px",
                borderRadius: 12,
                background: d.card,
                border: `1px solid ${d.border}`,
                boxShadow: shadow(isDark, 1),
                cursor: "pointer",
                transition: "all 0.15s ease",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = tool.col; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = d.border; }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: tool.col, background: `${tool.col}18`, padding: "2px 7px", borderRadius: 4, textTransform: "uppercase" }}>
                    {tool.tag}
                  </span>
                  <ArrowRight size={13} color={tool.col} />
                </div>
                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 14, color: d.text, margin: "0 0 4px" }}>
                  {tool.title}
                </h3>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textSub, margin: 0, lineHeight: 1.4 }}>
                  {tool.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── LIVE RADAR & TELEMETRY ROW ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 20 }}>
        
        {/* Community Disease Outbreak Radar Banner */}
        <Card style={{ borderLeft: "4px solid #ba1a1a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Radar size={16} color="#ba1a1a" />
              <SectionLabel>Community Outbreak Alert (Near You)</SectionLabel>
            </div>
            <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#ba1a1a", background: "rgba(186,26,26,0.12)", padding: "2px 8px", borderRadius: 999 }}>
              {nearestCommunityAlert.distanceKm} km away
            </span>
          </div>

          <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: "0 0 4px" }}>
            {nearestCommunityAlert.crop}: {nearestCommunityAlert.disease} outbreak
          </p>
          <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "0 0 12px" }}>
            Location: {nearestCommunityAlert.location} · {nearestCommunityAlert.date}
          </p>

          <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 14px", lineHeight: 1.45 }}>
            💡 <strong>Preventive Action:</strong> {nearestCommunityAlert.advice}
          </p>

          <button onClick={() => router.push("/app/notifications")} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "rgba(186,26,26,0.08)", border: "1px solid rgba(186,26,26,0.2)", color: "#ba1a1a", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            View All Nearby Outbreak Alerts →
          </button>
        </Card>

        {/* Digital Doctor Recent Scan Status */}
        <Card>
          <SectionLabel>Digital Doctor · Recent Leaf Diagnosis</SectionLabel>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
            <img src={`https://images.unsplash.com/${lastScan.img}?w=80&h=80&fit=crop&auto=format`} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 }}>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>{lastScan.disease}</p>
                <StatusBadge status={lastScan.status} />
              </div>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "0 0 6px" }}>Host: <strong>{lastScan.crop}</strong> · {lastScan.date}</p>
              
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                  <div style={{ width: `${lastScan.confidence}%`, height: "100%", borderRadius: 999, background: lastScan.confidence >= 90 ? "#456348" : "#c4501a" }} />
                </div>
                <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>{lastScan.confidence}%</span>
              </div>
            </div>
          </div>
          <button onClick={() => router.push("/app/scanner")} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", color: "#c4501a", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            Open Treatment Plan (Organic / Chemical) →
          </button>
        </Card>

        {/* Mandi-Pro Live Rate Best Match */}
        <Card>
          <SectionLabel>Mandi Pro · Real-Time Price Leader</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <div>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: 0 }}>{bestMarket.name.split(",")[0]}</p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{bestMarket.km} km away · {bestMarket.demand}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: "#c4501a", margin: 0 }}>₹{bestMarket.price}/qtl</p>
              <p style={{ fontFamily: MRP, fontSize: 11, color: "#456348", fontWeight: 700, margin: 0 }}>+{bestMarket.delta} vs avg</p>
            </div>
          </div>
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(69,99,72,0.06)", border: "1px solid rgba(69,99,72,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontFamily: MRP, fontSize: 12, color: "#456348" }}>Profit on 500kg harvest:</span>
            <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 13, color: "#456348" }}>₹{((bestMarket.price * 5)).toLocaleString("en-IN")}</span>
          </div>
          <button onClick={() => router.push("/app/markets")} style={{ width: "100%", padding: "8px", borderRadius: 8, background: "rgba(69,99,72,0.08)", border: "1px solid rgba(69,99,72,0.2)", color: "#456348", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            See Price Heatmap & Navigate →
          </button>
        </Card>
      </div>

      {/* ── CROP HEALTH TREND & SEASON TRACKER ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <Card>
          <SectionLabel>Crop Health Trend — Last 7 Scans</SectionLabel>
          <div style={{ width: "100%", height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HEALTH_CHART} margin={{ top: 0, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,248,245,0.06)" : "rgba(35,26,19,0.06)"} />
                <XAxis dataKey="date" tick={{ fontFamily: MRP, fontSize: 10, fill: d.textMuted }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontFamily: MRP, fontSize: 10, fill: d.textMuted }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 8, fontFamily: MRP, fontSize: 12 }} />
                <Line type="monotone" dataKey="healthy" stroke="#456348" strokeWidth={2} dot={false} name="Healthy" />
                <Line type="monotone" dataKey="diseased" stroke="#c4501a" strokeWidth={2} dot={false} name="Diseased" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Season Summary Widget */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <SectionLabel>Season Profit Boost</SectionLabel>
            <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#456348" }}>{SEASON_REPORT.seasonName}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ padding: "10px", borderRadius: 8, background: d.bgAlt }}>
              <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Estimated Yield Saved</p>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: "#c4501a", margin: "2px 0 0" }}>{SEASON_REPORT.estimatedYieldSavedKg} kg</p>
            </div>
            <div style={{ padding: "10px", borderRadius: 8, background: d.bgAlt }}>
              <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Extra Profit Earned</p>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: "#456348", margin: "2px 0 0" }}>+₹{SEASON_REPORT.netFinancialGainINR.toLocaleString("en-IN")}</p>
            </div>
          </div>

          <button onClick={() => router.push("/app/history")} style={{ width: "100%", padding: "9px", borderRadius: 8, background: "rgba(67,100,100,0.08)", border: "1px solid rgba(67,100,100,0.2)", color: "#436464", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
            Open Full Season Report & Records →
          </button>
        </Card>
      </div>
    </div>
  );
}
