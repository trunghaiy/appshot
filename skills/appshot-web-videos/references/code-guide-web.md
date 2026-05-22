# Code Guide — Web Demo Video Generation

Reference for Phase 3 code generation. Read this before writing any scene files, orchestrator, or config.

## Project Location

**CRITICAL: Generate files inside the target project, NOT inside the appshot template directory.**

Scaffold an `appshot-video/` directory in the target project's root:

```
[target-project]/
├── appshot-video/          ← generated here
│   ├── package.json
│   ├── remotion.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   └── icon.png        ← copy app icon here
│   └── src/
│       ├── index.ts
│       ├── Root.tsx
│       ├── app-config.ts
│       ├── config.ts        ← copy from appshot template
│       ├── styles.css
│       ├── components/      ← copy all primitives from appshot template
│       │                      includes BrowserFrame, AnimatedCursor,
│       │                      ProgressBar, IconSet alongside existing primitives
│       ├── scenes/          ← generated custom scenes
│       └── ProductDemo.tsx  ← generated orchestrator
├── src/                     ← target app source (untouched)
└── ...
```

**Steps to scaffold:**

1. Create the `appshot-video/` directory in the target project root
2. Copy template scaffolding files (package.json, remotion.config.ts, tailwind.config.ts, tsconfig.json, src/styles.css, src/index.ts, src/config.ts) from the appshot template. If not locally available, write from appshot-core schema.
3. Copy ALL component primitives from `src/components/` into `appshot-video/src/components/`
4. Copy the app icon into `appshot-video/public/`
5. Copy the selected background music track into `appshot-video/public/music/`
6. Generate custom files (app-config.ts, scenes, orchestrator, Root.tsx)
7. Run `cd appshot-video && npm install`

**Never write generated scenes into the appshot repo's template/ directory.**

## Files to Generate

### 1. `src/app-config.ts`

```typescript
import type { AppConfig } from "./config";

export const appConfig: AppConfig = {
  app: {
    name: "...",
    tagline: "...",
    icon: "icon.png",
    platform: "web",
    url: "example.com",
  },
  brand: { /* from extraction */ },
  video: {
    fps: 30,
    width: 1920,      // Web: 1920x1080 landscape
    height: 1080,
    browser: "chrome-desktop",
    backgroundMusic: "music/upbeat-corporate.mp3",
    backgroundMusicVolume: 0.3,
  },
};
```

**Canvas is 1920×1080px.** All sizing rules below are calibrated for this width.

### 2. Scene files — CORRECT/WRONG patterns

**Imports:**
```tsx
import { AmbientBackground, BrowserFrame, AnimatedCursor, Caption, FadeIn, FloatingCard } from "../components";
import { appConfig } from "../app-config";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
// Only import what you use. Remove unused imports.
```

**Scene 1 — Frame 0 thumbnail rule:**
```tsx
// CORRECT — FloatingCard visible at frame 0
export const S1_Hook: React.FC = () => {
  const { brand } = appConfig;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="dark" />
      <div className="relative z-10">
        <FloatingCard delay={0} variant="dark" style={{ width: 900, padding: 40 }}>
          <span style={{ fontSize: 48, fontWeight: 700, color: brand.textPrimary }}>
            Your workflow is broken.
          </span>
        </FloatingCard>
      </div>
      <Caption text="There's a better way." delay={5} maxWidth={1200} fontSize={38} />
    </div>
  );
};

// WRONG — TypeWriter first (0-1 chars at frame 0 = blank)
// WRONG — spring({ frame: frame - 70 }) first (blank for 70 frames)
// WRONG — FadeIn delay={8} as ONLY element (blank for 8 frames)
```

**BrowserFrame scale (1920x1080 canvas):**
```tsx
// CORRECT — scale 0.85 fills ~75-90% of 1920px canvas
<BrowserFrame url="app.example.com" delay={5} scale={0.85}>
  <div style={{ width: 1440, height: 810 }}>
    {/* Mock UI content */}
  </div>
</BrowserFrame>

// WRONG — scale above 1.0 (overflows canvas)
// WRONG — no scale (too large, may overflow)
// WRONG — scale below 0.6 (too small, content unreadable)
// Range: 0.7-0.95. Default: 0.85.
```

