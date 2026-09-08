You are going to help me run a take-home / technical test using a spec-driven development
methodology. **Do not start any work until you have interviewed me.** The whole point of this
methodology is that guessing is what makes work go wrong, so the first thing you do is find out
what you are actually dealing with.

**Where this runs:** Claude Code, in a terminal, with the take-home's own folder open. Not a chat
window. The methodology's skills read the codebase, write documents next to it, and the audit
creates a git worktree at a pinned commit — none of which works without a real repository and a
real shell. If the folder is not a git repository yet, `git init` it before anything else: the
audit needs commits to pin against.

## Step 0 — Install the methodology

Tell me to type these two lines myself (they are client slash-commands, you cannot run them):

```
/plugin marketplace add t-gency/spec-driven-development
/plugin install engineering-methodology@tgency-method
```

Then verify it loaded by asking me to describe a feature and seeing whether the authoring skill
picks it up — do not just assume. If the marketplace does not resolve, stop and tell me; do not
work around it by improvising the methodology from memory.

The reference lives at <https://t-gency.github.io/spec-driven-development/> and the quickstart at
<https://t-gency.github.io/spec-driven-development/quickstart.html>. Read the quickstart before
advising me on scope.

**One environment note:** the methodology's mechanical gates are `grep` / `sed` / `awk` / `comm`
pipelines. They do not run in PowerShell. If I am on Windows, tell me to use Git Bash or WSL for
those, and to prefix sorted comparisons with `LC_ALL=C`.

## Step 0.5 — Open the decision log, before anything else

**Create `decisions.md` in the working folder now, before you ask me a single question**, and
append to it as we go. Not at the end — as we go. A log written afterwards is a reconstruction,
and reconstructions are flattering.

This exists because the methodology has a gap: feature decisions (`D-*`) live inside a Concept
Note, so the decision about *whether to write a Concept Note at all* has nowhere to live. Every
choice we make before the first document exists — how much methodology this earns, what we cut,
what we deliberately did not build — is invisible unless something records it. This file is that
something.

Append an entry for **every decision, including the ones about process**, in this shape:

```markdown
## L-03 · 14:20 · Scope: Concept Note + Spec, no Implementation Plan
**Decided by:** me, on your recommendation
**Because:** 8-hour budget; the Plan's value is coordinating several branches and there is
one branch here. The scenario→test matrix moves into the Spec's acceptance criteria instead.
**Rejected:** all three documents (would spend a quarter of the budget on writing);
no documents at all (the role is product engineer — the goals/non-goals section is the point).
**Reversible:** easily, until implementation starts.
```

Rules for the log:

- **Timestamp every entry**, and record the clock at each phase change: interview done, Concept
  Note done, Spec done, implementation started, implementation working, audit run. Those
  timestamps are how we find out afterwards what this actually cost, and there is no way to
  recover them later.
- **Record what we decided *not* to do**, and why. That is the half people drop, and it is the
  half that shows judgement.
- **Record my assumptions the moment I make one**, especially the ones filling a gap in the
  brief. An assumption that never got written down is indistinguishable from an oversight.
- **Record where you disagreed with me** and what I chose anyway. Do not sand that down.
- These are *process* decisions and stay numbered separately from the Concept Note's `D-*`. If
  this file proves useful, it is worth proposing back to the methodology as a stage it does not
  currently have.

The first entry is written before the interview: what I asked for, and what you are about to do
about it.

## Step 1 — Interview me about the test

Ask these, a few at a time, and wait for my answers. Do not proceed on assumptions.

1. **Paste the brief.** Ask me for the take-home instructions verbatim, exactly as they sent
   them. Not my summary of them — the actual text.
2. **The company and the role.** Who is it for, what is the role, and what does the brief suggest
   they care about — product judgement, code quality, system design, speed, communication?
3. **Time budget and deadline.** How many hours do they say it should take, how many hours do I
   actually have, and when is it due?
4. **What gets handed in.** A repository? A document? A demo? A presentation? Is there a README
   they will read, or only code?
5. **Starting point.** Greenfield, or is there starter code / an existing repo / an API to build
   against?
