# 08 - Information Architecture for the Flutter Audit Long-Scroll Page

Single long-scroll service page. Owner photo + bio is intentionally at the BOTTOM. Page must lead with the buyer's problem, terminate in a credibility-and-CTA close. Lead magnet + pricing reassurance ("won't charge more if it runs long") must each find a load-bearing home.

---

## 1. Research synthesis

### 1.1 What IA order converts best in 2026?

Three canonical patterns dominate the literature:

| Pattern | Sequence | When it wins |
|---|---|---|
| **A. Outcome-led** | Hero (outcome) → Proof → Problem → Solution → Process → Pricing → FAQ → CTA | Solution-aware buyer who already knows they need an audit; brand has heat. Unbounce's 2026 Q1 benchmark (310k pages, 14 industries) shows single-CTA, outcome-framed pages convert at 13.5% median vs 10.5% for multi-CTA. |
| **B. Problem-led (PAS)** | Hero (problem) → Agitation → Solution → Proof → Process → Pricing → FAQ → CTA | Problem-aware buyer ("our app is slow"). Joanna Wiebe's Copyhackers PAS-on-Steroids template explicitly opens with the pain — she defends this on the principle that you "join the conversation already happening in their head." CXL's ContentVerve case showed a **+304%** lift when the form was held back until the case was built. |
| **C. Hybrid (outcome-hero, problem-agitation immediately under)** | Hero (outcome promise framed as relief from a stated pain) → Problem → Proof → Solution → Process → Pricing → Reassurance → FAQ → About → CTA | Mixed-awareness traffic from referrals + cold search. The Baymard 247-SaaS-site study found social proof in the hero earns **2.3x** the engagement of identical proof placed below the fold — so hero must still carry one credibility cue even when problem-led. |

**Evidence-based winner for a code-audit service:** Hybrid (C). The buyer of a Flutter audit is _problem-aware_ (something is broken, slow, or scary) but rarely _solution-aware_ ("I need a paid third-party audit") — Eugene Schwartz's framework dictates you must name the problem out loud before offering the solution, but the hero still has 5 seconds (NN/g attention window) to signal _relevance_, which requires an outcome promise.

### 1.2 Five scroll exit traps (NN/g + Hotjar + Invesp)

1. **The hero false bottom.** If the first viewport visually completes (centered headline + CTA with whitespace beneath), 75% of users in NN/g's classic study didn't realize content existed below. Mitigation: content must break the fold — partial image, peeked next section, downward cue.
2. **The horizontal divider trap.** Full-width rules or mode-shift backgrounds (light → dark → light) read as "end of page" mid-scroll. Invesp: pages with clear visual continuity see **30–40% deeper scroll**.
3. **The wall of text section.** Dense paragraphs convert pauses into exits. Mitigation: chunk every section into ≤3 scannable units (heading + 2-line lede + visual/proof).
4. **The unrewarded section.** Each section must deliver a new beat — proof, insight, vivid example, or aesthetic payoff. NN/g information-foraging theory: users only scroll if the perceived "scent" of value increases.
5. **The premature ask.** A form or pricing wall before the buyer is convinced kills the scroll. CXL: forms moved below the fold lifted conversion **+220%** (MECLABS) and **+304%** (ContentVerve) when the case was built first.

### 1.3 Where the form lives

| Position | Evidence | Verdict for this page |
|---|---|---|
| Hero | Pressing for email before context = exit spike | Skip |
| Mid-page (after proof, before pricing) | Embedded forms catch already-engaged users; MECLABS +220% case | **Primary placement** |
| Bottom (after about) | 91% of users who reach footer have high intent; natural close | **Secondary placement (echo form)** |
| Sticky bottom CTA | Mobile sticky CTA alone lifts +11% (2026 study); combined with above-fold gives only +12% — sticky absorbs the gain | **Yes on mobile, button-only, opens form modal** |

The lead magnet ("Flutter performance audit checklist PDF" or similar) is the email-extraction lever. It sits **after the solution + proof beats, before pricing** — at the moment the reader says "okay, but is this for me?" The PDF lets them sample the work without committing to the engagement.

### 1.4 Where the pricing reassurance lives

"Won't charge more if it takes longer" is a **risk-reversal guarantee**. Research is unambiguous:

- Neil Patel: +21% sales when 30-day guarantee made explicit near CTA.
- CXL: privacy-reassurance line directly below form +19.47% signups.
- The rule (Crazy Egg, Invesp, multiple 2025–26 syntheses): risk-reduction microcopy goes **directly adjacent to the primary CTA**, never in the footer or about page.

