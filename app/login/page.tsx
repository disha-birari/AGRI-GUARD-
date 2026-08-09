"use client";

import { useState } from "react";
import type { ReactNode, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { DEMO_USERS } from "@/lib/data";
import { supabase } from "@/lib/supabase";
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);

    if (supabase) {
      try {
        const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (authErr) throw authErr;

        if (authData?.user) {
          const { data: profile, error: profileErr } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", authData.user.id)
            .single();
          
          if (profileErr) throw profileErr;

          const dest = profile?.role === "expert" ? "/expert/dashboard" : profile?.role === "admin" ? "/admin/dashboard" : "/app/dashboard";
          router.push(dest);
        }
      } catch (err: any) {
        setError(err.message || "Failed to sign in. Verify your email or password.");
        setLoading(false);
      }
    } else {
      // Local fallback
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
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      alert("Supabase is not configured. Google Sign-In requires active environment keys.");
      return;
    }
    setLoading(true);
    try {
      const { error: oAuthErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/app/dashboard`,
        }
      });
      if (oAuthErr) throw oAuthErr;
    } catch (err: any) {
      setError(err.message || "Failed to initialize Google Sign-In");
      setLoading(false);
    }
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

          {/* Google Sign-in button (if Supabase is active) */}
          {supabase && (
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "12px",
                borderRadius: 8,
                border: `1.5px solid ${d.border}`,
                background: "transparent",
                color: d.text,
                fontFamily: PJS,
                fontWeight: 600,
                fontSize: 14,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 10,
                width: "100%",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = isDark ? "rgba(255,248,245,0.06)" : "rgba(196,80,26,0.05)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" style={{ flexShrink: 0 }}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

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
