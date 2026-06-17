import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verify that the environment variables are active and not using placeholder text
const isConfigured =
  supabaseUrl &&
  supabaseUrl !== "" &&
  !supabaseUrl.includes("your-supabase-project-id") &&
  supabaseAnonKey &&
  supabaseAnonKey !== "" &&
  !supabaseAnonKey.includes("your-supabase-anon-key");

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
