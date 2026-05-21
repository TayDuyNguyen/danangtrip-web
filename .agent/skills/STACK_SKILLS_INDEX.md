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

Date locked for this index: `2026-05-22`

### Single Chosen Screen Only

- Repo: `danangtrip-web`
- Only screen/work item to implement now: `Hóa đơn booking PDF`
- Feature slug: `user-booking-invoice`
- Main route/action: `/bookings/{id}/invoice`
- Main file targets:
  - `src/features/tour/components/BookingDetailClient.tsx`
  - `src/services/booking.service.ts`
  - `src/features/tour/hooks/useBookingQueries.ts`
- Rule: do not switch to favorites, notifications, profile password, verify email, or unrelated booking screens until this invoice work is finished through `10-optimization-deploy`.

### Candidate Screens Reviewed

| Candidate | Priority | Why it is relevant now | Why it is not the current first pick |
| --- | --- | --- | --- |
| `user-booking-invoice` | High | `user-bookings-list`, `user-booking-detail`, and `user-booking-by-code` are complete. Docs state the invoice endpoint returns a PDF file, while repo reality still treats invoice mostly as JSON/print action inside detail. | Selected as the current first pick. |
| `user-favorites` | High | Favorites API exists and favorite labels already appear in UI. | Less critical than closing the post-booking invoice contract. |
| `user-notifications` | High | Notifications API exists and app store has notification state. | Useful, but invoice belongs to the active paid-booking flow. |
| `user-profile-password` | High | Account security API exists. | Better after booking aftercare is fully closed. |
| `user-verify-email` | High | Auth API exists. | Account utility; not as directly tied to booking fulfillment. |

### Selected Next Screen

- Screen: `Hóa đơn booking PDF`
- Feature slug: `user-booking-invoice`
- Main route/action: `/bookings/{id}/invoice`
- Primary implementation target: `BookingDetailClient` invoice action and booking service PDF handling
- Decision basis:
  - `project_delivery_progress_report.md` marks `user-booking-invoice` as the next current web work after `user-booking-by-code` merge.
  - `user_booking_invoice.md` explicitly says API `GET /user/bookings/{id}/invoice` returns `application/pdf`, not JSON.
  - Current repo has `bookingService.invoice(id)` and invoice buttons in `BookingDetailClient`, but Step 10 review showed this path still needs hardening against the real PDF contract.
  - This is a bounded, high-value fix that closes the paid booking journey before moving to favorites/notifications.

### Cross-Project Rollout Order

1. `danangtrip-web` implements `user-booking-invoice`
2. `danangtrip-admin` implements `admin_reports_ratings`
3. Continue with user utilities (`favorites`, `notifications`) or report group based on the next progress report update

Dependency rule:
- Keep invoice button behavior consistent across `/bookings/{id}` and `/bookings/code/{bookingCode}` because both reuse `BookingDetailClient`.
- Do not introduce a separate invoice page unless implementation proves a route is necessary; docs define this as an action trigger, not a full standalone screen.

## Recommended Current Screen Prompt

Use this ready prompt for the next recommended `danangtrip-web` work: booking invoice PDF delivery.

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `D:\DATN\danangtrip-web`

Your job is to implement or harden the recommended user booking action: `Hóa đơn booking PDF`
Feature slug: `user-booking-invoice`
Primary route/action: `/bookings/{id}/invoice`
Primary targets:
- `src/services/booking.service.ts`
- `src/features/tour/components/BookingDetailClient.tsx`
- `src/features/tour/hooks/useBookingQueries.ts` if a mutation/download hook is needed
Feature type: protected invoice download/preview action for paid booking details.

SINGLE-SCOPE LOCK
- You are working on exactly one feature only: `Hóa đơn booking PDF`.
- You MUST NOT switch to favorites, notifications, profile password, verify email, cart, or unrelated booking screens in this run.
- If an adjacent issue appears in booking detail or booking-by-code, record it as dependency/follow-up unless it blocks invoice correctness.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
7. Current step `SKILL.md`
8. Screen/API references listed below

SCREEN REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_booking_invoice.md`
- Related detail doc: `D:\DATN\DATN_Document\docs\page\user_booking_detail.md`
- Related code lookup doc: `D:\DATN\DATN_Document\docs\page\user_booking_by_code.md`
- User page list: `D:\DATN\DATN_Document\docs\reference\list_page_user.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend API repo: `D:\DATN\danangtrip-api`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`
- Backend booking docs: `D:\DATN\danangtrip-api\api-doc\bookings.js`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\services\booking.service.ts`
- `D:\DATN\danangtrip-web\src\features\tour\hooks\useBookingQueries.ts`
- `D:\DATN\danangtrip-web\src\features\tour\components\BookingDetailClient.tsx`
- `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\bookings\[id]\page.tsx`
- `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\bookings\code\[bookingCode]\page.tsx`
- `D:\DATN\danangtrip-web\src\types\booking.types.ts`
- `D:\DATN\danangtrip-web\src\messages\vi\tour.json`
- `D:\DATN\danangtrip-web\src\messages\en\tour.json`

