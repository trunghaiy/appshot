---
name: appshot-core
description: Foundation skill for Appshot. Defines the Remotion project architecture, primitives library, config schema, device presets, and store requirements. Referenced by appshot-videos and appshot-images skills.
license: MIT
metadata:
  author: kiennguyen
  version: 2.0.0
---

# Appshot Core — Foundation

Reference skill for all Appshot skills. Read this before executing `appshot-videos` or `appshot-images`.

## Architecture

- **Remotion 4.0** + React 18 + Tailwind CSS 3.4
- Config defines app metadata and brand only — scenes are custom `.tsx` files, not config entries
- Each project has an orchestrator component (e.g., `FooPreview.tsx`) that sequences custom scenes via Remotion `<Sequence>` + `<SceneWrap>`
- All primitives are brand-aware via a `brand` prop derived from the config's `BrandColors`

## Project Structure

```
src/
  app-config.ts         # App metadata, brand colors, video settings
  Root.tsx              # Remotion entry — registers the composition
  [AppName]Preview.tsx  # Orchestrator — sequences scenes with <Sequence> + <SceneWrap>
  scenes/
    S1_[Name].tsx       # Custom scene components (one per scene)
    S2_[Name].tsx
    ...
  components/           # Shared primitives library (imported from template)
    PhoneFrame.tsx
    AmbientBackground.tsx
    Caption.tsx
    FadeIn.tsx
    SceneWrap.tsx
    HeatMap.tsx
    AppIcon.tsx
    AppStoreBadge.tsx
    TypeWriter.tsx
    StatCard.tsx
    FloatingCard.tsx
    index.ts
  config.ts             # Type definitions, device dimensions, defaults
public/
  icon.png              # App icon
  *.png                 # Screenshots, assets
```

## Config Schema

The config holds app identity, brand colors, and video settings. It does NOT contain scenes — scenes are custom components.

```typescript
interface AppConfig {
  app: {
    name: string;        // Display name
    tagline: string;     // One-line value prop
    icon: string;        // Filename in public/
    platform: "ios" | "android" | "both";
  };
  brand: BrandColors;
  video: {
    fps: number;         // 30
    width: number;       // 1080
    height: number;      // 1920
    device: DevicePreset;
    backgroundMusic?: string;       // Filename in public/
    backgroundMusicVolume?: number; // 0-1
  };
}

interface BrandColors {
  primary: string;       // Main brand color (hex)
  primaryLight: string;  // Tinted background
  background: string;    // App background
  surface: string;       // Card/container background
  textPrimary: string;   // Main text
  textSecondary: string; // Secondary/muted text
  success: string;       // Positive states
  danger: string;        // Destructive/error states
  accent?: string;       // Optional secondary brand color
}
```

## Primitives Library

Every component below is available in `src/components/`. Import from `"../components"`.

### PhoneFrame

Device mockup with bezel, side buttons, and notch/Dynamic Island. Wraps any content to look like a real phone screen.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Screen content |
| `device` | `DevicePreset` | `"iphone-15"` | Device model |
| `delay` | `number` | `0` | Entrance animation delay (frames) |
| `scale` | `number` | `1` | Scale multiplier |
| `screenBackground` | `string` | `"#FAFAF8"` | Background color inside the screen |

**When to use:** Any scene showing app UI inside a phone. The core visual anchor for mobile app videos.

### AmbientBackground

