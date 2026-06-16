"use client";

import { useState, useEffect, type ElementType, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard, Camera, Mic, CloudRain, IndianRupee,
  History, Bell, User, LogOut, Menu, X, Sun, Moon,
  Leaf, ChevronDown, ShieldCheck, Settings, Users,
} from "lucide-react";
import { useAuth, useTheme } from "@/lib/context";
import { PJS, MRP, shadow } from "@/lib/ds";

interface NavItem {
  label: string;
  path: string;
  icon: ElementType;
  badge?: number;
}

const FARMER_NAV: NavItem[] = [
  { label: "Dashboard",     path: "/app/dashboard",     icon: LayoutDashboard },
  { label: "AI Eye",        path: "/app/scanner",       icon: Camera },
  { label: "Agri-Voice",    path: "/app/voice",         icon: Mic },
  { label: "Weather",       path: "/app/weather",       icon: CloudRain },
  { label: "Mandi-Pro",     path: "/app/markets",       icon: IndianRupee },
  { label: "My History",    path: "/app/history",       icon: History },
  { label: "Notifications", path: "/app/notifications", icon: Bell, badge: 3 },
  { label: "Profile",       path: "/app/profile",       icon: User },
];

const EXPERT_NAV: NavItem[] = [
  { label: "Dashboard",       path: "/expert/dashboard", icon: LayoutDashboard },
  { label: "Review Scans",    path: "/expert/dashboard", icon: ShieldCheck },
  { label: "Farmer Queries",  path: "/expert/dashboard", icon: Users },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Dashboard",   path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users",       path: "/admin/dashboard", icon: Users },
  { label: "Analytics",   path: "/admin/dashboard", icon: Settings },
];

const LANGS = ["English", "हिंदी", "தமிழ்", "తెలుగు", "मराठी"];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggle, d } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState("English");
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const nav =
    user.role === "expert" ? EXPERT_NAV :
    user.role === "admin"  ? ADMIN_NAV  : FARMER_NAV;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,248,245,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={16} color="#fff" />
          </div>
          <div>
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: "#fff8f5", margin: 0, lineHeight: 1 }}>AgriGuard</p>
            <p style={{ fontFamily: MRP, fontSize: 10, color: "rgba(255,248,245,0.45)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {user.role === "expert" ? "Expert Portal" : user.role === "admin" ? "Admin Panel" : "Farmer Portal"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {nav.map((item) => {
          const active = pathname === item.path || (item.path !== "/app/dashboard" && item.path !== "/expert/dashboard" && item.path !== "/admin/dashboard" && pathname.startsWith(item.path));
          return (
            <button
              key={item.path + item.label}
              onClick={() => { router.push(item.path); setSidebarOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 9, border: "none",
                marginBottom: 2, cursor: "pointer", textAlign: "left",
                background: active ? "rgba(196,80,26,0.9)" : "transparent",
                color: active ? "#fff" : "rgba(255,248,245,0.65)",
                transition: "all 0.15s",
                position: "relative",
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget.style.background = "rgba(255,248,245,0.08)"); }}
              onMouseLeave={e => { if (!active) (e.currentTarget.style.background = "transparent"); }}
            >
              <item.icon size={17} />
              <span style={{ fontFamily: MRP, fontWeight: 600, fontSize: 14, flex: 1 }}>{item.label}</span>
              {item.badge && !active && (
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#c4501a", color: "#fff", fontFamily: PJS, fontWeight: 800, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User card */}
      <div style={{ padding: 10, borderTop: "1px solid rgba(255,248,245,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, background: "rgba(255,248,245,0.06)" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: user.role === "expert" ? "#436464" : user.role === "admin" ? "#456348" : "#c4501a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PJS, fontWeight: 800, fontSize: 12, color: "#fff", flexShrink: 0 }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: "#fff8f5", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
            <p style={{ fontFamily: MRP, fontSize: 11, color: "rgba(255,248,245,0.45)", margin: 0, textTransform: "capitalize" }}>{user.role}</p>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,248,245,0.4)", padding: 4, borderRadius: 6, transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#c4501a")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,248,245,0.4)")}>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", background: d.bg, overflow: "hidden", width: "100vw" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:block" style={{ width: 240, flexShrink: 0, background: isDark ? "#140a04" : "#2d1a0e", height: "100%", overflowY: "auto" }}>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position: "relative", zIndex: 1, width: 256, background: isDark ? "#140a04" : "#2d1a0e", height: "100%", overflowY: "auto", flexShrink: 0 }}>
            <button onClick={() => setSidebarOpen(false)} style={{ position: "absolute", top: 16, right: 14, background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,248,245,0.6)", padding: 4 }}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh" }}>
        {/* Top Navbar */}
        <header style={{ height: 60, borderBottom: `1px solid ${d.border}`, background: d.card, display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0, boxShadow: shadow(isDark, 1) }}>
          <button className="md:hidden" onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, padding: 4 }}>
            <Menu size={20} />
          </button>

          <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={13} color="#fff" />
            </div>
            <span style={{ fontFamily: PJS, fontWeight: 800, fontSize: 16, color: d.text, letterSpacing: "-0.01em" }}>AGRI-GUARD</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Language selector */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setLangOpen(!langOpen)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 7, border: `1px solid ${d.border}`, background: "transparent", cursor: "pointer", color: d.textMuted }}>
              <span style={{ fontFamily: MRP, fontSize: 13, fontWeight: 600 }}>{lang.slice(0, 3)}</span>
              <ChevronDown size={12} />
            </button>
            {langOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: d.card, border: `1px solid ${d.border}`, borderRadius: 10, padding: 6, boxShadow: shadow(isDark, 2), zIndex: 50, minWidth: 120 }}>
                {LANGS.map(l => (
                  <button key={l} onClick={() => { setLang(l); setLangOpen(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 12px", borderRadius: 7, border: "none", background: lang === l ? `${d.primary}14` : "transparent", cursor: "pointer", fontFamily: MRP, fontSize: 13, fontWeight: 600, color: lang === l ? d.primary : d.textSub }}>
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications bell */}
          <button onClick={() => router.push("/app/notifications")} style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", color: d.textMuted, padding: 6 }}>
            <Bell size={18} />
            <span style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: "50%", background: "#c4501a", border: `2px solid ${d.card}` }} />
          </button>

          {/* Dark mode toggle */}
          <button onClick={toggle} style={{ width: 34, height: 34, borderRadius: "50%", border: `1px solid ${d.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: d.textMuted }}>
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Avatar */}
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#c4501a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PJS, fontWeight: 800, fontSize: 12, color: "#fff", cursor: "pointer", flexShrink: 0 }}
            onClick={() => router.push("/app/profile")}>
            {user.avatar}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