REQUIRED API FLOW
- Download or preview invoice through `GET /user/bookings/{id}/invoice`.
- Treat the response as `application/pdf` / Blob, not JSON.
- Handle paid-only invoice constraints with user-facing localized toast/error state.
- Keep auth protection under existing `(protected)` route behavior and axios auth headers.
- If backend returns JSON error for invoice failures, safely parse the error message without breaking Blob download flow.

EXPECTED UX
- Invoice button appears only where booking details are available and uses the internal booking id.
- Loading state disables the invoice button and displays localized progress copy.
- Success downloads PDF with deterministic filename such as `invoice-{booking_code}.pdf` or opens preview if that is the chosen implementation.
- Error states cover unpaid booking, forbidden/unauthorized, not found, server error, and network failure.
- Behavior is consistent when opened from booking detail by id and booking detail by code.

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
- Analysis: `.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md`
- API contract: `.agent/artifacts/api-contracts/YYYY-MM-DD__user-booking-invoice__api-contract.md`
- Routing: `.agent/artifacts/routing/YYYY-MM-DD__user-booking-invoice__route-plan.md`
- UI spec: `.agent/artifacts/ui-specs/YYYY-MM-DD__user-booking-invoice__ui-spec.md`
- Data integration: `.agent/artifacts/integration/YYYY-MM-DD__user-booking-invoice__data-integration.md`
- Interaction spec: `.agent/artifacts/interaction-specs/YYYY-MM-DD__user-booking-invoice__interaction-spec.md`
- Auth review: `.agent/artifacts/auth/YYYY-MM-DD__user-booking-invoice__auth-permissions-review.md`
- Test report: `.agent/artifacts/test-cases/YYYY-MM-DD__user-booking-invoice__test-report.md`
- Deploy report: `.agent/artifacts/deploy/YYYY-MM-DD__user-booking-invoice__deploy-report.md`
- Final review: `.agent/artifacts/review/YYYY-MM-DD__user-booking-invoice__review.md`

BEGIN NOW
Start with step `01-screen-analysis`.
```

## Manual Activation Templates - Current Recommended Screen

### Current Recommended Screen - User Booking Invoice

```text
Activate full pipeline for current recommended screen

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Screen/action name: [Hóa đơn booking PDF]
- Primary route/action: [/bookings/{id}/invoice]
- Primary target files: [D:\DATN\danangtrip-web\src\services\booking.service.ts; D:\DATN\danangtrip-web\src\features\tour\components\BookingDetailClient.tsx]
- Route group: [(protected)]
- Auth requirement: [Protected user route/action]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Primary docs: [D:\DATN\DATN_Document\docs\page\user_booking_invoice.md]
- Related docs: [D:\DATN\DATN_Document\docs\page\user_booking_detail.md; D:\DATN\DATN_Document\docs\page\user_booking_by_code.md]
- API docs: [D:\DATN\DATN_Document\docs\api\api_list.md]
- Backend API repo: [D:\DATN\danangtrip-api]
- Backend booking docs: [D:\DATN\danangtrip-api\api-doc\bookings.js]
- Existing UI references: [D:\DATN\danangtrip-web\src\features\tour\components\BookingDetailClient.tsx]
- Services/types to inspect: [D:\DATN\danangtrip-web\src\services\booking.service.ts; D:\DATN\danangtrip-web\src\types\booking.types.ts; D:\DATN\danangtrip-web\src\config\api.ts]
- Main endpoint: [GET /user/bookings/{id}/invoice]
- Contract note: [invoice endpoint returns PDF/Blob; do not treat success response as Booking JSON]
- Output prefix: [.agent/artifacts/<group>/YYYY-MM-DD__user-booking-invoice__...md]

