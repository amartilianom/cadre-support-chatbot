# plan.md — Cadre AI Support Chatbot

> **Build plan derived from [docs/spec.md](docs/spec.md).** Motivation: [docs/concept-note.md](docs/concept-note.md).
> Process decisions: [decisions.md](decisions.md). This is the phased, scope-explicit implementation
> plan — the required `plan.md` deliverable, standing in for the methodology's heavier
> Implementation Plan (one branch, ~4h build — see decisions.md L-06, L-11).

## What we're building (one sentence)

A public, retrieval-grounded support chatbot for Cadre AI that answers common inbound questions and
escalates to a captured lead when it can't or shouldn't answer — built as a **configurable shell**
so it re-skins for another client by swapping one `ClientProfile`.

## Scope decisions (explicit — the reviewer looks for this here)

**In (ships tonight → Tue morning):**
- **F1** Streaming, retrieval-grounded chat over a curated Cadre corpus.
- **F2** Guardrail system prompt: grounded answers, *posture yes / guarantees no*, pricing declined, on-topic.
- **F3** Escalation → structured lead capture (name/email/excerpt) in Supabase, behind a `Notifier`.
- **F4** "Talk to an AI Strategist" booking CTA.

**Cut / deferred (named, not hidden):**
- pgvector + site crawl → **cut**; small curated corpus + local cosine instead (D-02/03).
- WhatsApp notify → **cut**; `Notifier` seam kept, log today / email next (D-05).
- Auth, portal build, pricing engine, transcript logging, admin/analytics → **non-goals** (Concept §4).
- Full RTM traceability apparatus (AC-50…55 + CI grep/comm gates) → **condensed** (L-11).

**Priority order if the clock bites:** F1 → F2 → deploy → F3 → F4 → polish. *3 working features beat 8 broken.*

## Architecture (the shell + named component seams)

```
ClientProfile (one config: corpus, persona, brand, model, escalation target, CTA)   ← D-10
      │
ChatOrchestrator ── KnowledgeRetriever (local MiniLM embed → cosine top-k)          ← D-02/03
      │         └── LlmProvider (OpenRouter, streamed, model from config)            ← D-04
      │
Escalation ── LeadStore (Supabase insert) ── Notifier (log today / email next)       ← D-05/09/11
```

**Target file layout:**
```
app/                      layout, page (chat), api/chat/route.ts, api/lead/route.ts
components/               Chat.tsx, LeadForm.tsx
lib/config/               client-profile.ts        # the config surface (D-10)
lib/knowledge/            corpus.ts, embeddings.ts, retriever.ts
lib/llm/                  openrouter.ts            # LlmProvider
lib/chat/                 orchestrator.ts, system-prompt.ts
lib/leads/                store.ts, notifier.ts
lib/supabase.ts           server-side client
scripts/build-embeddings.ts + data/corpus-embeddings.json   # precomputed at build
supabase/schema.sql       leads table DDL
```

## Phases (each Claude can execute in sequence; DoD = definition of done)

### Phase 0 — Scaffold + deploy skeleton **early**  *(deploy-risk killer)*
- `create-next-app` (TypeScript, Tailwind, App Router), commit.
- Add `.env.example`; wire config reading; a placeholder chat page.
- **Deploy to Vercel now** — get a public URL before any real feature.
- **DoD:** a live Vercel URL renders the page; env vars set in Vercel. Satisfies the hard "public URL" requirement early.

### Phase 1 — Knowledge base + retriever  (FR-002, FR-003; TC-003)
- Hand-write `lib/knowledge/corpus.ts` from grounded facts (decisions.md L-07): services, industries,
  **AI Maturity Index (eight-pillar)**, portal, security posture, booking. Public facts only.
- `scripts/build-embeddings.ts`: chunk + embed corpus with MiniLM (transformers.js) → `data/corpus-embeddings.json` (committed).
- `retriever.ts`: embed query locally, brute-force cosine top-k.
- **Risk + fallback:** if transformers.js is unreliable on Vercel serverless (cold start/bundle),
  fall back to lexical (keyword/BM25-lite) retrieval and log the decision change. Corpus is tiny, so
  either works.
- **DoD:** `retriever.retrieve("what industries…")` returns relevant chunks locally.

### Phase 2 — Chat API + streaming UI + guardrail (F1, F2; FR-001/004/005, FR-010–016; TC-002/040/044)
- `lib/llm/openrouter.ts`: streaming chat via OpenRouter (model from config).
- `lib/chat/system-prompt.ts`: grounded, *posture yes/guarantees no*, decline pricing, escalation triggers.
- `lib/chat/orchestrator.ts`: retrieve → compose → stream. `app/api/chat/route.ts`.
- `components/Chat.tsx`: streamed chat UI (Vercel AI SDK `useChat` or manual SSE).
- Escape rendered output (TC-040). Cap tokens (NFR-002).
- **Deploy + smoke-test the 6 seed scenarios live.**
- **DoD:** live bot answers S-01…S-07 plausibly, declines pricing/guarantees, never fabricates.

### Phase 3 — Escalation + lead capture (F3; FR-020–025; D-09/11)
- `supabase/schema.sql`: `leads` table (id, name, email, excerpt, reason, status, created_at).
- `lib/leads/store.ts` (Supabase insert, parameterized — TC-041), `notifier.ts` (log impl).
- `components/LeadForm.tsx` + `app/api/lead/route.ts` (validate email FR-024, persist, notify, fallback FR-025).
- Orchestrator raises the form on escalation triggers.
- **DoD:** submitting the form writes a `leads` row; invalid email rejected; failure surfaces contact fallback.

### Phase 4 — Guardrail polish + verify (Code Quality 15%)
- Error handling on LLM/API/DB failures (graceful UI — NFR-003).
- Rate limit `/api/chat` (TC-043). Correlation-id logging without PII (NFR-006).
- Manual verification pass against §9 scenarios; note results.
- **DoD:** failure paths don't crash the UI; a short verification note captured.

### Phase 5 — README + audit + submission
- `README.md`: problem, goals/non-goals, assumptions, model choice, run/deploy steps, "what I'd do next".
- Conformance audit table (Spec obligation → verdict → file/line), **including gaps**.
- Verify zip excludes deps + **includes `.git`**; confirm live URL.
- **DoD:** README + audit committed; zip validated; URL live.

## Verification approach (light, budget-appropriate)
- Primary: manual scenario walk (§9) against the live deploy, recorded in the audit.
- A couple of unit checks for pure logic (retriever cosine, email validation) if time permits.
- No CI harness / RTM grep-gates (L-11 trim).

## Cost & safety guardrails (NFR-002)
- Cheap model (Gemini 2.5 Flash); output ≤ 800 tokens/turn; context ≤ ~2k tokens.
- Don't loop the model during dev; rate-limit the endpoint; watch the OpenRouter dashboard (< $5).

## External setup (owner: Andrés)
- Vercel account/CLI (deploy target — the public URL). *Ready.*
- Supabase project → paste `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` into `.env.local` (+ Vercel env). *Needed for Phase 3.*
- OpenRouter key — in `.env.local` (done). Verify `google/gemini-2.5-flash` is live at build (OPEN-Q-01).

## Open questions
- **OPEN-Q-01** — confirm the model slug/price on OpenRouter at build; swap via env if needed (FR-031).
- **OPEN-Q-02** — deflection-rate measurement (needs consent notice) — post-launch.
