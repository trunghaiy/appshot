# AGENTS.md

Guidelines for AI agents working in this repository.

## Repository Overview

Appshot generates App Store preview videos for mobile apps. It ships as **AI agent skills** that scan a target app's codebase, propose a narrative, and write **custom Remotion scene components** that mock the target app's actual UI. Mobile apps only (iOS/Android).

- **Name**: Appshot
- **GitHub**: [github.com/trunghaiy/appshot](https://github.com/trunghaiy/appshot)
- **Creator**: Kian Nguyen
- **License**: MIT

## Architecture

Appshot does NOT use fixed scene templates. The skill writes bespoke `.tsx` scene files from scratch for every project, using 11 shared animation primitives as building blocks.

## Repository Structure

```
appshot/
├── AGENTS.md                  # This file — agent guidelines
├── CLAUDE.md                  # Claude Code-specific context and pitfalls
├── README.md
├── template/                  # Clean Remotion project — primitives only, NO scene files
│   └── src/components/        # 11 shared animation primitives
├── packages/create-appshot/   # npx create-appshot CLI
├── examples/bookstreak/       # Reference example
└── .claude/skills/            # Agent skills
    ├── appshot-core/          # Primitives catalog, config schema
    ├── appshot-videos/        # Creative director: scans code, writes custom scenes
    ├── appshot-images/        # Screenshot generator
    ├── eval/                  # Evaluation rubric and test scenarios
    └── shared/                # copy-principles.md, extract-app-context.md
```

## Agent Skills Specification

Skills follow the [Agent Skills spec](https://agentskills.io/specification.md).

### Required Frontmatter

```yaml
---
name: skill-name
description: What this skill does and when to use it. Include trigger phrases.
license: MIT
metadata:
  author: kiennguyen
  version: X.0.0
---
```

### Frontmatter Constraints

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | 1-64 chars, lowercase `a-z`, numbers, hyphens. Must match directory name. |
| `description` | Yes | 1-1024 chars. Include trigger phrases. |
| `license` | No | Default: MIT |
| `metadata` | No | Key-value pairs: `author`, `version` |

### Name Rules

- Lowercase letters, numbers, and hyphens only
- Cannot start or end with hyphen, no consecutive hyphens
- Must match parent directory name exactly

### Skill Directory Layout

```
skills/skill-name/
├── SKILL.md        # Required — main instructions (<500 lines)
├── examples/       # Optional — annotated examples
└── references/     # Optional — detailed docs loaded on demand
```

## Build Commands

```bash
npm run dev          # Preview in Remotion Studio
npm run build        # Render 886×1920 MP4 (App Store native)
```

## Cross-Agent Compatibility

Skills must work with Claude Code, Cursor, Windsurf, Codex, and other agents supporting the Agent Skills spec.

- Keep SKILL.md agent-agnostic where possible
- Claude Code `!command` dynamic injection is acceptable for context extraction but skills must still function without it
- Do not rely on Claude Code-specific slash command syntax

## Git Workflow

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(videos):` — new skill capability
- `fix(skill):` — bug fix in skill instructions
- `chore:` — cleanup, dependency updates
- `docs:` — documentation

## Writing Style

- Direct, instructional tone
- Second person ("You are a creative director")
- Specific over vague — include numbers, dimensions, concrete examples
- Bold for key terms, code blocks for examples, tables for reference data
- SKILL.md under 500 lines — move details to separate files

## Evaluation

After modifying any SKILL.md:
1. Install skills into a test project
2. Run the skill, render the video, review output
3. Score against `skills/eval/rubric.md` (pass: average 3.5+, no dimension below 2)
