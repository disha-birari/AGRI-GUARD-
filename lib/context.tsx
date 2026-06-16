"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { light, dark } from "./ds";

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
}
interface ThemeCtx {
  isDark: boolean;
  toggle: () => void;
  d: typeof light;
}

export const AuthContext = createContext<AuthCtx>({ user: null, login: () => {}, logout: () => {} });
export const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggle: () => {}, d: light });

export const useAuth = () => useContext(AuthContext);
export const useTheme = () => useContext(ThemeContext);

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);
  const toggle = () => setIsDark(v => !v);
  const d = isDark ? dark : light;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, d }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        {children}
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
