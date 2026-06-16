"use client";

import { useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import { Users, Activity, Camera, Globe, TrendingUp, ShieldCheck, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "@/lib/context";
import { ADMIN_STATS } from "@/lib/data";
import { PJS, MRP, shadow } from "@/lib/ds";

type RoleFilter = "all" | "farmer" | "expert" | "admin";

export default function AdminDashboard() {
  const { d, isDark } = useTheme();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = ADMIN_STATS.recentUsers.filter(u => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const Card = ({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) => (
    <div style={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 14, padding: 20, boxShadow: shadow(isDark, 1), ...style }}>{children}</div>
  );

  const roleColor: Record<string, string> = { farmer: "#c4501a", expert: "#436464", admin: "#456348" };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: PJS, fontWeight: 800, fontSize: 24, color: d.text, margin: "0 0 4px" }}>Admin Dashboard</h1>
        <p style={{ fontFamily: MRP, fontSize: 14, color: d.textMuted, margin: 0 }}>Platform overview, user management and analytics.</p>
      </div>

      {/* Key metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Users",    val: ADMIN_STATS.totalUsers.toLocaleString("en-IN"),  icon: Users,      col: "#c4501a" },
          { label: "Active Today",   val: ADMIN_STATS.activeToday.toLocaleString("en-IN"), icon: Activity,   col: "#436464" },
          { label: "Scans Today",    val: ADMIN_STATS.scansToday.toLocaleString("en-IN"),  icon: Camera,     col: "#456348" },
          { label: "Expert Reviewers", val: ADMIN_STATS.experts.toLocaleString("en-IN"),  icon: ShieldCheck, col: "#8b5e3c" },
          { label: "States Covered", val: "18",                                            icon: Globe,      col: "#436464" },
          { label: "Accuracy Rate",  val: "96%",                                           icon: TrendingUp, col: "#456348" },
        ].map((s, i) => (
          <Card key={i}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.col}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <s.icon size={17} color={s.col} />
            </div>
            <p style={{ fontFamily: PJS, fontWeight: 800, fontSize: 22, color: d.text, margin: "0 0 2px" }}>{s.val}</p>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16, marginBottom: 16 }}>

        {/* Weekly scans chart */}
        <Card style={{ gridColumn: "span 2" }}>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px" }}>Weekly Scans</p>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_STATS.weeklyScans} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,248,245,0.05)" : "rgba(35,26,19,0.05)"} vertical={false} />
                <XAxis dataKey="day" tick={{ fontFamily: MRP, fontSize: 11, fill: d.textMuted }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontFamily: MRP, fontSize: 11, fill: d.textMuted }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: any) => [Number(v).toLocaleString("en-IN"), "Scans"]} contentStyle={{ background: d.card, border: `1px solid ${d.border}`, borderRadius: 8, fontFamily: MRP, fontSize: 12 }} />
                <Bar dataKey="scans" fill="#c4501a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Role breakdown */}
        <Card>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>User Breakdown</p>
          {[
            { role: "Farmers", count: ADMIN_STATS.farmers, total: ADMIN_STATS.totalUsers, col: "#c4501a" },
            { role: "Experts", count: ADMIN_STATS.experts, total: ADMIN_STATS.totalUsers, col: "#436464" },
            { role: "Admins",  count: ADMIN_STATS.admins,  total: ADMIN_STATS.totalUsers, col: "#456348" },
          ].map(({ role, count, total, col }) => {
            const pct = Math.round((count / total) * 100);
            return (
              <div key={role} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: d.text }}>{role}</span>
                  <span style={{ fontFamily: PJS, fontWeight: 700, fontSize: 13, color: col }}>{count.toLocaleString("en-IN")} <span style={{ fontFamily: MRP, fontWeight: 400, color: d.textMuted }}>({pct}%)</span></span>
                </div>
                <div style={{ height: 6, borderRadius: 999, background: d.bgMuted, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: col }} />
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* User management table */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Recent Users</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative" }}>
              <Search size={13} color={d.textMuted} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
                style={{ padding: "7px 12px 7px 30px", borderRadius: 8, border: `1px solid ${d.border}`, background: isDark ? "rgba(255,248,245,0.05)" : d.bgMuted, color: d.text, fontFamily: MRP, fontSize: 13, outline: "none", width: 180 }} />
            </div>
            {/* Role filter */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["all","farmer","expert","admin"] as RoleFilter[]).map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} style={{ padding: "6px 12px", borderRadius: 7, border: `1px solid ${roleFilter === r ? "#c4501a" : d.border}`, background: roleFilter === r ? "rgba(196,80,26,0.1)" : "transparent", color: roleFilter === r ? "#c4501a" : d.textMuted, fontFamily: MRP, fontWeight: 600, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", gap: 12, padding: "8px 12px", borderBottom: `1px solid ${d.border}` }}>
          {["Name","Email","Role","State","Joined"].map(h => (
            <p key={h} style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: d.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{h}</p>
          ))}
        </div>

        {filtered.map((u, i) => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", gap: 12, padding: "12px 12px", borderBottom: i < filtered.length - 1 ? `1px solid ${d.border}` : "none", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: roleColor[u.role], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PJS, fontWeight: 800, fontSize: 10, color: "#fff", flexShrink: 0 }}>
                {u.name.slice(0, 2).toUpperCase()}
              </div>
              <p style={{ fontFamily: MRP, fontWeight: 600, fontSize: 13, color: d.text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</p>
            </div>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</p>
            <span style={{ fontFamily: MRP, fontWeight: 700, fontSize: 11, color: roleColor[u.role], background: `${roleColor[u.role]}12`, padding: "3px 9px", borderRadius: 999, textTransform: "capitalize", width: "fit-content" }}>{u.role}</span>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textSub, margin: 0 }}>{u.state}</p>
            <p style={{ fontFamily: MRP, fontSize: 12, color: d.textMuted, margin: 0 }}>{u.joined}</p>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: "24px", textAlign: "center" }}>
            <p style={{ fontFamily: MRP, fontSize: 13, color: d.textMuted, margin: 0 }}>No users match your search.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
