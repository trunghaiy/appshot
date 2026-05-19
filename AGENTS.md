# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Overview

This repository contains an **App Store preview video and screenshot generator** built on Remotion + React + Tailwind CSS. It includes **Agent Skills** (following the [Agent Skills specification](https://agentskills.io/specification.md)) that act as creative directors — they scan a user's codebase, guide narrative and copy decisions, and produce ready-to-render configs.

- **Name**: Appshot
- **GitHub**: [github.com/trunghaiy/appshot](https://github.com/trunghaiy/appshot)
- **Creator**: Kian Nguyen
- **License**: MIT

## Repository Structure

```
appshot/
├── AGENTS.md                          # This file — agent guidelines
├── README.md                          # Project overview and quick start
├── VERSIONS.md                        # Skill version tracking
├── template/                          # Remotion project template (copy to start)
│   ├── package.json                   # Remotion + React + Tailwind deps
│   ├── remotion.config.ts
│   ├── tailwind.config.ts
│   ├── src/
│   │   ├── app-config.ts              # User config — skills generate this
│   │   ├── config.ts                  # TypeScript types (AppConfig, BrandColors, etc.)
│   │   ├── AppPreview.tsx             # Main composition — routes scenes
│   │   ├── Root.tsx                   # Remotion entry point
│   │   ├── scenes/                    # 5 scene components
│   │   │   ├── PainPoint.tsx
│   │   │   ├── FeatureShowcase.tsx
│   │   │   ├── SpeedDemo.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   └── CallToAction.tsx
│   │   └── components/                # Reusable brand-aware components
│   │       ├── PhoneFrame.tsx
│   │       ├── AmbientBackground.tsx
│   │       ├── Caption.tsx
│   │       ├── FadeIn.tsx
│   │       ├── HeatMap.tsx
│   │       ├── AppIcon.tsx
│   │       ├── AppStoreBadge.tsx
│   │       └── SceneWrap.tsx
│   └── public/                        # Static assets (icons, audio)
├── examples/
│   └── bookstreak/                    # Annotated real-world example
│       └── app-config.ts
├── .claude/
│   ├── settings.local.json            # Claude Code permissions and hooks
│   └── skills/                        # Agent skills (also symlinked for npx skills add)
│       ├── appshot-core/              # Foundation skill
│       │   └── SKILL.md
│       ├── appshot-videos/            # Video generation skill (creative director)
│       │   └── SKILL.md
│       ├── appshot-images/            # Screenshot generation skill (creative director)
│       │   └── SKILL.md
│       ├── eval/                      # Evaluation rubric and runner
│       │   ├── rubric.md
│       │   └── run-eval.md
│       └── shared/                    # Shared resources across skills
│           ├── copy-principles.md     # Writing rules for all store assets
│           └── extract-app-context.md # Codebase scanning guide
├── tools/
│   └── REGISTRY.md                    # Tool and platform registry
└── docs/
```

**Key architectural point:** The `template/` directory is a standalone Remotion project. Skills generate config for it — they do not modify the template itself. Each user project is a copy of `template/` with a customized `src/app-config.ts`.

## Build / Lint / Test Commands

The template is a standard Remotion project. Scaffold a new project with:

```bash
npx create-appshot my-video
cd my-video
npm run dev          # Preview at localhost:3000
npm run build        # Render to out/AppPreview.mp4
```

Skills are content-only (no build step). To verify a skill file:
- YAML frontmatter is valid
- `name` field matches directory name exactly
- `name` is 1-64 chars, lowercase alphanumeric and hyphens only
- `description` is 1-1024 characters with trigger phrases
- File is under 500 lines

## Agent Skills Specification

Skills follow the [Agent Skills spec](https://agentskills.io/specification.md).

### Required Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it. Include trigger phrases.
license: MIT
metadata:
  author: Kian Nguyen
  version: 1.0.0
---
```

### Frontmatter Field Constraints

| Field         | Required | Constraints                                                      |
|---------------|----------|------------------------------------------------------------------|
| `name`        | Yes      | 1-64 chars, lowercase `a-z`, numbers, hyphens. Must match dir.   |
| `description` | Yes      | 1-1024 chars. Include trigger phrases and when-to-use guidance.  |
| `license`     | No       | License name (default: MIT).                                     |
| `metadata`    | No       | Key-value pairs: `author`, `version`, etc.                       |

### Name Field Rules

- Lowercase letters, numbers, and hyphens only
- Cannot start or end with hyphen
- No consecutive hyphens (`--`)
- Must match parent directory name exactly

**Valid**: `appshot-videos`, `appshot-images`, `appshot-core`
**Invalid**: `Appshot-Videos`, `-appshot`, `appshot--videos`

### Skill Directory Layout

```
skills/skill-name/
├── SKILL.md        # Required — main instructions (<500 lines)
├── strategies/     # Optional — category-specific creative guidance
├── examples/       # Optional — annotated examples
├── references/     # Optional — detailed docs loaded on demand
└── assets/         # Optional — templates, data files
```

## Foundation Skill Pattern

Appshot uses a layered skill architecture:

1. **`appshot-videos`** and **`appshot-images`** are the user-facing skills. They act as creative directors — scanning codebases, guiding narrative decisions, and producing configs.

2. Both skills reference **shared resources** in `skills/shared/`:
   - `copy-principles.md` — writing rules for all store asset text (captions, headlines, taglines, pills)
   - `extract-app-context.md` — step-by-step codebase scanning guide for extracting app identity, brand colors, icons, and store metadata

3. Both skills share **category strategy files** (in `skills/appshot-videos/strategies/`). These provide category-specific creative guidance for habit tracking, fitness, finance, productivity, and more.

When building a new skill that extends appshot, always reference `shared/copy-principles.md` and `shared/extract-app-context.md` rather than duplicating their content.

## Writing Style Guidelines

### Structure

- Keep `SKILL.md` under 500 lines. Move detailed references to separate files.
- Use H2 (`##`) for main sections, H3 (`###`) for subsections.
- Use bullet points and numbered lists.
- Short paragraphs (2-4 sentences max).

### Tone

- Direct and instructional.
- Second person when addressing the agent ("You are a creative director").
- Active voice over passive.

### Formatting

- Bold (`**text**`) for key terms.
- Code blocks for config examples and shell commands.
- Tables for reference data (scene props, device dimensions, store requirements).
- No excessive emojis.

### Clarity Principles

- Clarity over cleverness.
- Specific over vague — include numbers, dimensions, and concrete examples.
- One idea per section.
- Always provide real examples, never placeholders.

## Cross-Agent Compatibility

Skills must work with **Claude Code, Cursor, Windsurf, Codex**, and other agents supporting the Agent Skills spec.

### Rules

- Keep `SKILL.md` files agent-agnostic where possible.
- Claude Code-specific features (like `!`command`` dynamic injection) are acceptable where essential for context extraction (extracting package.json, theme files, etc.), but avoid them for non-critical content.
- Other agents that load skills will see the literal `` !`command` `` string rather than executing it. Skills should still function without these injections — agents that don't support dynamic injection will simply have less context and may need to ask the user.
- Do not rely on Claude Code-specific slash command syntax in skill instructions.

## Version Management

- `VERSIONS.md` at the repo root tracks skill versions.
- Agents should check once per session on first skill use.
- Only notify the user when:
  - 2 or more skills have updates, OR
  - Any skill has a major version bump (e.g., 1.x to 2.x)
- Non-blocking notification at end of response:
  ```
  ---
  Skills update available: X appshot skills have updates.
  Say "update skills" to update, or run `git pull` in your appshot folder.
  ```

## Git Workflow

### Branch Naming

- New skills or features: `feature/skill-name`
- Bug fixes: `fix/skill-name-description`
- Documentation: `docs/description`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat(videos): add fitness category strategy`
- `fix(images): correct iPad screenshot dimensions`
- `chore: update dependencies`
- `docs: add evaluation scenario for finance apps`
- `refactor(shared): simplify color extraction logic`

Include a scope in parentheses when it adds clarity.

### Pull Request Checklist

- [ ] `name` matches directory name exactly
- [ ] `name` follows naming rules (lowercase, hyphens, no `--`)
- [ ] `description` is 1-1024 chars with trigger phrases
- [ ] `SKILL.md` is under 500 lines
- [ ] No sensitive data or credentials
- [ ] Shared resources referenced, not duplicated
- [ ] Config examples pass TypeScript type checking against `config.ts`

## Remotion-Specific Notes

### Template Architecture

The `template/` directory is a self-contained Remotion project. The skill workflow is:

1. Copy `template/` to a new directory (`cp -r template/ my-video`)
2. Install dependencies (`npm install`)
3. Skills generate `src/app-config.ts` based on creative decisions
4. Preview with `npm run dev`, render with `npm run build`

Skills **never modify the template directly**. They produce config that the template consumes.

### Scene Types

Five built-in scene types, each a React component in `src/scenes/`:

| Scene | Purpose |
|-------|---------|
| `pain-point` | Show the problem — dark theme, counter reset, failure animation |
| `feature-showcase` | App UI inside a realistic phone frame with animated cards |
| `speed-demo` | Demonstrate a fast core loop (type, save, success toast) |
| `social-proof` | Analytics, heat maps, progress timelines, stats |
| `call-to-action` | App icon + tagline + feature pills + App Store badge |

### Components

All components accept brand colors via a `brand` prop:

- **PhoneFrame** — Realistic device with bezel, side buttons, notch/Dynamic Island
- **AmbientBackground** — Animated gradient with floating orbs (light/medium/deep/dark)
- **Caption** — Word-by-word entrance animation
- **FadeIn** — Directional fade (up/down/left/right)
- **SceneWrap** — 12-frame fade transitions between scenes
- **HeatMap** — GitHub-style contribution grid
- **AppIcon** — Icon with optional glow effect
- **AppStoreBadge** — iOS App Store / Google Play badges

### Config Schema

All user config lives in `src/app-config.ts` and conforms to the `AppConfig` type defined in `src/config.ts`. The config covers:

- `app` — name, tagline, icon path, platform (ios/android/both)
- `brand` — 8 named colors (primary, primaryLight, background, surface, textPrimary, textSecondary, success, danger)
- `video` — fps, dimensions, device preset, optional background music
- `scenes` — ordered array of scene configs with type, duration, caption, and type-specific props

### Device Presets

| Preset | Screen | Notch |
|--------|--------|-------|
| `iphone-16-pro` | 393x852 | Dynamic Island |
| `iphone-15` | 375x812 | Dynamic Island |
| `ipad-pro-13` | 1024x1366 | None |
| `pixel-9` | 412x915 | Punch hole |

## Evaluation

The `skills/eval/` directory contains a rubric and runner for evaluating skill output quality. After modifying any SKILL.md, strategy file, or shared resource:

1. Run the skill against test scenarios
2. Score output on 5 dimensions: extraction, creative quality, technical validity, conversational quality
3. Pass threshold: average 3.5+, no dimension below 2

See `skills/eval/rubric.md` for scoring criteria and `skills/eval/run-eval.md` for the full process.
