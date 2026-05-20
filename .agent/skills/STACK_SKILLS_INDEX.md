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

## Recommended Current Screen Prompt

Use this ready prompt for the next recommended `danangtrip-web` screen: departure selection in the core tour booking funnel.
System sequencing note: implement `danangtrip-admin` schedule edit first when cross-project coordination is needed, because the web departure screen depends on schedule field completeness and stable booking availability data.

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `D:\DATN\danangtrip-web`

Your job is to implement the recommended user screen: `Chọn lịch khởi hành`
Feature slug: `tour-departure-select`
Primary target route: `/tours/{slug}/departures`
Primary App Router file target: `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx`
Related existing route: `src/app/[locale]/(main)/(public)/tours/[slug]/page.tsx`
Route group: public route with booking CTA; preserve repo reality if step `04-layout-routing` decides the final UX should be a modal inside detail instead of a dedicated page.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
7. Current step `SKILL.md`
8. Screen and API references listed below

SCREEN REFERENCES
- Primary screen doc: `D:\DATN\DATN_Tài liệu\docs\page\user_tour_departure_select.md`
- Related tour detail doc: `D:\DATN\DATN_Tài liệu\docs\page\user_tour_detail.md`
- Related booking doc: `D:\DATN\DATN_Tài liệu\docs\page\user_tour_booking.md`
- User page list: `D:\DATN\DATN_Tài liệu\docs\reference\list_page_user.md`
- Flow priority note: `D:\DATN\DATN_Tài liệu\docs\reference\travel_com_benchmark_flow.md`
- Gap analysis: `D:\DATN\DATN_Tài liệu\docs\reference\screen_gap_analysis.md`
- API list: `D:\DATN\DATN_Tài liệu\docs\api\api_list.md`
- Backend API repo: `D:\DATN\danangtrip-api`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`
- Backend tour docs: `D:\DATN\danangtrip-api\api-doc\tours.js`
- Backend booking docs: `D:\DATN\danangtrip-api\api-doc\bookings.js`
- Backend schema note: `D:\DATN\danangtrip-api\SCHEMA_CURRENT_ANNOTATED.md`

SKILL PATHS
- `01-screen-analysis`: `D:\DATN\danangtrip-web\.agent\skills\01-screen-analysis\SKILL.md`
- `02-project-setup`: `D:\DATN\danangtrip-web\.agent\skills\02-project-setup\SKILL.md`
- `03-types-api-contract`: `D:\DATN\danangtrip-web\.agent\skills\03-types-api-contract\SKILL.md`
- `04-layout-routing`: `D:\DATN\danangtrip-web\.agent\skills\04-layout-routing\SKILL.md`
- `05-ui-components`: `D:\DATN\danangtrip-web\.agent\skills\05-ui-components\SKILL.md`
- `06-data-integration`: `D:\DATN\danangtrip-web\.agent\skills\06-data-integration\SKILL.md`
- `07-interactions`: `D:\DATN\danangtrip-web\.agent\skills\07-interactions\SKILL.md`
- `08-auth-permissions`: `D:\DATN\danangtrip-web\.agent\skills\08-auth-permissions\SKILL.md`
- `09-testing`: `D:\DATN\danangtrip-web\.agent\skills\09-testing\SKILL.md`
- `10-optimization-deploy`: `D:\DATN\danangtrip-web\.agent\skills\10-optimization-deploy\SKILL.md`

PROTOTYPE REFERENCES
- Prototype mapping: `D:\DATN\DATN_Tài liệu\screen\4_Others\01-Screen_To_Docs_Mapping.md`
- Prototype classification: `D:\DATN\DATN_Tài liệu\screen\4_Others\00-Bang_Phan_Loai_Man_Hinh.md`
- Related booking image: `D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.png`
- Related booking HTML/code: `D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.html`
- There is no dedicated departure-select prototype asset in the current screen folder; derive layout from the screen doc plus existing repo UI and booking/tour detail references.

PROTOTYPE USAGE RULES
- Treat the `.png` files as the visual reference and the `.html` files as implementation reference only.
- Adapt prototype markup to this repo's Next.js, Tailwind v4, component, i18n, and API patterns.
- Use `user_tour_departure_select.md` as the primary structure source.
- Reuse real repo patterns from the current tour detail and booking components before inventing a new visual language.
- Do not copy external image URLs blindly from prototype HTML if local/public assets or API images are available.

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\lib\axios.ts`
- `D:\DATN\danangtrip-web\src\services\tour.service.ts`
- `D:\DATN\danangtrip-web\src\services\booking.service.ts`
- `D:\DATN\danangtrip-web\src\types\booking.types.ts`
- `D:\DATN\danangtrip-web\src\features\tour\types.ts`
- `D:\DATN\danangtrip-web\src\features\tour\hooks\useTourDetail.ts`
- `D:\DATN\danangtrip-web\src\features\tour\hooks\useBookingQueries.ts`
- `D:\DATN\danangtrip-web\src\features\tour\components\TourDetailClient.tsx`
- `D:\DATN\danangtrip-web\src\features\tour\components\BookingSidebar.tsx`
- `D:\DATN\danangtrip-web\src\features\tour\components\ScheduleCalendar.tsx`
- `D:\DATN\danangtrip-web\src\features\tour\components\BookingForm.tsx`
- `D:\DATN\danangtrip-web\src\messages\vi\tour.json`
- `D:\DATN\danangtrip-web\src\messages\en\tour.json`

