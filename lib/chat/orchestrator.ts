/**
 * ChatOrchestrator seam. Ties retrieval + guardrail prompt + LLM streaming together:
 * retrieve context for the latest user turn -> build the grounded system prompt -> stream the reply.
 */
import { lexicalRetriever, buildContext } from "@/lib/knowledge/retriever";
import { buildSystemPrompt } from "./system-prompt";
import { streamChatCompletion, type ChatMessage } from "@/lib/llm/openrouter";

/** Keep the last N turns to bound token cost (NFR-002). */
const MAX_HISTORY = 10;

export async function runChat(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const retrieved = lastUser ? lexicalRetriever.retrieve(lastUser.content) : [];
  const context = buildContext(retrieved);

  const system: ChatMessage = { role: "system", content: buildSystemPrompt(context) };
  const history = messages.slice(-MAX_HISTORY);

  return streamChatCompletion([system, ...history], { signal });
}
