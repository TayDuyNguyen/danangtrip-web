# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Use this file to decide which skill to activate, what context must be read first, and what artifact each step should produce.

## Goals

- Stay aligned with the real `danangtrip-web` repository.
- Keep one execution model across Claude, Gemini, OpenCode, and manual runs.
- Produce reusable project artifacts, not one-off answers.
- Prevent template drift by checking repo reality before following a skill.

## Canonical Read Order

Before every skill step, read in this order. Do this again at the start of each step, even if the same files were read in a previous step:

1. `.agent/rules/PROJECT_RULES.md`
2. `.agent/rules/REPO_FACTS.md`
3. `.agent/memory/WORKING_STATE.md`
4. `.agent/memory/HANDOFF.md`
5. Relevant recent files in `.agent/memory/decisions/` and `.agent/artifacts/`
6. Real repo sources: `package.json`, `src/`, `next.config.ts`, `vitest.config.ts`, `scripts/`
7. The specific `SKILL.md` that matches the task

If these sources conflict, follow the earlier item in the list.

## Memory Continuity Rules

- Before every skill step, reread `.agent/memory/WORKING_STATE.md`, `.agent/memory/HANDOFF.md`, `.agent/memory/SESSION_LOG.md`, and the latest relevant artifact for the active feature.
- At the start of a step, update `WORKING_STATE.md` with `Current step`, objective, expected artifact, and whether the step is planning-only or code-producing.
- After finishing every skill step, update `WORKING_STATE.md` with what changed, the produced artifact, files changed, current risks, and the next step.
- After finishing every skill step, append one concise entry to `SESSION_LOG.md`.
- If the work is paused, blocked, waiting for approval, or incomplete, update `HANDOFF.md` before stopping.
- Do not claim a step is complete until the artifact and memory updates for that step are also complete.

## Coding Responsibility By Skill

| Skill | Execution mode | Code expectation |
| --- | --- | --- |
| `01-screen-analysis` | Analysis only | Do not edit product code; create/update analysis artifact and memory. |
| `02-project-setup` | Audit/setup | Usually no feature code; config/script fixes are allowed only when required by the audit. |
| `03-types-api-contract` | Contract/code foundation | If implementing a feature, add/update types, schemas, endpoint constants, service contracts, or mappers when missing. |
| `04-layout-routing` | Routing/code scaffold | Add/update route files, page shells, metadata, navigation, and i18n route keys when the route does not exist. |
| `05-ui-components` | Code-producing | Implement or update UI components immediately; do not stop at a UI spec when the user has asked to build the screen. |
| `06-data-integration` | Code-producing | Wire queries, mutations, services, loading, empty, and error states into the UI. |
| `07-interactions` | Code-producing | Implement forms, validation, filters, pagination, mutations, redirects, toasts, and confirmation flows. |
| `08-auth-permissions` | Code-producing when guards are missing | Implement route guards or gated UI behavior if the review finds gaps. |
| `09-testing` | Validation/fix loop | Run checks, write/update focused tests when appropriate, and fix issues caused by the feature. |
| `10-optimization-deploy` | Finalization/fix loop | Do final review, optimize only relevant issues, update handoff/review artifacts, and leave memory complete. |

## How To Run Skills

### Preferred

Use the platform adapter already installed at the repo root:

- `AGENTS.md` for the shared operating contract
- `.claude/commands/` for Claude-style entry points
- `.gemini/commands/` for Gemini-style entry points
- `.opencode/skills` for OpenCode skill discovery

In this mode, the adapter should route back to `.agent/` and keep working memory and artifacts current.

### Fallback

If the platform cannot use the root adapters, manually activate the skill by:

1. Reading the canonical read order above
2. Opening the target skill folder
3. Supplying the required context fields shown in this file
4. Writing the output artifact to `.agent/artifacts/...`
5. Updating `WORKING_STATE.md` or `HANDOFF.md` if task state changed

Do not treat manual prompt injection as the primary mode anymore. It is only the fallback mode.

## Full Pipeline Approval Prompt

Use this prompt when you want the AI to execute the entire local pipeline from start to finish, but only one approved step at a time.
This is the strictest execution mode and is the recommended choice for large feature work.

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `[REPO_PATH]`