REQUIRED API FLOW
- Load tour detail context from the slug so the departure screen stays consistent with the main tour page.
- Load schedules: `GET /tours/{id}/schedules`.
- Check live availability for the selected schedule and passenger counts: `POST /tours/{id}/check-availability`.
- Calculate booking summary for the selected schedule and passenger counts: `POST /bookings/calculate`.
- Hand off to booking page using the selected `schedule_id` and passenger counts via query params or the repo's current preferred state handoff.
- Cross-check the actual request key names because the current repo already uses `tour_schedule_id` in booking flows while some docs still describe `schedule_id`.
- Dependency note: verify the admin schedule edit flow preserves the fields consumed by the public schedule list and booking calculation before finalizing the handoff contract.

EXPECTED UX
- The screen must show tour summary, schedule list or calendar, availability state, adult/child/infant quantity controls, live price summary, and a clear CTA to continue to `/tours/{slug}/book`.
- Support loading, empty schedules, sold-out schedule, invalid query state, API error, and recalculating summary states.
- Preserve public access. Do not require login at departure selection time unless repo reality proves otherwise.
- Reuse existing `ScheduleCalendar`, `QuantityCounter`, `OrderSummaryCard`, toast, loading, and tour-detail visual patterns where possible.
- Add i18n keys in both Vietnamese and English if new copy is introduced.

PIPELINE ORDER
Execute in this exact order, stopping after each step for approval:
1. `01-screen-analysis`
2. `03-types-api-contract`
3. `04-layout-routing`
4. `05-ui-components`
5. `06-data-integration`
6. `07-interactions`
7. `08-auth-permissions`
8. `09-testing`
9. `10-optimization-deploy`

ARTIFACT TARGETS
- Analysis: `.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md`
- API contract: `.agent/artifacts/api-contracts/YYYY-MM-DD__tour-departure-select__api-contract.md`
- Routing: `.agent/artifacts/routing/YYYY-MM-DD__tour-departure-select__route-plan.md`
- UI spec: `.agent/artifacts/ui-specs/YYYY-MM-DD__tour-departure-select__ui-spec.md`
- Data integration: `.agent/artifacts/integration/YYYY-MM-DD__tour-departure-select__data-integration.md`
- Interaction spec: `.agent/artifacts/interaction-specs/YYYY-MM-DD__tour-departure-select__interaction-spec.md`
- Auth review: `.agent/artifacts/auth/YYYY-MM-DD__tour-departure-select__auth-permissions-review.md`
- Test report: `.agent/artifacts/test-cases/YYYY-MM-DD__tour-departure-select__test-report.md`
- Deploy report: `.agent/artifacts/deploy/YYYY-MM-DD__tour-departure-select__deploy-report.md`
- Final review: `.agent/artifacts/review/YYYY-MM-DD__tour-departure-select__review.md`

BEGIN NOW
Start with step `01-screen-analysis`.
Do not implement code for later steps until the current step is approved.
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

### Current Recommended Screen - Tour Departure Select

Use this prompt when manually activating the local skill pipeline for the recommended web screen.

