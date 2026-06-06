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
import { AmbientBackground, PhoneFrame, Caption, FadeIn } from "../components";
import { appConfig } from "../app-config";
import type { DevicePreset } from "../config";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
// Only import what you use. Remove unused imports.
```

**Scene 1 — Frame 0 rules:**

**App Store Preview target:** Frame 0 must show the app in use — a real app screen with navigation chrome and **populated content** (notes, entries, data, cards — never an empty state, blank list, or onboarding). Apple rejects previews that don't show the app from the start. The hook text goes in the Caption overlay, not a standalone text card.

```tsx
// CORRECT (App Store Preview) — App screen with populated content at frame 0, hook as Caption
export const S1_CoreScreen: React.FC = () => {
  return (
    <div style={{ background: "#0A1628", height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Full app screen: status bar + nav + populated content + tab bar + home indicator */}
      {/* Content must show real data: notes, entries, cards — never an empty list */}
      {/* ... (build from visualSpec, canvas-scaled, all elements present) ... */}
      <Caption text="Your voice, perfectly captured." delay={0} />
    </div>
  );
};

// WRONG (App Store Preview) — text-only hook without app screen
<AmbientBackground brand={brand} variant="dark" />
<div style={{ borderRadius: 16, padding: 24, background: "#1A1A2E" }}>Your best ideas disappear.</div>
// ↑ Apple rejection: "does not sufficiently show the app in use"
```

**Marketing target:** Styled card hooks are fine — no store compliance needed.

```tsx
// CORRECT (Marketing) — card with spring entrance visible at frame 0
export const S1_Hook: React.FC<{ device: DevicePreset }> = ({ device }) => {
  const { brand } = appConfig;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, delay: 0, config: { mass: 0.8, damping: 14, stiffness: 120 } });
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <AmbientBackground brand={brand} variant="dark" />
      <div className="relative z-10" style={{ opacity: entrance, transform: `translateY(${(1 - entrance) * 20}px)` }}>
        <div style={{ width: 740, padding: 32, borderRadius: 16, background: "rgba(26,26,46,0.9)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: brand.textPrimary }}>
            Your best ideas disappear.
          </span>
        </div>
      </div>
      <Caption text="Great ideas deserve better." delay={5} />
    </div>
  );
};
```

**Both targets — frame 0 must not be blank:**
```tsx
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
// AppIcon handles staticFile internally — never wrap it.
```

### 3. Orchestrator

```tsx
import { Sequence } from "remotion";
import { SceneWrap } from "./components";
// App Store Preview: every scene (except CTA) shows the app
import { S1_CoreScreen } from "./scenes/S1_CoreScreen";
import { S2_Feature } from "./scenes/S2_Feature";
import { S3_Proof } from "./scenes/S3_Proof";
import { S4_CTA } from "./scenes/S4_CTA";
import type { DevicePreset } from "./config";

