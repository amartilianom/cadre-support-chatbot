# Cadre AI Support Chatbot

A customer-support chatbot for **Cadre AI** — built as a **configurable, reusable "conversational
system" block**, not a one-off. It answers common inbound questions from a curated, retrieval-grounded
knowledge base and **escalates to a captured lead** when it can't or shouldn't answer.

> **Live URL:** _pending deploy — see [Deployment](#deployment)._
> **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind · OpenRouter (Gemini 2.5 Flash) · Supabase.

This build was run with a **spec-driven methodology**. The thinking is visible in
[`decisions.md`](decisions.md) (a timestamped decision log), [`docs/concept-note.md`](docs/concept-note.md)
(why), [`docs/spec.md`](docs/spec.md) (what), and [`plan.md`](plan.md) (build order).

---

## The problem

Cadre's inbound team fields a growing volume of repetitive questions (what Cadre does, industry fit,
the AI Maturity Index, portal access, security posture, how to book a call). This bot deflects the
common ones and hands off the rest as qualified leads, so the team spends time on high-value
conversations.

## What it does (F1–F4)

- **F1 — Grounded chat.** Streaming answers grounded in a curated Cadre corpus (lexical retrieval).
- **F2 — Guardrail policy.** *Posture yes, guarantees no*: answers Cadre's security/model posture,
  **declines** pricing, certifications, and retention guarantees, never fabricates, stays on-topic.
- **F3 — Escalation → lead capture.** Captures name/email/message to Supabase behind a pluggable
  notifier; validates email; falls back to direct contact if storage is unavailable.
- **F4 — Booking CTA.** A persistent "Talk to an AI Strategist" action.

## Architecture — a shell of swappable blocks

The bot is one `ClientProfile` away from serving a different client. Every seam is behind an interface:

```
ClientProfile (corpus · persona · brand · model · escalation target · CTA)
   └─ ChatOrchestrator
        ├─ KnowledgeRetriever   lib/knowledge/retriever.ts   (lexical BM25 → swap: embeddings/pgvector)
        └─ LlmProvider          lib/llm/openrouter.ts        (OpenRouter stream → swap: any provider)
   └─ Escalation
        ├─ LeadStore            lib/leads/store.ts           (Supabase → swap: any store)
        └─ Notifier             lib/leads/notifier.ts        (log → swap: email/WhatsApp)
```

Chat flow: `app/api/chat/route.ts` → orchestrator → retriever + LLM (streamed).
Escalation: `components/LeadForm.tsx` → `app/api/lead/route.ts` → store → notifier.

## Model choice

**Google Gemini 2.5 Flash via OpenRouter**, selectable by env (`OPENROUTER_MODEL`) with no code
change. Rationale: cheap + fast + strong instruction-following — it protects the **$5 budget** and
keeps the live demo snappy. Output is capped at 800 tokens/turn and temperature is low (0.3) for
grounded answers. Swapping models is a config change (FR-031).

## Quick start (local)

```bash
npm install
cp .env.example .env.local     # then fill values (OPENROUTER_API_KEY is provided in the brief)
npm run dev                     # http://localhost:3000
```

The chat works with just `OPENROUTER_API_KEY`. Lead capture also needs Supabase (below).

## Deployment

