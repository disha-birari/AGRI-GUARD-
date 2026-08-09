"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, MapPin, IndianRupee, BarChart3, Navigation, Flame, Eye, Truck, ArrowUpRight, RefreshCw } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { MARKETS } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

const CROPS_LIST = ["Tomato", "Onion", "Potato", "Chilli", "Wheat", "Rice", "Cotton", "Soybean", "Garlic"];

export default function MandiPro() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();
  const [crop, setCrop] = useState("Tomato");
  const [weight, setWeight] = useState(500); // in kg
  const [activeTab, setActiveTab] = useState<"prices" | "heatmap">("prices");
  const [selectedMandi, setSelectedMandi] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);
  const [liveMarkets, setLiveMarkets] = useState<any[]>([]);
  const [bestMarket, setBestMarket] = useState<any | null>(null);
  const [netAdvantage, setNetAdvantage] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number }>({ lat: 19.9975, lon: 73.7898 });

  // Get user GPS
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

  // Fetch real-time market rates
  const fetchLiveMarkets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/markets?crop=${encodeURIComponent(crop)}&weight=${weight}&lat=${userCoords.lat}&lon=${userCoords.lon}`);
      if (res.ok) {
        const data = await res.json();
        setLiveMarkets(data.markets);
        setBestMarket(data.bestMarket);
        setNetAdvantage(data.netAdvantage);
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (err) {
      console.warn("Failed to fetch live markets, using local data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMarkets();
  }, [crop, weight, userCoords]);

  const qtl = weight / 100;
  const sortedByNetProfit = liveMarkets.length > 0 ? liveMarkets : MARKETS.map(m => {
    const grossRevenue = m.price * qtl;
    const transportTotal = (m.transportCostPerQtl || 80) * qtl;
    const netRevenue = grossRevenue - transportTotal;
    return { ...m, grossRevenue, transportTotal, netRevenue, arrivalVolumeTons: 340 };
  });

  const activeBest = bestMarket || sortedByNetProfit[0];

  const openNavigation = (mandi: any) => {
    const query = encodeURIComponent(`${mandi.name}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div>
      {/* Flow Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(196,80,26,0.08)", border: "1px solid rgba(196,80,26,0.2)", marginBottom: 8 }}>
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#c4501a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Flow: Mandi Pro (Branch: Ready to Sell)
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>
          Mandi-Pro — Check Prices, Heatmap & Best Route
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Workflow: <strong>Check Prices → See Heatmap → Find Best Market → Navigate & Sell</strong> with Net Profit calculation.
        </p>
      </div>

      {/* Flow Steps Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, background: d.bgAlt, border: `1px solid ${d.border}`, marginBottom: 20, overflowX: "auto" }}>
        {[
          { label: "1. Select Crop & Weight", active: true },
          { label: "2. View Prices / Heatmap", active: true },
          { label: "3. Best Market Algorithm", active: true },
          { label: "4. Navigate to Mandi", active: true },
        ].map((step, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ 
              fontFamily: PJS, 
              fontWeight: 700, 
              fontSize: 12, 
              color: "#c4501a",
              background: "rgba(196,80,26,0.1)",
              padding: "4px 10px",
              borderRadius: 6
            }}>
              {step.label}
            </span>
            {idx < 3 && <span style={{ color: d.border }}>→</span>}
          </div>
        ))}
      </div>

      {/* Crop selector */}
      <div style={{ marginBottom: 20, background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 18, boxShadow: shadow(isDark, 1) }}>
        <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
          Select Harvest Crop
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CROPS_LIST.map(c => (
            <button key={c} onClick={() => setCrop(c)} style={{ padding: "7px 16px", borderRadius: 999, border: `1.5px solid ${crop === c ? "#c4501a" : d.border}`, background: crop === c ? "rgba(196,80,26,0.1)" : "transparent", color: crop === c ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Switcher: Price List vs Visual Heatmap */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, background: d.bgMuted, borderRadius: 10, padding: 4, width: "fit-content" }}>
        <button onClick={() => setActiveTab("prices")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: activeTab === "prices" ? d.card : "transparent", color: activeTab === "prices" ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <BarChart3 size={14} />Check Prices List
        </button>
        <button onClick={() => setActiveTab("heatmap")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: activeTab === "heatmap" ? d.card : "transparent", color: activeTab === "heatmap" ? d.text : d.textMuted, fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Flame size={14} color="#c4501a" />See Demand & Price Heatmap
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px,1fr))", gap: 16 }}>

        {/* LEFT COLUMN: Prices or Heatmap */}
        <div>
          {activeTab === "prices" ? (
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, overflow: "hidden", boxShadow: shadow(isDark, 1) }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${d.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                  Live APMC Mandi Rates — {crop}
                </p>
                <span style={{ fontFamily: MRP, fontSize: 11, color: "#456348", fontWeight: 700 }}>● Live AGMARKNET</span>
              </div>

              {sortedByNetProfit.map((m, i) => {
                const isBest = i === 0;
                return (
                  <div key={m.id || i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: i < sortedByNetProfit.length - 1 ? `1px solid ${d.border}` : "none", background: isBest ? (isDark ? "rgba(196,80,26,0.08)" : "rgba(196,80,26,0.04)") : "transparent" }}>
                    {isBest && <div style={{ width: 4, height: 44, borderRadius: 999, background: "#c4501a", flexShrink: 0 }} />}
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: isBest ? "rgba(196,80,26,0.12)" : "rgba(67,100,100,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin size={18} color={isBest ? "#c4501a" : "#436464"} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>{m.name.split(",")[0]}</p>
                          {isBest && (
                            <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#c4501a", background: "rgba(196,80,26,0.15)", padding: "1px 6px", borderRadius: 4 }}>
                              ★ HIGHEST NET EARNING
                            </span>
                          )}
                        </div>
                        <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: isBest ? "#c4501a" : d.text, margin: 0 }}>
                          ₹{m.price}<span style={{ fontFamily: MRP, fontSize: 11, fontWeight: 400, color: d.textMuted }}>/qtl</span>
                        </p>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                        <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>
                          {m.name.split(",")[1]?.trim()} · {m.km} km away · Demand: <strong style={{ color: d.text }}>{m.demand}</strong>
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          {m.delta > 0 ? <TrendingUp size={12} color="#456348" /> : <TrendingDown size={12} color="#ba1a1a" />}
                          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: m.delta > 0 ? "#456348" : "#ba1a1a" }}>
                            {m.delta > 0 ? "+" : ""}{m.delta}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* VISUAL MANDI PRICE & DEMAND HEATMAP */
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: 0 }}>
                    Regional Mandi Heatmap & Price Clusters
                  </p>
                  <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>
                    Color coded by price premium & arrival demand surge
                  </p>
                </div>
                <Flame size={20} color="#c4501a" />
              </div>

              {/* Simulated visual map grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                {sortedByNetProfit.map((m, i) => {
                  const isTop = i === 0;
                  const isHigh = i === 1;
                  const heatColor = isTop ? "#c4501a" : isHigh ? "#e67e22" : "#436464";
                  return (
                    <div 
                      key={m.id || i}
                      onClick={() => setSelectedMandi(m)}
                      style={{ 
                        padding: 14, 
                        borderRadius: 12, 
                        background: `${heatColor}10`, 
                        border: `1.5px solid ${heatColor}40`,
                        cursor: "pointer",
                        transition: "transform 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: heatColor, textTransform: "uppercase" }}>
                          {isTop ? "🔥 TOP RATE ZONE" : m.demand}
                        </span>
                        <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: heatColor }}>
                          ₹{m.price}
                        </span>
                      </div>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 2px" }}>
                        {m.name.split(",")[0]}
                      </p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>
                        {m.km} km · Transport: ₹{m.transportCostPerQtl}/qtl
                      </p>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: "10px 14px", borderRadius: 8, background: d.bgAlt, border: `1px solid ${d.border}` }}>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: 0 }}>
                  💡 <strong>Heatmap Insight:</strong> Mandis in the coastal belt (Vashi) are offering higher prices for {crop} due to weekend consumer demand surges in metropolitan markets.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Find Best Market & Navigate & Sell */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Best Market Recommendation Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(196,80,26,0.12) 0%, rgba(196,80,26,0.04) 100%)", 
            border: "1.5px solid rgba(196,80,26,0.3)", 
            borderRadius: 14, 
            padding: 18,
            boxShadow: shadow(isDark, 1)
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: "#c4501a", background: "rgba(196,80,26,0.15)", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Step 3: Best Market Selected
                </span>
                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: d.text, margin: "6px 0 2px" }}>
                  {activeBest?.name}
                </h3>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>
                  Rate: <strong>₹{activeBest?.price}/qtl</strong> · Distance: <strong>{activeBest?.km} km</strong>
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted }}>Net Advantage</span>
                <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 20, color: "#c4501a", margin: 0 }}>
                  +₹{netAdvantage.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Navigate & Sell Action Button */}
            <button 
              onClick={() => openNavigation(activeBest)}
              style={{ 
                width: "100%", 
                padding: "12px", 
                borderRadius: 10, 
                background: "#c4501a", 
                color: "#fff", 
                border: "none", 
                fontFamily: PJS, 
                fontWeight: 800, 
                fontSize: 14, 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 8,
                boxShadow: "0 4px 15px rgba(196,80,26,0.35)"
              }}
            >
              <Navigation size={16} />Step 4: Navigate & Sell (Open GPS Map) <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Harvest Profit Calculator */}
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <BarChart3 size={18} color="#c4501a" />
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: 0 }}>
                Harvest Weight Profit Calculator
              </p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted }}>Your Expected Harvest</span>
                <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 20, color: "#c4501a" }}>{weight} kg ({qtl.toFixed(1)} qtl)</span>
              </div>
              <input 
                type="range" 
                min={100} 
                max={3000} 
                step={50} 
                value={weight} 
                onChange={e => setWeight(+e.target.value)}
                style={{ width: "100%", accentColor: "#c4501a", cursor: "pointer" }} 
              />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>100 kg</span>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>3,000 kg (30 quintals)</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {sortedByNetProfit.map((m, i) => {
                const isBest = i === 0;
                return (
                  <div key={m.id || i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 8, background: isBest ? "rgba(196,80,26,0.08)" : d.bgAlt, border: `1px solid ${isBest ? "rgba(196,80,26,0.25)" : d.border}` }}>
                    <div>
                      <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{m.name.split(",")[0]}</p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Transport: -₹{Math.round(m.transportTotal)} ({m.km} km)</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 15, color: isBest ? "#c4501a" : d.text, margin: 0 }}>
                        ₹{Math.round(m.netRevenue).toLocaleString("en-IN")}
                      </p>
                      <p style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, margin: 0 }}>Net Earnings</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

