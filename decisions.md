# Decision Log

Process decisions for this take-home, numbered `L-*`. Feature decisions (`D-*`) live inside the
Concept Note if we write one. Timestamps are local (SAPST). Today: 2026-09-07.

---

## L-01 · 19:08 · Start: run the take-home under the spec-driven methodology
**Decided by:** you, by asking me to read and follow `take-home-prompt.md`.
**What you asked for:** read the prompt and follow it — run a take-home / technical test using
the spec-driven development methodology, interview-first, no work until the interview is done.
**What I am about to do:**
1. Confirm the repo prerequisite (done — `git init -b main` already ran; the audit needs commits
   to pin against).
2. Hand you the two client slash-commands to install the methodology (Step 0) — I cannot run
   those myself.
3. Flag the Windows/PowerShell caveat: the methodology's mechanical gates (`grep`/`sed`/`awk`/
   `comm`) do not run in PowerShell — you'll need Git Bash or WSL, with `LC_ALL=C` on sorted
   comparisons.
4. Interview you about the test (Step 1), a few questions at a time, starting with the brief.
**Not yet decided:** how much methodology this earns (Step 2) — that waits until I've seen the
brief, the time budget, and the rubric.
**Reversible:** entirely; nothing has been built.

### Phase clock
- Interview started: 19:08
- Methodology installed & 4 skills verified present (staged-engineering-doc, spec-answers,
  spec-conformance, three-p-visualizer): 19:11. Functional check deferred to the brief.
- Brief pasted + assessment PDF (`Cadre_AI_Chatbot_Take_Home_Candidate_v1.1.pdf`) read in full: 19:21.
- Interview + scope (Steps 1–2) done, stack locked: 19:36–20:36.
- Web research on cadre.ai done (facts in L-07): 20:36.
- **Concept Note drafted** (`docs/concept-note.md`) via `staged-engineering-doc` skill — which
  also **functionally verified** the methodology is live: **20:38**.
- Git identity set; API key confirmed absent from all files (grep `sk-or-v1` → none): 20:39.

---

## L-02 · 19:21 · Brief captured: Cadre AI customer-support chatbot
**Decided by:** facts, not a choice — recording what the brief actually requires so scope can be
argued against it clause by clause.

**Role / evaluator.** Email says *Staff Product Architect*; PDF header says *AI Engineer & FDE*.
Company: Cadre AI (gocadre.ai / cadreai.com), an AI strategy & implementation consultancy.

**The build.** A customer-support chatbot for Cadre AI's inbound team. *Deliberately
underspecified — scoping and prioritisation is explicitly part of the grade.* Minimum bar: a
functional chatbot a prospective/existing client could plausibly use to get answers.

**Rubric (this is the spine — everything maps to it):**
| # | Dimension | Weight |
|---|---|---|
| 1 | Claude Code Proficiency (CLAUDE.md, plan.md, subagents, custom commands, context mgmt) | **30%** |
| 2 | System Design & Architecture (data model, API, **system-prompt design**, separation, scaling) | 25% |
| 3 | Development Speed & Scope (prioritisation, scope boundaries, complexity) | 20% |
| 4 | Code Quality & Verification (clean code, error handling, catching AI bugs) | 15% |
| 5 | Communication & Reasoning (explaining decisions, trade-offs) | 10% |

**Hard deliverable requirements (non-negotiable):**
- A **deployed, publicly accessible URL** (the app must be live — deployment is graded).
- Zip of the project **including `.git`** (they review commit history/pacing), excluding
  node_modules/dist/build/venv. Keep it a few MB.
- `CLAUDE.md` at root. `plan.md` at root (PDF spells it lowercase `plan.md`; email said
  `PLAN.md` — going with the PDF as authoritative, will note).
- Small, frequent, descriptive git commits as we build.

**Seed scenarios (starting point, not exhaustive):** (1) what Cadre does + industry fit;
(2) book a call with a strategist; (3) access the Cadre portal; (4) what the AI Maturity Index is
+ how to get scored; (5) Cadre's approach to LLM selection & data security; (6) can't-answer →
escalate/redirect.

