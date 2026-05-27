# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web task: `web_route_api_next_screen_review`.

## Current Decision Snapshot

Date locked: `2026-05-27`

- Repo: `D:\DATN\danangtrip-web`
- Supporting repo: `D:\DATN\danangtrip-api`
- Document repo: `D:\DATN\DATN_Tài liệu`
- Selected task: `Review route/API reality and lock the next web screen`
- Feature slug: `web_route_api_next_screen_review`
- Candidate output: one concrete next web screen slug plus route/API scope for the following implementation cycle.
- Status: selected after `user-profile-delete` and `user-cart` gained real code and deploy/planning artifacts.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Progress report `0.0.12` does not lock a concrete next web screen. It explicitly says `TBD - route/API review needed`.
- Codegraph snapshot `2026-05-27 08:47`: web `files=355`, `nodes=3020`, `edges=5774`; API `files=459`, `nodes=4409`, `edges=6360`.
- Repo reality confirms the earlier gaps are no longer valid next-screen candidates:
  - `/profile/delete` exists and has `2026-05-25__user-profile-delete__deploy-report.md`.
  - `/cart` exists and has `2026-05-25__user-cart-api-planning__deploy-report.md`.
  - API has `DELETE /user/account` and cart endpoints: `GET /cart`, `POST /cart/items`, `PUT/DELETE /cart/items/{id}`, `DELETE /cart`, `POST /cart/merge`.
- Many web routes already exist but do not all have fresh delivery artifacts. The next cycle should choose the highest-value hardening screen using route/API evidence instead of stale backlog order.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` and `D:\DATN\danangtrip-api\.codegraph\codegraph.db` before changing this task, then verify against repo reality.

- Existing route/page coverage includes auth pages, profile pages, booking/payment pages, notifications, favorites, recommendations, cart, contact, search, locations, tours, blog, category pages and landing page.
- Recent completed or hardened web work:
  - `user-profile-delete`
  - `user-cart`
  - guest favorites localStorage + merge after login
  - location/blog rich text whitespace preservation
  - weather service correction for current condition vs rain forecast
- Known delivery artifacts include contact, tour detail/booking/payment/departure, bookings, favorites, notifications, auth recovery/verify, recommendations/ratings, category pages, profile delete and cart.
- The next selected web screen must be justified by:
  - missing or stale deploy artifact,
  - real route/page/API readiness,
  - user-facing value,
  - implementation risk,
  - and no conflict with already completed artifacts.

## Goals

- Run a disciplined route/API readiness review for web.
- Produce a short ranked candidate list for the next implementation cycle.
- Lock exactly one next web screen or hardening task by the end of Step 03.
- Update this prompt after Step 10 with that selected concrete screen.
- Do not implement broad product code during Step 01-03 except non-behavioral audit fixes.
- Use docs root `D:\DATN\DATN_Tài liệu`; do not use stale `D:\DATN\DATN_Document` paths.

## Candidate Areas To Evaluate

Use codegraph and repo reality, not assumptions.

| Candidate area | Examples | What to verify |
| --- | --- | --- |
| Cart-to-booking polish | `/cart`, checkout transition, cart merge | Whether cart checkout is complete or only cart management is complete. |
| Auth/account hardening | `/login`, `/register`, `/profile`, `/settings` | Whether route has modern validation, translations, loading/error states, and deploy artifact. |
| Public discovery hardening | `/`, `/search`, `/locations`, `/locations/{slug}`, `/tours`, `/blog` | Whether API mapping, loading/error/empty states, SEO and recent fixes are artifact-covered. |
| Payment/booking polish | `/payment`, `/payment/result`, `/tours/{slug}/book` | Whether cart integration changed checkout assumptions. |
| Route/API alignment | route constants, middleware, protected/public behavior | Whether stale route assumptions remain after cart/profile delete changes. |

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant web artifacts, especially `user-profile-delete`, `user-cart-api-planning`, and recent hardening notes
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Tài liệu\docs\project_delivery_progress_report.md`
13. Real repo sources and docs discovered by the review

If sources conflict, follow repo reality and record stale facts in the artifact.

## Memory Continuity Rules

- At the start of each step, update `.agent/memory/WORKING_STATE.md`.
- After each completed step, update `.agent/memory/WORKING_STATE.md` and append `.agent/memory/SESSION_LOG.md`.
- Update `.agent/memory/HANDOFF.md` if paused, blocked, waiting for approval, or incomplete.
- Do not claim a step is complete until the artifact and memory updates are complete.

## Coding Responsibility By Skill

| Skill | Execution mode | Code expectation |
| --- | --- | --- |
| `01-screen-analysis` | Analysis only | Do not edit product code; inventory routes/docs/artifacts/API and candidate screens. |
| `02-project-setup` | Audit/setup | Audit scripts, route constants, middleware and artifact/memory paths; config fixes only if required. |
| `03-types-api-contract` | Decision gate | Choose the next concrete screen/task and define its route/API contract. |
| `04-layout-routing` | Conditional | Only plan/scaffold if the selected screen is locked by Step 03. |
| `05-ui-components` | Conditional | Only build UI if selected screen scope is locked and implementation is approved in this cycle. |
| `06-data-integration` | Conditional | Wire services/hooks only for the selected screen. |
| `07-interactions` | Conditional | Implement interactions only for the selected screen. |
| `08-auth-permissions` | Review | Verify public/protected behavior for the selected route. |
| `09-testing` | Validation | Run applicable checks or no-code validation if still review-only. |
| `10-optimization-deploy` | Handoff | Close review, update prompt recommendation and progress report recommendation. |

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

