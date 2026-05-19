---
name: appshot
description: Generate App Store / Google Play preview videos using Remotion. Use when the user wants to create a demo video, app preview, promo video, or marketing video for a mobile app.
user-invocable: true
argument-hint: "[app name] [--scenes pain,feature,speed,proof,cta]"
version: 1.0.0
author: Kian Nguyen
---

# Appshot — App Store Preview Video Generator

Generate polished, animated App Store preview videos from a simple config. Built on Remotion + React + Tailwind.

## What you do

When the user invokes `/appshot`, you help them create a 15-30 second App Store preview video by:

1. **Gathering app info** — app name, tagline, brand colors, platform (iOS/Android/both), icon path
2. **Selecting scenes** — from the 5 built-in scene templates
3. **Generating the config** — write `app-config.ts` with the user's content
4. **Setting up the project** — copy the template, install deps, run preview

## Scene Templates

| Scene | Purpose | Key Props |
|-------|---------|-----------|
| `pain-point` | Show the problem your app solves (competitor world, dark theme, streak reset, card crack) | `headline`, `items[]`, `counterStart/End`, `counterLabel` |
| `feature-showcase` | Showcase your app's UI inside a phone frame with animated cards | `cards[]` (title, subtitle, highlight, items) |
| `speed-demo` | Demonstrate a fast core loop (type value → save → toast) | `screenTitle`, `steps[]`, `successMessage`, `buttonLabel` |
| `social-proof` | Show analytics, heat maps, progress timelines | `screenTitle`, `statValue`, `statLabel`, `timeline[]`, `showHeatMap` |
| `call-to-action` | Final screen with app icon, tagline, feature pills, store badge | `tagline`, `taglineHighlight`, `pills[]` |

## Step-by-step

### Step 1: Understand what the user wants

Ask (if not provided):
- App name and tagline
- Brand colors (primary, background) — or offer to extract from their existing code
- Platform: iOS, Android, or both
- Which scenes they want (default: all 5 in order)
- Any specific content for captions/cards

### Step 2: Set up the project

```bash
# Copy the template to the user's preferred location
cp -r <appshot-repo>/template ./videos  # or wherever they want it
cd videos
npm install
```

### Step 3: Generate app-config.ts

Write `src/app-config.ts` with the user's content. Use the `AppConfig` type from `src/config.ts`.

Example structure:
```typescript
import type { AppConfig } from "./config";

export const appConfig: AppConfig = {
  app: {
    name: "MyApp",
    tagline: "Your tagline here",
    icon: "app-icon.png",  // place in public/
    platform: "ios",
  },
  brand: {
    primary: "#E67E22",        // Your brand color
    primaryLight: "#FDF2E9",   // Light variant
    background: "#FAFAF8",     // App background
    surface: "#FFFFFF",        // Card backgrounds
    textPrimary: "#2D2D2D",
    textSecondary: "#6B7280",
    success: "#27AE60",
    danger: "#E74C3C",
  },
  video: {
    fps: 30,
    width: 1080,
    height: 1920,              // Portrait for App Store
    device: "iphone-15",      // or "iphone-16-pro", "pixel-9", "ipad-pro-13"
  },
  scenes: [/* ... */],
};
```

### Step 4: Preview and render

```bash
npm run dev          # Open Remotion Studio at localhost:3000
npm run build        # Render to out/AppPreview.mp4
```

## Device presets

- `iphone-16-pro` — 393×852, Dynamic Island
- `iphone-15` — 375×812, Dynamic Island
- `ipad-pro-13` — 1024×1366, no notch
- `pixel-9` — 412×915, punch hole

## Apple App Store video requirements

- iPhone 6.7": 886×1920 or 1920×886 (portrait/landscape)
- iPhone 6.1": 886×1920 or 1920×886
- iPad 13": 1200×1600 or 1600×1200
- Duration: 15-30 seconds
- Format: H.264, M4V/MP4/MOV

## Available components

All components accept brand colors via the `brand` prop:

- `PhoneFrame` — Realistic device frame with bezel, side buttons, notch/island
- `AmbientBackground` — Animated gradient + floating orbs background
- `Caption` — Bottom caption bar with word-by-word entrance animation
- `FadeIn` — Directional fade-in wrapper (up/down/left/right)
- `SceneWrap` — Automatic fade in/out between scenes
- `HeatMap` — GitHub-style contribution heat map (brand-colored)
- `AppIcon` — App icon with optional glow effect
- `AppStoreBadge` — iOS App Store / Google Play download badges

## Customization

Users can:
1. **Add custom scenes** — Create new `.tsx` files in `src/scenes/`, import in `AppPreview.tsx`
2. **Add custom components** — Create in `src/components/`, compose into scenes
3. **Use screenshots** — Import real app screenshots with `staticFile()` and display inside `PhoneFrame`
4. **Add audio** — Place `.mp3` in `public/`, reference in config as `backgroundMusic`

## Tips for great videos

- Keep it under 30 seconds — attention drops after 20s
- Lead with the pain point (dark, competitor world) then transition to your solution (warm, branded)
- Show the core loop in under 5 seconds
- End with a clear CTA and App Store badge
- Use your real app icon for brand recognition
- Caption every scene — many viewers watch without sound
