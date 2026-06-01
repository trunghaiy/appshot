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

### 5. Full-screen mode (App Store Preview target)

When the user selects the **App Store Preview** target, scenes must NOT use PhoneFrame. Instead, the app UI fills the entire 886×1920 canvas.

```tsx
// CORRECT — App Store Preview: full-bleed app screen
export const S2_Feature: React.FC = () => {
  const { brand } = appConfig;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden"
         style={{ background: brand.background }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-8 pt-4" style={{ height: 54 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
        <StatusBarIcons color={brand.textPrimary} />
      </div>

      {/* Navigation bar */}
      <div className="flex items-center justify-between px-6" style={{ height: 56 }}>
        <span style={{ fontSize: 34, fontWeight: 700, color: brand.textPrimary }}>Library</span>
        <span style={{ fontSize: 28, color: brand.primary }}>＋</span>
      </div>

      {/* App content area — your mock UI goes here */}
      <div className="flex-1 px-6 pt-4">
        {/* ... realistic app content ... */}
      </div>

      {/* Tab bar */}
      <div className="flex items-center justify-around border-t px-4 pb-8 pt-2"
           style={{ borderColor: `${brand.textSecondary}20`, background: brand.surface }}>
        <div className="flex flex-col items-center gap-1">
          <span style={{ fontSize: 11, color: brand.primary, fontWeight: 600 }}>Home</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span style={{ fontSize: 11, color: brand.textSecondary }}>Search</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span style={{ fontSize: 11, color: brand.textSecondary }}>Profile</span>
        </div>
      </div>

      {/* Home indicator */}
      <div className="flex justify-center pb-2">
        <div style={{ width: 134, height: 5, borderRadius: 3, background: brand.textPrimary, opacity: 0.2 }} />
      </div>

      {/* Caption overlays on top of app UI */}
      <Caption text="Your entire library, organized." delay={5} />
    </div>
  );
};

// WRONG — Using PhoneFrame in App Store Preview mode
<PhoneFrame device={device} scale={1.5}>...</PhoneFrame>

// WRONG — No status bar or tab bar (looks like a cropped UI fragment, not a real app)
<div style={{ background: brand.background }}>
  <h1>Library</h1>
  {/* ... just content, no chrome ... */}
</div>
```

**Text sizes for full-screen mode (886px canvas):**
```tsx
// Status bar time: 17px, weight 600
// Nav bar large title: 34px, weight 700
// Nav bar inline title: 20px, weight 600
// Body text: 17-20px
// Tab bar labels: 11-12px
// Caption: unchanged (44px default, overlaid with pill background)
```

**Navigation chrome reference:**
Use the extracted `navigation` data from `.appshot-context.json` for tab labels, icon descriptions, header style, and status bar style. The chrome must match the actual app — don't invent navigation that doesn't exist.

- **iOS status bar**: "9:41" left, signal + wifi + battery icons right. Use `<StatusBarIcons>` from components.
- **iOS large title nav bar**: 34px bold title, left-aligned. Optional right action button.
- **iOS inline nav bar**: 20px semibold title, centered. Back arrow left, action right.
- **iOS tab bar**: Icon + label per tab, active tab in `brand.primary`, inactive in `brand.textSecondary`. Bottom safe area padding.
- **iOS home indicator**: 134×5px rounded bar, centered, 20% opacity.
- **Android status bar**: "12:30" left, icons right.
- **Android bottom navigation**: Same concept as iOS tab bar, Material style.

**Marketing target:** Continue using PhoneFrame as in sections 2-4 above. Navigation chrome inside the phone is nice-to-have.

### 6. Screenshots are reference material, not content

**CRITICAL: Never use `<Img>` to embed a user-provided screenshot directly into a scene.** Screenshots are visual references that inform how to build animated mock UI — they are NOT content to be rendered in the output.