## Recommended Current Review Prompt

```text
SYSTEM EXECUTION CONTRACT

Act as the route/API readiness reviewer for repositories:
- `D:\DATN\danangtrip-web`
- `D:\DATN\danangtrip-api`
- `D:\DATN\DATN_Tài liệu`

CURRENT TASK LOCK
- Feature slug: `web_route_api_next_screen_review`
- Task name: `Review route/API reality and lock the next web screen`
- Output: one concrete next web screen slug and implementation prompt recommendation.
- Do not start a broad UI implementation until Step 03 locks the selected screen.

WHY THIS IS NEXT
- `user-profile-delete` and `user-cart` are no longer missing; both have route/code/API evidence.
- Progress report `0.0.12` marks web next screen as `TBD - route/API review needed`.
- Codegraph now shows high route/page coverage, so the next web cycle should be selected by current gaps, not stale backlog order.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant web artifacts, especially profile delete and cart
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Tài liệu\docs\project_delivery_progress_report.md`

REVIEW REFERENCES
- Web docs: `D:\DATN\DATN_Tài liệu\docs\page\user_*.md`
- Web routes: `D:\DATN\danangtrip-web\src\app\[locale]`
- Web route config: `D:\DATN\danangtrip-web\src\config\routes.ts`
- Web feature folders: `D:\DATN\danangtrip-web\src\features`
- API routes: `D:\DATN\danangtrip-api\routes\api.php`
- Deploy artifacts: `D:\DATN\danangtrip-web\.agent\artifacts\deploy`

REVIEW CONTRACT
- Build a route/doc/artifact/API matrix.
- Exclude screens already completed by current deploy artifacts unless they need explicit hardening.
- Rank candidates by user-facing value, API readiness, route readiness and risk.
- Lock exactly one next screen by Step 03.
- If the selected screen is implementation-ready, Step 04-10 may proceed for that screen.
- If no screen is implementation-ready, produce a blocker list and API/backend task recommendation.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep product code changes blocked until the Step 03 decision gate.
- Prefer existing web service/hook/i18n/route patterns and API service/repository/request patterns.
- Run validation in Step 09 and Step 10 as applicable to the amount of code changed.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `web_route_api_next_screen_review`.
Read mandatory context, codegraph, progress report, web docs, route pages, deploy artifacts and API route inventory.
Work: build candidate matrix, identify stale report facts, completed screens, API-ready screens, and top risks.
Output: `.agent/artifacts/analysis/2026-05-27__web_route_api_next_screen_review__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `web_route_api_next_screen_review`.
Inspect route conventions, route constants, middleware protected/public behavior, artifact paths, package scripts and API service conventions.
Work: verify readiness for the top candidates and list exact setup tasks if the next screen proceeds.
Output: `.agent/artifacts/setup/2026-05-27__web_route_api_next_screen_review__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `web_route_api_next_screen_review`.
Choose the next concrete web screen/task.
Work: define selected slug, route, docs, API contract, request/response needs, data ownership, missing types/services and implementation scope.
Output: `.agent/artifacts/api-contracts/2026-05-27__web_route_api_next_screen_review__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for the selected web screen from Step 03.
If Step 03 selected an implementation-ready screen, plan/scaffold the route/layout changes. If Step 03 selected a no-code review outcome, document route plan only.
Output: `.agent/artifacts/routing/2026-05-27__web_route_api_next_screen_review__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for the selected web screen from Step 03.
If implementation-ready, build or harden the UI components. If review-only, document UI requirements and gaps.
Output: `.agent/artifacts/ui-specs/2026-05-27__web_route_api_next_screen_review__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for the selected web screen from Step 03.
If implementation-ready, wire services/hooks/cache/error handling. If review-only, document integration blockers.
Output: `.agent/artifacts/integration/2026-05-27__web_route_api_next_screen_review__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for the selected web screen from Step 03.
If implementation-ready, implement interactions and responsive states. If review-only, document interaction contract only.
Output: `.agent/artifacts/interaction-specs/2026-05-27__web_route_api_next_screen_review__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for the selected web screen from Step 03.
Review public/protected behavior, ownership, auth redirects, token handling and privacy/security implications.
Output: `.agent/artifacts/auth/2026-05-27__web_route_api_next_screen_review__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `web_route_api_next_screen_review`.
Run relevant validation for any changed files. If this remains review-only, validate artifacts and record no-code test status.
Output: `.agent/artifacts/test-cases/2026-05-27__web_route_api_next_screen_review__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `web_route_api_next_screen_review`.
Perform final readiness review, deploy/review closeout, memory handoff and prompt/progress update recommendation for the selected next web screen.
Output: `.agent/artifacts/deploy/2026-05-27__web_route_api_next_screen_review__deploy-report.md` and `.agent/artifacts/review/2026-05-27__web_route_api_next_screen_review__review.md`
```
