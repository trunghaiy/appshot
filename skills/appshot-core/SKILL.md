---
name: appshot-core
description: Foundation skill for Appshot. Defines the Remotion project architecture, primitives library, config schema, device presets, and store requirements. Owns the shared extraction phase used by appshot-videos and appshot-images.
license: MIT
metadata:
  author: kiennguyen
  version: 3.0.0
---

# Appshot Core — Foundation

Reference skill for all Appshot skills. Read this before executing `appshot-videos` or `appshot-images`.

## Architecture

- **Remotion 4.0** + React 18 + Tailwind CSS 3.4
- Config defines app metadata and brand only — scenes are custom `.tsx` files, not config entries
- Each project has an orchestrator component (e.g., `FooPreview.tsx`) that sequences custom scenes via Remotion `<Sequence>` + `<SceneWrap>`
- All primitives are brand-aware via a `brand` prop derived from the config's `BrandColors`

## Project Context (auto-injected)

- Package manifest: !`cat package.json 2>/dev/null || cat pubspec.yaml 2>/dev/null || cat app.json 2>/dev/null`
- App colors: !`find . -maxdepth 4 \( -name 'colors.xml' -o -name 'Colors.swift' -o -name 'colors.ts' -o -name 'theme.ts' -o -name 'Color.kt' -o -name 'tailwind.config.js' -o -name 'tailwind.config.ts' \) 2>/dev/null | head -5 | xargs head -50 2>/dev/null`
- App icon: !`find . -maxdepth 5 \( -name 'ic_launcher.png' -o -name 'icon.png' \) -type f 2>/dev/null | head -3`
- Store metadata: !`cat fastlane/metadata/en-US/full_description.txt 2>/dev/null || cat fastlane/metadata/en-US/description.txt 2>/dev/null || cat fastlane/metadata/android/en-US/full_description.txt 2>/dev/null`
- README excerpt: !`head -80 README.md 2>/dev/null`

## Extraction & Context Caching

Both `appshot-videos` and `appshot-images` use this extraction process. Results are cached to `.appshot-context.json` so extraction only runs once per project.

### Check for cached context

Before scanning, check if `.appshot-context.json` exists in the project root. If it does:
1. Load and present a summary to the user
2. Ask: "I found a previous extraction. Confirm this is still correct, or re-scan?"
3. If confirmed, skip extraction and proceed to the calling skill's next phase
4. If re-scan requested, run extraction below and overwrite the file

### Extraction steps

#### Step 1: Detect framework

Check for marker files in this order. Stop at the first match.

| Framework | Marker files |
|---|---|
| Expo / React Native | `app.json`, `app.config.ts`, `app.config.js` |
| Flutter | `pubspec.yaml` |
| iOS (Swift) | `*.xcodeproj/`, `*.xcworkspace/`, `Package.swift` |
| Android (Kotlin/Java) | `app/src/main/AndroidManifest.xml`, `build.gradle.kts`, `build.gradle` |
| Next.js | `next.config.js`, `next.config.ts`, `next.config.mjs` |
| SvelteKit | `svelte.config.js` |
| Nuxt | `nuxt.config.ts`, `nuxt.config.js` |
| Astro | `astro.config.mjs`, `astro.config.ts` |
| Remix | `remix.config.js`, `app/root.tsx` (with @remix-run import) |
| Vite (React/Vue/Solid) | `vite.config.ts`, `vite.config.js` (check `package.json` for react/vue/solid) |

Use `ls` or `find . -maxdepth 3` to check. If none match, note that no framework was detected and move on — the user may describe their app verbally.

#### Step 2: Extract app identity

**Expo / React Native:**
- **Name**: `app.json` -> `expo.name` or `name`
- **Description/tagline**: `app.json` -> `expo.description` or `description`
- **Bundle ID**: `app.json` -> `expo.ios.bundleIdentifier` or `expo.android.package`
- **Also check**: `package.json` -> `name`, `description`

**Flutter:**
- **Name**: `pubspec.yaml` -> `name:`
- **Description**: `pubspec.yaml` -> `description:`
- **Also check**: `android/app/src/main/AndroidManifest.xml` -> `android:label`, `ios/Runner/Info.plist` -> `CFBundleDisplayName`

