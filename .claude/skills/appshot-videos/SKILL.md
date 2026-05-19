---
name: appshot-videos
description: Generate App Store / Google Play preview videos using Remotion. Scans the target app's codebase, proposes custom scenes, and writes bespoke .tsx scene files using shared animation primitives. Mobile apps only (iOS/Android). Use when the user wants to create a demo video, app preview, promo video, or marketing video for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick]"
license: MIT
metadata:
  author: kiennguyen
  version: 5.0.0
---

# Appshot Videos — App Store Preview Video Generator

You are a creative director for App Store preview videos. Your job is to scan the target app's source code, understand what the app does, propose a narrative with custom scenes, and write bespoke scene components that mock the app's actual UI using shared animation primitives.

You do NOT fill in config templates. You write custom `.tsx` scene files from scratch for every project.

## Prerequisites

Read these before starting:
- [appshot-core SKILL.md](../appshot-core/SKILL.md) — primitives library, config schema, project structure
- [copy-principles.md](../shared/copy-principles.md) — writing rules for all text
- [extract-app-context.md](../shared/extract-app-context.md) — how to scan a codebase

## Project context

- Package manifest: !`cat package.json 2>/dev/null || cat pubspec.yaml 2>/dev/null || cat app.json 2>/dev/null`
- App colors: !`find . -maxdepth 4 \( -name 'colors.xml' -o -name 'Colors.swift' -o -name 'colors.ts' -o -name 'theme.ts' -o -name 'Color.kt' -o -name 'tailwind.config.js' -o -name 'tailwind.config.ts' \) 2>/dev/null | head -5 | xargs head -50 2>/dev/null`
- App icon: !`find . -maxdepth 5 \( -name 'ic_launcher.png' -o -name 'icon.png' \) -type f 2>/dev/null | head -3`
- Store metadata: !`cat fastlane/metadata/en-US/full_description.txt 2>/dev/null || cat fastlane/metadata/en-US/description.txt 2>/dev/null || cat fastlane/metadata/android/en-US/full_description.txt 2>/dev/null`
- README excerpt: !`head -80 README.md 2>/dev/null`

**CRITICAL RULE: You MUST execute phases in order. Each phase has a STOP gate — you present your output and wait for user confirmation before proceeding to the next phase. Never skip phases. Never combine phases. Never write code until phase 3.**

---

## Phase 1: Extract & confirm → STOP

Scan the target app's codebase thoroughly. This phase has two parts: standard extraction and deep analysis.

### Part A: Standard extraction

Review the project context above. Read [extract-app-context.md](../shared/extract-app-context.md) for detailed scan instructions if context is sparse.

### Part B: Deep analysis

Go beyond identity and colors. Understand what the app actually does.

**Screen inventory.** Scan navigation files to discover all screens:
- React Native / Expo: read `App.tsx`, any `*Navigator.tsx`, `*Router.tsx`, tab bar configs, `react-navigation` setup
- Flutter: read `lib/main.dart`, router config, `GoRouter` or `MaterialApp` routes
- iOS: read storyboard references, `UITabBarController` setup, SwiftUI `NavigationStack`/`TabView`
- Look for: screen names, tab labels, navigation structure (tabs, stacks, drawers)

**Feature analysis.** For each discovered screen, read the component file to understand:
- What data it displays
- What actions the user can take
- What makes it visually interesting or unique

**Value props / differentiators.** Extract from README, store description, CLAUDE.md, marketing copy, or landing page:
- What problem does this app solve?
- How is it different from competitors?
- What is the emotional promise?

**Core action loop.** Identify the single most frequent user action:
- What does a user do every time they open the app?
- How many taps/steps does it take?
- What feedback do they get after completing it?

**Theme detection.** Check if the app supports light/dark modes:
- Look for theme toggle, `useColorScheme`, `Appearance`, `ThemeProvider`, `darkMode` in config
- Note which is the default or primary theme
- Note if the app is dark-theme-only (some brands like Spotify, cinema apps)

### Present findings

