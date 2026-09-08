/**
 * Notifier seam (D-05). Announces a new lead. The MVP impl logs server-side; the documented next
 * impl is email to the inbound team. This interface is the whole point of the escalation design —
 * a new channel is a new implementation, not a rewrite.
 */
import type { Lead } from "./store";

export interface Notifier {
  notify(lead: Lead & { id: string }): Promise<void>;
}

export const logNotifier: Notifier = {
  async notify(lead) {
    console.log(
      `[lead] new ${lead.id} — ${lead.name} <${lead.email}> · reason="${lead.reason}"`,
    );
  },
};

/** Swap to an emailNotifier here when the inbound-team address is available (D-05, deferred). */
export const activeNotifier: Notifier = logNotifier;
