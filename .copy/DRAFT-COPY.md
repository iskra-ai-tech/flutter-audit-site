# Flutter Audit Site — Draft Site Copy

Author voice: first-person, senior engineer, calm, specific. No hype, no emojis, no "we" plural-of-modesty. Companion strategy: `/.research/06-copy-strategy.md`.

---

## 1. Hero Headline — 12 Candidates, Ranked

Ranked by: pain-mirror strength, specificity, awareness-level fit (Problem-Aware dominant), and how well the sub-headline can do the heavy lifting under it.

1. **Your Flutter app shouldn't feel this slow.** *(Top pick. Mirrors the exact internal sentence the CTO is already saying. Short. Bold. Implicitly accusatory of the codebase, not the team — which is the safe seat for a buyer.)*
2. **Stop shipping a Flutter app you're embarrassed to demo.** *("Stop X and start Y" pattern; agitates the philosophical pain — "I shouldn't be ashamed of this." High urgency, slightly aggressive.)*
3. **A senior set of eyes on your Flutter app. In 5 days.** *(Specific, calm, time-bound. Sells the deliverable, not the dread. Best fit for Solution-Aware buyers comparing audit options.)*
4. Your Flutter app is fixable. Faster than you think.
5. The jank, the crashes, the 8-files-per-feature — a Flutter audit that finds them all.
6. How to make your Flutter app feel fast without rewriting it.
7. Find out what's wrong with your Flutter app — before your next investor demo.
8. The Flutter audit that pays for itself in the first PR you don't have to write.
9. Stop guessing why your Flutter app drops frames.
10. Onboard a senior Flutter engineer for one week. Get a roadmap that lasts a year.
11. The 5-day Flutter audit. Fixed price. No surprises.
12. Your codebase is whispering. I read it for a living.

**Recommended use**: Hero = #1. Reserve #3 as the H2 just below, and #11 as the pricing-section anchor.

---

## 2. Hero Sub-Headline — 3 Candidates

1. **A 5-day audit of your Flutter app by a senior engineer who lives in DevTools, Impeller, and the rendering pipeline. You get a prioritized fix list, a frame-by-frame perf report, and a 60-minute walkthrough call. Fixed price. If it takes longer, I eat the difference.** *(Recommended. Carries the offer, the deliverable, the credibility, and the pricing promise in one breath.)*
2. *I spend a week inside your codebase so your team can spend the next quarter shipping. You get a ranked fix list, before/after frame timings, and a plain-English brief your CTO and your CFO can both read.*
3. *Senior Flutter engineer. One audit at a time. I open your repo, find what's actually hurting, and hand you a list short enough to act on this sprint.*

---

## 3. Calls to Action

**Primary CTA (button text)**: `Send me your repo →`

Microcopy under button: *Or paste a public GitHub URL. NDA on request. I read every submission myself — usually within 48 hours.*

**Secondary CTA (text link, lower commitment)**: `See a sample 1-page audit (anonymized)`

Why these: "Send me your repo" is specific, surprising, and self-qualifying. The secondary lets the cautious browser see the deliverable shape before sharing code. Together they make a clean commitment ladder: read → see sample → send symptom → send repo → book audit.

---

## 4. Problem Section (3 paragraphs)

**You're not imagining it.**

Your Flutter app used to feel fast. Somewhere between version 1.3 and the screen you shipped last week, it started to drag. The first run after install has a frame storm. The home tab scrolls like it's underwater on cheap Androids. A user wrote "feels laggy" in a review last month and you closed the tab because it was the third one. Your team knows. You know. Nobody's said it out loud in standup yet.

**And the codebase is louder than the app.**

Adding one feature touches eight files in six folders. The state lives in three different libraries because three different engineers each had a favourite. There's a custom animation in `home_screen.dart` that nobody dares change because the last person who tried broke the splash flow. Tracing a single bug means hopping through five directories and a Slack thread from 2024. Onboarding the new hire took three weeks before they shipped anything — and they were senior.

**You don't need a rewrite. You need someone to read it.**

A rewrite is six months you don't have. Hiring another senior Flutter engineer takes four months and a 30% premium and still doesn't tell you which 50 lines are dragging the whole app down. What you need is a week. One senior outside set of eyes, walking the codebase the way an auditor walks a balance sheet — quietly, methodically, looking for the three things that, if fixed, change the next quarter. That's the audit.

---

## 5. "What the audit gives you" — 5 Outcome Bullets

Phrased as gain, in client language, not engineer-speak.

1. **A ranked fix list short enough to ship this sprint.** Not 80 issues. The 5 to 10 that move the needle, ordered by impact and effort, with the file-and-line where to start.
2. **A frame-by-frame performance report.** Before-and-after frame times for your three worst screens, captured on real devices, with the bottleneck named (rebuild storm, shader compile, expensive paint, jank from main-thread work — whichever it actually is).
3. **A plain-English brief your CFO can read.** Two pages. What's risky, what's costing you velocity, what it'll take to fix. Send it up the chain without translating it.
4. **A 60-minute walkthrough with your team.** I open the report with the engineers actually shipping the code. Questions in real time. Recorded. Your team leaves knowing what to do Monday morning.
5. **A roadmap that survives me leaving.** Notes, diagrams, naming conventions, and the three architectural decisions I'd make next. So the audit pays off long after I'm out of your Slack.

---

## 6. "How it works" — 4-Step Process

**1. You send me your repo.**
GitHub, GitLab, Bitbucket, or a zip. One form, one symptom in your own words ("home screen scrolls badly on mid-tier Android"). NDA available before code changes hands. I reply within 24 hours either confirming we're a fit or telling you exactly why we're not.