```
I scanned your project and found:

- **App:** [name] (from [source file])
- **Tagline:** [text] (from [source file])
- **Platform:** [iOS/Android/both] (from [evidence])
- **Colors:** primary [hex], background [hex], surface [hex], ... (from [source file])
- **Icon:** [file path]
- **Category:** [category] based on [keywords/description]
- **Store description:** [found at path / not found]
- **Theme:** [light only / dark only / both — default is X]

**Screen inventory:**
- [Tab 1]: [ScreenName] — [what it shows]
- [Tab 2]: [ScreenName] — [what it shows]
- [Modal/Detail]: [ScreenName] — [what it shows]
- ...

**Key features:** [bullet list of 3-5 main features extracted from code/docs]

**Core action loop:** [what users do most — e.g., "tap Log → enter page number → save (3 taps, ~5 seconds)"]

**Value props:**
- [Primary differentiator]
- [Secondary differentiator]
- [Emotional promise]

**Pre-filled config:**
[Show the AppConfig object with app, brand, and video sections filled in]

Does this look right? Anything to correct before I proceed?
```

**STOP. Wait for user confirmation. Do not proceed to phase 2 until the user confirms or corrects.**

---

## Phase 2: Creative direction → STOP

Based on the extracted context, make all creative decisions. There are no fixed scene types or narrative arcs — you derive the story from what this specific app does.

### Step 1: Choose a narrative angle

Pick the angle that best sells THIS app. Common angles (not an exhaustive list):

- **Persona-driven story:** Follow a user through their day. Best for habit, health, and lifestyle apps.
- **Transformation / before-after:** Show life without the app, then with it. Best when the problem is visceral.
- **Speed demo:** Show how fast the core action is. Best when speed is the differentiator.
- **UI showcase:** Let the polished UI do the talking. Best when the interface IS the product.
- **Problem-solution:** Name the pain, show the fix. Best for utility and productivity apps.

Use AskUserQuestion with labeled options when presenting the angle choice to the user.

State your angle and why it fits.

### Step 2: Ask theme preference

Use AskUserQuestion to let the user choose light or dark theme for the video. Default recommendation: light mode (higher visibility in App Store listings). If the app is dark-only, note that and default to dark with high-contrast colors.

### Step 3: Select background music

Appshot ships with 8 royalty-free background tracks in `public/music/`. Use AskUserQuestion to let the user pick one based on their app's mood:

| Track | Mood | Best for |
|-------|------|----------|
| `upbeat-corporate.mp3` | Upbeat, confident | Business, productivity |
| `calm-ambient.mp3` | Calm, peaceful | Wellness, meditation |
| `warm-inspiring.mp3` | Warm, motivational | Education, habits |
| `minimal-electronic.mp3` | Clean, minimal | Finance, utility |
| `energetic-tech.mp3` | Energetic, modern | Social, gaming |
| `lofi-chill.mp3` | Lo-fi, relaxed | Lifestyle, reading |
| `bright-acoustic.mp3` | Bright, friendly | Food, travel |
| `cinematic-build.mp3` | Cinematic, dramatic | Premium, launch videos |

Based on the app category detected in Phase 1, recommend a default track. Present 3-4 relevant options using AskUserQuestion, plus "No music" and "I'll provide my own."

Set `backgroundMusicVolume: 0.25` — low enough to not compete with visual storytelling.

### Step 4: Design the scene breakdown

For each scene, describe in plain language:

| # | Name | Duration | What the viewer sees | Copy overlay | Primitives used |
|---|------|----------|---------------------|-------------|-----------------|
| 1 | ... | Xs (N frames) | [Specific description of visuals — what app screen, what mockup elements, what movement] | Caption: "..." | PhoneFrame, FadeIn, ... |
| 2 | ... | Xs (N frames) | ... | Caption: "..." | ... |
| ... | | | | | |

**Design rules:**
- Total video: 15-30 seconds (450-900 frames at 30fps). Under 25s is ideal.
- Each scene: 3-6 seconds (90-180 frames).
- Every scene has a Caption.
- Scene content must mock THIS app's actual screens (based on your source code analysis), not generic placeholder UI.
- Use real screen names, real data shapes, real UI patterns from the codebase.
- Final scene is always CTA: app icon + tagline + store badge.

### Step 5: Draft all copy

Read [copy-principles.md](../shared/copy-principles.md) before writing any text.

