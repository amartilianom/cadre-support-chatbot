/**
 * LeadStore seam (D-09). Persists a Lead. Only name/email/excerpt/reason are stored — no transcripts
 * (D-11, data minimization). Throws LEAD_STORE_UNCONFIGURED when Supabase env is absent so the route
 * can surface the contact fallback (FR-025).
 */
import { getSupabase } from "@/lib/supabase";

export type Lead = {
  name: string;
  email: string;
  excerpt: string;
  reason: string;
};

export interface LeadStore {
  save(lead: Lead): Promise<{ id: string }>;
}

export const supabaseLeadStore: LeadStore = {
  async save(lead) {
    const supabase = getSupabase();
    if (!supabase) throw new Error("LEAD_STORE_UNCONFIGURED");
    // Generate the id in-app so we never read the row back — this keeps the publishable key
    // strictly INSERT-only (no SELECT privilege), so it can't read leads even if leaked.
    const id = crypto.randomUUID();
    const { error } = await supabase.from("leads").insert({
      id,
      name: lead.name,
      email: lead.email,
      excerpt: lead.excerpt,
      reason: lead.reason,
      status: "new",
    });
    if (error) throw new Error(error.message);
    return { id };
  },
};