**2. I spend 5 working days inside the code.**
Day 1 is reading. Days 2–3 are profiling on real devices — frame timelines, memory, GPU, build graph, dependency map. Day 4 is the fix list. Day 5 is the brief and the deck. I work in your timezone-overlap window, ping you with questions, and don't disappear.

**3. I send the report, then we walk it together.**
You get the deliverables (fix list, perf report, two-page brief, roadmap notes) the morning of the walkthrough call. One hour, your engineers in the room, screen-share through the findings, every question answered. Recorded for whoever couldn't make it.

**4. You ship the fixes. I'm available for two follow-up weeks.**
Two weeks of async email/Slack for clarifications, "did I understand this right" questions, or PR review of the first fixes going in. No upsell, no retainer pitch. If you want me back for round two, you'll ask.

---

## 7. Pricing Reassurance Section

**Fixed price. No surprises. No hourly games.**

The audit is one price, paid in two halves — half on kickoff, half on the walkthrough call. I quote it after I see the repo and the rough size of the codebase, not before. If the audit takes me longer than I planned — and sometimes it does — you don't pay a cent more. I'd rather eat the extra hours than send a surprise invoice. The estimate is my risk. The outcome is what you bought.

What that means in practice:
- One quote. One number. One line on the invoice.
- If I find the problem is bigger than the audit can solve in 5 days, I tell you on Day 2, not Day 5. You can stop the engagement and I refund the unspent portion.
- If after the walkthrough you genuinely don't think it was worth what you paid, tell me. I'll refund the second half. I've never had to. I'd rather lose a fee than have you tell anyone the audit wasn't worth it.

---

## 8. Form / Intake Section

**Section heading**: *Send me your repo.*

**Sub-heading**: *I read every submission. Usually within 24 hours. NDA on request before code changes hands.*

**Field 1**: Your name
- Placeholder: `Alex Chen`

**Field 2**: Work email
- Placeholder: `alex@yourcompany.com`
- Microcopy: *I'll reply from a real address. No marketing list, no drip sequence.*

**Field 3**: Repo or app
- Placeholder: `github.com/yourcompany/your-app  —  or describe it`
- Microcopy: *Public URL, private repo invite, or just tell me what platform stores you're on. We can sort access later.*

**Field 4 (textarea, optional but encouraged)**: What's the one thing hurting most right now?
- Placeholder: `Scrolling is janky on Android. New devs take a month to onboard. Crashes are spiking after the last release. — One symptom in your own words.`
- Microcopy: *One symptom is enough. The audit will find the rest.*

**Submit button text**: `Send →`

**Microcopy under submit**:
*I read every form myself. You'll hear from me within 24 hours — even if the answer is "I'm not the right fit." Your code, your email, and what you write here are not shared, sold, or fed into any AI training set. Ever.*

---

## 9. About the Engineer (bottom of page, framed around client gain)

**The person opening your repo**

I'm a senior Flutter engineer. I've spent the last several years building, debugging, and unsticking Flutter apps in production — from scrolling that drops frames on flagship phones to custom animations that have to look correct on a Pixel 3a. I work in vector_math_64 the way most engineers work in `print()`. I write shaders when the off-the-shelf paint won't render fast enough. I read frame timelines for fun.

What that means for you: when your app feels slow, I can usually tell you *why* in a day — rebuild storm vs. shader compile vs. expensive paint vs. main-thread work vs. image decode vs. layout thrash. The diagnosis is the hard part. The fix is usually small. The audit is just me, your codebase, and the answer.

I take one audit at a time. That's the whole business. No agency, no team, no handoffs, no junior doing the work. If you hire the audit, you get me.

---

## 10. FAQ — 6 Q&A Pairs

**Q: Why an audit instead of just hiring a senior Flutter engineer?**
A: Hiring takes 3–4 months and a salary. The audit takes 5 days and a fee. If after the audit you decide you do need to hire, you'll know exactly what skills the hire needs — which is usually the harder question. The audit is the cheapest way to find out what hiring won't fix.

**Q: We can't share the repo. Is there another way?**
A: Yes. About a third of the audits I do are on screen-share only — your engineer drives, I look, we record. The deliverables are the same. The price is the same. The only thing that's different is who has the keyboard.

**Q: Our app isn't slow. It's just messy. Is the audit still useful?**
A: Yes — maybe more so. Performance audits get the headlines, but architectural audits change quarters. If your team is touching 8 files for a one-field change, you don't have a performance problem, you have a velocity problem. That's the same audit, just with different fix list categories.

**Q: How is this different from running `flutter analyze` or a code quality SaaS?**
A: A linter tells you what's syntactically wrong. The audit tells you what's *strategically* wrong: which architectural choice from 2023 is now costing you a week per release, which custom animation is going to bite you on the next Flutter version, which third of your providers can be deleted. A linter sees code. I see decisions.

**Q: What if you find the problem is too big for a 5-day audit?**
A: I tell you on Day 2, refund the unused portion of the fee, and write up what I've found so far in whatever shape is useful to you. I'd rather end an engagement honestly than overrun an audit that was scoped wrong. It's happened twice. Both clients hired me back.

**Q: Do you do the fixes too?**
A: Usually no. The audit is the product. Most teams find that once they have the fix list, their own engineers ship it faster than I could — and they learn the codebase in a way they couldn't from a handoff. For unusual cases — a custom shader that needs writing, a vector_math rewrite of a gesture system — I do take implementation work, but only after the audit, and only if you ask.

---

## 11. Optional Closing CTA (footer band)

**Heading**: *Still here? Send the repo.*

**Body**: *Or paste a public URL. Or just describe the one thing that's hurting. The audit starts with a sentence.*

**Button**: `Send me your repo →`
