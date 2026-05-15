# P07 — Copy Challenge: Hostile CTO Read of DRAFT-COPY.md

**Reviewer posture:** former Apostrophe / Wynter / Copyhackers researcher, currently a CTO who has been pitched 200 consultancies in 18 months. Goal: find every line that would make a buying-decision CTO close the tab.

**Overall verdict: BLOOD.** Six lines need rewriting before this ships. The voice is mostly real, but the AI-slop signal is loud (29 em-dashes in ~1,288 body words = ~22.5/1k, ~3x the human baseline of ~7/1k), the hero promise mis-filters part of the qualified audience, the primary CTA blocks regulated industries on contact, and the pricing reassurance is two sentences of preacher cadence pretending to be plain talk. None of it is fatal. All of it is fixable.

---

## Per-section severity rank

| Section | Severity | Why |
|---|---|---|
| §1 Hero headline | **MAJOR** | Filters out the "messy not slow" CTO who is half the buying pool |
| §2 Hero sub-headline | **MAJOR** | 50 words is roughly 2x what a hero sub-head should carry; "I live in DevTools/Impeller" reads as a flex; the eat-the-difference clause leaks into pricing's only differentiator |
| §3 Primary CTA | **MAJOR** | "Send me your repo" is a developer CTA in a buyer's viewport; legal-blocked in fintech/healthtech without an explicit alternative |
| §4 Pricing reassurance | **MAJOR** | "I'd rather eat the extra hours" reads as a scoping admission, not a generosity flag; cadence is preacherly |
| §5 Problem section | **SCRATCH** | "You're not imagining it" risks dismissing the half-aware buyer; the close-to-solution paragraph fires before agitation has earned the move |
| §6 About the engineer | **SCRATCH** | "I read frame timelines for fun" is humblebrag-shaped; works for engineer-buyer, hurts for founder-buyer |
| §7 AI-slop | **BLOOD** | Em-dash density is 3x human baseline; cluster of "—" within the hero sub-head and the pricing block is the single most detectable AI tell on the page |
| §8 FAQ #5 | **SCRATCH** | "It's happened twice. Both clients hired me back." is unverifiable false-specificity and counterproductive |

---

## 1) Hero Headline — "Your Flutter app shouldn't feel this slow."

**The attack.** The implicit blame is *meant* to land on the codebase. It mostly does — because "feel this slow" externalizes to the artifact, not the team. But it also commits two filtering errors.

**Error A (the wrongly-filtered buyer).** Test it against a CTO whose app *isn't* particularly slow but is messy: state in three libraries, 8-files-per-feature, three weeks to onboard a senior. That CTO scans the hero, internally answers "ours isn't slow — it's just rotting," and closes the tab. Performance is *one* axis. The draft's own FAQ #3 ("Our app isn't slow. It's just messy.") admits this audience exists. The hero filters them out at the door, then the FAQ tries to recover them after most have already bounced.

**Error B (latent reader-as-bad-engineer).** A non-trivial slice of CTOs *did* personally write the slow code. "Shouldn't feel this slow" is heard by them as "you let it feel this slow." Some will engage out of guilt. Some will leave. The voice-of-customer research (`06-copy-strategy.md` §3) shows buyers already speak this self-blame language — the line tips the balance from mirror to accusation depending on personality.

**Verdict: BLOOD.** The line is *good*, just narrow.

**Three sharper alternates:**

1. **Your Flutter app is fixable. In a week. Without a rewrite.** — Pivots from pain to the unique structural promise. Captures slow-AND-messy. Hits Solution-Aware buyers without losing Problem-Aware ones. Three short clauses match the F-pattern fixation budget.
2. **A senior outside read of your Flutter codebase. Five days. Fixed price.** — Buyer's-language hero. Sells the deliverable, not the dread. Filters in CTOs who already know they need help and are comparing options (the higher-intent half of the funnel).
3. **Your Flutter app feels slow, or your team does. Either way, five days.** — The riskier one. Names both performance pain *and* velocity pain in the same breath, then collapses both to the same offer. Closest to "mirror both buyers." Use only if A/B testing shows the buyer cohort is bimodal.