Why: AppShot's value is animated, living mock UI — elements entering with spring animations, counters ticking, waveforms pulsing, text typing in. A static screenshot with a Ken Burns zoom is just a slideshow. Build the mock JSX so it looks like the screenshot but can animate.

**The workflow:**
1. User provides screenshots → visual reference analysis produces a `visualSpec` for each
2. The `visualSpec` documents exact colors, component shapes, spacing, typography
3. Scene code builds animated mock UI that matches the `visualSpec` pixel-for-pixel
4. The result looks like the real app AND has motion

```tsx
// CORRECT — Animated mock UI built from visualSpec of recording.png
// The scene LOOKS like the screenshot but elements animate in
export const S2_Record: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const waveformProgress = interpolate(frame, [10, 80], [0, 1], { extrapolateRight: "clamp" });
  const timerSeconds = Math.floor(interpolate(frame, [0, 150], [0, 5], { extrapolateRight: "clamp" }));

  return (
    <div style={{ background: "#0A1628", height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-7 pt-3" style={{ height: 50 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#E8ECF1" }}>9:41</span>
        <StatusBarIcons color="#E8ECF1" />
      </div>

      {/* Nav — 48px rounded-square back button matching visualSpec */}
      <FadeIn delay={0} direction="down">
        <div className="flex items-center px-5" style={{ height: 56 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1A2940",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#E8ECF1", fontSize: 20 }}>‹</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 600, color: "#E8ECF1", marginLeft: 12 }}>Voice Recording</span>
        </div>
      </FadeIn>

      {/* Recording indicator — animates in */}
      <FadeIn delay={8} direction="none" className="flex flex-col items-center pt-20">
        <div className="flex items-center gap-2">
          <div style={{ width: 10, height: 10, borderRadius: 5,
                        background: "#FF4444", opacity: 0.5 + Math.sin(frame * 0.15) * 0.5 }} />
          <span style={{ fontSize: 16, color: "#FF6B6B", fontWeight: 500 }}>Recording</span>
        </div>
      </FadeIn>

      {/* Animated waveform — bars grow over time */}
      <div className="flex items-center justify-center px-12 pt-8" style={{ height: 80 }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const barHeight = Math.sin(i * 0.5 + frame * 0.1) * 20 + 25;
          const visible = i / 40 < waveformProgress;
          return (
            <div key={i} style={{
              width: 4, height: visible ? barHeight : 2, marginRight: 3,
              background: "#3BB8E0", borderRadius: 2,
              transition: "height 0.1s",
            }} />
          );
        })}
      </div>

      {/* Animated timer */}
      <div className="flex justify-center pt-6">
        <span style={{ fontSize: 72, fontWeight: 300, color: "#E8ECF1", fontVariantNumeric: "tabular-nums" }}>
          {`0${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, "0")}`}
        </span>
      </div>

      <Caption text="Record thoughts in one tap." delay={5} />
    </div>
  );
};

// WRONG — Embedding screenshot as static image
<Img src={staticFile("screens/recording.png")} style={{ width: "100%", height: "100%" }} />

// WRONG — Generic mock UI that ignores the visualSpec
<div style={{ background: brand.background }}>
  <span className="text-white text-sm">← VOICE RECORDING</span>
  {/* ... looks nothing like the real app ... */}
</div>
```

**What can animate in mock scenes:**
- Waveform bars growing/pulsing
- Timer counting up
- Recording indicator pulsing
- Cards sliding in with `FadeIn` or `spring()`
- Text typing in with `TypeWriter`
- Counters incrementing with `StatCard`
- Progress bars filling
- Elements appearing in sequence (staggered `delay`)

## Code Quality Rules

- Every scene: self-contained `.tsx` in `src/scenes/`, max ~150 lines
- Tailwind for layout, `style={}` for brand-colored/dynamic properties
- All motion: Remotion `spring()` or `interpolate()` — no CSS transitions
- Demo data: realistic names, plausible numbers, proper formatting
- Status bar: "9:41" for App Store (iPhone), "12:30" for Play Store (Pixel)
- Remove unused imports