**AnimatedCursor usage:**
```tsx
// CORRECT — cursor in positioned parent containing BrowserFrame
<div className="relative">
  <BrowserFrame url="app.example.com" delay={5} scale={0.85}>
    <div style={{ width: 1440, height: 810 }}>
      {/* UI content with clickable elements */}
    </div>
  </BrowserFrame>
  <AnimatedCursor
    keyframes={[
      { frame: 30, x: 720, y: 400 },
      { frame: 50, x: 350, y: 280, click: true },
      { frame: 80, x: 800, y: 350 },
      { frame: 100, x: 800, y: 420, click: true },
    ]}
  />
</div>

// WRONG — cursor outside the BrowserFrame parent (misaligned positions)
// WRONG — more than 5 keyframes (jerky). Use 3-5 per scene.
// WRONG — no click keyframes (cursor just floats, looks broken)
// WRONG — cursor in a scene without BrowserFrame (no context for mouse)
```

**Text sizes (1920x1080 canvas):**
```tsx
// OUTSIDE BrowserFrame (actual canvas pixels):
// Headlines: 42-56px
// Body/subheadlines: 24-32px
// Labels/secondary: 18-22px
// Stats/numbers: 56-72px
// Cards: 800px+ width, 900-1200px for primary cards

// INSIDE BrowserFrame (relative to 1440px viewport):
// Navigation text: 14-16px
// Body text: 14-18px
// Headings: 20-28px
// Sidebar items: 13-15px
// Button text: 14-16px
```

**Caption for 1920x1080:**
```tsx
<Caption text="Your caption here." delay={5} maxWidth={1200} fontSize={38} />
// maxWidth 1200 prevents edge-to-edge stretching
// fontSize 38-44 reads well at 1080p
```

**Text contrast:**
```tsx
// CORRECT
<span style={{ color: brand.textPrimary }}>Title</span>
<div style={{ color: brand.textPrimary }}>
  <TypeWriter text="..." startFrame={20} cursorColor={brand.primary} />
</div>

// WRONG — no color (inherits black, invisible on dark bg)
<TypeWriter text="..." startFrame={20} className="leading-relaxed" />
```

**CTA scene (NO AppStoreBadge):**
```tsx
// CORRECT — custom web CTA
export const S_CTA: React.FC = () => {
  const { brand } = appConfig;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const buttonEnter = spring({ frame, fps, delay: 25, config: { mass: 1.2, damping: 14, stiffness: 90 } });
  const pulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.95, 1.05]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="dark" />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <AppIcon src={appConfig.app.icon} size={80} glow glowColor={`${brand.primary}55`} />
        <span style={{ fontSize: 52, fontWeight: 800, color: "#FFFFFF" }}>
          {appConfig.app.name}
        </span>
        <div style={{
          opacity: buttonEnter,
          transform: `scale(${pulse})`,
          padding: "16px 48px",
          borderRadius: 12,
          background: brand.primary,
          fontSize: 22,
          fontWeight: 700,
          color: "#FFFFFF",
        }}>
          Start Free
        </div>
        <span style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>
          {appConfig.app.url}
        </span>
      </div>
    </div>
  );
};

// WRONG — using AppStoreBadge (web product, not a mobile app)
// WRONG — CTA says "Download" (web apps don't download)
// WRONG — no CTA button (just a logo)
```

**AppIcon — no staticFile():**
```tsx
// CORRECT
<AppIcon src={appConfig.app.icon} size={80} glow glowColor={`${brand.primary}55`} />

// WRONG — crashes: "already prefixed with static base"
<AppIcon src={staticFile(appConfig.app.icon)} />
```

**Audio — staticFile() only here:**
```tsx
<Audio src={staticFile("music.mp3")} volume={0.3} />
// AppIcon handles staticFile internally — never wrap it.
```

### 3. Orchestrator

```tsx
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { SceneWrap } from "./components";
import { appConfig } from "./app-config";
// import scenes...

const scenes = [
  { component: S1_Intro, duration: 150 },
  { component: S2_Setup, duration: 300 },
  // ...
];

export const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

export const ProductDemo: React.FC = () => {
  let offset = 0;
  return (
    <AbsoluteFill style={{ background: "#080B14" }}>
      {appConfig.video.backgroundMusic && (
        <Audio src={staticFile(appConfig.video.backgroundMusic)} volume={appConfig.video.backgroundMusicVolume ?? 0.3} />
      )}
      {scenes.map(({ component: Scene, duration }, i) => {
        const from = offset;
        offset += duration;
        const isFirst = i === 0;
        const isLast = i === scenes.length - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            <SceneWrap durationInFrames={duration} fadeIn={!isFirst} fadeOut={!isLast}>
              <Scene />
            </SceneWrap>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
```

