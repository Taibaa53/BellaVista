import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for the Vite app.
 * Env vars must use the VITE_ prefix to be exposed to the client.
 *
 * Dashboard → Project Settings → API:
 * - URL → VITE_SUPABASE_URL
 * - anon / publishable key → VITE_SUPABASE_ANON_KEY
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;

export function getSupabase() {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in client/.env"
    );
  }
  return supabase;
}