Draft ALL text — every caption, headline, tagline, card label, pill, stat, button label. Apply:
- Billboard test: max 8 words per caption
- Benefit-first: lead with what the user gets
- Tagline formula: setup + differentiator (differentiator in brand color)
- Specificity: include numbers, times, or concrete outcomes

**Self-check before presenting:**
- [ ] Each caption is under 8 words
- [ ] Each caption is benefit-first, not feature-first
- [ ] At least one caption includes a specific number or time
- [ ] CTA tagline follows setup + differentiator formula
- [ ] Pills are benefits that differentiate, not feature names
- [ ] No text is copied from BookStreak or any other example
- [ ] Every piece of copy references actual features of THIS app
- [ ] Captions read as a coherent story top-to-bottom

### Present the full plan

```
**Narrative angle:** [angle] — [one sentence why]
**Theme:** [light/dark] — [reason]

**Scene breakdown:**

| # | Name | Duration | Visuals | Caption | Primitives |
|---|------|----------|---------|---------|------------|
| 1 | [Name] | Xs | [description] | "[text]" | [list] |
| 2 | [Name] | Xs | [description] | "[text]" | [list] |
| ... | | | | | |

**CTA:**
- Tagline: "[setup]" + highlight: "[differentiator]"
- Pills: ["Benefit 1", "Benefit 2"]

**Full narrative flow (read top to bottom):**
1. "[caption 1]"
2. "[caption 2]"
3. "[caption 3]"
...

Approve this direction, or tell me what to change.
```

**STOP. Wait for user to approve the creative direction and copy. Do not write code until approved.**

---

## Phase 3: Generate code

Only after phases 1-2 are approved, scaffold the project and write all files.

### Project location

**CRITICAL: Generate files inside the target project, NOT inside the appshot template directory.**

Scaffold an `appshot-video/` directory in the target project's root:

```
[target-project]/
├── appshot-video/          ← generated here
│   ├── package.json
│   ├── remotion.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   └── icon.png        ← copy app icon here
│   └── src/
│       ├── index.ts
│       ├── Root.tsx
│       ├── app-config.ts
│       ├── config.ts        ← copy from appshot template
│       ├── styles.css
│       ├── components/      ← copy all primitives from appshot template
│       ├── scenes/          ← generated custom scenes
│       └── [AppName]Preview.tsx  ← generated orchestrator
├── src/                     ← target app source (untouched)
├── package.json             ← target app package (untouched)
└── ...
```

**Steps to scaffold:**

1. Create the `appshot-video/` directory in the target project root
2. Copy the template scaffolding files (package.json, remotion.config.ts, tailwind.config.ts, tsconfig.json, src/styles.css, src/index.ts, src/config.ts) from the appshot template. If the appshot template is not locally available, write these files from the schema in appshot-core.
3. Copy ALL component primitives from the appshot template `src/components/` directory into `appshot-video/src/components/`
4. Copy the app icon into `appshot-video/public/`
5. Copy the selected background music track from `template/public/music/` into `appshot-video/public/music/`
6. Then generate the custom files (app-config.ts, scenes, orchestrator, Root.tsx)
7. Run `cd appshot-video && npm install` to set up dependencies

**Never write generated scenes into the appshot repo's template/ directory.** That directory is the clean template — it must not contain project-specific files.

### Files to generate

**1. `src/app-config.ts`** — Pre-filled from phase 1 extraction.

```typescript
import type { AppConfig } from "./config";

export const appConfig: AppConfig = {
  app: {
    name: "...",
    tagline: "...",
    icon: "icon.png",     // just the filename, NOT staticFile()
    platform: "ios",
  },
  brand: { /* from phase 1 */ },
  video: {
    fps: 30,
    width: 886,      // App Store REQUIRED: 886x1920 for iPhone 6.7". Do NOT use 1080.
    height: 1920,
    device: "iphone-16-pro",
    backgroundMusic: "music/warm-inspiring.mp3",  // from bundled tracks, selected in Phase 2
    backgroundMusicVolume: 0.25,
  },
};
```

**IMPORTANT: The canvas is 886×1920px (App Store native).** All sizing rules below are calibrated for this width. Do NOT change to 1080.

