# Annotated Example: Kernio AI In 60 Seconds

Product demo video for a web-based AI content platform. 60 seconds, 1920x1080, persona-driven narrative.

## Why this video works

- **Persona story arc:** Opens with a frustrated expert (0 posts, invisible), ends with a transformed thought leader (47 posts, book draft, podcast invites). The before/after bookend creates emotional payoff.
- **Bespoke UI mockups:** Every BrowserFrame scene shows realistic Kernio UI — post editor with toolbar, book editor with 3-panel layout, content dashboard with topic cards. No screenshots, no generic placeholders.
- **AnimatedCursor interactions:** The First Post scene uses cursor to click topic selection, then watches text generate. This shows the product *doing something*, not just displaying it.
- **Animated counters:** Word count (0 → 45,200), post count (0 → 47), match score (0 → 94%). Numbers in motion are more compelling than static stats.
- **Pacing:** 8 scenes, 60 seconds. Feature scenes (Setup, FirstPost, BookEditor) get 8-10s. Transition scenes (Intro, Outcome, CTA) get 5-6s. No scene overstays.

## Scene breakdown

| # | Scene | Dur | Primitives | Animation density | Notes |
|---|-------|-----|-----------|-------------------|-------|
| 1 | Meet Maya | 5s | AmbientBackground(dark), FloatingCard, FadeIn | 3 (card + stats + caption) | Persona intro. Red pulsing "0" values create urgency. Visible at frame 0. |
| 2 | 90s Setup | 10s | BrowserFrame, ProgressBar, FadeIn, Caption | 4 (browser + progress + tags + caption) | Onboarding flow mockup. Upload animation + expertise extraction. |
| 3 | First Post | 9s | BrowserFrame, AnimatedCursor, TypeWriter, Caption | 5 (browser + cursor + typing + topic selection + caption) | Highest density scene. Cursor clicks topic → post generates. The money shot. |
| 3b | Capture | 8s | FadeIn, FloatingCard, Caption, ProgressBar | 3 (cards + counter + caption) | Multi-source capture cards slide in from left. Knowledge base counter ticks up. |
| 4 | Montage | 7s | FadeIn, FloatingCard, Caption | 3 (post cards + calendar + caption) | Quick stack of 3 generated posts + weekly calendar fills. Communicates volume. |
| 5 | Book Editor | 10s | BrowserFrame, TypeWriter, FadeIn, Caption | 4 (browser + typing + source cards + caption) | 3-panel layout: chapters, editor, sources. Word counter 0→45,200. Most complex mockup. |
| 6 | Outcome | 6s | AmbientBackground(dark), StatCard, FadeIn, Caption | 4 (5 stat cards staggering in + caption) | Before/after transformation. Each stat springs in with counter. Emotional payoff. |
| 7 | CTA | 5s | AmbientBackground(dark), AppIcon, FadeIn, Caption | 3 (logo + button + platform badges) | Glow-pulse CTA button. URL visible. Platform badges spring in. |

## Key patterns to replicate

1. **Bookend transformation:** Scene 1 stats (0 posts, invisible) → Scene 6 stats (47 posts, thought leader). The callback makes the narrative circular.
2. **BrowserFrame + AnimatedCursor** in at least 2 scenes. This is what differentiates from a slide deck.
3. **Mixed scene types:** Not all scenes use BrowserFrame. Alternate between browser mockups (product), dark ambient (emotion), and stat cards (proof).
4. **Glassmorphic details:** Cards use blur backgrounds, gradient borders, subtle shadows throughout.
5. **3-4 animations per scene** — enough to feel alive, not overwhelming.
