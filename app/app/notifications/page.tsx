"use client";

import { useState, useEffect, useRef } from "react";
import type { ElementType } from "react";
import { CloudRain, TrendingUp, AlertTriangle, CheckCircle, Bell, BellOff, Radar, ShieldAlert, MapPin, ArrowRight, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth, useTheme } from "@/lib/context";
import { db } from "@/lib/db";
import { PJS, MRP, shadow } from "@/lib/ds";
import { COMMUNITY_ALERTS } from "@/lib/data";

type Filter = "all" | "community" | "unread" | "weather" | "price" | "disease";

const TYPE_META: Record<string, { icon: ElementType; color: string; label: string }> = {
  weather:   { icon: CloudRain,     color: "#436464", label: "Weather" },
  price:     { icon: TrendingUp,    color: "#456348", label: "Market"  },
  disease:   { icon: AlertTriangle, color: "#ba1a1a", label: "Disease" },
  system:    { icon: CheckCircle,   color: "#8b7168", label: "System"  },
  community: { icon: Radar,         color: "#c4501a", label: "Community Alert" },
};

export default function NotificationsAndCommunityAlerts() {
  const router = useRouter();
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");
  const [notifs, setNotifs] = useState<any[]>([]);
  const [communityAlerts, setCommunityAlerts] = useState<any[]>(COMMUNITY_ALERTS);
  const [loading, setLoading] = useState(true);
  const [userCoords, setUserCoords] = useState({ lat: 19.9975, lon: 73.7898 });
  const [hoveredAlert, setHoveredAlert] = useState<any | null>(null);

  // Load user GPS coordinates if available
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => console.log("Using default Nashik Mandi coordinates")
      );
    }
  }, []);

  // Fetch notifications and poll community outbreaks
  useEffect(() => {
    let active = true;
    async function loadNotifications() {
      try {
        const data = await db.getNotifications(user?.id);
        if (active) setNotifs(data);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    }
    loadNotifications();

    async function fetchOutbreaks() {
      try {
        const res = await fetch(`/api/community?lat=${userCoords.lat}&lon=${userCoords.lon}&radius=35`);
        if (res.ok) {
          const json = await res.json();
          if (active && json.alerts) {
            setCommunityAlerts(json.alerts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch community outbreaks", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchOutbreaks();

    const interval = setInterval(fetchOutbreaks, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [user?.id, userCoords]);

  // Simulate a live outbreak reported by another farmer after 10 seconds
  useEffect(() => {
    const simTimeout = setTimeout(async () => {
      try {
        const res = await fetch("/api/community", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop: "Wheat",
            disease: "Yellow Rust",
            severity: "high",
            lat: 19.9200, 
            lon: 73.6800, 
            location: "Igatpuri Hills Cluster",
            advice: "High wind velocity will spread spores. Apply Propiconazole 25% EC @ 1ml/L immediately."
          })
        });
        if (res.ok) {
          toast.warning("🚨 EMERGENCY BROADCAST: New Wheat Yellow Rust outbreak reported 14.2 km away! Wind is blowing in your direction.", {
            duration: 8000
          });
        }
      } catch (e) {
        console.error("Outbreak simulation failed", e);
      }
    }, 10000);

    return () => clearTimeout(simTimeout);
  }, []);

  const markAllRead = async () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    for (const n of notifs) {
      if (!n.read) {
        await db.markNotificationRead(n.id);
      }
    }
  };

  const markRead = async (id: string) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    await db.markNotificationRead(id);
  };

  const unread = notifs.filter(n => !n.read).length;

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all",       label: `All Alerts (${notifs.length})` },
    { id: "community", label: `🚨 Disease Near You (${COMMUNITY_ALERTS.length})` },
    { id: "unread",    label: `Unread (${unread})` },
    { id: "weather",   label: "Weather" },
    { id: "price",     label: "Market" },
    { id: "disease",   label: "Crop Health" },
  ];

  return (
    <div>
      {/* Flow Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(186,26,26,0.08)", border: "1px solid rgba(186,26,26,0.2)", marginBottom: 8 }}>
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#ba1a1a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flow: Save to History → Community Alerts (Disease Near You!)
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>
              Community Alerts & Notifications
            </h1>
            <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
              Geo-fenced disease outbreak warnings within 25 km of {user?.district || "Nashik"} + Weather & Mandi updates.
            </p>
          </div>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${d.border}`, background: "transparent", color: d.textSub, fontFamily: PJS, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <BellOff size={14} />Mark all read
            </button>
          )}
        </div>
      </div>

      {/* ── FLOWCHART NODE: Community Alerts ("Disease near you!") ── */}
      <div style={{ marginBottom: 24, background: "linear-gradient(135deg, rgba(186,26,26,0.12) 0%, rgba(196,80,26,0.06) 100%)", border: "1.5px solid rgba(186,26,26,0.3)", borderRadius: 16, padding: 20, boxShadow: shadow(isDark, 1) }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Radar size={20} color="#ba1a1a" />
            <h2 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: d.text, margin: 0 }}>
              Live Outbreak Radar: Disease Near You (25 km Radius)
            </h2>
          </div>
          <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: "#ba1a1a", background: "rgba(186,26,26,0.15)", padding: "3px 10px", borderRadius: 999 }}>
            ● ACTIVE RADAR
          </span>
        </div>

        <style>{`
          @keyframes radar-sweep {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes radar-pulse {
            0% { r: 4px; opacity: 1; }
            50% { r: 10px; opacity: 0.7; }
            100% { r: 18px; opacity: 0; }
          }
        `}</style>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", lgGridTemplateColumns: "240px 1fr" } as any} className="grid lg:grid-cols-[240px_1fr] gap-6">
          {/* Visual Radar Sweep Screen */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "#050f07", border: "2px solid #1f3b25", borderRadius: 14, padding: "16px 12px", position: "relative", overflow: "hidden", minHeight: 240, justifyContent: "center" }}>
            <div style={{ position: "relative", width: 200, height: 200, borderRadius: "50%", border: "2px solid #2e5c38", background: "radial-gradient(circle, #0c2011 0%, #050d06 100%)" }}>
              {/* Concentric Circles */}
              <div style={{ position: "absolute", inset: 30, borderRadius: "50%", border: "1px dashed rgba(46,92,56,0.5)" }} />
              <div style={{ position: "absolute", inset: 65, borderRadius: "50%", border: "1px dashed rgba(46,92,56,0.5)" }} />
              <div style={{ position: "absolute", inset: 100, borderRadius: "50%", border: "1px dashed rgba(46,92,56,0.5)" }} />
              
              {/* Crosshairs */}
              <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(46,92,56,0.3)" }} />
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(46,92,56,0.3)" }} />

              {/* Sweeping Radar Line */}
              <div style={{ 
                position: "absolute", 
                width: 100, 
                height: 100, 
                top: 0, 
                left: 100, 
                transformOrigin: "bottom left", 
                background: "linear-gradient(45deg, rgba(74,186,101,0.2) 0%, rgba(74,186,101,0) 70%)", 
                borderRight: "2px solid rgba(74,186,101,0.85)", 
                animation: "radar-sweep 4s linear infinite",
                borderRadius: "0 100px 0 0"
              }} />

              {/* Home Base (Farmer's Location) */}
              <div style={{ position: "absolute", left: 95, top: 95, width: 10, height: 10, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Home size={10} color="#ffb599" style={{ filter: "drop-shadow(0 0 4px #c4501a)" }} />
              </div>

              {/* Dynamic Outbreak Pings */}
              {communityAlerts.map(alert => {
                // Calculate mapping coordinates (relative to userCoords)
                const dx = (alert.lon - userCoords.lon) * 480; // scale factor
                const dy = (alert.lat - userCoords.lat) * 480;
                
                // Clamp within radius of 90px from center (100, 100) to keep inside the radar circle
                const dist = Math.sqrt(dx * dx + dy * dy);
                let x = dx;
                let y = dy;
                if (dist > 90) {
                  x = (dx / dist) * 90;
                  y = (dy / dist) * 90;
                }
                const cx = 100 + x;
                const cy = 100 - y; // SVG y points down

                const isHovered = hoveredAlert?.id === alert.id;

                return (
                  <div 
                    key={alert.id} 
                    onMouseEnter={() => setHoveredAlert(alert)}
                    onMouseLeave={() => setHoveredAlert(null)}
                    style={{ 
                      position: "absolute", 
                      left: cx - 5, 
                      top: cy - 5, 
                      width: 10, 
                      height: 10, 
                      cursor: "pointer", 
                      zIndex: 20 
                    }}
                  >
                    {/* Pulsing Outer Ping Ring */}
                    <div style={{ 
                      position: "absolute", 
                      width: 20, 
                      height: 20, 
                      left: -5, 
                      top: -5, 
                      borderRadius: "50%", 
                      border: `1.5px solid ${alert.severity === "high" ? "#ba1a1a" : "#c4501a"}`, 
                      animation: "radar-pulse 2s infinite ease-out" 
                    }} />
                    {/* Core Dot */}
                    <div style={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: "50%", 
                      background: alert.severity === "high" ? "#ba1a1a" : "#c4501a", 
                      boxShadow: `0 0 10px ${alert.severity === "high" ? "#ba1a1a" : "#c4501a"}`,
                      border: "1px solid #fff"
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Radar Telemetry Information Dashboard */}
            <div style={{ marginTop: 12, textAlign: "center", width: "100%" }}>
              <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#7abe8b", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
                Active Scan Telemetry
              </p>
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: "#fff", margin: 0 }}>
                {hoveredAlert ? (
                  <span style={{ color: hoveredAlert.severity === "high" ? "#ffdad6" : "#ffb599" }}>
                    {hoveredAlert.crop} · {hoveredAlert.disease}
                  </span>
                ) : (
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Hover pings for telemetry</span>
                )}
              </p>
              {hoveredAlert && (
                <p style={{ fontFamily: MRP, fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "2px 0 0" }}>
                  Distance: {hoveredAlert.distanceKm} km away
                </p>
              )}
            </div>
          </div>

          {/* List of Community Outbreaks */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12, flex: 1 }}>
            {communityAlerts.map(alert => (
              <div 
                key={alert.id} 
                onMouseEnter={() => setHoveredAlert(alert)}
                onMouseLeave={() => setHoveredAlert(null)}
                style={{ 
                  padding: 14, 
                  borderRadius: 12, 
                  background: d.card, 
                  border: `1.5px solid ${hoveredAlert?.id === alert.id ? (alert.severity === "high" ? "#ba1a1a" : "#c4501a") : d.border}`,
                  transition: "all 0.15s",
                  boxShadow: shadow(isDark, 1)
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: alert.severity === "high" ? "#ba1a1a" : "#c4501a", background: alert.severity === "high" ? "rgba(186,26,26,0.12)" : "rgba(196,80,26,0.12)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                      {alert.distanceKm} km away · {alert.severity} risk
                    </span>
                    <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: "6px 0 2px" }}>
                      {alert.crop}: {alert.disease}
                    </h3>
                    <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                      <MapPin size={11} /> {alert.location} · {alert.date || "Just reported"} ({alert.cases} farms reporting)
                    </p>
                  </div>
                </div>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "8px 0 10px", lineHeight: 1.45 }}>
                  💡 <strong>Preemptive Advice:</strong> {alert.advice}
                </p>
                <button onClick={() => router.push("/app/scanner")} style={{ width: "100%", padding: "7px", borderRadius: 6, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", color: "#c4501a", fontFamily: PJS, fontWeight: 700, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                  Scan My Leaves to Prevent Spread →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: "7px 16px", borderRadius: 999, border: `1.5px solid ${filter === f.id ? "#c4501a" : d.border}`, background: filter === f.id ? "rgba(196,80,26,0.1)" : "transparent", color: filter === f.id ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      {filter !== "community" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifs.filter(n => {
            if (filter === "unread") return !n.read;
            if (filter === "all") return true;
            return n.type === filter;
          }).map(n => {
            const meta = TYPE_META[n.type] ?? TYPE_META.system;
            const SEV_COL: Record<string, string> = { high: "#ba1a1a", medium: "#c4501a", low: "#8b7168" };
            const sevCol = SEV_COL[n.sev] ?? "#8b7168";
            return (
              <div key={n.id}
                onClick={() => markRead(n.id)}
                style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px", borderRadius: 14, background: d.card, border: `1px solid ${!n.read ? (isDark ? "rgba(196,80,26,0.35)" : "rgba(196,80,26,0.2)") : d.border}`, boxShadow: shadow(isDark, 1), cursor: !n.read ? "pointer" : "default", transition: "all 0.15s", position: "relative" }}>
                {!n.read && <div style={{ position: "absolute", top: 18, right: 18, width: 8, height: 8, borderRadius: "50%", background: "#c4501a" }} />}

                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${meta.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <meta.icon size={17} color={meta.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontFamily: PJS, fontWeight: !n.read ? 800 : 700, fontSize: 14, color: d.text, margin: 0 }}>{n.title}</p>
                    <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, flexShrink: 0 }}>{n.time}</span>
                  </div>
                  <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 8px", lineHeight: 1.5 }}>{n.msg}</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: meta.color, background: `${meta.color}12`, padding: "2px 9px", borderRadius: 999 }}>{meta.label}</span>
                    <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: sevCol, background: `${sevCol}10`, padding: "2px 9px", borderRadius: 999, textTransform: "capitalize" }}>{n.sev} priority</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

