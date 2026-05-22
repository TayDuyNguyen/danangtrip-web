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
- Only screen/work item to implement now: `Thông báo`
- Feature slug: `notifications`
- Main route: `/notifications`
- Main file target: `src/app/[locale]/(main)/(protected)/notifications/page.tsx`
- Rule: do not switch to profile password, verify email, cart, or unrelated booking/account screens until this notifications screen is finished through `10-optimization-deploy`.

### Candidate Screens Reviewed

| Candidate | Priority | Why it is relevant now | Why it is not the current first pick |
| --- | --- | --- | --- |
| `notifications` | High | `favorites` is now complete and notifications has ready API support plus clear protected-user utility value. | Selected as the current first pick. |
| `user-profile-password` | High | Account security API exists and naturally follows notifications in the user-utility rollout. | Useful, but notifications is the nearer follow-up after favorites completion. |
| `user-verify-email` | High | Auth API exists. | Important, but still less central than the notifications center for active signed-in users. |
| `user-profile` hardening | Medium | Existing route/page already exists and may still need pipeline hardening later. | Not a new current-screen prompt; notifications is the next unfinished screen. |

### Selected Next Screen

- Screen: `Thông báo`
- Feature slug: `notifications`
- Main route: `/notifications`
- Primary implementation target: `src/app/[locale]/(main)/(protected)/notifications/page.tsx`
- Decision basis:
  - `project_delivery_progress_report.md` now marks `favorites` as complete and `notifications` as the next real web screen.
  - Notifications has ready API support and remains missing as a real protected route/page in the current repo.
  - This keeps delivery moving into the next unfinished protected user utility after the saved-items flow is closed.

### Cross-Project Rollout Order

1. `danangtrip-web` implements `notifications`
2. `danangtrip-admin` implements `admin_reports_revenue`
3. Continue with account/security utilities or the remaining admin report group based on the next progress report update

Dependency rule:
- Keep notification state semantics aligned with the real notifications API contract and any existing global notification store behavior.
- Preserve protected route behavior and locale-aware navigation for the new `/notifications` page.

## Recommended Current Screen Prompt

Use this ready prompt for the next recommended `danangtrip-web` work: notifications delivery.

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `D:\DATN\danangtrip-web`

Your job is to implement the recommended user screen: `Thông báo`
Feature slug: `notifications`
Primary route: `/notifications`
Primary targets:
- `src/app/[locale]/(main)/(protected)/notifications/page.tsx`
- `src/features` area that owns notifications list cards and state wiring
- related services/hooks/types for notifications API integration
Feature type: protected user notifications center.

SINGLE-SCOPE LOCK
- You are working on exactly one feature only: `Thông báo`.
- You MUST NOT switch to profile password, verify email, cart, or unrelated booking/account screens in this run.
- If an adjacent issue appears in shared header, badge, or notification store behavior, record it as dependency/follow-up unless it blocks notifications correctness.

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
- Progress report: `D:\DATN\DATN_Tài liệu\docs\project_delivery_progress_report.md`
- Primary doc: `D:\DATN\DATN_Tài liệu\docs\page\user_notifications.md`
- Related detail docs: `D:\DATN\DATN_Tài liệu\docs\page\user_profile.md; D:\DATN\DATN_Tài liệu\docs\page\user_booking_detail.md`
- Related supporting docs: `D:\DATN\DATN_Tài liệu\docs\reference\list_page_user.md`
- User page list: `D:\DATN\DATN_Tài liệu\docs\reference\list_page_user.md`
- API list: `D:\DATN\DATN_Tài liệu\docs\api\api_list.md`
- Backend API repo: `D:\DATN\danangtrip-api`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\services`
- `D:\DATN\danangtrip-web\src\features`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\profile\page.tsx`
- `D:\DATN\danangtrip-web\src\types`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

REQUIRED API FLOW
- Load the current user's notifications through the real notifications endpoint(s) in repo/API reality.
- Support empty, loading, unread, read, filtered empty, and API-error states.
- Reuse any existing notification badge/store state if already present in the repo.
- Keep auth protection under existing `(protected)` route behavior and axios auth headers.
- If mark-as-read or mark-all-as-read is part of the scope, make sure unread counts stay consistent without full page inconsistency.

