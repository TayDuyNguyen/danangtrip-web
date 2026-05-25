# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web task: `user-cart-api-planning`.

## Current Decision Snapshot

Date locked: `2026-05-25`

- Repo: `D:\DATN\danangtrip-web`
- Supporting repo: `D:\DATN\danangtrip-api`
- Selected task: `Plan and prepare user-cart API readiness`
- Feature slug: `user-cart-api-planning`
- Candidate screen slug: `user-cart`
- Candidate route: `/cart`
- Candidate docs:
  - `D:\DATN\DATN_Document\docs\page\user_cart.md`
- Planned API from docs:
  - `GET /cart`
  - `POST /cart/items`
  - `PUT /cart/items/{id}`
  - `DELETE /cart/items/{id}`
  - `POST /cart/checkout`
- Status: planning/API readiness gate selected after `user-profile-delete` completion and merge into `dev`.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Progress report `0.0.12` says `user-profile-delete` is complete and merged.
- Codegraph snapshot `2026-05-25 22:23`: web `files=339`, `nodes=2818`, `edges=5672`, `unresolved_refs=0`.
- Codegraph snapshot `2026-05-25 22:23`: api `files=452`, `nodes=4342`, `edges=6218`, `unresolved_refs=0`.
- Report `0.0.12` identifies `user-cart` as the next web candidate, but codegraph/repo scan does not find cart route/components/API yet.
- The cart doc is explicitly `Planned`; direct tour detail checkout is already functional.
- Therefore the next web work must be a planning/API readiness pass first. Do not jump straight into cart UI implementation without a verified backend contract.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` and `D:\DATN\danangtrip-api\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Completed web screens include booking lookup/detail/list, favorites, notifications, profile/password/delete, recommendations, ratings, locations category/nearby, tours category, and blog category.
- `user-profile-delete` is complete:
  - Web route `/profile/delete` exists.
  - API route `DELETE /user/account` exists.
  - Step 09/10 artifacts exist for `2026-05-25__user-profile-delete`.
- Cart is not code-ready yet:
  - No confirmed web `/cart` page/component/service.
  - No confirmed API cart routes in `danangtrip-api`.
  - Docs list planned endpoints only.
- Current task should output a decision: implement API + web cart now, postpone cart, or reduce scope to a client-only/local cart only if the product owner explicitly accepts that tradeoff.

## Goals

- Run a disciplined planning/API readiness pass for `user-cart`.
- Confirm whether the cart should support:
  - authenticated user cart only,
  - guest cart with `X-Session-Id`,
  - local storage draft cart,
  - or no cart because direct checkout remains the chosen flow.
- If cart is approved, define backend contract, data model, route list, request/response schemas, and frontend integration plan.
- If cart is not approved, record the blocker and recommend the next API-ready web screen/hardening item.
- Do not implement product code until Step 01-03 confirm the API contract and scope.
- Produce artifacts for every step and update memory after each step.
- Use current docs root `D:\DATN\DATN_Document`; do not use legacy document paths.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant `user-cart` or `user-cart-api-planning` artifacts if any
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
| `02-project-setup` | Audit/setup | Audit route/API/data-model readiness; no product code unless setup is strictly non-behavioral. |
| `03-types-api-contract` | Contract gate | Define the cart API contract and decide whether backend implementation is required before UI. |
| `04-layout-routing` | Conditional scaffold | Only scaffold `/cart` if Step 03 marks backend contract ready or explicitly approves a stub route. |
| `05-ui-components` | Conditional UI | Only build UI after contract readiness. Otherwise document UI requirements only. |
| `06-data-integration` | Conditional integration | Only wire services/hooks after backend or mock contract is approved. |
| `07-interactions` | Conditional interactions | Only implement cart interactions after data integration plan is valid. |
| `08-auth-permissions` | Auth & Security | Decide guest/user cart identity, session handling, auth guard and checkout ownership. |
| `09-testing` | Validation | Run applicable checks or produce planning validation if no code is changed. |
| `10-optimization-deploy` | Handoff | Close planning/implementation decision, review artifacts and progress prompt recommendation. |

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

Act as the planning and implementation-readiness agent for repositories:
- `D:\DATN\danangtrip-web`
- `D:\DATN\danangtrip-api`