**iOS (Swift):**
- **Name**: `Info.plist` -> `CFBundleDisplayName` or `CFBundleName`
- **Bundle ID**: `Info.plist` -> `CFBundleIdentifier`
- **Also check**: `project.pbxproj` for product name

**Android (Kotlin/Java):**
- **Name**: `app/src/main/res/values/strings.xml` -> `<string name="app_name">`
- **Package**: `AndroidManifest.xml` -> `package` attribute
- **Also check**: `build.gradle.kts` or `build.gradle` -> `applicationId`

**Next.js:**
- **Name**: `package.json` → `name`; also check `next.config.*` → `env.APP_NAME`
- **Description/tagline**: `package.json` → `description`; also check `app/layout.tsx` → `metadata.description`
- **URL**: check `.env` or `.env.local` → `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SITE_URL`

**SvelteKit:**
- **Name**: `package.json` → `name`
- **Description**: `package.json` → `description`; check `src/app.html` → `<title>`, `<meta name="description">`

**Vite (React/Vue):**
- **Name**: `package.json` → `name`
- **Description**: `package.json` → `description`; check `index.html` → `<title>`, `<meta name="description">`

#### Step 3: Extract brand colors

Search for color definitions. Read the first match in each framework.

**Expo / React Native** — search paths (in order):
1. `src/theme.ts` or `src/theme.js`
2. `src/colors.ts` or `src/constants/colors.ts`
3. `theme/colors.ts` or `theme/index.ts`
4. `tailwind.config.js` or `tailwind.config.ts` -> `theme.extend.colors`
5. `app.json` -> `expo.primaryColor`, `expo.backgroundColor`

Look for: named color exports (`primary`, `secondary`, `background`, `surface`, `accent`, `success`, `danger/error`), hex strings, `rgb()` values.

**Flutter** — search paths:
1. `lib/theme.dart` or `lib/theme/app_theme.dart`
2. `lib/theme/colors.dart` or `lib/constants/colors.dart`
3. `lib/main.dart` -> `ThemeData()`

Look for: `Color(0xFF...)` constants, `primaryColor`, `accentColor`, `colorScheme` definitions.

**iOS (Swift)** — search paths:
1. `*.xcassets/Colors/**/*.colorset/Contents.json` — parse `components` for RGB
2. `**/Theme.swift` or `**/Colors.swift` or `**/ColorScheme.swift`

Look for: static `Color` properties, `UIColor` hex initializers, asset catalog color definitions.

**Android** — search paths:
1. `app/src/main/res/values/colors.xml` — `<color name="primary">#RRGGBB</color>`
2. `app/src/main/res/values/themes.xml` — `<item name="colorPrimary">`
3. `**/ui/theme/Color.kt` — Jetpack Compose `Color()` definitions

**Web (all frameworks)** — search paths (in order):
1. `tailwind.config.js` or `tailwind.config.ts` → `theme.extend.colors`
2. `src/styles/globals.css` or `src/app/globals.css` → CSS custom properties (`--primary`, `--background`, etc.)
3. `src/theme.*` or `src/lib/theme.*`
4. `src/styles/variables.css`

#### Step 4: Find app icon

| Framework | Where to look |
|---|---|
| Expo/RN | `app.json` -> `expo.icon` field (usually `./assets/icon.png`) |
| Flutter | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` or `ios/Runner/Assets.xcassets/AppIcon.appiconset/` |
| iOS | `*.xcassets/AppIcon.appiconset/` -> find the largest `.png` |
| Android | `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |
| Web (all) | `public/favicon.svg`, `public/favicon.ico`, `public/logo.svg`, `public/logo.png`, `app/favicon.ico`, `src/assets/logo.*` |

#### Step 5: Extract features & store metadata

These sources exist across all frameworks:

| Source | Path | What to extract |
|---|---|---|
| Fastlane (iOS) | `fastlane/metadata/en-US/description.txt` or `full_description.txt` | Full store description |
| Fastlane (iOS) | `fastlane/metadata/en-US/subtitle.txt` | App Store subtitle |
| Fastlane (iOS) | `fastlane/metadata/en-US/keywords.txt` | Search keywords |
| Fastlane (Android) | `fastlane/metadata/android/en-US/full_description.txt` | Play Store description |
| Fastlane (Android) | `fastlane/metadata/android/en-US/short_description.txt` | Short description |
| README | `README.md` | First 80 lines — app description, feature bullets |
| CLAUDE.md | `CLAUDE.md` | Project description if present |