**Verdict:** The reassurance line lives in **two** places: (1) as a quoted sentence directly under the price in the Pricing section, and (2) repeated as microcopy under the final CTA. It is _not_ a standalone section — it is connective tissue.

### 1.5 About-at-the-bottom — does it hurt?

Conventional CRO says no (Shopify: founder stories +18–27% on cold traffic; 52% of users want to see About). But research distinguishes _hiding_ About from _closing_ with About:

- Hiding About in the footer = lost conversion (Foundr, SoftwarePromotions).
- Closing with About when the offer is the headline and personal authority is the **reassurance close** = a recognized pattern. The owner's face + credentials function as the final trust signal before the last CTA, mirroring Copyhackers' long-form template (testimonial waterfall → guarantee → final CTA). When the buyer has already absorbed the offer, proof, process, and price, the human-behind-the-work is the most powerful closing image.

**Verdict:** Bottom-placed About is _correct_ for this page because (a) the owner is the entire delivery team, so the photo functions as both reassurance and inventory disclosure, and (b) credentials placed at the top would distract from the buyer's pain. To prevent loss, the top nav must still link to `#about` so impatient evaluators can jump.

### 1.6 Mobile reordering rules

On mobile each section becomes a near-100vh slab. Rules:

1. **Compress hero to a single screen.** No two-line headline + two-line subhead + dual CTA + image. One headline, one subhead, one CTA. The 5-second window is harsher on mobile.
2. **Surface proof earlier.** Move one trust cue (count of audits done, or 1 marquee logo) inside the hero — Baymard 2.3x rule applies hardest on mobile because users won't scroll for it.
3. **Collapse FAQ.** Accordion, not stacked open. Otherwise FAQ alone is 4–6 viewports.
4. **Sticky bottom CTA bar.** +11% on mobile. Button only, not full nav. Replaces sticky top nav on mobile (avoid double-stick — eats 20–30% of screen height per NN/g mobile guideline).
5. **About stays bottom but compresses.** Photo + 3-line bio, not the full-width treatment.

### 1.7 Sticky-nav verdict

- Desktop: **Yes, slim sticky top nav with anchor links.** Long-scroll one-pagers benefit (Convert.com case: +25% when sticky CTA added on long sales page). Sticky nav also serves the impatient evaluator who wants to jump to Pricing or About.
- Mobile: **No top sticky nav. Sticky bottom CTA bar instead.** Double-stick is the worst case (eats viewport, conflicts with thumb zone).

### 1.8 Case-study reference points

- **Resend.com**: opens with one-line value prop + nav, then immediately surfaces dev-relevant tools (CLI, MCP, SDK) — a flat, scannable IA for a dev audience. Lesson: developers want shortcuts, not narrative. The Flutter audit buyer is technical, so anchor links and a clear "what you get" matter.
- **Plain.com**: hero → problem (fragmentation) → solution (6 capabilities bento) → feature deep-dives → competitive positioning → social proof → setup timeline → security → footer. Lesson: even a polished B2B product page front-loads the problem and closes with reassurance (security = their version of risk-reversal).
- **Basecamp**: opens "Wrestling with projects?" — pure problem hook — then immediately a founder note from Jason Fried. Lesson: when the brand is also the person, founder voice can appear early as _voice_, but full About sits later. We invert this slightly: voice in hero copy, photo at bottom.
- **Copyhackers long-form template**: hook → buildup → reveal → offer → guarantee + CTA → testimonial waterfall → final CTA. Confirms our pattern: guarantee adjacent to CTA, social proof concentrated near close, About-as-reveal works at the bottom.

---

## 2. Three IA proposals

### A. Outcome-led

| # | Section | Purpose | Animation moment |
|---|---|---|---|
| 1 | Hero | "Ship a faster, calmer Flutter app in 10 days." — outcome promise + primary CTA | Headline letterforms settle / shader background glints |
| 2 | Proof strip | Logos + audit count — relevance in <5s | Logos fade in staggered |
| 3 | What you get | The deliverable bento (report, screen recording, prioritized fix list) | Cards parallax on enter |
| 4 | The problems we find | Reframes as "you probably have one of these" — pain via recognition | Animated jank/perf demo loops |
| 5 | Process | 4 steps with timeline | Stepper draws in |
| 6 | Lead magnet | "Free 12-point Flutter perf checklist PDF" + email form | Form slides up |
| 7 | Pricing + reassurance | One price, one quote line: "fixed fee — won't charge more if it runs long" | Price counter ticks up |
| 8 | FAQ | Objection handling | Accordion |
| 9 | About | Owner photo + credentials | Photo reveal, vector_math shader signature |
| 10 | Final CTA | Repeat email form, reassurance microcopy below button | Button magnetism |

