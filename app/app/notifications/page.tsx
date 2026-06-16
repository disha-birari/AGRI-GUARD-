"use client";

import { useState } from "react";
import type { ElementType } from "react";
import { CloudRain, TrendingUp, AlertTriangle, CheckCircle, Bell, BellOff } from "lucide-react";
import { useTheme } from "@/lib/context";
import { NOTIFICATIONS } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

type Filter = "all" | "unread" | "weather" | "price" | "disease";

const TYPE_META: Record<string, { icon: ElementType; color: string; label: string }> = {
  weather: { icon: CloudRain,    color: "#436464", label: "Weather" },
  price:   { icon: TrendingUp,   color: "#456348", label: "Market"  },
  disease: { icon: AlertTriangle,color: "#ba1a1a", label: "Disease" },
  system:  { icon: CheckCircle,  color: "#8b7168", label: "System"  },
};

export default function Notifications() {
  const { d, isDark } = useTheme();
  const [filter, setFilter] = useState<Filter>("all");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const filtered = notifs.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter === "all") return true;
    return n.type === filter;
  });

  const unread = notifs.filter(n => !n.read).length;

  const FILTERS: { id: Filter; label: string }[] = [
    { id: "all",     label: `All (${notifs.length})` },
    { id: "unread",  label: `Unread (${unread})` },
    { id: "weather", label: "Weather" },
    { id: "price",   label: "Market" },
    { id: "disease", label: "Disease" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Notifications</h1>
          <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
            {unread > 0 ? <><strong style={{ color: "#c4501a" }}>{unread} unread</strong> alerts need your attention.</> : "All caught up! No unread notifications."}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ padding: "9px 16px", borderRadius: 8, border: `1px solid ${d.border}`, background: "transparent", color: d.textSub, fontFamily: PJS, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <BellOff size={14} />Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: "7px 16px", borderRadius: 999, border: `1.5px solid ${filter === f.id ? "#c4501a" : d.border}`, background: filter === f.id ? "rgba(196,80,26,0.1)" : "transparent", color: filter === f.id ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 24px", background: d.card, border: `1px solid ${d.border}`, borderRadius: 14 }}>
          <Bell size={32} color={d.textMuted} style={{ margin: "0 auto 12px" }} />
          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 16, color: d.text, margin: "0 0 6px" }}>No notifications here</p>
          <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0 }}>Try a different filter or check back later.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(n => {
            const meta = TYPE_META[n.type] ?? TYPE_META.system;
            const SEV_COL: Record<string, string> = { high: "#ba1a1a", medium: "#c4501a", low: "#8b7168" };
            const sevCol = SEV_COL[n.sev] ?? "#8b7168";
            return (
              <div key={n.id}
                onClick={() => markRead(n.id)}
                style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "16px 18px", borderRadius: 14, background: d.card, border: `1px solid ${!n.read ? (isDark ? "rgba(196,80,26,0.35)" : "rgba(196,80,26,0.2)") : d.border}`, boxShadow: shadow(isDark, 1), cursor: !n.read ? "pointer" : "default", transition: "all 0.15s", position: "relative" }}>
                {/* Unread dot */}
                {!n.read && <div style={{ position: "absolute", top: 18, right: 18, width: 8, height: 8, borderRadius: "50%", background: "#c4501a" }} />}

                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${meta.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <meta.icon size={17} color={meta.color} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <p style={{ fontFamily: PJS, fontWeight: !n.read ? 800 : 700, fontSize: 14, color: d.text, margin: 0 }}>{n.title}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, flexShrink: 0 }}>{n.time}</span>
                    </div>
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