6. **Stack.** Fixed by them, or my choice?
7. **Rubric.** Did they publish evaluation criteria? If yes, paste them.
8. **What is ambiguous.** Where does the brief leave something unsaid that I would otherwise just
   assume? List what you spot in the brief yourself, then ask me what else I noticed.

Question 8 is the one that matters most, and I will probably under-answer it. Push on it.

## Step 2 — Tell me honestly how much methodology this earns

**Do not run the full three-document pipeline by default.** The methodology's own guidance says
most work should not get it: the full set is 15,000 to 40,000 words per feature, and a team that
runs it on everything quietly stops running it on anything. A take-home is almost never the case
that earns all three.

**Build the scope against the brief, clause by clause, not from a template.** Walk the brief with
me and for each thing it asks for, say which document (if any) would carry it and why. Where the
brief is silent, say so. The output of this step is not "we will write a Spec" — it is a list of
what the Spec would have to contain to be worth writing, and my agreement that it is worth it.

Then write the whole thing to the log as one entry, including the alternatives you rejected.

Recommend a scope out loud, with your reasoning, and let me argue with it. A rough shape:

| Time budget | What is probably worth running |
|---|---|
| Under ~4 hours | No documents. A README that states goals, non-goals and every assumption I made |
| ~4 to 12 hours | A short Concept Note, then a tight Spec. Skip the Plan. Then implement, then audit |
| Multi-day, or "design a system" | All three, with the Plan sized to the branch arc |

Two things bias this upward for a **product engineer** role specifically, and you should weigh
them:

- The Concept Note's shape — problem, goals, **non-goals**, decisions with a reversibility flag,
  open questions with owners — is exactly the artifact that demonstrates product judgement. Most
  candidates hand in code and a paragraph.
- The conformance audit produces something almost nobody submits: a table where every requirement
  is traced to a file and a line, and the ones nothing satisfies are named rather than hidden.

But **the submission must not be a wall of text.** If the documents are long, the reviewer will
not read them. Plan for a tight Spec and a short covering README, and say so when you propose the
scope.

## Step 3 — Run whatever we agreed, in order

Use the plain-language prompts from the quickstart. Do not type skill names. In particular:

- **Concept Note:** research first, and **ask me whatever you cannot ground.** Never invent a
  requirement to fill a gap — mark it `[OPEN-Q-N]` and bring it to me.
- **Spec:** keep the focus on the WHAT, and enumerate the variants for every scenario — boundary,
  failure, concurrency — or say explicitly that a scenario has none and why.
- Every requirement must be **violable**. "The system must be fast" is not a requirement; "shall
  return results within 300 ms at p95 for datasets under 10,000 records" is. Flag any line of mine
  that fails that test.
- **Implement:** commit locally as you go. Do not push and do not open a PR unless I ask.

## Step 4 — The audit, and how to present it

When the code is working, run the conformance audit against the Spec: every obligation gets one
verdict, each citing a file and a line, plus the backwards sweep for behaviour in the code that no
requirement sanctioned.

Then help me decide **what of this to actually submit**. My instinct will be to include
everything; talk me out of it. Likely the right submission is:

- The code.
- A README with the problem, my goals and non-goals, my assumptions, and what I would do next.
- The Spec, if it is tight.
- The audit table, **including the gaps** — the `ABSENT` and `PARTIAL` rows are not an
  embarrassment, they are evidence that I know what is not done and did not pretend otherwise.

That last point is worth arguing for explicitly if I get nervous about it.

## How to work with me throughout

- **Ask before assuming.** Every time.
- **Tell me when something is not worth doing.** If a step is overkill for this test, say so
  plainly rather than performing the process.
- **Watch the clock.** Remind me of the time budget when we are drifting, and tell me when to stop
  writing and start building.
- **Be honest about what you did not check.** "I could not verify this" is never to be reported as
  "this is not there."

## When we finish

Produce two things beyond the submission itself:

1. **A closing entry in `decisions.md`** with the elapsed time per phase, taken from the
   timestamps — not estimated afterwards.
2. **A short honest note** on what the methodology cost here versus what it bought: which
   decisions it forced into the open that would otherwise have stayed implicit, and which parts
   were overhead for a test this size. Say the second part plainly; it is more useful than praise.

Start by creating `decisions.md`, then ask me for the brief.
