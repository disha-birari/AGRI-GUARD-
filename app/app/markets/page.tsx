"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, MapPin, IndianRupee, BarChart3 } from "lucide-react";
import { useTheme } from "@/lib/context";
import { MARKETS } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

const CROPS_LIST = ["Tomato","Onion","Potato","Chilli","Wheat","Rice","Maize","Cotton","Soybean","Sugarcane"];

const CROP_PRICES: Record<string, typeof MARKETS> = {
  Tomato:  MARKETS,
  Onion:   MARKETS.map(m => ({ ...m, price: m.price - 300, delta: m.delta - 50 })),
  Potato:  MARKETS.map(m => ({ ...m, price: m.price - 800, delta: m.delta + 20 })),
  Chilli:  MARKETS.map(m => ({ ...m, price: m.price + 1200, delta: m.delta + 100 })),
  Wheat:   MARKETS.map(m => ({ ...m, price: 2100 + (m.km * 2), delta: m.delta - 30 })),
  Rice:    MARKETS.map(m => ({ ...m, price: 1900 + (m.km * 3), delta: m.delta + 10 })),
};

export default function Markets() {
  const { d, isDark } = useTheme();
  const [crop, setCrop] = useState("Tomato");
  const [weight, setWeight] = useState(500);

  const prices = CROP_PRICES[crop] ?? MARKETS;
  const best = [...prices].sort((a, b) => b.price - a.price)[0];
  const worst = [...prices].sort((a, b) => a.price - b.price)[0];
  const diff = Math.round(((best.price - worst.price) * weight) / 100);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Mandi-Pro — Market Prices</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Live government AGMARKNET prices · Updated 15 min ago</p>
      </div>

      {/* Crop selector */}
      <div style={{ marginBottom: 20, background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 18, boxShadow: shadow(isDark, 1) }}>
        <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>Select Crop</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CROPS_LIST.map(c => (
            <button key={c} onClick={() => setCrop(c)} style={{ padding: "7px 16px", borderRadius: 999, border: `1.5px solid ${crop === c ? "#c4501a" : d.border}`, background: crop === c ? "rgba(196,80,26,0.1)" : "transparent", color: crop === c ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16 }}>

        {/* Price table */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden", boxShadow: shadow(isDark, 1) }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${d.border}` }}>
            <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Market Prices — {crop}</p>
          </div>
          {prices.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: i < prices.length - 1 ? `1px solid ${d.border}` : "none", background: m.best ? (isDark ? "rgba(196,80,26,0.06)" : "rgba(196,80,26,0.03)") : "transparent" }}>
              {m.best && <div style={{ width: 3, height: 40, borderRadius: 999, background: "#c4501a", flexShrink: 0 }} />}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(67,100,100,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color="#436464" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                  <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>{m.name.split(",")[0]}</p>
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: m.best ? "#c4501a" : d.text, margin: 0 }}>₹{m.price}<span style={{ fontFamily: MRP, fontSize: 11, fontWeight: 400, color: d.textMuted }}>/qtl</span></p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{m.name.split(",")[1]?.trim()} · {m.km} km</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    {m.delta > 0 ? <TrendingUp size={11} color="#456348" /> : <TrendingDown size={11} color="#ba1a1a" />}
                    <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: m.delta > 0 ? "#456348" : "#ba1a1a" }}>{m.delta > 0 ? "+" : ""}{m.delta}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Profit calculator */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <BarChart3 size={17} color="#c4501a" />
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 15, color: d.text, margin: 0 }}>Profit Calculator</p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted }}>Harvest weight</span>
                <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 20, color: "#c4501a" }}>{weight} kg</span>
              </div>
              <input type="range" min={100} max={2000} step={50} value={weight} onChange={e => setWeight(+e.target.value)}
                style={{ width: "100%", accentColor: "#c4501a", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>100 kg</span>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>2,000 kg</span>
              </div>
            </div>

            {prices.map((m, i) => {
              const earned = Math.round((m.price * weight) / 100);
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 9, background: m.best ? "rgba(196,80,26,0.06)" : "transparent", border: m.best ? "1px solid rgba(196,80,26,0.2)" : "transparent", marginBottom: 6 }}>
                  <div>
                    <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 12, color: d.text, margin: "0 0 1px" }}>{m.name.split(",")[0]}</p>
                    <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{m.km} km</p>
                  </div>
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 15, color: m.best ? "#c4501a" : d.text, margin: 0 }}>₹{earned.toLocaleString("en-IN")}</p>
                </div>
              );
            })}
          </div>

          {/* Savings callout */}
          <div style={{ padding: 18, borderRadius: 14, background: "rgba(196,80,26,0.06)", border: "1px solid rgba(196,80,26,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <IndianRupee size={16} color="#c4501a" />
              <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: "#c4501a", margin: 0 }}>Extra Earnings Opportunity</p>
            </div>
            <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: "0 0 10px", lineHeight: 1.5 }}>
              Selling at <strong>{best.name.split(",")[0]}</strong> instead of <strong>{worst.name.split(",")[0]}</strong> earns you:
            </p>
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 28, color: "#c4501a", margin: "0 0 4px" }}>+₹{diff.toLocaleString("en-IN")}</p>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>on your {weight} kg haul of {crop}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
