# Working State

## Current Status
- Date: 2026-05-12
- Active feature/task: Strengthen `.agent` memory and anti-drift workflow
- Status: In progress
- Owner: AI collaborator

## Current Objective
- Add persistent memory files so future AI sessions do not lose track of what was done before.
- Make the agent prefer current repo facts and current working state before relying on generic skill templates.

## Files Recently Updated
- `.agent/rules/REPO_FACTS.md`
- `.agent/scripts/verify_agent_drift.py`
- `.agent/scripts/checklist.py`
- `.agent/scripts/verify_all.py`
- `.agent/ARCHITECTURE.md`
- `.agent/rules/PROJECT_RULES.md`
- `.agent/skills/STACK_SKILLS_INDEX.md`
- `.agent/skills/07-interactions/SKILL.md`

## Current Decisions In Force
- `REPO_FACTS.md` is the compact repo reality anchor.
- Drift checks must run before native validation checks.
- For forms in this repo, do not assume one global form library; follow the touched feature's current pattern unless the task is an explicit migration.

## Known Open Items
- Older skill files still contain some legacy examples and mojibake text.
- The new memory protocol exists, but future sessions must keep it updated for it to stay useful.

## Immediate Next Steps
1. Keep this file updated whenever the active task changes.
2. Add a decision note when a new repository-wide convention is chosen.
3. Update `HANDOFF.md` before pausing unfinished work.