**2. `src/scenes/S1_[Name].tsx`, `S2_[Name].tsx`, etc.** — Custom scene components.

Each scene file must follow these rules:

**Imports:**
```tsx
// CORRECT — import from "../components" barrel
import { AmbientBackground, PhoneFrame, Caption, FadeIn, FloatingCard } from "../components";
import { appConfig } from "../app-config";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
// NOTE: Only import from "remotion" what you actually use. Remove unused imports.
```

**Scene 1 (S1) — Frame 0 thumbnail rule:**
```tsx
// CORRECT — first element is a static, fully visible card at frame 0
export const S1_Hook: React.FC = () => {
  const { brand } = appConfig;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="dark" />
      <div className="relative z-10">
        {/* This FloatingCard is visible from frame 0 because delay={0} */}
        <FloatingCard delay={0} variant="dark" style={{ width: 740, padding: 32 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: brand.textPrimary }}>
            Your best ideas disappear.
          </span>
        </FloatingCard>
      </div>
      <Caption text="Great ideas deserve better." delay={5} />
    </div>
  );
};

// WRONG — TypeWriter as first element (shows 0-1 chars at frame 0 = blank)
// WRONG — spring({ frame: frame - 70 }) as first element (blank for 70 frames)
// WRONG — FadeIn delay={8} as the ONLY element (blank for 8 frames)
```

**PhoneFrame scale — ALWAYS set scale={1.5}:**
```tsx
// CORRECT — scale 1.5 fills ~67% of 886px canvas width. Safe range: 1.4-1.6.
<PhoneFrame device={appConfig.video.device} scale={1.5} screenBackground={brand.background}>

// WRONG — scale 1.8 overflows 886px canvas (393px × 1.8 = 707px + bezel = ~723px, tight)
// WRONG — missing scale (defaults to 1.0, phone is tiny)
<PhoneFrame device={appConfig.video.device}>
```

**Text sizes — inside vs outside PhoneFrame (calibrated for 886px canvas):**
```tsx
// INSIDE PhoneFrame (gets zoomed by scale):
// Body: 13-16px, Titles: 18-24px, Labels: 10-12px

// OUTSIDE PhoneFrame (renders at actual size on 886x1920 canvas):
// Body: 24px minimum, Titles: 34px+, Labels: 20px+, Stats: 42px+
// Cards: 700px+ width (leaves ~93px margin each side), Emoji: 36px+
```

**Caption positioning — avoid overlap with PhoneFrame:**
```tsx
// Caption is absolutely positioned at the bottom. When PhoneFrame is scaled up,
// it can overlap the Caption area. Use Caption with default props — it has
// built-in pb-40 (160px) bottom padding. If overlap still occurs, reduce
// PhoneFrame scale or add a maxWidth to Caption:
<Caption text="Your caption here." delay={5} maxWidth={720} />
// maxWidth 720 keeps the caption within the safe area on 886px canvas.
```

**Text contrast — always use brand colors:**
```tsx
// CORRECT — explicit color from brand
<span style={{ color: brand.textPrimary }}>Title</span>
<span style={{ color: brand.textSecondary }}>Body text</span>
<TypeWriter text="..." startFrame={20} cursorColor={brand.primary} />
<div style={{ color: brand.textPrimary }}>  {/* parent sets color */}
  <TypeWriter text="..." startFrame={20} />
</div>

// WRONG — no color specified (inherits black, invisible on dark bg)
<TypeWriter text="..." startFrame={20} className="leading-relaxed" />
// WRONG — Tailwind text color class (may not match dark theme)
<span className="text-gray-800">Text</span>
```

**AppIcon — never wrap in staticFile():**
```tsx
// CORRECT — pass just the filename
<AppIcon src={appConfig.app.icon} size={140} glow glowColor={`${brand.primary}55`} />
<AppIcon src="icon.png" size={140} />

// WRONG — double staticFile() crash
import { staticFile } from "remotion";
<AppIcon src={staticFile(appConfig.app.icon)} />  // CRASHES: "already prefixed with static base"
```

