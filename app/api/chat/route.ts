import { NextRequest } from "next/server";
import { runChat } from "@/lib/chat/orchestrator";
import type { ChatMessage } from "@/lib/llm/openrouter";
import { rateLimit } from "@/lib/rate-limit";
import { logOutcome } from "@/lib/log";

// Node runtime: the orchestrator uses Node APIs and we want a plain streaming Response.
export const runtime = "nodejs";
export const maxDuration = 30;

function clientKey(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export async function POST(req: NextRequest) {
  const limit = rateLimit(clientKey(req));
  if (!limit.ok) {
    return new Response("Too many requests — please slow down for a moment.", {
      status: 429,
      headers: { "retry-after": String(limit.retryAfter ?? 30) },
    });
  }

  let body: { messages?: unknown; sessionId?: unknown };
  try {
    body = (await req.json()) as { messages?: unknown; sessionId?: unknown };
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : "unknown";

  const messages: ChatMessage[] = (Array.isArray(body.messages) ? body.messages : [])
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string",
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (messages.length === 0) {
    return new Response("A non-empty messages array is required.", { status: 400 });
  }

  try {
    const stream = await runChat(messages, req.signal);
    logOutcome("answered", { sessionId });
    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/chat] error:", err);
    logOutcome("error", { sessionId, detail: String(err).slice(0, 120) });
    return new Response(
      "Sorry — I'm having trouble reaching the assistant right now. Please try again in a moment, or contact us.",
      { status: 500 },
    );
  }
}