Your job is to run the local `.agent` pipeline step by step, with strict user approval gates.
You MUST NOT skip, merge, reorder, or auto-complete any step unless I explicitly approve the current step and tell you to continue.

MANDATORY READ ORDER BEFORE ANY WORK
1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. relevant recent files in `.agent/memory/decisions/` and `.agent/artifacts/`
7. `.agent/skills/STACK_SKILLS_INDEX.md`
8. the current step's `SKILL.md`

GLOBAL RULES
- You MUST follow the local `.agent` system only.
- You MUST treat `.agent` as the single source of truth.
- You MUST execute all steps in order.
- You MUST NOT skip any step.
- You MUST NOT combine multiple steps into one response.
- You MUST stop after each step and wait for my approval.
- You MUST reread `.agent/memory/WORKING_STATE.md`, `.agent/memory/HANDOFF.md`, `.agent/memory/SESSION_LOG.md`, and relevant latest artifacts before every step.
- You MUST update `.agent/memory/WORKING_STATE.md` at the start and end of every step.
- You MUST append a concise entry to `.agent/memory/SESSION_LOG.md` after every completed step.
- You MUST update `.agent/memory/HANDOFF.md` if work is paused, blocked, waiting for approval, or incomplete.
- You MUST create or update the required artifact for each step under `.agent/artifacts/`.
- You MUST write code starting at `05-ui-components` for feature implementation. Steps `03` and `04` must also write code when types, services, routes, or page shells are missing.
- If repo reality conflicts with a template, follow repo reality and record the mismatch in the artifact.
- If information is missing, state the missing input inside the current step output, but do NOT jump ahead.

APPROVAL GATE
After finishing each step, STOP and wait.
Only continue when I reply with one of:
- `duyệt`
- `ok bước này`
- `tiếp tục`
- `next`

If I give feedback, revise the SAME current step first.
Do not start the next step until I explicitly approve.

PIPELINE ORDER
Execute in this exact order:

1. `01-screen-analysis`
2. `02-project-setup`
3. `03-types-api-contract`
4. `04-layout-routing`
5. `05-ui-components`
6. `06-data-integration`
7. `07-interactions`
8. `08-auth-permissions`
9. `09-testing`
10. `10-optimization-deploy`

STEP-BY-STEP EXECUTION RULE
For each step:
1. Reread memory files and latest relevant artifacts.
2. Read the step's `SKILL.md`.
3. Update `.agent/memory/WORKING_STATE.md` to mark the active step.
4. Restate the goal of the step in repository terms.
5. List required inputs for that step.
6. Perform only that step, including code edits when the skill's execution mode requires code.
7. Produce or update the step artifact.
8. Update `.agent/memory/WORKING_STATE.md`, append `SESSION_LOG.md`, and update `HANDOFF.md` when needed.
9. Report exactly what was done.
10. Report what is still unknown or risky.
11. STOP for approval.

RESPONSE FORMAT FOR EVERY STEP

`CURRENT STEP`
- Skill: `[skill-name]`
- Goal: `[what this step is trying to achieve]`

`INPUTS USED`
- `[file / artifact / repo source / memory source]`

`WORK COMPLETED`
- `[flat bullet list of concrete work done in this step only]`

`ARTIFACT`
- Path: `[artifact path]`
- Status: `[created | updated | blocked]`

`FILES READ`
- `[paths]`

`FILES CHANGED`
- `[paths or NONE]`

`RISKS OR OPEN QUESTIONS`
- `[flat bullet list or NONE]`

`GATE`
- Reply `duyệt` to move to `[next-skill-name]`
- Reply with feedback if this step must be revised

TASK CONTEXT
- Repo: `[REPO_PATH]`
- Feature slug: `[FEATURE_SLUG]`
- Feature/screen name: `[FEATURE_NAME]`
- Figma: `[FIGMA_LINK or NONE]`
- API docs: `[API_DOC_PATH or NONE]`
- PRD/SRS: `[PRD_PATH or NONE]`
- Extra constraints: `[ANY SPECIAL RULES or NONE]`

