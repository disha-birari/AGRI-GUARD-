"use client";

import { useState, useEffect } from "react";
import type { ElementType } from "react";
import { CloudRain, TrendingUp, AlertTriangle, CheckCircle, Bell, BellOff, Radar, ShieldAlert, MapPin, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
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

  useEffect(() => {
    let active = true;
    async function loadData() {
      try {
        const data = await db.getNotifications(user?.id);
        if (active) setNotifs(data);

        // Fetch live geo-spatial community outbreaks
        const lat = 19.9975;
        const lon = 73.7898;
        const res = await fetch(`/api/community?lat=${lat}&lon=${lon}`);
        if (res.ok) {
          const json = await res.json();
          if (active && json.alerts?.length > 0) {
            setCommunityAlerts(json.alerts);
          }
        }
      } catch (err) {
        console.error("Failed to load notifications/outbreaks", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadData();
    return () => { active = false; };
  }, [user?.id]);

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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
          {communityAlerts.map(alert => (
            <div key={alert.id} style={{ padding: 14, borderRadius: 12, background: d.card, border: `1px solid ${d.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: alert.severity === "high" ? "#ba1a1a" : "#c4501a", background: alert.severity === "high" ? "rgba(186,26,26,0.12)" : "rgba(196,80,26,0.12)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                    {alert.distanceKm} km away · {alert.severity} risk
                  </span>
                  <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: "6px 0 2px" }}>
                    {alert.crop}: {alert.disease}
                  </h3>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <MapPin size={11} /> {alert.location} · {alert.date} ({alert.cases} farms reporting)
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

