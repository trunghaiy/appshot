# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Overview

Appshot generates App Store preview videos for mobile apps. It ships as **AI agent skills** that scan a target app's codebase, propose a narrative, and write **custom Remotion scene components** that mock the target app's actual UI.

- **Name**: Appshot
- **GitHub**: [github.com/trunghaiy/appshot](https://github.com/trunghaiy/appshot)
- **Creator**: Kian Nguyen
- **License**: MIT
- **Scope**: Mobile apps only (iOS/Android). No desktop/web.

## Critical Architecture: Custom Scenes, Not Templates

**Appshot does NOT use fixed scene templates.** There are no PainPoint, FeatureShowcase, SpeedDemo scene types. Those were removed because they encoded one app's (BookStreak) visual DNA and every other app ended up looking like BookStreak with different text.

Instead, the skill:
1. Scans the target app's source code to understand screens, features, value props
2. Proposes a narrative with custom scenes described in plain language
3. Writes bespoke `.tsx` scene files from scratch, using shared animation primitives
4. Each scene mocks the target app's actual UI inside PhoneFrame

**The primitives ARE the product.** The 11 reusable components (PhoneFrame, AmbientBackground, Caption, FadeIn, FloatingCard, TypeWriter, etc.) are the building blocks. Scenes are composed fresh per project.

## Repository Structure

```
appshot/
├── AGENTS.md                          # This file
├── README.md
├── template/                          # Clean Remotion project with primitives only
│   ├── package.json                   # Remotion + React + Tailwind deps
│   ├── src/
│   │   ├── app-config.ts              # Default placeholder config
│   │   ├── config.ts                  # TypeScript types (AppConfig, BrandColors, DevicePreset)
│   │   ├── Root.tsx                   # Placeholder — skill replaces this
│   │   ├── components/                # 11 shared animation primitives
│   │   │   ├── PhoneFrame.tsx
│   │   │   ├── AmbientBackground.tsx
│   │   │   ├── Caption.tsx
│   │   │   ├── FadeIn.tsx
│   │   │   ├── SceneWrap.tsx
│   │   │   ├── HeatMap.tsx
│   │   │   ├── AppIcon.tsx
│   │   │   ├── AppStoreBadge.tsx
│   │   │   ├── TypeWriter.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── FloatingCard.tsx
│   │   │   └── index.ts
│   │   └── styles.css
│   └── public/                        # Static assets (icons, audio)
├── packages/
│   └── create-appshot/                # npx create-appshot CLI scaffolder
├── examples/
│   └── bookstreak/                    # Example config (reference only)
├── .claude/
│   └── skills/
│       ├── appshot-core/              # Foundation: primitives catalog, config schema
│       ├── appshot-videos/            # Creative director: scans code, writes scenes
│       ├── appshot-images/            # Screenshot generator
│       ├── eval/                      # Evaluation rubric and scenarios
│       └── shared/                    # copy-principles.md, extract-app-context.md
└── docs/
```

**Key rules:**
- `template/` contains ONLY primitives and placeholder config. No scene files. No app-specific code. Skills generate scene files into the target project's `appshot-video/` directory, never into `template/`.
- `template/src/scenes/` should NOT exist. If it does, it contains test artifacts that must be deleted.

## How the Skill Works (Video Generation)

The appshot-videos skill runs in 4 phases with mandatory STOP gates:

1. **Phase 1: Extract & confirm** — Scan target app codebase for identity, colors, icon, screens, features, value props. Pre-fill AppConfig. Present findings, wait for user approval.

2. **Phase 2: Creative direction** — Propose narrative angle, scene breakdown (custom per app), draft all copy. Wait for user approval.

3. **Phase 3: Generate code** — Scaffold `appshot-video/` inside the target project. Copy primitives from template. Write custom S1_*.tsx, S2_*.tsx scene files + orchestrator + Root.tsx + app-config.ts.

4. **Phase 4: Preview & iterate** — Run `npm run dev`, guide user through review.

## Known Pitfalls (Learned from 8+ Test Sessions)

These are the bugs that repeatedly occurred during development. Every fix is encoded as a rule in the skill, but understanding WHY matters for future changes.

### Frame 0 black screen (#5)

**Root cause**: SceneWrap defaults `fadeIn={true}`. The orchestrator must pass `fadeIn={!isFirst}` to disable fade-in on Scene 1. Without this, frame 0 has opacity: 0 (12-frame ramp). Additionally, the first visible element in S1 must NOT be a TypeWriter (shows 0-1 chars at frame 0) or use `frame - N` offset math (blank for N frames).

**Where the fix lives**: appshot-videos SKILL.md → Phase 3 orchestrator example + S1 example + self-check item 1.

### App Store dimensions (#10)

**Root cause**: App Store requires exactly 886×1920px for iPhone 6.7" previews. Early versions defaulted to 1080×1920 which gets rejected.

**Cascading effects**: All sizing rules are calibrated for 886px canvas width:
- PhoneFrame scale: 1.5 (not 1.8 — that overflows at 886px)
- Text outside PhoneFrame: body 24px+, titles 34px+ (not 28/40)
- FloatingCard width: 700px+ (not 800+ — only 886px available)
- Caption maxWidth: 720px

**Where the fix lives**: appshot-videos SKILL.md → Phase 3 config example + sizing code blocks + self-check.

### staticFile double-wrap crash (#9)

**Root cause**: AppIcon internally calls `staticFile()`. Scene code that wraps the icon path in `staticFile()` before passing to AppIcon causes Remotion to crash with "already prefixed with static base."

**Rule**: Never `staticFile()` on AppIcon src. Only use `staticFile()` on raw `<Audio>` or `<Img>` tags.

### Text contrast on dark themes (#8)

**Root cause**: TypeWriter and other text components inherit color from CSS, which defaults to black. On dark backgrounds, black text is invisible. Every text element needs an explicit `color` in `style={}` using brand colors.

### Elements too small (#6)

**Root cause**: Elements outside PhoneFrame render at actual pixel size on the canvas. PhoneFrame content gets zoomed by the scale prop. Developers forget that a 16px font outside PhoneFrame is tiny on a 886×1920 canvas, while 16px inside PhoneFrame at scale 1.5 is effectively 24px.

### Video quality (#8 — video encoding)

**Root cause**: Remotion's default encoding produces low-bitrate video that looks blurry on App Store. Build scripts must include: `--codec h264 --crf 18 --pixel-format yuv420p --color-space bt709`.

**Where the fix lives**: template/package.json build scripts.

### Generated files in wrong location (#1)

**Root cause**: The skill generated scenes directly into appshot's `template/` directory instead of scaffolding inside the target project. This pollutes the appshot repo with project-specific files.

**Rule**: All generated files go into `[target-project]/appshot-video/`. Never into `template/`.

## Build / Lint / Test Commands

```bash
# In template/ or a generated appshot-video/ directory:
npm run dev          # Preview in Remotion Studio at localhost:3000
npm run build        # Render to out/AppPreview.mp4 (886×1920, H.264, CRF 18)
npm run build:gif    # Render as GIF
```

## Primitives Library (11 Components)

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| PhoneFrame | Device mockup with bezel, buttons, notch | `device`, `scale` (use 1.5), `screenBackground` |
| AmbientBackground | Animated gradient + floating orbs | `brand`, `variant` (light/medium/deep/dark) |
| Caption | Bottom text overlay, word-by-word animation | `text`, `delay`, `fontSize` (default 44), `maxWidth` (use 720) |
| FadeIn | Directional fade-in wrapper | `delay`, `direction`, `distance` |
| SceneWrap | Fade transitions between scenes | `durationInFrames`, `fadeIn`, `fadeOut` |
| HeatMap | Contribution grid | `brand`, `weeks`, `cellSize` |
| AppIcon | Icon with optional glow | `src` (filename only, NO staticFile), `size`, `glow` |
| AppStoreBadge | Store download badges | `platform`, `delay` |
| TypeWriter | Character-by-character reveal | `text`, `startFrame`, `cursorColor` |
| StatCard | Before/after metric counter | `label`, `before`, `after`, `brand` |
| FloatingCard | Animated card container | `variant` (glass/solid/dark), `delay`, `style` |

## Config Schema

```typescript
interface AppConfig {
  app: { name, tagline, icon, platform };
  brand: BrandColors;  // primary, primaryLight, background, surface, textPrimary, textSecondary, success, danger, accent?
  video: { fps: 30, width: 886, height: 1920, device, backgroundMusic?, backgroundMusicVolume? };
}
```

No `scenes` array — scenes are custom code, not config.

## Git Workflow

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(videos): ...` — new skill capability
- `fix(skill): ...` — bug fix in skill instructions
- `chore: ...` — cleanup, dependency updates
- `refactor: ...` — architecture changes

## Evaluation

`skills/eval/` contains rubric and test scenarios. After modifying any SKILL.md:
1. Install skills into a test project (e.g., kernio-ai-mobile)
2. Run the skill, render the video, review frame-by-frame
3. Check: frame 0 not black, elements readable, correct dimensions, no crashes
4. Score against rubric (pass: average 3.5+, no dimension below 2)

## What NOT to Do

- Do NOT add fixed scene template files (PainPoint.tsx, FeatureShowcase.tsx, etc.) — these were the original architecture and they're gone for good reason
- Do NOT add strategy/playbook files (habit-tracking.md, fitness.md, etc.) — narrative comes from source code analysis, not pre-written playbooks
- Do NOT put generated scene code in `template/` — that directory is primitives-only
- Do NOT use 1080px width for the video canvas — App Store requires 886px
- Do NOT use PhoneFrame scale above 1.6 on 886px canvas — it overflows
