# Appshot

Generate polished App Store & Google Play preview videos from a simple config. Built on [Remotion](https://remotion.dev) + React + Tailwind CSS.

No video editing skills required. Define your scenes in TypeScript, render to MP4.

## Quick Start

```bash
# 1. Copy the template
cp -r template/ my-video
cd my-video

# 2. Install dependencies
npm install

# 3. Edit src/app-config.ts with your app's info

# 4. Preview in browser
npm run dev

# 5. Render to MP4
npm run build
```

## Scene Templates

Appshot ships with 5 scene templates that cover the most common App Store video patterns:

| Scene | What it does |
|-------|-------------|
| **PainPoint** | Show the problem (dark theme, counter reset, card crack animation) |
| **FeatureShowcase** | Your app's UI inside a realistic phone frame with animated cards |
| **SpeedDemo** | Demonstrate a fast core loop (type → save → success toast) |
| **SocialProof** | Analytics, heat maps, progress timelines, stats |
| **CallToAction** | App icon + tagline + feature pills + App Store badge |

## Config

Everything is driven by `src/app-config.ts`:

```typescript
export const appConfig: AppConfig = {
  app: {
    name: "MyApp",
    tagline: "Your tagline",
    icon: "app-icon.png",  // in public/
    platform: "ios",       // "ios" | "android" | "both"
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
  scenes: [
    // Your scenes here — see template for examples
  ],
};
```

## Device Presets

| Preset | Screen | Notch |
|--------|--------|-------|
| `iphone-16-pro` | 393×852 | Dynamic Island |
| `iphone-15` | 375×812 | Dynamic Island |
| `ipad-pro-13` | 1024×1366 | None |
| `pixel-9` | 412×915 | Punch hole |

## Components

All components are brand-aware and accept your colors:

- **PhoneFrame** — Realistic device with bezel, side buttons, notch
- **AmbientBackground** — Animated gradient with floating orbs
- **Caption** — Bottom caption with word-by-word animation
- **FadeIn** — Directional fade-in (up/down/left/right)
- **HeatMap** — GitHub-style contribution grid
- **AppIcon** — Icon with optional glow
- **AppStoreBadge** — iOS / Google Play badges
- **SceneWrap** — Auto fade transitions between scenes

## Claude Code Skill

Appshot includes a Claude Code skill. After cloning this repo:

```
/appshot MyApp --scenes pain,feature,speed,proof,cta
```

Claude will generate the config and set up the project for you.

## App Store Requirements

| Platform | Dimensions | Duration |
|----------|-----------|----------|
| iPhone 6.7" | 886×1920 | 15-30s |
| iPhone 6.1" | 886×1920 | 15-30s |
| iPad 13" | 1200×1600 | 15-30s |
| Format | H.264, MP4/MOV | — |

## Examples

See [examples/bookstreak/](examples/bookstreak/) for a real-world config that produces a 30-second reading app preview video.

## Customization

1. **Custom scenes** — Add `.tsx` files to `src/scenes/`, import in `AppPreview.tsx`
2. **Screenshots** — Use `staticFile("screenshot.png")` inside `PhoneFrame`
3. **Audio** — Place `.mp3` in `public/`, set `backgroundMusic` in config
4. **Custom components** — Build on top of the existing primitives

## License

MIT
