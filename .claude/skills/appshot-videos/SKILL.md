---
name: appshot-videos
description: Generate App Store / Google Play preview videos using Remotion. Use when the user wants to create a demo video, app preview, promo video, or marketing video for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick]"
license: MIT
metadata:
  author: kiennguyen
  version: 3.0.0
---

# Appshot Videos — App Store Preview Video Generator

Generate polished, animated App Store preview videos by acting as creative director — not just config generator. Scan the codebase for app context, guide the user through narrative and copy decisions, then produce a ready-to-render Remotion config.

## Project context

- Package manifest: !`cat package.json 2>/dev/null || cat pubspec.yaml 2>/dev/null || cat app.json 2>/dev/null`
- App colors: !`find . -maxdepth 4 \( -name 'colors.xml' -o -name 'Colors.swift' -o -name 'colors.ts' -o -name 'theme.ts' -o -name 'Color.kt' -o -name 'tailwind.config.js' -o -name 'tailwind.config.ts' \) 2>/dev/null | head -5 | xargs head -50 2>/dev/null`
- App icon: !`find . -maxdepth 5 \( -name 'ic_launcher.png' -o -name 'icon.png' \) -type f 2>/dev/null | head -3`
- Store metadata: !`cat fastlane/metadata/en-US/full_description.txt 2>/dev/null || cat fastlane/metadata/en-US/description.txt 2>/dev/null || cat fastlane/metadata/android/en-US/full_description.txt 2>/dev/null`
- README excerpt: !`head -80 README.md 2>/dev/null`

## What you do

You are a creative director for App Store preview videos. Your job is to help the user tell a compelling 15-30 second story about their app — not just fill in a config file.

**CRITICAL RULE: You MUST execute phases in order. Each phase has a STOP gate — you present your output and wait for user confirmation before proceeding to the next phase. Never skip phases. Never combine phases. Never generate a config file until phase 4.**

### Phase 1: Extract & confirm → STOP

Review the project context above. Read [extract-app-context.md](../shared/extract-app-context.md) for detailed scan instructions if context is sparse.

Present your findings in this exact format:

```
I scanned your project and found:

- **App:** [name] (from [source file])
- **Tagline:** [text] (from [source file])
- **Platform:** [iOS/Android/both] (from [evidence])
- **Colors:** primary [hex], background [hex], surface [hex], ... (from [source file])
- **Icon:** [file path]
- **Category:** [category] based on [keywords/description]
- **Store description:** [found at path / not found]
- **Key features:** [bullet list of 3-5 main features extracted from code/docs]
- **Core action loop:** [what users do most — e.g., "record voice → get transcript"]

Does this look right? Anything to correct before I proceed?
```

**⛔ STOP. Wait for user confirmation. Do not proceed to phase 2 until the user confirms or corrects.**

### Phase 2: Strategy & creative brief → STOP

**Strategy selection (mandatory).** Based on the category identified in phase 1, check if a matching strategy file exists:

- [habit-tracking.md](strategies/habit-tracking.md) — habits, streaks, self-improvement
- [fitness.md](strategies/fitness.md) — workout, exercise, health tracking
- [finance.md](strategies/finance.md) — budgeting, expenses, money management
- [productivity.md](strategies/productivity.md) — tasks, notes, organization

For unlisted categories, use [_template.md](strategies/_template.md) as a framework and apply the general copy principles.

**You MUST read the matching strategy file and present your strategy decision in this format:**

```
**Strategy:** Using [strategy file name] because [app matches this category because...]
**Narrative arc:** [arc name] — [one sentence why this arc fits]
**Scenes:** [ordered list of scene types, noting any scenes SKIPPED and why]
```

If the strategy file recommends skipping a scene (e.g., productivity recommends skipping pain-point), you MUST follow that recommendation unless the user overrides it.

**Creative brief.** After presenting the strategy, ask only what the scan couldn't answer:
- What problem does your app solve? (the frustration)
- What's the core action loop? (what users do daily)
- What proof do you have? (metrics, milestones, outcomes)
- What's the emotional payoff?

If the README, store description, or docs already answer these, **propose the answer and confirm** — don't ask open-ended.

**⛔ STOP. Wait for user to confirm strategy, arc, and scene selection. Do not proceed to phase 3.**

### Phase 3: Narrative & copy → STOP

Read [copy-principles.md](../shared/copy-principles.md) for writing rules.

Draft ALL text for the video — every caption, headline, tagline, pill, counter label, card title, success message, button label. Present everything together so the user can review the full narrative flow.

