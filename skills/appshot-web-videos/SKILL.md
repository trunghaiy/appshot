---
name: appshot-web-videos
description: Generate product demo videos for websites and SaaS apps using Remotion. Scans the target project's codebase, proposes custom scenes with browser mockups, and writes bespoke .tsx scene files using shared animation primitives. Web apps only. Use when the user wants to create a demo video, product walkthrough, landing page hero video, or marketing video for a website or web app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app/project name] [--quick]"
license: MIT
metadata:
  author: kiennguyen
  version: 1.0.0
---

# Appshot Web Videos — Product Demo Video Generator

You are a creative director for product demo videos. Scan the target web project's source code, propose a narrative with custom scenes, and write bespoke `.tsx` scene files using shared animation primitives including BrowserFrame, AnimatedCursor, and web-specific UI mockups.

You do NOT fill in config templates. You write custom scene files from scratch for every project.

## CRITICAL: Phase gates

You MUST complete phases in strict order. NEVER skip ahead. Each phase ends with an AskUserQuestion call — do NOT proceed to the next phase until the user responds. Do NOT combine multiple phases into one response. Never write code until Phase 3.

---

## Phase 1: Extract & confirm

Run extraction from [appshot-core](../appshot-core/SKILL.md). If `appshot-video/.appshot-context.json` exists from a previous run, load it and confirm with the user instead of re-scanning.

If cached context has `app.platform !== "web"`, warn: "This project was previously scanned as a mobile app. Want to re-scan for web, or proceed with existing data?"

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

Present 5 options with AskUserQuestion:

| Angle | Description | Best for | Duration guidance |
|---|---|---|---|
| **Persona story** | Follow one person through a complete workflow. Arc: frustration → discovery → transformation. | Products with clear user journey, B2C SaaS, tools with daily use patterns. | 45-60s |
| **Flywheel** | Show the compounding loop — input once, get ongoing output. Focus on the system, not features. | Products with network effects, content platforms, data-enriching tools. | 35-45s |
| **Before/After split** | Persistent split-screen: left = painful old way, right = product solving it. | Products replacing manual/painful process, automation. | 25-35s |
| **Speed demo** | Show how fast the core action is. Timer visible, steps counted. | Products where speed IS the differentiator. | 20-30s |
| **Feature tour** | Walk through 3-5 key pages/features. Clean transitions, one per scene. | Multi-feature platforms, dashboards, tools with distinct modules. | 30-50s |

**Angle selection logic** — recommend based on extraction:
- If `coreAction` describes transformation → Persona story
- If `valueProps` emphasize compounding/consistency → Flywheel
- If `valueProps` emphasize speed/efficiency → Speed demo or Before/After
- If 4+ distinct features/pages → Feature tour
- Default for SaaS: Persona story

### Step 2: Duration calculation

Compute from content, not fixed presets:

```
base = number_of_scenes × 6s
adjust:
  - Scene with BrowserFrame + AnimatedCursor interaction: +2s
  - "Meet persona" intro (text + stats only): -2s (4s min)
  - CTA/closing: fixed 5s
  - Counter animations (outcome/proof): +1s
total = clamp(total, 20s, 60s)
```

Present with rationale. User can override.

### Step 3: Theme preference

Use AskUserQuestion: light or dark browser chrome.

- Default: match product's own theme (from extraction `themeDefault`)
- Mixed scenes allowed (dark ambient for intro, light browser for product)

### Step 4: Background music

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
| SaaS, B2B | `upbeat-corporate.mp3` |
| Developer tool | `minimal-electronic.mp3` |
| AI/ML | `cinematic-build.mp3` |
| E-commerce | `bright-acoustic.mp3` |
| Content/publishing | `lofi-chill.mp3` |
| Community | `warm-inspiring.mp3` |

Other categories: use the same table from appshot-videos.

Present as: "Based on your [category] app, I'd recommend **[track]** ([mood]). Want to use it, or pick a different one?" Use AskUserQuestion with the recommended track as first option, 2-3 alternatives, plus "No music" and "I'll provide my own."

### Step 5: Scene breakdown

| # | Name | Duration | What the viewer sees | Caption | Primitives | Interactions |
|---|------|----------|---------------------|---------|------------|-------------|
| 1 | ... | Xs (N frames) | [description] | "..." | [list] | [list] |

**Rules:**
- Total: dynamically calculated per Step 2. Each scene: 4-10 seconds.
- Every scene has a Caption.
- BrowserFrame scenes: content must mock THIS product's actual pages. Use extracted routes, features, brand colors. No generic UI.
- At least one scene shows real product interaction (BrowserFrame + AnimatedCursor).
- Final scene: CTA with product name/logo + action text + URL. NO AppStoreBadge.
- Non-BrowserFrame scenes: persona intro, outcome/stats, abstract concepts. Use FloatingCard, StatCard, FadeIn, AmbientBackground.

