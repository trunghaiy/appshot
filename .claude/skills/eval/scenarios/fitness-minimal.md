# Scenario: Fitness App — Minimal Context

**Category:** Fitness
**Framework:** React Native (bare)
**Context level:** Minimal — only package.json

## Simulated File Contents

### package.json
```json
{
  "name": "fittrack",
  "version": "0.8.0",
  "description": "workout tracker"
}
```

No other metadata files exist. No theme file, no fastlane, no README, no icon found by scan commands.

## User Input

"Make me an App Store video for FitTrack. It's a workout logging app — you tap in your exercise name and weight, and it tracks your progress over time. Primary color is probably something like a teal-green."

## Expected Behavior

1. **Extraction:** Should find name "fittrack" and description "workout tracker" from package.json. Should note missing: colors, icon, store metadata
2. **Strategy:** Should infer fitness category and derive narrative from the minimal context available
3. **Graceful degradation:** Should ask for brand colors (user said "teal-green" — Claude derives a palette), icon path, and platform
4. **Creative brief:** Should ask about pain point (what frustrates users about other workout apps), core action (logging an exercise), and proof metrics
5. **Arc:** Should recommend Problem-Solution-Proof (fitness category default)
6. **Copy quality:** Should draft specific captions despite minimal context — "Log a set in 3 seconds" not "Track your workouts"
7. **No placeholders:** Every caption, pill, and tagline should be filled in
