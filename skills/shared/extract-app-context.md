# Extract App Context

Scan the user's codebase to extract app identity, brand colors, icon, features, and store metadata before asking any questions. Don't ask for what you can find.

## Step 1: Detect Framework

Check for marker files in this order. Stop at the first match.

| Framework | Marker files |
|---|---|
| Expo / React Native | `app.json`, `app.config.ts`, `app.config.js` |
| Flutter | `pubspec.yaml` |
| iOS (Swift) | `*.xcodeproj/`, `*.xcworkspace/`, `Package.swift` |
| Android (Kotlin/Java) | `app/src/main/AndroidManifest.xml`, `build.gradle.kts`, `build.gradle` |

Use `ls` or `find . -maxdepth 3` to check. If none match, note that no framework was detected and move on — the user may describe their app verbally.

## Step 2: Extract App Identity

### Expo / React Native
- **Name**: `app.json` → `expo.name` or `name`
- **Description/tagline**: `app.json` → `expo.description` or `description`
- **Bundle ID**: `app.json` → `expo.ios.bundleIdentifier` or `expo.android.package`
- **Also check**: `package.json` → `name`, `description`

### Flutter
- **Name**: `pubspec.yaml` → `name:`
- **Description**: `pubspec.yaml` → `description:`
- **Also check**: `android/app/src/main/AndroidManifest.xml` → `android:label`, `ios/Runner/Info.plist` → `CFBundleDisplayName`

### iOS (Swift)
- **Name**: `Info.plist` → `CFBundleDisplayName` or `CFBundleName`
- **Bundle ID**: `Info.plist` → `CFBundleIdentifier`
- **Also check**: `project.pbxproj` for product name

### Android (Kotlin/Java)
- **Name**: `app/src/main/res/values/strings.xml` → `<string name="app_name">`
- **Package**: `AndroidManifest.xml` → `package` attribute
- **Also check**: `build.gradle.kts` or `build.gradle` → `applicationId`

## Step 3: Extract Brand Colors

Search for color definitions. Read the first match in each framework.

### Expo / React Native
Search paths (in order):
1. `src/theme.ts` or `src/theme.js`
2. `src/colors.ts` or `src/constants/colors.ts`
3. `theme/colors.ts` or `theme/index.ts`
4. `tailwind.config.js` or `tailwind.config.ts` → `theme.extend.colors`
5. `app.json` → `expo.primaryColor`, `expo.backgroundColor`

Look for: named color exports (`primary`, `secondary`, `background`, `surface`, `accent`, `success`, `danger/error`), hex strings, `rgb()` values.

### Flutter
Search paths:
1. `lib/theme.dart` or `lib/theme/app_theme.dart`
2. `lib/theme/colors.dart` or `lib/constants/colors.dart`
3. `lib/main.dart` → `ThemeData()`

Look for: `Color(0xFF...)` constants, `primaryColor`, `accentColor`, `colorScheme` definitions.

### iOS (Swift)
Search paths:
1. `*.xcassets/Colors/**/*.colorset/Contents.json` — parse `components` for RGB
2. `**/Theme.swift` or `**/Colors.swift` or `**/ColorScheme.swift`

Look for: static `Color` properties, `UIColor` hex initializers, asset catalog color definitions.

### Android
Search paths:
1. `app/src/main/res/values/colors.xml` — `<color name="primary">#RRGGBB</color>`
2. `app/src/main/res/values/themes.xml` — `<item name="colorPrimary">`
3. `**/ui/theme/Color.kt` — Jetpack Compose `Color()` definitions

## Step 4: Find App Icon

