# Copy Strategy — Flutter Audit Service

Status: research + recommendation. Companion file: `/.copy/DRAFT-COPY.md`.

## 1. Audience & Awareness Level (Schwartz)

Primary audience: founders / CTOs / heads of engineering whose Flutter app already exists and is hurting.

Schwartz mapping:
- **Problem Aware** (dominant): "Our app is slow / crashy / scary to change." Knows the pain, doesn't know audits exist as a productized service.
- **Solution Aware** (secondary): "We've heard about code audits / performance reviews." Comparing options.
- **Product Aware** is rare — almost nobody knows *this specific* engineer's service exists.
- Almost no one is **Most Aware** or **Unaware**.

Implication: copy must lead with the *problem in their language*, not with "code audit" as a category. Headline = problem-mirror, sub-headline = solution category, body = guide credibility.

## 2. Frameworks Applied

### 2.1 StoryBrand (SB7)
- **Hero**: the CTO with a Flutter app that's slipping. Not us.
- **Has a problem**:
  - External: jank, crashes, long build times, scary release weeks.
  - Internal: dread of merging PRs, fear of hiring not solving it, embarrassed by app reviews.
  - Philosophical: "Good software shouldn't feel like this. I shouldn't be afraid of my own codebase."
- **Meets a guide**: senior Flutter engineer (empathy + authority — both required).
- **Who gives them a plan**: 3 simple steps.
- **Calls them to action**: primary (commit) + transitional (browse).
- **Avoids failure**: an app that keeps slipping, a team that keeps leaving, a release cycle that gets slower.
- **Ends in success**: a fast app, a calm team, a roadmap you trust.

### 2.2 PAS (Problem → Agitate → Solution)
Use in the long-form "Problem" section. Name pain in *their* words first, then quantify cost of inaction (releases delayed, hires churning, App Store rating dropping), then offer the audit as the smallest possible next step.

### 2.3 AIDA
Hero block = Attention + Interest. Outcomes block = Desire. CTA = Action. Standard but still works above the fold.

### 2.4 Belief-Capability-Desire (Forte / direct-response)
- Belief shift: "Our app's problems can be diagnosed in days, not months."
- Capability shift: "A senior outside set of eyes will see what we can't."
- Desire amplification: "Imagine shipping again without holding your breath."

### 2.5 Joanna Wiebe — Voice of Customer
Mining technique used: pain-phrase Google operators (`site:news.ycombinator.com "Flutter" "jank"`, `site:github.com/flutter/flutter/issues "first run"`, dev.to + Medium pain articles). Sort quotes into Before-state and Dream-state (see §3).

## 3. Voice of Customer — 15 Verbatim-or-Near-Verbatim Pain Quotes

Sourced from HN, GitHub flutter/flutter issues, Medium engineering postmortems, dev.to migrations. Lightly de-duplicated. Use these for headline and body language directly.

**Before-state (pain) quotes:**

1. "The very first start after installing is extremely janky and laggy."
2. "Notice most of the frames after the splash screen are dropped. This has the most jank."
3. "You can really see the jank when the loader animation stops and the next screen starts to slide up, but it just kind of appears with no frames in between."
4. "This is not acceptable to ship the app in its current state and I am disappointed I got this far with Flutter before I noticed this kind of issue."
5. "It has an extremely detrimental effect on the perceived quality of your app when it's this laggy the very first time you open it."
6. "Most screens were monoliths — all-in-one files with UI and logic tangled together."
7. "You'd have prop drilling across three levels just to pass something that one widget needed."
8. "Tracking the flow of data meant hopping between directories, mentally stitching together a picture of how things connected."
9. "I had to trace a bug and found myself drilling through 5 directories just to understand the flow."
10. "Adding one feature means touching 8 files in 6 different folders."
11. "You couldn't test anything. If Dio failed, the whole thing failed, and you had to dig to figure out why."
12. "Mixing Redux, Bloc, and Riverpod in the same codebase creates confusion and makes debugging nearly impossible."
13. "Onboarding time for new developers takes three weeks just to understand the state flow."
14. "Around 50% of iOS users and 30% of Android users experienced crashes."
15. "A senior dev aces the coding test, but cannot explain a state-management decision to a non-technical PM."

**Dream-state phrases (what they actually want):**
- "Smooth 120fps animations on day one, not day three."
- "A new hire shipping a feature in week one."
- "I can read the diff and know what it does."
- "Release week without a war room."
- "App Store reviews stop mentioning the word 'laggy'."