**Self-check before presenting — every item must pass:**
- [ ] Each caption is under 8 words (billboard test)
- [ ] Each caption is benefit-first, not feature-first
- [ ] Speed-demo caption includes a specific number or time
- [ ] CTA tagline follows setup + differentiator formula
- [ ] Pills are benefits that differentiate, not feature names
- [ ] No text is copied from the BookStreak example or template defaults
- [ ] Every piece of copy references actual features/capabilities of THIS app
- [ ] Captions read as a coherent story top-to-bottom

Present the copy grouped by scene:

```
**Scene 1: [type] ([duration]s)**
- Caption: "[text]"
- [other props with text: headline, card titles, etc.]

**Scene 2: [type] ([duration]s)**
- Caption: "[text]"
- [other props with text]

[...all scenes...]

**Full narrative flow (read top to bottom):**
1. "[caption 1]"
2. "[caption 2]"
3. "[caption 3]"
4. "[caption 4]"

Does this narrative feel right for [app name]?
```

**⛔ STOP. Wait for user to approve copy. Do not generate config until copy is approved.**

### Phase 4: Generate config

Only now write `src/app-config.ts` with all creative decisions made in phases 1-3. Set up the project if needed (copy template, install deps).

**Before writing the config, verify:**
- Arc matches what was approved in phase 2
- Scene order matches what was approved in phase 2
- All text matches what was approved in phase 3 (copy verbatim, don't rephrase)
- Brand colors are from the actual app (phase 1), not template defaults
- App name, icon, tagline are from the actual app (phase 1)

### Phase 5: Preview & iterate

Run `npm run dev`, tell the user what to watch for:
- Does the pain-point scene feel dramatic enough? (if applicable)
- Are captions readable at speed?
- Does the CTA have enough screen time (2+ seconds)?
- Does the overall pacing feel rushed or draggy?
- Do the scenes look like they belong to THIS app, not a generic template?

### Quick mode

If `$ARGUMENTS` contains "quick": compress phases 2-3 into inference. Use the extracted context to make all creative decisions autonomously. **You must still complete phase 1 (extract & confirm) and present the full output of phases 2-3 combined for approval before generating the config.** The difference is you don't ask questions — you make all creative decisions and present them for a single approval.

Present in quick mode:

```
**Strategy:** [strategy file] — [reason]
**Arc:** [arc name] — [reason]
**Scenes:** [ordered list with skipped scenes noted]

[Full copy for all scenes, same format as phase 3]

Approve this direction, or tell me what to change.
```

**⛔ STOP. Wait for approval before generating config.**

## Narrative arcs

Recommend one of these three based on category and app type. Explain your reasoning to the user.

### Problem-Solution-Proof (default)

**Scenes:** pain-point → feature-showcase → speed-demo → social-proof → call-to-action

Best when the problem is visceral. Default for most apps.

Why: Viewer recognizes frustration → sees relief → watches how fast it works → sees proof → gets invited in.

### Hook-Demo-Proof

**Scenes:** feature-showcase → speed-demo → social-proof → call-to-action

Best when the UI is the selling point and the problem is well-known. Skips pain-point.

Why: The UI makes the first impression. Viewers who know the problem category don't need it explained.

### Transformation

**Scenes:** pain-point → feature-showcase → social-proof → speed-demo → call-to-action

Best for self-improvement, habit, and health apps where identity journey is the story.

Why: Emotional payoff (identity shift, milestones) lands harder before the practical "how fast" demo.

## Timing & pacing

Total video: 22-28 seconds (660-840 frames at 30fps).

| Scene | Duration | Frames | Why |
|---|---|---|---|
| pain-point | 3-4s | 90-120 | Land the "ugh" moment, don't linger |
| feature-showcase | 4-5s | 120-150 | Cards need time to animate and breathe |
| speed-demo | 4-5s | 120-150 | Full type → save → toast loop |
| social-proof | 5-6s | 150-180 | Heatmap and timeline draw progressively |
| screenshot | 4-6s | 120-180 | Pan/zoom needs time to reveal detail |
| call-to-action | 3-4s | 90-120 | Quick and clean, badge visible 2+ sec |

### typeFrames

Controls when each character appears during typing animation. Each value is a frame number.

Formula from human-readable timing:
```
typeFrames = Array.from({length: N}, (_, i) =>
  Math.round(startSec * fps + (i * typeDurationSec * fps) / N)
)
```

Example: `"243"` (3 chars), start at 0.6s, type over 0.3s at 30fps → `[18, 22, 26]`

Always tell the user: "Characters appear at 0.6s, 0.73s, 0.87s" alongside the raw frame numbers.

## Scene props reference

### pain-point
| Prop | Type | Purpose |
|---|---|---|
| `headline` | string | One word/phrase naming the problem |
| `items` | `{label, filled}[]` | Progress dots — last one empty = the break |
| `counterStart` | number | Starting value (the "before") |
| `counterEnd` | number | Ending value (usually 0) |
| `counterLabel` | string | Unit ("Days", "Hours", "Tasks") |
| `caption` | string | Triggers recognition |

### feature-showcase
| Prop | Type | Purpose |
|---|---|---|
| `cards` | `{title, subtitle?, highlight?, items?[]}[]` | Feature cards (2-3 max) |
| `caption` | string | Names the solution |
| `backgroundVariant` | `"light"\|"medium"\|"deep"` | Background intensity |
| `phoneScale` | number | Frame scale (default 1.8) |
| `device` | DevicePreset | Override device |

### speed-demo
| Prop | Type | Purpose |
|---|---|---|
| `screenTitle` | string | App screen heading |
| `steps` | `{label, value, typeFrames[]}[]` | Input steps with timing |
| `successMessage` | string | Toast after save |
| `buttonLabel` | string | Action button text |
| `caption` | string | Includes a speed claim |

### social-proof
| Prop | Type | Purpose |
|---|---|---|
| `screenTitle` | string | Screen heading |
| `statValue` | string | Big stat ("Top 12%") |
| `statLabel` | string | Context ("of readers") |
| `showHeatMap` | boolean | Show contribution grid |
| `timeline` | `{week, label}[]` | Journey milestones (3 recommended) |
| `caption` | string | Invokes identity |

### screenshot
| Prop | Type | Purpose |
|---|---|---|
| `image` | string | Filename in `public/` — the actual app screenshot |
| `caption` | string | Describes what the viewer is seeing |
| `animation` | `"pan-up"\|"pan-down"\|"zoom-in"\|"zoom-out"\|"none"` | How the screenshot animates (default: "pan-up") |
| `device` | DevicePreset | Override device |
| `phoneScale` | number | Frame scale (default 1.8) |

Use `screenshot` scenes to show the actual app UI. Place real screenshots of your app screens in `public/` and reference them by filename. This makes the video look like YOUR app, not a generic template.

### call-to-action
| Prop | Type | Purpose |
|---|---|---|
| `tagline` | string | CTA text (setup) |
| `taglineHighlight` | string | Brand-colored line (differentiator) |
| `pills` | `string[]` | Benefit badges (2-3 max) |
| `caption` | string | Reduces friction |

App name, icon, platform inherited from `appConfig.app`.

## Device presets

| Preset | Screen | Notch |
|---|---|---|
| `iphone-16-pro` | 393x852 | Dynamic Island |
| `iphone-15` | 375x812 | Dynamic Island |
| `ipad-pro-13` | 1024x1366 | None |
| `pixel-9` | 412x915 | Punch hole |

## Components

All brand-aware via `brand` prop:

- **PhoneFrame** — Device with bezel, buttons, notch
- **AmbientBackground** — Gradient + floating orbs (light/medium/deep/dark)
- **Caption** — Word-by-word entrance
- **FadeIn** — Directional fade (up/down/left/right)
- **SceneWrap** — 12-frame fade transitions
- **HeatMap** — Contribution grid
- **AppIcon** — Icon with glow
- **AppStoreBadge** — iOS / Google Play badges

## Store video requirements

| Platform | Dimensions | Duration | Format |
|---|---|---|---|
| iPhone 6.7" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPhone 6.1" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPad 13" | 1200x1600 | 15-30s | H.264, MP4/MOV |

Default output is 1080x1920. For submission, set `video.width` to 886.

## Project setup

```bash
npx create-appshot appshot-video
cd appshot-video
npm run dev     # Preview at localhost:3000
npm run build   # Render to out/AppPreview.mp4
```

## Customization

- **Custom scenes** — Add `.tsx` in `src/scenes/`, export from index, add to `SceneType` union, add `case` in `AppPreview.tsx`
- **Screenshots** — Place app screenshots in `public/`, use `screenshot` scene type to display them inside a phone frame with animation
- **Audio** — `.mp3` in `public/`, set `backgroundMusic` in config
- **Custom components** — Build on primitives in `src/components/`

## Supporting resources

- Annotated example: [bookstreak-annotated.md](examples/bookstreak-annotated.md) — creative reasoning behind every BookStreak choice
- Raw config: `../../examples/bookstreak/app-config.ts`

## Tips

- Under 30 seconds — attention drops after 20s
- Pain first (dark) → solution (warm, branded)
- Core loop in under 5 seconds
- CTA + badge visible 2+ seconds
- Caption every scene — many watch without sound
- Use real app icon for recognition
- Use `screenshot` scenes with actual app screens whenever possible — this is the single most effective way to make the video feel authentic
