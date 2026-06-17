import { supabase } from "./supabase";
import { SCANS, VOICE_LOGS, NOTIFICATIONS, EXPERT_QUEUE, ADMIN_STATS } from "./data";

export interface Scan {
  id?: string;
  user_id?: string | null;
  crop: string;
  disease: string;
  confidence: number;
  severity: string;
  status: string;
  img?: string;
  created_at?: string;
}

export interface VoiceLog {
  id?: string;
  user_id?: string | null;
  query: string;
  response: string;
  lang: string;
  created_at?: string;
}

export interface Notification {
  id?: string;
  user_id?: string | null;
  type: string;
  sev: string;
  title: string;
  msg: string;
  read: boolean;
  created_at?: string;
}

export interface ExpertQuery {
  id?: string;
  farmer_id?: string | null;
  farmer_name: string;
  crop: string;
  disease: string;
  conf: number;
  query: string;
  status: string;
  created_at?: string;
}

// Global in-memory copies of mock data to support local additions/mutations when offline
let localScans = [...SCANS];
let localVoiceLogs = [...VOICE_LOGS];
let localNotifications = [...NOTIFICATIONS];
let localExpertQueue = [...EXPERT_QUEUE];

export const db = {
  // --- SCANS ---
  async getScans(userId?: string): Promise<any[]> {
    if (!supabase) {
      console.log("Supabase not configured. Returning local mock scans.");
      return localScans;
    }
    try {
      let query = supabase.from("scans").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("Error fetching scans from Supabase. Falling back to local data.", err);
      return localScans;
    }
  },

  async createScan(scan: Omit<Scan, "id" | "created_at">): Promise<any> {
    const newScan = {
      ...scan,
      id: `s-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    if (!supabase) {
      localScans = [newScan as any, ...localScans];
      return newScan;
    }
    try {
      const { data, error } = await supabase.from("scans").insert([scan]).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Error saving scan to Supabase. Saving locally.", err);
      localScans = [newScan as any, ...localScans];
      return newScan;
    }
  },

  // --- VOICE LOGS ---
  async getVoiceLogs(userId?: string): Promise<any[]> {
    if (!supabase) {
      return localVoiceLogs;
    }
    try {
      let query = supabase.from("voice_logs").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("Error fetching voice logs. Falling back to local.", err);
      return localVoiceLogs;
    }
  },

  async createVoiceLog(log: Omit<VoiceLog, "id" | "created_at">): Promise<any> {
    const newLog = {
      ...log,
      id: `v-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    if (!supabase) {
      localVoiceLogs = [newLog as any, ...localVoiceLogs];
      return newLog;
    }
    try {
      const { data, error } = await supabase.from("voice_logs").insert([log]).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Error saving voice log. Saving locally.", err);
      localVoiceLogs = [newLog as any, ...localVoiceLogs];
      return newLog;
    }
  },

  // --- NOTIFICATIONS ---
  async getNotifications(userId?: string): Promise<any[]> {
    if (!supabase) {
      return localNotifications;
    }
    try {
      let query = supabase.from("notifications").select("*").order("created_at", { ascending: false });
      if (userId) {
        query = query.eq("user_id", userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("Error fetching notifications. Falling back to local.", err);
      return localNotifications;
    }
  },

  async markNotificationRead(id: string): Promise<boolean> {
    if (!supabase) {
      localNotifications = localNotifications.map(n => n.id === id ? { ...n, read: true } : n);
      return true;
    }
    try {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn("Error updating notification. Updating locally.", err);
      localNotifications = localNotifications.map(n => n.id === id ? { ...n, read: true } : n);
      return true;
    }
  },

  // --- EXPERT QUEUE ---
  async getExpertQueue(): Promise<any[]> {
    if (!supabase) {
      return localExpertQueue;
    }
    try {
      const { data, error } = await supabase.from("expert_queries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn("Error fetching expert queue. Falling back to local.", err);
      return localExpertQueue;
    }
  },

  async createExpertQuery(query: Omit<ExpertQuery, "id" | "created_at">): Promise<any> {
    const newQuery = {
      ...query,
      id: `q-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
    if (!supabase) {
      localExpertQueue = [newQuery as any, ...localExpertQueue];
      return newQuery;
    }
    try {
      const { data, error } = await supabase.from("expert_queries").insert([query]).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn("Error saving expert query. Saving locally.", err);
      localExpertQueue = [newQuery as any, ...localExpertQueue];
      return newQuery;
    }
  },

  // --- ADMIN STATS ---
  async getAdminStats(): Promise<any> {
    if (!supabase) {
      return ADMIN_STATS;
    }
    try {
      // Gather active counts from Supabase profiles, scans, and queries
      const { count: totalUsers, error: errU } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
      const { count: scansToday, error: errS } = await supabase.from("scans").select("*", { count: 'exact', head: true });
      if (errU || errS) throw errU || errS;

      return {
        ...ADMIN_STATS,
        totalUsers: totalUsers ? totalUsers + 240000 : ADMIN_STATS.totalUsers, // keep offset to simulate real scale
        scansToday: scansToday || ADMIN_STATS.scansToday,
      };
    } catch (err) {
      console.warn("Error fetching admin stats. Falling back to local data.", err);
      return ADMIN_STATS;
    }
  }
};
