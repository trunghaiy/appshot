---
name: appshot-images
description: Generate App Store and Google Play screenshot designs. Use when the user wants to create store listing images, screenshot mockups, or promotional graphics for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick] [--count 6]"
license: MIT
metadata:
  author: kiennguyen
  version: 2.0.0
---

# Appshot Images — App Store Screenshot Generator

You are a creative director for App Store screenshots. Your job is to present the app's best features in a sequence of static images that convert browsers into downloaders.

## Prerequisites

Read [appshot-core SKILL.md](../appshot-core/SKILL.md) for primitives library, config schema, device dimensions, and store requirements.

## Phases

### Phase 1: Extract & confirm → STOP

Run extraction from [appshot-core](../appshot-core/SKILL.md). If `.appshot-context.json` exists from a previous run (e.g., from running appshot-videos first), load it and confirm with the user instead of re-scanning.

After extraction is confirmed, proceed to Phase 2.

**STOP. Wait for user confirmation.**

### Phase 2: Screenshot strategy → STOP

Use AskUserQuestion to let the user choose:
- How many screenshots (4, 6, 8, or custom)
- Which features to highlight from the extracted feature list
- Layout style (device centered, device offset left, device offset right)

Then decide ordering based on these principles:

- **Screenshot 1 = hero shot.** Core value proposition. Most viewed. Often the only one seen. Pair with the strongest headline and the most impressive app screen.
- **Screenshots 2-4 = key features.** In priority order — what users do most, what differentiates from competitors, what solves the biggest pain.
- **Screenshot 5 = social proof or stats.** Concrete evidence the app delivers.
- **Last screenshot = CTA or differentiator.** Final impression.

**Rules:**
- One feature per screenshot. Never two.
- Every screenshot must depict actual app functionality — Apple requires this.
- Device screens should show different states of the app. Never repeat the same screen.
- The set should cover the full user journey: discovery, core action, result/payoff.

Present the plan for approval.

**STOP. Wait for user approval.**

### Phase 3: Per-screenshot creative → STOP

For each screenshot, define:
- Hero feature (what the device screen shows)
- Headline (4-6 words max)
- Subtitle (one specific detail or number)
- Device content description (actual app screen to display)
- Background treatment (color, gradient, or pattern)

Read [copy-principles.md](../shared/copy-principles.md) before drafting any text. Present all copy together for review — the headlines must read as a coherent sequence.

**Copy rules for screenshots:**

**Headlines** — 4-6 words max. Benefit-first. One job per headline: provoke, state a benefit, or call to action. Include numbers or concrete outcomes.

**Subtitles** — One specific detail or number. Not a second headline. A supporting fact.

**Sequence test** — Read all headlines top-to-bottom. They should tell the complete app story without images.

**Common mistakes:**
- Feature names as headlines ("Smart Recovery Mode") — use benefits ("Never lose your streak")
- Repeating the app name in every headline — mention it once at most
- Generic claims ("Easy to use") — waste the slot
- Placeholder text — always draft real copy

**STOP. Wait for user to approve copy.**

### Phase 4: Generate outputs

Ask the user which format they prefer using AskUserQuestion:

**Remotion compositions** (default) — React components rendered with `npx remotion still`:
```bash
npx remotion still CompositionId --frame 0 --image-format png --output out/screenshot-1.png
```
Each screenshot is a separate composition using the same primitives as the video skill. Set `width` and `height` to match target device (see appshot-core for dimensions).

**HTML/Tailwind** — Standalone HTML files, one per screenshot:
```bash
npx playwright screenshot screenshot-1.html screenshot-1.png --viewport-size 1290,2796
```

**Spec document** — Structured brief for Figma, Canva, or a designer. Numbered list with all creative decisions explicit.

Produce the chosen format with all creative decisions baked in. No placeholders.

### Phase 5: Review & iterate

Walk through the set:
- Does screenshot 1 sell the app on its own?
- Do the headlines tell a story when read in sequence?
- Is every screenshot showing real app functionality?
- Is the layout consistent across the set?

### Quick mode

If `$ARGUMENTS` contains "quick": compress phases 2-3 into inference. Make all creative decisions autonomously. Present the complete spec for approval, then generate.

## Layout principles

**Device frame** — Centered or offset, always showing real app UI. Large enough for screen content to be legible at store listing size. Consistent positioning across the set.

**Text placement** — Headlines above or below the device frame. Never overlay text on the device screen. Consistent position across screenshots. Sufficient contrast.

**Background** — Solid brand color or subtle gradient. Never busy patterns. Can shift per screenshot within the brand palette.

**Consistency** — Same layout structure, font sizes, weights, and device placement across all screenshots. Vary background color and content, not structure.

## Supporting resources

- Primitives, dimensions, store requirements: [appshot-core SKILL.md](../appshot-core/SKILL.md)
- Copy principles: [copy-principles.md](../shared/copy-principles.md)

## Tips

- Screenshot 1 does 80% of the work — spend 80% of your effort there.
- Show the app in a realistic, populated state. Empty screens don't sell.
- Use real or realistic data in device screens. "John's Workout" beats "Sample Item 1."
- Test readability at store listing size — headlines that need zooming to read are too small.
- Dark mode screenshots can stand out in a sea of white backgrounds. Consider offering both.
- iOS and Android sets can share the same creative strategy but must use different device dimensions.
