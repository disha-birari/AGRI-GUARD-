"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { light, dark } from "./ds";
import { supabase } from "./supabase";

export type Role = "farmer" | "expert" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  language: string;
  phone?: string;
  state?: string;
  district?: string;
  village?: string;
  farmSize?: string;
  crops?: string[];
}

interface AuthCtx {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  loading: boolean;
}
interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
  d: typeof light;
}

export const AuthContext = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {}, loading: true });
export const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggle: () => {}, d: light });

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      return;
    }

    let active = true;

    const fetchProfile = async (uid: string, email: string) => {
      try {
        const { data, error } = await client
          .from("profiles")
          .select("*")
          .eq("id", uid)
          .single();
        
        if (error) throw error;
        if (data && active) {
          setUser({
            id: data.id,
            name: data.name || "New Farmer",
            email: data.email || email,
            role: data.role || "farmer",
            avatar: data.avatar || "RK",
            language: data.language || "en",
            phone: data.phone || undefined,
            state: data.state || undefined,
            district: data.district || undefined,
            village: data.village || undefined,
            farmSize: data.farm_size || undefined,
            crops: data.crops || undefined,
          });
        }
      } catch (e) {
        console.warn("Could not load user profile. Setting basic details.", e);
        if (active) {
          setUser({
            id: uid,
            name: "Farmer",
            email: email,
            role: "farmer",
            avatar: "RK",
            language: "en",
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    // Check active session on startup
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        if (active) setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        if (active) {
          setUser(null);
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = (u: User) => setUser(u);
  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };
  const toggle = () => setIsDark(v => !v);
  const d = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, d }}>
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
