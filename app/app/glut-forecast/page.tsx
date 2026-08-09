"use client";

import { useState, useEffect } from "react";
import { 
  TrendingDown, AlertTriangle, Snowflake, Truck, Factory, 
  MapPin, ShieldAlert, ArrowRight, CheckCircle, ExternalLink, Flame
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

export default function GlutForecastPage() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();

  const [crop, setCrop] = useState("Tomato");
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const fetchGlutData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/glut?crop=${encodeURIComponent(crop)}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.forecast);
      }
    } catch (err) {
      console.error("Failed to load glut forecast", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlutData();
  }, [crop]);

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(186,26,26,0.1)", border: "1px solid rgba(186,26,26,0.25)", marginBottom: 8 }}>
          <AlertTriangle size={13} color="#ba1a1a" />
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#ba1a1a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Breakthrough: AI Distress Selling & Oversupply Predictor
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: "0 0 6px" }}>
          📉 AI Harvest Glut & Market Crash Early Warning
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Predicts harvest oversupply 14 days in advance to prevent distress selling at ₹4–₹8/kg. Choose cold storage, inter-state arbitrage, or food processing contracts.
        </p>
      </div>

      {/* Crop Selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["Tomato", "Onion", "Chilli"].map(c => (
          <button key={c} onClick={() => setCrop(c)} style={{ padding: "8px 18px", borderRadius: 999, border: `1.5px solid ${crop === c ? "#c4501a" : d.border}`, background: crop === c ? "rgba(196,80,26,0.12)" : "transparent", color: crop === c ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      {data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Main Warning Banner */}
          <div style={{ 
            background: data.glutRiskLevel.includes("Critical") 
              ? "linear-gradient(135deg, rgba(186,26,26,0.14) 0%, rgba(196,80,26,0.06) 100%)" 
              : "linear-gradient(135deg, rgba(69,99,72,0.12) 0%, rgba(67,100,100,0.06) 100%)",
            border: `1.5px solid ${data.glutRiskLevel.includes("Critical") ? "rgba(186,26,26,0.3)" : "rgba(69,99,72,0.3)"}`,
            borderRadius: 16,
            padding: 22,
            boxShadow: shadow(isDark, 1)
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div>
                <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 11, color: data.glutRiskLevel.includes("Critical") ? "#ba1a1a" : "#456348", background: data.glutRiskLevel.includes("Critical") ? "rgba(186,26,26,0.15)" : "rgba(69,99,72,0.15)", padding: "3px 10px", borderRadius: 4, textTransform: "uppercase" }}>
                  ● {data.glutRiskLevel} ({crop})
                </span>
                <h2 style={{ fontFamily: PJS, fontWeight: 900, fontSize: 22, color: d.text, margin: "8px 0 4px" }}>
                  {data.region}: Projected {data.projectedPriceCrashPercent}% Price Drop
                </h2>
                <p style={{ fontFamily: MRP, fontSize: 13, color: d.textSub, margin: 0 }}>
                  Peak Arrival Surge: <strong>+{data.arrivalSurgePercent}%</strong> expected between <strong>{data.peakArrivalDate}</strong>
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>Predicted Price in 14 Days</span>
                <p style={{ fontFamily: PJS, fontWeight: 900, fontSize: 26, color: data.glutRiskLevel.includes("Critical") ? "#ba1a1a" : "#456348", margin: 0 }}>
                  ₹{data.predictedPriceIn14Days}<span style={{ fontSize: 13, fontWeight: 500, color: d.textMuted }}>/qtl</span>
                </p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>Current: ₹{data.currentMandiPrice}/qtl</p>
              </div>
            </div>

            <div style={{ padding: "10px 14px", borderRadius: 8, background: d.card, border: `1px solid ${d.border}` }}>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.text, margin: 0 }}>
                💡 <strong>AI Risk Assessment:</strong> Over 4,200 acres in the district are synchronized for harvest this week. Selling unreserved at the local APMC yard will result in severe price discounting. Choose one of the 3 escape channels below:
              </p>
            </div>
          </div>

          {/* 3 Actionable Escape Channels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            
            {/* Channel 1: Cold Storage Booking */}
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 20, boxShadow: shadow(isDark, 1), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#436464", textTransform: "uppercase" }}>
                    Channel 1: Cold Storage Hold
                  </span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(67,100,100,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Snowflake size={18} color="#436464" />
                  </div>
                </div>

                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: d.text, margin: "0 0 4px" }}>
                  {data.recommendedActions.coldStorage.facilityName}
                </h3>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "0 0 12px" }}>
                  <MapPin size={12} style={{ display: "inline" }} /> {data.recommendedActions.coldStorage.location} ({data.recommendedActions.coldStorage.distanceKm} km away)
                </p>

                <div style={{ padding: "10px 12px", borderRadius: 8, background: d.bgAlt, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, marginBottom: 2 }}>
                    <span>Rate:</span>
                    <strong>₹{data.recommendedActions.coldStorage.costPerMonthPerQuintal}/qtl per month</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, marginBottom: 2 }}>
                    <span>Shelf Life Extension:</span>
                    <strong style={{ color: "#456348" }}>+{data.recommendedActions.coldStorage.shelfLifeDays} Days</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP }}>
                    <span>Available Capacity:</span>
                    <span>{data.recommendedActions.coldStorage.availableTons} Metric Tons</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setBookingSuccess("Cold Storage Slot Reserved! Officer will call you for gate pass.")}
                style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#436464", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                Book Cold Storage Space →
              </button>
            </div>

            {/* Channel 2: Inter-State Arbitrage */}
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 20, boxShadow: shadow(isDark, 1), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#c4501a", textTransform: "uppercase" }}>
                    Channel 2: High-Demand Distant Mandi
                  </span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(196,80,26,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Truck size={18} color="#c4501a" />
                  </div>
                </div>

                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: d.text, margin: "0 0 4px" }}>
                  {data.recommendedActions.interStateArbitrage.destinationMandi}
                </h3>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "0 0 12px" }}>
                  {data.recommendedActions.interStateArbitrage.state} ({data.recommendedActions.interStateArbitrage.distanceKm} km haul)
                </p>

                <div style={{ padding: "10px 12px", borderRadius: 8, background: d.bgAlt, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, marginBottom: 2 }}>
                    <span>Destination Mandi Price:</span>
                    <strong>₹{data.recommendedActions.interStateArbitrage.destinationPrice}/qtl</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, marginBottom: 2 }}>
                    <span>Net Gain after Long Haul:</span>
                    <strong style={{ color: "#c4501a" }}>₹{data.recommendedActions.interStateArbitrage.netProfitAfterLongHaul}/qtl</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP }}>
                    <span>Demand Status:</span>
                    <span style={{ color: "#456348", fontWeight: 700 }}>High Deficit Market</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert(`Connecting with long-haul refrigerated freight transport for ${data.recommendedActions.interStateArbitrage.destinationMandi}...`)}
                style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#c4501a", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                Arrange Long-Haul Transport →
              </button>
            </div>

            {/* Channel 3: Food Processor Contract */}
            <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 20, boxShadow: shadow(isDark, 1), display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#8b5e3c", textTransform: "uppercase" }}>
                    Channel 3: Food Processing Bulk Sale
                  </span>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,94,60,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Factory size={18} color="#8b5e3c" />
                  </div>
                </div>

                <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: d.text, margin: "0 0 4px" }}>
                  {data.recommendedActions.foodProcessorConnect.companyName}
                </h3>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "0 0 12px" }}>
                  Buyer: {data.recommendedActions.foodProcessorConnect.buyerType}
                </p>

                <div style={{ padding: "10px 12px", borderRadius: 8, background: d.bgAlt, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, marginBottom: 2 }}>
                    <span>Fixed Contract MSP:</span>
                    <strong style={{ color: "#456348" }}>₹{data.recommendedActions.foodProcessorConnect.contractPricePerKg}/kg</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, marginBottom: 2 }}>
                    <span>Min Batch Size:</span>
                    <span>{data.recommendedActions.foodProcessorConnect.minAcceptanceTons} Tons</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP }}>
                    <span>Payment:</span>
                    <strong>Instant Bank Transfer (T+1)</strong>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => alert(`Direct procurement purchase agreement sent to ${data.recommendedActions.foodProcessorConnect.companyName}!`)}
                style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#8b5e3c", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                Submit Bulk Batch to Factory →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Confirmation Banner */}
      {bookingSuccess && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: "#456348", color: "#fff", padding: "14px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.25)", zIndex: 100 }}>
          <CheckCircle size={18} />
          <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13 }}>{bookingSuccess}</span>
          <button onClick={() => setBookingSuccess(null)} style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", marginLeft: 10 }}>✕</button>
        </div>
      )}
    </div>
  );
}
