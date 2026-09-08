/**
 * Structured outcome logging (NFR-006). Emits one JSON line per handled request carrying a session
 * id and an outcome — NO message content, NO PII, NO transcripts. Deflection rate is derivable from
 * these logs alone: sessions that only ever log "answered" were deflected; sessions that log
 * "escalated" reached a human. Measuring deflection needs no transcript logging and no consent
 * notice — transcripts would only add *why* a session escalated, not *whether* it did.
 */
export type Outcome = "answered" | "escalated" | "error";

export function logOutcome(
  outcome: Outcome,
  fields: { sessionId?: string; detail?: string } = {},
): void {
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      kind: "chat_outcome",
      outcome,
      sessionId: fields.sessionId || "unknown",
      ...(fields.detail ? { detail: fields.detail } : {}),
    }),
  );
}
