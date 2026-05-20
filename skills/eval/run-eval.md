# Running Appshot Skill Evaluations

Manual evaluation process for `/appshot-videos` and `/appshot-images`. Run after modifying any SKILL.md or shared foundation file to catch quality regressions.

## Setup

1. Open a new Claude Code session in the appshot repo
2. Choose a scenario from `scenarios/`
3. Run the eval as described below

## Running a Video Eval

1. Tell Claude: "Pretend you're in a project with these files:" then paste the scenario's simulated file contents
2. Run `/appshot-videos` with the scenario's user input
3. Let Claude complete all 4 phases (extract → creative direction → generate code → preview)
4. After Claude produces the scene files, paste the rubric from `rubric.md` and say: "Score this output against each dimension, 1-5. Be honest — explain any score below 4."
5. Record scores in the results table

## Running an Image Eval

Same process, but run `/appshot-images` instead. Score dimensions 1, 3, 4, and 5 from the rubric (skip dimension 2 which is video-specific).

## Scenarios to Run

| Scenario | File | Key thing it tests |
|---|---|---|
| Habit tracker (rich) | `scenarios/habit-tracker-rich.md` | Full extraction, creative reasoning from rich context |
| Fitness (minimal) | `scenarios/fitness-minimal.md` | Graceful degradation, right questions asked |
| Finance (Flutter) | `scenarios/finance-flutter.md` | Cross-framework extraction, color conversion |
| Productivity (no metadata) | `scenarios/productivity-no-metadata.md` | Full creative interview, palette derivation |
| Unknown category | `scenarios/unknown-category.md` | Improvisation from app context alone |

## Results Table

```
| Scenario | Extraction | Creative | Technical | Conversational | Average | Pass? |
|---|---|---|---|---|---|---|
| habit-tracker-rich | /5 | /5 | /5 | /5 | /5 | |
| fitness-minimal | /5 | /5 | /5 | /5 | /5 | |
| finance-flutter | /5 | /5 | /5 | /5 | /5 | |
| productivity-no-metadata | /5 | /5 | /5 | /5 | /5 | |
| unknown-category | /5 | /5 | /5 | /5 | /5 | |
```

Pass: average 3.5+, no dimension below 2.

## What to Do with Results

- **Dimension below 3:** Identify root cause in SKILL.md or shared resources. Fix and re-run that scenario.
- **Extraction below 3:** Check `shared/extract-app-context.md` — are the scan patterns correct for the framework?
- **Creative below 3:** Check `shared/copy-principles.md` — are the writing rules clear? Check the Phase 2 guidance in SKILL.md.
- **Technical below 3:** Check Phase 3 code examples in SKILL.md — are the correct/wrong patterns explicit enough?
- **Conversational below 3:** Check the phase descriptions and STOP gates in SKILL.md — is the flow clear?
