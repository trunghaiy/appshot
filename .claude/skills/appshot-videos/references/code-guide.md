# Code Guide — Appshot Video Generation

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
│       ├── scenes/          ← generated custom scenes
│       └── [AppName]Preview.tsx  ← generated orchestrator
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
    icon: "icon.png",     // just the filename, NOT staticFile()
    platform: "ios",
  },
  brand: { /* from extraction */ },
  video: {
    fps: 30,
    width: 886,      // App Store REQUIRED: 886x1920. Do NOT use 1080.
    height: 1920,
    device: "iphone-16-pro",
    backgroundMusic: "music/warm-inspiring.mp3",  // from bundled tracks
    backgroundMusicVolume: 0.25,
  },
};
```

**Canvas is 886×1920px.** All sizing rules below are calibrated for this width.

### 2. Scene files — CORRECT/WRONG patterns

**Imports:**
```tsx
import { AmbientBackground, PhoneFrame, Caption, FadeIn, FloatingCard } from "../components";
import { appConfig } from "../app-config";
import type { DevicePreset } from "../config";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
// Only import what you use. Remove unused imports.
```

**Scene 1 — Frame 0 thumbnail rule:**
```tsx
// CORRECT — FloatingCard visible at frame 0
export const S1_Hook: React.FC<{ device: DevicePreset }> = ({ device }) => {
  const { brand } = appConfig;
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="dark" />
      <div className="relative z-10">
        <FloatingCard delay={0} variant="dark" style={{ width: 740, padding: 32 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: brand.textPrimary }}>
            Your best ideas disappear.
          </span>
        </FloatingCard>
      </div>
      <Caption text="Great ideas deserve better." delay={5} />
    </div>
  );
};

// WRONG — TypeWriter first (0-1 chars at frame 0 = blank)
// WRONG — spring({ frame: frame - 70 }) first (blank for 70 frames)
// WRONG — FadeIn delay={8} as ONLY element (blank for 8 frames)
```

**PhoneFrame scale:**
```tsx
// CORRECT — scale 1.5 fills ~67% of 886px canvas. Range: 1.4-1.6.
<PhoneFrame device={device} scale={1.5} screenBackground={brand.background}>

// WRONG — scale 1.8 overflows 886px canvas
// WRONG — missing scale (defaults to 1.0, tiny phone)
```

**Text sizes (886px canvas):**
```tsx
// INSIDE PhoneFrame (zoomed by scale):
// Body: 13-16px, Titles: 18-24px, Labels: 10-12px

// OUTSIDE PhoneFrame (actual pixel size):
// Body: 24px+, Titles: 34px+, Labels: 20px+, Stats: 42px+
// Cards: 700px+ width, Emoji: 36px+
```

**Caption positioning:**
```tsx
<Caption text="Your caption here." delay={5} maxWidth={720} />
// maxWidth 720 keeps caption within safe area on 886px canvas.
// If PhoneFrame overlaps caption, reduce phone scale.
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

**AppIcon — no staticFile():**
```tsx
// CORRECT
<AppIcon src={appConfig.app.icon} size={140} glow glowColor={`${brand.primary}55`} />

// WRONG — crashes: "already prefixed with static base"
<AppIcon src={staticFile(appConfig.app.icon)} />
```

**Audio — staticFile() only here:**
```tsx
<Audio src={staticFile("music.mp3")} volume={0.3} />
// AppIcon, AppStoreBadge handle staticFile internally — never wrap them.
```

### 3. Orchestrator

