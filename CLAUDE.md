# Appshot — Claude Code Project Brief

## What is this project?

Appshot generates App Store preview videos for mobile apps. It ships as AI agent skills that scan a target app's codebase, propose a narrative, and write **custom Remotion scene components** that mock the target app's actual UI using shared animation primitives. Mobile apps only (iOS/Android).

- **Creator**: Kian Nguyen
- **License**: MIT

## Critical Architecture: Custom Scenes, Not Templates

**Appshot does NOT use fixed scene templates.** There are no PainPoint, FeatureShowcase, SpeedDemo scene types. Those were removed because they encoded BookStreak's visual DNA — every app ended up looking like BookStreak with different text.

The skill writes bespoke `.tsx` scene files from scratch for every project, using 11 shared animation primitives as building blocks. The primitives ARE the product.

## Repository Structure

```
template/                    # Clean Remotion project — primitives only, NO scene files
  src/components/            # 11 shared primitives (PhoneFrame, Caption, FadeIn, etc.)
  src/config.ts              # Types: AppConfig, BrandColors, DevicePreset
  src/app-config.ts          # Placeholder config
  src/Root.tsx               # Placeholder — skill replaces this

.claude/skills/
  appshot-core/              # Primitives catalog, config schema
  appshot-videos/            # Creative director — scans code, writes custom scenes
  appshot-images/            # Screenshot generator
  shared/                    # copy-principles.md, extract-app-context.md
  eval/                      # Rubric and test scenarios

packages/create-appshot/     # npx create-appshot CLI
examples/bookstreak/         # Reference example (not a template to copy)
```

## Rules

1. **Never add scene template files** (PainPoint.tsx, FeatureShowcase.tsx, etc.) to `template/src/scenes/`. That directory should not exist. Scenes are generated per-project by the skill.

2. **Never add strategy/playbook files** (habit-tracking.md, fitness.md). Narrative comes from source code analysis, not pre-written playbooks.

3. **Never put generated code in `template/`**. Generated scenes go into `[target-project]/appshot-video/`. The template is primitives-only.

4. **All sizing is calibrated for 886×1920px** (App Store native for iPhone 6.7"). Do not use 1080px width.

## Known Pitfalls (From 8+ Test Sessions)

These bugs recurred across multiple test sessions. Every fix is in the appshot-videos SKILL.md, but understanding the root causes prevents regressions.

### Frame 0 black screen
SceneWrap defaults `fadeIn={true}`. The orchestrator must pass `fadeIn={!isFirst}` on Scene 1. Also: TypeWriter as the first element = blank at frame 0 (shows 0-1 chars). `spring({ frame: frame - 70 })` = blank for 70 frames. First element must be fully visible with `delay: 0`.

### App Store dimension rejection (886×1920)
App Store requires exactly 886×1920px. Config must set `width: 886`. This cascades to all sizing:
- PhoneFrame scale: **1.5** (not 1.8 — overflows at 886px)
- Text outside PhoneFrame: body **24px+**, titles **34px+**
- FloatingCard width: **700px+** (not 800+ — only 886px available)
- Caption maxWidth: **720px**

### staticFile double-wrap crash
AppIcon calls `staticFile()` internally. Scene code must NOT wrap icon path in `staticFile()` before passing to AppIcon. Only use `staticFile()` on raw `<Audio>` or `<Img>` tags.

### Text contrast on dark themes
TypeWriter and text elements inherit CSS color (black). On dark backgrounds, they're invisible. Every text element needs explicit `color` in `style={}` using `brand.textPrimary` or `brand.textSecondary`.

### Elements too small outside PhoneFrame
Content inside PhoneFrame gets zoomed by scale. Content outside PhoneFrame renders at actual pixel size on the 886px canvas. 16px outside PhoneFrame is tiny. Different sizing rules apply inside vs outside.

### Video encoding quality
Default Remotion encoding is low bitrate. Build scripts must include: `--codec h264 --crf 18 --pixel-format yuv420p --color-space bt709`.

## Primitives Library (11 Components)

| Component | Key Gotchas |
|-----------|-------------|
| PhoneFrame | Always set `scale={1.5}` for 886px canvas. Never omit scale. |
| AmbientBackground | Requires `brand` prop. Variant "dark" alone is not visible content. |
| Caption | `maxWidth={720}` for 886px canvas. Can overlap PhoneFrame if phone is too large. |
| FadeIn | `delay={0}` on first element of S1 to avoid blank frame 0. |
| SceneWrap | Must pass `fadeIn={false}` on first scene, `fadeOut={false}` on last. |
| AppIcon | `src` is filename only — NO `staticFile()` wrapping. It handles that internally. |
| AppStoreBadge | `platform` prop: "ios", "android", or "both". |
| TypeWriter | Never use as first visible element (0-1 chars at frame 0). Needs explicit `color` via parent style. |
| StatCard | Has hardcoded white background — only works on light-themed scenes. |
| FloatingCard | "dark" variant has hardcoded `#1A1A2E` background. |
| HeatMap | Useful for habit/activity apps. Not every app needs it. |

## Build Commands

```bash
npm run dev          # Preview in Remotion Studio
npm run build        # Render 886×1920 MP4 with App Store quality flags
```

## Git Conventions

Conventional commits: `feat(videos):`, `fix(skill):`, `chore:`, `refactor:`, `docs:`
