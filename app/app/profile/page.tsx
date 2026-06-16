"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, MapPin, Leaf, Phone, Mail, Save, LogOut, Globe, Edit3 } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

const LANGS = [["en","English"],["hi","हिंदी"],["ta","தமிழ்"],["te","తెలుగు"],["mr","मराठी"],["pa","ਪੰਜਾਬੀ"]];
const CROP_LIST = ["Tomato","Onion","Wheat","Rice","Chilli","Cotton","Sugarcane","Potato","Maize","Soybean"];

export default function Profile() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const { d, isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name:      user?.name ?? "",
    phone:     user?.phone ?? "",
    state:     user?.state ?? "",
    district:  user?.district ?? "",
    village:   user?.village ?? "",
    farmSize:  user?.farmSize ?? "",
    language:  user?.language ?? "en",
    crops:     user?.crops ?? [],
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const toggleCrop = (c: string) => setForm(f => ({ ...f, crops: f.crops.includes(c) ? f.crops.filter(x => x !== c) : [...f.crops, c] }));

  const handleSave = () => {
    if (user) {
      login({ ...user, ...form });
    }
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const inp = (label: string, key: string, placeholder: string) => (
    <div>
      <label style={{ fontFamily: MRP, fontWeight: 600, fontSize: 12, color: d.textMuted, display: "block", marginBottom: 5 }}>{label}</label>
      {editing ? (
        <input value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
          style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${d.border}`, background: isDark ? "rgba(255,248,245,0.05)" : "#feeade", color: d.text, fontFamily: MRP, fontSize: 14, outline: "none", boxSizing: "border-box" }}
          onFocus={e => (e.target.style.borderColor = "#c4501a")}
          onBlur={e => (e.target.style.borderColor = d.border)}
        />
      ) : (
        <p style={{ fontFamily: MRP, fontSize: 14, color: (form as any)[key] ? d.text : d.textMuted, margin: 0, padding: "9px 0" }}>{(form as any)[key] || "—"}</p>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>My Profile</h1>
          <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Manage your farm details and account preferences.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${d.border}`, background: "transparent", color: d.text, fontFamily: PJS, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleSave} style={{ padding: "9px 18px", borderRadius: 8, background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 13, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Save size={13} />Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px solid ${d.border}`, background: "transparent", color: d.text, fontFamily: PJS, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <Edit3 size={13} />Edit Profile
            </button>
          )}
        </div>
      </div>

      {saved && (
        <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: "rgba(69,99,72,0.1)", border: "1px solid rgba(69,99,72,0.25)", display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={14} color="#456348" />
          <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: "#456348", margin: 0 }}>Profile saved successfully.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: 16 }}>

        {/* Avatar + basic info */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 24, boxShadow: shadow(isDark, 1) }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24, paddingBottom: 20, borderBottom: `1px solid ${d.border}` }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PJS, fontWeight: 800, fontSize: 22, color: "#fff", flexShrink: 0 }}>
              {user?.avatar}
            </div>
            <div>
              <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 18, color: d.text, margin: "0 0 2px" }}>{form.name || user?.name}</p>
              <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "0 0 6px" }}>{user?.email}</p>
              <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 10, color: "#c4501a", background: "rgba(196,80,26,0.1)", padding: "3px 10px", borderRadius: 999, textTransform: "capitalize" }}>{user?.role}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <User size={15} color={d.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
              {inp("Full Name","name","Your name")}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Phone size={15} color={d.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
              {inp("Phone Number","phone","+91 98765 43210")}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Mail size={15} color={d.textMuted} style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <label style={{ fontFamily: MRP, fontWeight: 600, fontSize: 12, color: d.textMuted, display: "block", marginBottom: 5 }}>Email</label>
                <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: "9px 0" }}>{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Farm details */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 24, boxShadow: shadow(isDark, 1) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <MapPin size={15} color="#c4501a" />
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>Farm Location</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {inp("State","state","e.g. Maharashtra")}
            {inp("District","district","e.g. Nashik")}
            {inp("Village","village","e.g. Igatpuri")}
            {inp("Farm Size (acres)","farmSize","e.g. 5")}
          </div>
        </div>

        {/* Language preference */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 24, boxShadow: shadow(isDark, 1) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Globe size={15} color="#c4501a" />
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>Preferred Language</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {LANGS.map(([code, label]) => (
              <button key={code} onClick={() => editing && setForm(f => ({ ...f, language: code }))} style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${form.language === code ? "#c4501a" : d.border}`, background: form.language === code ? "rgba(196,80,26,0.08)" : "transparent", color: form.language === code ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 600, fontSize: 13, cursor: editing ? "pointer" : "default", textAlign: "left", width: "100%" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Main crops */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 16, padding: 24, boxShadow: shadow(isDark, 1) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Leaf size={15} color="#c4501a" />
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 14, color: d.text, margin: 0 }}>Main Crops</p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CROP_LIST.map(c => {
              const sel = form.crops.includes(c);
              return (
                <button key={c} onClick={() => editing && toggleCrop(c)} style={{ padding: "6px 14px", borderRadius: 999, border: `1.5px solid ${sel ? "#c4501a" : d.border}`, background: sel ? "rgba(196,80,26,0.1)" : "transparent", color: sel ? "#c4501a" : d.textSub, fontFamily: MRP, fontWeight: 600, fontSize: 12, cursor: editing ? "pointer" : "default", transition: "all 0.15s" }}>
                  {c}
                </button>
              );
            })}
          </div>
          {form.crops.length > 0 && (
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "12px 0 0" }}>{form.crops.length} crop{form.crops.length > 1 ? "s" : ""} selected</p>
          )}
        </div>

        {/* Danger zone */}
        <div style={{ background: "rgba(186,26,26,0.04)", border: "1px solid rgba(186,26,26,0.15)", borderRadius: 16, padding: 24 }}>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: "#ba1a1a", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Account</p>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 9, background: "#ba1a1a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer" }}>
            <LogOut size={15} />Sign Out
          </button>
          <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: "12px 0 0" }}>You will be redirected to the home page.</p>
        </div>
      </div>
    </div>
  );
}