**Ship recommendation:** #1.

---

## 2) Hero Sub-Headline — the 50-word recommended option

**The attack.**

**Length.** NN/g's text-scanning research (F-pattern, layer-cake pattern, "First 2 Words" 2025) places the practical hero-position scan budget at roughly **15–25 words** for the sub-head — readers fixate on the first words of the first lines and trail off fast. The recommended sub-head is 50 words and contains *four* sentences. The buyer reads "5-day audit of your Flutter app by a senior engineer who lives in DevTools…" and the back half — the deliverables, the fixed price, the eat-the-difference promise — never lands in the hero. It lands in scroll, where it's been smeared.

**"I live in DevTools, Impeller, and the rendering pipeline."** Authentic-adjacent, but flex-shaped. "Impeller" is the tell — it's the in-group word that signals "I know the new renderer." Mixed audience: a senior Flutter engineer reads it as credibility, a non-engineer founder reads it as jargon. The structure ("I live in X, Y, and Z") is a known rhetorical cliché — same shape as "I bleed code" / "I dream in Figma." On a page that's otherwise plain-spoken, it spikes as performance.

**"If it takes longer, I eat the difference."** Worse: it pre-empts §7 Pricing Reassurance, which has *almost the same line* with more weight. Putting it in the hero means the buyer reads it twice. The second reading (in §7) is now redundant, and §7's whole job is to be the place where pricing fear gets killed. You've spent your strongest pricing payload above the fold, where it's furniture, not relief.

**Verdict: BLOOD.** Cut to 22 words. Strip Impeller. Move the pricing promise to §7 where it does work.

**Find/replace:**

- **Find:** `A 5-day audit of your Flutter app by a senior engineer who lives in DevTools, Impeller, and the rendering pipeline. You get a prioritized fix list, a frame-by-frame perf report, and a 60-minute walkthrough call. Fixed price. If it takes longer, I eat the difference.`
- **Replace:** `Five days. One senior engineer. A ranked fix list, a frame timeline, and a walkthrough. Fixed price, quoted after I see the repo.`

22 words. Three short sentences. F-pattern friendly. Pricing reassurance is *anchored* ("fixed price, quoted after I see the repo") but the full guarantee waits for §7 where it converts.

---

## 3) Primary CTA — "Send me your repo →"

**The attack.**

**Regulated industries.** Fintech and healthtech CTOs are *legally* prevented from sending a private repo to an unvetted third party without procurement, DPA, and often SOC 2 review. They see "Send me your repo" and bounce — not because the offer is bad, but because the first action is illegal for them. Baymard's findings on form-field abandonment apply by analogy: when the first asked-for thing crosses a legal or comfort line, the abandon rate spikes 30–50%. The microcopy "NDA on request" is buried *below* the button, which means a regulated buyer never sees it before they've already left.

**Buyer vs. developer CTA.** "Send me your repo" is *engineer-to-engineer* language. The CTO buyer brain, scanning above the fold, asks: *what does this person want from me, and what do I get?* A confident developer reads it as a confident signal. A non-technical founder buying for their CTO reads it as opaque — *I don't have a repo to send, my CTO has it; what am I supposed to do?* You lose the founder-buyer who would have started by introducing themselves.

**Surprise without onboarding.** Surprise CTAs work when the page has *first* established what they get. With the current hero, the buyer goes from "Flutter app shouldn't feel this slow" straight to "Send me your repo" — there's no payoff yet. Surprise becomes confusion.

**Verdict: MAJOR.** Don't kill the CTA — it's a real differentiator and the commitment-ladder hook. Add a parallel low-commitment door and explicit "what if you can't share code" language *on the button row*, not in microcopy below it.

**Commitment ladder fix:**