BEGIN NOW
Start with step `01-screen-analysis`.
Do not preview future steps.
Do not implement code for later steps.
Do not skip the approval gate.
```

## Artifact Standard

Artifact naming:

```text
.agent/artifacts/<group>/YYYY-MM-DD__<feature-slug>__<artifact-name>.md
```

Artifact quality rules:

- UTF-8
- One `#` H1 only
- Include feature slug, date, and sources used
- Mark uncertainty with `[ASSUMPTION]`
- No broken encoding or placeholder junk

A good artifact answers:

- What feature or task is being worked on?
- Which sources were used?
- Which files are affected?
- Which technical or business rules apply?
- What risks, blockers, or open questions remain?

Final-phase artifacts such as `test-report`, `deploy-report`, and `review.md` must also include:

- clear verdict
- concrete evidence
- `not run`, `skipped`, or `pending` sections when needed
- next actions or residual risks

## Repository Reality

| Area | Reality |
| --- | --- |
| Framework | Next.js App Router |
| React | 19.x |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 |
| State | Zustand v5 |
| Validation | Zod v4 |
| HTTP | Axios v1 |
| i18n | next-intl v4 |
| Forms | Mixed today; follow touched-feature reality |
| Testing | Vitest v4 |
| Deploy | Cloudflare Workers via OpenNext |

Form note:

- Check `.agent/rules/REPO_FACTS.md` before assuming a form pattern.
- If a touched feature already uses local state plus `safeParse`, stay with that unless the task is an explicit migration.

## Pipeline Map

| # | Skill | Use When | Primary Artifact | Can Skip When |
| --- | --- | --- | --- | --- |
| 01 | `01-screen-analysis` | New screen, flow, Figma, or requirement analysis | `analysis/...__screen-analysis.md` | Tiny bug fix with no UI or flow change |
| 02 | `02-project-setup` | Base audit, config check, stack drift, runtime readiness | `setup/...__project-setup-report.md` | Recent audit still reflects current repo state |
| 03 | `03-types-api-contract` | New or changed types, schemas, service contracts | `api-contracts/...__api-contract.md` | Pure copy or style change with no data impact |
| 04 | `04-layout-routing` | New routes, page structure, metadata, i18n route concerns | `routing/...__route-plan.md` | Only editing a child component inside an existing page |
| 05 | `05-ui-components` | New UI build or component refactor | `ui-specs/...__ui-spec.md` | Logic-only change with no UI structure impact |
| 06 | `06-data-integration` | Wiring API and query flows into UI | `integration/...__data-integration.md` | Static UI or tiny server-only change |
| 07 | `07-interactions` | Forms, filters, search, pagination, mutations | `interaction-specs/...__interaction-spec.md` | Read-only page with no meaningful interaction |
| 08 | `08-auth-permissions` | Auth, route protection, gated UI, role-based behavior | `auth/...__auth-permissions-review.md` | Fully public feature with no permission change |
| 09 | `09-testing` | Validation before handoff | `test-cases/...__test-report.md` | Should not be skipped |
| 10 | `10-optimization-deploy` | Final readiness, handoff, push, deploy | `deploy/...__deploy-report.md`, `review/...__review.md` | Should not be skipped |

## Fast Activation By Task Type

### New Screen Or Feature

1. `01-screen-analysis`
2. `03-types-api-contract`
3. `04-layout-routing`
4. `05-ui-components`
5. `06-data-integration`
6. `07-interactions`
7. `08-auth-permissions` if needed
8. `09-testing`
9. `10-optimization-deploy`

### Project Audit

1. `02-project-setup`
2. `09-testing` if validation evidence is needed
3. `10-optimization-deploy` if a final readiness summary is needed

### Small UI Change

1. Lightweight `01-screen-analysis` if scope is unclear
2. `05-ui-components`
3. `09-testing`

## Current Decision Snapshot

Date locked for this index: `2026-05-20`

### Single Chosen Screen Only

- Repo: `danangtrip-web`
- Only screen to implement now: `Lịch sử đặt tour`
- Feature slug: `user-bookings-list`
- Main route: `/bookings`
- Main file: `src/app/[locale]/(main)/(protected)/bookings/page.tsx`
- Rule: do not switch to booking detail, favorites, notifications, cart, or any other screen until this screen is finished through `10-optimization-deploy`.

### Candidate Screens Reviewed

