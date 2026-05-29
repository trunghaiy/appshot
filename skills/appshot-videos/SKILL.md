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

## CRITICAL: Phase gates

You MUST complete phases in strict order. NEVER skip ahead. Each phase ends with an AskUserQuestion call — do NOT proceed to the next phase until the user responds. Do NOT combine multiple phases into one response. Never write code until Phase 3.

---

## Phase 1: Extract & confirm

Run extraction from [appshot-core](../appshot-core/SKILL.md). If `appshot-video/.appshot-context.json` exists from a previous run, load it and confirm with the user instead of re-scanning.

After presenting the extraction summary, you MUST call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "Does this extraction look correct? Any details to adjust?",
    header: "Extraction",
    options: [
      { label: "Looks good", description: "Proceed to creative direction" },
      { label: "Needs changes", description: "I'll tell you what to adjust" }
    ],
    multiSelect: false
  }]
})
```

STOP HERE. Do NOT proceed to Phase 2 until the user responds.

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

### Step 3: Output target

Use AskUserQuestion to choose between output targets. Read [Output Targets](../appshot-core/SKILL.md#output-targets) for full rules.

- **App Store Preview (Recommended)** — Full-bleed app screens, no device frames. Text overlays on top of the app UI. Includes navigation chrome (status bar, nav bar, tab bar). Compliant with Apple/Google preview requirements.
- **Marketing** — Device frame (PhoneFrame) with text and cards around it. For social media, website, pitch decks.

Default recommendation: App Store Preview for videos intended for store listings. Marketing for everything else.

### Step 4: Target stores

If the app's platform is `"both"` (has both iOS and Android identifiers), recommend generating for both App Store and Play Store. Use AskUserQuestion:

- **Both App Store + Play Store (Recommended)** — Same scenes, only the navigation chrome style (iOS vs Android) and CTA badge differ. One prompt, two outputs.
- **App Store only** — iOS chrome style, iOS badge.
- **Play Store only** — Android chrome style, Android badge.

If platform is `"ios"` only or `"android"` only, skip this step and target the matching store.

### Step 5: Background music

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

### Step 6: Scene breakdown

| # | Name | Duration | What the viewer sees | Caption | Primitives |
|---|------|----------|---------------------|---------|------------|
| 1 | ... | Xs (N frames) | [description] | "..." | [list] |

**Rules:**
- Total: 15-30 seconds (under 25s ideal). Each scene: 3-6 seconds.
- Every scene has a Caption.
- Content must mock THIS app's actual screens from extraction. No generic UI.
- **App Store Preview target:** Every mock screen must include navigation chrome (status bar, nav bar, tab bar) from the extracted `navigation` data. Screens should look like real screenshots, not isolated UI fragments. No PhoneFrame.
- **Marketing target:** PhoneFrame wraps the mock screen. Navigation chrome inside the phone is nice-to-have.
- Final scene: CTA with app icon + tagline + store badge.

### Step 7: Draft all copy

Read [copy-principles.md](../shared/copy-principles.md) first.

**Self-check:**
- [ ] Each caption under 8 words
- [ ] Benefit-first, not feature-first
- [ ] At least one caption includes a specific number or time
- [ ] CTA tagline: setup + differentiator (highlight in brand color)
- [ ] Pills are benefits, not feature names
- [ ] No text copied from BookStreak, Kernio, or any example
- [ ] Captions read as a coherent story top-to-bottom
- [ ] Captions collectively cover at least 3 extracted ASO keywords (naturally, not stuffed)
- [ ] Keywords spread across scenes, not clustered in one caption

### Present the full plan

```
**Output target:** [App Store Preview / Marketing]
**Angle:** [angle] — [reason]
**Theme:** [light/dark]
**Music:** [track name]
**Target stores:** [App Store / Play Store / App Store + Play Store]

| # | Name | Duration | Visuals | Caption |
|---|------|----------|---------|---------|
| 1 | ... | Xs | ... | "..." |

**CTA:** "[setup]" + "[differentiator]"
**Pills:** ["...", "..."]