// App Store Preview: S1 is an app screen, not a text hook
const scenes = [
  { component: S1_CoreScreen, duration: 120 },
  { component: S2_Feature, duration: 150 },
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
// CORRECT — App Store Preview: full-bleed, all sizes scaled for 886px canvas
export const S2_Feature: React.FC = () => {
  const { brand } = appConfig;
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden"
         style={{ background: brand.background }}>
      {/* Status bar — 38px text (17px × 2.25) */}
      <div className="flex items-center justify-between" style={{ height: 110, padding: "0 45px", paddingTop: 20 }}>
        <span style={{ fontSize: 38, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
        <StatusBarIcons color={brand.textPrimary} />
      </div>

      {/* Navigation bar — 77px title (34px × 2.25), SVG action icon */}
      <div className="flex items-center justify-between" style={{ height: 126, padding: "0 45px" }}>
        <span style={{ fontSize: 77, fontWeight: 700, color: brand.textPrimary }}>Library</span>
        <svg width={56} height={56} viewBox="0 0 24 24" stroke={brand.primary} strokeWidth={2.5} fill="none">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      </div>

      {/* App content area */}
      <div style={{ flex: 1, padding: "18px 45px" }}>
        {/* ... realistic app content at scaled sizes ... */}
      </div>

      {/* Tab bar — 54px SVG icons, 25px labels */}
      <div className="flex items-center justify-around"
           style={{ borderTop: `2px solid ${brand.textSecondary}20`, background: brand.surface,
                    height: 130, paddingBottom: 18 }}>
        {[
          { label: "Home", active: true },
          { label: "Search", active: false },
          { label: "Profile", active: false },
        ].map((tab, i) => {
          const color = tab.active ? brand.primary : brand.textSecondary;
          return (
            <div key={i} className="flex flex-col items-center" style={{ gap: 4 }}>
              {/* Use inline SVG — never Unicode. See Icon Rendering section. */}
              <svg width={54} height={54} viewBox="0 0 24 24" fill={i === 0 ? color : "none"}
                   stroke={i === 0 ? "none" : color} strokeWidth={2}>
                {i === 0 && <path d="M3 12l9-9 9 9v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />}
                {i === 1 && <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></>}
                {i === 2 && <><circle cx="12" cy="8" r="4" /><path d="M20 21a8 8 0 10-16 0" /></>}
              </svg>
              <span style={{ fontSize: 25, fontWeight: tab.active ? 600 : 400, color }}>{tab.label}</span>
            </div>
          );
        })}
      </div>

      {/* Home indicator — 302×11px (134×5 × 2.25) */}
      <div className="flex justify-center" style={{ paddingBottom: 14 }}>
        <div style={{ width: 302, height: 11, borderRadius: 6, background: brand.textPrimary, opacity: 0.2 }} />
      </div>

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

**CRITICAL — Element scaling for full-screen mode (886px canvas):**

The 886px canvas is **2.25× wider** than an iPhone 16 Pro screen (393px). All element sizes must be scaled up by this factor. Using phone-logical sizes (17px, 13px, 11px) directly on the 886px canvas produces tiny, unreadable UI.

```tsx
// Scale factor: 886 / 393 ≈ 2.25
// Multiply ALL phone-logical sizes by 2.25

// ── Text ──
// Status bar time:    17px × 2.25 = 38px, weight 600
// Nav bar large title: 34px × 2.25 = 77px, weight 700
// Nav bar inline title: 17px × 2.25 = 38px, weight 600
// Section headers:    13px × 2.25 = 29px (ALL CAPS with letter-spacing)
// Body text:          16px × 2.25 = 36px
// Small labels:       12px × 2.25 = 27px
// Tab bar labels:     11px × 2.25 = 25px
// Caption: unchanged (44px, handled by Caption component)

// ── Elements ──
// Nav buttons:        48px × 2.25 = 108px (borderRadius: 27px)
// Nav button icons:   22px × 2.25 = 50px
// Tab bar icons:      24px × 2.25 = 54px
// Play button:        44px × 2.25 = 99px
// Speed pills:        height 28px × 2.25 = 63px
// Badge pills:        height 24px × 2.25 = 54px

// ── Spacing ──
// Horizontal padding: 20px × 2.25 = 45px (use px-11 or px-12)
// Card padding:       16px × 2.25 = 36px
// Section gap:        24px × 2.25 = 54px
// Element gap:        12px × 2.25 = 27px
// Card border-radius: 16px × 2.25 = 36px

// ── Misc ──
// Card border:        1px → 2px (scale borders minimally)
// Divider height:     2px → 3px
// Home indicator:     134×5px → 302×11px
```

**The same scale factor applies to ALL visual specs.** When the `visualSpec` says a button is 48px, that's the phone-logical size — render it as 108px on the 886px canvas. When it says font-size 16px, render 36px.

**Navigation chrome reference:**
Use the extracted `navigation` data from `.appshot-context.json` for tab labels, icon descriptions, header style, and status bar style. The chrome must match the actual app — don't invent navigation that doesn't exist.

All sizes below are canvas-scaled (886px). Phone-logical sizes in parentheses.

- **iOS status bar**: "9:41" at 38px (17px) left, StatusBarIcons right. Height: 110px (50px). Note: the `<StatusBarIcons>` component renders at a fixed small size — wrap it in a `<div style={{ transform: "scale(2.25)" }}>` to match the canvas scale.
- **iOS large title nav bar**: 77px (34px) bold title, left-aligned. Optional right action button.
- **iOS inline nav bar**: 38px (17px) semibold title, centered. Back button 108px (48px) square left.
- **iOS tab bar**: Icon 54px (24px) + label 25px (11px) per tab, active in `brand.primary`, inactive in `brand.textSecondary`. Height: ~130px (58px).
- **iOS home indicator**: 302×11px rounded bar, centered, 20% opacity.
- **Android status bar**: "12:30" at 38px left, icons right.
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
// CORRECT — Animated mock, all sizes canvas-scaled (×2.25)
export const S2_Record: React.FC = () => {
  const frame = useCurrentFrame();
  const waveformProgress = interpolate(frame, [10, 80], [0, 1], { extrapolateRight: "clamp" });
  const timerSeconds = Math.floor(interpolate(frame, [0, 150], [0, 5], { extrapolateRight: "clamp" }));

  return (
    <div style={{ background: "#0A1628", height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Status bar — 38px (17×2.25) */}
      <div className="flex items-center justify-between" style={{ height: 110, padding: "20px 45px 0" }}>
        <span style={{ fontSize: 38, fontWeight: 600, color: "#E8ECF1" }}>9:41</span>
        <StatusBarIcons color="#E8ECF1" />
      </div>

      {/* Nav — 108px button (48×2.25), 45px text (20×2.25) */}
      <FadeIn delay={0} direction="down">
        <div className="flex items-center" style={{ height: 126, padding: "0 40px" }}>
          <div style={{ width: 108, height: 108, borderRadius: 27, background: "#1A2940",
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#E8ECF1" strokeWidth={2.5}>
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: 45, fontWeight: 600, color: "#E8ECF1", marginLeft: 27 }}>Voice Recording</span>
        </div>
      </FadeIn>

      {/* Recording indicator — 36px text (16×2.25), pulsing dot 22px (10×2.25) */}
      <FadeIn delay={8} direction="none" className="flex flex-col items-center" style={{ paddingTop: 90 }}>
        <div className="flex items-center" style={{ gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11,
                        background: "#FF4444", opacity: 0.5 + Math.sin(frame * 0.15) * 0.5 }} />
          <span style={{ fontSize: 36, color: "#FF6B6B", fontWeight: 500 }}>Recording</span>
        </div>
      </FadeIn>

      {/* Animated waveform — 9px bars (4×2.25), 180px height (80×2.25) */}
      <div className="flex items-center justify-center" style={{ height: 180, padding: "36px 54px 0" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const barHeight = Math.sin(i * 0.5 + frame * 0.1) * 45 + 56;
          const visible = i / 40 < waveformProgress;
          return (
            <div key={i} style={{
              width: 9, height: visible ? barHeight : 5, marginRight: 7,
              background: "#3BB8E0", borderRadius: 5,
            }} />
          );
        })}
      </div>

      {/* Animated timer — 162px (72×2.25) */}
      <div className="flex justify-center" style={{ paddingTop: 36 }}>
        <span style={{ fontSize: 162, fontWeight: 300, color: "#E8ECF1", fontVariantNumeric: "tabular-nums" }}>
          {`0${Math.floor(timerSeconds / 60)}:${String(timerSeconds % 60).padStart(2, "0")}`}
        </span>
      </div>

      <Caption text="Record thoughts in one tap." delay={5} />
    </div>
  );
};

// WRONG — phone-logical sizes on 886px canvas (everything tiny)
<span style={{ fontSize: 17 }}>9:41</span>       // ← 17px is unreadable, should be 38px
<div style={{ width: 48, height: 48 }}>...</div>  // ← 48px button is tiny, should be 108px
<span style={{ fontSize: 11 }}>Home</span>        // ← 11px tab label invisible, should be 25px

// WRONG — Embedding screenshot as static image
<Img src={staticFile("screens/recording.png")} />
```

**What can animate in mock scenes:**
- Waveform bars growing/pulsing
- Timer counting up
- Recording indicator pulsing
- Cards sliding in with `FadeIn` or `spring()`
- Text typing in with `TypeWriter`
- Counters incrementing with animated `interpolate()` (see Animation Patterns in appshot-core)
- Progress bars filling with `interpolate()` on width
- Elements appearing in sequence (staggered `delay`)

## Icon Rendering

**Never use Unicode characters for icons.** Unicode glyphs (`⌂`, `⚲`, `⚙`, `⋯`) render as OS-specific shapes that don't match the app's real icons. Instead, draw icons as inline SVG paths that match the icon descriptions from the visual spec.

```tsx
// CORRECT — inline SVG (filled icon)
<svg width={54} height={54} viewBox="0 0 24 24" fill={color}>
  <path d="M3 12l9-9 9 9v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
</svg>

// CORRECT — inline SVG (stroked icon)
<svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
  <circle cx="11" cy="11" r="7" />
  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
</svg>

// WRONG — Unicode characters
<span style={{ fontSize: 54 }}>⌂</span>    // OS-dependent, wrong shape
```

Read the icon descriptions from the `visualSpec` and draw SVG paths that match. Use `viewBox="0 0 24 24"` and scale with `width`/`height`.

## Code Quality Rules

- Every scene: self-contained `.tsx` in `src/scenes/`, typically 80-150 lines (complex screens with many elements may reach 180+)
- Tailwind for layout, `style={}` for brand-colored/dynamic properties
- All motion: Remotion `spring()` or `interpolate()` — no CSS transitions
- Demo data: realistic names, plausible numbers, proper formatting
- Status bar: "9:41" for App Store (iPhone), "12:30" for Play Store (Pixel)
- Icons: inline SVG paths, never Unicode characters (see Icon Rendering section above)
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

### Completeness rule

**Every visible element in the screenshot must appear in the mock scene.** Do not abbreviate, skip, or placeholder any UI component. If the screenshot shows a tab bar with 3 tabs and icons, the mock must have 3 tabs with icons. If it shows a waveform card with playback controls and speed pills, all of those must be in the JSX. A scene with `{/* ... */}` placeholder comments is a bug.

Count the distinct UI elements in the screenshot before writing code. If the screenshot has 15 elements, the scene must have 15 elements. Common elements that get skipped (and must NOT be):
- **Tab bar icons** — don't render text-only tabs when the app has icons above labels
- **Action buttons in nav bar** — all of them, not just the back button
- **Cards with internal structure** — waveform + play button + timestamps + speed pills, not just an empty card
- **CTAs and secondary actions** — "Add timestamps", "Enhance · 2 credits", language selectors
- **Dividers and separators** — colored lines, section dividers with rules
- **Badge indicators** — type badges, status pills, credit counters
- **Home indicator** — the bottom bar on modern iPhones

### Example: full-bleed scene structure (App Store Preview, canvas-scaled)

Every full-bleed scene follows this vertical layout. All sizes are ×2.25 from phone-logical values. Use colors from `visualSpec` (if screenshots provided) or `brand.*` (if not).

```tsx
export const S2_Feature: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { brand } = appConfig;

  return (
    <div style={{ background: brand.background, height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>

      {/* ── Status bar: 38px (17×2.25), height 110px ── */}
      <div className="flex items-center justify-between" style={{ height: 110, padding: "20px 45px 0" }}>
        <span style={{ fontSize: 38, fontWeight: 600, color: brand.textPrimary }}>9:41</span>
        <div style={{ transform: "scale(2.25)", transformOrigin: "right center" }}>
          <StatusBarIcons color={brand.textPrimary} />
        </div>
      </div>

      {/* ── Nav bar: 108px buttons (48×2.25), inline SVG icons ── */}
      <div className="flex items-center justify-between" style={{ padding: "0 45px", height: 126 }}>
        <div style={{ width: 108, height: 108, borderRadius: 27, background: brand.surface,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke={brand.textPrimary} strokeWidth={2.5}>
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* ... additional nav action buttons as inline SVG ... */}
      </div>

      {/* ── Content area: flex-1, all text/elements canvas-scaled ── */}
      <div style={{ flex: 1, padding: "18px 45px" }}>
        {/* Title: 68px (30×2.25) */}
        <span style={{ fontSize: 68, fontWeight: 700, color: brand.textPrimary }}>Screen Title</span>

        {/* Cards: 36px radius (16×2.25), 36px padding (16×2.25) */}
        <FadeIn delay={8} direction="up">
          <div style={{ background: brand.surface, borderRadius: 36, padding: 36, marginTop: 18 }}>
            {/* Card content — match visualSpec exactly. Every element present. */}
          </div>
        </FadeIn>

        {/* Body text: 36px (16×2.25), labels: 27px (12×2.25) */}
        <FadeIn delay={14} direction="up">
          <p style={{ fontSize: 36, color: brand.textPrimary, lineHeight: 1.5 }}>Content text here.</p>
        </FadeIn>
      </div>

      {/* ── Tab bar: 54px SVG icons (24×2.25), 25px labels (11×2.25), height 130px ── */}
      <div className="flex items-center justify-around"
           style={{ borderTop: `2px solid ${brand.surface}`, background: brand.background, height: 130, paddingBottom: 18 }}>
        {/* Map extracted navigation.tabs — each with inline SVG icon + label */}
      </div>

      {/* ── Home indicator: 302×11px (134×5 × 2.25) ── */}
      <div className="flex justify-center" style={{ paddingBottom: 14 }}>
        <div style={{ width: 302, height: 11, borderRadius: 6, background: brand.textPrimary, opacity: 0.2 }} />
      </div>

      <Caption text="Your caption here." delay={5} />
    </div>
  );
};
```

Replace placeholder text, colors, and card content with actual app data. Every element from the `visualSpec` must be present — no `{/* ... */}` abbreviations. Status bar icons need `transform: scale(2.25)` wrapping since the component renders at phone-logical size.

### Fallback: no screenshots provided

When building mock UI without screenshots, use the extracted `uiPatterns` from `.appshot-context.json`:

- **Border radius**: If the app uses pill buttons (`borderRadius: 9999`), your mock buttons should too. If the app uses `8px` card corners, don't use `16px`.
- **Button style**: Match shape, size, and fill style. A dark app with large rounded-square buttons should not get small pill-shaped buttons.
- **Card style**: Match background color, border presence, and shadow depth. If the app uses dark surface cards with no border, don't add light cards with borders.
- **Typography**: Use the same font weight hierarchy. If the app uses `800` weight headings, use that. If section headers are ALL CAPS with letter spacing, replicate it.
- **Icon style**: Reference the correct icon library. Don't render SF Symbols if the app uses Ionicons.
- **Spacing**: Match the app's density. A spacious app with `24px` section gaps should not get cramped `8px` gaps.

All sizes from `uiPatterns` are phone-logical — apply the ×2.25 canvas scale factor.

```tsx
// CORRECT — matches app's dark card style, canvas-scaled
<div style={{
  background: brand.surface,       // dark card bg from extraction
  borderRadius: 36,                // 16px × 2.25 from uiPatterns.borderRadius.card
  padding: 45,                     // 20px × 2.25 from uiPatterns.spacing
}}>

// WRONG — phone-logical sizes (too small on 886px canvas)
<div style={{ borderRadius: 16, padding: 20 }}>

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
- [ ] All sizes are canvas-scaled (×2.25 for 886px). No phone-logical values anywhere in scene code.
- [ ] All icons are inline SVG. No Unicode characters.
- [ ] Every element from the visualSpec/screen is present. No abbreviations.

## Post-Write Self-Check

**Orchestrator:**
- [ ] `fadeIn={!isFirst}` and `fadeOut={!isLast}` on every SceneWrap
- [ ] `TOTAL_DURATION` exported and used in Root.tsx

**Config:**
- [ ] `video.width` is `886`

**Each scene:**
1. **S1 frame 0:** Fully visible element at frame 0? FAIL if TypeWriter first, `frame - N` first, or all delayed FadeIns. **App Store Preview:** S1 must be an app screen with populated content (not a text-card/AmbientBackground hook, not an empty state or blank list).
2. **PhoneFrame scale:** `scale={1.5}` present? Missing scale = bug. (Marketing target only — App Store Preview must NOT use PhoneFrame.)
3. **Text outside PhoneFrame:** Body under 24px or titles under 34px = too small. (Marketing target only.)
4. **Card widths outside PhoneFrame:** Under 700px = too narrow. (Marketing target only.)
5. **Text contrast:** Every `color:` traced against its `background:`. Both dark = bug. TypeWriter needs explicit color via parent style.
6. **Caption overlap:** PhoneFrame at 1.5+ scale may overlap Caption. Add `maxWidth={720}` if tight. (Marketing target only.)
7. **staticFile:** Only in `<Audio>` or raw `<img>`. Never near `<AppIcon`.
8. **Unused imports:** Remove `spring`, `interpolate`, etc. if not used.
9. **Caption present:** Every scene has `<Caption>`.
10. **Multi-store Root.tsx:** One `<Composition>` per target store with correct `defaultProps={{ device }}`?
11. **CTA badge:** **App Store Preview:** No store badge in CTA scene (redundant inside the store listing)? **Marketing:** Inline store badge SVG matches target store (Apple logo for AppStore, Play logo for PlayStore)?
12. **Device prop threading:** Orchestrator accepts `{ device: DevicePreset }`, passes to each scene, scenes pass to `<PhoneFrame>`? (Marketing target only.)
13. **Navigation chrome (App Store Preview):** Every mock screen has status bar + navigation bar + tab bar (if the app uses tabs)? Chrome matches extracted `navigation` data?
14. **No device frames (App Store Preview):** Zero uses of `<PhoneFrame>` in any scene? App UI fills full canvas?
15. **Canvas scale (App Store Preview):** ALL sizes multiplied by 2.25? No phone-logical values (17px, 48px, 11px) used directly? Smallest text should be ~25px, smallest interactive element ~90px.
16. **Icons:** All icons are inline SVG? Zero Unicode characters used for icons (`⌂`, `⚲`, `⚙`, `⋯`, `↑`, `🗑`, `▶`, `‹` etc.)?
17. **Completeness:** Every visible element from the visualSpec present in the scene? No `{/* ... */}` placeholder comments? Count elements in spec vs elements in code.