EXPECTED UX
- User can view a clean notifications list with time, title, content, and state cues.
- User can mark one or many notifications as read if the real contract supports it.
- User can navigate from a notification into its linked destination if the payload carries a target.
- Loading, empty, unread/read, and API-error states are explicit and localized.
- Behavior remains consistent across locales and protected auth flow.

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
- Analysis: `.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md`
- API contract: `.agent/artifacts/api-contracts/YYYY-MM-DD__notifications__api-contract.md`
- Routing: `.agent/artifacts/routing/YYYY-MM-DD__notifications__route-plan.md`
- UI spec: `.agent/artifacts/ui-specs/YYYY-MM-DD__notifications__ui-spec.md`
- Data integration: `.agent/artifacts/integration/YYYY-MM-DD__notifications__data-integration.md`
- Interaction spec: `.agent/artifacts/interaction-specs/YYYY-MM-DD__notifications__interaction-spec.md`
- Auth review: `.agent/artifacts/auth/YYYY-MM-DD__notifications__auth-permissions-review.md`
- Test report: `.agent/artifacts/test-cases/YYYY-MM-DD__notifications__test-report.md`
- Deploy report: `.agent/artifacts/deploy/YYYY-MM-DD__notifications__deploy-report.md`
- Final review: `.agent/artifacts/review/YYYY-MM-DD__notifications__review.md`

BEGIN NOW
Start with step `01-screen-analysis`.
```

## Manual Activation Templates - Current Recommended Screen

### Current Recommended Screen - Notifications

```text
Activate full pipeline for current recommended screen

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Screen name: [Thông báo]
- Primary target route: [/notifications]
- Primary target page file: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\notifications\page.tsx]
- Route group: [(protected)]
- Auth requirement: [Protected user route]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Primary docs: [D:\DATN\DATN_Tài liệu\docs\page\user_notifications.md]
- Related docs: [D:\DATN\DATN_Tài liệu\docs\page\user_profile.md; D:\DATN\DATN_Tài liệu\docs\page\user_booking_detail.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Backend API repo: [D:\DATN\danangtrip-api]
- Existing UI references: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\profile\page.tsx; D:\DATN\danangtrip-web\src\features]
- Services/types to inspect: [D:\DATN\danangtrip-web\src\services; D:\DATN\danangtrip-web\src\types; D:\DATN\danangtrip-web\src\config\routes.ts]
- Main endpoints: [notifications list endpoint(s) in repo/API reality; optional mark-read endpoint(s)]
- Contract note: [resolve unread state, target link shape, and bulk mark-read capability before wiring UI]
- Output prefix: [.agent/artifacts/<group>/YYYY-MM-DD__notifications__...md]

