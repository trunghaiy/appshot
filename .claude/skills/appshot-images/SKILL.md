---
name: appshot-images
description: Generate App Store and Google Play screenshot designs. Use when the user wants to create store listing images, screenshot mockups, or promotional graphics for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick] [--count 6]"
license: MIT
metadata:
  author: kiennguyen
  version: 1.0.0
---

# Appshot Images — App Store Screenshot Generator

Generate polished App Store and Google Play screenshots by acting as creative director. Scan the codebase for app context, guide the user through feature selection and copy decisions, then produce ready-to-render screenshot compositions.

## Project context

- Package manifest: !`cat package.json 2>/dev/null || cat pubspec.yaml 2>/dev/null || cat app.json 2>/dev/null`
- App colors: !`find . -maxdepth 4 \( -name 'colors.xml' -o -name 'Colors.swift' -o -name 'colors.ts' -o -name 'theme.ts' -o -name 'Color.kt' -o -name 'tailwind.config.js' -o -name 'tailwind.config.ts' \) 2>/dev/null | head -5 | xargs head -50 2>/dev/null`
- App icon: !`find . -maxdepth 5 \( -name 'ic_launcher.png' -o -name 'icon.png' \) -type f 2>/dev/null | head -3`
- Store metadata: !`cat fastlane/metadata/en-US/full_description.txt 2>/dev/null || cat fastlane/metadata/en-US/description.txt 2>/dev/null || cat fastlane/metadata/android/en-US/full_description.txt 2>/dev/null`
- README excerpt: !`head -80 README.md 2>/dev/null`

## What you do

You are a creative director for App Store screenshots. Your job is to help the user present their app's best features in a sequence of static images that convert browsers into downloaders — not just fill in templates.

### Five phases

1. **Extract & confirm** — Review the project context above. Read [extract-app-context.md](../shared/extract-app-context.md) for detailed scan instructions if context is sparse. Present findings and confirm with the user. Identify gaps.

2. **Screenshot strategy** — Decide how many screenshots to produce (default 6 for iOS, 8 for Android, or override with `--count`). Choose which features to highlight and in what order. See strategy guidance below. Present the plan for approval.

3. **Per-screenshot creative** — For each screenshot, define:
   - Hero feature (what the device screen shows)
   - Headline (4-6 words max)
   - Subtitle (one specific detail or number)
   - Device content description (actual app screen to display)
   - Background treatment (color, gradient, or pattern)

   Read [copy-principles.md](../shared/copy-principles.md) before drafting any text. Present all copy together for review — the headlines must read as a coherent sequence.

4. **Generate outputs** — Ask the user which format they prefer:
   - **Remotion compositions** — React components rendered with `npx remotion still`. Default if an appshot template exists in the project.
   - **HTML/Tailwind** — Standalone HTML files, one per screenshot.
   - **Spec document** — Structured brief for Figma, Canva, or a designer.

   Produce the chosen format with all creative decisions baked in. No placeholders.

5. **Review & iterate** — Walk through the set. Check:
   - Does screenshot 1 sell the app on its own?
   - Do the headlines tell a story when read in sequence?
   - Is every screenshot showing real app functionality?
   - Is the layout consistent across the set?

### Quick mode

If `$ARGUMENTS` contains "quick": compress phases 2-3 into inference. Use the extracted context to make all creative decisions autonomously. Present the complete spec for approval with a brief rationale for each screenshot, rather than asking questions. The user can iterate from there.

## Screenshot strategy guidance

### Ordering principles

- **Screenshot 1 = hero shot.** Core value proposition. Most viewed. Often the only one seen. This screenshot alone must make the case for downloading. Pair with the strongest headline and the most impressive app screen.
- **Screenshots 2-4 = key features.** In priority order — what users do most, what differentiates from competitors, what solves the biggest pain.
- **Screenshot 5 = social proof or stats.** Streak counts, user numbers, review quotes, milestone screens. Concrete evidence that the app delivers.
- **Last screenshot = CTA or differentiator.** Final impression. Either a call to action ("Free to start") or the one thing that makes you different from every competitor.

### Rules

- One feature per screenshot. Never two.
- Every screenshot must depict actual app functionality — Apple requires this and rejects screenshots that don't show the real UI.
- Device screens should show different states of the app. Never repeat the same screen.
- The set should cover the full user journey: discovery, core action, result/payoff.

## Per-screenshot copy guidance

Read [copy-principles.md](../shared/copy-principles.md) for full rules. Key points for screenshots:

### Headlines

- 4-6 words max. Bolder and shorter than video captions.
- Benefit-first. Lead with what the user gets.
- One job per headline: provoke, state a benefit, or call to action.
- Be specific — include numbers, names, or concrete outcomes.

### Subtitles

- One specific detail or number that supports the headline.
- Not a second headline. A supporting fact.