| Framework | Where to look |
|---|---|
| Expo/RN | `app.json` → `expo.icon` field (usually `./assets/icon.png`) |
| Flutter | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` or `ios/Runner/Assets.xcassets/AppIcon.appiconset/` |
| iOS | `*.xcassets/AppIcon.appiconset/` → find the largest `.png` |
| Android | `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` |

## Step 5: Extract Features & Store Metadata

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

## Step 6: Extract Navigation Chrome

For realistic mock screens, extract the navigation patterns visible to the user.

**What to extract:**
- **Navigation type**: tabs, stack, drawer, or combination
- **Tab bar**: label text for each tab, icon descriptions (e.g., "house icon", "magnifying glass"), which tab is default
- **Navigation headers**: title style (large title vs inline), back button presence, right action buttons
- **Status bar style**: light content (white text) or dark content (black text)

**Where to find it:**

| Framework | Tab bar | Nav header | Status bar |
|---|---|---|---|
| Expo / React Native | `tabBarLabel`, `tabBarIcon` in navigator `screenOptions` | `headerTitle`, `headerRight`, `headerLeft` | `StatusBar` component or `statusBarStyle` option |
| Flutter | `BottomNavigationBar` items in `Scaffold` | `AppBar` title/actions | `SystemUiOverlayStyle` in `AppBar` |
| iOS (Swift) | `UITabBarItem` setup, SwiftUI `.tabItem` | `navigationItem.title`, `.navigationTitle`, `.toolbar` | `preferredStatusBarStyle`, `.statusBarHidden` |
| Android | `BottomNavigationView` menu XML, Compose `NavigationBar` | `Toolbar`/`TopAppBar` title and actions | `WindowInsetsController` or theme `statusBarColor` |

If navigation files are not found, note it — the user may describe their navigation verbally.

## Step 6b: Extract ASO Keywords

Apple and Google now read text in screenshots and videos. Extract a keyword list so overlay text can incorporate high-value search terms.

**Primary source:** `fastlane/metadata/en-US/keywords.txt` (comma-separated).

**Fallback sources** (if no Fastlane keywords): derive 8-12 keyword candidates from:
1. App Store subtitle (`fastlane/metadata/en-US/subtitle.txt`)
2. Store description — most repeated nouns and action verbs
3. Feature names — mapped to user-facing search terms
4. Category terms from Step 7's signals table

Output a ranked list (most important first), max 12 keywords. Include both single words and short phrases.

## Step 6c: Extract UI Patterns

Scan component styling to capture the app's visual design language. This data helps mock screens match the real app's look.

**What to extract:**
- **Border radius**: button, card, and input corner radius (e.g., "pill buttons", "8px cards")
- **Spacing**: horizontal padding, section gaps (e.g., "16px padding", "24px gaps")
- **Typography**: font family (custom or system), heading weight, body size, ALL CAPS headers?
- **Button style**: shape, size, fill vs outline, icon-only
- **Card style**: background, border, shadow, glass/blur effects
- **Icon library**: SF Symbols, Material Icons, Lucide, Ionicons, custom SVG
- **Special elements**: waveforms, progress rings, gradients, tags/chips, badges

**Where to find it:**

| Framework | Style sources |
|---|---|
| Expo / React Native | `StyleSheet.create()`, inline `style={}`, NativeWind/Tailwind classes, component library imports |
| Flutter | `BoxDecoration`, `BorderRadius`, `TextStyle`, `ButtonStyle`, theme data |
| iOS (Swift) | `.cornerRadius`, `.font()`, `.padding()`, SF Symbol names |
| Android | `shapes.xml`, `styles.xml`, Compose `RoundedCornerShape()`, Material icon imports |

Read 2-3 of the most visually rich screen components to get representative patterns. Don't exhaustively scan every file.

## Step 7: Infer App Category

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

If no clear match, note "uncategorized" — the user will clarify.

## Step 8: Present Findings

Summarize what you found concisely. Always cite the source file so the user can verify.

```
I scanned your project and found:

- **App:** [name] (from [source file])
- **Tagline:** [description text] (from [source file])
- **Platform:** [iOS/Android/both] (from [evidence])
- **Colors:** primary [hex], background [hex], ... (from [source file])
- **Icon:** [file path]
- **Category:** [inferred category] based on [keywords/description]
- **Navigation:** [tabs / stack / drawer] — [tab labels] — default: [tab]
- **Status bar:** [dark content / light content]
- **UI patterns:** [font], [button style], [card style], [border radius], [icon library]
- **ASO keywords:** [keyword1], [keyword2], [keyword3], ... (from [source])
- **Store description:** [found at path / not found]

Does this look right? Anything to correct?
```

If fields are missing, note them: "I couldn't find brand colors — do you have a theme file, or should we pick colors together?"

Only after confirmation, proceed to the creative brief — and skip any questions already answered by the scan.
