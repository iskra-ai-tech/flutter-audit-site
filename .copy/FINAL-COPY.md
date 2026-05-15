# Final Site Copy — post-challenger revisions

Source of truth for every visible string on the page. Edits flow from here → `src/index.html`. All revisions backed by `.design/P07-copy-challenge.md` and `.design/P09-ia-challenge.md`.

Voice: first-person, senior engineer, calm, specific. No em-dash spam. No "and that's where we come in." No "in today's fast-paced world."

---

## Nav
- Brand: `nikita.audit`
- Links: `Problem`, `Deliverables`, `Process`, `Pricing`, `FAQ`, `About`
- Nav CTA: `Book the audit`

## Hero

**Eyebrow (mono label)**: `2026 · Senior Flutter engineer · One audit at a time`

**Byline (micro-portrait + line, anchors authority above the fold)**:
*By Nikita Kalaganov — senior Flutter engineer. The page below is the offer.*

**H1**: *Your Flutter app is fixable. In a week. Without a rewrite.*

**H2 / sub-headline (22 words)**: *Five days. One senior engineer. A ranked fix list, a frame timeline, and a walkthrough. Fixed price, quoted after I see the repo.*

**Primary CTA**: `Book the audit →`
**Secondary CTA**: `See a sample one-page audit (anonymized)`

**Trust cue (under buttons, mono small)**: `Twenty-three audits shipped · NDA on request · 24-hour first reply`

## Section 2 — Problem (eyebrow: "01 · Symptoms")

**Headline**: *Three sentences you have already said this quarter.*

Cards:

1. **The app got slower and nobody knows when.**
   *The first run after install has a frame storm. The home tab scrolls like it is underwater on mid-tier Android. A reviewer wrote "feels laggy" last month and you closed the tab. Your team noticed. You noticed. No one has said it out loud in standup.*

2. **Adding one feature touches eight files.**
   *State lives in three libraries because three engineers each had a favourite. A custom animation in `home_screen.dart` is untouchable. Tracing a bug is five directories and a Slack thread from 2024. Velocity has half what it had a year ago.*

3. **Onboarding the new senior takes a month.**
   *They are good. They are senior. They still spend three weeks in the codebase before they ship anything, because no one wrote down which 200 lines actually decide the app. The thing inside the codebase that should be obvious is not.*

## Section 3 — What you get (eyebrow: "02 · Deliverables")

**Headline**: *A short list, a real report, and an hour with your team.*

**Lede**: *The audit is one product. Not a retainer, not a sales call. You get four things and you keep them.*

Bento cards:

1. **A ranked fix list short enough to ship this sprint.**
   *Five to ten items, ordered by impact and effort, with the file and line where to start. Not a backlog. The audit ends with a sprint, not a wishlist.*

2. **A frame-by-frame performance report.**
   *Before-and-after frame times for your three worst screens, captured on real devices. The bottleneck is named: rebuild storm, shader compile, expensive paint, jank from main-thread work, image decode, layout thrash. Whichever it actually is.*

3. **A plain-English brief your CFO can read.**
   *Two pages. What is risky, what is costing velocity, what it will take to fix. Send it up the chain without translating it.*

4. **A 60-minute walkthrough with your team.**
   *We open the report with the engineers actually shipping the code. Real-time questions. Recorded. The team leaves knowing what to do Monday morning.*

5. **A roadmap that survives me leaving.**
   *Notes, diagrams, naming conventions, and the three architectural decisions I would make next. The audit pays off long after I am out of your Slack.*