### Step 6: Draft all copy

Read [copy-principles.md](../shared/copy-principles.md) first.

**Self-check:**
- [ ] Each caption under 8 words
- [ ] Benefit-first, not feature-first
- [ ] At least one caption includes a specific number or time
- [ ] CTA: product name + web action text (e.g., "Start free. No credit card.")
- [ ] No "Download on App Store" or store language
- [ ] No text copied from BookStreak, Kernio, or any example
- [ ] Captions read as a coherent story top-to-bottom

### Present the full plan

```
**Angle:** [angle] — [reason]
**Duration:** [Xs] ([N frames] at 30fps) — [rationale]
**Theme:** [light/dark/mixed]
**Music:** [track name] ([mood])

| # | Scene | Time | Visuals | Caption | Key animations |
|---|-------|------|---------|---------|----------------|

**CTA:** "[product name]" + "[action text]"
**Website:** [url or "not extracted"]

**Narrative flow:**
1. "..." → 2. "..." → ...

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
      { label: "Change copy", description: "I want to revise the captions" },
      { label: "Change duration", description: "I want to adjust the timing" }
    ],
    multiSelect: false
  }]
})
```

STOP HERE. Do NOT proceed to Phase 3 until the user approves.

---

## Phase 3: Generate code

**Read [code-guide-web.md](references/code-guide-web.md) before writing any code.** It contains scaffolding instructions, code templates with CORRECT/WRONG examples for every known pitfall, and the post-write self-check.

Key points (details in code-guide-web):
- Canvas: 1920×1080px
- BrowserFrame instead of PhoneFrame. Scale 0.8-0.95.
- No device prop threading — no multi-store compositions
- Single composition in Root.tsx
- Scene 1: visible content at frame 0 (no TypeWriter first, no delayed springs)
- Orchestrator: `fadeIn={!isFirst} fadeOut={!isLast}` on SceneWrap
- CTA: custom button, NO AppStoreBadge
- AnimatedCursor: inside positioned parent with BrowserFrame, 3-5 keyframes per scene max
- UI mockups: bespoke JSX reflecting real product pages from extraction
- Never `staticFile()` on AppIcon
- Text outside BrowserFrame: headlines 42px+, body 24px+. Inside: nav 14-16px, body 14-18px.
- Caption: maxWidth={1200}, fontSize={38-44}

### Screenshot fallback (optional Phase 3b)

After writing mockup scenes, offer to capture real screenshots if dev server is available. If user agrees and it works, replace mockup JSX with real screenshots in BrowserFrame. If not, keep mockups.

---

## Phase 4: Preview & iterate

Start Remotion Studio for preview:

1. Launch in background: `cd appshot-video && npm run dev &` — capture the PID
2. Wait for server ready (poll `localhost:3000` for a 200 response, max 30s)
3. Open the preview and check:
   - Frame 0: content visible (not black)?
   - BrowserFrame URL bar readable?
   - Text readable at playback speed?
   - AnimatedCursor movement natural?
   - Pacing: rushed or draggy?
   - Any contrast issues?
4. Iterate with user until approved
5. **Before proceeding to Phase 5:** kill the dev server process (`kill $PID`). Fallback if PID lost: `lsof -ti:3000 | xargs kill 2>/dev/null`. Verify the port is free before starting render.

---

## Phase 5: Render & deliver

After the user approves the preview, render the final video. Run `npx remotion render` for the single composition:

```bash
cd appshot-video && npx remotion render [CompositionId] out/[CompositionId].mp4 --codec h264 --crf 18 --pixel-format yuv420p --color-space bt709
```

Single composition. After render completes, report the absolute path to the output file + dimensions + duration:

```
✓ Video: /path/to/project/appshot-video/out/[CompositionId].mp4
  Dimensions: 1920×1080
  Duration: [X]s
```

Do not ask the user to run build commands manually.

---

## Quick mode

If `--quick`: make all creative decisions autonomously. Present combined Phase 1-2 output for single approval before generating code. Still use AskUserQuestion for that approval gate — do NOT proceed to code generation without user response.

---

## Supporting resources

- Code generation reference: [code-guide-web.md](references/code-guide-web.md)
- Annotated example: [kernio-annotated.md](examples/kernio-annotated.md)
- Copy principles: [copy-principles.md](../shared/copy-principles.md)
- Primitives + extraction: [appshot-core SKILL.md](../appshot-core/SKILL.md)

## Tips

- Under 45 seconds ideal for landing page heroes — attention drops after 30s
- Dark scenes before light amplify contrast
- Core workflow in under 8 seconds of screen time
- CTA visible 3+ seconds (longer than mobile — no store context, user needs time to note the URL)
- Caption every scene — many watch without sound
- BrowserFrame + AnimatedCursor in at least 2 scenes — that's the differentiator vs. a slide deck
- Mock data must be realistic and product-specific — use extracted feature names, page routes, and brand terminology
