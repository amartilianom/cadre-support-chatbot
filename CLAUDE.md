# CLAUDE.md — Cadre AI Support Chatbot

Onboarding for a fast, context-limited engineer (human or AI). Read this before touching code.
Opinionated on purpose — the rules below are decisions, not suggestions.

## What this is

A public, retrieval-grounded **support chatbot for Cadre AI** built as a **configurable shell**: one
`ClientProfile` (corpus, persona, brand, model, escalation target, CTA) re-skins it for another
client without code changes. It answers common inbound questions from a curated knowledge base and
**escalates to a captured lead** when it can't or shouldn't answer.

Full context: [docs/concept-note.md](docs/concept-note.md) (why) · [docs/spec.md](docs/spec.md)
(what) · [plan.md](plan.md) (build order) · [decisions.md](decisions.md) (every decision, dated).

## 🔴 The golden rule — the bot never fabricates

This is a consultancy's support bot. A wrong answer is worse than "let me connect you." When you
touch the system prompt (`lib/chat/system-prompt.ts`) or answering logic, preserve **all** of:

- **Grounding-only.** Answer only from retrieved corpus context + the system prompt. No outside facts.
- **Posture yes, guarantees no.** State Cadre's LLM-selection & data-security *posture* (model-agnostic
  across major providers, per-use-case selection, server-side keys, what this bot retains). **Decline
  guarantees** — certifications, retention periods, contractual terms.
- **Never quote pricing.** Decline + offer a strategist.
- **Escalate, don't bluff.** On an escalation trigger — explicit human request, pricing, *"how do I get
  scored"* (AI Maturity Index), *"how do I access the portal"*, security guarantees, or a question the
  corpus can't support — offer the lead form + the booking CTA.

If you change this behaviour, update `docs/spec.md` FR-005/013/014/015 and `decisions.md` first.

## Architecture — named component seams (keep them separable)

Each seam is swappable behind its interface (that's the product's whole point — D-10):

| Seam | File | Does | Swap surface |
|---|---|---|---|
| `ClientProfile` | `lib/config/client-profile.ts` | The one config that re-skins the bot | corpus, persona, brand, model, escalation target, CTA |
| `KnowledgeRetriever` | `lib/knowledge/retriever.ts` | Embed query locally, cosine top-k over corpus | swap to pgvector later |
| `LlmProvider` | `lib/llm/openrouter.ts` | Streamed chat completion | model via env; provider swappable |
| `ChatOrchestrator` | `lib/chat/orchestrator.ts` | Retrieve → compose prompt → stream + guardrails | — |
| `LeadStore` | `lib/leads/store.ts` | Persist a Lead (Supabase) | swap store |
| `Notifier` | `lib/leads/notifier.ts` | Announce a new lead (log today, email next) | swap impl |

Request flow: `app/api/chat/route.ts` → `ChatOrchestrator` → `KnowledgeRetriever` + `LlmProvider`.
Escalation: `components/LeadForm.tsx` → `app/api/lead/route.ts` → `LeadStore` → `Notifier`.

## Tech stack & conventions

- **Next.js (App Router) + TypeScript + Tailwind**, deployed on **Vercel**. Postgres via **Supabase**.
- **TypeScript strict.** No `any` in committed code; type the seam interfaces explicitly.
- **Secrets are server-side only.** `OPENROUTER_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` never appear
  in a client component, `NEXT_PUBLIC_*`, or the bundle. Leads are written from `/api/lead` (server).
- **Escape all model/user output** in the UI (React default; never `dangerouslySetInnerHTML`).
- **Cost discipline (hard).** Total OpenRouter spend must stay **< $5**. Cap output ≤ 800 tokens/turn,
  retrieved context ≤ ~2k tokens. Don't loop the model in dev. The chat endpoint is rate-limited.
- **Errors degrade gracefully.** An LLM/DB failure shows a friendly message and keeps the UI usable —
  it never crashes the page (NFR-003). Lead-write failure surfaces the direct contact path.
- **Config over hardcoding.** Anything client-specific goes in `ClientProfile`, not inline.

## Commands

```bash
npm run dev                       # local dev at http://localhost:3000
npm run build && npm start        # production build
npm run embed                     # rebuild data/corpus-embeddings.json from lib/knowledge/corpus.ts
npx vercel                        # deploy (or via the Vercel dashboard/GitHub)
```

Environment: copy `.env.example` → `.env.local` and fill values. `.env.local` is git-ignored — never
commit real keys. Set the same vars in Vercel's project settings for the deploy.

## What NOT to build (non-goals — pushing back is the job)

- No auth, no client portal, no dashboards. The bot *explains* portal access; it doesn't build it.
- No pricing engine — pricing is declined.
- No site crawl — the corpus is hand-curated (`lib/knowledge/corpus.ts`), public facts only.
- No transcript logging — persist only lead name/email/excerpt (data minimization, D-11).
- Don't put Cadre's internal economics language (attachment rate, margin) into the bot's corpus — that's
  hiring-context framing, not customer-facing knowledge.

## Verifying AI-written code (Code Quality dimension)

- After a change, run the relevant §9 scenario against the live/dev bot — don't trust it untested.
- Watch for the classic failures: fabricated facts, secrets leaking client-side, unescaped output,
  unhandled promise rejections in route handlers, and token/cost blowups.
- Keep commits small and message-clear; the reviewer reads `.git` history for pacing.

## Docs & decisions

- Changed behaviour → update `docs/spec.md` (FR/AC) and add a `decisions.md` entry (`L-*`) the same commit.
- Curated Cadre facts to ground answers: `decisions.md` L-07.