- **Primary (highest commitment, highest signal):** `Send me your repo →` — for buyers who have a repo and the authority to share it.
- **Secondary (medium commitment, addresses regulated/non-technical):** `Describe your app instead →` — opens the intake form with the symptom field, repo optional. This is the door for fintech, healthtech, and founder-buyers who haven't pinged their CTO yet.
- **Tertiary (lowest commitment, browse intent):** `See a sample audit (anonymized PDF) →` — already in the draft as secondary; demote to tertiary.

**Microcopy under the primary button (replace current):**

- **Find:** `Or paste a public GitHub URL. NDA on request. I read every submission myself — usually within 48 hours.`
- **Replace:** `Public URL, private invite, or screen-share only — half my audits don't touch a repo I own. NDA before code changes hands. I reply within 24 hours, myself.`

This kills the "I can't legally do that" bounce by making the alternative visible *before* the click.

---

## 4) Pricing Reassurance — "If the audit takes me longer than I planned…"

**The attack.**

**"I'd rather eat the extra hours than send a surprise invoice."** This is meant to read as generosity. To a senior buyer who has scoped projects, it reads as a *competence flag*: an engineer who routinely under-estimates would say exactly this. The implicit confession is *I miss my own scope often enough that you should be reassured I won't bill you for it*. The reassurance is the admission. A buyer who has been burned will not parse "generosity" first — they'll parse "this person doesn't know how long their own audits take."

**"The estimate is my risk; the outcome is what you bought."** Preacher cadence. Two parallel six-word clauses with a semicolon. The structure is the same as a Stripe Press headline or a 37signals manifesto line — which is the problem. It *sounds* rehearsed because it *is* rehearsed. A line that perfect on a personal-engineer page reads as a writer's hand, not the engineer's. It breaks the rest of the page's voice. (The draft itself uses long, comma-heavy, plain sentences elsewhere; the parallel-construction line stands out as having been polished by a different person.)

**What high-converting service pages actually do.** 37signals and Basecamp's guarantee language is closer to plain-spoken refund mechanics ("cancel anytime, no questions") with no rhetorical flourish. The pattern that converts on senior-buyer pages is: **state the cap → state the mechanism → state the exit.** Not three clauses of moral framing.

**Verdict: BLOOD.** Rewrite.

**Find/replace:**

- **Find:** `If the audit takes me longer than I planned — and sometimes it does — you don't pay a cent more. I'd rather eat the extra hours than send a surprise invoice. The estimate is my risk. The outcome is what you bought.`
- **Replace:** `The price is fixed when I quote it. If it takes me longer, you pay what we agreed. If on Day 2 I find the audit can't deliver what I scoped, I tell you, refund the unspent half, and send what I have.`

The new line *describes the mechanism* (cap, exit, refund) instead of moralizing about generosity. It also pre-empts the buyer's actual fear — not "will he charge me more," but "what if he gets in there and it's worse than he thought." No semicolons. No parallel construction. No "I'd rather." No competence flag.

---

## 5) Problem Section — three paragraphs

**The attack.**

**"Adding one feature touches eight files in six folders."** Specific enough to mirror, but the buyer whose app is "only" 4 files in 3 folders thinks *this isn't me*. The fix is to render it as a *range* or as a *type*, not a number — or to anchor it in the symptom-pattern rather than the count. Voice-of-customer source #10 ("Adding one feature means touching 8 files in 6 different folders") is the temptation; but VoC quotes are *raw material*, not finished copy. Keep the shape, soften the precision.

**"You're not imagining it." opener.** Risks dismissing the buyer who *hadn't yet diagnosed it as a real problem.* The Problem-Aware buyer (dominant audience per §1 of copy strategy) will nod. The Solution-Aware buyer (who is comparing audits) reads it as motivational-poster language. Acceptable, but soft.

**"You don't need a rewrite. You need someone to read it."** This is the strongest line on the page. It is *also* the line that fires the solution before agitation has done full work. PAS works because Agitate makes the buyer *feel* the cost; jumping to Solution at paragraph 3 truncates Agitate to one paragraph. A serious-buying CTO who hasn't yet *felt* the cost (delayed releases, churning hires, dropping App Store rating) will read "you don't need a rewrite" and not yet care. The Agitate paragraph is doing double-duty as agitate-and-pivot, which is one job too many.