These map directly into the Outcomes block of the page.

## 4. Pricing Anxiety — Trust Language Research

Source synthesis (flat-rate pricing studies + consulting fee guides):

- Flat-rate pricing is preferred *and* clients will pay a small premium for the certainty.
- The phrase pattern that builds trust: **state the cap, state the why, state what happens if you're wrong.** ("$X. If it takes me 50% longer than I estimated, that's on me, not you. I underwrote the estimate; you bought the outcome.")
- Avoid the word "guarantee" alone — guarantee fatigue is real in 2026. Use it paired with mechanism ("guarantee with a *because*").
- Avoid "we promise" — implies hedging. Prefer first-person commitment from the engineer.
- Avoid hourly anywhere in the copy. It re-frames audit-as-effort instead of audit-as-deliverable.

Recommended framing (used in §7.1 of `DRAFT-COPY.md`):
- "Fixed price. If the audit takes me longer than I planned, you don't pay a cent more. I'd rather eat the extra hours than send a surprise invoice."

## 5. Lead Magnet Evaluation

Candidates scored on (a) signal of qualified lead, (b) deliverability cost to engineer, (c) perceived prospect value, (d) friction.

| Magnet | Qualified-lead signal | Engineer cost | Prospect value | Friction | Verdict |
|---|---|---|---|---|---|
| Free 15-min Smoke Test mini-audit (sync) | High | High (live time) | High | Medium (calendar) | Strong, but capped throughput |
| **Free 48h async mini-audit ("Send me your repo + one symptom, I send back 1 page")** | **Very high** | **Medium** | **Very high** | **Low (form)** | **WINNER** |
| Flutter Performance Checklist PDF | Low (anyone grabs PDFs) | Low | Medium | Low | Skip — ebook graveyard |
| "10 mistakes killing your Flutter app" video | Medium | Medium | Medium | Medium | Skip — replaceable by Medium content |
| Frame-budget calculator (interactive) | Medium (devs not buyers) | High (build cost) | Medium | Low | Future, not v1 |
| Pre-audit questionnaire template | Low | Low | Low | Low | Skip — not value-shaped |
| Reproducible jank scenarios repo | Low (devs not buyers) | Medium | High to ICs | Low | Use as authority asset, not lead magnet |
| Crash → root cause cheat sheet | Low | Medium | Medium | Low | Skip |

