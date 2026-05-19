# Running Appshot Skill Evaluations

Manual evaluation process for `/appshot-videos` and `/appshot-images`. Run after modifying any SKILL.md, strategy file, or shared foundation file to catch quality regressions.

## Setup

1. Open a new Claude Code session in the appshot repo
2. Choose a scenario from `scenarios/`
3. Run the eval as described below

## Running a Video Eval

1. Tell Claude: "Pretend you're in a project with these files:" then paste the scenario's simulated file contents
2. Run `/appshot-videos` with the scenario's user input
3. Let Claude complete all 5 phases (extract → brief → narrative → config → preview)
4. After Claude produces the config, paste the rubric from `rubric.md` and say: "Score this output against each dimension, 1-5. Be honest — explain any score below 4."
5. Record scores in the results table

## Running an Image Eval

Same process, but run `/appshot-images` instead. Score dimensions 1, 3, 4, and 5 from the rubric (skip dimension 2 which is video-specific).

## Scenarios to Run

| Scenario | File | Key thing it tests |
|---|---|---|
| Habit tracker (rich) | `scenarios/habit-tracker-rich.md` | Full extraction, strategy file usage |
| Fitness (minimal) | `scenarios/fitness-minimal.md` | Graceful degradation, right questions asked |
| Finance (Flutter) | `scenarios/finance-flutter.md` | Cross-framework extraction, color conversion |
| Productivity (no metadata) | `scenarios/productivity-no-metadata.md` | Full creative interview, palette derivation |
| Unknown category | `scenarios/unknown-category.md` | Improvisation without strategy file |

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

- **Dimension below 3:** Identify root cause in SKILL.md or strategy file. Fix and re-run that scenario.
- **Extraction below 3:** Check `shared/extract-app-context.md` — are the scan patterns correct for the framework?
- **Creative below 3:** Check `shared/copy-principles.md` and the matching strategy file — are the examples specific enough?
- **Technical below 3:** Check scene prop tables in SKILL.md — are required props clearly documented?
- **Conversational below 3:** Check the phase descriptions in SKILL.md — is the flow clear?
