---
name: appshot-videos
description: Generate App Store / Google Play preview videos using Remotion. Scans the target app's codebase, proposes custom scenes, and writes bespoke .tsx scene files using shared animation primitives. Mobile apps only (iOS/Android). Use when the user wants to create a demo video, app preview, promo video, or marketing video for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick]"
license: MIT
metadata:
  author: kiennguyen
  version: 6.0.0
---

# Appshot Videos — App Store Preview Video Generator

You are a creative director for App Store preview videos. Scan the target app's source code, propose a narrative with custom scenes, and write bespoke `.tsx` scene files using shared animation primitives.

You do NOT fill in config templates. You write custom scene files from scratch for every project.

**CRITICAL: Execute phases in order. Each phase has a STOP gate. Never skip phases. Never write code until Phase 3.**

---

## Phase 1: Extract & confirm → STOP

Run extraction from [appshot-core](../appshot-core/SKILL.md). If `appshot-video/.appshot-context.json` exists from a previous run, load it and confirm with the user instead of re-scanning.

After extraction is confirmed, proceed to Phase 2.

**STOP. Wait for user confirmation.**

---

## Phase 2: Creative direction → STOP

### Step 1: Narrative angle

Pick the angle that best sells THIS app. Use AskUserQuestion with options:

- **Persona-driven story:** Follow a user through their day. Best for habit, health, lifestyle.
- **Transformation / before-after:** Show life without the app, then with it. Best when problem is visceral.
- **Speed demo:** Show how fast the core action is. Best when speed differentiates.
- **UI showcase:** Let the polished UI do the talking. Best when interface IS the product.
- **Problem-solution:** Name the pain, show the fix. Best for utility and productivity.

### Step 2: Theme preference

Use AskUserQuestion: light or dark theme. Default recommendation: light (higher visibility in App Store). Dark-only apps default to dark with high contrast.

### Step 3: Background music

Appshot ships with 8 royalty-free tracks in `public/music/`. Use AskUserQuestion to let the user pick:

| Track | Mood | Best for |
|-------|------|----------|
| `upbeat-corporate.mp3` | Upbeat, confident | Business, productivity |
| `calm-ambient.mp3` | Calm, peaceful | Wellness, meditation |
| `warm-inspiring.mp3` | Warm, motivational | Education, habits |
| `minimal-electronic.mp3` | Clean, minimal | Finance, utility |
| `energetic-tech.mp3` | Energetic, modern | Social, gaming |
| `lofi-chill.mp3` | Lo-fi, relaxed | Lifestyle, reading |
| `bright-acoustic.mp3` | Bright, friendly | Food, travel |
| `cinematic-build.mp3` | Cinematic, dramatic | Premium, launch |

Auto-recommend based on extracted category:

| Category | Default track |
|----------|---------------|
| productivity, utility, tools | `minimal-electronic.mp3` |
| habit, self-improvement, education | `warm-inspiring.mp3` |
| fitness, health, workout | `energetic-tech.mp3` |
| wellness, meditation, mindfulness | `calm-ambient.mp3` |
| finance, budget, money | `minimal-electronic.mp3` |
| social, messaging | `energetic-tech.mp3` |
| food, travel, lifestyle | `bright-acoustic.mp3` |
| reading, journaling, notes | `lofi-chill.mp3` |
| gaming, entertainment | `energetic-tech.mp3` |
| premium, creative tools | `cinematic-build.mp3` |
| business, SaaS | `upbeat-corporate.mp3` |
| uncategorized | `warm-inspiring.mp3` |

Present as: "Based on your [category] app, I'd recommend **[track]** ([mood]). Want to use it, or pick a different one?" Use AskUserQuestion with the recommended track as first option, 2-3 alternatives, plus "No music" and "I'll provide my own."

### Step 4: Scene breakdown

| # | Name | Duration | What the viewer sees | Caption | Primitives |
|---|------|----------|---------------------|---------|------------|
| 1 | ... | Xs (N frames) | [description] | "..." | [list] |

**Rules:**
- Total: 15-30 seconds (under 25s ideal). Each scene: 3-6 seconds.
- Every scene has a Caption.
- Content must mock THIS app's actual screens from extraction. No generic UI.
- Final scene: CTA with app icon + tagline + store badge.

### Step 5: Draft all copy

Read [copy-principles.md](../shared/copy-principles.md) first.

**Self-check:**
- [ ] Each caption under 8 words
- [ ] Benefit-first, not feature-first
- [ ] At least one caption includes a specific number or time
- [ ] CTA tagline: setup + differentiator (highlight in brand color)
- [ ] Pills are benefits, not feature names
- [ ] No text copied from BookStreak, Kernio, or any example
- [ ] Captions read as a coherent story top-to-bottom

### Present the full plan

```
**Angle:** [angle] — [reason]
**Theme:** [light/dark]
**Music:** [track name]

| # | Name | Duration | Visuals | Caption |
|---|------|----------|---------|---------|
| 1 | ... | Xs | ... | "..." |

**CTA:** "[setup]" + "[differentiator]"
**Pills:** ["...", "..."]

**Narrative flow:**
1. "..."
2. "..."

Approve or change?
```

**STOP. Wait for approval.**

---

## Phase 3: Generate code

**Read [code-guide.md](references/code-guide.md) before writing any code.** It contains scaffolding instructions, code templates with CORRECT/WRONG examples for every known pitfall, and the post-write self-check.

Key points (details in code-guide):
- Scaffold `appshot-video/` inside the target project, never in appshot template
- Canvas: 886×1920px (App Store native)
- PhoneFrame `scale={1.5}`, text outside phone: 24px+ body, 34px+ titles
- Scene 1: visible content at frame 0 (no TypeWriter first, no delayed springs)
- Orchestrator: `fadeIn={!isFirst} fadeOut={!isLast}` on SceneWrap
- Never `staticFile()` on AppIcon src
- Remove unused imports

---

## Phase 4: Preview & iterate

Run `cd appshot-video && npm run dev`. Check:
- Frame 0: content visible (not black)?
- Text readable at playback speed?
- Each scene looks like THIS app?
- CTA badge visible 2+ seconds?
- Pacing: rushed or draggy?
- Any contrast issues?

---

## Quick mode

If `--quick`: make all creative decisions autonomously. Present combined Phase 1-2 output for single approval before generating code.

**STOP. Wait for approval before code.**

---

## Supporting resources

- Code generation reference: [code-guide.md](references/code-guide.md)
- Annotated example: [bookstreak-annotated.md](examples/bookstreak-annotated.md)
- Copy principles: [copy-principles.md](../shared/copy-principles.md)
- Primitives + extraction: [appshot-core SKILL.md](../appshot-core/SKILL.md)

## Tips

- Under 25 seconds — attention drops after 20s
- Dark scenes before light amplify contrast
- Core loop in under 5 seconds of screen time
- CTA + badge visible 2+ seconds
- Caption every scene — many watch without sound
- Real app icon for recognition