Animated gradient background with floating blurred orbs. Sets the mood for each scene.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brand` | `BrandColors` | required | Colors for gradient and orbs |
| `variant` | `"light" \| "medium" \| "deep" \| "dark"` | `"light"` | Intensity/mood |

**When to use:** Behind every scene. Use `"light"` or `"medium"` for feature/solution scenes, `"dark"` for problem/contrast scenes, `"deep"` for emotional/proof scenes.

### Caption

Bottom-anchored text overlay with word-by-word entrance animation. Dark pill background for readability.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Caption text (max 8 words) |
| `delay` | `number` | `0` | Entrance delay (frames) |
| `fontSize` | `number` | `44` | Font size in px |
| `maxWidth` | `number` | `820` | Maximum container width |

**When to use:** Every scene should have one. Captions tell the story for sound-off viewers.

### FadeIn

Wraps any element with a directional fade-in animation using Remotion spring.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to animate |
| `delay` | `number` | `0` | Start frame |
| `direction` | `"up" \| "down" \| "left" \| "right" \| "none"` | `"up"` | Slide direction |
| `distance` | `number` | `40` | Slide distance in px |
| `className` | `string` | — | Tailwind classes |
| `style` | `CSSProperties` | — | Inline styles |

**When to use:** Stagger card reveals, headline entrances, any element that should animate in.

### SceneWrap

Wraps each scene with fade-in/fade-out transitions (12 frames each). Used by the orchestrator.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Scene content |
| `durationInFrames` | `number` | required | Total scene duration |
| `fadeIn` | `boolean` | `true` | Enable fade-in |
| `fadeOut` | `boolean` | `true` | Enable fade-out |

**When to use:** In the orchestrator component, wrap each scene inside `<Sequence>` + `<SceneWrap>`.

### HeatMap

GitHub-style contribution grid that fills cell-by-cell. Brand-colored ramp from `primaryLight` to `primary`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `brand` | `BrandColors` | required | Color ramp source |
| `delay` | `number` | `0` | Animation start frame |
| `weeks` | `number` | `13` | Number of columns |
| `days` | `number` | `7` | Number of rows |
| `cellSize` | `number` | `18` | Cell size in px |
| `gap` | `number` | `3` | Gap between cells |
| `monthLabels` | `string[]` | `["Jan","Feb","Mar","Apr"]` | Column group labels |

**When to use:** Habit/consistency tracking apps, activity visualization, any app where showing daily engagement patterns makes sense.

### AppIcon

Renders the app icon with optional animated glow effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Filename in `public/` or URL |
| `size` | `number` | `120` | Icon size in px |
| `glow` | `boolean` | `false` | Enable pulsing glow |
| `glowColor` | `string` | `"rgba(0,122,255,0.4)"` | Glow color |

**When to use:** CTA/closing scenes. Builds brand recognition.

### AppStoreBadge

iOS App Store and/or Google Play download badge.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `platform` | `"ios" \| "android" \| "both"` | `"ios"` | Which badge(s) to show |
| `delay` | `number` | `0` | Entrance delay (frames) |

**When to use:** CTA/closing scene. Badge should be visible for 2+ seconds.

### TypeWriter

Character-by-character text reveal with optional blinking cursor.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | required | Full text to type out |
| `startFrame` | `number` | required | Frame to begin typing |
| `charsPerFrame` | `number` | `2` | Typing speed |
| `className` | `string` | — | Tailwind classes |
| `cursor` | `boolean` | `true` | Show blinking cursor |
| `cursorColor` | `string` | `"#2196F3"` | Cursor color |

**When to use:** Search bars, text inputs, chat messages, anywhere you want to simulate user typing.

### StatCard

Before/after stat comparison card with animated counter transition.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Stat name (e.g., "Weekly sessions") |
| `before` | `number` | required | Starting value (crossed out) |
| `after` | `number` | required | Target value (animated counter) |
| `suffix` | `string` | `""` | Unit suffix (e.g., "%", "+", "hrs") |
| `delay` | `number` | `0` | Entrance delay (frames) |
| `brand` | `BrandColors` | required | Colors for text and accent |

**When to use:** Proof/outcome scenes showing measurable improvement. Good for before/after transformations.

### FloatingCard

Animated card container with glass, solid, or dark variants. Spring entrance animation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Card content |
| `delay` | `number` | `0` | Entrance delay (frames) |
| `variant` | `"glass" \| "solid" \| "dark"` | `"glass"` | Visual style |
| `className` | `string` | — | Tailwind classes |
| `style` | `CSSProperties` | — | Override styles |

**When to use:** Feature cards, info panels, any floating UI element that needs a polished container.

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

Default output is 1080x1920. For App Store submission, set `video.width` to 886.

### Screenshots

| Platform | Dimensions | Required |
|----------|-----------|----------|
| iPhone 6.7" | 1290x2796 | Yes |
| iPhone 6.5" | 1242x2688 | Optional |
| iPad 13" | 2064x2752 | Optional |
| Android | 1080x1920 (min) | Recommended |

## Project Setup

```bash
npx create-appshot my-app-video
cd my-app-video
npm run dev     # Preview at localhost:3000
npm run build   # Render to out/AppPreview.mp4
```

## Orchestrator Pattern

The orchestrator sequences scenes using Remotion `<Sequence>` and wraps each with `<SceneWrap>` for fade transitions.

```tsx
import { Composition, Sequence } from "remotion";
import { SceneWrap } from "./components";
import { S1_Hook } from "./scenes/S1_Hook";
import { S2_Feature } from "./scenes/S2_Feature";
import { S3_CTA } from "./scenes/S3_CTA";

const scenes = [
  { component: S1_Hook, duration: 120 },
  { component: S2_Feature, duration: 150 },
  { component: S3_CTA, duration: 120 },
];

export const AppPreview: React.FC = () => {
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

## Shared Resources

- Copy principles: [copy-principles.md](../shared/copy-principles.md)
- App context extraction: [extract-app-context.md](../shared/extract-app-context.md)
