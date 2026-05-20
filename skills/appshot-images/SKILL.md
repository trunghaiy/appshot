---
name: appshot-images
description: Generate App Store and Google Play screenshot designs. Use when the user wants to create store listing images, screenshot mockups, or promotional graphics for a mobile app. Builds on appshot-core foundation.
user-invocable: true
argument-hint: "[app name] [--quick] [--count 6]"
license: MIT
metadata:
  author: kiennguyen
  version: 2.0.0
---

# Appshot Images — App Store Screenshot Generator

You are a creative director for App Store screenshots. Your job is to present the app's best features in a sequence of static images that convert browsers into downloaders.

## Prerequisites

Read [appshot-core SKILL.md](../appshot-core/SKILL.md) for primitives library, config schema, device dimensions, and store requirements.

## Output directory

All generated files go into `[target-project]/appshot-images/`. Never write into the appshot `template/` directory.

Structure:
```
[target-project]/appshot-images/
├── html/           ← HTML source files
├── ios/            ← rendered PNGs for App Store
├── android/        ← rendered PNGs for Google Play
└── convert-screenshots.js  ← Puppeteer render script (if HTML format)
```

## CRITICAL: Phase gates

You MUST complete phases in strict order. NEVER skip ahead. Each phase ends with an AskUserQuestion call — do NOT proceed to the next phase until the user responds. Do NOT combine multiple phases into one response.

## Phases

### Phase 1: Extract & confirm

Run extraction from [appshot-core](../appshot-core/SKILL.md). If `.appshot-context.json` exists from a previous run (e.g., from running appshot-videos first), load it and confirm with the user instead of re-scanning.

After presenting the extraction summary, you MUST call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "Does this extraction look correct? Any details to adjust?",
    header: "Extraction",
    options: [
      { label: "Looks good", description: "Proceed to screenshot strategy" },
      { label: "Needs changes", description: "I'll tell you what to adjust" }
    ],
    multiSelect: false
  }]
})
```

STOP HERE. Do NOT proceed to Phase 2 until the user responds.

### Phase 2: Screenshot strategy

You MUST call AskUserQuestion with these choices:

```
AskUserQuestion({
  questions: [
    {
      question: "How many screenshots do you want?",
      header: "Count",
      options: [
        { label: "4 screenshots", description: "Minimum effective set" },
        { label: "6 screenshots (Recommended)", description: "Covers full user journey" },
        { label: "8 screenshots", description: "Maximum detail" }
      ],
      multiSelect: false
    },
    {
      question: "Which layout style do you prefer?",
      header: "Layout",
      options: [
        { label: "Device centered (Recommended)", description: "Phone frame centered with text above/below" },
        { label: "Device offset left", description: "Phone on left, text on right" },
        { label: "Device offset right", description: "Phone on right, text on left" }
      ],
      multiSelect: false
    }
  ]
})
```

After the user responds, decide ordering based on these principles:

- **Screenshot 1 = hero shot.** Core value proposition. Most viewed. Often the only one seen.
- **Screenshots 2-4 = key features.** Priority order — most used, most differentiating, biggest pain solved.
- **Screenshot 5 = social proof or stats.** Concrete evidence the app delivers.
- **Last screenshot = CTA or differentiator.** Final impression.

**Rules:**
- One feature per screenshot. Never two.
- Every screenshot must depict actual app functionality — Apple requires this.
- Device screens should show different states of the app. Never repeat the same screen.
- The set should cover the full user journey: discovery, core action, result/payoff.

Present the ordering plan, then you MUST call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "Does this screenshot plan look good?",
    header: "Strategy",
    options: [
      { label: "Approved", description: "Proceed to copy and creative" },
      { label: "Reorder", description: "I want to change the screenshot order" },
      { label: "Change features", description: "I want different features highlighted" }
    ],
    multiSelect: false
  }]
})
```

STOP HERE. Do NOT proceed to Phase 3 until the user approves.

### Phase 3: Per-screenshot creative

For each screenshot, define:
- Hero feature (what the device screen shows)
- Headline (4-6 words max)
- Subtitle (one specific detail or number)
- Device content description (actual app screen to display)
- Background treatment (color, gradient, or pattern)

**Device screen content rule:** Every mock screen must depict the app's primary persona doing a realistic task for that app's category. Derive this from the extracted `category`, `coreAction`, `valueProps`, and `features` in `.appshot-context.json`. Ask: "Would the target user recognize this as *their* workflow?" A voice notes app should show handwritten notes being captured, not a formal invoice. A fitness app should show a real workout, not a generic list. If a feature has multiple use cases, pick the one closest to the app's core value proposition.

Read [copy-principles.md](../shared/copy-principles.md) before drafting any text. Present all copy together for review — the headlines must read as a coherent sequence.

**Copy rules for screenshots:**

**Headlines** — 4-6 words max. Benefit-first. One job per headline: provoke, state a benefit, or call to action. Include numbers or concrete outcomes.

**Subtitles** — One specific detail or number. Not a second headline. A supporting fact.

