---
name: appshot-videos
description: Generate App Store / Google Play preview videos using Remotion. Scans the target app's codebase, proposes custom scenes, and writes bespoke .tsx scene files using shared animation primitives. Mobile apps only (iOS/Android). Use when the user wants to create a demo video, app preview, promo video, or marketing video for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick]"
license: MIT
metadata:
  author: kiennguyen
  version: 4.0.0
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

### Part B: Deep analysis (NEW)

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

State your angle and why it fits.

### Step 2: Design the scene breakdown

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

### Step 3: Draft all copy

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

Only after phases 1-2 are approved, write all project files.

### Files to generate

**1. `src/app-config.ts`** — Pre-filled from phase 1 extraction.

```typescript
import type { AppConfig } from "./config";

export const appConfig: AppConfig = {
  app: {
    name: "...",
    tagline: "...",
    icon: "icon.png",
    platform: "ios",
  },
  brand: { /* from phase 1 */ },
  video: {
    fps: 30,
    width: 1080,
    height: 1920,
    device: "iphone-15",
  },
};
```

**2. `src/scenes/S1_[Name].tsx`, `S2_[Name].tsx`, etc.** — Custom scene components.

Each scene file must:
- Import and use primitives from `"../components"` (PhoneFrame, AmbientBackground, Caption, FadeIn, etc.)
- Import `appConfig` from `"../app-config"` for brand colors
- Use `useCurrentFrame()` and `useVideoConfig()` from Remotion for frame-based animation
- Use `spring()` and `interpolate()` from Remotion for motion
- Render a mockup of the target app's actual screen layout (based on source code analysis from phase 1)
- Use brand colors from `appConfig.brand`
- Include hardcoded demo data that represents realistic app content
- Export a named React component: `export const S1_[Name]: React.FC = () => { ... }`

**Example scene structure** (generic — adapt entirely for the target app):

```tsx
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { AmbientBackground, PhoneFrame, Caption, FadeIn, FloatingCard } from "../components";
import { appConfig } from "../app-config";

export const S2_CoreFeature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  // Mock data representing what the app actually shows
  const items = [
    { title: "Morning Run", value: "5.2 km", time: "28:30" },
    { title: "Evening Walk", value: "2.1 km", time: "35:15" },
  ];

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="light" />

      <div className="relative z-10 flex flex-col items-center">
        <PhoneFrame device={appConfig.video.device} scale={1.8}>
          {/* Mock the actual app screen layout here — scale 1.6-2.0 for readability */}
          <div style={{ padding: 20, background: brand.background, height: "100%" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: brand.textPrimary }}>
              Today's Activity
            </div>
            {items.map((item, i) => (
              <FadeIn key={i} delay={15 + i * 12} distance={20}>
                <FloatingCard delay={15 + i * 12} variant="solid">
                  <div style={{ color: brand.textPrimary, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: brand.primary, fontSize: 28, fontWeight: 700 }}>{item.value}</div>
                </FloatingCard>
              </FadeIn>
            ))}
          </div>
        </PhoneFrame>
      </div>

      <Caption text="Track every step without thinking." delay={5} />
    </div>
  );
};
```

**3. `src/[AppName]Preview.tsx`** — Orchestrator that sequences all scenes.

```tsx
import { Sequence } from "remotion";
import { SceneWrap } from "./components";
import { appConfig } from "./app-config";
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

export const FooAppPreview: React.FC = () => {
  let offset = 0;
  return (
    <>
      {scenes.map(({ component: Scene, duration }, i) => {
        const from = offset;
        offset += duration;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneWrap durationInFrames={duration}>
              <Scene />
            </SceneWrap>
          </Sequence>
        );
      })}
    </>
  );
};
```

**4. Update `src/Root.tsx`** — Register the orchestrator as a Remotion composition.

### Code quality rules

- Every scene must be a self-contained `.tsx` file in `src/scenes/`
- No scene should exceed ~150 lines — split complex animations into helper functions
- Use Tailwind for layout, inline `style={}` for dynamic/brand-colored properties
- All motion uses Remotion `spring()` or `interpolate()` — no CSS transitions
- Demo data must look realistic (real names, plausible numbers, proper formatting)
- Status bar time should be realistic (e.g., "9:41" for iOS)

### Before writing code, verify

- Scene order matches what was approved in phase 2
- All text matches what was approved in phase 2 (copy verbatim, do not rephrase)
- Brand colors are from the actual app (phase 1), not template defaults
- App name, icon, tagline are from the actual app (phase 1)
- Each scene mocks the actual app UI discovered in phase 1, not generic placeholders

### After writing code, self-check every scene file

- [ ] Scene 1 first visible element uses `delay: 0` (thumbnail rule)
- [ ] PhoneFrame uses `scale={1.7}` or higher
- [ ] Text outside PhoneFrame is 28px+ body, 40px+ titles
- [ ] Floating cards outside PhoneFrame are 800px+ wide
- [ ] No dark text color on dark background — trace every text element's `color` against its parent's `background`
- [ ] Every `TypeWriter` or styled text block has an explicit `color` set via `style={}`, not just a className
- [ ] Emoji/icons are 40px+ outside PhoneFrame

---

