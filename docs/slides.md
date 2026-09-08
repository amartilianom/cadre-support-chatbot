<!-- .slide: class="title" -->

# Cadre AI Support Chatbot

### A configurable, retrieval-grounded support bot — built as a *reusable block*, not a one-off.

**Andrés Martiliano** · Staff Product Architect take-home

🔗 **Live demo:** [cadre-test.vercel.app](https://cadre-test.vercel.app)  ·  **Code:** [github.com/amartilianom/cadre-support-chatbot](https://github.com/amartilianom/cadre-support-chatbot)

<small>Next.js 16 · TypeScript · Tailwind · OpenRouter · Supabase · Vercel</small>

---

## The brief, in one line

> Build a **customer-support chatbot for Cadre AI**, deploy it to a public URL, and show your engineering judgment.

The interesting part isn't "a chatbot." It's **how much of it survives** when the next client walks in.

So I built it as a **shell of swappable blocks** — and proved the reuse, live.

---

## The problem

Cadre's inbound team answers the **same questions** over and over:

- What does Cadre do? Which industries?
- What's the **AI Maturity Index**, and how do I get scored?
- How do I access the **client portal**?
- What's your **security posture**? Your **pricing**?

**Goal:** deflect the repetitive ones from a grounded knowledge base, and **hand off the rest as qualified leads** — so humans spend time on high-value conversations.

---

## The thesis (why this is an *architecture* task)

A one-off chatbot is a cost. A **reusable conversational-system block** is an asset.

Everything client-specific lives in **one `ClientProfile`**: corpus · persona · brand · model · escalation target · CTA.

> Swap that one config and the *entire* bot re-skins for another client — **zero code changes.**

That's the Staff-level bet: **build for the second client while shipping the first.**

---

## What it does — F1–F4

| | Feature | |
|---|---|---|
| **F1** | **Grounded chat** | Streaming answers from a curated Cadre corpus (lexical retrieval) |
| **F2** | **Guardrail policy** | *Posture yes, guarantees no*; declines pricing; never fabricates; on-topic |
| **F3** | **Escalation → lead** | Captures name/email/excerpt to Supabase behind a pluggable notifier |
| **F4** | **Booking CTA** | Persistent "Talk to an AI Strategist" |

---

## 🔴 The golden rule — the bot never fabricates

This is a consultancy's support bot. **A wrong answer is worse than "let me connect you."**

- **Grounding-only** — answers only from retrieved corpus + system prompt. No outside facts.
- **Posture yes, guarantees no** — states Cadre's model/security *posture*; **declines** certifications, retention terms, contracts.
- **Never quotes pricing** — declines and offers a strategist.
- **Escalates, doesn't bluff** — on any trigger, offers the lead form + booking CTA.

<small>Encoded in `lib/chat/system-prompt.ts` and locked as spec obligations FR-005/013/014/015.</small>

---

## Architecture — a shell of named seams

Every seam sits behind an interface, so each is swappable in isolation:

| Seam | Does | Swap surface |
|---|---|---|
| `ClientProfile` | The one config that re-skins the bot | corpus · brand · model · CTA |
| `KnowledgeRetriever` | Lexical BM25 over the corpus | → embeddings / pgvector |
| `LlmProvider` | Streamed chat completion | model via env; provider swappable |
| `ChatOrchestrator` | retrieve → compose → stream + guardrails | — |
| `LeadStore` / `Notifier` | persist a lead / announce it | Supabase → any store; log → email |

`route.ts → ChatOrchestrator → KnowledgeRetriever + LlmProvider`

---

## Reuse, made *demonstrable* (not claimed)

The acceptance criterion "re-skins for another client" is easy to *assert*. I made it a **live demo**:

```bash
CLIENT_PROFILE=northwind   # a fictional freight company ships in the repo
```

Flip that one env var and the whole bot becomes **Northwind Freight** — new corpus, persona, brand color, greeting, and CTA. **Zero code changed.**

> It answers freight questions and **declines Cadre-only ones** with *its own* contact path.

That's acceptance criterion **AC-16** you can watch happen.

---

## Reuse economics (the hours argument)

Not "it's reusable" — *how much*, and *what it attaches to*.

- ~**6h** to build the shell + first corpus. On client #2, ~**70% amortizes** — only the `ClientProfile` (corpus, brand, escalation) is new work.
- The **`KnowledgeRetriever`** and **`LlmProvider`** seams don't just serve this bot — they **attach** to adjacent blocks (document analysis, a scoring engine).
- Reuse ladder, named per component: **Forked → Configurable → Productized.**

<small>Full table in Concept Note §8.1 (build vs. reuse hours, cross-block attachment).</small>

---

## How it was built — spec-driven, interview-first

Not vibe-coded. A **staged methodology** with a visible paper trail:

**Concept Note** (*why*) → **Spec** (*what shall it do* — EARS requirements, Given/When/Then scenarios) → **Plan** (*build order*) → **conformance audit**.

- Every decision is logged and dated in **`decisions.md`** (L-01…L-16).
- Requirements carry stable IDs (FR-/NFR-/TC-/AC-/S-) so tests and docs trace back.
- The reviewer can read `.git` history and see the reasoning, not just the result.

---

## Guardrails in action (verified live)

| You ask… | The bot… |
|---|---|
| "What's the AI Maturity Index?" | Explains the eight-pillar framework, offers to get you scored |
| "How much does it cost?" | **Declines pricing**, offers a strategist |
| "Are you SOC 2 certified?" | States posture, **declines the guarantee**, routes to a human |
| "What's the weather?" | **Declines** — off-topic, nothing fabricated |
| "Just give me the portal URL" *(insisting)* | **Holds the line** — access is provisioned by your Cadre team |

---

## Security & data posture — least privilege by design

- **Secrets server-side only.** `OPENROUTER_API_KEY` / `SUPABASE_KEY` never touch the client bundle or `NEXT_PUBLIC_*`.
- **Leads are INSERT-only.** Supabase **publishable key + row-level security** — the app can *submit* a lead but can never read, update, or delete one. A leaked key can't exfiltrate leads.
- **Data minimization.** Only name / email / excerpt stored — **no transcript logging**.
- **Output escaped** (React default; no `dangerouslySetInnerHTML`).

---

## Quality & cost discipline

- ✅ **Automated tests** — Vitest, 8 unit tests over the retrieval seam (incl. *off-topic returns nothing* — the grounding guarantee) + email validation. `npm test`, no network.
- ✅ **Conformance audit** in the README — every spec obligation → verdict → evidence, **including honest gaps** (I mark what's `PARTIAL`/`ABSENT`, not just the wins).
- ✅ **Cost cap (hard): < $5.** Cheap model, output ≤ 800 tokens/turn, context ≤ ~2k, rate-limited endpoint.
- ✅ **Degrades gracefully** — an LLM/DB failure shows a friendly message and surfaces the direct-contact path; the page never crashes.

---

## What I deliberately did *not* build

Pushing back on scope is part of the job. **Named non-goals:**

- No auth, no client portal, no dashboards — the bot *explains* portal access; it doesn't build it.
- No pricing engine — pricing is **declined**.
- No site crawl — the corpus is **hand-curated**, public facts only.
- No transcript logging — data minimization.

> Three working features beat eight broken ones.

---

## What I'd do next

- **Semantic retrieval** (embeddings / pgvector) once the corpus grows or paraphrase misses appear — the seam is already in place.
- **Email `Notifier`** for the inbound team (logging is today's impl; the interface is swappable).
- **Deflection-rate dashboard** — already *measurable* from no-PII session outcome logs.
- **Per-tenant routing** — the shell already supports N profiles via `CLIENT_PROFILE`.

---

<!-- .slide: class="title" -->

## Thank you

**Live demo:** [cadre-test.vercel.app](https://cadre-test.vercel.app)

**Code + full docs:** [github.com/amartilianom/cadre-support-chatbot](https://github.com/amartilianom/cadre-support-chatbot)

<small>Concept Note · Spec · Plan · decisions.md — the thinking is all in the repo.</small>

**Andrés Martiliano**
