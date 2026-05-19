---
name: appshot-core
description: Foundation skill for Appshot. Defines the Remotion template architecture, scene types, component inventory, config schema, and device presets. Referenced by appshot-videos and appshot-images skills.
license: MIT
metadata:
  author: kiennguyen
  version: 1.0.0
---

# Appshot Core — Foundation

Reference skill for all Appshot skills. Read this before executing `appshot-videos` or `appshot-images`.

## Architecture

- **Remotion 4.0** + React 18 + Tailwind CSS 3.4
- Config-driven: everything defined in `src/app-config.ts`
- `AppPreview.tsx` switches on scene type, renders components via Remotion `<Sequence>`
- Scenes wrapped with `<SceneWrap>` for 12-frame fade transitions
- All components are brand-aware via a `brand` prop derived from config

## Config Schema

```typescript
interface AppConfig {
  app: {
    name: string;
    tagline: string;
    icon: string;        // filename in public/
    platform: "ios" | "android" | "both";
  };
  brand: {
    primary: string;     // hex
    primaryLight: string;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    success: string;
    danger: string;
  };
  video: {
    fps: number;         // 30
    width: number;       // 1080
    height: number;      // 1920
    device: DevicePreset;
  };
  scenes: Scene[];       // ordered array
}
```

Each scene has `type`, `durationInFrames`, `caption`, and type-specific `props`.

## Scene Types

| Type | Purpose | Typical Duration |
|------|---------|-----------------|
| `pain-point` | Dark theme, counter reset, card crack. Shows the problem. | 3-4s (90-120 frames) |
| `feature-showcase` | App UI in phone frame with animated cards. Shows the solution. | 4-5s (120-150 frames) |
| `speed-demo` | Type, save, success toast. Core action loop. | 4-5s (120-150 frames) |
| `social-proof` | Stats, heatmap, progress timeline. Evidence. | 5-6s (150-180 frames) |
| `call-to-action` | Icon + tagline + pills + store badge. The ask. | 3-4s (90-120 frames) |

Total video: 22-28 seconds (660-840 frames at 30fps).

## Component Inventory

All accept a `brand` prop for consistent theming.

| Component | Purpose |
|-----------|---------|
| `PhoneFrame` | Device mockup with bezel, side buttons, notch/island |
| `AmbientBackground` | Animated gradient + floating orbs (light/medium/deep/dark) |
| `Caption` | Bottom caption with word-by-word entrance animation |
| `FadeIn` | Directional fade-in (up/down/left/right) |
| `SceneWrap` | 12-frame fade transitions between scenes |
| `HeatMap` | GitHub-style contribution grid |
| `AppIcon` | App icon with optional glow effect |
| `AppStoreBadge` | iOS App Store / Google Play badge |

## Device Presets

| Preset | Screen | Notch |
|--------|--------|-------|
| `iphone-16-pro` | 393x852 | Dynamic Island |
| `iphone-15` | 375x812 | Dynamic Island |
| `ipad-pro-13` | 1024x1366 | None |
| `pixel-9` | 412x915 | Punch hole |

## Store Requirements

### Videos

| Platform | Dimensions | Duration | Format |
|----------|-----------|----------|--------|
| iPhone 6.7" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPhone 6.1" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPad 13" | 1200x1600 | 15-30s | H.264, MP4/MOV |

Default output is 1080x1920. For submission, set `video.width` to 886.

### Screenshots

| Platform | Dimensions | Required |
|----------|-----------|----------|
| iPhone 6.7" | 1290x2796 | Yes |
| iPhone 6.5" | 1242x2688 | Optional |
| iPad 13" | 2064x2752 | Optional |
| Android | 1080x1920 (min) | Recommended |

## Project Setup

```bash
npx create-appshot appshot-video
cd appshot-video
npm run dev     # Preview at localhost:3000
npm run build   # Render to out/AppPreview.mp4
```

## Customization Entry Points

- **Custom scenes** — Add `.tsx` in `src/scenes/`, export from index, add to `SceneType` union, add `case` in `AppPreview.tsx`
- **Screenshots** — `staticFile("screenshot.png")` inside `PhoneFrame`
- **Audio** — `.mp3` in `public/`, set `backgroundMusic` in config
- **Custom components** — Build on primitives in `src/components/`

## Shared Resources

- Copy principles: [copy-principles.md](../shared/copy-principles.md)
- App context extraction: [extract-app-context.md](../shared/extract-app-context.md)
- Category strategies: `../appshot-videos/strategies/[category].md`
