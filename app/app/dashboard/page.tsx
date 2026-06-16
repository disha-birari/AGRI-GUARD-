"use client";

import { useRouter } from "next/navigation";
import type { ReactNode, CSSProperties, ElementType } from "react";
import { Camera, Mic, CloudRain, IndianRupee, AlertTriangle, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAuth, useTheme } from "@/lib/context";
import { SCANS, WEATHER, MARKETS, NOTIFICATIONS, HEALTH_CHART } from "@/lib/data";
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

export default function FarmerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { d, isDark } = useTheme();

  const lastScan = SCANS[0];
  const unread = NOTIFICATIONS.filter(n => !n.read).length;
  const weatherRisk = "Medium";
  const bestMarket = MARKETS[0];

  const quickActions = [
    { label: "Scan Crop",     icon: Camera,      path: "/app/scanner", color: "#c4501a",  desc: "Detect diseases instantly" },
    { label: "Ask AI Voice",  icon: Mic,         path: "/app/voice",   color: "#436464",  desc: "Speak your problem" },
    { label: "Weather",       icon: CloudRain,   path: "/app/weather", color: "#456348",  desc: "Smart spray timing" },
    { label: "Markets",       icon: IndianRupee, path: "/app/markets", color: "#8b5e3c",  desc: "Best mandi prices" },
  ];

  const journeySteps = [
    { label: "SEE",     icon: Camera,      done: true,  path: "/app/scanner", note: "Last scan: Late Blight" },
    { label: "PREDICT", icon: CloudRain,   done: true,  path: "/app/weather", note: "Spray after 4 PM today" },
    { label: "EARN",    icon: IndianRupee, done: false, path: "/app/markets", note: "Check Vashi prices →" },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: "0 0 4px" }}>
          Namaste, {user?.name?.split(" ")[0]}! 🌾
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          {user?.village && `${user.village}, `}{user?.district} · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginBottom: 24 }}>
        {quickActions.map((a) => (
          <button key={a.label} onClick={() => router.push(a.path)}
            style={{ padding: "18px 16px", borderRadius: 14, border: `1px solid ${d.border}`, background: d.card, cursor: "pointer", textAlign: "left", boxShadow: shadow(isDark, 1), transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = shadow(isDark, 2); }}
            onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = shadow(isDark, 1); }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${a.color}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <a.icon size={20} color={a.color} />
            </div>
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: "0 0 2px" }}>{a.label}</p>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{a.desc}</p>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16, marginBottom: 16 }}>

        {/* Last scan */}
        <Card>
          <SectionLabel>Recent Scan</SectionLabel>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <img src={`https://images.unsplash.com/photo-${lastScan.img}?w=80&h=80&fit=crop&auto=format`} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>{lastScan.disease}</p>
                <StatusBadge status={lastScan.status} />
              </div>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 6px" }}>{lastScan.crop} · {lastScan.date}</p>
              {/* Confidence bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                  <div style={{ width: `${lastScan.confidence}%`, height: "100%", borderRadius: 999, background: lastScan.confidence >= 90 ? "#456348" : "#c4501a" }} />
                </div>
                <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>{lastScan.confidence}%</span>
              </div>
            </div>
          </div>
          <button onClick={() => router.push("/app/scanner")} style={{ marginTop: 14, width: "100%", padding: "9px", borderRadius: 8, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", color: "#c4501a", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Scan Again →
          </button>
        </Card>

        {/* Weather alert */}
        <Card>
          <SectionLabel>Weather Intelligence</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12 }}>
            <div>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 28, color: d.text, margin: "0 0 2px" }}>28°C</p>
              <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0 }}>Partly Cloudy · {user?.district}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 4px" }}>Spray Risk</p>
              <StatusBadge status={weatherRisk} />
            </div>
          </div>
          {WEATHER.alerts.slice(0, 2).map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderTop: i === 0 ? `1px solid ${d.border}` : "none", marginTop: i === 0 ? 0 : 0 }}>
              <AlertTriangle size={14} color={a.sev === "high" ? "#ba1a1a" : "#c4501a"} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: 0, lineHeight: 1.4 }}>{a.msg}</p>
            </div>
          ))}
          <button onClick={() => router.push("/app/weather")} style={{ marginTop: 12, width: "100%", padding: "9px", borderRadius: 8, background: "rgba(67,100,100,0.08)", border: "1px solid rgba(67,100,100,0.2)", color: "#436464", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Full Forecast →
          </button>
        </Card>

        {/* Mandi prices */}
        <Card>
          <SectionLabel>Nearby Mandi Prices</SectionLabel>
          {MARKETS.slice(0, 3).map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 2 ? `1px solid ${d.border}` : "none" }}>
              <div>
                <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{m.name.split(",")[0]}</p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{m.km} km away</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: "0 0 1px" }}>₹{m.price}/qtl</p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: m.delta > 0 ? "#456348" : "#ba1a1a", fontWeight: 700, margin: 0 }}>{m.delta > 0 ? "+" : ""}{m.delta}</p>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "rgba(196,80,26,0.06)", border: "1px solid rgba(196,80,26,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12, color: "#c4501a", margin: 0 }}>Best: {bestMarket.name.split(",")[0]}</p>
            <p style={{ fontFamily: MRP, fontSize: 11, color: "#c4501a", margin: 0, fontWeight: 700 }}>₹{bestMarket.price}/qtl ↑{bestMarket.delta}</p>
          </div>
          <button onClick={() => router.push("/app/markets")} style={{ marginTop: 10, width: "100%", padding: "9px", borderRadius: 8, background: "rgba(69,99,72,0.08)", border: "1px solid rgba(69,99,72,0.2)", color: "#456348", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Profit Calculator →
          </button>
        </Card>
      </div>

      {/* Health chart + Journey + Alerts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 16 }}>

        {/* Crop health trend */}
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
          <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
            {[["#456348","Healthy"],["#c4501a","Diseased"]].map(([col,label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 3, borderRadius: 999, background: col }} />
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Journey tracker */}
        <Card>
          <SectionLabel>Your Journey Today</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {journeySteps.map((s, i) => (
              <button key={s.label} onClick={() => router.push(s.path)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: `1px solid ${s.done ? "rgba(69,99,72,0.3)" : d.border}`, background: s.done ? "rgba(69,99,72,0.06)" : "transparent", cursor: "pointer", textAlign: "left", width: "100%" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: s.done ? "#456348" : d.bgMuted, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {s.done ? <CheckCircle size={18} color="#fff" /> : <s.icon size={18} color={d.textMuted} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{s.label}</p>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{s.note}</p>
                </div>
                <TrendingUp size={13} color={d.textMuted} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "10px 14px", borderRadius: 8, background: "rgba(196,80,26,0.06)", border: "1px solid rgba(196,80,26,0.15)" }}>
            <p style={{ fontFamily: MRP, fontSize: 12, color: "#c4501a", margin: 0 }}>
              💡 Complete all 3 steps to maximize your earning this season.
            </p>
          </div>
        </Card>

        {/* Alerts feed */}
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <SectionLabel>Alerts Feed</SectionLabel>
            <button onClick={() => router.push("/app/notifications")} style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: "#c4501a", background: "transparent", border: "none", cursor: "pointer" }}>View all</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {NOTIFICATIONS.filter(n => !n.read).map((n) => {
              const icons: Record<string, ElementType> = { weather: CloudRain, price: TrendingUp, disease: AlertTriangle, system: CheckCircle };
              const colors: Record<string, string> = { weather: "#436464", price: "#456348", disease: "#ba1a1a", system: "#8b7168" };
              const Icon = icons[n.type] ?? AlertTriangle;
              return (
                <div key={n.id} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: d.bgAlt, border: `1px solid ${d.border}` }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${colors[n.type]}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={14} color={colors[n.type]} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 12, color: d.text, margin: "0 0 1px" }}>{n.title}</p>
                    <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.msg}</p>
                  </div>
                  <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, flexShrink: 0, paddingTop: 2 }}>{n.time}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
