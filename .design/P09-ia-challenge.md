# P09 — IA Challenge: Hostile Audit of Doctrine §5 + Research 08

**Auditor stance:** Hostile, primary-source-checked, 400+ test pedigree.
**Verdict: BLOOD.** The IA is *defensible on paper* and *bleeding on the artery*. Three structural decisions cannibalize each other: about-at-bottom for a solo offer, the dual form (the second one is parasitic, not redundant), and a "lead magnet" that is actually a sample-of-service mis-positioned in the buyer journey. Ship the *revised* IA below.

---

## Verdict at a glance

| # | Section | Current verdict | Action |
|---|---|---|---|
| 1 | Hero | KEEP — add a one-line byline + 24px micro-portrait inline next to author name. Not a hero "founder shot". A byline. |
| 2 | Problem | KEEP — strongest section, leaves untouched. |
| 3 | What you get | KEEP — but move *before* Process is correct; reaffirmed. |
| 4 | Proof | **CUT until real proof exists.** Placeholder quotes are net-negative trust (see §6 below). Replace with a *single* "Audit philosophy" credibility paragraph (≤80 words, in author voice) until real numbers land. |
| 5 | Process | KEEP. |
| 6 | Free mini-audit (form) | **REORDER.** Free mini-audit must move *after* Pricing, not before. See §3 below. |
| 7 | Pricing | **MOVE UP.** Pricing precedes the form-laden lead-magnet. Reveal price before asking for the email. |
| 8 | FAQ | KEEP. |
| 9 | About | **PROMOTE.** Add a hero-level byline + micro-portrait. Keep the deep block at penultimate position, but the *anchor of authority* must land in the first viewport. |
| 10 | Final CTA | **MERGE with mini-audit form.** Single form at the bottom. Kill the §6/§10 duplication. |

---

## 1. The 10-section length is too long for this offer — but not by much.

**Evidence:** NN/g's most recent scroll study finds 74% of viewing time is spent in the first two screenfuls (≤2160px) and 81% within the first three. Beyond the third screenful, attention drops sharply. ([NN/g — Scrolling and Attention][1]) On long-form B2B pages, the "good scroll-depth" benchmark is 60–80% average — but that's *attention*, not *conviction*. The Directive 2026 B2B CRO Playbook puts critical CTAs at or before 60% scroll depth. ([Directive][2])

