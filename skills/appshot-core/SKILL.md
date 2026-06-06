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

#### Step 5b: Extract ASO keywords

Apple and Google can now read text in screenshots and videos via visual intelligence. Extract a keyword list so overlay text can naturally incorporate high-value search terms.

**Primary source:** `fastlane/metadata/en-US/keywords.txt` (comma-separated). This is the developer's own keyword strategy — use it as the authoritative list.

**Fallback sources** (if no Fastlane keywords exist): derive 8-12 keyword candidates from:
1. App Store subtitle (`fastlane/metadata/en-US/subtitle.txt`) — split into individual terms
2. Store description — extract the most repeated nouns and action verbs
3. Feature names from extraction — map feature names to user-facing search terms
4. App category terms from Step 6 signals table

**Output:** A ranked list of keywords, most important first. Include both single words ("habits", "streak") and short phrases ("reading tracker", "book log"). Cap at 12 keywords.

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

**Navigation chrome extraction.** For realistic mock screens, extract the navigation patterns the user actually sees:
- **Navigation type**: tabs, stack, drawer, or combination
- **Tab bar**: label text for each tab, icon descriptions (e.g., "house icon", "magnifying glass", "person circle"), which tab is default/home
- **Navigation headers**: title style (large title vs inline), back button presence, right bar button items (e.g., "gear icon", "plus", "bell")
- **Status bar style**: light content (white text, for dark backgrounds) or dark content (black text, for light backgrounds)
- **Home indicator**: present on all modern iPhones (bottom bar), absent on older devices

Where to find this:
- React Native / Expo: `screenOptions`, `tabBarLabel`, `tabBarIcon`, `headerTitle`, `headerRight`, `navigationOptions` in navigator files
- Flutter: `BottomNavigationBar` items, `AppBar` title/actions, `Scaffold` configuration
- iOS: `UITabBarItem` setup, `navigationItem.title`, `navigationItem.rightBarButtonItems`, SwiftUI `.tabItem` / `.navigationTitle` / `.toolbar`
- Android: `BottomNavigationView` menu XML, `Toolbar`/`TopAppBar` setup, Jetpack Compose `NavigationBar` items

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

**UI pattern extraction.** Scan component styling to capture the app's visual design language. Mock screens that don't match the real app's look undermine credibility — this data closes the gap.

What to extract:
- **Border radius**: button radius, card radius, input radius (e.g., "fully rounded buttons", "8px card corners", "pill-shaped inputs")
- **Spacing rhythm**: padding/margin values used in containers and between elements (e.g., "16px horizontal padding", "24px section gaps")
- **Typography**: font family (custom or system), heading weights (e.g., 700 vs 800), body size, whether the app uses ALL CAPS for section headers
- **Button style**: shape (rounded rectangle, pill, circle), size, fill vs outline, icon-only buttons
- **Card style**: background color, border, shadow depth, glass/blur effects
- **Icon library**: which icon set (SF Symbols, Material Icons, Lucide, custom SVGs, Ionicons)
- **Special UI elements**: waveform visualizers, progress rings, gradient backgrounds, tag/chip styles, badge indicators

Where to find this:
- React Native / Expo: `StyleSheet.create()` blocks, inline `style={}`, NativeWind/Tailwind classes, component library imports (`react-native-paper`, `tamagui`, `gluestack`)
- Flutter: `BoxDecoration`, `BorderRadius`, `TextStyle`, `ButtonStyle` in widget files and theme data
- iOS (Swift): `.cornerRadius`, `.font()`, `.padding()`, `UIFont` descriptors, SF Symbol names in SwiftUI/UIKit
- Android: `shapes.xml`, `styles.xml`, Compose `RoundedCornerShape()`, `MaterialTheme.typography`, Material icon imports

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
  "navigation": {
    "type": "tabs | stack | drawer | tabs+stack",
    "tabs": [{ "label": "", "iconDescription": "", "isDefault": false }],
    "headerStyle": "largeTitle | inline",
    "statusBarStyle": "light | dark"
  },
  "screens": [{ "name": "", "tab": "", "description": "" }],
  "pages": [{ "route": "", "name": "", "description": "", "layout": "" }],
  "landingPage": { "heroHeadline": "string or null", "heroSubheadline": "string or null", "cta": "string or null", "featureSections": ["string"] },
  "uiPatterns": {
    "borderRadius": { "button": "string", "card": "string", "input": "string" },
    "spacing": { "horizontal": "string", "sectionGap": "string" },
    "typography": { "fontFamily": "string or 'system'", "headingWeight": "number", "bodySize": "string", "capsHeaders": "boolean" },
    "buttonStyle": "string — e.g., 'pill filled, 56px height' or 'rounded-lg outline'",
    "cardStyle": "string — e.g., 'dark surface, 16px radius, no border, subtle shadow'",
    "iconLibrary": "string — e.g., 'SF Symbols' or 'Ionicons' or 'custom SVG'",
    "specialElements": ["string — e.g., 'waveform visualizer', 'gradient background', 'pill-shaped tags'"]
  },
  "features": ["string"],
  "coreAction": "string",
  "valueProps": ["string"],
  "keywords": ["string — ranked ASO keywords, most important first, max 12"],
  "screenshots": [{
    "referenceFile": "original file path (for re-reading if needed)",
    "screen": "matched screen name",
    "description": "what this screenshot shows",
    "visualSpec": "structured visual analysis — layout, colors, components, typography, special elements (the actual styling reference for mock UI)"
  }],
  "storeDescription": "string or null",
  "sources": { "name": "source file", "colors": "source file", "keywords": "source file or 'derived'" }
}
```

Notes on schema v2:
- `screenshots` — empty array if user chose auto-mock; populated if user provided real screenshots
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

**Navigation:** [tabs / stack / drawer] — [header style: large title / inline]
**Tab bar:** [Tab1 (icon)] | [Tab2 (icon)] | [Tab3 (icon)] — default: [Tab1]
**Status bar:** [dark content / light content]

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

**UI patterns:** [font family], [heading weight], [button style], [card style], [border radius], [icon library]
**Special elements:** [waveform, gradient bg, pill tags, ...]

**ASO keywords:** [keyword1], [keyword2], [keyword3], ... (from [fastlane/keywords.txt / derived])

**Pre-filled config:**
[Show the AppConfig object with app, brand, and video sections filled in]

Does this look right? Anything to correct before I proceed?
```

If fields are missing, note them: "I couldn't find brand colors — do you have a theme file, or should we pick colors together?"

Only after confirmation, proceed to the screenshot collection step below.

### Collect screenshots (optional)

After the extraction is confirmed, ask the user if they want to provide real app screenshots as visual references. Screenshots are **reference material, not content** — they are never embedded in the final output. Instead, the visual reference analysis extracts exact colors, shapes, spacing, and typography from the screenshots, which the skill uses to build animated mock UI that looks like the real app.

```
AskUserQuestion({
  questions: [{
    question: "Do you have screenshots of your app to use as screen content?",
    header: "Screenshots",
    options: [
      { label: "Yes, I'll provide screenshots", description: "Highest fidelity — your screenshots are analyzed and the mock UI is built to match exactly." },
      { label: "No, generate mock screens", description: "Skill builds UI from extracted code patterns. Good for most cases." }
    ],
    multiSelect: false
  }]
})
```

**If the user provides screenshots:**

1. Ask the user to provide screenshot file paths or drop them in the conversation
2. Read each screenshot image to understand what it shows
3. Map each screenshot to a screen from the extraction:
   ```
   I mapped your screenshots to app screens:
   
   - recording.png → Voice Recording screen
   - transcription.png → Transcription Detail screen  
   - scan-preview.png → Document Scan screen
   - home.png → Home / Notes List screen
   
   Missing: Settings screen (will use mock UI for this one)
   
   Does this mapping look right?
   ```
4. **Run visual reference analysis** on each screenshot (see below)
5. Note any gaps — screens that have no screenshot. These will fall back to mock UI built from `uiPatterns`.
6. Save the mapping AND the visual analysis to `screenshots` in `.appshot-context.json`

### Visual reference analysis

**CRITICAL:** This step is mandatory when screenshots are provided. Without it, mock scenes will look generic and not match the real app.

For each provided screenshot, study the image and write a structured visual spec. This spec is used in two ways:
- **Direct use scenes**: The screenshot is used as-is via `<Img>`, so the spec confirms what it shows
- **Mock scenes and gap-fill**: When a scene needs mock UI (for animation, missing screenshots, or modified content), the spec is the source of truth for how to style it

**For each screenshot, document:**

```
## [filename] → [Screen Name]

**Layout:**
- [top-to-bottom description of what appears: nav bar, content sections, bottom bar]
- [approximate vertical proportions: "nav bar 8%, content 78%, tab bar 8%, home indicator 6%"]

**Colors (sample from the image):**
- Background: [exact color, e.g., "#0A1628 — very dark navy, NOT pure black"]
- Cards/surfaces: [e.g., "#1A2940 — slightly lighter navy with subtle border"]
- Accent: [e.g., "#3BB8E0 — teal/cyan for CTAs and active states"]
- Text primary: [e.g., "#E8ECF1 — off-white"]
- Text secondary: [e.g., "#6B7A8D — muted blue-grey"]
- Highlight/badge: [e.g., "#E5C044 — warm yellow for 'Voice Recording' badge"]

**Components (describe exactly what you see):**
- Back button: [e.g., "48px rounded-square (#1A2940 bg), white chevron, no text"]
- Nav actions: [e.g., "three icon buttons: more (⋯), share (↑), delete (🗑), same rounded-square style"]
- Type badge: [e.g., "'Voice Recording' in yellow text on dark pill, microphone emoji prefix"]
- Content cards: [e.g., "rounded-xl (~16px), #1A2940 bg, 1px border #2A3A50, 20px padding"]
- Buttons: [e.g., "'Enhance · 2 credits' — outlined, teal border, rounded-full, 48px height"]
- Tab bar: [e.g., "3 tabs with SF Symbol icons above labels, active=teal, inactive=grey, dark bg"]

**Typography:**
- Headings: [e.g., "32px, weight 700, white — 'May 28 at 11:03 PM'"]
- Section headers: [e.g., "ALL CAPS, 13px, weight 600, letter-spacing 1px, teal — 'TRANSCRIPTION'"]
- Body: [e.g., "16px, weight 400, off-white, line-height ~1.5"]
- Labels: [e.g., "12px, weight 500, muted grey — metadata, tab labels"]

**Special elements:**
- [e.g., "Waveform: grey rounded-rect container, horizontal bars, blue play button 48px circle"]
- [e.g., "Speed pills: row of 4 (0.75x, 1x, 1.5x, 2x), active has teal bg, others have dark bg"]
- [e.g., "Coral/red horizontal divider line below title, 2px height"]
- [e.g., "Vietnamese flag emoji + 'VI' in language selector pill"]
```

**Rules for the analysis:**
- **Be exhaustive.** List EVERY distinct UI element visible in the screenshot. Count them. If you see 15 elements, document 15 elements. Common elements that get missed: nav bar action buttons (all of them, not just back), tab bar icons, speed/playback controls, CTAs, badge indicators, credit counters, language selectors, divider lines, home indicator.
- Be precise about colors — sample from the actual image, don't guess. "#0A1628" is very different from "#000000".
- Describe component shapes exactly: "48px rounded-square with 12px radius" not "rounded button".
- Note spacing: "20px padding inside cards", "12px gap between elements".
- Note what is NOT there: "no shadow on cards", "no border on buttons", "no separator between list items".
- This analysis overrides `uiPatterns` from code extraction when they conflict — the screenshot is the visual truth.
- **Sizes in the visual spec are phone-logical.** The 886px App Store Preview canvas is 2.25× wider than an iPhone 16 Pro (393px). All sizes must be multiplied by 2.25 when writing scene code: a 48px button becomes 108px, 16px text becomes 36px, 11px tab labels become 25px. The code-guide has a complete scale table.

**Screenshot requirements** (tell the user):
- Any resolution — these are reference images, not embedded in the output
- Clean state — no notifications or debug banners (so the analysis captures the real design)
- One screenshot per distinct screen/feature. Multiple states of the same screen welcome.
- The skill will analyze your screenshots and build animated mock UI that matches your app's look exactly.

**If the user declines**, set `screenshots: []` and proceed. The skill will generate mock UI from extracted patterns as before.

After this step, proceed to the calling skill's next phase.

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
    PhoneFrame.tsx      # Device frame with bezel, Dynamic Island, spring entrance
    AmbientBackground.tsx # Animated gradient bg with floating orbs
    Caption.tsx         # Word-by-word animated caption with frosted pill
    FadeIn.tsx          # Directional spring fade-in wrapper
    SceneWrap.tsx       # Fade envelope for scene transitions
    AppIcon.tsx         # App icon with optional glow pulse
    TypeWriter.tsx      # Character-by-character text reveal
    BrowserFrame.tsx    # macOS browser chrome (light/dark)
    AnimatedCursor.tsx  # Bezier-interpolated cursor with click ripple
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

### AppIcon

Renders the app icon with optional animated glow effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | required | Filename in `public/` or URL |
| `size` | `number` | `120` | Icon size in px |
| `glow` | `boolean` | `false` | Enable pulsing glow |
| `glowColor` | `string` | `"rgba(0,122,255,0.4)"` | Glow color |

**When to use:** CTA/closing scenes. Builds brand recognition.

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

### BrowserFrame

macOS-style browser chrome with traffic lights, address bar, and content area. Light and dark variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Page content |
| `url` | `string` | `"app.example.com"` | Address bar text |
| `delay` | `number` | `0` | Entrance animation delay (frames) |
| `scale` | `number` | `1` | Scale multiplier |
| `variant` | `"light" \| "dark"` | `"light"` | Chrome theme |

### AnimatedCursor

Bezier-interpolated cursor that moves between keyframe positions with click ripple effect.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keyframes` | `CursorKeyframe[]` | required | `{ frame, x, y, click? }` positions |
| `visible` | `boolean` | `true` | Show/hide cursor |

## Animation Patterns

The removed primitives (FloatingCard, StatCard, HeatMap, ProgressBar, AppStoreBadge, IconSet) were simple wrappers that constrained the agent with hardcoded sizes. Write these patterns inline instead, scaled appropriately for your canvas:

**Animated counter** (before/after stat):
```tsx
const counter = spring({ frame, fps, delay: 10, config: { mass: 0.6, damping: 18, stiffness: 80 } });
const value = Math.round(interpolate(counter, [0, 1], [beforeValue, afterValue]));
```

**Cell-by-cell grid fill** (heatmap/contribution grid):
```tsx
{cells.map((cell, i) => {
  const cellEnter = spring({ frame, fps, delay: baseDelay + i * 0.4, config: { mass: 0.2, damping: 10, stiffness: 180 } });
  return <div key={i} style={{ opacity: 0.3 + cellEnter * 0.7, transform: `scale(${0.6 + cellEnter * 0.4})` }} />;
})}
```

**Progress bar fill**:
```tsx
const progress = interpolate(frame, [delay, delay + 30], [0, targetPercent], { extrapolateRight: "clamp" });
<div style={{ width: `${progress}%`, height, backgroundColor: color, borderRadius }} />
```

**Spring-entrance card** (replaces FloatingCard):
```tsx
const entrance = spring({ frame, fps, delay, config: { mass: 0.8, damping: 14, stiffness: 120 } });
<div style={{ opacity: entrance, transform: `translateY(${(1 - entrance) * 20}px)`, borderRadius, padding, background }}>
```

**App Store / Play Store badge** (for Marketing CTA scenes):
```tsx
// iOS badge — black rounded rect with Apple SVG
<div style={{ background: "#000", borderRadius: 14, padding: "14px 28px", display: "flex", alignItems: "center", gap: 12 }}>
  <svg width="28" height="34" viewBox="0 0 28 34" fill="white">
    <path d="M23.2 17.8c0-3.6 2.9-5.3 3-5.4-1.6-2.4-4.2-2.7-5.1-2.8-2.1-.2-4.2 1.3-5.3 1.3-1.1 0-2.8-1.2-4.6-1.2C8.5 9.8 6 11.2 4.6 13.5c-2.8 4.9-.7 12.1 2 16.1 1.3 1.9 2.9 4.1 5 4 2-.1 2.8-1.3 5.2-1.3 2.4 0 3.1 1.3 5.2 1.3 2.2 0 3.5-2 4.8-3.9 1.5-2.2 2.1-4.3 2.2-4.4 0-.1-4.2-1.6-4.2-6.4zM19.3 7.5c1.1-1.3 1.8-3.2 1.6-5-1.6.1-3.4 1-4.6 2.3-1 1.2-1.9 3-1.6 4.8 1.7.2 3.5-.9 4.6-2.1z" />
  </svg>
  <div>
    <div style={{ fontSize: 16, color: "rgba(255,255,255,0.8)" }}>Download on the</div>
    <div style={{ fontSize: 28, fontWeight: 600, color: "#FFF" }}>App Store</div>
  </div>
</div>
```

## Device Presets

| Preset | Screen | Notch | Store |
|--------|--------|-------|-------|
| `iphone-16-pro` | 393x852 | Dynamic Island | App Store |
| `iphone-15` | 375x812 | Dynamic Island | App Store |
| `ipad-pro-13` | 1024x1366 | None | App Store (iPad) |
| `pixel-9` | 412x915 | Punch hole | Play Store |

### Store-to-Device Mapping

| Store | Composition ID suffix | Device preset |
|-------|----------------------|---------------|
| App Store | `-AppStore` | `iphone-16-pro` |
| Play Store | `-PlayStore` | `pixel-9` |

For multi-store projects, Root.tsx registers one `<Composition>` per store. Scenes are shared — only the device frame (and navigation chrome style) differ. Canvas stays 886×1920 for both. Note: App Store Preview videos do not include store badges in the CTA (redundant inside the store listing); Marketing videos include an inline store badge in the CTA (see Animation Patterns above for the SVG snippet).

## Output Targets

AppShot supports two output targets with different visual rules:

| Target | Use case | Device frame | Overlay text | Screen content |
|--------|----------|-------------|-------------|----------------|
| **App Store Preview** | App Store / Play Store video previews and screenshots | **No device frame.** Full-bleed app screen fills the entire canvas edge-to-edge. | Text overlays appear *on top of* the app screen (semi-transparent pill background for readability). | Must include navigation chrome (status bar, nav bar, tab bar) to look like a real screenshot. |
| **Marketing** | Social media, website, pitch decks, ads | Device frame (PhoneFrame) wrapping the app screen. | Text and cards appear *beside* or *around* the device frame. | Navigation chrome optional (PhoneFrame provides the "device" context). |

**Why this matters:** Apple rejects App Store previews that include device frames or that don't sufficiently show the app in use. The App Store Preview target ensures compliance. The Marketing target preserves the current polished look for non-store contexts.

**Default:** App Store Preview for `appshot-videos` and `appshot-images`. Marketing for social/web contexts.

When the user selects **App Store Preview** target:
- Do NOT use PhoneFrame in any scene
- App UI fills the full 886×1920 canvas (videos) or store-required dimensions (screenshots)
- Include status bar, navigation bar, tab bar, and home indicator in every mock screen
- Caption/overlay text uses a semi-transparent pill background so it's readable over the app UI
- The result should look like a screen recording with text overlays

When the user selects **Marketing** target:
- Use PhoneFrame at scale 1.5 as before
- Text, cards, and badges appear outside/around the device frame
- Navigation chrome inside the phone is nice-to-have but not required

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

The skill scaffolds an `appshot-video/` directory inside the target project during Phase 3 code generation. See code-guide.md for the full scaffolding steps.

```bash
cd appshot-video
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