Execution:
- Start with `01-screen-analysis`.
- Before each step, read the matching `SKILL.md`.
- Treat the notifications doc as the main list-screen UX reference.
- Reuse existing protected-page list and badge patterns before creating new primitives.
- Stop after each pipeline step for approval.
```

### Skill 01 - Screen Analysis

```text
Activate 01-screen-analysis

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Screen name: [Thông báo]
- Figma/Stitch: [NONE]
- Input source: [D:\DATN\DATN_Tài liệu\docs\page\user_notifications.md]
- Related sources: [D:\DATN\DATN_Tài liệu\docs\page\user_profile.md; D:\DATN\DATN_Tài liệu\docs\page\user_booking_detail.md]
- Prototype note: [Use notifications doc and existing protected utility/list references]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Output: [.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md]
```

### Skill 02 - Project Setup Audit

```text
Activate 02-project-setup

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Audit reason: [next protected user utility screen after favorites completion]
- Output: [.agent/artifacts/setup/YYYY-MM-DD__notifications__project-setup-report.md]
```

### Skill 03 - Types And API Contract

```text
Activate 03-types-api-contract

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md]
- API docs: [D:\DATN\DATN_Tài liệu\docs\api\api_list.md]
- Relevant endpoints: [notifications list endpoint(s), unread-count endpoint if any, optional mark-read endpoint(s)]
- Existing services: [D:\DATN\danangtrip-web\src\services]
- Existing hooks: [D:\DATN\danangtrip-web\src\features]
- Existing types: [D:\DATN\danangtrip-web\src\types]
- Contract check: [notification item shape, unread state, target link payload, pagination/filter params if any]
- Output: [.agent/artifacts/api-contracts/YYYY-MM-DD__notifications__api-contract.md]
```

### Skill 04 - Layout And Routing

```text
Activate 04-layout-routing

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md]
- Target route: [/notifications]
- Route group: [(protected)]
- New page files: [yes]
- Target files: [D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\notifications\page.tsx]
- Server or client ownership: [server page shell + client notifications list]
- Output: [.agent/artifacts/routing/YYYY-MM-DD__notifications__route-plan.md]
```

### Skill 05 - UI Components

```text
Activate 05-ui-components

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md]
- DESIGN.md: [D:\DATN\danangtrip-web\DESIGN.md]
- Components to focus on: [NotificationsPageShell, NotificationList, NotificationItem, NotificationsEmptyState, NotificationsFilterBar]
- Existing reusable components: [shared protected page shells, Button, empty-state patterns, badge/indicator patterns]
- Output: [.agent/artifacts/ui-specs/YYYY-MM-DD__notifications__ui-spec.md]
```

### Skill 06 - Data Integration

```text
Activate 06-data-integration

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- API contract: [.agent/artifacts/api-contracts/YYYY-MM-DD__notifications__api-contract.md]
- UI spec: [.agent/artifacts/ui-specs/YYYY-MM-DD__notifications__ui-spec.md]
- Queries: [notifications list; unread count if applicable]
- Mutations/actions: [mark single notification as read; mark all as read if supported]
- Output: [.agent/artifacts/integration/YYYY-MM-DD__notifications__data-integration.md]
```

### Skill 07 - Interactions

```text
Activate 07-interactions

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md]
- Data integration: [.agent/artifacts/integration/YYYY-MM-DD__notifications__data-integration.md]
- Main actions: [view list, mark read, mark all as read if supported, navigate to linked destination]
- Forms present: [filters only if repo/API supports them]
- Output: [.agent/artifacts/interaction-specs/YYYY-MM-DD__notifications__interaction-spec.md]
```

### Skill 08 - Auth And Permissions

```text
Activate 08-auth-permissions

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Route plan: [.agent/artifacts/routing/YYYY-MM-DD__notifications__route-plan.md]
- Feature type: [protected notifications screen]
- Gated UI actions: [view notifications, mark read if supported]
- Output: [.agent/artifacts/auth/YYYY-MM-DD__notifications__auth-permissions-review.md]
```

### Skill 09 - Testing

```text
Activate 09-testing

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Analysis file: [.agent/artifacts/analysis/YYYY-MM-DD__notifications__screen-analysis.md]
- Interaction spec: [.agent/artifacts/interaction-specs/YYYY-MM-DD__notifications__interaction-spec.md]
- Auth review: [.agent/artifacts/auth/YYYY-MM-DD__notifications__auth-permissions-review.md]
- Output: [.agent/artifacts/test-cases/YYYY-MM-DD__notifications__test-report.md]
```

### Skill 10 - Optimization And Deploy

```text
Activate 10-optimization-deploy

Context:
- Repo: [D:\DATN\danangtrip-web]
- Feature slug: [notifications]
- Test report: [.agent/artifacts/test-cases/YYYY-MM-DD__notifications__test-report.md]
- Test verdict: [READY | READY WITH RISKS | NOT READY]
- Existing artifacts: [analysis, api-contract, route-plan, ui-spec, data-integration, interaction-spec, auth-review, test-report]
- Output deploy: [.agent/artifacts/deploy/YYYY-MM-DD__notifications__deploy-report.md]
- Output review: [.agent/artifacts/review/YYYY-MM-DD__notifications__review.md]
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
