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

---

## L-08 · 21:15 · JD reframes the target: build the bot as a *reusable, configurable block*
**Decided by:** evidence — read the real job posting (`Staff Product Architect.html`, Gem job
board, Colombia Remote, comp $7–8k/mo, posted 2026-08-20). I was wrong earlier that the JD would
be marginal; recording the correction and its consequences.

**What the role actually is:** Cadre sells solutions as **"blocks"** — productized engagements
(document analysis, data/pipeline, scoring engines, **conversational systems**) bought from a
library. The Staff Product Architect **owns the technical layer beneath that library**: decompose
blocks into **named, reusable, configurable components** (each with a *defined configuration
surface*, owner, maturity rating), track **reuse economics** (attachment rate, net-new hours as %
of quoted hours, margin), and hold the **build-once-configurably-reuse-many** line.

**Consequence for THIS take-home (the chatbot IS a "conversational system" block):** the highest-
leverage move is to build and pitch the bot **as a configurable, reusable component**, not a
one-off. This maps straight onto the graded dimensions (System Design 25%, Communication 10%) AND
the role's core competency. Concrete adjustments (to weave into the Concept Note revision):
- **Elevate a first-class configuration surface** — a single typed client config
  (`ClientProfile`) that parameterizes: knowledge corpus, system-prompt/persona, brand, model,
  escalation/notify target, booking CTA. "Swap the config → a new client's bot." This embodies
  "built once, configurably, reused across every client."
- **Name the component boundaries** the JD would grade: `KnowledgeRetriever` (RAG), `LlmProvider`
  (OpenRouter, swappable — already D-04/D-03), `LeadStore` (repo), `Notifier` (pluggable — already
  D-05), `ChatOrchestrator`. Give each a one-line configuration surface + maturity rating, echoing
  the JD's own vocabulary.
- **Day-5 narrative:** speak in reuse-vs-net-new + commercial (hours/cost/margin) terms; frame
  CLAUDE.md/docs as "standards people actually follow."
**Stack validation:** JD's named stack = TypeScript/Node, Python, Next.js, Postgres/Supabase,
Vercel/Render/AWS. Our L-05 pick (Next.js + Supabase + Vercel) is dead-on. Retrieval is explicitly
named as a valued pattern → RAG (D-02) is well-aligned.
**Boundary (important):** the JD's internal economics language (attachment rate, margin) is
*hiring/architecture framing* — it belongs in our **docs/narrative**, NOT in the customer-facing
bot's knowledge corpus. The corpus stays public-facing facts only (L-07).
**Does NOT change:** the 5 open-question answers, or the core feature scope (F1–F4). It sharpens
*how we architect and narrate*, not *what we build*.
**Reversible:** easily — these are framing/abstraction choices applied before implementation.

---

## L-09 · 21:27 · Concept Note revision from your review (all points accepted)
**Decided by:** you (deep review), me applying. Every point accepted; none sanded down.

**Framing principle you set:** an open question owned by "Cadre" (unanswerable before submission)
reads as a *stall*; a defended *assumption* reads as *judgment*. So booking/security/portal move
from `OPEN-Q` → **stated assumptions with rationale** (new Concept §6.6 A-1…A-4).

**Point-by-point:**
1. **Booking (was OPEN-Q-01) → A-1.** Verified: cadre.ai/contact form + hello@gocadre.ai + phone;
   **no scheduling integration anywhere.** Bot points to contact path AND captures a lead same
   turn. "If Cadre has an internal scheduler, it's a KB change, not a code change." (cadreai.com
   302→cadre.ai; domain confirmed.)
2. **Data security (was OPEN-Q-02) — the real bug.** Brief lists "LLM selection and data security"
   as a scenario the bot *should answer*; old **D-07 declined it** → contradicts the brief.
   **Fix (top priority): D-07 split → "posture yes, guarantees no."** Bot answers posture
   (model-agnostic across OpenAI/Anthropic/Google/Microsoft/AWS; selection per use case;
   server-side key handling; what THIS bot retains); declines only guarantees (certs, retention
   periods, contractual terms) + pricing.
