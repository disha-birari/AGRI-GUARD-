"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, Sparkles, HeartHandshake, Truck, ShieldCheck, 
  MapPin, Clock, Users, ArrowRight, CheckCircle2, Leaf, 
  Percent, ChevronRight, Phone, AlertCircle
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

export default function DirectMarketplacePage() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();

  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCrop, setFilterCrop] = useState("All");
  const [organicOnly, setOrganicOnly] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);

  // Pre-order Form State
  const [orderKg, setOrderKg] = useState<number>(10);
  const [isSocietyGroup, setIsSocietyGroup] = useState(false);
  const [customerName, setCustomerName] = useState(user?.name || "Priya Sharma");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "+91 98200 12345");
  const [customerAddress, setCustomerAddress] = useState("Greenwood Society, Flat 402, Nashik");
  const [submitting, setSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/direct?crop=${encodeURIComponent(filterCrop)}&organic=${organicOnly}`);
      if (res.ok) {
        const json = await res.json();
        setBatches(json.batches || []);
      }
    } catch (err) {
      console.error("Failed to load direct harvest batches", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [filterCrop, organicOnly]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatch) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchId: selectedBatch.id,
          customerName,
          customerPhone,
          customerAddress,
          orderKg,
          isSocietyGroupOrder: isSocietyGroup
        })
      });
      if (res.ok) {
        const json = await res.json();
        setOrderReceipt(json.receipt);
        setSelectedBatch(null);
      }
    } catch (err) {
      console.error("Order error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(69,99,72,0.1)", border: "1px solid rgba(69,99,72,0.25)", marginBottom: 8 }}>
          <Sparkles size={13} color="#456348" />
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#456348", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Enterprise Breakthrough: Kisan-to-Kitchen Direct
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: "0 0 6px" }}>
          🌱 Kisan-to-Kitchen — Direct Farm Pre-Order Marketplace
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Direct farm-to-doorstep connect. Farmers get <strong>+168% higher earnings</strong> than mandi distress rates, and consumers get <strong>farm-fresh produce 38% cheaper</strong> than supermarkets.
        </p>
      </div>

      {/* Impact Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Middleman Markup Eliminated", val: "0% Cut", desc: "100% transparent pricing", col: "#456348" },
          { label: "Farmer Extra Income", val: "+168%", desc: "vs APMC distress mandi rates", col: "#c4501a" },
          { label: "Consumer Savings", val: "38% Off", desc: "vs Supermarket retail prices", col: "#436464" },
          { label: "Farm-to-Plate Time", val: "<12 Hours", desc: "Zero chemical ripening", col: "#8b5e3c" },
        ].map((kpi, idx) => (
          <div key={idx} style={{ padding: "14px 16px", borderRadius: 14, background: d.card, border: `1px solid ${d.border}`, boxShadow: shadow(isDark, 1) }}>
            <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 2px" }}>{kpi.label}</p>
            <p style={{ fontFamily: PJS, fontWeight: 900, fontSize: 22, color: kpi.col, margin: "0 0 2px" }}>{kpi.val}</p>
            <p style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, margin: 0 }}>{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Filter & Preferences Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 20, padding: 14, borderRadius: 12, background: d.bgAlt, border: `1px solid ${d.border}` }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["All", "Tomatoes", "Onions", "Capsicum", "Grapes"].map(c => (
            <button key={c} onClick={() => setFilterCrop(c)} style={{ padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${filterCrop === c ? "#456348" : d.border}`, background: filterCrop === c ? "rgba(69,99,72,0.12)" : "transparent", color: filterCrop === c ? "#456348" : d.textSub, fontFamily: MRP, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
              {c}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setOrganicOnly(!organicOnly)} 
          style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${organicOnly ? "#456348" : d.border}`, background: organicOnly ? "#456348" : "transparent", color: organicOnly ? "#fff" : d.textSub, fontFamily: PJS, fontWeight: 700, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
        >
          <Leaf size={14} />Organic & Natural Only
        </button>
      </div>

      {/* Harvest Batch Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 30 }}>
        {batches.map(batch => {
          const savingsPerKg = batch.supermarketPricePerKg - batch.farmerPricePerKg;
          return (
            <div 
              key={batch.id} 
              style={{ 
                borderRadius: 16, 
                background: d.card, 
                border: `1px solid ${d.border}`, 
                overflow: "hidden", 
                boxShadow: shadow(isDark, 1),
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <div>
                {/* Batch Image & Tag */}
                <div style={{ position: "relative", height: 160, width: "100%" }}>
                  <img src={batch.image} alt={batch.crop} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(35,26,19,0.85)", backdropFilter: "blur(4px)", color: "#fff", padding: "3px 10px", borderRadius: 999, fontFamily: MRP, fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={11} color="#c4501a" /> Harvest: {batch.harvestSchedule}
                  </span>
                  <span style={{ position: "absolute", top: 12, right: 12, background: "#456348", color: "#fff", padding: "3px 10px", borderRadius: 999, fontFamily: MRP, fontWeight: 800, fontSize: 10 }}>
                    {batch.bioCertification}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 17, color: d.text, margin: "0 0 2px" }}>
                        {batch.crop}
                      </h3>
                      <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>
                        {batch.variety}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: PJS, fontWeight: 900, fontSize: 20, color: "#456348", margin: 0 }}>
                        ₹{batch.farmerPricePerKg}<span style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted }}>/kg</span>
                      </p>
                      <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, textDecoration: "line-through", margin: 0 }}>
                        Retail: ₹{batch.supermarketPricePerKg}
                      </p>
                    </div>
                  </div>

                  {/* Farmer Credential */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: d.bgAlt, marginBottom: 12 }}>
                    <MapPin size={13} color="#c4501a" />
                    <p style={{ fontFamily: MRP, fontSize: 11, color: d.textSub, margin: 0 }}>
                      Farmer: <strong>{batch.farmerName}</strong> · {batch.farmerVillage}, {batch.farmerDistrict}
                    </p>
                  </div>

                  {/* Benefit highlights */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#456348" }}>
                      ✓ Save ₹{savingsPerKg}/kg vs Mall
                    </span>
                    <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#c4501a" }}>
                      ★ {batch.availableKg} kg batch remaining
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ padding: "0 18px 18px" }}>
                <button 
                  onClick={() => { setSelectedBatch(batch); setOrderKg(batch.minOrderKg); }}
                  style={{ 
                    width: "100%", 
                    padding: "11px", 
                    borderRadius: 10, 
                    background: "#456348", 
                    color: "#fff", 
                    border: "none", 
                    fontFamily: PJS, 
                    fontWeight: 800, 
                    fontSize: 13, 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: 6 
                  }}
                >
                  <ShoppingBag size={15} />Pre-Order from Farmer (Min {batch.minOrderKg}kg) →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pre-Order Modal */}
      {selectedBatch && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 18, width: "100%", maxWidth: 500, padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#456348", textTransform: "uppercase" }}>Direct Farm Pre-Order</span>
                <h2 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 19, color: d.text, margin: "2px 0 0" }}>{selectedBatch.crop}</h2>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Farmer: {selectedBatch.farmerName} ({selectedBatch.farmerVillage})</p>
              </div>
              <button onClick={() => setSelectedBatch(null)} style={{ background: "transparent", border: "none", color: d.textMuted, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              {/* Order Weight Slider */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 12, color: d.text }}>Quantity (kg)</label>
                  <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: "#456348" }}>{orderKg} kg</span>
                </div>
                <input 
                  type="range" 
                  min={selectedBatch.minOrderKg} 
                  max={Math.min(200, selectedBatch.availableKg)} 
                  step={5} 
                  value={orderKg} 
                  onChange={e => setOrderKg(+e.target.value)} 
                  style={{ width: "100%", accentColor: "#456348" }} 
                />
              </div>

              {/* Society Bulk Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 8, background: isSocietyGroup ? "rgba(69,99,72,0.1)" : d.bgAlt, border: `1px solid ${isSocietyGroup ? "#456348" : d.border}` }}>
                <input type="checkbox" id="society" checked={isSocietyGroup} onChange={e => setIsSocietyGroup(e.target.checked)} style={{ accentColor: "#456348", cursor: "pointer" }} />
                <label htmlFor="society" style={{ fontFamily: MRP, fontSize: 12, color: d.text, cursor: "pointer" }}>
                  <strong>Housing Society / Group Buying</strong> (Extra {selectedBatch.societyGroupDiscountPercent}% bulk discount applied)
                </label>
              </div>

              {/* Delivery Details */}
              <div>
                <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Delivery Address / Society Name</label>
                <input 
                  type="text" 
                  value={customerAddress} 
                  onChange={e => setCustomerAddress(e.target.value)} 
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4, boxSizing: "border-box" }} 
                />
              </div>

              {/* Transparent Bill Breakdown */}
              <div style={{ padding: "12px 14px", borderRadius: 10, background: d.bgAlt, border: `1px solid ${d.border}` }}>
                <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", margin: "0 0 6px" }}>Transparent Bill Breakdown</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, color: d.textSub, marginBottom: 2 }}>
                  <span>Farmer Payout (100% Direct):</span>
                  <strong>₹{Math.round(selectedBatch.farmerPricePerKg * (isSocietyGroup ? 0.9 : 1) * orderKg)}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: MRP, color: d.textSub, marginBottom: 4 }}>
                  <span>EV Eco-Delivery & Packaging (8%):</span>
                  <span>₹{Math.round(selectedBatch.farmerPricePerKg * orderKg * 0.08)}</span>
                </div>
                <div style={{ borderTop: `1px solid ${d.border}`, paddingTop: 6, display: "flex", justifyContent: "space-between", fontSize: 14, fontFamily: PJS, fontWeight: 800, color: d.text }}>
                  <span>Total Amount:</span>
                  <span style={{ color: "#456348" }}>₹{Math.round(selectedBatch.farmerPricePerKg * (isSocietyGroup ? 0.9 : 1) * orderKg * 1.08)}</span>
                </div>
                <p style={{ fontFamily: MRP, fontSize: 11, color: "#456348", margin: "6px 0 0", fontWeight: 700 }}>
                  🎉 You save ₹{Math.round((selectedBatch.supermarketPricePerKg - selectedBatch.farmerPricePerKg) * orderKg)} compared to supermarket retail!
                </p>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#456348", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 800, fontSize: 14, cursor: "pointer" }}
              >
                {submitting ? "Locking Fresh Harvest..." : "Confirm Pre-Order (Pay on Delivery) →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Success Receipt Modal */}
      {orderReceipt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 18, width: "100%", maxWidth: 460, padding: 24, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "rgba(69,99,72,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <CheckCircle2 size={30} color="#456348" />
            </div>
            <h2 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 20, color: d.text, margin: "0 0 4px" }}>
              Harvest Pre-Order Confirmed!
            </h2>
            <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: "0 0 16px" }}>
              Order ID: <strong>{orderReceipt.orderId}</strong>
            </p>

            <div style={{ textAlign: "left", padding: "12px 16px", borderRadius: 12, background: d.bgAlt, border: `1px solid ${d.border}`, marginBottom: 18 }}>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "0 0 4px" }}>
                🌾 Farmer <strong>{orderReceipt.farmerName}</strong> will harvest your <strong>{orderReceipt.orderKg} kg of {orderReceipt.crop}</strong> at <strong>{orderReceipt.harvestSchedule}</strong>.
              </p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: "#456348", margin: 0, fontWeight: 700 }}>
                🚚 Delivery straight to {orderReceipt.customerAddress} within 8 hours.
              </p>
            </div>

            <button onClick={() => setOrderReceipt(null)} style={{ width: "100%", padding: "11px", borderRadius: 8, background: "#456348", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Done & Return to Market
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
