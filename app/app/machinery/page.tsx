"use client";

import { useState, useEffect } from "react";
import { 
  Tractor, Zap, MapPin, Clock, Star, Phone, 
  CheckCircle, PlusCircle, ArrowRight, ShieldCheck, Fuel
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

export default function MachineryPage() {
  const { d, isDark } = useTheme();
  const { user } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);

  // Booking form
  const [units, setUnits] = useState<number>(3); // hours or acres
  const [bookingDate, setBookingDate] = useState("Tomorrow Morning");
  const [bookingReceipt, setBookingReceipt] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/machinery?category=${encodeURIComponent(category)}`);
      if (res.ok) {
        const json = await res.json();
        setItems(json.machinery || []);
      }
    } catch (err) {
      console.error("Failed to load machinery", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachinery();
  }, [category]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;
    setSubmitting(true);
    try {
      const totalCost = selectedMachine.rateAmount * units;
      const res = await fetch("/api/machinery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          machineryId: selectedMachine.id,
          farmerName: user?.name || "Ramesh Kumar",
          farmerPhone: user?.phone || "+91 98220 11223",
          bookingDate,
          unitsRequested: units,
          totalEstimatedCost: totalCost
        })
      });
      if (res.ok) {
        const json = await res.json();
        setBookingReceipt(json.receipt);
        setSelectedMachine(null);
      }
    } catch (err) {
      console.error("Booking error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(196,80,26,0.1)", border: "1px solid rgba(196,80,26,0.25)", marginBottom: 8 }}>
          <Tractor size={13} color="#c4501a" />
          <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#c4501a", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Breakthrough: Krishi-Share (Uber for Farm Machinery)
          </span>
        </div>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 26, color: d.text, margin: "0 0 6px" }}>
          🚜 Krishi-Share — Peer-to-Peer Farm Equipment Rental
        </h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>
          Rent tractors, drone sprayers, laser levelers, and combine harvesters on-demand from verified nearby farmers at affordable hourly rates.
        </p>
      </div>

      {/* Category Pills */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["All", "Tractor & Rotavator", "Drone Sprayer", "Combine Harvester", "Laser Land Leveler"].map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{ padding: "8px 16px", borderRadius: 999, border: `1.5px solid ${category === c ? "#c4501a" : d.border}`, background: category === c ? "rgba(196,80,26,0.12)" : "transparent", color: category === c ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Equipment Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18, marginBottom: 30 }}>
        {items.map(item => (
          <div 
            key={item.id} 
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
              <div style={{ position: "relative", height: 160, width: "100%" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(35,26,19,0.85)", backdropFilter: "blur(4px)", color: "#fff", padding: "3px 10px", borderRadius: 999, fontFamily: MRP, fontWeight: 800, fontSize: 10 }}>
                  {item.category}
                </span>
                <span style={{ position: "absolute", top: 12, right: 12, background: "#456348", color: "#fff", padding: "3px 10px", borderRadius: 999, fontFamily: MRP, fontWeight: 800, fontSize: 10 }}>
                  {item.distanceKm} km away
                </span>
              </div>

              <div style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <h3 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, margin: 0 }}>
                    {item.name}
                  </h3>
                </div>

                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "0 0 10px", lineHeight: 1.45 }}>
                  {item.specs}
                </p>

                <div style={{ padding: "8px 10px", borderRadius: 8, background: d.bgAlt, marginBottom: 12 }}>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: "0 0 2px" }}>
                    Owner: <strong>{item.ownerName}</strong> · {item.ownerVillage} ({item.ownerPhone})
                  </p>
                  <p style={{ fontFamily: MRP, fontSize: 11, color: "#456348", margin: 0, fontWeight: 700 }}>
                    ★ {item.rating} ({item.completedBookings} jobs completed) · Driver/Operator Included
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: MRP, fontSize: 10, color: d.textMuted, textTransform: "uppercase" }}>Rental Rate</span>
                    <p style={{ fontFamily: PJS, fontWeight: 900, fontSize: 20, color: "#c4501a", margin: 0 }}>
                      ₹{item.rateAmount}<span style={{ fontSize: 12, fontWeight: 500, color: d.textMuted }}>/{item.rateType === "per_hour" ? "hour" : "acre"}</span>
                    </p>
                  </div>
                  <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#456348" }}>
                    ● {item.availableFrom}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 18px 18px" }}>
              <button 
                onClick={() => { setSelectedMachine(item); setUnits(item.rateType === "per_hour" ? 3 : 2); }}
                style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#c4501a", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Tractor size={15} />Book Equipment On-Demand →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedMachine && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 18, width: "100%", maxWidth: 460, padding: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span style={{ fontFamily: MRP, fontWeight: 800, fontSize: 10, color: "#c4501a", textTransform: "uppercase" }}>Book Farm Machinery</span>
                <h2 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: d.text, margin: "2px 0 0" }}>{selectedMachine.name}</h2>
                <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>Owner: {selectedMachine.ownerName} ({selectedMachine.ownerVillage})</p>
              </div>
              <button onClick={() => setSelectedMachine(null)} style={{ background: "transparent", border: "none", color: d.textMuted, fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <form onSubmit={handleBooking} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Duration / Area ({selectedMachine.rateType === "per_hour" ? "Hours" : "Acres"})</label>
                <input 
                  type="number" 
                  min={1} 
                  max={20} 
                  value={units} 
                  onChange={e => setUnits(+e.target.value)} 
                  required
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4, boxSizing: "border-box" }} 
                />
              </div>

              <div>
                <label style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted }}>Work Date & Time Slot</label>
                <select 
                  value={bookingDate} 
                  onChange={e => setBookingDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1px solid ${d.border}`, background: d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, marginTop: 4, boxSizing: "border-box" }}
                >
                  <option>Tomorrow Morning (6:00 AM - 10:00 AM)</option>
                  <option>Tomorrow Afternoon (2:00 PM - 6:00 PM)</option>
                  <option>Day After Tomorrow (Full Day)</option>
                </select>
              </div>

              <div style={{ padding: "12px 14px", borderRadius: 10, background: d.bgAlt, border: `1px solid ${d.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontFamily: MRP, marginBottom: 2 }}>
                  <span>Base Rate:</span>
                  <span>₹{selectedMachine.rateAmount} × {units} {selectedMachine.rateType === "per_hour" ? "hrs" : "acres"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontFamily: PJS, fontWeight: 800, color: d.text, borderTop: `1px solid ${d.border}`, paddingTop: 6, marginTop: 4 }}>
                  <span>Estimated Total Cost:</span>
                  <span style={{ color: "#c4501a" }}>₹{selectedMachine.rateAmount * units}</span>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                style={{ width: "100%", padding: "11px", borderRadius: 8, background: "#c4501a", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 800, fontSize: 14, cursor: "pointer" }}
              >
                {submitting ? "Booking Machine..." : "Confirm Machinery Booking →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Booking Success Modal */}
      {bookingReceipt && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}>
          <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 18, width: "100%", maxWidth: 440, padding: 24, textAlign: "center", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(196,80,26,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <CheckCircle size={28} color="#c4501a" />
            </div>
            <h2 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 19, color: d.text, margin: "0 0 4px" }}>
              Equipment Operator Dispatched!
            </h2>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "0 0 14px" }}>
              Booking ID: <strong>{bookingReceipt.bookingId}</strong>
            </p>

            <div style={{ textAlign: "left", padding: "12px 14px", borderRadius: 10, background: d.bgAlt, border: `1px solid ${d.border}`, marginBottom: 16 }}>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: "0 0 4px" }}>
                🚜 The equipment owner has accepted your booking for <strong>{bookingReceipt.bookingDate}</strong>.
              </p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: "#456348", margin: 0, fontWeight: 700 }}>
                Estimated Cost: ₹{bookingReceipt.totalEstimatedCost} (Pay directly after work is done).
              </p>
            </div>

            <button onClick={() => setBookingReceipt(null)} style={{ width: "100%", padding: "10px", borderRadius: 8, background: "#c4501a", color: "#fff", border: "none", fontFamily: PJS, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
