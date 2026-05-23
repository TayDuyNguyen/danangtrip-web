# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-recommendations`.

## Current Decision Snapshot

Date locked: `2026-05-23`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Gợi ý dành riêng cho bạn`
- Feature slug: `user-recommendations`
- Main route: `/recommendations`
- Target page path: `src/app/[locale]/(main)/(protected)/recommendations/page.tsx`
- Target feature folder: `src/features/recommendations`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_recommendations.md`
- Primary API: `GET /recommendations?limit=12&type=location|tour`
- Status: selected next screen after `user-reset-password` Step 10 completion.
- Implementation reality: `user-reset-password` is now implemented and validated. `/recommendations` has no route/page/component in the web repo.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: only choose screens that do not yet have route/page/component code in the web repo.
- `user-reset-password` is completed with route, component, i18n, artifacts, and validation.
- `user-booking-invoice` already has feature artifacts and invoice action integration in booking detail, so do not select it as a new standalone screen unless product explicitly asks for a separate route.
- `user-recommendations.md` is the next ready standalone user screen with a real backend route: `GET /recommendations`.
- Backend route is protected by auth middleware, so the page belongs under `(protected)`.
- Existing `src/config/api.ts` does not yet expose `RECOMMENDATIONS`; Step 03 must add it.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Codegraph/repo now contains `reset-password` route/form/i18n; do not rebuild that screen.
- Repo has no `src/app/[locale]/(main)/(protected)/recommendations/page.tsx`.
- Repo has no `src/features/recommendations`.
- Existing reusable card/list patterns likely live in `src/features/locations`, `src/features/tour`, search/list pages, favorites, and home/recommendation snippets if present.
- `src/middleware.ts` already protects `(protected)` routes such as profile, bookings, favorites, notifications. Step 08 must ensure `/recommendations` is included if needed.
- Backend route: `routes/api.php` has authenticated `GET /recommendations` mapped to `SearchController@recommendations`.

## Goals

- Deliver the missing `/recommendations` protected screen through the 10-step pipeline.
- Display personalized recommended locations and tours.
- Support tabs: all, locations, tours.
- Use backend-compatible query params: `limit` and optional `type`.
- Render loading, empty, error, fallback/discovery, and authenticated-only states.
- Reuse existing location/tour card visual language and route links.
- Do not implement unrelated screens: my ratings, nearby, cart, profile delete, categories pages, admin screens, or reset-password.
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
7. Latest relevant `user-recommendations` artifacts if any
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Real repo sources and docs listed in this prompt

If sources conflict, follow repo reality and record stale facts in the artifact.

## Memory Continuity Rules

- At the start of each step, update `.agent/memory/WORKING_STATE.md`.
- After each completed step, update `.agent/memory/WORKING_STATE.md` and append `.agent/memory/SESSION_LOG.md`.
- Update `.agent/memory/HANDOFF.md` if paused, blocked, waiting for approval, or incomplete.
- Do not claim a step is complete until the artifact and memory updates are complete.

## Coding Responsibility By Skill

| Skill | Execution mode | Code expectation |
| --- | --- | --- |
| `01-screen-analysis` | Analysis only | Do not edit product code; create/update analysis artifact and memory. |
| `02-project-setup` | Audit/setup | Usually no feature code; config/script fixes only if required. |
| `03-types-api-contract` | Contract/code foundation | Add recommendation endpoint, request params, raw/view types, mapper/service/hook if project pattern requires. |
| `04-layout-routing` | Routing/code scaffold | Add protected route page, route constant, i18n namespace registration, and navigation-safe links. |
| `05-ui-components` | Code-producing | Implement hero, tabs, grid, location/tour cards, reason tags, skeleton, empty/error/fallback states. |
| `06-data-integration` | Code-producing | Wire recommendation query, tab params, auth-aware fetch, favorite actions only if contract-safe. |
| `07-interactions` | Code-producing | Implement tab switching, URL/search state if used, card navigation, retry, favorite toggle, disabled/loading behavior. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify protected route, unauthenticated redirect, authenticated API call, token refresh/401 behavior. |
| `09-testing` | Validation/fix loop | Run checks/tests and fix feature-caused failures. |
| `10-optimization-deploy` | Finalization/fix loop | Final review, deploy readiness artifacts, validation evidence, memory handoff. |

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

## Recommended Current Screen Prompt