```text
Activate full pipeline for current recommended screen

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [tour-departure-select]
- Screen name: [Chọn lịch khởi hành]
- Primary target route: [/tours/{slug}/departures]
- Primary target page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\tours\[slug]\departures\page.tsx]
- Related existing tour detail file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\tours\[slug]\page.tsx]
- Route group: [(public)]
- Auth requirement: [Public browsing; booking handoff may later enter protected flow if repo reality requires]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Primary docs: [D:\DATN\DATN_Tài liệu\docs\page\user_tour_departure_select.md]
- Related docs: [D:\DATN\DATN_Tài liệu\docs\page\user_tour_detail.md; D:\DATN\DATN_Tài liệu\docs\page\user_tour_booking.md; D:\DATN\DATN_Tài liệu\docs\reference\list_page_user.md; D:\DATN\DATN_Tài liệu\docs\reference\travel_com_benchmark_flow.md; D:\DATN\DATN_Tài liệu\docs\reference\screen_gap_analysis.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Backend API repo: [D:\DATN\danangtrip-api]
- Backend routes: [D:\DATN\danangtrip-api\routes\api.php]
- Backend tour docs: [D:\DATN\danangtrip-api\api-doc\tours.js]
- Backend booking docs: [D:\DATN\danangtrip-api\api-doc\bookings.js]
- Backend schema note: [D:\DATN\danangtrip-api\SCHEMA_CURRENT_ANNOTATED.md]
- Prototype mapping: [D:\DATN\DATN_Tài liệu\screen\4_Others\01-Screen_To_Docs_Mapping.md]
- Prototype classification: [D:\DATN\DATN_Tài liệu\screen\4_Others\00-Bang_Phan_Loai_Man_Hinh.md]
- Related booking prototype image: [D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.png]
- Related booking prototype HTML/code: [D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.html]
- Existing UI references: [D:\DATN\danangtrip-web\src\features\tour\components\BookingSidebar.tsx; D:\DATN\danangtrip-web\src\features\tour\components\ScheduleCalendar.tsx; D:\DATN\danangtrip-web\src\features\tour\components\OrderSummaryCard.tsx; D:\DATN\danangtrip-web\src\features\tour\components\QuantityCounter.tsx; D:\DATN\danangtrip-web\src\features\tour\components\TourDetailClient.tsx]
- Services/types to inspect: [D:\DATN\danangtrip-web\src\services\tour.service.ts; D:\DATN\danangtrip-web\src\services\booking.service.ts; D:\DATN\danangtrip-web\src\features\tour\hooks\useTourDetail.ts; D:\DATN\danangtrip-web\src\features\tour\hooks\useBookingQueries.ts; D:\DATN\danangtrip-web\src\types\booking.types.ts; D:\DATN\danangtrip-web\src\features\tour\types.ts]
- Main endpoints: [GET /tours/{id}/schedules; POST /tours/{id}/check-availability; POST /bookings/calculate]
- Handoff target: [/tours/{slug}/book with schedule_id or repo-reality equivalent query params]
- Contract note: [docs often say schedule_id, but current booking form schema uses tour_schedule_id; confirm real request shape before wiring client state and redirects]
- System priority note: [if both repos are being advanced together, stabilize `danangtrip-admin` schedule edit first because this screen consumes the schedule data that admin curates]
- Route strategy note: [docs allow either modal in tour detail or dedicated /departures route; preserve repo reality and record the final choice in routing artifact]
- i18n files: [D:\DATN\danangtrip-web\src\messages\vi\tour.json; D:\DATN\danangtrip-web\src\messages\en\tour.json]
- Skill paths: [D:\DATN\danangtrip-web\.agent\skills\01-screen-analysis\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\03-types-api-contract\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\04-layout-routing\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\05-ui-components\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\06-data-integration\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\07-interactions\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\08-auth-permissions\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\09-testing\SKILL.md; D:\DATN\danangtrip-web\.agent\skills\10-optimization-deploy\SKILL.md]
- Output prefix: [.agent/artifacts/<group>/YYYY-MM-DD__tour-departure-select__...md]

Execution:
- Start with `01-screen-analysis`.
- Before each step, read the matching `SKILL.md` from `Skill paths`.
- Treat the screen doc as the main UX spec because no dedicated departure prototype exists today.
- Reuse repo components and booking/tour patterns before building new primitives.
- Resolve `schedule_id` versus `tour_schedule_id` during API-contract step before implementing interactions.
- Ensure the screen can hand off a selected schedule and quantities cleanly into booking without duplicating booking logic.
- Stop after each pipeline step for approval.
```

### Skill 01 - Screen Analysis

