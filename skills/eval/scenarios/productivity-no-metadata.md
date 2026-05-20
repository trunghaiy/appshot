# Scenario: Productivity App — No Metadata

**Category:** Productivity
**Framework:** None detected
**Context level:** None — empty project, user describes verbally

## Simulated File Contents

No files found by any scan commands. All dynamic context injection returns empty.

## User Input

"I built a task management app called Focusly. It's super minimal and calm — just your tasks for today, nothing else. Primary color is indigo (#4F46E5). I want an App Store video for iPhone."

## Expected Behavior

1. **Extraction:** Should report that no project files were found, note all gaps
2. **Category inference:** Should infer "productivity" from "task management" and derive narrative from the app description
3. **Full creative brief:** Since nothing was extracted, should ask about:
   - Pain point (what frustrates users about other task apps?)
   - Core action loop (adding a task? completing a task?)
   - Proof metrics (tasks completed? projects shipped?)
   - App icon (user needs to provide a PNG)
4. **Arc:** Should recommend Hook-Demo-Proof (productivity default — skip pain-point, lead with the calm UI)
5. **Color derivation:** Should derive a full palette from the single indigo #4F46E5 (primaryLight, background, surface, etc.)
6. **Copy tone:** Should match "minimal and calm" — not aggressive or urgent. Captions should feel quiet and confident.
7. **Config:** Should be complete despite all verbal input — no missing props