**CRITICAL: `fadeIn={!isFirst}` and `fadeOut={!isLast}` on SceneWrap. Without this, frame 0 is black.**

**Key difference from mobile:** No `device` prop. Scenes don't receive a device preset. Single composition.

### 4. Root.tsx

```tsx
import { Composition } from "remotion";
import { ProductDemo, TOTAL_DURATION } from "./ProductDemo";
import { appConfig } from "./app-config";
import "./styles.css";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ProductDemo"
    component={ProductDemo}
    durationInFrames={TOTAL_DURATION}
    fps={appConfig.video.fps}
    width={appConfig.video.width}
    height={appConfig.video.height}
  />
);
```

Single composition. No store variants.

## UI Mockup Guidelines

Layout patterns for BrowserFrame content (1440px viewport):

- **Dashboard:** 240-280px sidebar + fluid main. Sidebar: dark/light bg, nav with Icon + label.
- **Editor/document:** optional sidebar (200px) + main (flex-1) + optional right panel (280px).
- **Settings/form:** centered 600-800px, stacked fields.
- **Landing page:** full-width hero, feature grid.
- **List/table:** header bar + scrollable list.

**Visual polish checklist:**

- Glassmorphic cards: `backdrop-filter: blur(20px)`, rgba background, subtle border
- Brand color on interactive elements
- Gradient text for prominent headlines
- Shadow depth: `0 4px 12px rgba(0,0,0,0.08)`
- Rounded corners: 8-12px cards, 6-8px inputs, 4-6px badges
- 16px/24px/32px spacing rhythm

**Animation density:** 3-4 animated elements per scene:

- BrowserFrame entrance (spring)
- 1-2 content animations (FadeIn, TypeWriter, counter interpolation)
- Caption word-by-word
- Optional: AnimatedCursor

**Mock data rules:**

- Realistic names, plausible numbers
- Pull from extraction: actual feature names, routes, brand terminology
- Never "Lorem ipsum"

## Code Quality Rules

- Every scene: self-contained `.tsx` in `src/scenes/`, max ~150 lines
- Tailwind for layout, `style={}` for dynamic/brand-colored properties
- All motion: Remotion `spring()` or `interpolate()` — no CSS transitions
- Demo data: realistic names, plausible numbers, proper formatting
- Remove unused imports

## Pre-Write Checklist

- [ ] Scene order matches Phase 2 approval
- [ ] All text matches Phase 2 copy (verbatim)
- [ ] Brand colors from extraction, not template defaults
- [ ] Each BrowserFrame scene mocks actual product UI from extraction

## Post-Write Self-Check

**Orchestrator:**
- [ ] `fadeIn={!isFirst}` and `fadeOut={!isLast}` on every SceneWrap
- [ ] `TOTAL_DURATION` exported and used in Root.tsx
- [ ] Background audio via `staticFile()`

**Config:**
- [ ] `video.width` is `1920`, `video.height` is `1080`
- [ ] `app.platform` is `"web"`
- [ ] No `device` field

**Each scene:**
1. **S1 frame 0:** Fully visible element at frame 0? FAIL if TypeWriter first, `frame - N` first, or all delayed FadeIns.
2. **BrowserFrame scale:** 0.8-0.95 range? Missing scale = bug.
3. **Text outside BrowserFrame:** Headlines under 42px = too small. Cards under 800px = too narrow.
4. **Text inside BrowserFrame:** Body under 14px = too small at 1440 viewport.
5. **Text contrast:** Every `color:` traced against its `background:`. Both dark = bug. TypeWriter needs explicit color via parent style.
6. **AnimatedCursor:** Inside positioned parent with BrowserFrame? Keyframe positions align with UI elements? 3-5 keyframes max?
7. **Caption:** `maxWidth={1200}`, `fontSize={38-44}`? Present in every scene?
8. **No AppStoreBadge:** Web videos must NOT use store badges.
9. **No PhoneFrame:** Web videos must NOT use device frames.
10. **staticFile:** Only in `<Audio>` or raw `<img>`. Never on `<AppIcon>`.
11. **Unused imports removed.**