```tsx
import { Sequence } from "remotion";
import { SceneWrap } from "./components";
import { S1_Hook } from "./scenes/S1_Hook";
import { S2_CoreFeature } from "./scenes/S2_CoreFeature";
import { S3_Proof } from "./scenes/S3_Proof";
import { S4_CTA } from "./scenes/S4_CTA";
import type { DevicePreset } from "./config";

const scenes = [
  { component: S1_Hook, duration: 120 },
  { component: S2_CoreFeature, duration: 150 },
  { component: S3_Proof, duration: 150 },
  { component: S4_CTA, duration: 120 },
];

export const TOTAL_DURATION = scenes.reduce((sum, s) => sum + s.duration, 0);

export const FooAppPreview: React.FC<{ device: DevicePreset }> = ({ device }) => {
  let offset = 0;
  return (
    <>
      {scenes.map(({ component: Scene, duration }, i) => {
        const from = offset;
        offset += duration;
        const isFirst = i === 0;
        const isLast = i === scenes.length - 1;
        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            {/* CRITICAL: fadeIn={false} on first scene prevents black frame 0 */}
            <SceneWrap durationInFrames={duration} fadeIn={!isFirst} fadeOut={!isLast}>
              <Scene device={device} />
            </SceneWrap>
          </Sequence>
        );
      })}
    </>
  );
};
```

**CRITICAL: `fadeIn={!isFirst}` and `fadeOut={!isLast}` on SceneWrap. Without this, frame 0 is black.**

### 4. Root.tsx

```tsx
import { Composition } from "remotion";
import { FooAppPreview, TOTAL_DURATION } from "./FooAppPreview";
import { appConfig } from "./app-config";
import type { DevicePreset } from "./config";
import "./styles.css";

const STORE_DEVICE: Record<string, DevicePreset> = {
  AppStore: "iphone-16-pro",
  PlayStore: "pixel-9",
};

// For single-store: use just ["AppStore"] or ["PlayStore"]
// For both: use ["AppStore", "PlayStore"]
const targetStores = ["AppStore", "PlayStore"];

export const RemotionRoot: React.FC = () => (
  <>
    {targetStores.map((store) => (
      <Composition
        key={store}
        id={`FooAppPreview-${store}`}
        component={FooAppPreview}
        defaultProps={{ device: STORE_DEVICE[store] }}
        durationInFrames={TOTAL_DURATION}
        fps={appConfig.video.fps}
        width={appConfig.video.width}
        height={appConfig.video.height}
      />
    ))}
  </>
);
```

## Code Quality Rules

- Every scene: self-contained `.tsx` in `src/scenes/`, max ~150 lines
- Tailwind for layout, `style={}` for brand-colored/dynamic properties
- All motion: Remotion `spring()` or `interpolate()` — no CSS transitions
- Demo data: realistic names, plausible numbers, proper formatting
- Status bar: "9:41" for App Store (iPhone), "12:30" for Play Store (Pixel)
- Remove unused imports

## Pre-Write Checklist

- [ ] Scene order matches Phase 2 approval
- [ ] All text matches Phase 2 copy (verbatim)
- [ ] Brand colors from extraction, not template defaults
- [ ] Each scene mocks actual app UI from extraction

## Post-Write Self-Check

**Orchestrator:**
- [ ] `fadeIn={!isFirst}` and `fadeOut={!isLast}` on every SceneWrap
- [ ] `TOTAL_DURATION` exported and used in Root.tsx

**Config:**
- [ ] `video.width` is `886`

**Each scene:**
1. **S1 frame 0:** Fully visible element at frame 0? FAIL if TypeWriter first, `frame - N` first, or all delayed FadeIns.
2. **PhoneFrame scale:** `scale={1.5}` present? Missing scale = bug.
3. **Text outside PhoneFrame:** Body under 24px or titles under 34px = too small.
4. **Card widths outside PhoneFrame:** Under 700px = too narrow.
5. **Text contrast:** Every `color:` traced against its `background:`. Both dark = bug. TypeWriter needs explicit color via parent style.
6. **Caption overlap:** PhoneFrame at 1.5+ scale may overlap Caption. Add `maxWidth={720}` if tight.
7. **staticFile:** Only in `<Audio>` or raw `<img>`. Never near `<AppIcon`.
8. **Unused imports:** Remove `spring`, `interpolate`, etc. if not used.
9. **Caption present:** Every scene has `<Caption>`.
10. **Multi-store Root.tsx:** One `<Composition>` per target store with correct `defaultProps={{ device }}`?
11. **CTA badge:** `AppStoreBadge platform` matches target store (`"ios"` for AppStore, `"android"` for PlayStore)?
12. **Device prop threading:** Orchestrator accepts `{ device: DevicePreset }`, passes to each scene, scenes pass to `<PhoneFrame>`?