### Sequence test

Read all headlines top-to-bottom. They should tell the complete story of the app even without seeing the images. If the sequence doesn't flow, reorder or rewrite.

### Common mistakes

- Feature names as headlines ("Smart Recovery Mode") — use benefits instead ("Never lose your streak").
- Repeating the app name in every headline — mention it once at most.
- Generic claims ("Easy to use", "Beautiful design") — these waste the slot.
- Placeholder text — always draft real copy.

## Layout principles

### Device frame

- Centered or offset to one side, always showing real app UI.
- Device must be large enough that screen content is legible at store listing size.
- Use consistent device positioning across all screenshots in the set.

### Text placement

- Headlines above or below the device frame.
- Never overlay text on the device screen.
- Consistent text position across all screenshots.
- Sufficient contrast between text and background.

### Background

- Solid brand color or subtle gradient. Never busy patterns, photos, or illustrations behind the device.
- Background color can shift per screenshot to create visual variety, but stay within the brand palette.
- Consider alternating between light and dark variants of the brand color.

### Consistency

- Same layout structure across all screenshots in the set.
- Same font sizes, weights, and positions.
- Same device size and placement.
- Variations in background color and content, not in structure.

## Device dimensions

### iOS (App Store Connect)

| Device | Dimensions (px) | Required |
|---|---|---|
| iPhone 6.7" (15 Pro Max, 16 Pro Max) | 1290 x 2796 | Yes |
| iPhone 6.5" (11 Pro Max, XS Max) | 1242 x 2688 | Optional |
| iPhone 5.5" (8 Plus, 7 Plus) | 1242 x 2208 | Optional |
| iPad 12.9" (6th gen) | 2048 x 2732 | Optional |
| iPad 13" (M4) | 2064 x 2752 | Optional |

### Android (Google Play Console)

| Constraint | Value |
|---|---|
| Minimum | 1080 x 1920 |
| Maximum | 3840 x 2160 |
| Aspect ratio | 16:9 (portrait) or 9:16 (landscape) |
| Recommended | 1080 x 1920 |

Default output targets iPhone 6.7" (1290 x 2796) for iOS and 1080 x 1920 for Android.

## Store requirements

### iOS (App Store)

- Up to 10 screenshots per device size.
- 6.7" screenshots required. 6.5" and iPad are optional but recommended.
- Formats: PNG or JPEG.
- Screenshots must show actual app functionality.
- Text overlays are allowed but must not misrepresent the app.
- No alpha transparency.

### Android (Google Play)

- Up to 8 screenshots.
- Minimum 1080 x 1920. Maximum file size 8 MB.
- Formats: PNG or JPEG (no alpha).
- At least 4 screenshots recommended for store listing quality.
- Phone screenshots required. Tablet and Chromebook optional.

## Category-specific guidance

After identifying the app category in phase 1, derive your screenshot strategy directly from the app's source code, README, and store description. There are no pre-written strategy files — you analyze the app and make creative decisions based on what you find.

Read [copy-principles.md](../shared/copy-principles.md) for writing rules that apply across all categories.

## Output formats

### 1. Remotion compositions (default)

Render individual frames as PNG files using Remotion's still image renderer.

```bash
npx remotion still CompositionId --frame 0 --image-format png --output out/screenshot-1.png
```

Each screenshot is a separate Remotion composition. Components use the same primitives as the video skill (PhoneFrame, AmbientBackground, AppIcon) but composed for static output.

Set `width` and `height` on the composition to match the target device dimensions.

### 2. HTML/Tailwind standalone files

One HTML file per screenshot. Self-contained with inline styles or Tailwind CDN. Can be opened in a browser and captured at exact dimensions using a screenshot tool or headless browser:

```bash
npx playwright screenshot screenshot-1.html screenshot-1.png --viewport-size 1290,2796
```

### 3. Spec document

A structured brief describing each screenshot in detail: headline, subtitle, device screen description, background treatment, layout notes. Intended for handoff to a designer working in Figma, Canva, or Sketch.

Format as a numbered list with all creative decisions explicit. No ambiguity.

## Supporting resources

- Shared extraction guide: [extract-app-context.md](../shared/extract-app-context.md)
- Copy principles: [copy-principles.md](../shared/copy-principles.md)

## Tips

- Screenshot 1 does 80% of the work — spend 80% of your effort there.
- Show the app in a realistic, populated state. Empty screens don't sell.
- Use real or realistic data in device screens. "John's Workout" beats "Sample Item 1."
- Test readability at store listing size — headlines that need zooming to read are too small.
- Dark mode screenshots can stand out in a sea of white backgrounds. Consider offering both.
- Localized screenshots convert better — note if the user ships in multiple languages.
- iOS and Android sets can share the same creative strategy but must use different device dimensions.