## Matching the App's Visual Language

### Visual spec is the source of truth

**CRITICAL: When screenshots are provided, the `visualSpec` from the screenshot analysis is the primary reference for mock UI — not `uiPatterns`, not `brand` colors, not your assumptions.** The visual spec documents exact colors, component shapes, spacing, and typography sampled directly from the real app. If the visual spec says the background is `#0A1628` but `brand.background` says `#1A1A2E`, use `#0A1628`.

**Before writing ANY mock scene**, check if a screenshot exists for that screen (or a similar screen) in `.appshot-context.json`. If it does:
1. Read the `visualSpec` for that screenshot
2. Use the exact colors, border radii, spacing, and component styles from the spec
3. Replicate the layout structure described in the spec (vertical proportions, section order)
4. Match typography exactly: font size, weight, case, letter-spacing

If no screenshot exists for the scene, use `visualSpec` from the most visually similar screenshot as a style reference — the overall app style (colors, card shapes, button styles) should stay consistent across scenes even when the content differs.

### Example: mock scene WITH visual spec vs WITHOUT

```tsx
// CORRECT — uses exact values from visualSpec of transcription.png
// visualSpec says: bg #0A1628, cards #1A2940 with 1px #2A3A50 border,
// 16px radius, back button is 48px rounded-square, section headers
// are ALL CAPS 13px teal with 1px letter-spacing
export const S2_Transcription: React.FC = () => {
  return (
    <div style={{ background: "#0A1628", height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-7 pt-3" style={{ height: 50 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: "#E8ECF1" }}>9:41</span>
        <StatusBarIcons color="#E8ECF1" />
      </div>

      {/* Nav bar — 48px rounded-square back button, icon actions right */}
      <div className="flex items-center justify-between px-5" style={{ height: 56 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1A2940",
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#E8ECF1", fontSize: 20 }}>‹</span>
        </div>
        <div className="flex gap-4">
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1A2940",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#E8ECF1", fontSize: 16 }}>⋯</span>
          </div>
        </div>
      </div>

      {/* Type badge */}
      <div className="px-5 pt-3">
        <span style={{ background: "#1A3A28", color: "#E5C044", fontSize: 13, fontWeight: 600,
                        padding: "4px 12px", borderRadius: 8 }}>🎙 Voice Recording</span>
      </div>

      {/* Title */}
      <div className="px-5 pt-3">
        <span style={{ fontSize: 32, fontWeight: 700, color: "#E8ECF1" }}>Client strategy call</span>
      </div>

      {/* Section header — ALL CAPS, teal, letter-spacing */}
      <div className="px-5 pt-6">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#3BB8E0",
                        textTransform: "uppercase", letterSpacing: 1 }}>TRANSCRIPTION</span>
      </div>

      {/* ... content matching visual spec ... */}

      <Caption text="AI transcribes in 47 languages." delay={5} />
    </div>
  );
};

// WRONG — ignores visual spec, uses generic styling
export const S2_Transcription: React.FC = () => {
  const { brand } = appConfig;
  return (
    <div style={{ background: brand.background }} className="flex flex-col h-full">
      {/* Generic nav with tiny back arrow */}
      <div className="flex items-center px-4 pt-4">
        <span style={{ color: brand.textPrimary }}>←</span>
        <span style={{ fontSize: 14, color: brand.textSecondary, marginLeft: 8 }}>VOICE RECORDING</span>
      </div>
      {/* Generic title — wrong size, wrong weight, wrong color */}
      <h1 className="px-4 pt-2 text-xl font-bold text-white">Client strategy call</h1>
      {/* Generic section header — not ALL CAPS, not teal, no letter-spacing */}
      <span className="px-4 pt-4 text-sm text-gray-400">Transcription</span>
      {/* ... generic content that doesn't match the app ... */}
    </div>
  );
};
```

