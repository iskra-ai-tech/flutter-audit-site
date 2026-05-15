# Anti-Pattern Inventory: Flutter Audit Service Site

**Scope:** Every "DO NOT" we found across forums, NN/g, Baymard, Smashing, HN, Reddit, and design Twitter (2024-2026). Severity ranking: **CATASTROPHIC** (instant trust kill / refund-grade), **MAJOR** (loses ~20-40% of qualified buyers), **MINOR** (eye-roll but tolerable).

Audience reminder: the buyer is a **technical decision-maker** (CTO, lead engineer, indie Flutter founder). They detect bullshit faster than marketers. They live on HN and Reddit. They've been burned.

---

## 1. Portfolio / Service-Site Cliches (the 30 most-mocked of 2026)

### CATASTROPHIC

1. **"We craft pixel-perfect experiences" / "We're passionate about beautiful code"** — pure self-congratulation; HN and r/webdev mockery is universal. Hardik Pandya (2025): "Design + more design = pixel perfect but likely ineffective work." [theoddhatcreative.com](https://theoddhatcreative.com/2025/08/21/the-pixel-and-the-paradox-why-we-undervalue-graphic-design/) The Zulu Alpha Kilo parody site mocks this exact "sameness" of agency-speak. [Adweek](https://www.adweek.com/creativity/agencys-new-website-huge-hilarious-parody-terrible-agency-websites-170046/)

2. **Scrolljacked first viewport / horizontal scroll storytelling** — Multiple HN threads ("In my entire life, I have never enjoyed a scrolljacking website"). NN/g study: *the majority of participants experienced disorientation*, task-oriented users get "severely agitated"; mobile amplifies all problems. Auto tab-close from B2B technical buyers. [HN 36542038](https://news.ycombinator.com/item?id=36542038), [HN 41737409](https://news.ycombinator.com/item?id=41737409), [HN 32532599](https://news.ycombinator.com/item?id=32532599), [HN 19397546](https://news.ycombinator.com/item?id=19397546), [NN/g Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)

3. **Fake "Selected Works" / 3 invented case studies / template Lorem-ipsum projects** — UX Pilot, Bootcamp Medium, and Toptal all flag: "Perfect case studies with flawless process and beautiful outcomes signal lying portfolios." For a Flutter audit service: zero real audits = zero credibility. [Pawel Klasa, Bootcamp 2026](https://medium.com/design-bootcamp/your-design-portfolio-is-performance-your-public-work-is-evidence-838fe6719276)

4. **Marquee client-logo strip without permission/context** — "Using fake logos destroys all credibility." Trust signal experts demand the relationship be real and ideally linkable. Generic Stripe/Google/Shopify logos on a freelancer site = immediate suspicion. [Webstacks](https://www.webstacks.com/blog/trust-signals)

5. **AI-generated headshots on team page** — 70% of bad examples have generic office backgrounds with mismatched lighting; smooth skin and broken jewelry are dead giveaways. "If they realize it's fake, they will wonder what else in your work and life you'd be willing to fake." [headshotphoto.io 2026](https://www.headshotphoto.io/blogs/how-to-spot-ai-headshot), [turnto10](https://turnto10.com/i-team/consumer-advocate/why-ai-generated-headshots-can-backfire)

6. **Dark hero → bright midsection whiplash / strobing alternating sections** — accessibility issue (vestibular triggers) and amateur signal. Web Axe documents this exact failure pattern. [Web Axe vestibular](https://www.webaxe.org/vestibular-issues-parallax-design/)

### MAJOR

7. **Gradient orb hero / purple-pink mesh gradient** — Atvoid 2025: "frosted glass UI… the visual equivalent of an oat milk latte: pleasant, predictable, and completely safe." Glassmorphism + gradient orbs are the 2025 "default uniform." [Bootcamp Glassmorphism trap](https://medium.com/design-bootcamp/glassmorphism-the-most-beautiful-trap-in-modern-ui-design-a472818a7c0a)

8. **Custom magnetic/blob cursor for no reason** — multiple Kevin Powell community and HN threads mock these. Breaks accessibility, screen readers, drag-select.

9. **Typewriter-effect hero ("We build … apps … products … experiences")** — covered in every "stop using these" list; signals template hero from shadcn/Aceternity.

10. **Multi-second preloader / "loading…" splash on a static site** — "A bad preloader pushes visitors to close the tab." A Flutter audit company with a 4-second splash on its marketing site is self-parody.

11. **Parallax astronaut / floating planet / 3D blob hero** — vestibular-disorder triggers per WCAG 2.3.3 and Web Axe.

12. **Skill bars ("React 85% • Flutter 92%")** — freeCodeCamp/James Rauhut review: "claiming 85% proficient is meaningless." Universally mocked on r/webdev. [freeCodeCamp 50 portfolios review](https://www.freecodecamp.org/news/i-reviewed-fifty-portfolios-on-reddit-and-this-is-what-i-learned-e5d2b43150bc/)

13. **"Intro → Skills → Projects → Contact" cookie-cutter template** — same source: "makes portfolios blend together."

14. **Hamburger nav on desktop for a 4-page site** — hides primary nav for no reason; HN/Smashing both flag.

15. **Animated counter ("147 happy clients · 89,000 lines audited")** — Looks AI-fabricated unless verifiable. Without proof, reads as inflated.

16. **Floating "Chat with us" Intercom bubble covering content** — Intercom community: "covers buttons on websites." Distraction on mobile, screams enterprise-impostor.

17. **"Awwwards-style" overdesigned hero that takes 8s to load** — Awwwards' own evaluation gives only 30% to UX/UI; community Quora threads document the designer hatred. [Awwwards evaluation](https://www.awwwards.com/about-evaluation/)

18. **Generic stock photo of a developer in a hoodie squinting at a monitor** — instant amateur signal.

19. **"More than just a service" / "We're more than developers"** — old advertising cliche. [Design Agency UK](http://www.designagency.co.uk/blog/2015/4/21/the-five-worst-web-design-agency-clichs)

20. **Dog-on-the-team-page** — universal agency-cliche mockery.

### MINOR

21. Animated SVG underline drawing under headlines.
22. Three-card "Discover / Define / Deliver" process section with line-icons.
23. "Trusted by founders worldwide" — geographically vague.
24. Dribbble-style mockup-on-tilted-iPhone hero image.
25. "Drop me a line" + Spotify-now-playing widget in footer.
26. Section-reveal-on-scroll fade-up animation on every block.
27. Hero video of fingers typing on a mechanical keyboard.
28. "Currently available for new projects" green dot (overused).
29. Self-described "ninja / rockstar / 10x" anywhere.
30. Word-cycling hero ("audit, debug, refactor, deploy" rotating).

---

## 2. Forms & Lead-Capture Anti-Patterns

### CATASTROPHIC

- **Phone field above name/email, especially required** — Baymard: phone is the highest-abandonment field after Password. Adding it dropped one form's conversion by **47%**. MIT Tech Review 2025: **76% of B2B decision-makers have abandoned a form** because too much personal data was requested. [Baymard phone field](https://baymard.com/blog/explain-phone-number-field), [Zuko optimizing phone field](https://www.zuko.io/blog/optimizing-the-phone-number-field-on-forms), [Helpnetsecurity 2026](https://www.helpnetsecurity.com/2026/04/10/health-insurance-lead-generation-privacy/)
- **Exit-intent newsletter modal on a code-audit landing page** — "Offering a newsletter sign-up to someone browsing your pricing page is a mismatch." Wrong audience, kills trust instantly. [Omnisend](https://www.omnisend.com/blog/exit-intent-popup-examples-small-online-businesses/)
- **Form posted from a non-matching domain / `formspree.io` action visible** — looks like a phishing test.

### MAJOR

- **"Get a free strategy call" as the only CTA** — Hounder.co 2025: *"The Schedule a Demo CTA is Dead."* iCatalyft: "Book a Demo is no longer a differentiator." Buyers want answers, not meetings. [Hounder](https://hounder.co/the-dog-bowl/call-to-action-guide), [iCatalyft](https://icatalyft.com/blog/book-a-demo-ctas-are-dead/)
- **Required "Company size" / "Budget range" dropdowns before contact** — reads as sales-qualification screening; technical buyers bounce.
- **"Subscribe to my newsletter" with zero value prop** — Generic newsletter signups underperform across all page types. [Optimonk popup mistakes](https://www.optimonk.com/popup-mistakes/)
- **Double opt-in with no explanation** — adds friction for already-warm leads.
- **No "this is what happens after you submit" microcopy** — Baymard standard.

### MINOR

- 8-field "tell us about your project" form on a cold-traffic landing page.
- "We respect your privacy" with no GDPR/data-retention specifics.
- Captcha (especially reCAPTCHA v2 image grid) on a contact form.

---

## 3. Pricing / Sales-Page Anti-Patterns

### CATASTROPHIC

- **"Contact us for a quote" with no price anchor whatsoever** — PainOnSocial: "Buyers bounce to Reddit to find the real pricing." Kimberley Kasper Substack: "When buyers bounce to Reddit for pricing, you've already lost the deal." [Kimberley Kasper](https://kimberleykasper.substack.com/p/when-buyers-bounce-to-reddit-for), [PainOnSocial enterprise pricing](https://painonsocial.com/blog/enterprise-pricing-reddit)
- **Fake countdown / "10 spots left this month"** — Out of 393 sites surveyed, **40% of countdown timers are fake.** $780M in 2024 regulator fines for manipulative UX. FTC's Reviews & Testimonials Rule (Oct 21, 2024) authorizes civil penalties. [Fyresite dark patterns](https://www.fyresite.com/dark-patterns-a-new-scientific-look-at-ux-deception/), [FTC](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers)
- **Fake testimonials** — Illegal under FTC's 2024 rule. Civil penalties + permanent reputation damage. Anonymous "Jack W. from Orlando" reads as fabricated. [Boast.io](https://boast.io/testimonial-guidelines-ensure-youre-not-breaking-law/)
- **Pricing tiers with no actual prices, only "Starter / Pro / Enterprise" boxes and feature checks** — see Reddit pricing-research thread; users hate "the feeling that companies are hiding information."

### MAJOR

- **"Tailored to your needs" without specifying what's tailored** — Marketing Scoop 2025 lists this in "12 cliche taglines to stop using." [Marketing Scoop](https://www.marketingscoop.com/marketing/12-cliche-marketing-taglines-to-stop-using-in-2024-and-what-to-say-instead/)
- **"Custom pricing" page that's just a form** — same effect as "contact for quote."
- **Three-tier pricing where the middle one is "Most Popular" with no evidence.**
- **Money-back-guarantee with no actual terms.**
- **Crossed-out "regular" price ($5,000) with discount price ($2,997)** — anchoring dark pattern, technical buyers immediately suspect.
- **Stripe/Calendly badges as the only "trust" element.**

### MINOR

- "From $X" with no idea what triggers higher.
- Pricing toggles (monthly/yearly) with no annual discount math shown.

---

## 4. Trust Killers Specific to Dev Services

### CATASTROPHIC

- **"100% bug-free code guaranteed" / "We never miss a deadline"** — over-claim; any senior engineer reads as junior or dishonest. Sentinel of incompetence.
- **No real code samples / no GitHub link / no public commits** — Korte.co May 2026: "In Open Source, Trust Is A Real Asset." Recruiter.daily.dev: "Code commits, pull requests provide a clear, verifiable record." A code-audit service without a public code presence = catastrophic. [Korte](https://www.korte.co/2026/05/07/in-open-source-trust-is-a-real-asset/), [recruiter.daily.dev](https://recruiter.daily.dev/resources/open-source-builds-trust-developer-hiring/)
- **No real client names / "we worked with a Fortune 500" with no detail** — Webflow Blog 2025: "Anonymous testimonials like 'Jack W. from Orlando' don't inspire confidence."
- **Broken English mixed with marketing-perfect English** — classic offshore-scam signal; covered in IT outsourcing red flag lists. [LinkedIn IT outsourcing red flags](https://www.linkedin.com/pulse/how-spot-red-flags-service-consulting-outsourcing-scam-xcewf)
- **Unverifiable certifications / fake SOC 2 badges** — see the Delve/YC scandal (April 2026): fake SOC 2 audits and open-source code theft got them booted from YC. [Captain Compliance](https://captaincompliance.com/news/the-delve-scandal-fake-soc-2-audits-open-source-code-theft-and-exit-from-y-combinator/)

### MAJOR

- **No actual auditor name / face / GitHub / Stack Overflow / pub.dev profile.**
- **Stock photo of a "team" of 12 when the founder is solo** — discovered in seconds via LinkedIn cross-check.
- **"As featured in TechCrunch / Forbes" with no actual link to a piece.**
- **Testimonials with no LinkedIn link / no company URL.**
- **Vague claim of "Google certified" / "Flutter Authorized Partner" with no badge ID.**
- **No public sample audit / no redacted real deliverable / no "this is what you'll get" artifact.**

### MINOR

- "12 years of combined experience" (cliche per Demand Curve example).
- "Trusted by 50+ founders" with no logos.

---

## 5. Motion Abuse — When Motion Reduces Trust & Conversion

### CATASTROPHIC

- **Ignoring `prefers-reduced-motion`** — WCAG 2.3.3 "Animation from Interactions" is Level AAA but vestibular triggers are documented to cause nausea, dizziness, migraine. Technical buyers will check DevTools and notice. [W3C SC 2.3.3](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- **Scrolljacking required to read content** — NN/g: text + altered scrolling = worst usability outcome; mobile users sometimes refresh thinking the page is broken.

### MAJOR

- **Auto-playing background video with no pause control.**
- **Animation longer than ~300ms blocking content reveal.**
- **Mouse-tracking 3D tilt on every card** — drains laptop battery, looks gimmicky.
- **"Locomotive Scroll" inertia smoothing** — HN universally despises ("breaks decades of user instinct").

### MINOR

- Hover-zoom-on-image at 1.05x with 800ms transition.
- Page-transition fade between routes.

---

## 6. Mobile Breakpoints Commonly Broken

### CATASTROPHIC

- **Desktop-only scrolljack that becomes a deadzone on mobile** — NN/g: "Smaller screens make scrolljacks longer and more disorienting. Poor connection speeds compound delays."
- **Hero text positioned over a hero image that crops to nothing on portrait mobile.**
- **Sticky header + sticky footer + sticky CTA bar eating 60% of viewport.**

### MAJOR

- **Custom cursor that traps real cursor on touch devices.**
- **Hover-only navigation that has no tap fallback.**
- **`100vh` hero in mobile Safari** — bottom bar shrinks viewport, causes layout jump.
- **Font sizes below 16px in body (iOS auto-zooms inputs).**

### MINOR

- Hamburger nav for a 3-link site.
- Modal that can't be dismissed by tapping outside.

---

## 7. Accessibility Anti-Patterns That Signal "Amateur" to Technical Buyers

### CATASTROPHIC

- **Removed `:focus` outline with no replacement** — A11y Collective + Pope Tech: focus rings are required by WCAG. Removing them strands keyboard users. Technical buyers will Tab through your site to test you. [a11y-collective focus indicator](https://www.a11y-collective.com/blog/focus-indicator/), [Pope Tech 2026 focus indicators](https://blog.pope.tech/2026/03/04/a-guide-to-accessible-focus-indicators/)
- **Low contrast text (gray-400 on white, gray-300 on black)** — WebAIM Million: low contrast is the #1 accessibility error, appearing on **81% of home pages.** WCAG AA minimum 4.5:1. With the EAA in force since June 28, 2025, this is now a legal liability for European clients. [TestParty WCAG 2025](https://testparty.ai/blog/wcag-contrast-ratio-guide-2025), [allaccessible 2025](https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025)
- **No keyboard support** — freeCodeCamp 50-portfolio review: "If I can't navigate without a mouse, the applicant doesn't have accessibility on their mind."

### MAJOR

- **Hover-only tooltips / hover-only menus** — BOIA: WCAG violation. [BOIA hover actions](https://www.boia.org/blog/hover-actions-and-accessibility-addressing-a-common-wcag-violation)
- **Missing alt text on hero/case-study images.**
- **`<div>` buttons with no role / aria / keyboard handler.**
- **Skipped heading levels (h1 → h4).**
- **Color-only state indicators (red error border with no icon/text).**
- **Single-pixel focus indicator that disappears on busy backgrounds.**

### MINOR

- Missing `lang="en"`.
- No `aria-live` for form errors.

---

## 8. "AI Slop" Signals Readers Detect Instantly in 2026

### CATASTROPHIC

- **Em-dash spam** — "GPT-4.1 has 3.28x higher em-dash frequency than human writers." Even though em-dash alone isn't 100% reliable, **clusters of em-dashes** are the #1 fastest AI-detection heuristic in 2026. ChatGPT itself tried to ditch the em-dash because of this. [TechRound](https://techround.co.uk/artificial-intelligence/chatgpt-ditches-the-em-dash-what-does-this-mean-for-ai-detection/), [Plagiarism Today 2025](https://www.plagiarismtoday.com/2025/06/26/em-dashes-hyphens-and-spotting-ai-writing/)
- **"It's not just X, it's Y" negation pattern** — Blake Stockton's "Don't Write Like AI" series ranks this #1. Once readers notice it, "frustration, annoyance, and a bit of rage." [Blake Stockton](https://www.blakestockton.com/dont-write-like-ai-1-101-negation/)
- **"In today's fast-paced world / In an era of…" openers** — Originality.ai: 50%+ of LinkedIn posts were AI in 2025. LinkedIn's own algorithm now penalizes this. American Dialect Society 2026 Word of the Year: "slop." [Originality.ai 50% AI study](https://originality.ai/blog/linkedin-ai-study-engagement)

### MAJOR

- **"Imagine if…" / "What if I told you…" openers.**
- **"…and that's where we come in" / "That's where [brand] comes in."**
- **Throat-clearing: "Let me be clear," "Here's the thing," "The bottom line is."**
- **Significance-inflated vocabulary: "transformative," "pivotal," "seamless," "robust," "leverage," "unlock."**
- **Triplet structure ("faster, cleaner, smarter") on every section.**
- **Generic optimistic close: "Together, we'll build something amazing."**
- **Purple/pink shimmery gradient hero.** Bootcamp Medium: "every app showed up to the same party wearing translucent cardigans."
- **Uniform paragraph length / templated section breaks / conclusion that mirrors intro.** [AirOps AI slop](https://www.airops.com/blog/ai-slop)

### MINOR

- Rocket / sparkle / brain emoji in headlines.
- "Deep dive into…" / "Master class in…"
- "Stay ahead of the curve."

---

## 9. Service-Specific Red Flags for a Code-Audit Business

(Derived from Kreev, Rohant George, Zeka Design, Stefan Palios, Fizl, Captain Compliance, and r/freelance red-flag threads. While these are typically *client* red flags, mirror them — buyers expect *you* not to exhibit them.)

### CATASTROPHIC

- **No written scope of what the audit covers.** [Kreev red flags](https://kreev.io/blog/freelance-client-red-flags/)
- **Vague deliverable: "we'll send you a report."** No sample report = no purchase.
- **Promising a fixed-price audit for an unseen codebase.**
- **"Free preliminary audit" that turns into a sales call.**

### MAJOR

- **Refusal to sign NDA / share insurance / list jurisdiction.**
- **No mention of who actually does the audit (subcontracted to wherever).**
- **No methodology / no rubric / no checklist preview.**
- **Promising a turnaround time without seeing the codebase size.**

---

## 10. The "Every Agency Site Looks the Same" Trap

Zulu Alpha Kilo's parody site documented this universally: agency sites converge on a single template — dark hero, gradient orb, marquee logos, "Selected Works," three-card process, big circular client testimonials, parallax founder photo, oversized footer with sitemap and Dribbble link. [Adweek Zulu Alpha Kilo](https://www.adweek.com/creativity/agencys-new-website-huge-hilarious-parody-terrible-agency-websites-170046/), [Muse by Clios — Adweak parody site](https://musebyclios.com/advertising/the-hilarious-mysterious-saga-of-adweak-advertisings-most-savage-parody-site/)

**For our site:** if it looks like the result of running `npx create-portfolio` and would be at home on Awwwards, we've failed. Differentiation comes from concreteness: real before/after audits, named projects, actual numbers, prose that sounds like an engineer typed it.

---

## Top-Level Principle Cheat Sheet

1. **Concreteness beats craft.** A redacted real audit PDF beats any 3D orb hero.
2. **Show your work, don't claim your work.** GitHub > "trusted by."
3. **Pricing visible or the buyer leaves.** Even a range or a sample SOW beats "Contact us."
4. **Motion serves comprehension or it dies.** Honor `prefers-reduced-motion`.
5. **Text contrast ≥ 4.5:1 everywhere.** Non-negotiable.
6. **No fake anything.** Logos, testimonials, scarcity, headshots — all real or all cut.
7. **Write like an engineer, not a marketer.** Banned phrases: "passionate," "craft," "pixel-perfect," "tailored," "transformative," "let's chat," "imagine if," "in today's fast-paced world," "—and that's where we come in," "more than just."
8. **Mobile first or don't ship.** Test scroll, tap targets, hover-fallbacks, sticky bars.
9. **One CTA, low-commitment, with a concrete deliverable in the next step.**
10. **Make the buyer feel they're already in good hands.** Show the audit checklist, show a sample finding, name your tools, link your code.

---

## Sources Cited Above

- HN scrolljacking threads: [36542038](https://news.ycombinator.com/item?id=36542038), [41737409](https://news.ycombinator.com/item?id=41737409), [32532599](https://news.ycombinator.com/item?id=32532599), [19397546](https://news.ycombinator.com/item?id=19397546)
- [NN/g Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- [NN/g Breakpoints in Responsive Design](https://www.nngroup.com/articles/breakpoints-in-responsive-design/)
- [freeCodeCamp — 50 portfolios reviewed](https://www.freecodecamp.org/news/i-reviewed-fifty-portfolios-on-reddit-and-this-is-what-i-learned-e5d2b43150bc/)
- [Baymard — phone field](https://baymard.com/blog/explain-phone-number-field)
- [Zuko — optimizing phone field](https://www.zuko.io/blog/optimizing-the-phone-number-field-on-forms)
- [Webstacks — trust signals](https://www.webstacks.com/blog/trust-signals)
- [Boast.io — testimonial guidelines](https://boast.io/testimonial-guidelines-ensure-youre-not-breaking-law/)
- [FTC — Consumer Reviews and Testimonials Rule](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers)
- [Hounder.co — "Schedule a Demo is Dead"](https://hounder.co/the-dog-bowl/call-to-action-guide)
- [iCatalyft — Book a Demo is Dead](https://icatalyft.com/blog/book-a-demo-ctas-are-dead/)
- [Omnisend — exit intent popups](https://www.omnisend.com/blog/exit-intent-popup-examples-small-online-businesses/)
- [Optimonk — 10 popup mistakes](https://www.optimonk.com/popup-mistakes/)
- [Fyresite — dark patterns scientific look](https://www.fyresite.com/dark-patterns-a-new-scientific-look-at-ux-deception/)
- [Kimberley Kasper — bounce to Reddit](https://kimberleykasper.substack.com/p/when-buyers-bounce-to-reddit-for)
- [PainOnSocial — enterprise pricing](https://painonsocial.com/blog/enterprise-pricing-reddit)
- [headshotphoto.io 2026 — spot AI headshots](https://www.headshotphoto.io/blogs/how-to-spot-ai-headshot)
- [turnto10 — AI headshots backfire](https://turnto10.com/i-team/consumer-advocate/why-ai-generated-headshots-can-backfire)
- [Plagiarism Today — em-dash AI detection](https://www.plagiarismtoday.com/2025/06/26/em-dashes-hyphens-and-spotting-ai-writing/)
- [TechRound — ChatGPT ditches em-dash](https://techround.co.uk/artificial-intelligence/chatgpt-ditches-the-em-dash-what-does-this-mean-for-ai-detection/)
- [Blake Stockton — Don't Write Like AI: "It's Not X, it's Y"](https://www.blakestockton.com/dont-write-like-ai-1-101-negation/)
- [Originality.ai — 50% LinkedIn AI study](https://originality.ai/blog/linkedin-ai-study-engagement)
- [AirOps — AI slop](https://www.airops.com/blog/ai-slop)
- [Marketing Scoop — 12 cliche taglines](https://www.marketingscoop.com/marketing/12-cliche-marketing-taglines-to-stop-using-in-2024-and-what-to-say-instead/)
- [Adweek — Zulu Alpha Kilo parody](https://www.adweek.com/creativity/agencys-new-website-huge-hilarious-parody-terrible-agency-websites-170046/)
- [theoddhatcreative — pixel and the paradox](https://theoddhatcreative.com/2025/08/21/the-pixel-and-the-paradox-why-we-undervalue-graphic-design/)
- [Captain Compliance — Delve / YC fake SOC 2 scandal](https://captaincompliance.com/news/the-delve-scandal-fake-soc-2-audits-open-source-code-theft-and-exit-from-y-combinator/)
- [Korte — open source trust as asset](https://www.korte.co/2026/05/07/in-open-source-trust-is-a-real-asset/)
- [recruiter.daily.dev — open source builds trust](https://recruiter.daily.dev/resources/open-source-builds-trust-developer-hiring/)
- [a11y-collective — focus indicators](https://www.a11y-collective.com/blog/focus-indicator/)
- [Pope Tech 2026 — focus indicators guide](https://blog.pope.tech/2026/03/04/a-guide-to-accessible-focus-indicators/)
- [BOIA — hover actions WCAG violation](https://www.boia.org/blog/hover-actions-and-accessibility-addressing-a-common-wcag-violation)
- [TestParty — WCAG contrast 2025](https://testparty.ai/blog/wcag-contrast-ratio-guide-2025)
- [allaccessible — color contrast 2025](https://www.allaccessible.org/blog/color-contrast-accessibility-wcag-guide-2025)
- [W3C — SC 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)
- [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [Web Axe — vestibular issues parallax](https://www.webaxe.org/vestibular-issues-parallax-design/)
- [Bootcamp — Glassmorphism trap](https://medium.com/design-bootcamp/glassmorphism-the-most-beautiful-trap-in-modern-ui-design-a472818a7c0a)
- [Helpnetsecurity 2026 — lead site privacy](https://www.helpnetsecurity.com/2026/04/10/health-insurance-lead-generation-privacy/)
- [Kreev — freelance client red flags](https://kreev.io/blog/freelance-client-red-flags/)
- [Design Agency UK — worst agency cliches](http://www.designagency.co.uk/blog/2015/4/21/the-five-worst-web-design-agency-clichs)
- [Awwwards — evaluation criteria](https://www.awwwards.com/about-evaluation/)
- [LinkedIn — IT outsourcing red flags](https://www.linkedin.com/pulse/how-spot-red-flags-service-consulting-outsourcing-scam-xcewf)
- [UX Planet — 250 SaaS landing pages](https://uxplanet.org/i-reviewed-250-saas-landing-pages-avoid-these-10-common-design-mistakes-a1a8499e6ee8)
- [Pawel Klasa — portfolio is performance](https://medium.com/design-bootcamp/your-design-portfolio-is-performance-your-public-work-is-evidence-838fe6719276)
