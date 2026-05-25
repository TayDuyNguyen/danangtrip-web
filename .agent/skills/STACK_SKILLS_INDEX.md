# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web task: `user-profile-delete`.

## Current Decision Snapshot

Date locked: `2026-05-24`

- Repo: `D:\DATN\danangtrip-web`
- Selected task: `Implement user-profile-delete screen and backend API`
- Feature slug: `user-profile-delete`
- Route: `/profile/delete`
- Backend endpoint: `DELETE /v1/user/account`
- Primary docs:
  - `D:\DATN\DATN_Document\docs\page\user_profile_delete.md`
- Status: Locked for implementation after planning and API readiness verification.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Progress report `0.0.11` locked this choice following an API/planning review.
- `user-profile-delete` is the last critical privacy/account management screen in the user backlog.
- Cart features are optional as direct tour detail checkout is fully functional.
- The required backend API endpoint (`DELETE /user/account`) will be implemented in `danangtrip-api` as a prerequisite.

## Codegraph / Repo Findings

- Completed web screens include booking lookup/detail/list, favorites, notifications, profile/password, recommendations, ratings, locations category/nearby, tours category, and blog category.
- Backend database schema supports user cascading delete:
  - `ratings`, `favorites`, `notifications`, and `refresh_tokens` are set to cascade delete.
  - `bookings` will be anonymized (`nullOnDelete()`) to preserve business transactional records.
- Service layer statistics (average ratings/review count) must be programmatically recalculated for locations/tours when ratings are deleted.

## Goals

- Implement the `DELETE /v1/user/account` endpoint in `danangtrip-api`.
- Create `/profile/delete` route in `danangtrip-web` with warning boxes, checkbox confirmation, password inputs, and confirm modals.
- Update profile sidebar navigation.
- Ensure clean session/token cleanup, redirection to `/`, and localized user feedback.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant planning artifacts if any
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. Real repo sources and docs listed in this prompt

If sources conflict, follow repo reality and record stale facts in the artifact.

## Memory Continuity Rules

- At the start of each step, update `.agent/memory/WORKING_STATE.md`.
- After each completed step, update `.agent/memory/WORKING_STATE.md` and append `.agent/memory/SESSION_LOG.md`.
- Update `.agent/memory/HANDOFF.md` if paused, blocked, waiting for approval, or incomplete.
- Do not claim a step is complete until the artifact and memory updates are complete.

## Coding Responsibility By Skill

| Skill | Execution mode | Code expectation |
| --- | --- | --- |
| `01-screen-analysis` | Analysis only | Do not edit product code; create planning artifact and memory. |
| `02-project-setup` | Audit/setup | Setup layout, sidebar link, routing constants, and backend boilerplate. |
| `03-types-api-contract` | Contract review | Define types, API services, request schemas, and request validators. |
| `04-layout-routing` | Routing review | Establish `/profile/delete` route structure and layout wrappers. |
| `05-ui-components` | UI build | Build warning boxes, checkboxes, input forms, and confirmation dialogs. |
| `06-data-integration` | Integration wiring | Integrate with profile query hook and delete account mutation. |
| `07-interactions` | Interactions | Code validation logic, error overlays, loading spinners, and confirm steps. |
| `08-auth-permissions` | Auth & Security | Clear cookies/store, handle logout flows, and route access guards. |
| `09-testing` | Validation | Run full build, check route, typecheck, lint, and run tests. |
| `10-optimization-deploy` | Handoff | Push code branch, create review report, and draft project handoff details. |

## Repository Reality

| Area | Reality |
| --- | --- |
| Framework | Next.js App Router |
| React | 19.x |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 where used |
| State | Zustand v5 |
| Validation | Zod v4 |
| HTTP | Axios v1 |
| i18n | next-intl v4 |
| Deploy | Cloudflare Workers via OpenNext |

## Pipeline Map

