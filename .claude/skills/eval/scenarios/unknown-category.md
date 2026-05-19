# Scenario: Travel App — Unknown Category

**Category:** Travel
**Framework:** Expo / React Native
**Context level:** Medium — app.json + colors + README

## Simulated File Contents

### app.json
```json
{
  "expo": {
    "name": "Wanderly",
    "slug": "wanderly",
    "description": "Plan trips with friends in real-time. Share itineraries, split costs, vote on activities.",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "ios": { "bundleIdentifier": "com.wanderly.app" }
  }
}
```

### src/colors.ts
```typescript
export const colors = {
  primary: "#0EA5E9",
  primaryLight: "#E0F2FE",
  background: "#F0F9FF",
  surface: "#FFFFFF",
  textPrimary: "#0C4A6E",
  textSecondary: "#64748B",
  success: "#22C55E",
  danger: "#EF4444",
};
```

### README.md
```
# Wanderly

Plan trips together, not apart.

## Features
- Collaborative itinerary builder — everyone adds, votes, and comments
- Real-time trip timeline with maps
- Built-in cost splitter (no more spreadsheets after the trip)
- Offline access to your full itinerary
- Photo journal shared across the group
```

No fastlane directory.

## User Input

"I want an App Store preview video for Wanderly."

## Expected Behavior

1. **Extraction:** Should find name, description, all colors, icon path from app.json and colors.ts
2. **Category:** Should identify as "travel" or "social/travel" and derive narrative from app context
3. **Improvisation:** Should reason about travel-specific creative direction from app context:
   - Pain points (planning trips in group chats is chaos, spreadsheets for cost splitting)
   - Narrative arc (Problem-Solution-Proof works — the group-planning frustration is visceral)
   - Copy angles (collaborative, real-time, no more spreadsheets)
4. **Arc recommendation:** Should recommend with reasoning, not just default
5. **Copy quality:** Should be travel-specific — "Plan together, not in group chats" not generic "Organize your life"
6. **Speed demo:** Should demonstrate a collaborative action (adding an activity, voting, splitting a cost)
7. **No degradation:** Quality should not be lower for uncommon categories — the skill derives narrative from the app itself