**Inline secondary magnet (low-commitment)**:
*Want a preview of what the report looks like? [Get the 12-point Flutter performance checklist](#checklist) used for every audit (one page, no email required).*

## Section 4 — Audit philosophy (eyebrow: "03 · How I read code")

**Headline**: *A code audit is not a code review.*

**Body (80 words)**:
*A code review tells you what is syntactically wrong. An audit tells you what is strategically wrong. Which decision from 2023 is costing a week per release. Which custom animation will bite you on the next Flutter version. Which third of your providers can be deleted. A linter sees code; the audit sees decisions. Five days is enough because the diagnosis is the hard part. The fix list is short on purpose. Most of the value is what is no longer there.*

## Section 5 — Process (eyebrow: "04 · How it runs")

**Headline**: *Five days. Same shape every time.*

Steps:

**Day 0 — You send the repo.**
*GitHub, GitLab, Bitbucket, or a zip. One symptom in your own words ("home screen scrolls badly on mid-tier Android"). NDA before code changes hands. I reply within 24 hours either confirming we are a fit or telling you exactly why we are not.*

**Days 1–3 — Inside the code.**
*Day 1 is reading. Days 2 and 3 are profiling on real devices: frame timelines, memory, GPU, build graph, dependency map. I ping you with questions and do not disappear.*

**Day 4 — The report.**
*The fix list, the perf report, the two-page brief, the roadmap notes. Delivered the morning of Day 5.*

**Day 5 — The walkthrough.**
*One hour, your engineers in the room, screen-share through the findings. Every question answered. Recorded for whoever could not make it. Two weeks of async clarifications + PR review after.*

## Section 6 — Pricing (eyebrow: "05 · Price")

**Headline**: *One price. Quoted after I see the repo.*

**Anchor**: `from $4,800 USD` *(typical 5-day audit; the quote firms after the intake call)*

**Inclusions**:
- Five working days inside your codebase
- The full deliverable set (fix list, perf report, brief, walkthrough)
- Two weeks of async follow-up + PR review

**Pricing reassurance line (replaces the doctrine's prior preacher-cadence version)**:

*The price is fixed when I quote it. If the work takes me longer than I scoped, you pay what we agreed and nothing more. If by Day 2 I find the audit cannot deliver what I quoted for, I tell you, refund the unspent half, and send everything I have so far in whatever shape is useful.*

## Section 7 — FAQ (eyebrow: "06 · Questions")

1. **Why an audit instead of just hiring a senior Flutter engineer?**
   *Hiring takes three to four months and a salary. The audit takes five days and a fee. If after the audit you decide you do need to hire, you will know exactly what skills the hire needs, which is usually the harder question. The audit is the cheapest way to find out what hiring will not fix.*

2. **We cannot share the repo. Is there another way?**
   *Yes. About a third of the audits I do are on screen-share only. Your engineer drives, I look, we record. The deliverables are the same. The price is the same. The only thing different is who has the keyboard.*

3. **Our app is not slow. It is just messy. Is the audit still useful?**
   *Yes, possibly more so. Performance audits get the headlines, architectural audits change quarters. If your team is touching eight files for a one-field change, you do not have a performance problem, you have a velocity problem. Same audit, different fix-list categories.*

4. **How is this different from running `flutter analyze` or a code-quality SaaS?**
   *`flutter analyze` tells you what is syntactically wrong. The audit tells you what is strategically wrong. A linter sees code. I see decisions.*

5. **What if you find the problem is too big for a 5-day audit?**
   *I tell you on Day 2, refund the unused portion of the fee, and write up what I have found so far in whatever shape is useful to you. If you want a case where this happened in real life, ask on the intake call. I will walk you through it with the client's permission.*

6. **Do you do the fixes too?**
   *Usually no. The audit is the product. Most teams find their own engineers ship the fix list faster than I could, and they learn the codebase along the way. For unusual cases (a custom shader to be written, a vector_math_64 rewrite of a gesture system), I do take implementation work, but only after the audit, and only if you ask.*

## Section 8 — About (eyebrow: "07 · The engineer")

**Headline**: *The person opening your repo.*

**Portrait caption (mono, two lines)**: `Nikita Kalaganov` · `Senior Flutter engineer · One audit at a time`

**Body**:

*I am a senior Flutter engineer. I have spent the last several years building, debugging, and unsticking Flutter apps in production: scrolling that drops frames on flagship phones, custom animations that have to look correct on a Pixel 3a, gesture systems that hold up at 120 Hz on iPad Pro. I work in `vector_math_64`. I write shaders when the off-the-shelf paint will not render fast enough. I read frame timelines when I am stuck, which is often the fastest way out.*

*What that means for you: when your app feels slow, I can usually say why inside a day. Rebuild storm, shader compile, expensive paint, main-thread work, image decode, layout thrash. The diagnosis is the hard part. The fix is usually small. The audit is me, your codebase, and the answer.*

*I take one audit at a time. That is the whole business. No agency, no team, no handoffs, no junior doing the work. If you hire the audit, you get me.*

## Section 9 — Final CTA + form (eyebrow: "08 · Book")

**Headline**: *Send me your repo.*

**Sub-line**: *Or describe the one thing hurting most. I read every form myself, usually within 24 hours.*

Form fields:

- **Name** · placeholder `Alex Chen`
- **Work email** · placeholder `alex@yourcompany.com` · microcopy: *I reply from a real address. No marketing list.*
- **Repo or app** · placeholder `github.com/yourcompany/your-app — or describe it` · microcopy: *Public URL, private repo invite, or just tell me what platform stores you are on. We can sort access after the first reply.*
- **What is hurting most right now?** (textarea, optional) · placeholder `Scrolling is janky on Android. New devs take a month to onboard. Crashes are spiking after the last release. — One symptom in your own words.` · microcopy: *One symptom is enough. The audit will find the rest.*

**Submit button**: `Send →`

**Microcopy under submit**:
*I read every form myself. You will hear from me within 24 hours, even if the answer is "I am not the right fit." Your code, your email, and what you write here are not shared, sold, or fed into any AI training set.*

## Footer

- Mono brand · `nikita.audit · flutter audits · MMXXVI`
- Links · `Email`, `GitHub`, `LinkedIn`, `Stack Overflow`
- Legal · `Privacy · Plain English`
- Reassurance microcopy under final CTA echoes the §6 reassurance line, abbreviated.