| Candidate | Priority | Why it is relevant now | Why it is not the current first pick |
| --- | --- | --- | --- |
| `user-bookings-list` | High | The booking and payment flow is now in place, API already supports `GET /user/bookings` and `POST /user/bookings/{id}/cancel`, and the route is still missing in the repo. | Selected as the current first pick. |
| `user-booking-detail` | High | Natural next step after bookings list and already documented. | Better after the list exists, because the list becomes the main entry point. |
| `favorites` | Medium | API exists and screen is missing. | Less critical than post-booking trust and order visibility. |
| `notifications` | Medium | API exists and screen is missing. | Useful but not as central as bookings after checkout/payment work. |
| `cart` | Low | Documented benchmark feature. | Backend is still planned; not the right next delivery target. |

### Selected Next Screen

- Screen: `Lịch sử đặt tour`
- Feature slug: `user-bookings-list`
- Main route: `/bookings`
- Main file: `src/app/[locale]/(main)/(protected)/bookings/page.tsx`
- Decision basis:
  - The payment flow now has a result route, so the next user-facing gap is order visibility after checkout.
  - The API and existing web services already support list and cancel flows, so this is implementable now without waiting for new backend modules.
  - The route does not exist yet in the protected app, making it a clean next screen with high user value and low contract risk.

### Cross-Project Rollout Order

1. `danangtrip-admin` implements `admin-bookings-detail`
2. `danangtrip-web` implements `user-bookings-list`
3. `danangtrip-web` follows with `user-booking-detail`

Dependency rule:
- Keep booking status labels and cancel-action behavior aligned with the real booking status contract used by admin and API.

## Recommended Current Screen Prompt

Use this ready prompt for the next recommended `danangtrip-web` screen: `Lịch sử đặt tour`.
System sequencing note: when both repos move together, complete `danangtrip-admin` booking detail first so booking status handling and operator actions are clearly stabilized.

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `D:\DATN\danangtrip-web`

Your job is to implement the recommended user screen: `Lịch sử đặt tour`
Feature slug: `user-bookings-list`
Primary target route: `/bookings`
Primary App Router file target: `src/app/[locale]/(main)/(protected)/bookings/page.tsx`

SINGLE-SCREEN LOCK
- You are working on exactly one screen only: `Lịch sử đặt tour`.
- You MUST NOT switch to booking detail, favorites, notifications, cart, or profile editing in this run.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
7. Current step `SKILL.md`
8. Screen and API references: `D:\DATN\DATN_Tài liệu\docs\page\user_bookings_list.md`

BEGIN NOW
Start with step `01-screen-analysis`.
Do not implement code for later steps until the current step is approved.
```

## Project Kickoff Prompt

Use this when you want the AI to start the currently recommended web work from zero context and still stay aligned with the system-level rollout order.

```text
SYSTEM ROLE

You are the execution planner and implementation agent for `D:\DATN\danangtrip-web`.

CURRENT PRIORITY