**Defense:** Cleanest for warm/referral traffic. Risk: cold problem-aware traffic may bounce at hero if they don't recognize "calm Flutter app" as their language.

### B. Problem-led (PAS)

| # | Section | Purpose | Animation moment |
|---|---|---|---|
| 1 | Hero (problem) | "Your Flutter app drops frames. Users notice." — name the pain | Stuttering scroll-jank effect freezes on landing |
| 2 | Agitation | The cost: bad reviews, churn, eng team morale | Numbers tick (review stars dropping) |
| 3 | Solution | "A code audit that finds the cause in 10 days." | Reveal of report mockup |
| 4 | Proof | Before/after framerate, logos, quotes | Framerate graph animates |
| 5 | Process | How the audit runs | Stepper |
| 6 | Lead magnet | Sample checklist PDF, email gate | Form slide |
| 7 | Pricing + reassurance | Price + "fixed fee" quote line | Price counter |
| 8 | FAQ | Objections | Accordion |
| 9 | About | Owner + credentials = the reassurance close | Photo reveal, shader signature |
| 10 | Final CTA | Repeat form, reassurance microcopy | Button magnetism |

**Defense:** Best match for Schwartz problem-aware buyer + Wiebe PAS framework + ContentVerve +304% pattern. Risk: opens negative; some buyers don't want to be told their app is broken.

### C. Hybrid (recommended)

| # | Section | Purpose | Animation moment |
|---|---|---|---|
| 1 | Hero | Outcome framed against pain: "Ship a Flutter app users don't complain about — in 10 days." Primary CTA + 1 trust cue (audits shipped count) | Shader/vector_math hero (signature visual hook, sets craft tone) |
| 2 | Problem | "If any of these sound familiar…" — 3-card recognition pattern (jank, crashes, slow startup, leaky state) | Cards reveal on scroll, each plays a micro-demo |
| 3 | Solution / what you get | The audit deliverable: written report + screen-recorded walkthrough + prioritized fix list | Bento parallax |
| 4 | Proof | Logos + 1–2 quotes + 1 numeric outcome (e.g. "60→120fps on screen X") | Framerate counter animates |
| 5 | Process | 4-step timeline (intake → audit → report → walkthrough) | Stepper draws |
| 6 | Lead magnet + email form | "Get the 12-point Flutter performance checklist" — PDF in exchange for email. Self-contained value, builds list even if buyer doesn't book. | Form slide-up; field focus glow |
| 7 | Pricing | One fixed price. Underneath, quoted: _"Fixed fee. If it runs long, that's on me — you won't pay more."_ | Price counter |
| 8 | FAQ | Objections including scope, timeline, NDAs, post-audit support | Accordion |
| 9 | About | Owner photo + "Flutter engineer — debugging, performance, custom animations, shaders, vector_math_64". Functions as final trust beat. | Portrait reveal; the page's _signature_ shader animates behind the photo, closing the visual arc opened in the hero |
| 10 | Final CTA | "Book the audit" button. Microcopy below: _"Fixed fee. Reply within 24h."_ | Button magnetism, sticky bar mirrors this on mobile |

**Defense:** Hero earns the 5-second window with outcome + proof cue (Baymard 2.3x rule). Problem section immediately validates the pain (Schwartz/Wiebe). Lead magnet harvests undecided traffic. Pricing reassurance lives _at the price_ where the objection forms. About at the bottom functions as the human reassurance close — and the shader visual return creates a "scroll story" arc (NN/g information-foraging payoff at the end). Final CTA repeats the guarantee microcopy per Crazy Egg / Neil Patel pattern.

**This is the recommended order for the next phase.**

---

## 3. Anchor link map + sticky nav verdict

Anchor IDs (kebab-case, stable for analytics + deep links):