#### Step 6: Infer app category

Based on extracted keywords, description, and feature names, infer the app category:

| Category | Signals |
|---|---|
| Habit tracking | streak, habit, daily, routine, consistency, track days |
| Fitness | workout, exercise, gym, reps, sets, calories, steps |
| Finance | budget, expense, money, savings, transactions, spending |
| Productivity | task, todo, note, project, organize, calendar |
| Social | chat, message, friend, follow, post, share |
| Education | learn, quiz, study, course, flashcard, practice |
| Health | meditation, sleep, mood, journal, wellness, mindful |
| Travel | trip, itinerary, booking, destination, explore |
| Food | recipe, meal, restaurant, cooking, ingredients |
| SaaS | dashboard, subscription, plan, pricing, onboarding, workspace, team, analytics |
| E-commerce | cart, checkout, product, shop, order, payment, inventory |
| Developer tool | API, SDK, CLI, documentation, playground, sandbox, webhook |
| Content/publishing | blog, article, post, publish, editor, CMS, newsletter |
| AI/ML | model, inference, prompt, generate, embed, vector, chat, completion |
| Community | forum, discussion, thread, community, member, profile |

If no clear match, note "uncategorized" — the user will clarify.

### Deep analysis

Go beyond identity and colors. Understand what the app actually does.

**Screen inventory.** Scan navigation files to discover all screens:
- React Native / Expo: read `App.tsx`, any `*Navigator.tsx`, `*Router.tsx`, tab bar configs, `react-navigation` setup
- Flutter: read `lib/main.dart`, router config, `GoRouter` or `MaterialApp` routes
- iOS: read storyboard references, `UITabBarController` setup, SwiftUI `NavigationStack`/`TabView`
- Look for: screen names, tab labels, navigation structure (tabs, stacks, drawers)

**Page/route inventory (web).** Scan router config to discover all pages:
- Next.js: read `app/` directory structure (each folder with `page.tsx` = route), or `pages/` directory
- SvelteKit: read `src/routes/` directory structure (each folder with `+page.svelte` = route)
- Vite/React: read router config (`react-router`, `tanstack-router`), or scan for route definitions
- Look for: page names, layout structure, protected vs public routes

**Landing page analysis.** If a landing/marketing page exists:
- Extract hero headline and subheadline
- Extract feature sections
- Note CTA text ("Get Started", "Sign Up Free", etc.)
- Note pricing structure if visible

**Feature analysis.** For each discovered screen, read the component file to understand:
- What data it displays
- What actions the user can take
- What makes it visually interesting or unique

**Value props / differentiators.** Extract from README, store description, CLAUDE.md, marketing copy, or landing page:
- What problem does this app solve?
- How is it different from competitors?
- What is the emotional promise?

**Core action loop.** Identify the single most frequent user action:
- What does a user do every time they open the app?
- How many taps/steps does it take?
- What feedback do they get after completing it?

**Theme detection.** Check if the app supports light/dark modes:
- Look for theme toggle, `useColorScheme`, `Appearance`, `ThemeProvider`, `darkMode` in config
- Note which is the default or primary theme
- Note if the app is dark-theme-only (some brands like Spotify, cinema apps)

### Save context

After extraction and user confirmation, save results to `.appshot-context.json` in the project root:

```json
{
  "version": 2,
  "extractedAt": "ISO timestamp",
  "app": { "name": "", "tagline": "", "icon": "", "platform": "", "framework": "", "url": "string or null" },
  "brand": { "primary": "", "primaryLight": "", "background": "", "surface": "", "textPrimary": "", "textSecondary": "", "success": "", "danger": "", "accent": "" },
  "category": "string",
  "theme": "light | dark | both",
  "themeDefault": "light | dark",
  "screens": [{ "name": "", "tab": "", "description": "" }],
  "pages": [{ "route": "", "name": "", "description": "", "layout": "" }],
  "landingPage": { "heroHeadline": "string or null", "heroSubheadline": "string or null", "cta": "string or null", "featureSections": ["string"] },
  "features": ["string"],
  "coreAction": "string",
  "valueProps": ["string"],
  "storeDescription": "string or null",
  "sources": { "name": "source file", "colors": "source file" }
}
```