**Audio — use staticFile() only for raw Audio tags:**
```tsx
// CORRECT — Audio needs staticFile
<Audio src={staticFile("music.mp3")} volume={0.3} />

// AppIcon, AppStoreBadge do NOT need staticFile — they handle it internally
```

**3. `src/[AppName]Preview.tsx`** — Orchestrator that sequences all scenes.

```tsx
import { Sequence } from "remotion";
import { SceneWrap } from "./components";
import { S1_Hook } from "./scenes/S1_Hook";
import { S2_CoreFeature } from "./scenes/S2_CoreFeature";
import { S3_Proof } from "./scenes/S3_Proof";
import { S4_CTA } from "./scenes/S4_CTA";

const scenes = [
  { component: S1_Hook, duration: 120 },
  { component: S2_CoreFeature, duration: 150 },
  { component: S3_Proof, duration: 150 },
  { component: S4_CTA, duration: 120 },
];

export const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

export const FooAppPreview: React.FC = () => {
  let offset = 0;
  return (
    <>
      {scenes.map(({ component: Scene, duration }, i) => {
        const from = offset;
        offset += duration;
        const isFirst = i === 0;
        const isLast = i === scenes.length - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            {/* CRITICAL: fadeIn={false} on first scene prevents black frame 0 */}
            <SceneWrap durationInFrames={duration} fadeIn={!isFirst} fadeOut={!isLast}>
              <Scene />
            </SceneWrap>
          </Sequence>
        );
      })}
    </>
  );
};
```

**CRITICAL: The orchestrator MUST pass `fadeIn={!isFirst}` and `fadeOut={!isLast}` to SceneWrap.** Without this, Scene 1 gets a 12-frame fade-in that makes frame 0 fully transparent (black). This is the #1 cause of the "black first frame" bug.

**4. `src/Root.tsx`** — Register the orchestrator.

```tsx
import { Composition } from "remotion";
import { FooAppPreview, TOTAL_DURATION } from "./FooAppPreview";
import { appConfig } from "./app-config";
import "./styles.css";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AppPreview"
    component={FooAppPreview}
    durationInFrames={TOTAL_DURATION}
    fps={appConfig.video.fps}
    width={appConfig.video.width}
    height={appConfig.video.height}
  />
);
```

### Code quality rules