3. **Portal (was OPEN-Q-03) → A-3 + behavior.** Cadre publicly describes it ("centralized portal
   to track tools, agents, training, and results"). Bot answers *what it is* fully; routes only on
   *how to get in* ("provisioned by your Cadre team as part of an engagement"). §4 non-goal (don't
   *build* it) stays.
4. **Transcripts (was OPEN-Q-06) → D-11 data minimization.** Persist only name/email/excerpt — no
   consent basis to log anonymous public-site conversations. Named trade-off: **can't measure
   deflection rate** (the metric that proves the bot works) until a consent notice is added.
5. **WhatsApp — CUT, not stubbed.** It was in the C4 diagram (reads as design, not stretch) and
   invites "why WhatsApp for a San Diego B2B consultancy?" Removed from diagram/deps/deferred.
   Keep the `notify(lead)` seam (D-05): impl today = Postgres+log; second impl = **email to the
   inbound team**; WhatsApp only if that's where the team works (unknown). OPEN-Q-04 dropped.
6. **AI Maturity Index — under-covered → fixed.** Brief names it twice; it's the most
   Cadre-specific question. Add a KB entry (**eight-pillar framework, grade per area with
   explanations + actionable insights**) and make **"how do I get scored" an escalation trigger**.
7. **Lead capture was an unstated scope choice → D-09.** Brief says "escalate *or redirect*." We
   chose a structured Lead (table+form) over a near-zero-cost redirect. Now a *decision* with the
   redirect-only alternative named and **rejected** (redirect drops the context the strategist
   needs) — so it reads as judgment, not scope creep against "cut aggressively."

**Plus (your prior confirmation): D-10 configurable shell.** Bot is a reusable "conversational
system" block: a typed `ClientProfile` parameterizes corpus/persona/brand/model/escalation/CTA;
named seams `KnowledgeRetriever` · `LlmProvider` · `LeadStore` · `Notifier` · `ChatOrchestrator`.

**Housekeeping:** JD HTML (`Staff Product Architect.html` + `_files/`) git-ignored — contains PII
(phone, personal email, salary form), not a deliverable.
**Reversible:** all pre-implementation; cheap.

---

## L-10 · 21:40 · Repo hygiene: reference material → clean Markdown in `/reference`
**Decided by:** you ("convert the pdfs and html into md ... keep clean the repository").
**Did:**
- Converted the assessment PDF → `reference/take-home-assessment.md` (faithful, diffable).
- Converted the JD HTML → `reference/staff-product-architect-jd.md` — **PII stripped** (only the
  public posting; the application form's name/email/phone/salary excluded).
- Moved `take-home-prompt.md` → `reference/` so all non-deliverable reference material lives in one
  place and the root holds only project artifacts.
- **Untracked the binary PDF** (`git rm --cached`) and git-ignored it + the JD HTML. Originals stay
  on disk for reference but never enter git or the submission zip.
- Updated Concept Note §17 source links to the converted files.
**Why:** binary PDF + a saved-HTML-page-with-assets-folder are exactly the clutter a clean repo /
lightweight zip should avoid; Markdown is diffable, greppable, and reviewable.
**Originals deleted (21:41):** on your go-ahead, removed the PDF, `Staff Product Architect.html`,
and `Staff Product Architect_files/` from disk — content is preserved in `reference/*.md`. Root now
holds only project + reference material. `.gitignore` entries kept as a PII safety net.
**Reversible:** content retained in `/reference`; the binary/HTML originals are gone.

---

## L-11 · 21:43 · Focused Spec written; methodology machinery trimmed (declared)
**Decided by:** you (green-lit the focused Spec over the full apparatus).
**Wrote:** `docs/spec.md` — 31 FRs/NFRs/TCs, EARS phrasing, quantified NFRs (incl. **≤$5 cost**,
p95 latency), 8 Given/When/Then scenarios with boundary/failure variants, an ER diagram (Lead,
KbChunk), CWE-shaped security TCs, and acceptance criteria mapping every scenario + A-1…A-4 +
D-07/08/09.

**Kept (high-signal, directly graded):** §3 scope + inherited D-*; §4 TCs incl. lean §4.5 security;
§6 glossary; §7 EARS FRs; §8 quantified NFRs; §9 scenarios + key variants; §10 data model + ER
diagram; §11.1–11.4 acceptance criteria; §17 handoff.

**Trimmed (with reason — the methodology's own guidance says most work shouldn't get the full set,
and its Spec floor is ~4–10k words built for multi-branch team delivery):**
- **§11.5 full RTM meta-ACs `AC-50…AC-55`** → condensed to 3 "light" obligations. The full six
  bind to a heavy Plan-side apparatus (`IMP-*` impact ledger, `OBS-*` observability rows,
  supply-chain lockfile scan) and **mechanical `T-N.D8/D8b/D9/D10/D15/D16/D20` grep/comm gates** —
  all designed for a multi-branch Implementation Plan run in CI. *This is one branch, ~4h, no CI
  gate harness.* Keeping the intent (scenario→test, NFR→check, TC→evidence), dropping the ceremony.
- **Full per-scenario variant exhaustion** (every boundary/concurrency/property variant) → enumerated
  only the *consequential* variants; single-path scenarios explicitly declared.
- **Live CWE-Top-25 fetch (MD-31)** → used a known-relevant CWE set (79/89/200/770 + LLM01) and
  said so inline. A live fetch + full-Top-25 sweep is disproportionate for this surface.
- **The separate heavy Implementation Plan** → replaced by root `plan.md` (their required
  artifact), per L-06. So the Plan-side mechanical gates have no home by design.
**Why it's safe:** a take-home reviewer values judgment about *what to run*; over-running the
pipeline on a 4h build is the anti-pattern the methodology itself warns against. The trims are
declared in the Spec's focus note + §11.5, so nothing is hidden.

### Phase clock
- Concept Note done (rev 1): 20:38 · rev 2 (from your review): 21:27
- Repo cleaned to Markdown reference set: 21:41
- **Spec (focused) done: 21:43**
- `plan.md` + `CLAUDE.md` done: ~21:54 · Next.js scaffold (Next 16 / React 19 / Tailwind v4)
  merged + committed: 21:59 · Supabase client added: 22:02.

---

## L-12 · 22:02 · Retrieval: lexical for MVP (amends D-02/D-03 implementation)
**Decided by:** me, at build time, flagged to you for override.
**Change:** implement `KnowledgeRetriever` with **lexical/keyword scoring** over the curated corpus
for the MVP, **not** runtime MiniLM embeddings.
**Because:** deployment reliability is graded and transformers.js model-loading on a Vercel
serverless **cold start** is a classic demo-killer (multi-second first response, bundle bloat,
`/tmp` re-download per new instance). The corpus is tiny (~dozens of chunks), so lexical retrieval
is instant, dependency-free, and deploys anywhere. Answer *grounding* (the graded behaviour) is
unchanged — only the similarity function differs.
**Kept open for upgrade:** the `KnowledgeRetriever` interface is unchanged, so semantic embeddings
or pgvector is a drop-in swap with a clear trigger (corpus grows / paraphrase misses appear).
**Net dependency effect:** dropped `@huggingface/transformers`; also implementing OpenRouter
streaming directly (no heavy AI SDK) to avoid version churn on the bleeding-edge Next 16 stack.
Only added runtime dep: `@supabase/supabase-js`.
**Status vs docs:** amends Concept D-02/D-03 and Spec TC-003/§8. Will note in the audit; **you can
override to semantic** and I'll swap the retriever impl.
**Reversible:** yes — contained behind the retriever interface.

---

## L-13 · 22:13 · MVP built + verified locally (F1–F4); OPEN-Q-01 resolved
**Built:** the full shell — `ClientProfile`, lexical `KnowledgeRetriever`, curated corpus,
`LlmProvider` (direct OpenRouter SSE), guardrail system prompt, `ChatOrchestrator`, streaming chat
UI, `LeadForm`, `LeadStore` (Supabase) + `Notifier` (log), `/api/chat` + `/api/lead`, rate limiter,
`supabase/schema.sql`. Production build passes (TypeScript green).

**OPEN-Q-01 RESOLVED:** `google/gemini-2.5-flash` is live on OpenRouter and returns grounded
answers — verified with a real call. No model swap needed.

**Guardrail verification (live, evidence for the audit):**
| Scenario | FR | Result |
|---|---|---|
| Pricing | FR-015 | ✅ declined + routed to strategist |
| AI Maturity Index + how to get scored | FR-011 | ✅ explained eight-pillar + escalates |
| Security posture + SOC2/retention guarantee ask | FR-013/014 | ✅ **posture stated, guarantees declined** (D-07 fix works) |
| Portal access | FR-012 | ✅ explains + routes, no invented URL |
| Off-topic (weather) | FR-016 | ✅ declined, stayed on-topic |
| "What does Cadre do + PE?" | FR-010 | ✅ grounded, accurate |

**Not yet verified (needs your accounts):** lead persistence end-to-end (needs Supabase env +
`schema.sql` run); live public deploy (needs Vercel auth). Both degrade gracefully until then.

### Phase clock
- MVP F1–F4 built + chat/guardrails verified locally: **22:13**
- README + conformance audit done; deployed to Vercel (https://cadre-test.vercel.app).
- **Live deploy verified:** production env vars set; live `/api/chat` returns grounded answers.
- Supabase key fix (publishable + INSERT-only RLS + grant) → **leads verified live** (~22:5x).

---

## L-15 · 23:25 · Review round 2 (your spec observations) — all applied
**Decided by:** you (6 sharp observations + cuts); me applying. **Honest note:** your observations
were *thesis-level* (reuse economics, demonstrability) and sharper than my own code-hygiene review.

**Code (made the reuse thesis demonstrable):**
- **Second client profile** — lifted corpus/persona/brand/greeting/suggestions/CTA into
  `ClientProfile`, selected by `CLIENT_PROFILE` env var; added a fictional **Northwind Freight**.
  Verified live: Northwind answers freight Qs and **declines Cadre-only ones** with its own CTA.
  This turns **AC-16** from an assertion into a live demo. (Your #3.)
- **Session-level outcome logging** (`lib/log.ts`) — answered/escalated/error + session id, no PII.
  **Deflection rate is now measurable** from logs alone; reframed A-4/§12/§14/NFR-006 from
  "can't measure" to "measured, no consent needed." (Your #4.)
- System prompt made client-agnostic; `crypto.randomUUID()` session ids.

**Docs:**
- Concept §8.1: **reuse-economics table** (build vs. reuse hours, cross-block attachment) +
  **Forked/Configurable/Productized** ladder; Notifier re-rated Configurable (consistency). (#1, #2, #6.)
- Spec: added **§4.4** (closes the 4.3→4.5 gap) + TC-030; **S-04a/S-06a pushback variants** — and
  **verified live** the bot holds the line on an insisted portal-URL and a ballpark-price. (#5, #6.)
- Cut §7 (folded into §6.5) and trimmed §13.2 stakeholders. (Your cuts.)
- Swept the stale **embeddings→lexical** language across both docs (D-03, TC-003, ER diagram, §13).

**Verifications this round (live):** lead insert `ok:true`; Northwind swap; both pushback declines;
build green; lint clean.
**Not added:** automated tests (still ABSENT in the audit) — offered, awaiting your call.
**Deploy:** code redeployed to prod (Cadre default); docs don't affect runtime.
**Your gate:** you're holding the zip for a human review — nothing is zipped/submitted.

---

## L-14 · Supabase key model: publishable key + INSERT-only RLS (least privilege)
**Decided by:** you flagged that `service_role` naming is deprecated and you provided a **publishable
key** (`sb_publishable_...`); I chose the design around it.
**Design:** the app uses the **publishable key server-side**, and `schema.sql` enables RLS with an
**INSERT-only policy** for the anon role. Net effect: the app can *submit* leads but can never read,
update, or delete them — a leaked key can't exfiltrate leads. This is a stronger posture than
shipping a service-role/secret key, and it uses the key you already provided.
**Changes:** env var renamed `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_KEY` (code keeps a fallback);
`schema.sql` gains the insert policy; README/CLAUDE/.env.example updated.
**Known limit:** a public-form insert policy means direct inserts are possible if the key were
exposed; app-layer rate limiting mitigates, and the key stays server-side. Acceptable for MVP.
**Reversible:** trivially — swap to a `sb_secret_...` key + drop the policy if preferred.