**Recommendation: the 48-hour async mini-audit.** Why:
1. It *is* a real, scarce service — not a PDF — so the form-fill itself is a high-intent signal. Anyone willing to send a repo and describe a symptom is at least Solution-Aware.
2. It pre-qualifies. Repos that aren't real Flutter projects, or "audit my idea, no code yet" tire-kickers, get filtered.
3. The deliverable (one page: top 3 things I'd fix first) demos competence without giving away the full audit. It's the dev-services equivalent of "first chapter free."
4. Async = no calendar friction. Studies show calendar-based CTAs lose ~30–50% of clicks at the booking screen.
5. Throughput-capped naturally; can be paused by removing the form, no awkward "currently full" page.

Risk: it can become a free-work treadmill. Mitigate with (a) a hard 48h SLA, (b) a single-symptom intake field ("describe the *one* thing that's hurting most"), and (c) explicit "if I can't help in 48h, I'll tell you in 24."

## 6. Trust Without Client Logos

The engineer has: Flutter + debugging + perf + custom animations + shaders + vector_math_64 expertise. Likely has some combination of OSS commits, public talks, blog posts, sample apps. Strategies:

1. **Personal-credibility hero footer.** Photo, name, "I've been building Flutter apps since [year]. Here's what I focus on." Empathy + authority in 3 lines.
2. **Show the work, not the clients.** Embed code samples, before/after frame timelines, links to OSS contributions. Numbers without names: "Cut p95 frame time on a fintech home screen from 38ms to 9ms in 6 days."
3. **Public engineering writing.** Link to articles. The act of writing publicly is itself a trust signal — it's what a confident senior engineer does.
4. **"Ask me anything" surface.** A simple text input near the bottom: "Have a Flutter question? Email me — I answer every one." Costs little, signals enormously.
5. **No fake logos, no inflated numbers.** Specificity > volume. "1 audit per week. That's it." reads more credible than "100+ apps audited."
6. **Founder-style "I" voice.** Solo consultants who speak in "we" sound like they're hiding being solo. Lean into "I."

## 7. CTA Strategy

Findings:
- "Schedule a Demo" / "Get in Touch" are weak in 2026. Specific outcomes convert 2–3x.
- Commitment ladder: small yes first, big yes later.
- Microcopy under button reduces friction 10–20%.
- One-field forms outconvert multi-field by ~120%.

**Recommended primary CTA: "Send me your repo →"**
Why: it's specific, it's surprising in a market full of "Book a call," and it tells the prospect exactly what we want. Founders who flinch at sending a repo are not buyers; founders who don't flinch are pre-qualified.

**Secondary (transitional) CTA: "See what a 1-page audit looks like"** — opens a sample anonymized deliverable. Costs the prospect nothing, demos value, lowers fear.

**Microcopy under primary CTA**: "Or paste a public GitHub URL. NDA on request. I read every submission myself."

## 8. Headline Frameworks Applied

Applied formulas:
- "X without Y" — reward minus pain.
- "How [audience] [outcome] without [pain]" — implicit case study.
- "Stop X and start Y" — before/after.
- "The [outcome] you thought required [painful thing]" — reframing.
- Pain-mirror direct quote ("Your Flutter app feels…").

12 candidate headlines are ranked in §1 of `DRAFT-COPY.md`. Top 3 are explained there with rationale.

## 9. Biggest Risks in This Copy Strategy

1. **The "send me your repo" CTA could spike rejection.** Some companies will not send a repo to a stranger, even with NDA. Mitigation: the secondary CTA must give them a no-risk path (view a sample audit, or paste a public repo URL, or just describe the symptom in text).
2. **Solo consultant claiming a flat-fee no-overage guarantee is bold.** If overruns happen often, this will hurt the engineer financially. Mitigation: scope the audit tightly (1 codebase, 1 platform target, 1 main symptom focus).
3. **Pain-led headline may scare off "we just want a second opinion" buyers** who don't think they have a real problem yet. Mitigation: the sub-headline softens to "even if you're just curious what an outside set of senior eyes would catch."

## 10. Sources

- StoryBrand framework — https://www.leadgen-economy.com/blog/storybrand-framework-b2b-lead-gen-ecommerce-funnels/
- Eugene Schwartz 5 Awareness Levels — https://www.leadgen-economy.com/blog/five-stages-awareness-lead-generation/
- Joanna Wiebe VoC formula — https://copyhackers.com/a-super-speedy-formula-to-find-voc-fast/
- PAS framework for B2B services — https://www.saasfunnellab.com/essay/pas-copywriting-framework/
- Flutter shader jank verbatim quotes — https://github.com/flutter/flutter/issues/61450
- Flutter spaghetti code verbatim quotes — https://dev.to/lordhacker756/from-spaghetti-to-structure-why-i-migrated-my-production-flutter-app-to-clean-architecture-h20
- Flutter state explosion — https://medium.com/@flutter-app/flutter-state-explosion-when-flutter-apps-become-unmaintainable-6575856c8b72
- Stuart Engineering Flutter production challenges — https://medium.com/stuart-engineering/weve-deployed-flutter-into-production-here-are-the-challenges-we-faced-7b89cfc414af
- Flutter crashes reference — https://blog.flutter.wtf/flutter-app-crashes/
- Why "Schedule a Demo" is dead — https://hounder.co/the-dog-bowl/call-to-action-guide
- "Book a Discovery Call" critique — https://www.linkedin.com/pulse/why-you-shouldnt-use-cta-book-discovery-call-elizabeth-joss-bethlehem
- Lead magnets 2025 — https://www.funnelytics.io/blog/7-lead-magnet-ideas-to-10x-conversion-rates-in-2025
- Lead magnet conversion stats — https://focus-digital.co/lead-magnet-conversion-rate-by-industry/
- Micro-commitment / form friction — https://growthwooh.com/the-micro-commitment-method-designing-high-converting-sign-up-flows/
- Headline formulas catalog — https://techhelp.ca/headline-formulas/
- Copyhackers headline formulas — https://copyhackers.com/2015/10/copywriting-formula/
- Flat-rate pricing trust — https://www.servicefusion.com/blog/what-is-flat-rate-pricing-and-how-does-it-work
- Code audit pricing landscape — https://devcom.com/tech-blog/code-audit-services-cost/