**Verdict: SCRATCH.** Two surgical edits, not a rewrite.

**Find/replace #1:**

- **Find:** `Adding one feature touches eight files in six folders.`
- **Replace:** `Adding one field touches half a dozen files across folders nobody can map.`

(Same shape. Less false-precision. Catches the messy-but-not-8-files buyer without losing the mirror.)

**Find/replace #2:** Insert one short paragraph between the second and third paragraphs of §4, before "You don't need a rewrite." The new paragraph carries the cost-of-inaction beat that's currently missing:

> *Each one of these is a tax. Three weeks per hire. A two-week release that should be three days. A roadmap that keeps slipping by one sprint, every sprint. After a year, you've paid for the rewrite anyway — you just don't have it.*

That earns the "you don't need a rewrite" pivot. Without it, the pivot is asserted, not argued.

---

## 6) About the Engineer Block

**The attack.**

**"I work in vector_math_64 the way most engineers work in `print()`."** This is the line the draft is proudest of. It's also a humblebrag trope — *"I do hard thing X the way you do easy thing Y."* Same rhetorical shape as "I think in TypeScript" / "I dream in Lisp." For an engineer-buyer, it lands as a credible flex. For a non-engineer founder, it lands as *jargon being weaponized*. The split audience is the problem: the founder thinks *I don't know what vector_math_64 is and I am supposed to feel small for not knowing.* That's the opposite of trust-building.

**"I read frame timelines for fun."** Same problem, less severe. Works as a personality detail in a longer bio; on a sales page it signals *this person is going to spend two hours nerding out before answering my question.* Founders pattern-match this to "expensive engineer who can't communicate."

**Verdict: SCRATCH.** Keep one flex, kill one, add a translator sentence.

**Find/replace:**

- **Find:** `I work in vector_math_64 the way most engineers work in `print()`. I write shaders when the off-the-shelf paint won't render fast enough. I read frame timelines for fun.`
- **Replace:** `When the standard widget won't render fast enough, I write the shader. When the framework's animation system isn't enough, I work in `vector_math_64`. The deep parts of Flutter — Impeller, the rendering pipeline, the gesture system — are the parts I'm hired for.`

This keeps the credibility signal (shaders, vector_math, Impeller all still named) but reframes from "I do hard things for fun" to "I get hired *for* the hard things." Confidence without humblebrag. The founder-buyer reads it as "this is the person you call when the easy fix didn't work" — which is the exact buying moment.

---

## 7) AI-Slop Detection

**The numbers.** 29 em-dashes in ~1,288 body words = **22.5 em-dashes per 1,000 words.** Human baseline (per Plagiarism Today 2025 / TechRound) is roughly 5–9 per 1,000. **This page is ~3x the human density.** The clusters are worst in:

- Hero headline candidates section (intentional, marker copy — fine)
- Hero sub-head #1 ("…rendering pipeline. You get a prioritized fix list, a frame-by-frame perf report, and a 60-minute walkthrough call. Fixed price. If it takes longer, I eat the difference.") — three em-dashes adjacent in §1 and §2 reads as AI cadence
- Pricing reassurance §7 — three em-dashes in two sentences. Cluster.
- §10 FAQ — em-dashes used as faux-conversational breath marks, not as actual interruption.

**"Not X, Y" constructions.** Zero found in body. Good. The only "not just" is *absent* — the page resists this trap. This is one thing the draft does well.

**"It's not just X, it's Y."** Zero. Good.

**Triplet structure abuse.** Several. "Notes, diagrams, naming conventions" / "fix list, perf report, two-page brief, roadmap notes" / "Day 1 is reading. Days 2–3 are profiling. Day 4 is the fix list. Day 5 is the brief." The 4-step process triplet is fine; the bullet triplets read as templated. Acceptable, but watch the cumulative count.

**Throat-clearing.** None. Good.