| Section | `id` | Nav label |
|---|---|---|
| Hero | `top` (page root) | — (logo links here) |
| Problem | `#problem` | "Problems" |
| Solution / what you get | `#what-you-get` | "What you get" |
| Proof | `#proof` | (not in nav — supports Solution) |
| Process | `#process` | "Process" |
| Lead magnet | `#checklist` | "Free checklist" |
| Pricing | `#pricing` | "Pricing" |
| FAQ | `#faq` | "FAQ" |
| About | `#about` | "About" |
| Final CTA | `#book` | "Book an audit" (button-styled in nav) |

**Nav order (left to right, 6 items max per NN/g short-term memory rule):** Process · What you get · Pricing · FAQ · About · **Book an audit** (CTA button).

`Free checklist` and `Problems` are reachable by scroll but kept out of nav to preserve scannability (6 items is the cap; 5–7 is the NN/g sweet spot).

CSS: `scroll-padding-top: 5rem;` on `html` so anchor jumps clear the sticky header.

### Sticky nav verdict

- **Desktop: ship a slim sticky top nav.** Justified by long-scroll length, the impatient-evaluator use case (jump to Pricing or About), and the Convert.com +25% sticky-CTA precedent. Height capped at ~64px. Logo left, 5 anchor links + 1 CTA button right.
- **Mobile: do not ship a sticky top nav. Ship a sticky bottom CTA bar instead** ("Book an audit" full-width button). +11% conversion lift in 2026 mobile sticky-CTA-alone benchmark; double-stick (top + bottom) eats viewport and adds only +1% over sticky-bottom alone.
- Top nav on mobile collapses into a hamburger that is _not_ sticky — appears in the document flow with the hero, accessible by scrolling back to top.

---

## 4. Sources

- [NN/g — Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
- [NN/g — Scrolling and the Illusion of Completeness](https://digitalcommunications.wp.st-andrews.ac.uk/2020/09/21/scrolling-and-the-illusion-of-completeness/)
- [Baymard — Information Architecture UX](https://baymard.com/learn/information-architecture-ux)
- [CXL — How to Build a High-Converting Landing Page](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/)
- [CXL — Mastering Above the Fold](https://cxl.com/blog/above-the-fold/)
- [CXL — B2B Landing Page Infrastructure](https://cxl.com/blog/landing-page-infrastructure/)
- [CXL — Call to Action](https://cxl.com/blog/call-to-action/)
- [Copyhackers — Long-form Sales Page Template](https://copyhackers.com/write-long-form-sales-page-template/)
- [Copyhackers — How to Write a Sales Page](https://copyhackers.com/how-to-write-a-sales-page/)
- [Schwartz Pyramid of Awareness](https://b-plannow.com/en/the-schwartz-pyramid-guide-to-the-5-levels-of-customer-awareness/)
- [Unbounce 2026 Conversion Benchmarks (synthesis)](https://www.digitalapplied.com/blog/landing-page-statistics-2026-conversion-data-points)
- [Conversion Rate Experts — How to make users scroll](https://conversion-rate-experts.com/scrolling-tips/)
- [Convert.com — Do Sticky Menus Harm Conversions?](https://www.convert.com/blog/optimization/do-sticky-menus-help-or-harm-conversions/)
- [Invesp — Illusion of Completeness](https://www.invespcro.com/blog/the-illusion-of-completeness-how-to-break-this-fatal-ux-design-mistake/)
- [Hotjar — Scroll Maps](https://www.hotjar.com/blog/scroll-maps/)
- [Crazy Egg — High-Performing CTA Buttons](https://www.crazyegg.com/blog/high-converting-cta-buttons/)
- [Shopify — About Us Page Conversion Data](https://www.shopify.com/blog/how-to-write-an-about-us-page)
- [Foundr — About Us Page and Conversions](https://foundr.com/about-us-page-conversions)
- [SoftwarePromotions — About Page as Conversion Tool](https://www.softwarepromotions.com/news/the-science-of-trust-transforming-your-about-page-into-a-powerful-conversion-tool/)
- [AB Tasty — Mobile Sticky CTA](https://www.abtasty.com/blog/mobile-stick-to-scroll/)
- [Speero — Are Sticky CTAs Really That Sticky](https://speero.com/post/are-sticky-ctas-really-that-sticky-that-was-the-next-question-tacked-in-our-series-it-depends)
- [Resend homepage IA (fetched)](https://resend.com/)
- [Plain homepage IA (fetched)](https://www.plain.com/)
- [Basecamp homepage IA (fetched)](https://basecamp.com/)
- [37signals page IA (fetched)](https://37signals.com/)