Notes on schema v2:
- `app.framework` valid values: `"expo"` | `"flutter"` | `"ios"` | `"android"` | `"nextjs"` | `"sveltekit"` | `"nuxt"` | `"astro"` | `"remix"` | `"vite"` | `"web"`
- `app.platform` valid values: `"ios"` | `"android"` | `"both"` | `"web"`
- `pages` — web route inventory (empty array for mobile apps)
- `landingPage` — extracted landing page data (null for mobile apps)

### Present findings

Summarize what you found concisely. Always cite the source file so the user can verify.

```
I scanned your project and found:

- **App:** [name] (from [source file])
- **Tagline:** [text] (from [source file])
- **Platform:** [iOS/Android/both] (from [evidence])
- **Colors:** primary [hex], background [hex], surface [hex], ... (from [source file])
- **Icon:** [file path]
- **Category:** [category] based on [keywords/description]
- **Store description:** [found at path / not found]
- **Theme:** [light only / dark only / both — default is X]

**Screen inventory:**
- [Tab 1]: [ScreenName] — [what it shows]
- [Tab 2]: [ScreenName] — [what it shows]
- [Modal/Detail]: [ScreenName] — [what it shows]
- ...

**Page inventory (web):**
- `/` — [Landing page] — [hero headline, feature sections]
- `/dashboard` — [Dashboard] — [what it shows]
- `/settings` — [Settings] — [configuration options]
- ...

**Landing page:** [hero headline] / [CTA text] / [number of feature sections]
**URL:** [extracted URL or "not found"]

**Key features:** [bullet list of 3-5 main features extracted from code/docs]

**Core action loop:** [what users do most — e.g., "tap Log -> enter page number -> save (3 taps, ~5 seconds)"]

**Value props:**
- [Primary differentiator]
- [Secondary differentiator]
- [Emotional promise]

**Pre-filled config:**
[Show the AppConfig object with app, brand, and video sections filled in]

Does this look right? Anything to correct before I proceed?
```

If fields are missing, note them: "I couldn't find brand colors — do you have a theme file, or should we pick colors together?"

Only after confirmation, proceed to the calling skill's next phase — and skip any questions already answered by the scan.

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
    width: number;       // 886
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

| Preset | Screen | Notch | Store |
|--------|--------|-------|-------|
| `iphone-16-pro` | 393x852 | Dynamic Island | App Store |
| `iphone-15` | 375x812 | Dynamic Island | App Store |
| `ipad-pro-13` | 1024x1366 | None | App Store (iPad) |
| `pixel-9` | 412x915 | Punch hole | Play Store |

### Store-to-Device Mapping

| Store | Composition ID suffix | Device preset | Badge platform |
|-------|----------------------|---------------|----------------|
| App Store | `-AppStore` | `iphone-16-pro` | `"ios"` |
| Play Store | `-PlayStore` | `pixel-9` | `"android"` |

For multi-store projects, Root.tsx registers one `<Composition>` per store. Scenes are shared — only the device frame and CTA badge differ. Canvas stays 886×1920 for both.

## Store Requirements

### Videos

| Platform | Dimensions | Duration | Format |
|----------|-----------|----------|--------|
| iPhone 6.7" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPhone 6.1" | 886x1920 | 15-30s | H.264, MP4/MOV |
| iPad 13" | 1200x1600 | 15-30s | H.264, MP4/MOV |
| Google Play | 886x1920 | 15-30s | H.264, MP4 |

Default output is 886×1920. This canvas works for both App Store (iPhone 6.7″ native) and Google Play. All sizing rules in appshot-videos are calibrated for this canvas width.

### Screenshots

iOS App Store:
| Device | Dimensions (portrait) | Required |
|--------|----------------------|----------|
| iPhone 6.9" | 1320x2868 | Yes (mandatory primary) |
| iPhone 6.7" | 1290x2796 | Optional (Apple scales from 6.9") |
| iPhone 6.5" | 1242x2688 | Optional (legacy) |
| iPad 13" | 2064x2752 | Required if app supports iPad |

Google Play:
| Device | Dimensions (portrait) | Notes |
|--------|----------------------|-------|
| Phone | 1080x1920 | Recommended standard |
| 7" Tablet | 1200x1920 | If app targets 7" tablets |
| 10" Tablet | 1600x2560 | If app targets 10" tablets |

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
- Extraction logic is built into this skill (see Extraction & Context Caching above)
