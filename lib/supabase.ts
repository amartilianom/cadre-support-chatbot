/**
 * Server-side Supabase client. Uses the service-role key — NEVER import this into a client
 * component. Returns null when env is not configured yet, so the app degrades gracefully (the lead
 * route then surfaces the direct-contact fallback, FR-025).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