**ASO keywords covered:** [keyword1] (S1), [keyword2] (S2), [keyword3] (S3 + CTA) — [N of M keywords]

**Narrative flow:**
1. "..."
2. "..."

Approve or change?
```

After presenting the full plan, you MUST call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "Does this creative plan look good?",
    header: "Plan",
    options: [
      { label: "Approved", description: "Proceed to code generation" },
      { label: "Change angle", description: "I want a different narrative approach" },
      { label: "Change scenes", description: "I want to adjust the scene breakdown" },
      { label: "Change copy", description: "I want to revise the captions" }
    ],
    multiSelect: false
  }]
})
```

STOP HERE. Do NOT proceed to Phase 3 until the user approves.

---

## Phase 3: Generate code

**Read [code-guide.md](references/code-guide.md) before writing any code.** It contains scaffolding instructions, code templates with CORRECT/WRONG examples for every known pitfall, and the post-write self-check.

Key points (details in code-guide):
- Scaffold `appshot-video/` inside the target project, never in appshot template
- Canvas: 886×1920px (App Store native)
- **App Store Preview target:** No PhoneFrame. Full-bleed app UI with navigation chrome (status bar, nav bar, tab bar). Text overlays on top. See code-guide section 5.
- **Marketing target:** PhoneFrame `scale={1.5}`, text outside phone: 24px+ body, 34px+ titles
- Scene 1: visible content at frame 0 (no TypeWriter first, no delayed springs)
- Orchestrator: `fadeIn={!isFirst} fadeOut={!isLast}` on SceneWrap
- Never `staticFile()` on AppIcon src
- Multi-store: Root.tsx registers one `<Composition>` per target store. Orchestrator receives `device` as a prop. See store-to-device mapping in appshot-core.
- CTA scene: `AppStoreBadge platform` must match the target store (`"ios"` for App Store, `"android"` for Play Store)
- Remove unused imports

**Existing projects:** If an `appshot-video/` directory already exists with a single composition, do not add multi-store compositions unless the user explicitly requests both stores.

---

## Phase 4: Preview & iterate

Start Remotion Studio for preview:

1. Launch in background: `cd appshot-video && npm run dev &` — capture the PID
2. Wait for server ready (poll `localhost:3000` for a 200 response, max 30s)
3. Open the preview and check:
   - Frame 0: content visible (not black)?
   - Text readable at playback speed?
   - Each scene looks like THIS app?
   - CTA badge visible 2+ seconds?
   - Pacing: rushed or draggy?
   - Any contrast issues?
4. Iterate with user until approved
5. **Before proceeding to Phase 5:** kill the dev server process (`kill $PID`). Fallback if PID lost: `lsof -ti:3000 | xargs kill 2>/dev/null`. Verify the port is free before starting render.

---

## Phase 5: Render & deliver

After the user approves the preview, render the final video(s). Run `npx remotion render` for each target store composition:

```bash
cd appshot-video && npx remotion render [CompositionId] out/[CompositionId].mp4 --codec h264 --crf 18 --pixel-format yuv420p --color-space bt709
```

For example, if targeting both stores for an app called BookStreak:
```bash
cd appshot-video && npx remotion render BookStreakPreview-AppStore out/BookStreakPreview-AppStore.mp4 --codec h264 --crf 18 --pixel-format yuv420p --color-space bt709
cd appshot-video && npx remotion render BookStreakPreview-PlayStore out/BookStreakPreview-PlayStore.mp4 --codec h264 --crf 18 --pixel-format yuv420p --color-space bt709
```

After render completes, report the absolute path to each output file:
```
✓ App Store video: /path/to/project/appshot-video/out/BookStreakPreview-AppStore.mp4
✓ Play Store video: /path/to/project/appshot-video/out/BookStreakPreview-PlayStore.mp4
```

Do not ask the user to run build commands manually.

---

## Quick mode

If `--quick`: make all creative decisions autonomously. Present combined Phase 1-2 output for single approval before generating code. Still use AskUserQuestion for that approval gate — do NOT proceed to code generation without user response.

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
