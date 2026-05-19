# BookStreak — Annotated Creative Walkthrough

> **WARNING: This shows reasoning for ONE specific app (BookStreak). Do not copy these specific scenes, layouts, copy, or data values. Use this to understand the creative REASONING process, then apply that process to generate completely different scenes for your target app.**
>
> The value of this document is in the WHY behind each decision — not the WHAT. Your target app has different screens, different features, different users, and needs a completely different video. Study the thinking pattern, then throw away all the specifics.

Explains the WHY behind every creative choice in `../../examples/bookstreak/app-config.ts`. Use this to understand reasoning, not as a template to copy.

## Overall Strategy

**Category:** Habit tracking (reading)
**Arc:** Transformation (pain → feature → social-proof → speed → CTA)
**Why Transformation:** BookStreak sells identity change ("become a reader"), not features. The emotional payoff of the milestone timeline needs to land before the practical "5 seconds" speed demo. Speed matters more once the viewer already wants the outcome.

**Total duration:** 660 frames = 22 seconds. Under the 30-second limit with room to breathe.

## Scene 1: pain-point (120 frames = 4s)

```
caption: "Every other app does this."
headline: "Daily Streak"
items: 14 filled + 1 empty
counter: 14 → 0, label: "Days"
```

**"Every other app does this."** — The word "every" triggers recognition across Duolingo, Headspace, gym apps. Positions BookStreak against an entire category. 6 words — passes billboard test.

**"Daily Streak" headline** — Generic on purpose. This is the competitor's world. The genericness reinforces "every other app."

**14 filled + 1 empty:** Two weeks of effort, destroyed by one miss. 14 is round enough to process instantly, large enough to feel like real investment.

**Counter 14 → 0:** Not 14 → 13 (small loss). 14 → 0 (total loss). Maximum emotional impact while the card cracks.

## Scene 2: feature-showcase (120 frames = 4s)

```
caption: "BookStreak keeps your streak alive."
cards: [identity card with "12-week streak", weekly view with 5/7 days active]
```

**"BookStreak keeps your streak alive."** — First app name mention. Directly answers the pain: streak was just destroyed, now BookStreak "keeps it alive." Warm branded colors replace cold navy — intentional contrast.

**Card 1 — "You're becoming a consistent reader":** Identity statement, not feature description. "Becoming" implies a journey. Aligns with identity-based habits (James Clear).

**Card 2 — Weekly view 5/7 active:** Deliberately shows missed days (Wed, Sat) while maintaining the streak. This IS the product promise rendered as UI: you can miss days and still be consistent.

**"12-week streak" highlight:** ~3 months. Aspirational but achievable. Maps to the social-proof timeline for narrative consistency.

## Scene 3: social-proof (180 frames = 6s)

```
caption: "Watch yourself become a reader."
stat: "Top 12% of BookStreak readers"
timeline: Week 1 "Curious Reader" → Week 4 "Habit Builder" → Week 12 "Consistent Reader"
```

**Longest scene (6s):** Heatmap draws cell-by-cell, stat scales in, timeline progress bar fills. Most visually dense — needs time.

**"Top 12%":** Not "Top 1%" (unbelievable) or "Top 50%" (unimpressive). 12% feels specific and earned. Odd-ish numbers feel more data-driven than round ones.

**Week 1/4/12 milestones:** Maps to habit research — ~21 days to form (Week 3-4), ~66 days to automate (Week 9-10). Simplified into a clean progression.

**Identity labels:** "Curious Reader" → "Habit Builder" → "Consistent Reader." Each is an identity, not an achievement. The app sees you as a person evolving.

## Scene 4: speed-demo (120 frames = 4s)

```
caption: "Log any book in 5 seconds."
steps: [{ label: "Current page", value: "243", typeFrames: [18, 22, 26] }]
successMessage: "Page 243 saved!"
```

**"Log any book in 5 seconds."** — Specific claim, then visually proven by the animation.

**Single step, 3 characters:** Type "243" → tap Save → toast. As minimal as possible while showing a complete action. More steps would undermine the "5 seconds" claim.

**typeFrames [18, 22, 26]:** Characters at 0.6s, 0.73s, 0.87s. The ~130ms gap feels like natural thumb-typing — not robotic, not sluggish.

**"Page 243 saved!"** — Echoes the input for continuity. Exclamation = micro-celebration.

## Scene 5: call-to-action (120 frames = 4s)

```
caption: "Free to start. Your streak is waiting."
tagline: "Build a reading habit" + highlight: "that survives missed days."
pills: ["Flexible Streaks", "Compassionate Recovery"]
```

**"Free to start. Your streak is waiting."** — Two sentences, two jobs. "Free" removes price friction. "Your streak is waiting" creates gentle urgency + personalization. "Streak" echoes scene 1 — narrative closure.

**Tagline formula in action:** "Build a reading habit" = category (generic). "that survives missed days" = differentiator (specific). The highlight directly answers the pain from scene 1.

**Pills:** Benefits, not features. "Flexible Streaks" names what the weekly view showed. "Compassionate Recovery" names the emotional angle. Neither is a feature name in the codebase — they're marketing language mapping to product behavior. Two pills, not three — cleaner.

## Brand Colors

```
primary: "#E67E22"     — Warm orange: energetic, friendly, not corporate
background: "#FAFAF8"  — Off-white, warm: not clinical
danger: "#E74C3C"      — Red for pain-point only
```

Warm palette supports the "compassionate" brand. Orange is friendly — doesn't feel punishing (unlike red) or cold (unlike blue). Pain-point uses hardcoded dark navy + danger red for maximum contrast with the branded scenes that follow.
