/**
 * Server-side Supabase client. Uses the Supabase publishable key (server-side only), which respects
 * Row-Level Security — the `leads` table has an INSERT-only policy, so this client can submit leads
 * but never read them back (least privilege; see supabase/schema.sql). Returns null when env is not
 * configured, so the app degrades gracefully (the lead route surfaces the contact fallback, FR-025).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  // Accept the new SUPABASE_KEY; fall back to the legacy name for compatibility.
  const key = process.env.SUPABASE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