**Significance-inflated vocabulary** ("transformative," "seamless," "leverage," "unlock"). None. Excellent.

**Verdict: BLOOD on em-dash density, otherwise CLEAN.** The slop signal is single-source: em-dashes. Reduce em-dashes by ~60% (target 9–11 total) and the AI-slop signal collapses to zero. Replace with periods, commas, or parentheses depending on the rhetorical work the dash is doing.

**Specific em-dashes to kill (top 8 worst clusters):**

1. Sub-head #1: "…rendering pipeline." → period (kill the dash that follows DevTools/Impeller list)
2. Sub-head #2: "I spend a week inside your codebase so your team can spend the next quarter shipping." → already fine, but the parent context is em-dash heavy
3. §4 paragraph 3: "Hiring another senior Flutter engineer takes four months and a 30% premium and still doesn't tell you which 50 lines are dragging the whole app down." → kill em-dash before "and still"
4. §4 paragraph 3: "walking the codebase the way an auditor walks a balance sheet — quietly, methodically, looking for the three things that, if fixed, change the next quarter." → replace em-dash with colon
5. §5 bullet 2: "with the bottleneck named (rebuild storm, shader compile, expensive paint, jank from main-thread work — whichever it actually is)." → kill the dash inside parens; redundant
6. §7 pricing block: three em-dashes → see §4 of this attack file for the rewrite
7. §9 About: "from scrolling that drops frames on flagship phones to custom animations that have to look correct on a Pixel 3a." → already fine; kill the surrounding dashes
8. FAQ throughout: the dash-as-breath pattern repeats; reduce to ~2 across all six Q&A

---

## 8) FAQ #5 — "It's happened twice. Both clients hired me back."

**The attack.** Without a name, a logo, or a redacted case study on the page, "It's happened twice. Both clients hired me back." is the exact kind of false-specificity that triggers a senior buyer's bullshit detector. The buyer thinks: *Two? Who? Where? If you can't name them, why are you telling me a number?* The line is trying to do two jobs at once: (a) establish that you handle the no-fit case honorably, and (b) reassure that you're trustworthy enough to be re-hired. Job (a) is principle and works without evidence. Job (b) is testimony and *fails* without evidence. Mixing them in two sentences makes the principle look like a brag and the brag look unprovable.

**Verdict: SCRATCH.** Drop the testimony, keep the principle.

**Find/replace:**

- **Find:** `I'd rather end an engagement honestly than overrun an audit that was scoped wrong. It's happened twice. Both clients hired me back.`
- **Replace:** `I'd rather end an engagement honestly than overrun an audit that was scoped wrong. If you want a case where this happened, ask on the intake call — I'll walk you through it with the client's permission.`

This converts unverifiable specificity into a verifiable offer. A buyer who actually cares about the no-fit edge case will ask. A buyer who doesn't won't notice. Either way, no bullshit-detector trip.

---

## Single sharpest insight (one line)

The page's biggest weakness isn't any single line — it's that the *strongest pricing reassurance* and the *strongest hero promise* are stacked into the same 50-word sub-head, so the most powerful thing this engineer has to say ("if I'm wrong about scope, that's my problem, not yours") gets read once at the top as marketing and again at §7 as redundant, when it should hit exactly once, hard, at the moment the buyer is calculating risk. **Move the eat-the-difference clause down. Let the hero promise the deliverable. Let §7 close the fear.** That single relocation does more for conversion than rewriting any single line.

---

## Ship-ready alternates (pick one of each)

**Alternate hero headline (the one I would actually ship):**

> **Your Flutter app is fixable. In a week. Without a rewrite.**

**Alternate reassurance line (the one I would actually ship):**

> **The price is fixed when I quote it. If it takes me longer, you pay what we agreed. If by Day 2 I find the audit can't deliver what I scoped, I tell you, refund the unspent half, and send what I have.**

These two changes alone — plus cutting the em-dash density to human baseline — move the page from "competent draft that reads as AI-assisted" to "shippable copy that reads as a senior engineer who knows their offer."