```text
Activate 01-screen-analysis

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [tour-departure-select]
- Screen name: [Chọn lịch khởi hành]
- Figma/Stitch: [NONE]
- Input source: [D:\DATN\DATN_Tài liệu\docs\page\user_tour_departure_select.md]
- Related sources: [D:\DATN\DATN_Tài liệu\docs\page\user_tour_detail.md; D:\DATN\DATN_Tài liệu\docs\page\user_tour_booking.md; D:\DATN\DATN_Tài liệu\docs\reference\travel_com_benchmark_flow.md]
- Prototype image: [D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.png]
- Prototype HTML/code: [D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.html]
- Prototype note: [No dedicated departure-select prototype; derive from doc and repo reality]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\01-screen-analysis\SKILL.md]
- Output: [.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md]
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
- Feature slug: [tour-departure-select]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Relevant endpoints: [GET /tours/{id}/schedules, POST /tours/{id}/check-availability, POST /bookings/calculate]
- Existing services: [D:\DATN\danangtrip-web\src\services\tour.service.ts; D:\DATN\danangtrip-web\src\services\booking.service.ts]
- Existing hooks: [D:\DATN\danangtrip-web\src\features\tour\hooks\useTourDetail.ts; D:\DATN\danangtrip-web\src\features\tour\hooks\useBookingQueries.ts]
- Existing types: [D:\DATN\danangtrip-web\src\features\tour\types.ts; D:\DATN\danangtrip-web\src\types\booking.types.ts]
- Contract check: [Resolve schedule_id vs tour_schedule_id naming before finalizing form state and redirect params]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\03-types-api-contract\SKILL.md]
- Output: [.agent/artifacts/api-contracts/YYYY-MM-DD__tour-departure-select__api-contract.md]
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
- Feature slug: [tour-departure-select]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md]
- Target route path: [/tours/{slug}/departures]
- Route group: [(public)]
- New page files: [yes unless routing step keeps modal-in-detail strategy]
- Target page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\tours\[slug]\departures\page.tsx]
- Related page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\tours\[slug]\page.tsx]
- Server or client ownership: [server page shell + client departure selector]
- New i18n namespace: [tour]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\04-layout-routing\SKILL.md]
- Output: [.agent/artifacts/routing/YYYY-MM-DD__tour-departure-select__route-plan.md]
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
- Feature slug: [tour-departure-select]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Prototype image: [D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.png]
- Prototype HTML/code: [D:\DATN\DATN_Tài liệu\screen\2_User_Flows\05.1-Dat_Tour.html]
- Prototype note: [No exact prototype; use repo tour detail and booking UI as primary reference]
- Components to focus on: [DepartureSelectPageShell, DepartureSchedulePanel, DepartureAvailabilityCard, PassengerQuantityPanel, DepartureSummaryCard]
- Existing reusable components: [ScheduleCalendar, QuantityCounter, OrderSummaryCard, BookingProgressSteps]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\05-ui-components\SKILL.md]
- Output: [.agent/artifacts/ui-specs/YYYY-MM-DD__tour-departure-select__ui-spec.md]
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
- Feature slug: [tour-departure-select]
- API contract: [.agent/artifacts/api-contracts/YYYY-MM-DD__tour-departure-select__api-contract.md]
- UI spec: [.agent/artifacts/ui-specs/YYYY-MM-DD__tour-departure-select__ui-spec.md]
- Need server prefetch: [optional tour detail prefetch if the selected route pattern benefits from it]
- Queries: [tour detail, tour schedules]
- Mutations: [check availability, calculate booking]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\06-data-integration\SKILL.md]
- Output: [.agent/artifacts/integration/YYYY-MM-DD__tour-departure-select__data-integration.md]
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
- Feature slug: [tour-departure-select]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md]
- Data integration: [.agent/artifacts/integration/YYYY-MM-DD__tour-departure-select__data-integration.md]
- Main actions: [choose schedule, adjust adult-child-infant counts, trigger availability check, trigger booking calculation, continue to booking page, go back to tour detail]
- Forms present: [lightweight selection form driven by schedule and passenger quantities]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\07-interactions\SKILL.md]
- Output: [.agent/artifacts/interaction-specs/YYYY-MM-DD__tour-departure-select__interaction-spec.md]
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
- Feature slug: [tour-departure-select]
- Route plan: [.agent/artifacts/routing/YYYY-MM-DD__tour-departure-select__route-plan.md]
- Feature type: [public route with booking handoff]
- Gated UI actions: [none on the departure screen unless repo reality requires auth before booking handoff]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\08-auth-permissions\SKILL.md]
- Output: [.agent/artifacts/auth/YYYY-MM-DD__tour-departure-select__auth-permissions-review.md]
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
- Feature slug: [tour-departure-select]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__tour-departure-select__screen-analysis.md]
- Interaction spec: [.agent/artifacts/interaction-specs/YYYY-MM-DD__tour-departure-select__interaction-spec.md]
- Auth review: [.agent/artifacts/auth/YYYY-MM-DD__tour-departure-select__auth-permissions-review.md]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\09-testing\SKILL.md]
- Output: [.agent/artifacts/test-cases/YYYY-MM-DD__tour-departure-select__test-report.md]
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
- Feature slug: [tour-departure-select]
- Test report: [.agent/artifacts/test-cases/YYYY-MM-DD__tour-departure-select__test-report.md]
- Test verdict: [READY | READY WITH RISKS | NOT READY]
- Existing artifacts: [analysis, api-contract, route-plan, ui-spec, data-integration, interaction-spec, auth-review, test-report]
- Skill path: [D:\DATN\danangtrip-web\.agent\skills\10-optimization-deploy\SKILL.md]
- Output deploy: [.agent/artifacts/deploy/YYYY-MM-DD__tour-departure-select__deploy-report.md]
- Output review: [.agent/artifacts/review/YYYY-MM-DD__tour-departure-select__review.md]
```

Expected output:

- deploy-readiness verdict
- build and runtime constraints
- performance and UX checks relevant to the task
- final review summary
- residual risks and next actions