| # | Skill | Primary artifact |
| --- | --- | --- |
| 01 | `01-screen-analysis` | `analysis/...__screen-analysis.md` |
| 02 | `02-project-setup` | `setup/...__project-setup-report.md` |
| 03 | `03-types-api-contract` | `api-contracts/...__api-contract.md` |
| 04 | `04-layout-routing` | `routing/...__route-plan.md` |
| 05 | `05-ui-components` | `ui-specs/...__ui-spec.md` |
| 06 | `06-data-integration` | `integration/...__data-integration.md` |
| 07 | `07-interactions` | `interaction-specs/...__interaction-spec.md` |
| 08 | `08-auth-permissions` | `auth/...__auth-permissions-review.md` |
| 09 | `09-testing` | `test-cases/...__test-report.md` |
| 10 | `10-optimization-deploy` | `deploy/...__deploy-report.md`, `review/...__review.md` |

## Recommended Current Planning Prompt

```text
SYSTEM EXECUTION CONTRACT

Act as the implementation agent for repository: `D:\DATN\danangtrip-web` and `D:\DATN\danangtrip-api`

CURRENT TASK LOCK
- Feature slug: `user-profile-delete`
- Task name: `Implement User Profile Deletion Page and Backend API`
- Route: `/profile/delete`
- Backend API: `DELETE /v1/user/account`

WHY THIS IS NEXT
- API readiness review completed and approved.
- Accounts deletion is locked as the next target screen.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant planning artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`

SCREEN AND API REFERENCES
- Candidate doc: `D:\DATN\DATN_Document\docs\page\user_profile_delete.md`
- Backend controller: `D:\DATN\danangtrip-api\app\Http\Controllers\Api\ProfileController.php`
- Web routes: `src/config/routes.ts`
- Web sidebar: `src/features/profile/components/ProfileSidebar.tsx`
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-profile-delete`.
Read mandatory context, codegraph, `user_profile_delete.md`, backend controller, and current web profile layout files.
Work: document purpose, route, layout, styling tokens, responsive states, API specifications, and business validation rules.
Output: `.agent/artifacts/analysis/2026-05-24__user-profile-delete__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-profile-delete`.
Inspect route conventions, layout boundaries, package dependencies, and create backend stubs/files.
Work: setup routes, register sidebar links, and draft empty backend controller action + request validator.
Output: `.agent/artifacts/setup/2026-05-24__user-profile-delete__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-profile-delete`.
Inspect backend files, validation models, and typescript types.
Work: implement backend request validation rules and define frontend types and request payloads.
Output: `.agent/artifacts/api-contracts/2026-05-24__user-profile-delete__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-profile-delete`.
Work: build the App Router folder structure and layout wrappers under `/profile/delete`.
Output: `.agent/artifacts/routing/2026-05-24__user-profile-delete__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-profile-delete`.
Work: construct the warning cards, confirmation checkboxes, password forms, and multi-step modal dialogs.
Output: `.agent/artifacts/ui-specs/2026-05-24__user-profile-delete__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-profile-delete`.
Work: write the useDeleteAccount mutation query hook and bind request flows.
Output: `.agent/artifacts/integration/2026-05-24__user-profile-delete__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-profile-delete`.
Work: wire up input validations, show/hide password buttons, warning alerts on active bookings, and toast messages.
Output: `.agent/artifacts/interaction-specs/2026-05-24__user-profile-delete__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-profile-delete`.
Work: handle session clearing (cookies and state), redirect to `/`, and secure the deletion route behind auth middleware.
Output: `.agent/artifacts/auth/2026-05-24__user-profile-delete__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-profile-delete`.
Work: test functional flows, verify error states, check route permissions, run tests, and execute prepush checks.
Output: `.agent/artifacts/test-cases/2026-05-24__user-profile-delete__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-profile-delete`.
Work: prepare commit package, test production builds, generate review.md and deploy-report.md files.
Output: `.agent/artifacts/deploy/2026-05-24__user-profile-delete__deploy-report.md` and `.agent/artifacts/review/2026-05-24__user-profile-delete__review.md`
```