- Repo: `D:\DATN\danangtrip-web`
- Screen: `Lịch sử đặt tour`
- Feature slug: `user-bookings-list`
- Main route: `/bookings`
- Main file target: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\bookings\page.tsx`
- System dependency: this work comes after `danangtrip-admin` clarifies booking detail and status operations

SCOPE LOCK

- Only build `Lịch sử đặt tour`.
- Do not expand scope into booking detail, favorites, notifications, cart, or profile editing.
- If another screen is needed, write it down as the next recommendation instead of implementing it now.

GOAL

Build the bookings-history step so a user can:
1. load their bookings with pagination
2. filter by booking status
3. inspect booking summary cards with payment status
4. cancel eligible bookings with a reason
5. move toward booking detail from a clear entry point
6. recover cleanly from empty, loading, and API-error states

MANDATORY READ ORDER

1. `D:\DATN\DATN_Tài liệu\docs\reference\travel_com_benchmark_flow.md`
2. `D:\DATN\DATN_Tài liệu\docs\reference\screen_gap_analysis.md`
3. `D:\DATN\DATN_Tài liệu\docs\reference\list_page_user.md`
4. `D:\DATN\DATN_Tài liệu\docs\page\user_bookings_list.md`
5. `D:\DATN\DATN_Tài liệu\docs\page\user_booking_detail.md`
6. `D:\DATN\DATN_Tài liệu\docs\page\user_payment_result.md`
7. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
8. `D:\DATN\danangtrip-web\src\config\routes.ts`
9. `D:\DATN\danangtrip-web\src\services\booking.service.ts`
10. `D:\DATN\danangtrip-web\src\services\booking.service.ts`
11. `D:\DATN\danangtrip-web\src\features\payment\components\PaymentSummaryCard.tsx`
12. `D:\DATN\danangtrip-web\src\types\booking.types.ts`
13. `D:\DATN\danangtrip-web\src\middleware.ts`
14. `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\profile\page.tsx`

EXECUTION MODE

- Run the local `.agent` pipeline.
- Default step order for this feature:
  - `01-screen-analysis`
  - `03-types-api-contract`
  - `04-layout-routing`
  - `05-ui-components`
  - `06-data-integration`
  - `07-interactions`
  - `08-auth-permissions`
  - `09-testing`
  - `10-optimization-deploy`
- Stop after each step for approval.
- If docs and repo differ, follow repo reality and record the mismatch.
- If admin schedule field naming is uncertain, mark it explicitly in the API-contract artifact before implementing the redirect/handoff logic.

SUCCESS CRITERIA

- The user can see their bookings in a clear, paginated, filterable list.
- Eligible bookings can be cancelled with the real API contract.
- The screen handles loading, empty, filtered-empty, and API-error states.
- The screen becomes the canonical entry point to future booking detail pages.
- Artifacts and memory files are updated for every completed step.

BEGIN

Start with `01-screen-analysis`.
```

## Files Commonly Read Before Most Tasks

- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `package.json`
- `src/config/api.ts`
- `src/config/routes.ts`
- `src/lib/axios.ts`
- `src/store/auth.store.ts`
- `src/i18n/routing.ts`
- `src/messages/vi/`
- `src/messages/en/`

## Manual Activation Templates

The examples below are fallback templates.
Dates and slugs are examples only; replace them with the current task values.

### Current Recommended Screen - User Bookings List

Use this prompt when manually activating the local skill pipeline for the recommended web screen.

```text
Activate full pipeline for current recommended screen

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Screen name: [Lịch sử đặt tour]
- Primary target route: [/bookings]
- Primary target page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\bookings\page.tsx]
- Related future detail file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\bookings\[id]\page.tsx]
- Route group: [(protected)]
- Auth requirement: [Protected user route]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Primary docs: [D:\DATN\DATN_Tài liệu\docs\page\user_bookings_list.md]
- Related docs: [D:\DATN\DATN_Tài liệu\docs\page\user_booking_detail.md; D:\DATN\DATN_Tài liệu\docs\page\user_booking_by_code.md; D:\DATN\DATN_Tài liệu\docs\page\user_booking_invoice.md; D:\DATN\DATN_Tài liệu\docs\reference\list_page_user.md; D:\DATN\DATN_Tài liệu\docs\reference\travel_com_benchmark_flow.md; D:\DATN\DATN_Tài liệu\docs\reference\screen_gap_analysis.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Backend API repo: [D:\DATN\danangtrip-api]
- Backend routes: [D:\DATN\danangtrip-api\routes\api.php]
- Backend booking docs: [D:\DATN\danangtrip-api\api-doc\bookings.js]
- Backend payment docs: [D:\DATN\danangtrip-api\api-doc\payments.js]
- Prototype mapping: [D:\DATN\DATN_Tài liệu\screen\4_Others\01-Screen_To_Docs_Mapping.md]
- Prototype classification: [D:\DATN\DATN_Tài liệu\screen\4_Others\00-Bang_Phan_Loai_Man_Hinh.md]
- Existing UI references: [D:\DATN\danangtrip-web\src\features\payment\components\PaymentSummaryCard.tsx; D:\DATN\danangtrip-web\src\features\payment\components\PaymentActions.tsx; D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\profile\page.tsx]
- Services/types to inspect: [D:\DATN\danangtrip-web\src\services\booking.service.ts; D:\DATN\danangtrip-web\src\types\booking.types.ts; D:\DATN\danangtrip-web\src\store\auth.store.ts]
- Main endpoints: [GET /user/bookings; POST /user/bookings/{id}/cancel]
- Contract note: [docs sometimes use `status`; backend request uses `booking_status` plus pagination params; preserve repo reality and record mapping]
- System priority note: [align labels and status actions with the admin booking detail screen]
- i18n files: [D:\DATN\danangtrip-web\src\messages\vi\tour.json; D:\DATN\danangtrip-web\src\messages\en\tour.json]
- Skill paths: [D:\DATN\danangtrip-web\.agent\skills\01-screen-analysis\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\03-types-api-contract\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\04-layout-routing\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\05-ui-components\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\06-data-integration\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\07-interactions\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\08-auth-permissions\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\09-testing\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\10-optimization-deploy\SKILL.md]
- Output prefix: [.agent/artifacts/<group>/YYYY-MM-DD__user-bookings-list__...md]

Execution:
- Start with `01-screen-analysis`.
- Before each step, read the matching `SKILL.md` from `Skill paths`.
- Treat the screen doc as the main UX spec and adapt it to the current protected-app layout reality.
- Reuse existing booking and payment display patterns before building new primitives.
- Resolve `status` versus `booking_status` query naming during API-contract step before wiring tabs and filters.
- Ensure cancel flow updates the list cleanly without losing pagination or filter state.
- Stop after each pipeline step for approval.
```