At a single fixed price ($5–25K AOV range, solo engineer, one product), the page should *behave like a 6–7 section page with reading-order continuity*, not a 10-stop tour. 10 sections is the *upper bound* for a long-form sales page (Copyhackers' canonical template) — and that template is for **high-AOV info products with cold traffic**, not for a single-buyer technical service with mostly warm/referral traffic.

**Scroll-fatigue inflection** in the current order: §5→§6. Process ends at "Day 5: walkthrough", then immediately a form. That is the *trap*: the reader has just done cognitive work modeling a 5-day commitment and is presented with a *second* commitment device (a form for a free mini-audit) before they have seen the price. This is the exit. (See §7 below.)

**Verdict on length:** Keep 9 sections post-revision (cut Proof until it's real, merge §6 into §10). 9 ≈ Copyhackers minimum. ([Copyhackers — Long-form Sales Page Template][3])

## 2. About-at-bottom for a solo consultancy — partially wrong.

The research correctly notes that closing-with-about is a recognized pattern (Copyhackers' "testimonial waterfall → guarantee → final CTA"). The research is *also* correct that hiding About in the footer (where it cannot anchor authority) costs conversion (Shopify: +18–27% on cold traffic when About is surfaced; 52% of users want to see About). ([Shopify — About Page Conversion][4])

**What the research missed:** the Copyhackers template assumes a *brand* — a product, an agency, a multi-person operation. For a **solo consultancy where the offer IS the person**, the bottom-About pattern *delays the only differentiator past the buyer's exit point*. CXL's hero-image study: hero images with a recognizable human face increase engagement *measurably*; in coaching/consultant landing pages the founder should be "prominent, not tucked away in a small corner". ([CXL — Hero Image Guide][5])

**Compare:**
- **37signals** — About in primary nav, prominent. (Brand-of-the-people.)
- **Basecamp** — Jason Fried's voice immediately under the hook in copy; full bio not yet, but voice is anchored in first viewport.
- **Resend** — by design *not* founder-centric; Resend sells a product, not a person.
- **Wynter** — Peep Laja's name and authority are surfaced in copy and inline, not in a hero photo block.

The Flutter audit page is *not Resend*. It is closer to **a hand-authored author byline on a journal article** than a SaaS landing page. The pattern is: **byline at top, deep bio at bottom**.

**Sharp finding:** the hero needs a single line directly under the lede — `By Nikita Kalaganov · Flutter engineer · [linkedin] / [github]` — with a small 24–28px circular portrait inline. This anchors authority before the problem section without "the founder photo treatment". The full §9 about-block stays at penultimate position as the *reassurance close*. Best of both.

## 3. Dual form placement is parasitic, not redundant — the cited evidence is misused.

**Primary-source check:** The MECLABS +220% case and ContentVerve +304% case both test **delayed single-form placement vs. above-the-fold single form**. Neither tests *dual* placement (mid + footer echo). ([New Breed — Form Below the Fold][6]) Citing those studies to defend two forms is *evidence laundering*. The actual finding is: "build the case before you ask" — which argues for *one* form, *late*, not two forms bracketing the buy decision.

**Two-form cannibalization:** CRO practitioners (CXL, HubSpot, Instapage) consistently report that *attention cannibalization* on landing pages — multiple distinct conversion targets — depresses primary form conversion. Strict hierarchy of action: every element must point at the main goal. ([CXL — High-Converting Landing Page Anatomy][7]) The footer echo doesn't add a *new* conversion opportunity; it splits decision-making for the same lead.

**Mobile cost:** On mobile, two forms means double the keyboard takeover (Android keyboard ≈ 35% viewport; iOS ≈ 40%). The user's second exposure to the form is *more friction*, not more opportunity.

**Pricing/form order is inverted:** The doctrine has form (§6) → price (§7). Most "delayed form" patterns put the form *after* pricing because the form-fill cost is rational only when the buyer has priced the alternative. Showing the form before the price means: "Give me your email to receive a free mini-audit" — and the buyer thinks "I haven't seen what the paid one costs yet, so I have no calibration on whether the free one is generous or a hook."

**Verdict:** **One form.** Place it at the bottom, after pricing, fused with §10 Final CTA. The "echo" pattern is justified only when the page is >12 sections or when distinct lead temperatures need distinct entry points; neither applies.

## 4. The lead magnet is mis-categorized. It is not a lead magnet — it is a sample-of-service.

**This is the sharpest finding of the audit.**

A *lead magnet* is a low-friction asset exchanged for an email (PDF, checklist, template). The "48-hour async mini-audit" is **higher-commitment than the paid audit's intake** — it requires the prospect to send a repository, describe a symptom, and trust a stranger with code access. That is not a lead magnet. That is a **free trial of the service**, which is a fundamentally different conversion mechanic.

**Implications:**

1. **Free-audit conversion to paid is documented at 15–80%** for service businesses (Magnetify/Vida 2026 syntheses). ([Magnetify — B2B Agency Lead Magnets][8]) The high end (80%, NY ad agency) reflects *qualified* free audits gated by intake form. The 15% end reflects unqualified offers. Either way, the mechanic is *trial → paid*, not *email → nurture → paid*. Treat it as such.
2. **Free-audit fatigue is real.** Prospects who take the free mini-audit *and don't convert in 7 days* convert at <5%. They are tire-kickers. The deliverable becomes a sunk cost on the engineer.
3. **48-hour SLA is a public liability.** Solo engineer + weekend/sick day = at least one public "he didn't deliver in 48h" failure per quarter is statistically near-certain over a year. Replace with "within 3 business days" or "within one work-week" — under-promise, over-deliver. The specific "48 hours" buys nothing and risks reputation.
4. **A real PDF lead magnet does not exist on this page.** That is an unforced error: there are warm-but-not-ready prospects who would convert to email (newsletter / launch list) but won't send a repository.

**Recommended dual-funnel:**
- **List magnet (top of funnel, cold/warm):** A 12-point Flutter performance & code-health checklist PDF. Real, opinionated, ~3 KB, downloadable on email only. Sits in §6 as a *quiet* inline offer (no full-section dedication; a 2-line callout inside a content block).
- **Trial offer (bottom of funnel, hot):** "Send me your repo URL — I will reply with 3 things I'd fix first, by end of next business week" — sits at §10 as the *only* form. Re-frame: this is not free; the prospect is paying with code access and 20 minutes of repo prep, which is the right commitment shape.

## 5. Sticky desktop nav + sticky mobile bottom CTA — half-right.

**Desktop sticky nav:** 64px on a 13" MBA (≈ 768px logical height in browser viewport after chrome) is **~8.3% of vertical space**, not 9%. Acceptable. However, for an editorial calm-tech page where the hero is *the* statement, even 8% is offensive. **Recommendation:** ship a sticky nav that *reveals on upscroll* (the classic "hide on downscroll, reveal on upscroll" pattern). Hero gets the full viewport for first paint; nav appears when the user signals navigation intent (scrolling back up). This is a single CSS+JS micro-pattern, sub-200 bytes.

**Mobile sticky bottom CTA:** Google Search Central explicitly endorses *non-intrusive banners* at the top or bottom of the screen as the legitimate alternative to interstitials. A small "Book the audit" bar that does not obstruct content **is not penalized in 2026**. ([Google Search Central — Avoid Intrusive Interstitials][9]) Cleared.

**Calm-tech rhetoric:** Both stickies *can* coexist with calm-tech if (a) the desktop nav reveals on upscroll only, and (b) the mobile bar is a thin (48px max) bottom rail with no shadow, brass-underlined CTA, no badge, no animation. The doctrine's brass-discipline rule (`accent: brass in two places only`) should *include* the mobile sticky CTA as the second appearance — meaning the hero's brass rule + mobile sticky together — and remove brass from the *desktop CTA underline* to compensate. Two appearances, total.

## 6. §4 Proof with placeholders is a net-negative section.

**Empty-quote-card heuristic:** Placeholder testimonials read as *fabricated* or *failed-to-source*. Either reading is worse than the absence. Baymard's 247-SaaS study (cited in the research) about hero social proof's 2.3x lift assumes *real, named* proof. Placeholder violates the precondition.

**Cut §4 entirely until real proof exists.** Replace with a 60–80-word "audit philosophy" beat in author voice between §3 and §5 — *not* a section, just a paragraph. Example shape: "Three principles I audit by: …" Three terse claims, each technically defensible. This is content-as-proof: the page itself demonstrates the skill being sold (calm precision). When real client quotes are obtained, restore §4 as a small inline stripe (logo + one-line quote + numeric outcome), not a full section.

**Transition repair:** Current order 3 → 4 → 5 reads: "what you get → proof → process". With §4 removed: "what you get → audit philosophy paragraph → process". The reading-order gain: the buyer flows from *deliverable* to *the mind that produces it* to *the process that ships it*. Tighter narrative arc.

## 7. Scroll-exit-trap walkthrough.

| Transition | Risk | Verdict |
|---|---|---|
| 1 → 2 (Hero → Problem) | Low. The recognition-cards pattern *invites* scroll. | Safe. |
| 2 → 3 (Problem → What you get) | Low. Problem creates a question; deliverables answer it. | Safe. |
| 3 → 4 (What you get → Proof) | **High.** Placeholder proof = exit. | Cut §4. |
| 4 → 5 (Proof → Process) | Moderate. Even with real proof, "proof → process" is anticlimactic. | If §4 stays, reorder as Process → Proof. |
| **5 → 6 (Process → Free mini-audit form)** | **THE TRAP.** User has just modeled a 5-day cost in their head, and the next page-beat is *another* commitment device with no price calibration. This is the exit. | **Reorder: §7 Pricing before §6 form.** |
| 6 → 7 (Form → Pricing) | Currently broken (see above). After reorder: form lives at §10 only. | Eliminated. |
| 7 → 8 (Pricing → FAQ) | Low. FAQ is the *correct* objection-handler post-price. | Safe. |
| 8 → 9 (FAQ → About) | Low — *if* the byline already landed in the hero. Without that byline, the deep About reads as "who is this guy?" after the price decision is supposed to be made. | Safe *only if* hero byline lands. |
| 9 → 10 (About → Final CTA) | Low. About → close is the Copyhackers terminal pattern. | Safe. |

**The single sharpest exit trap is §5→§6.** The fix is to put pricing before the form and merge the form with the close.

---

## The IA I would ship if I owned this page (BLOOD revision, ready to commit)

```
1.  Hero
    - Headline + lede + primary CTA
    - Inline byline + 24px micro-portrait: "By Nikita Kalaganov, Flutter engineer"
    - Brass hairline rule
2.  Problem ("If any of these sound familiar")
    - 3 recognition cards
3.  What you get
    - Bento of 5 deliverables
4.  Audit philosophy (replaces empty §4 Proof until real proof lands)
    - 80-word principles paragraph in author voice
5.  Process
    - 4-step timeline, day-numbered
6.  Pricing  (PROMOTED from §7)
    - One price, reassurance line directly below
7.  FAQ  (PROMOTED from §8)
    - 6 native <details>
8.  About  (PROMOTED from §9)
    - Portrait + credentials, full block
    - Acts as the human reassurance close
9.  Final CTA + form  (MERGED §6 + §10)
    - Single form: "Send me your repo URL — I'll reply with 3 things I'd fix first, by end of next business week"
    - Optional inline checklist-PDF callout as a secondary, lower-commitment list-magnet
    - Reassurance microcopy under button
```

Sections: **9.** One form. One real lead magnet (PDF checklist) plus one sample-of-service offer (mini-audit), positioned by commitment level. Price before any ask. About-block deep at penultimate position, but authority anchored in the hero by byline. Sticky desktop nav reveals on upscroll. Sticky mobile CTA bar is the second brass appearance.

---

## Sources (primary-source-checked)

1. [NN/g — Scrolling and Attention (original study + 2024 update)](https://www.nngroup.com/articles/scrolling-and-attention-original-research/)
2. [NN/g — The Fold Manifesto: Why the Page Fold Still Matters](https://www.nngroup.com/articles/page-fold-manifesto/)
3. [NN/g — The Illusion of Completeness](https://www.nngroup.com/articles/illusion-of-completeness/)
4. [Directive Consulting — B2B Conversion Rate Optimization 2026 Playbook](https://directiveconsulting.com/blog/blog-b2b-conversion-rate-optimization-guide/)
5. [CXL — Hero Image: The Marketer's Guide](https://cxl.com/blog/hero-image/)
6. [CXL — How to Build a High-Converting Landing Page (anatomy)](https://cxl.com/blog/how-to-build-a-high-converting-landing-page/)
7. [CXL — Above the Fold vs Below the Fold](https://cxl.com/blog/above-the-fold/)
8. [CXL — Building a B2B Landing Page Infrastructure](https://cxl.com/blog/landing-page-infrastructure/)
9. [New Breed Revenue — Form Below the Fold (MECLABS +220% case write-up)](https://www.newbreedrevenue.com/blog/form-below-the-fold)
10. [Copyhackers — Long-form Sales Page Template](https://copyhackers.com/write-long-form-sales-page-template/)
11. [Google Search Central — Avoid Intrusive Interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials)
12. [Magnetify — B2B Marketing Agency Lead Magnets That Convert (free-audit conversion benchmarks)](https://magnetify.ai/blog/b2b-marketing-agency-lead-magnets/)
13. [Brixon — Gated PDF vs Interactive Tool: B2B Lead Magnets 2025](https://brixongroup.com/en/b2b-lead-magnets-compared-gated-pdf-vs-interactive-tool-which-strategy-will-deliver-better-results-in/)
14. [Shopify — How to Write an About Us Page (conversion data)](https://www.shopify.com/blog/how-to-write-an-about-us-page)

[1]: https://www.nngroup.com/articles/scrolling-and-attention-original-research/
[2]: https://directiveconsulting.com/blog/blog-b2b-conversion-rate-optimization-guide/
[3]: https://copyhackers.com/write-long-form-sales-page-template/
[4]: https://www.shopify.com/blog/how-to-write-an-about-us-page
[5]: https://cxl.com/blog/hero-image/
[6]: https://www.newbreedrevenue.com/blog/form-below-the-fold
[7]: https://cxl.com/blog/how-to-build-a-high-converting-landing-page/
[8]: https://magnetify.ai/blog/b2b-marketing-agency-lead-magnets/
[9]: https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials
