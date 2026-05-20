# Appshot — Claude Code Project Brief

App Store preview video generator for mobile apps (iOS/Android). AI skills scan a target app's codebase, propose a narrative, and write custom Remotion scene components using shared animation primitives.

- **Creator**: Kian Nguyen
- **License**: MIT

## Key constraint

All video output is **886×1920px** (App Store native for iPhone 6.7"). Every sizing rule in the skills and components is calibrated for this canvas width. PhoneFrame scale: 1.5. Text outside PhoneFrame: body 24px+, titles 34px+. FloatingCard width: 700px+.

## Where things live

- `template/src/components/` — 11 animation primitives (the product)
- `skills/appshot-core/` — extraction, config schema, primitives catalog
- `skills/appshot-videos/` — video creative director + `references/code-guide.md`
- `skills/appshot-images/` — screenshot creative director
- `.claude/skills/` — auto-populated by `npx skills add`, do NOT edit directly
- Generated video projects go into `[target-project]/appshot-video/`, never into `template/`

## Build

```bash
npm run dev      # Remotion Studio preview
npm run build    # Render 886×1920 MP4 (H.264, CRF 18, yuv420p, bt709)
```

## Git

Conventional commits: `feat(videos):`, `fix(skill):`, `chore:`, `refactor:`, `docs:`
