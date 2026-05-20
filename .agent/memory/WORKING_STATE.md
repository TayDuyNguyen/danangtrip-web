# Working State

## Current Status
- Date: 2026-05-20
- Active feature/task: tour-departure-select
- Status: In Progress
- Current step: 09-testing (Executing)
- Next step: 10-optimization-deploy
- Owner: AI collaborator

## Current Objective
- Perform Phase 1-5 testing for the tour-departure-select feature on danangtrip-web. This is a verification step that produces a test report artifact at .agent/artifacts/test-cases/2026-05-20__tour-departure-select__test-report.md.

## Files Recently Updated
- `.agent/artifacts/test-cases/2026-05-19__tour-departure-select__test-report.md` (New - Test Report)

## Current Decisions In Force
- `REPO_FACTS.md` is the compact repo reality anchor.
- Drift checks must run before native validation checks.
- For forms in this repo, do not assume one global form library; follow the touched feature's current pattern unless the task is an explicit migration.
- **Design Policy:** Strict adherence to Dark Mode/Bronze tokens even if prototypes are light-themed.
- **Data Policy:** Prefer Server Prefetch for static details, Client Query for interactive state.
- **Interaction Policy:** Use `react-hook-form` + `zod` for complex forms like tour-booking.
- **Memory Policy:** Every skill step must reread `WORKING_STATE.md`, `HANDOFF.md`, `SESSION_LOG.md`, latest relevant artifacts, and the active `SKILL.md`.
- **Step Completion Policy:** Every completed skill step must update `WORKING_STATE.md`, append `SESSION_LOG.md`, and update `HANDOFF.md` when paused, blocked, waiting for approval, or incomplete.
- **Code Policy:** Code starts no later than `05-ui-components`; `03-types-api-contract` and `04-layout-routing` also edit code when missing contracts/routes block the feature.

## Known Open Items
- Final E2E flow is fully verified and functional locally; no remaining blockers.

## Immediate Next Steps
- Delineate Git commands for USER approval.
- Execute branch creation, add, commit, and push once the USER types `push` or `confirm push`.