CURRENT TASK LOCK
- Feature slug: `user-cart-api-planning`
- Candidate screen: `user-cart`
- Candidate route: `/cart`
- Candidate backend APIs: `GET /cart`, `POST /cart/items`, `PUT /cart/items/{id}`, `DELETE /cart/items/{id}`, `POST /cart/checkout`

WHY THIS IS NEXT
- `user-profile-delete` completed Step 10 and merged into `dev`.
- Progress report `0.0.12` selects user cart as the next web candidate, but marks it as API/planning gated.
- Codegraph does not currently confirm cart web route or cart backend endpoints.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-cart` or `user-cart-api-planning` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Candidate screen doc: `D:\DATN\DATN_Document\docs\page\user_cart.md`
- Web route config: `D:\DATN\danangtrip-web\src\config\routes.ts`
- Tour detail/booking flow: inspect current tour detail and tour booking feature folders.
- API routes: `D:\DATN\danangtrip-api\routes\api.php`
- API booking/tour/promotion services and repositories.

PLANNING CONTRACT
- Do not implement `/cart` UI until API readiness is confirmed.
- Confirm guest cart vs authenticated cart vs local-only cart.
- Confirm item fields: tour_id, tour_schedule_id, quantity_adult, quantity_child, quantity_infant, price snapshot behavior, availability validation and promotion validation.
- Confirm checkout behavior: convert cart items into booking or redirect into existing booking flow.
- If backend work is required, define the API/data-model tasks first.
- If product scope rejects cart, record the decision and recommend the next API-ready web task.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep product code changes blocked until the contract gate says READY.
- Prefer existing web service/hook/i18n/route patterns and API service/repository/request patterns.
- Run validation in Step 09 and Step 10 as applicable to the amount of code changed.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-cart-api-planning`.
Read mandatory context, codegraph, `user_cart.md`, existing tour booking flow, promotion validation if any, and backend route inventory.
Work: document current repo reality, missing API/routes, user flows, scope options, risks and recommended decision.
Output: `.agent/artifacts/analysis/2026-05-25__user-cart-api-planning__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-cart-api-planning`.
Inspect route conventions, feature folder conventions, API layer conventions, backend model/migration/service/repository conventions, and package scripts.
Work: verify readiness and list exact setup tasks required if cart proceeds.
Output: `.agent/artifacts/setup/2026-05-25__user-cart-api-planning__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-cart-api-planning`.
Define the cart contract gate.
Work: decide guest/user identity model, request/response schemas, backend endpoints, data model, validation rules, checkout conversion flow and error shape.
Output: `.agent/artifacts/api-contracts/2026-05-25__user-cart-api-planning__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-cart-api-planning`.
If Step 03 is READY, plan or scaffold `/cart` route and route constants. If not READY, document the blocked route plan only.
Output: `.agent/artifacts/routing/2026-05-25__user-cart-api-planning__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-cart-api-planning`.
If Step 03 is READY, design/build cart item list, summary, promotion and empty state components. If not READY, produce UI spec only.
Output: `.agent/artifacts/ui-specs/2026-05-25__user-cart-api-planning__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-cart-api-planning`.
If Step 03 is READY, wire cart service/hooks and backend integration. If not READY, document integration blockers and backend tasks.
Output: `.agent/artifacts/integration/2026-05-25__user-cart-api-planning__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-cart-api-planning`.
If Step 03 is READY, implement quantity updates, remove item, promotion, checkout and stale availability handling. If not READY, document interaction contract only.
Output: `.agent/artifacts/interaction-specs/2026-05-25__user-cart-api-planning__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-cart-api-planning`.
Review guest/user cart ownership, `X-Session-Id`, auth guard, checkout permissions and privacy/security implications.
Output: `.agent/artifacts/auth/2026-05-25__user-cart-api-planning__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-cart-api-planning`.
Run relevant validation for any changed files. If this remains planning-only, validate artifacts and record no-code test status.
Output: `.agent/artifacts/test-cases/2026-05-25__user-cart-api-planning__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-cart-api-planning`.
Perform final readiness review, deploy/planning closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-25__user-cart-api-planning__deploy-report.md` and `.agent/artifacts/review/2026-05-25__user-cart-api-planning__review.md`
```