1. **Vercel** — `npx vercel` (or import the repo in the Vercel dashboard). Set env vars in the
   project settings: `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and (for leads) `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`.
2. **Supabase** — create a project, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL
   editor to create the `leads` table, then paste the URL + service-role key into `.env.local` (and
   Vercel). Until then, the bot runs fine and lead submissions surface the direct-contact fallback.

## Scope decisions

**In scope (shipped):** F1–F4 above. **Non-goals (deliberate):** no auth/portal build (the bot
*explains* portal access), no pricing engine (declined), no site crawl (curated corpus), no admin/
analytics, no transcript logging (data minimization). Full rationale in the Concept Note §4.

**Deliberately deferred / what I'd do next:**
- Semantic retrieval (embeddings/pgvector) once the corpus grows or paraphrase misses appear.
- End-to-end lead-capture verification + an email `Notifier` for the inbound team.
- Deflection-rate measurement (needs transcript logging behind a consent notice).
- Automated tests + a formal latency measurement.

## Assumptions (gaps the brief left to us — decided, not deferred)

- **Booking:** cadre.ai has no public scheduler; the bot routes to the contact page + captures a lead.
- **Security:** the bot states *posture* only; guarantees (certs, retention, contracts) go to a human.
- **Portal:** described publicly; access is "provisioned by your Cadre team."
- **Persistence:** only name/email/excerpt stored — no consent basis to log anonymous chats.

---

## Conformance audit (Spec → verdict → evidence)

Honest status against [`docs/spec.md`](docs/spec.md). `✅ PASS` = implemented & verified.
`◐ PARTIAL` = implemented, not fully verified or scoped down. `✗ ABSENT` = not built (named on purpose).

| Obligation | Verdict | Evidence / note |
|---|---|---|
| FR-001 accept message, reply | ✅ PASS | `app/api/chat/route.ts`, verified live |
| FR-002 retrieve before generate | ✅ PASS | `lib/chat/orchestrator.ts` + `lib/knowledge/retriever.ts` |
| FR-003 grounding-only | ✅ PASS | `lib/chat/system-prompt.ts`; off-topic declined live |
| FR-004 stream reply | ✅ PASS | `lib/llm/openrouter.ts`, `components/Chat.tsx` |
| FR-005 unsupported → don't fabricate, offer human | ✅ PASS | verified (weather declined) |
| FR-010 services/industries | ✅ PASS | `lib/knowledge/corpus.ts`; verified (PE) |
| FR-011 AI Maturity Index + how to get scored | ✅ PASS | corpus `maturity-index`; verified |
| FR-012 portal explain + route | ✅ PASS | corpus `portal`; verified |
| FR-013 security posture | ✅ PASS | corpus `llm-security`; verified |
| FR-014 decline guarantees | ✅ PASS | system prompt; verified (SOC 2 ask declined) |
| FR-015 decline pricing | ✅ PASS | verified |
| FR-016 off-topic decline | ✅ PASS | verified |
| FR-020 escalation offers form + CTA | ◐ PARTIAL | CTA is persistent + prompt-nudged, not auto-trigger-detected |
| FR-021 persist lead (name/email/excerpt/reason) | ◐ PARTIAL | `lib/leads/store.ts` coded; not end-to-end tested (needs Supabase) |
| FR-022 no transcript persistence | ✅ PASS | `store.ts` stores only 4 fields |
| FR-023 invoke Notifier on save | ✅ PASS | `app/api/lead/route.ts` |
| FR-024 reject invalid email | ✅ PASS | `route.ts` email regex |
| FR-025 persistence fail → contact fallback | ✅ PASS | `route.ts` 503 branch (also covers unconfigured) |
| FR-030 single ClientProfile config | ✅ PASS | `lib/config/client-profile.ts` |
| FR-031 model swap via env | ✅ PASS | verified (model read from env) |
| NFR-002 cost caps (≤ $5) | ✅ PASS | `max_tokens` 800, history cap; spend negligible so far |
| NFR-003 graceful degradation | ✅ PASS | route + client error handling |
| NFR-004 secrets server-side, output escaped | ✅ PASS | env server-only; React escaping |
| NFR-005 privacy / data minimization | ✅ PASS | only 4 lead fields stored |
| NFR-001 latency p95 target | ◐ PARTIAL | streaming feels fast; not formally load-tested |
| NFR-006 per-request outcome logging | ◐ PARTIAL | errors + leads logged; not a uniform correlation-id per outcome |
| TC-002 OpenRouter server key, model env | ✅ PASS | `lib/llm/openrouter.ts` |
| TC-003 local embeddings | ✗ ABSENT (amended) | replaced by lexical retrieval — see `decisions.md` L-12 |
| TC-010 ClientProfile isolation | ✅ PASS | `client-profile.ts` |
| TC-011 Notifier seam | ✅ PASS | `lib/leads/notifier.ts` |
| TC-040 XSS escape | ✅ PASS | React auto-escaping; no `dangerouslySetInnerHTML` |
| TC-041 SQL injection | ✅ PASS | Supabase parameterized insert |
| TC-042 secrets not in client bundle | ✅ PASS | server-only env usage |
| TC-043 rate limit | ✅ PASS | `lib/rate-limit.ts` |
| TC-044 prompt-injection mitigation | ◐ PARTIAL | system-prompt guardrail; not adversarially hardened |
| S-01…S-07 scenarios | ✅ PASS | verified live (see `decisions.md` L-13) |
| S-08 lead submission | ◐ PARTIAL | coded; not live-verified pending Supabase |
| Live public deploy | ◐ PARTIAL | app builds; Vercel deploy pending (needs account auth) |
| Automated test suite | ✗ ABSENT | manual scenario verification only (budget trade-off) |
| Deflection-rate metric | ✗ ABSENT | deferred by design (needs consent-based logging — D-11) |
| WhatsApp notifier | ✗ ABSENT | cut; `Notifier` seam kept, email is the next impl (D-05) |

---

*Docs: [decisions.md](decisions.md) · [Concept Note](docs/concept-note.md) · [Spec](docs/spec.md) ·
[plan.md](plan.md) · agent onboarding in [CLAUDE.md](CLAUDE.md).*