**Model:** any via OpenRouter ($5 budget, expires 7 days from receipt). Choice + justification is
graded. **Stack:** free choice; only hard constraint is "deploys and works on a public URL."

**Time (from PDF):** recommend **4–6 h build**, no hard limit, "don't spend your whole weekend."
Calendar: 3 days to build, due day 4, 1-hour live review day 5; submit ≥1 full business day
before the review.

### Assumptions I'm making from the brief (flag if wrong) — [A-*]
- **A-1:** Greenfield. Repo is empty apart from the prompt + PDF; no starter code or API to build
  against beyond OpenRouter. (Confirmed by `ls`.)
- **A-2:** "Knowledge" the bot needs (services, pricing posture, portal, Maturity Index, security
  stance) is **not provided** — I must source it from cadreai.com/gocadre.ai + the PDF's About
  table, and where it's genuinely unknown the bot must *not fabricate* (esp. pricing). This is a
  `[OPEN-Q]` for the Concept Note, not something to invent.
- **A-3:** The $5 OpenRouter budget means model choice should favour a cheap, fast, capable model;
  the demo must survive a live review without burning the budget.

### Ambiguities I spotted in the brief (Q8) — to resolve with you or mark [OPEN-Q]
- **AMB-1 — Deliverable naming vs methodology artifacts.** They *require* `CLAUDE.md` + `plan.md`.
  The methodology produces Concept Note / Spec / (optional) Implementation Plan. These must be
  reconciled, not run in parallel as two doc sets. Candidate resolution: the methodology's docs
  live in a `/docs` folder; `plan.md` at root is the phased build plan (their required artifact,
  informed by the Spec); `CLAUDE.md` is the agent-onboarding doc. Needs your sign-off in Step 2.
- **AMB-2 — Depth of "knowledge."** RAG over real Cadre content vs a curated hand-written
  knowledge base baked into the system prompt / a small retrieval file. For a 4–6 h MVP this is
  the single biggest scope lever.
- **AMB-3 — Escalation semantics.** "Escalate or redirect" — to what? A captured email/lead form?
  A "book a call" link? No real inbox exists. Likely a lead-capture stub + booking link.
- **AMB-4 — Persistence / data model.** Rubric names "data model" (25% dimension). Does a chatbot
  MVP need a DB (conversation storage, lead capture) or is stateless-per-session enough? Scope
  lever tied to the deploy target.
- **AMB-5 — Auth / portal.** Scenario 3 (access the portal) — do we *implement* any portal/auth,
  or does the bot just explain how to access it? Almost certainly the latter (explain, don't
  build) for this budget.
- **AMB-6 — Pricing answers.** Real pricing is confidential/unknown. The bot needs an explicit
  policy: decline specifics + route to a call, rather than hallucinate numbers.

---