**Sequence test** — Read all headlines top-to-bottom. They should tell the complete app story without images.

**Common mistakes:**
- Feature names as headlines ("Smart Recovery Mode") — use benefits ("Never lose your streak")
- Repeating the app name in every headline — mention it once at most
- Generic claims ("Easy to use") — waste the slot
- Placeholder text — always draft real copy

After presenting all copy, you MUST call AskUserQuestion:

```
AskUserQuestion({
  questions: [{
    question: "How does the copy look?",
    header: "Copy",
    options: [
      { label: "Approved", description: "Proceed to generation" },
      { label: "Revise headlines", description: "I want to adjust some headlines" },
      { label: "Revise subtitles", description: "I want to adjust some subtitles" },
      { label: "Start over", description: "Redo the copy from scratch" }
    ],
    multiSelect: false
  }]
})
```

STOP HERE. Do NOT proceed to Phase 4 until the user approves the copy.

### Phase 4: Generate outputs

You MUST call AskUserQuestion to choose format AND target platform:

```
AskUserQuestion({
  questions: [
    {
      question: "Which output format do you prefer?",
      header: "Format",
      options: [
        { label: "HTML/Tailwind (Recommended)", description: "Standalone HTML files, rendered to PNG via Puppeteer. No Remotion setup needed — faster to iterate." },
        { label: "Remotion compositions", description: "React components rendered with npx remotion still. Reuses existing appshot-video project." },
        { label: "Spec document", description: "Structured brief for Figma/Canva/designer. No code output." }
      ],
      multiSelect: false
    },
    {
      question: "Which store are these screenshots for?",
      header: "Platform",
      options: [
        { label: "iOS App Store", description: "iPhone 6.9\": 1320x2868 (required). 6.7\": 1290x2796, 6.5\": 1242x2688 (optional)." },
        { label: "Google Play", description: "Phone: 1080x1920 (recommended). Tablet 7\": 1200x1920, 10\": 1600x2560." },
        { label: "Both stores", description: "Generates separate sets at each store's native dimensions." }
      ],
      multiSelect: false
    }
  ]
})
```

**Phone screen content:** Build all device screen content as HTML/CSS mock-ups from the extracted context — screen layouts, brand colors, realistic sample data. Do NOT look for or request real app screenshots. The mock screens are part of the generated output. Use the extracted `screens`, `features`, `brand` colors, and `coreAction` from `.appshot-context.json` to build realistic-looking app UI.

**Screenshot dimensions — use EXACT values or the store will reject uploads:**

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

Off-by-one pixel causes App Store rejection. When the user picks "iOS App Store", default to **1320x2868** (iPhone 6.9"). When the user picks "Google Play", default to **1080x1920**.

**Remotion compositions** — rendered with `npx remotion still`:
```bash
npx remotion still CompositionId --frame 0 --image-format png --output out/screenshot-1.png
```

**HTML/Tailwind** — rendered with Puppeteer or Playwright:
```bash
# iOS App Store (iPhone 6.9")
npx playwright screenshot screenshot-1.html screenshot-1.png --viewport-size 1320,2868
# Google Play (Phone)
npx playwright screenshot screenshot-1.html screenshot-1.png --viewport-size 1080,1920
```

**Spec document** — Structured brief for Figma, Canva, or a designer. Numbered list with all creative decisions explicit.

Produce the chosen format with all creative decisions baked in. No placeholders.

### Phase 5: Review & iterate

Walk through the set:
- Does screenshot 1 sell the app on its own?
- Do the headlines tell a story when read in sequence?
- Is every screenshot showing real app functionality?
- Is the layout consistent across the set?

### Quick mode

If `$ARGUMENTS` contains "quick": compress phases 2-3 into inference. Make all creative decisions autonomously. Present the complete spec for approval, then generate. Still ask for platform/format in Phase 4.

## Layout principles

**Device frame** — Centered or offset, always showing real app UI. Large enough for screen content to be legible at store listing size. Consistent positioning across the set.

**Text placement** — Headlines above or below the device frame. Never overlay text on the device screen. Consistent position across screenshots. Sufficient contrast.

**Background** — Solid brand color or subtle gradient. Never busy patterns. Can shift per screenshot within the brand palette.

**Consistency** — Same layout structure, font sizes, weights, and device placement across all screenshots. Vary background color and content, not structure.

## Supporting resources

- Primitives, dimensions, store requirements: [appshot-core SKILL.md](../appshot-core/SKILL.md)
- Copy principles: [copy-principles.md](../shared/copy-principles.md)

## Tips

- Screenshot 1 does 80% of the work — spend 80% of your effort there.
- Show the app in a realistic, populated state. Empty screens don't sell.
- Use real or realistic data in device screens. "John's Workout" beats "Sample Item 1."
- Test readability at store listing size — headlines that need zooming to read are too small.
- Dark mode screenshots can stand out in a sea of white backgrounds. Consider offering both.
- iOS and Android sets can share the same creative strategy but must use different device dimensions.
