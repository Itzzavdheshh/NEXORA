import { createClient } from "@supabase/supabase-js";

/**
 * Lightweight Supabase client for the browser — used exclusively for
 * Realtime subscriptions. All data fetching still goes through the
 * Express API via apiClient.js (with auth tokens).
 *
 * Uses the project's publishable (anon) key, which is safe to expose
 * in the browser. Row-Level Security on Supabase handles access control.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