Execution:
- Start with `01-screen-analysis`.
- Before each step, read the matching `SKILL.md`.
- Treat the invoice doc as an action-flow spec; do not create a standalone page unless the route contract requires it.
- Reuse booking detail and booking-by-code UI affordances.
- Stop after each pipeline step for approval.
```

### Skill 01 - Screen Analysis

```text
Activate 01-screen-analysis

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Screen/action name: [Hóa đơn booking PDF]
- Figma/Stitch: [NONE]
- Input source: [D:\DATN\DATN_Document\docs\page\user_booking_invoice.md]
- Related sources: [D:\DATN\DATN_Document\docs\page\user_booking_detail.md; D:\DATN\DATN_Document\docs\page\user_booking_by_code.md]
- Prototype note: [Use screen doc and completed BookingDetailClient as main references]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- API docs: [D:\DATN\DATN_Document\docs\api\api_list.md]
- Output: [.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md]
```

### Skill 02 - Project Setup Audit

```text
Activate 02-project-setup

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Audit reason: [PDF invoice action hardening after booking detail and booking-by-code completion]
- Output: [.agent/artifacts/setup/YYYY-MM-DD__user-booking-invoice__project-setup-report.md]
```

### Skill 03 - Types And API Contract

```text
Activate 03-types-api-contract

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md]
- API docs: [D:\DATN\DATN_Document\docs\api\api_list.md]
- Relevant endpoints: [GET /user/bookings/{id}/invoice]
- Existing services: [D:\DATN\danangtrip-web\src\services\booking.service.ts]
- Existing hooks: [D:\DATN\danangtrip-web\src\features\tour\hooks\useBookingQueries.ts]
- Existing types: [D:\DATN\danangtrip-web\src\types\booking.types.ts]
- Contract check: [PDF Blob response, filename derivation, auth headers, JSON error body fallback]
- Output: [.agent/artifacts/api-contracts/YYYY-MM-DD__user-booking-invoice__api-contract.md]
```

### Skill 04 - Layout And Routing

```text
Activate 04-layout-routing

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md]
- Target route/action: [/bookings/{id}/invoice]
- Route group: [(protected)]
- New page files: [no by default]
- Target files: [D:\DATN\danangtrip-web\src\features\tour\components\BookingDetailClient.tsx; D:\DATN\danangtrip-web\src\services\booking.service.ts]
- Server or client ownership: [client button action using authenticated API client]
- Output: [.agent/artifacts/routing/YYYY-MM-DD__user-booking-invoice__route-plan.md]
```

### Skill 05 - UI Components

```text
Activate 05-ui-components

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Components to focus on: [Invoice button loading state, disabled state, error toast affordance, optional preview/download choice]
- Existing reusable components: [BookingDetailClient, shared Button, toast patterns]
- Output: [.agent/artifacts/ui-specs/YYYY-MM-DD__user-booking-invoice__ui-spec.md]
```

### Skill 06 - Data Integration

```text
Activate 06-data-integration

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- API contract: [.agent/artifacts/api-contracts/YYYY-MM-DD__user-booking-invoice__api-contract.md]
- UI spec: [.agent/artifacts/ui-specs/YYYY-MM-DD__user-booking-invoice__ui-spec.md]
- Queries: [none required unless invoice metadata is added]
- Mutations/actions: [download invoice PDF Blob]
- Output: [.agent/artifacts/integration/YYYY-MM-DD__user-booking-invoice__data-integration.md]
```

### Skill 07 - Interactions

```text
Activate 07-interactions

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md]
- Data integration: [.agent/artifacts/integration/YYYY-MM-DD__user-booking-invoice__data-integration.md]
- Main actions: [click invoice button, download PDF, optional open preview tab, retry after failure]
- Forms present: [none]
- Output: [.agent/artifacts/interaction-specs/YYYY-MM-DD__user-booking-invoice__interaction-spec.md]
```

### Skill 08 - Auth And Permissions

```text
Activate 08-auth-permissions

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Route plan: [.agent/artifacts/routing/YYYY-MM-DD__user-booking-invoice__route-plan.md]
- Feature type: [protected invoice download action]
- Gated UI actions: [invoice download/preview]
- Output: [.agent/artifacts/auth/YYYY-MM-DD__user-booking-invoice__auth-permissions-review.md]
```

### Skill 09 - Testing

```text
Activate 09-testing

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__user-booking-invoice__screen-analysis.md]
- Interaction spec: [.agent/artifacts/interaction-specs/YYYY-MM-DD__user-booking-invoice__interaction-spec.md]
- Auth review: [.agent/artifacts/auth/YYYY-MM-DD__user-booking-invoice__auth-permissions-review.md]
- Output: [.agent/artifacts/test-cases/YYYY-MM-DD__user-booking-invoice__test-report.md]
```

### Skill 10 - Optimization And Deploy

```text
Activate 10-optimization-deploy

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [user-booking-invoice]
- Test report: [.agent/artifacts/test-cases/YYYY-MM-DD__user-booking-invoice__test-report.md]
- Test verdict: [READY | READY WITH RISKS | NOT READY]
- Existing artifacts: [analysis, api-contract, route-plan, ui-spec, data-integration, interaction-spec, auth-review, test-report]
- Output deploy: [.agent/artifacts/deploy/YYYY-MM-DD__user-booking-invoice__deploy-report.md]
- Output review: [.agent/artifacts/review/YYYY-MM-DD__user-booking-invoice__review.md]
```

## Files Commonly Read Before Most Tasks

- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `package.json`
- `src/config/api.ts`
- `src/services/booking.service.ts`
- `src/features/tour/hooks/useBookingQueries.ts`
- `src/features/tour/components/BookingDetailClient.tsx`
- `src/types/booking.types.ts`
- `src/messages/vi/tour.json`
- `src/messages/en/tour.json`