# Appshot

Generate polished App Store and Google Play preview videos and screenshots — from your app's codebase, not a video editor.

Appshot is a **primitives library + AI skill** that acts as a creative director: it scans your project, understands your app, and generates custom scene files tailored to your product. No video editing experience required.

Works with **Claude Code**, **Cursor**, **Windsurf**, **Codex**, and any AI agent that supports the [Agent Skills spec](https://agentskills.io).

<!-- TODO: Add GIF or screenshot of example output here -->

## How It Works

The AI skill generates custom `.tsx` scene files for each project — no fixed scene templates, no one-size-fits-all layouts:

1. **Install the skills** into your mobile app project
2. **Ask your AI agent** — "Generate an App Store preview video for this app"
3. **The skill scans your codebase** — extracts app name, brand colors, icon, features, and store metadata automatically
4. **You answer a few creative questions** — what problem does your app solve? What's the core action? What proof do you have?
5. **The skill generates custom scenes** — writes bespoke `.tsx` components using Appshot primitives, wired into a Remotion composition
6. **Preview and render** — `npm run dev` to preview in-browser, `npm run build` to export MP4

Every video is unique to your app. The skill picks the right narrative arc, writes copy, chooses animations, and composes scenes from the primitives library below.

### Quick mode

Don't want a conversation? Add `--quick` and the skill makes all creative decisions from your codebase context alone:

```
Generate an App Store preview video for this app --quick
```

## Install

Install the skills into your app project (recommended):

```bash
npx skills add trunghaiy/appshot
```

This installs three skills into your project's `.agents/skills/` directory. Your AI agent picks them up automatically on the next session.

<details>
<summary>Other installation methods</summary>

**Install specific skills only:**

```bash
npx skills add trunghaiy/appshot --skill appshot-videos appshot-images
```

**Clone and copy:**

```bash
git clone https://github.com/trunghaiy/appshot.git
cp -r appshot/skills/* your-project/.agents/skills/
```

**Git submodule:**

```bash
git submodule add https://github.com/trunghaiy/appshot.git .agents/appshot
```

**Fork and customize** — fork this repo and modify the skills, strategies, and templates for your needs.

</details>

## What You Can Generate

### Videos

15-30 second animated preview videos for App Store and Google Play. The AI generates custom scenes per project using the primitives library — each video is unique to your app's story, brand, and features.

### Screenshots

Store listing screenshots with device frames, captions, and branded backgrounds. Supports all required App Store and Google Play dimensions.

## Skills

| Skill | What it does |
|-------|-------------|
| `appshot-core` | Foundation — architecture, config schema, component inventory, device presets |
| `appshot-videos` | Creative director for preview videos — scans your app, guides narrative, generates custom scenes |
| `appshot-images` | Creative director for screenshots — scans your app, designs layouts, generates custom scenes |

`appshot-core` is loaded automatically by the other two. You interact with `appshot-videos` or `appshot-images` directly.

## Manual Quick Start

If you prefer full control without AI skills, scaffold a standalone Remotion project:

```bash
# 1. Scaffold
npx create-appshot my-video
cd my-video

# 2. Edit src/app-config.ts with your app's info

# 3. Preview in browser
npm run dev

# 4. Render to MP4
npm run build
```

## Example

See [examples/bookstreak/](examples/bookstreak/) for a complete generated video for a reading app.

## Components

The primitives library that the AI composes into custom scenes. All components accept brand colors via a `brand` prop:

| Component | Purpose |
|-----------|---------|
| `PhoneFrame` | Realistic device with bezel, side buttons, notch/Dynamic Island |
| `AmbientBackground` | Animated gradient with floating orbs (light/medium/deep/dark) |
| `Caption` | Bottom caption with word-by-word entrance animation |
| `FadeIn` | Directional fade-in (up/down/left/right) |
| `SceneWrap` | 12-frame fade transitions between scenes |
| `HeatMap` | GitHub-style contribution grid |
| `AppIcon` | Icon with optional glow effect |
| `AppStoreBadge` | iOS App Store / Google Play badges |

## Device Presets

| Preset | Screen | Notch |
|--------|--------|-------|
| `iphone-16-pro` | 393x852 | Dynamic Island |
| `iphone-15` | 375x812 | Dynamic Island |
| `ipad-pro-13` | 1024x1366 | None |
| `pixel-9` | 412x915 | Punch hole |

## Config Reference

Everything is driven by `src/app-config.ts`. The skill generates this for you, but here's the schema if you're customizing manually:

```typescript
export const appConfig: AppConfig = {
  app: {
    name: "MyApp",
    tagline: "Your tagline",
    icon: "app-icon.png",     // in public/
    platform: "ios",          // "ios" | "android" | "both"
  },
  brand: {
    primary: "#007AFF",
    primaryLight: "#E5F1FF",
    background: "#F5F5F7",
    surface: "#FFFFFF",
    textPrimary: "#1D1D1F",
    textSecondary: "#86868B",
    success: "#34C759",
    danger: "#FF3B30",
  },
  video: {
    fps: 30,
    width: 1080,
    height: 1920,
    device: "iphone-15",
  },
};
```

## Store Requirements

### Videos

| Platform | Dimensions | Duration | Format |
|----------|-----------|----------|--------|
| iPhone 6.7" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPhone 6.1" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPad 13" | 1200x1600 | 15-30s | H.264, MP4/MOV |

Default output is 1080x1920. For App Store submission, set `video.width` to 886.

### Screenshots

| Platform | Dimensions | Required |
|----------|-----------|----------|
| iPhone 6.7" | 1290x2796 | Yes |
| iPhone 6.5" | 1242x2688 | Optional |
| iPad 13" | 2064x2752 | Optional |
| Android | 1080x1920 (min) | Recommended |

## Customization

- **Custom components** — Build on top of the existing primitives in `src/components/`
- **Screenshots** — Use `staticFile("screenshot.png")` inside `PhoneFrame`
- **Audio** — Place `.mp3` in `public/`, set `backgroundMusic` in config
- **Category strategies** — The video skill includes strategies for habit tracking, fitness, finance, and more. Add your own in `skills/appshot-videos/strategies/`

## License

MIT
