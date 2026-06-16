"use client";

import { useState } from "react";
import type { ReactNode, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { DEMO_USERS } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const { isDark, d } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      const found = Object.values(DEMO_USERS).find(u => u.email === email);
      if (found && password === "demo123") {
        login(found);
        const dest = found.role === "expert" ? "/expert/dashboard" : found.role === "admin" ? "/admin/dashboard" : "/app/dashboard";
        router.push(dest);
      } else {
        setError("Invalid credentials. Try a demo account below.");
        setLoading(false);
      }
    }, 900);
  };

  const demoLogin = (role: "farmer" | "expert" | "admin") => {
    setLoading(true);
    setTimeout(() => {
      login(DEMO_USERS[role]);
      const dest = role === "expert" ? "/expert/dashboard" : role === "admin" ? "/admin/dashboard" : "/app/dashboard";
      router.push(dest);
    }, 600);
  };

  const inp = (val: string, onChange: (v: string) => void, placeholder: string, type = "text", extra?: ReactNode) => (
    <div style={{ position: "relative" }}>
      <input
        type={type} value={val} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "11px 14px", paddingRight: extra ? 44 : 14, borderRadius: 8, border: `1.5px solid ${d.border}`, background: isDark ? "rgba(255,248,245,0.05)" : "#feeade", color: d.text, fontFamily: MRP, fontSize: 14, outline: "none", boxSizing: "border-box" }}
        onFocus={e => (e.target.style.borderColor = "#c4501a")}
        onBlur={e => (e.target.style.borderColor = d.border)}
      />
      {extra && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>{extra}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: d.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* bg decoration */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: `radial-gradient(circle at 30% 20%, rgba(196,80,26,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(67,100,100,0.06) 0%, transparent 50%)` }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 18px rgba(196,80,26,0.35)" }}>
              <Leaf size={19} color="#fff" />
            </div>
            <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 22, color: d.text, letterSpacing: "-0.01em" }}>AgriGuard</span>
          </div>
          <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0 }}>Sign in to your farmer account</p>
        </div>

        {/* Card */}
        <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 18, padding: 32, boxShadow: shadow(isDark, 2) }}>
          <h2 style={{ fontFamily: PJS, fontWeight: 700, fontSize: 20, color: d.text, margin: "0 0 24px" }}>Welcome back</h2>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: d.textSub, display: "block", marginBottom: 6 }}>Email address</label>
              {inp(email, setEmail, "ramesh@farm.in", "email")}
            </div>
            <div>
              <label style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: d.textSub, display: "block", marginBottom: 6 }}>Password</label>
              {inp(password, setPassword, "••••••••", showPass ? "text" : "password",
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, padding: 0, display: "flex" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              )}
            </div>

            {error && (
              <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(186,26,26,0.08)", border: "1px solid rgba(186,26,26,0.2)" }}>
                <p style={{ fontFamily: MRP, fontSize: 13, color: "#ba1a1a", margin: 0 }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", borderRadius: 8, background: loading ? d.border : "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", transition: "opacity 0.2s", marginTop: 4 }}>
              {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={15} /></>}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
            <div style={{ flex: 1, height: 1, background: d.border }} />
            <span style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted }}>Quick Demo Access</span>
            <div style={{ flex: 1, height: 1, background: d.border }} />
          </div>

          {/* Demo buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { role: "farmer" as const, label: "👨‍🌾  Demo as Farmer", color: "#c4501a", sub: "Ramesh Kumar · Nashik, MH" },
              { role: "expert" as const, label: "🔬  Demo as Expert", color: "#436464", sub: "Dr. Priya Sharma · Agronomist" },
              { role: "admin"  as const, label: "⚙️   Demo as Admin",  color: "#456348", sub: "Admin User · Full Access" },
            ].map(({ role, label, color, sub }) => (
              <button key={role} onClick={() => demoLogin(role)} disabled={loading} style={{ padding: "11px 14px", borderRadius: 9, border: `1.5px solid ${color}30`, background: `${color}08`, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = `${color}14`)}
                onMouseLeave={e => (e.currentTarget.style.background = `${color}08`)}>
                <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: d.text, margin: "0 0 1px" }}>{label}</p>
                <p style={{ fontFamily: MRP, fontSize: 11, color: d.textMuted, margin: 0 }}>{sub}</p>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", fontFamily: MRP, fontSize: 13, color: d.textMuted, marginTop: 20 }}>
          Don't have an account?{" "}
          <button onClick={() => router.push("/signup")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#c4501a", fontFamily: PJS, fontWeight: 700, fontSize: 13 }}>
            Create one free
          </button>
        </p>
        <p style={{ textAlign: "center", fontFamily: MRP, fontSize: 12, color: d.textMuted, marginTop: 8 }}>
          <button onClick={() => router.push("/")} style={{ background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, fontFamily: MRP, fontSize: 12 }}>
            ← Back to home
          </button>
        </p>
      </div>
    </div>
  );
}
