"use client";

import type { ElementType, ReactNode } from "react";
import { CloudRain, Wind, Droplets, Sun, AlertTriangle, CheckCircle, Thermometer } from "lucide-react";
import { useTheme, useAuth } from "@/lib/context";
import { WEATHER } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

const ICONS: Record<string, ElementType> = { sun: Sun, cloud: Droplets, rain: CloudRain };
const SEV_COLORS: Record<string, string> = { high: "#ba1a1a", medium: "#c4501a", low: "#456348" };
const SEV_BG: Record<string, string> = { high: "rgba(186,26,26,0.08)", medium: "rgba(196,80,26,0.08)", low: "rgba(69,99,72,0.08)" };

export default function Weather() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();

  const card = (children: ReactNode, style = {}) => (
    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1), ...style }}>{children}</div>
  );

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Weather Intelligence</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Smart weather insights for {user?.district}, {user?.state} — updated every 15 minutes.</p>
      </div>

      {/* Current conditions */}
      {card(
        <div>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>Current Conditions</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 16 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(196,80,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Thermometer size={26} color="#c4501a" />
              </div>
              <div>
                <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 30, color: d.text, margin: 0, lineHeight: 1 }}>{WEATHER.current.temp}°C</p>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "3px 0 0" }}>Feels {WEATHER.current.feels}°C</p>
              </div>
            </div>
            {[
              { label: "Humidity", val: `${WEATHER.current.humidity}%`, Icon: Droplets, col: "#436464" },
              { label: "Wind",     val: `${WEATHER.current.wind} km/h`, Icon: Wind,     col: "#456348" },
              { label: "UV Index", val: `${WEATHER.current.uv} / 10`,   Icon: Sun,      col: "#8b5e3c" },
            ].map(({ label, val, Icon, col }) => (
              <div key={label} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${col}14`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} color={col} />
                </div>
                <div>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 1px" }}>{label}</p>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 16, color: d.text, margin: 0 }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </div>,
        { marginBottom: 16 }
      )}

      {/* 7-day forecast */}
      {card(
        <div>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>7-Day Forecast</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(70px,1fr))", gap: 8 }}>
            {WEATHER.forecast.map((f, i) => {
              const Icon = ICONS[f.icon] ?? Sun;
              const isRainy = f.rain > 30;
              return (
                <div key={i} style={{ padding: "12px 8px", borderRadius: 12, border: `1px solid ${isRainy ? "rgba(67,100,100,0.25)" : d.border}`, background: isRainy ? "rgba(67,100,100,0.06)" : "transparent", textAlign: "center" }}>
                  <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, margin: "0 0 8px" }}>{f.day}</p>
                  <Icon size={18} color={isRainy ? "#436464" : "#c4501a"} style={{ margin: "0 auto 8px" }} />
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 2px" }}>{f.high}°</p>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 5px" }}>{f.low}°</p>
                  {f.rain > 0 && (
                    <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: "#436464", margin: 0 }}>{f.rain}%</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>,
        { marginBottom: 16 }
      )}

      {/* Alerts + Spray recommendations */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
        {card(
          <div>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Smart Alerts</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WEATHER.alerts.map((a, i) => {
                const col = SEV_COLORS[a.sev];
                const bg = SEV_BG[a.sev];
                const Icon = a.sev === "high" ? AlertTriangle : a.sev === "low" ? CheckCircle : AlertTriangle;
                return (
                  <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: bg, border: `1px solid ${col}25`, display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon size={15} color={col} style={{ flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0, lineHeight: 1.5 }}>{a.msg}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {card(
          <div>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Spray Calendar This Week</p>
            {[
              { day: "Today (Mon)", status: "good",    note: "6–9 AM or 5–7 PM · Wind optimal" },
              { day: "Tuesday",     status: "avoid",   note: "40% rain chance · Do NOT spray" },
              { day: "Wednesday",   status: "avoid",   note: "70% rain · Heavy rain expected" },
              { day: "Thursday",    status: "caution", note: "20% chance · Wait till evening" },
              { day: "Friday",      status: "good",    note: "Clear skies · Best window all week" },
            ].map(({ day, status, note }) => {
              const col = status === "good" ? "#456348" : status === "avoid" ? "#ba1a1a" : "#c4501a";
              const Icon = status === "good" ? CheckCircle : AlertTriangle;
              return (
                <div key={day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: `1px solid ${d.border}` }}>
                  <Icon size={14} color={col} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{day}</p>
                    <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{note}</p>
                  </div>
                  <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: col, background: `${col}12`, padding: "2px 8px", borderRadius: 999, textTransform: "capitalize" }}>{status === "good" ? "✓ Spray" : status === "avoid" ? "✗ Skip" : "⚠ Caution"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