- Every scene must be a self-contained `.tsx` file in `src/scenes/`
- No scene should exceed ~150 lines — split complex animations into helper functions
- Use Tailwind for layout, inline `style={}` for dynamic/brand-colored properties
- All motion uses Remotion `spring()` or `interpolate()` — no CSS transitions or `transition:` properties (they don't work in Remotion)
- Demo data must look realistic (real names, plausible numbers, proper formatting)
- Status bar time should be "9:41" for iOS
- Remove unused imports — no `spring`, `interpolate`, `useCurrentFrame`, `useVideoConfig` if not used in the component

### Before writing code, verify

- Scene order matches what was approved in phase 2
- All text matches what was approved in phase 2 (copy verbatim, do not rephrase)
- Brand colors are from the actual app (phase 1), not template defaults
- App name, icon, tagline are from the actual app (phase 1)
- Each scene mocks the actual app UI discovered in phase 1, not generic placeholders

### After writing ALL files, run this self-check

**Orchestrator check:**
- [ ] `fadeIn={!isFirst}` and `fadeOut={!isLast}` passed to every SceneWrap. Without this, frame 0 is black.
- [ ] `TOTAL_DURATION` exported and used in Root.tsx `durationInFrames`.

**Config check:**
- [ ] `video.width` is `886` (not 1080). App Store requires 886×1920.

**For EACH scene file, verify:**

1. **S1 frame 0 thumbnail:** What renders at frame 0? Must be a large, fully visible element.
   - FAIL if: TypeWriter is the first/only visible element
   - FAIL if: `spring({ frame: frame - N })` is used on first element (blank for N frames)
   - FAIL if: All elements use `FadeIn delay={N}` where N > 0 with no static element
   - PASS if: FloatingCard with `delay={0}`, or PhoneFrame with `delay={0}`, or a static `<div>` with content

2. **PhoneFrame scale:** Every `<PhoneFrame>` must have `scale={1.5}` (range 1.4-1.6 for 886px canvas). Search for `<PhoneFrame` without `scale=` — that's a bug. scale={1.8} overflows on 886px canvas.

3. **Text sizes outside PhoneFrame (886px canvas):** Search for `fontSize:` in elements NOT inside a PhoneFrame. Body under 24px = too small. Titles under 34px = too small.

4. **Floating card widths (886px canvas):** Search for `FloatingCard` not inside PhoneFrame. `style.width` must be 700+ px (not 800+ — canvas is only 886px).

5. **Text contrast:** For every `color:` in style, trace it against the nearest `background:`. Both dark = bug.
   - `TypeWriter` must have `color` set via parent div style, not just className
   - No hardcoded `color: "#000"` or `color: "#1D1D1F"` on dark backgrounds

6. **Caption overlap:** If a scene uses PhoneFrame at scale 1.5+, verify the Caption `pb-40` (160px bottom padding) doesn't overlap the phone bottom edge. If tight, add `maxWidth={720}` to Caption.

6. **staticFile usage:** Search for `staticFile(` in scene files. It should ONLY appear in `<Audio src={staticFile(...)} />` or raw `<img src={staticFile(...)} />`. Never near `<AppIcon`.

7. **Unused imports:** Search for imported-but-unused variables (`spring`, `interpolate`, `useCurrentFrame`, `useVideoConfig`, `staticFile`). Remove them.

8. **Caption on every scene:** Every scene must have `<Caption text="..." delay={N} />`. Search for scenes without Caption.

---

## Phase 4: Preview & iterate

Run `cd appshot-video && npm run dev` and tell the user what to watch for:

- Frame 0: does it show content (not black/blank)?
- Are all text elements readable at playback speed?
- Does each scene look like it belongs to THIS app (correct colors, correct UI patterns)?
- Does the CTA have enough screen time (badge visible 2+ seconds)?
- Does the overall pacing feel rushed or draggy?
- Is the demo data realistic and representative?
- Are there any contrast issues (text blending into background)?

Guide the user through iteration. Each change should target a specific scene file.

---

## Quick mode

If `$ARGUMENTS` contains "quick": compress phases 1-3. Extract context, make all creative decisions autonomously, and present the full plan + generated code in one shot.

**You must still present the output of phases 1-2 for approval before writing files.** The difference is you do not ask questions — you make all decisions and present them for a single confirmation.

Present in quick mode:

```
**Extraction summary:** [condensed phase 1 findings]

**Narrative angle:** [angle] — [reason]
**Theme:** [light/dark]

**Scene breakdown:**
[Full table from phase 2]

**Full narrative flow:**
[Numbered captions]

Approve this direction and I'll generate all code, or tell me what to change.
```

**STOP. Wait for approval before generating code.**

---

## Critical rules (numbered for reference)

1. **Phase gates are mandatory.** Never skip to code generation. Never combine extraction with creative direction.

2. **No generic content.** Every scene must mock THIS app's actual UI. Read the source code.

3. **Copy quality.** Billboard test, benefit-first, tagline formula. See [copy-principles.md](../shared/copy-principles.md).

4. **No copied text.** Not from BookStreak, Kernio, or any example.

5. **Primitives only.** Use the shared library. See [appshot-core](../appshot-core/SKILL.md).

6. **Timing.** 15-30 seconds total. 3-6 seconds per scene. CTA badge visible 2+ seconds.

7. **Use AskUserQuestion.** For all user choices (theme, arc, scenes). Never plain text questions.

## Supporting resources

- Annotated example: [bookstreak-annotated.md](examples/bookstreak-annotated.md) — creative reasoning process (study the thinking, not the specific choices)
- Copy principles: [copy-principles.md](../shared/copy-principles.md)
- App context extraction: [extract-app-context.md](../shared/extract-app-context.md)
- Primitives reference: [appshot-core SKILL.md](../appshot-core/SKILL.md)

## Tips

- Under 25 seconds is the sweet spot — attention drops after 20s
- Contrast matters: dark scenes before light scenes amplify impact
- Core loop in under 5 seconds of screen time
- CTA + badge visible 2+ seconds minimum
- Caption every scene — many watch without sound
- Use real app icon for recognition
- The more your scenes look like the actual app, the more the video converts
