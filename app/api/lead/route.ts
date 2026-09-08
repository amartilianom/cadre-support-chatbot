import { NextRequest } from "next/server";
import { supabaseLeadStore } from "@/lib/leads/store";
import { activeNotifier } from "@/lib/leads/notifier";
import { rateLimit } from "@/lib/rate-limit";
import { logOutcome } from "@/lib/log";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const key = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`lead:${key}`).ok) return json({ error: "Too many requests." }, 429);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 320);
  const message = String(body.message ?? "").trim().slice(0, 2000);
  const reason = String(body.reason ?? "General inquiry").trim().slice(0, 200);
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "unknown";

  if (!name) return json({ error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address." }, 400); // FR-024

  try {
    const { id } = await supabaseLeadStore.save({
      name,
      email,
      excerpt: message || reason,
      reason,
    });
    // Fire-and-forget notification; a failure here must not fail the capture.
    activeNotifier
      .notify({ id, name, email, excerpt: message || reason, reason })
      .catch((e) => console.error("[/api/lead] notify failed:", e));
    logOutcome("escalated", { sessionId });
    return json({ ok: true, id }, 200);
  } catch (err) {
    console.error("[/api/lead] error:", err);
    const unconfigured = err instanceof Error && err.message === "LEAD_STORE_UNCONFIGURED";
    // FR-025: persistence failed -> inform + surface direct-contact fallback.
    return json(
      {
        error: unconfigured
          ? "Lead capture isn't connected yet. Please email hello@gocadre.ai or call (619) 324-3223."
          : "We couldn't save your details right now. Please email hello@gocadre.ai or call (619) 324-3223.",
      },
      503,
    );
  }
}
