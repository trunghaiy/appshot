# Appshot Skill Evaluation Rubric

Score each dimension 1-5. Use this rubric after running a skill (`/appshot-videos` or `/appshot-images`) against a test scenario to evaluate output quality.

## Scoring Guide

| Score | Meaning |
|---|---|
| 1 | Failed — missing or incorrect |
| 2 | Partial — attempted but significant gaps |
| 3 | Acceptable — meets basic requirements |
| 4 | Good — thoughtful, specific, well-reasoned |
| 5 | Excellent — would impress a marketing professional |

**Pass threshold:** Average 3.5+ across all dimensions, no dimension below 2.

## Dimension 1: Extraction Quality

- Detected the correct framework (Expo/Flutter/iOS/Android)?
- Extracted app name without asking (if present in manifest)?
- Extracted brand colors without asking (if present in theme files)?
- Found app icon path without asking?
- Correctly inferred the app category from description/README?
- Found and used store metadata or README content?
- Cited source files for each extracted value?

## Dimension 2: Creative Quality — Video

- Recommended a specific narrative arc with reasoning (not "pick your scenes")?
- Arc recommendation matches the app category?
- All captions are specific and benefit-oriented (no placeholders, no generic text)?
- Every caption passes the billboard test (under 8 words)?
- Tagline follows setup + differentiator formula?
- taglineHighlight contains the differentiator, not the setup?
- Pills are benefits, not feature names? Pills differentiate from competitors?
- Scene order matches the recommended arc?
- Durations are within recommended ranges?
- Duration rationale is provided (not just magic numbers)?
- typeFrames math is correct? Human-readable timing is provided alongside frame numbers?

## Dimension 3: Creative Quality — Images

- First screenshot is the hero shot (core value, not just "feature #1")?
- Each screenshot focuses on exactly one feature?
- Headlines are 4-6 words?
- Headlines are scannable as a sequence (read top-to-bottom = coherent pitch)?
- Subtitles add a specific detail or number?
- Layout is consistent across all screenshots?
- Dimensions are correct for the target store?

## Dimension 4: Technical Validity

- Generated config imports `AppConfig` type correctly?
- All required props present for each scene type?
- `items` array in pain-point has correct `{label, filled}` structure?
- `typeFrames` array length matches `value` string length?
- `durationInFrames` values are positive integers?
- Brand colors are valid hex strings?
- Device preset is one of the valid options?
- Config would pass TypeScript type checking?
- `npm run dev` would render without errors?

## Dimension 5: Conversational Quality

- Presented extracted context summary before proceeding?
- Asked for confirmation of extracted values?
- Only asked questions the scan couldn't answer?
- In quick mode: minimized questions (ideally zero)?
- Proposed answers from README/metadata instead of asking open-ended?
- Explained creative reasoning for arc choice?
- Explained creative reasoning for copy choices?
- Offered specific alternatives when the user pushed back?

## Results Template

```
| Dimension | Score | Notes |
|---|---|---|
| Extraction | /5 | |
| Creative (Video) | /5 | |
| Creative (Images) | /5 | |
| Technical | /5 | |
| Conversational | /5 | |
| **Average** | **/5** | |
```
