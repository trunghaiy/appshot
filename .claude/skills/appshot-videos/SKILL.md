---
name: appshot-videos
description: Generate App Store / Google Play preview videos using Remotion. Use when the user wants to create a demo video, app preview, promo video, or marketing video for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick]"
license: MIT
metadata:
  author: kiennguyen
  version: 2.0.0
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

### Five phases

1. **Extract & confirm** — Review the project context above. Read [extract-app-context.md](../shared/extract-app-context.md) for detailed scan instructions if context is sparse. Present findings and confirm with the user. Identify gaps.

2. **Creative brief** — Ask only what the scan couldn't answer:
   - What problem does your app solve? (the frustration)
   - What's the core action loop? (what users do daily)
   - What proof do you have? (metrics, milestones, outcomes)
   - What's the emotional payoff?

   If the README or store description already answers these, propose the answer and confirm — don't ask open-ended.

3. **Narrative & copy** — Recommend a narrative arc (see below). Read [copy-principles.md](../shared/copy-principles.md) for writing rules. Draft all captions, headlines, taglines, and pills. Present for review. Never leave any text as a placeholder.

4. **Generate config** — Write `src/app-config.ts` with all creative decisions made. Set up the project if needed (copy template, install deps).

5. **Preview & iterate** — Run `npm run dev`, tell the user what to watch for:
   - Does the pain-point scene feel dramatic enough?
   - Are captions readable at speed?
   - Does the CTA have enough screen time (2+ seconds)?
   - Does the overall pacing feel rushed or draggy?

### Quick mode

If `$ARGUMENTS` contains "quick": compress phases 2-3 into inference. Use the extracted context to make all creative decisions autonomously. Present the complete config for approval with a brief rationale for each choice, rather than asking questions. The user can iterate from there.

## Category strategies

After identifying the app category in phase 1, check if a matching strategy file exists:

- [habit-tracking.md](strategies/habit-tracking.md) — habits, streaks, self-improvement
- [fitness.md](strategies/fitness.md) — workout, exercise, health tracking
- [finance.md](strategies/finance.md) — budgeting, expenses, money management
- [productivity.md](strategies/productivity.md) — tasks, notes, organization

For unlisted categories, use [_template.md](strategies/_template.md) as a framework and apply the general copy principles.

Read the matching strategy to inform your arc recommendation, copy suggestions, and pain-point framing.

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
- **Screenshots** — `staticFile("screenshot.png")` inside `PhoneFrame`
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
