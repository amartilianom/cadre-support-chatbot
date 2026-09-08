/**
 * LlmProvider seam (D-04). Streams a chat completion from OpenRouter (OpenAI-compatible) using a
 * server-side key. Implemented with plain fetch + a ReadableStream that parses SSE deltas — no heavy
 * SDK, so it stays robust on the bleeding-edge Next 16 stack. The model comes from the ClientProfile
 * (env-overridable), so swapping models needs no code change (FR-031).
 */
import { activeProfile } from "@/lib/config/client-profile";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/** Hard cost guardrails (NFR-002): cap output tokens and keep temperature low for grounded answers. */
const MAX_OUTPUT_TOKENS = 800;
const TEMPERATURE = 0.3;

export async function streamChatCompletion(
  messages: ChatMessage[],
  opts: { signal?: AbortSignal } = {},
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // OpenRouter attribution headers (optional but recommended).
      "HTTP-Referer": process.env.OPENROUTER_APP_URL ?? "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_APP_NAME ?? "Cadre Support Chatbot",
    },
    body: JSON.stringify({
      model: activeProfile.model,
      messages,
      stream: true,
      temperature: TEMPERATURE,
      max_tokens: MAX_OUTPUT_TOKENS,
    }),
    signal: opts.signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenRouter error ${res.status}: ${detail.slice(0, 300)}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const upstream = res.body.getReader();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await upstream.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // keep the last, possibly-partial line
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue; // skip SSE comments/keep-alives
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const json = JSON.parse(data);
              const delta: string | undefined = json?.choices?.[0]?.delta?.content;
              if (delta) controller.enqueue(encoder.encode(delta));
            } catch {
              // Ignore unparseable partial chunks; the next read completes them.
            }
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      upstream.cancel().catch(() => {});
    },
  });
}