## Phase 4: Preview & iterate

Run `npm run dev` and tell the user what to watch for:

- Are captions readable at playback speed?
- Does each scene look like it belongs to THIS app (correct colors, correct UI patterns)?
- Does the CTA have enough screen time (badge visible 2+ seconds)?
- Does the overall pacing feel rushed or draggy?
- Is the demo data realistic and representative?

Guide the user through iteration. Each change should target a specific scene file.

---

## Quick mode

If `$ARGUMENTS` contains "quick": compress phases 1-3. Extract context, make all creative decisions autonomously, and present the full plan + generated code in one shot.

**You must still present the output of phases 1-2 for approval before writing files.** The difference is you do not ask questions — you make all decisions and present them for a single confirmation.

Present in quick mode:

```
**Extraction summary:** [condensed phase 1 findings]

**Narrative angle:** [angle] — [reason]

**Scene breakdown:**
[Full table from phase 2]

**Full narrative flow:**
[Numbered captions]

Approve this direction and I'll generate all code, or tell me what to change.
```

**STOP. Wait for approval before generating code.**

---

## Critical rules

1. **Phase gates are mandatory.** Never skip to code generation. Never combine extraction with creative direction. The user must approve the plan.

2. **No generic content.** Every scene must mock THIS app's actual UI. Read the source code. Use real screen names, real data shapes, real navigation patterns. A scene that could belong to any app is a failed scene.

3. **Copy quality.** Read [copy-principles.md](../shared/copy-principles.md). Apply the billboard test, benefit-first rule, and tagline formula. Every caption must be specific to this app.

4. **Self-check before presenting copy:**
   - No text copied from any example (BookStreak, Kernio, or others)
   - Every piece of copy references actual features of THIS app
   - Captions tell a coherent story when read in sequence

5. **Primitives, not from-scratch.** Use the shared primitives library (see [appshot-core](../appshot-core/SKILL.md)). Build scene layouts on top of PhoneFrame, AmbientBackground, Caption, FadeIn, FloatingCard, etc. Only write raw HTML/Tailwind for app-specific UI mockups inside PhoneFrame.

6. **Timing.** Total video 15-30 seconds. Each scene 3-6 seconds. CTA badge visible 2+ seconds. Caption every scene.

7. **Readability at App Store scale.** The video will be viewed as a small thumbnail in the App Store listing. ALL visual elements must be legible — not just those inside PhoneFrame.
   - **Inside PhoneFrame:** Set `phoneScale` to **1.6–2.0** for portrait videos (1080x1920). The phone should fill 70-80% of the frame width. Text minimum: 13px body, 18px titles, 11px labels.
   - **Outside PhoneFrame (floating cards, icons, CTA elements):** These render directly on the 1080x1920 canvas with no phone zoom. Font sizes must be **much larger**: minimum 28px for body text, 40px+ for titles, 22px+ for labels, 48px+ for stat values. A card with 15-20px text on a 1080x1920 canvas is unreadable at App Store thumbnail size.
   - **Emoji/icon sizes:** Minimum 40px when used outside PhoneFrame. 32px minimum inside PhoneFrame.
   - **Card widths:** Floating cards outside PhoneFrame should be at least 800px wide (out of 1080px canvas).
   - Cards, buttons, and interactive elements must have clear visual contrast against the background.

8. **No empty frames — delay: 0 on first element.** Every scene must have visible content from frame 0.
   - The first visible element in Scene 1 MUST use `delay: 0` in its spring/FadeIn. Not `delay: 3`, not `delay: 5` — zero. AmbientBackground alone is not visible content.
   - Frame 0 of the entire video becomes the App Store thumbnail. It must show recognizable content (a card, a phone screen, text — anything the viewer can parse).
   - Subsequent elements can use staggered delays (delay: 8, 16, etc.) but the first one must be instant.
   - For scenes 2+ (not the opening scene), `delay: 3-5` on the first element is acceptable since SceneWrap provides a fade-in transition.

9. **Use structured questions.** When asking the user to choose between options (color theme, narrative arc, scenes to include/exclude, music mood), always use the AskUserQuestion tool with labeled options — never plain text questions. This makes decisions visible and actionable.

10. **Theme selection.** In Phase 1, detect whether the app has both light and dark themes. In Phase 2, ask the user which theme to use for the video using a structured question. Default recommendation: light mode (higher visibility in App Store listings, where most competing videos use light backgrounds). If the app is dark-theme-only (e.g., dark brand identity), use dark mode but ensure sufficient contrast.

11. **Text contrast — no dark text on dark backgrounds.** Every text element must be legible against its immediate background.
    - On dark backgrounds (`brand.background` or `brand.surface` in dark themes): use `brand.textPrimary` (white/light) for titles, `brand.textSecondary` (muted light) for body text. Never use black or dark gray.
    - On light backgrounds: use `brand.textPrimary` (dark) for titles.
    - For TypeWriter and TypeWriter-like components: explicitly set `color` in the containing div's style — do not rely on CSS class inheritance, which may produce black text.
    - Before writing any text element, verify: "Is the text color from the same `brand.*` family as the background?" If both are dark (e.g., `#1E293B` background + `#1D1D1F` text), it's a contrast bug.

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
