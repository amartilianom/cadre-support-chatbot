"use client";

import { useEffect, useRef, useState } from "react";
import LeadForm from "./LeadForm";

type Msg = { role: "user" | "assistant"; content: string };
type Brand = { productName: string; tagline: string; accentColor: string };
type Escalation = { bookingUrl: string; contactEmail: string; contactPhone: string };

const GREETING =
  "Hi! I'm the Cadre AI assistant. Ask me what Cadre does, which industries we work with, about the AI Maturity Index, or how to book a call with a strategist.";

const SUGGESTIONS = [
  "What does Cadre AI do?",
  "What's the AI Maturity Index?",
  "Do you work with private equity?",
  "How do I book a call?",
];

export default function Chat({ brand, escalation }: { brand: Brand; escalation: Escalation }) {
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc.trim()) {
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: "Sorry, I didn't catch that — could you rephrase?",
          };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Sorry — I hit a problem. Please try again, or reach Cadre at ${escalation.contactEmail}.`,
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[80vh] min-h-[560px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Header */}
      <header
        className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4"
        style={{ borderTop: `3px solid ${brand.accentColor}` }}
      >
        <div>
          <h1 className="text-base font-semibold text-neutral-900">{brand.productName}</h1>
          <p className="text-xs text-neutral-500">{brand.tagline}</p>
        </div>
        <button
          onClick={() => setShowLead(true)}
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: brand.accentColor }}
        >
          Talk to an AI Strategist
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-neutral-900 px-4 py-2.5 text-sm text-white"
                  : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-2.5 text-sm text-neutral-800"
              }
            >
              {m.content || (loading && i === messages.length - 1 ? "…" : "")}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions (only before the first user message) */}
      {messages.length === 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-neutral-200 px-4 py-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Cadre AI…"
          className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
          style={{ backgroundColor: brand.accentColor }}
        >
          {loading ? "…" : "Send"}
        </button>
      </form>

      {showLead && (
        <LeadForm
          escalation={escalation}
          accentColor={brand.accentColor}
          onClose={() => setShowLead(false)}
        />
      )}
    </div>
  );
}
