# Scenario: Habit Tracker — Rich Context

**Category:** Habit tracking
**Framework:** Expo / React Native
**Context level:** Full — all metadata available

## Simulated File Contents

### app.json
```json
{
  "expo": {
    "name": "MindfulMinutes",
    "slug": "mindful-minutes",
    "description": "Build a meditation habit that fits your real life. No guilt, no streaks lost.",
    "version": "1.2.0",
    "icon": "./assets/icon.png",
    "ios": { "bundleIdentifier": "com.mindfulminutes.app" },
    "android": { "package": "com.mindfulminutes.app" }
  }
}
```

### src/theme.ts
```typescript
export const colors = {
  primary: "#6C63FF",
  primaryLight: "#EAE8FF",
  background: "#F8F7FF",
  surface: "#FFFFFF",
  textPrimary: "#1A1A2E",
  textSecondary: "#7C7C8A",
  success: "#4CAF50",
  danger: "#EF5350",
  accent: "#4A40D4",
};
```

### fastlane/metadata/en-US/full_description.txt
```
MindfulMinutes helps you build a lasting meditation practice — without the pressure of perfect streaks. Start with 2 minutes. Miss a day? Your progress stays. Track your journey from curious beginner to consistent meditator. Features: flexible streaks, guided sessions, mood tracking, weekly insights.
```

### README.md (first 80 lines)
```
# MindfulMinutes

A meditation app that meets you where you are. Build consistency without perfection.

## Features
- Flexible streaks that don't punish missed days
- Guided sessions from 2-20 minutes
- Mood tracking before and after sessions
- Weekly insights and consistency reports
- Journey milestones (Curious → Builder → Consistent)
```

## User Input

"I want an App Store preview video for MindfulMinutes."

## Expected Behavior

1. **Extraction:** Should find app name, description, all colors, icon path, category (habit tracking), and store description without asking
2. **Strategy:** Should infer habit-tracking category from the rich context and derive narrative from code analysis
3. **Arc:** Should recommend Transformation arc (identity journey fits meditation/habit)
4. **Questions:** Should only ask about proof metrics (not in code) and emotional payoff specifics
5. **Copy quality:** Captions should reference meditation-specific language, not generic habit language
6. **Config:** Should be technically valid with all props