## L-03 · 19:25 · Time budget: ~4 hours tonight, finish Mon 09-07, hard due Tue 09-08
**Decided by:** you.
**Timeline:** received Fri 11:00 COT (2026-09-04). Day-4 submission due **Tue 2026-09-08**;
1-hour live review **Wed 2026-09-09**. "Submit ≥1 business day before review" → submitting by
Tue satisfies it; you want to **finish tonight (Mon 2026-09-07)**.
**Budget:** ~2 h already spent adapting the methodology (web version + your own gig's), **~4 h
left tonight** to make it top-notch. Effective build budget = **~4 h, docs + build + deploy
included.**
**Consequence (the one that drives everything):** 4 h is the *low* end of their 4–6 h rec, and it
has to cover documents, implementation, a live deployment, and submission. This lands us in the
methodology's "~4–12 h" band → **short Concept Note + tight Spec, skip the heavy Implementation
Plan** (its value is coordinating multiple branches; there's one here), then implement, then
audit. Docs must be lean — a wall of text loses points here, it doesn't gain them.
**Provisional time allocation (to confirm in Step 2):** Concept Note ~25m · Spec ~35m ·
CLAUDE.md + plan.md ~20m · build ~1h45 · deploy early ~30m · audit + README + zip ~25m.
**Reversible:** yes, but the clock is the binding constraint — every scope choice gets measured
against these 4 hours.
**Buffer:** Tuesday 09-08 is the real hard deadline (submit ≥1 business day before the Wed
review). Finishing tonight buys a full cushion day for deployment issues — so a modest scope
reach is affordable.

---

## L-04 · 19:34 · Your scope calls: simple RAG, lead-to-DB, WhatsApp as stretch
**Decided by:** you, with my counsel noted per point.

- **Knowledge = simple RAG over cadreai.com.** You chose the more ambitious option over my
  curated-KB recommendation. I agreed on the condition it's **de-risked**: small curated corpus
  (PDF About table + a handful of real cadreai.com pages), not a full crawl. → `[D-RAG]` in the
  Concept Note.
  - **Grounding risk R-1 (mine to verify before building):** the OpenRouter key is a chat router
    and may not serve `/embeddings` reliably. **Mitigation:** embed with a *local* model (MiniLM
    via transformers.js) — free, no extra key, deterministic. Corpus is tiny → brute-force cosine
    top-k, **no vector DB required at this scale.** pgvector optional if we want the architecture
    story; retrieval math is identical.
- **Escalation = create a lead in our own DB** (same Postgres). Core feature. Exercises the
  "data model" rubric line. → `[D-LEAD]`.
- **WhatsApp notification = STRETCH, not core.** You asked for a WhatsApp ping to a specified
  number on new lead/booking. I flagged real setup friction (Twilio sandbox join / Meta Cloud API
  number+template approval, 24h window). **Decision:** escalation writes the lead row (core)
  behind a pluggable `notify(lead)` interface; WhatsApp is one impl attempted only if time
  allows, with logging as the guaranteed fallback. → `[D-NOTIFY]`, WhatsApp = `[OPEN-Q]` on
  feasibility tonight.
- **You saw no other ambiguities**; framed the real question as "how big, and can I finish
  tonight" — answered above: MVP shippable tonight, RAG/WhatsApp degrade gracefully, Tue is the
  safety net.

### Where I disagreed and you chose anyway
- I recommended a **curated in-context KB**; you chose **RAG**. Recorded as your call. I did not
  sand it down — it's a genuine reach for the 4h budget, justified by the buffer day and the
  architecture-dimension payoff, and de-risked via local embeddings.

### Still OPEN (blocking Step 2 scope lock)
- **Stack decision.** My rec: **Next.js full-stack on Vercel + Supabase** (one deploy, lowest
  deployment risk, Postgres serves leads + optional pgvector). Alternative: **Python/FastAPI +
  React** (plays to your backend strength, but two services / slower first deploy). AWS ruled out
  for tonight (too much deploy surface under the clock). **Awaiting your call.**

---

## L-05 · 19:36 · Stack locked: Next.js (App Router) + Supabase + Vercel
**Decided by:** you, agreeing with my rec.
**Because:** it's your PoC default and a strong fit for a chatbot — one repo, one deploy (lowest
deployment risk, and deployment is graded), Supabase Postgres serves both the leads table and
optional pgvector, streaming chat is trivial with the Vercel AI SDK, and you're fluent in
Next/React.
**Rejected:** AWS (too much deploy surface under a 4h clock — deployment issues are a known
grade risk); Python/FastAPI + React (plays to backend strength but two services / slower first
deploy — the single-deploy win outweighs it here).
**Reversible:** cheap now, expensive after the first deploy. Committing.
**Interview phase done:** 19:36.

---

## L-06 · 20:36 · SCOPE LOCKED (you agreed, Step 2 complete)
**Decided by:** you ("Agree, let's kick off").
**Features (MVP, ships tonight):**
- **F1 Grounded chat** — streaming chatbot answering from a *simple RAG* over a curated Cadre
  corpus (what Cadre does, industries, services, AI Maturity Index, portal access, LLM selection
  & data-security posture, booking).
- **F2 Guardrail / system-prompt policy** — no hallucination; **pricing → decline + route to a
  call**; stay on-topic. (System-prompt design = 25% dimension.)
- **F3 Escalation → lead capture** — can't-answer / wants-human → write a lead to Supabase behind
  a pluggable `notify(lead)` interface. (data-model dimension.)
- **F4 Booking CTA** — surface "Talk to an AI Strategist" → cadre.ai/contact.
**Stretch (time / Tue buffer only):** WhatsApp notify on new lead · pgvector vs in-memory cosine
· a couple scripted eval scenarios.
**Non-goals (explicit):** no auth / no real portal build (bot *explains* access) · no pricing
engine (policy-declined) · no site crawl (curated corpus) · no admin dashboard / multi-tenant /
analytics · embeddings run **locally** (MiniLM), not via the OpenRouter key.
**Documents (reconciled — resolves AMB-1, no duplicate sets):** `docs/concept-note.md` (short) ·
`docs/spec.md` (tight) · root `plan.md` = phased build plan derived from Spec (their required
artifact — no separate heavy Implementation Plan) · root `CLAUDE.md` (agent onboarding, 30%) ·
root `README.md` (cover doc + audit table).
**Rejected alternatives:** all three methodology docs (Plan's value is coordinating branches —
there's one branch here; its content collapses into plan.md) · no documents at all (product-
architect role — the goals/non-goals + decision log *is* the point, and 30% of grade is planning)
· curated in-context KB instead of RAG (you overrode — logged in L-04).
**Reversible:** docs are cheap to revise pre-implementation; feature cuts reversible until build.

---

## L-07 · 20:36 · Research grounding (cadre.ai) — facts the corpus will use
**Canonical domain:** `cadre.ai` (gocadre.ai + cadreai.com 301 → cadre.ai). Booking =
`cadre.ai/contact`. Email `hello@gocadre.ai`. Phone (619) 324-3223. HQ San Diego.
**Tagline:** "From AI Confusion to AI Confidence." Official **OpenAI Service Partner**.
**4 core services:** AI Strategy · AI Leadership & Facilitation · AI Engineering · AI Agents
(also Education & Training, AI Workflow Automation / "AI Blueprint", CustomGPT deployment).
**Industries:** Professional Services, Private Equity, Real Estate, Financial Services, Mortgage
& Lending, Construction, Retail & E-commerce, Manufacturing & Logistics, Hospitality.
**AI Maturity Index:** scoring across an **eight-pillar** AI-transformation framework, a grade per
pillar + improvement insights; access via /contact ("Get Your AI Maturity Index" / "Get Your AI
Results").
**Client portal:** dashboard tracking "tools, agents, training, and results"; access via the team
(no public URL).
**LLM selection:** helps clients "select and configure the LLM(s) that best align with your tech
stack and business goals"; works across 15+ providers. **Partners (PDF, authoritative):** OpenAI,
Anthropic, Google, Microsoft, AWS, Salesforce, Snowflake + OpenRouter.

### Open questions the bot must NOT fabricate (→ decline + route to a strategist)
- **[OPEN-Q-1] Pricing** — not disclosed anywhere. Policy: decline specifics, offer a call.
- **[OPEN-Q-2] Data-security specifics** — no public policy. Describe posture generally
  ("select/configure appropriate LLMs, enterprise partners") + route to a strategist; don't
  invent guarantees.
- **[OPEN-Q-3] Portal URL / login** — none public. Bot explains access is via the Cadre team;
  don't invent a login URL.
- **[OPEN-Q-4] Booking link** — no Calendly; the real CTA is the /contact form + email/phone.
  Bot points there. (For you to confirm if you have a real scheduling link to use.)
- **[OPEN-Q-5] WhatsApp target number** — needed only for the stretch notification. For you.
