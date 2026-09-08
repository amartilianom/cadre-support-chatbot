import { NextRequest } from "next/server";
import { runChat } from "@/lib/chat/orchestrator";
import type { ChatMessage } from "@/lib/llm/openrouter";
import { rateLimit } from "@/lib/rate-limit";

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

  let rawMessages: unknown;
  try {
    const body = await req.json();
    rawMessages = (body as { messages?: unknown })?.messages;
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  const messages: ChatMessage[] = (Array.isArray(rawMessages) ? rawMessages : [])
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
    return new Response(stream, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("[/api/chat] error:", err);
    return new Response(
      "Sorry — I'm having trouble reaching the assistant right now. Please try again in a moment, or contact Cadre at hello@gocadre.ai.",
      { status: 500 },
    );
  }
}