### Skill 01 - Screen Analysis

```text
Activate 01-screen-analysis

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Screen name: [Lịch sử đặt tour]
- Figma/Stitch: [NONE]
- Input source: [D:\DATN\DATN_Tài liệu\docs\page\user_bookings_list.md]
- Related sources: [D:\DATN\DATN_Tài liệu\docs\page\user_booking_detail.md; D:\DATN\DATN_Tài liệu\docs\page\user_payment_result.md; D:\DATN\DATN_Tài liệu\docs\reference\travel_com_benchmark_flow.md]
- Prototype note: [Use screen doc and existing protected layout reality]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\01-screen-analysis\SKILL.md]
- Output: [.agent/artifacts/analysis/YYYY-MM-DD__user-bookings-list__screen-analysis.md]
```

Expected output:

- design token audit against `DESIGN.md`
- `[REUSE]`, `[NEW]`, `[MOD]` component breakdown
- per-section UI states
- data and API mapping
- server vs client ownership
- business rules and edge cases

### Skill 02 - Project Setup Audit

```text
Activate 02-project-setup

Context:
- Repo: [d:/DATN/danangtrip-web]
- Feature slug: [project-base | tour-list]
- Audit reason: [new sprint | stack drift suspicion | onboarding]
- Output: [.agent/artifacts/setup/YYYY-MM-DD__project-base__project-setup-report.md]
```

Expected output:

- ready or not-ready verdict
- dependency, config, runtime, middleware, and command baseline checks

### Skill 03 - Types And API Contract

```text
Activate 03-types-api-contract

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-bookings-list__screen-analysis.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Relevant endpoints: [GET /user/bookings, POST /user/bookings/{id}/cancel]
- Existing services: [D:\DATN\danangtrip-web\src\services\booking.service.ts]
- Existing hooks: [Create or adapt bookings query and cancel mutation hooks in repo reality]
- Existing types: [D:\DATN\danangtrip-web\src\types\booking.types.ts]
- Contract check: [Resolve filter key naming, pagination shape, and cancel payload shape before wiring tabs and dialog]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\03-types-api-contract\SKILL.md]
- Output: [.agent/artifacts/api-contracts/YYYY-MM-DD__user-bookings-list__api-contract.md]
```

Expected output:

- entity and params types
- Zod schema plan
- service contract plan
- files expected to change

### Skill 04 - Layout And Routing

```text
Activate 04-layout-routing

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-bookings-list__screen-analysis.md]
- Target route path: [/bookings]
- Route group: [(protected)]
- New page files: [yes]
- Target page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\bookings\page.tsx]
- Related page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\profile\page.tsx]
- Server or client ownership: [server page shell + client bookings list]
- New i18n namespace: [tour]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\04-layout-routing\SKILL.md]
- Output: [.agent/artifacts/routing/YYYY-MM-DD__user-bookings-list__route-plan.md]
```

Expected output:

- App Router file structure
- metadata plan
- server vs client boundaries
- i18n key impact
- route config impact

### Skill 05 - UI Components

