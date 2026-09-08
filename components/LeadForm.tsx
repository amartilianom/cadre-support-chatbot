"use client";

import { useState } from "react";

type Escalation = { bookingUrl: string; contactEmail: string; contactPhone: string };

export default function LeadForm({
  escalation,
  accentColor,
  ctaLabel,
  sessionId,
  onClose,
}: {
  escalation: Escalation;
  accentColor: string;
  ctaLabel: string;
  sessionId: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, email, message, reason: "Requested the team", sessionId }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">{ctaLabel}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600" aria-label="Close">
            ✕
          </button>
        </div>

        {status === "done" ? (
          <div className="space-y-3 text-sm text-neutral-700">
            <p className="font-medium text-neutral-900">Thanks — we&apos;ve got your details.</p>
            <p>A Cadre strategist will reach out shortly. Prefer to move faster?</p>
            <a
              href={escalation.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: accentColor }}
            >
              Visit the contact page →
            </a>
            <button onClick={onClose} className="ml-2 text-sm text-neutral-500 hover:text-neutral-700">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <p className="text-sm text-neutral-500">
              Leave your details and Cadre&apos;s team will follow up. We only store your name, email, and
              message.
            </p>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Work email"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like help with? (optional)"
              rows={3}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            {status === "error" && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {status === "sending" ? "Sending…" : "Send my details"}
            </button>
            <p className="text-center text-xs text-neutral-400">
              Or email {escalation.contactEmail} · {escalation.contactPhone}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