```text
SYSTEM EXECUTION CONTRACT

Act as the execution agent for repository: `D:\DATN\danangtrip-web`

CURRENT SCREEN LOCK
- Feature slug: `user-recommendations`
- Screen name: `Gợi ý dành riêng cho bạn`
- Main route: `/recommendations`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\recommendations\page.tsx`
- Target feature folder: `D:\DATN\danangtrip-web\src\features\recommendations`
- Feature type: protected personalized recommendations page.
- Do not switch to reset-password, forgot-password, profile ratings, category pages, cart, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-reset-password` completed Step 10 and exists in repo.
- `/recommendations` has no route/page/component code.
- Backend has authenticated `GET /recommendations`.
- Screen doc exists: `D:\DATN\DATN_Document\docs\page\user_recommendations.md`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-recommendations` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_recommendations.md`
- Related docs: `user_home.md`, `user_locations_list.md`, `user_tours_list.md`, `user_favorites.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend route: `D:\DATN\danangtrip-api\routes\api.php`
- Backend controller: `D:\DATN\danangtrip-api\app\Http\Controllers\Api\SearchController.php`
- Backend request: `D:\DATN\danangtrip-api\app\Http\Requests\Search\RecommendationSearchRequest.php`
- Backend service: `D:\DATN\danangtrip-api\app\Services\SearchService.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\middleware.ts`
- `D:\DATN\danangtrip-web\src\i18n\request.ts`
- Existing card/list references under `src/features/locations`, `src/features/tour`, `src/features/favorites`, `src/app/[locale]/(main)/(public)/locations/page.tsx`, `src/app/[locale]/(main)/(public)/tours/page.tsx`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

CONTRACT DETAILS
- API: `GET /recommendations`
- Query: `limit` default `12`, max should follow backend request; optional `type=location|tour` if backend supports it.
- Page requires logged-in user. Do not call it as public guest unless backend allows fallback.
- Cards must link to `/locations/{slug}` or `/tours/{slug}`.
- Favorite toggle is optional and must only be wired if existing favorite service contract is safe.
- Empty result should offer CTA to `/locations` and `/tours`.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-recommendations`.
- Prefer existing cards/components and i18n patterns over a parallel architecture.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-recommendations`.
Read mandatory context, codegraph, `user_recommendations.md`, backend recommendation route/request/service, and existing location/tour card patterns.
Work: document purpose, protected route, API params, expected response shape, missing files, reusable patterns, risks, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-23__user-recommendations__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-recommendations`.
Inspect scripts, route conventions, protected layout, i18n registry, feature folder conventions, and validation gates.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-23__user-recommendations__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-recommendations`.
Inspect `api.ts`, service patterns, existing location/tour types, favorites contract, backend `RecommendationSearchRequest`, `SearchService`.
Work: add endpoint/types/service/hook/mapper needed for `GET /recommendations`; document params, response, auth and error behavior.
Output: `.agent/artifacts/api-contracts/2026-05-23__user-recommendations__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-recommendations`.
Target route: `/recommendations`.
Work: add route constant, protected App Router page, metadata, i18n namespace registration, and middleware/protected-route alignment if needed.
Output: `.agent/artifacts/routing/2026-05-23__user-recommendations__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-recommendations`.
Work: implement hero, tabs, result grid, location card, tour card, reason tag, skeletons, empty state, error state, login/protected state messaging, and responsive layout.
Output: `.agent/artifacts/ui-specs/2026-05-23__user-recommendations__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-recommendations`.
Work: wire recommendation query, tab filter params, loading/error/empty/fallback states, retry behavior, and optional favorite toggle only if existing API service supports it safely.
Output: `.agent/artifacts/integration/2026-05-23__user-recommendations__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-recommendations`.
Work: implement tab switching, card navigation, CTA navigation, retry, favorite click behavior if present, disabled states, keyboard/focus and responsive interaction details.
Output: `.agent/artifacts/interaction-specs/2026-05-23__user-recommendations__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-recommendations`.
Work: verify protected access, unauthenticated redirect to login with callback, authenticated API header behavior, 401/403 handling, and no accidental public data leakage.
Output: `.agent/artifacts/auth/2026-05-23__user-recommendations__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-recommendations`.
Run as feasible: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, route checks, focused tests if available, and `npm.cmd run prepush:check`.
Work: fix feature-caused failures and document pass/fail/skipped commands.
Output: `.agent/artifacts/test-cases/2026-05-23__user-recommendations__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-recommendations`.
Inputs: artifacts 01-09, validation output, final git diff.
Work: final review for route/API/i18n/UI/interactions/auth/tests, run or cite final validation, create deploy report and review, update memory files.
Outputs: `.agent/artifacts/deploy/2026-05-23__user-recommendations__deploy-report.md`; `.agent/artifacts/review/2026-05-23__user-recommendations__review.md`
```