### Fallback: no screenshots provided

When building mock UI without screenshots, use the extracted `uiPatterns` from `.appshot-context.json`:

- **Border radius**: If the app uses pill buttons (`borderRadius: 9999`), your mock buttons should too. If the app uses `8px` card corners, don't use `16px`.
- **Button style**: Match shape, size, and fill style. A dark app with large rounded-square buttons should not get small pill-shaped buttons.
- **Card style**: Match background color, border presence, and shadow depth. If the app uses dark surface cards with no border, don't add light cards with borders.
- **Typography**: Use the same font weight hierarchy. If the app uses `800` weight headings, use that. If section headers are ALL CAPS with letter spacing, replicate it.
- **Icon style**: Reference the correct icon library. Don't render SF Symbols if the app uses Ionicons.
- **Spacing**: Match the app's density. A spacious app with `24px` section gaps should not get cramped `8px` gaps.

```tsx
// CORRECT — matches app's dark card style with rounded corners
<div style={{
  background: brand.surface,       // dark card bg from extraction
  borderRadius: 16,                // from uiPatterns.borderRadius.card
  padding: 20,                     // from uiPatterns.spacing
}}>

// WRONG — generic light card that doesn't match the app
<div className="bg-white rounded-lg shadow-md p-4">
```

## Pre-Write Checklist

- [ ] Scene order matches Phase 2 approval
- [ ] All text matches Phase 2 copy (verbatim)
- [ ] Brand colors from extraction, not template defaults
- [ ] Each scene mocks actual app UI from extraction
- [ ] **If screenshots provided:** Mock scenes use exact colors, shapes, and spacing from `visualSpec` — not generic values
- [ ] **If no screenshots:** Mock UI matches extracted `uiPatterns` (border radius, button style, card style, typography)

## Post-Write Self-Check

**Orchestrator:**
- [ ] `fadeIn={!isFirst}` and `fadeOut={!isLast}` on every SceneWrap
- [ ] `TOTAL_DURATION` exported and used in Root.tsx

**Config:**
- [ ] `video.width` is `886`

**Each scene:**
1. **S1 frame 0:** Fully visible element at frame 0? FAIL if TypeWriter first, `frame - N` first, or all delayed FadeIns.
2. **PhoneFrame scale:** `scale={1.5}` present? Missing scale = bug. (Marketing target only — App Store Preview must NOT use PhoneFrame.)
3. **Text outside PhoneFrame:** Body under 24px or titles under 34px = too small. (Marketing target only.)
4. **Card widths outside PhoneFrame:** Under 700px = too narrow. (Marketing target only.)
5. **Text contrast:** Every `color:` traced against its `background:`. Both dark = bug. TypeWriter needs explicit color via parent style.
6. **Caption overlap:** PhoneFrame at 1.5+ scale may overlap Caption. Add `maxWidth={720}` if tight. (Marketing target only.)
7. **staticFile:** Only in `<Audio>` or raw `<img>`. Never near `<AppIcon`.
8. **Unused imports:** Remove `spring`, `interpolate`, etc. if not used.
9. **Caption present:** Every scene has `<Caption>`.
10. **Multi-store Root.tsx:** One `<Composition>` per target store with correct `defaultProps={{ device }}`?
11. **CTA badge:** `AppStoreBadge platform` matches target store (`"ios"` for AppStore, `"android"` for PlayStore)?
12. **Device prop threading:** Orchestrator accepts `{ device: DevicePreset }`, passes to each scene, scenes pass to `<PhoneFrame>`? (Marketing target only.)
13. **Navigation chrome (App Store Preview):** Every mock screen has status bar + navigation bar + tab bar (if the app uses tabs)? Chrome matches extracted `navigation` data?
14. **No device frames (App Store Preview):** Zero uses of `<PhoneFrame>` in any scene? App UI fills full canvas?