```text
Activate 05-ui-components

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-bookings-list__screen-analysis.md]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Components to focus on: [BookingsListPageShell, BookingFilterTabs, BookingCardList, BookingHistoryCard, CancelBookingDialog, BookingsEmptyState]
- Existing reusable components: [PaymentSummaryCard patterns, existing protected layout patterns, shared Button/Input/Modal primitives in repo]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\05-ui-components\SKILL.md]
- Output: [.agent/artifacts/ui-specs/YYYY-MM-DD__user-bookings-list__ui-spec.md]
```

Expected output:

- design token alignment
- `[REUSE]`, `[NEW]`, `[MOD]` breakdown
- component layering
- per-component states
- placement strategy
- build order

### Skill 06 - Data Integration

```text
Activate 06-data-integration

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- API contract: [.agent/artifacts/api-contracts/YYYY-MM-DD__user-bookings-list__api-contract.md]
- UI spec: [.agent/artifacts/ui-specs/YYYY-MM-DD__user-bookings-list__ui-spec.md]
- Need server prefetch: [optional, but likely client query in protected screen]
- Queries: [user bookings list]
- Mutations: [cancel booking]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\06-data-integration\SKILL.md]
- Output: [.agent/artifacts/integration/YYYY-MM-DD__user-bookings-list__data-integration.md]
```

Expected output:

- server and client ownership per data source
- query key hierarchy
- hydration plan
- loading, empty, and error state handling

### Skill 07 - Interactions

```text
Activate 07-interactions

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-bookings-list__screen-analysis.md]
- Data integration: [.agent/artifacts/integration/YYYY-MM-DD__user-bookings-list__data-integration.md]
- Main actions: [change status tab, paginate, open cancel dialog, submit cancel reason, move to booking detail, go to tours when empty]
- Forms present: [cancel booking confirm flow]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\07-interactions\SKILL.md]
- Output: [.agent/artifacts/interaction-specs/YYYY-MM-DD__user-bookings-list__interaction-spec.md]
```

Expected output:

- action breakdown
- URL-synced state plan
- debounce strategy
- form flow if applicable
- i18n keys to add

### Skill 08 - Auth And Permissions

```text
Activate 08-auth-permissions

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Route plan: [.agent/artifacts/routing/YYYY-MM-DD__user-bookings-list__route-plan.md]
- Feature type: [protected route]
- Gated UI actions: [list load, cancel booking, move to detail]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\08-auth-permissions\SKILL.md]
- Output: [.agent/artifacts/auth/YYYY-MM-DD__user-bookings-list__auth-permissions-review.md]
```

Expected output:

- protected route review
- guarded UI actions
- middleware behavior
- redirect flow
- risks and assumptions

### Skill 09 - Testing

```text
Activate 09-testing

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-bookings-list__screen-analysis.md]
- Interaction spec: [.agent/artifacts/interaction-specs/YYYY-MM-DD__user-bookings-list__interaction-spec.md]
- Auth review: [.agent/artifacts/auth/YYYY-MM-DD__user-bookings-list__auth-permissions-review.md]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\09-testing\SKILL.md]
- Output: [.agent/artifacts/test-cases/YYYY-MM-DD__user-bookings-list__test-report.md]
```

Expected output:

- lint, typecheck, build, and route checks
- UI visual validation
- interaction validation
- i18n validation
- auth and permission validation
- explicit PASS, FAIL, SKIPPED evidence

### Skill 10 - Optimization And Deploy

```text
Activate 10-optimization-deploy

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-bookings-list]
- Test report: [.agent/artifacts/test-cases/YYYY-MM-DD__user-bookings-list__test-report.md]
- Test verdict: [READY | READY WITH RISKS | NOT READY]
- Existing artifacts: [analysis, api-contract, route-plan, ui-spec, data-integration, interaction-spec, auth-review, test-report]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\10-optimization-deploy\SKILL.md]
- Output deploy: [.agent/artifacts/deploy/YYYY-MM-DD__user-bookings-list__deploy-report.md]
- Output review: [.agent/artifacts/review/YYYY-MM-DD__user-bookings-list__review.md]
```

Expected output:

- deploy-readiness verdict
- build and runtime constraints
- performance and UX checks relevant to the task
- final review summary
- residual risks and next actions

