# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-locations-nearby`.

## Current Decision Snapshot

Date locked: `2026-05-24`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Dia diem lan can`
- Feature slug: `user-locations-nearby`
- Main route: `/nearby`
- Target page path: `src/app/[locale]/(main)/(public)/nearby/page.tsx`
- Target feature folder: `src/features/locations/nearby`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_locations_nearby.md`
- Primary API: `GET /locations/nearby?lat=&lng=&radius=&limit=&sort_by=&sort_order=`
- Supporting APIs: `GET /locations/{id}/nearby`, `GET /categories`, favorite APIs only if existing guest/auth behavior is safe.
- Status: selected next screen after `user-locations-by-category` Step 10 completion.
- Implementation reality: `user-locations-by-category` is implemented and validated with deploy/review artifacts. `/nearby` has backend API support but no App Router page yet.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: only choose screens that do not yet have route/page/component code in the web repo.
- Codegraph/repo contains `src/app/[locale]/(main)/(public)/categories/[slug]/locations/page.tsx` and `src/features/locations/category`; do not rebuild category locations.
- Repo has reusable location list/detail/card patterns under `src/features/locations`.
- Repo has no `src/app/[locale]/(main)/(public)/nearby/page.tsx` and no `src/features/locations/nearby` feature folder.
- Backend has public `GET /locations/nearby` validated by `NearbyLocationRequest`.
- This screen continues the public locations discovery cluster and can reuse existing location cards, grid/list states, categories, i18n and API helpers.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Codegraph was refreshed on `2026-05-24`; verify with real files because generated indexes can lag.
- Existing nearby-by-location-detail integration exists through `locationService.getNearbyByLocationId(id)` and `LocationDetailClient`.
- `src/config/api.ts` currently has `LOCATIONS.NEARBY_BY_ID` but no `LOCATIONS.NEARBY` helper.
- `src/services/location.service.ts` has `getNearbyByLocationId`, but no public coordinate-based `getNearby` method yet.
- Existing reusable pieces include `LocationGrid`, `LocationCard`, `LocationFilters`, `StandardPagination`, category hooks, and location query mapper patterns.
- Use `next dev --webpack` for local verification if dynamic-route Turbopack manifest issues appear.

## Goals

- Deliver the missing public `/nearby` screen through the 10-step pipeline.
- Use browser Geolocation API to request `lat/lng`, allow retry, and provide graceful denied/unavailable states.
- Support radius selection, sorting, limit/page-like list behavior if backend supports it, and category filter only if contract-safe.
- Show a usable map/list experience. If no map provider key/library exists, implement a polished list-first layout with a non-blocking map placeholder and document the limitation.
- Reuse existing location card/list UI where possible.
- Add route constant and API helper only if they fit existing config patterns.
- Do not implement category locations again, tour category pages, blog category pages, cart, profile delete, admin screens, or backend-only work.
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
7. Latest relevant `user-locations-nearby` artifacts if any
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
| `03-types-api-contract` | Contract/code foundation | Add/align nearby endpoint helper, request params, response type, service method, hook and mapper if needed. |
| `04-layout-routing` | Routing/code scaffold | Add public App Router page, route constant, metadata and i18n namespace/keys. |
| `05-ui-components` | Code-producing | Implement hero, GPS state panels, radius controls, result toolbar, list/grid/map area, skeleton, empty/error states. |
| `06-data-integration` | Code-producing | Wire geolocation, nearby query, radius/sort changes, retry, and category/favorite behavior only if contract-safe. |
| `07-interactions` | Code-producing | Implement permission retry, manual fallback if feasible, card navigation, radius/sort controls, reset and responsive behavior. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify public access and authenticated-only favorite behavior with no guest-only API leakage. |
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
- Feature slug: `user-locations-nearby`
- Screen name: `Dia diem lan can`
- Main route: `/nearby`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\nearby\page.tsx`
- Target feature folder: `D:\DATN\danangtrip-web\src\features\locations\nearby`
- Feature type: public GPS nearby locations discovery screen.
- Do not switch to category locations, tours-by-category, blog-by-category, cart, profile delete, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-locations-by-category` completed Step 10 and exists in repo.
- `/nearby` has no route/page/component code.
- Backend has public `GET /locations/nearby`.
- Screen doc exists: `D:\DATN\DATN_Document\docs\page\user_locations_nearby.md`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-locations-nearby` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_locations_nearby.md`
- Related docs: `user_locations_list.md`, `user_location_detail.md`, `user_locations_by_category.md`, `user_favorites.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend route: `D:\DATN\danangtrip-api\routes\api.php`
- Backend request: `D:\DATN\danangtrip-api\app\Http\Requests\Location\NearbyLocationRequest.php`
- Backend controller/service/repository for nearby locations under `D:\DATN\danangtrip-api\app`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\services\location.service.ts`
- `D:\DATN\danangtrip-web\src\features\locations`
- `D:\DATN\danangtrip-web\src\features\locations\components`
- `D:\DATN\danangtrip-web\src\features\locations\hooks\use-locations.ts`
- `D:\DATN\danangtrip-web\src\features\locations\utils\location-query-mapper.ts`
- `D:\DATN\danangtrip-web\src\messages\vi\locations.json`
- `D:\DATN\danangtrip-web\src\messages\en\locations.json`

CONTRACT DETAILS
- `GET /locations/nearby` requires `lat` and `lng`.
- Supported optional params from backend request: `radius`, `limit`, `sort_by`, `sort_order`.
- Do not send unsupported `category_id`, `page`, `per_page`, `district`, or `price_level` unless backend is extended first.
- Browser geolocation denial must not break the page; show retry and fallback navigation to `/locations`.
- Favorite actions are optional and must only be wired if existing favorite service contract is safe.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-locations-nearby` and small shared location helpers needed by this screen.
- Prefer existing location list/card/i18n patterns over a parallel architecture.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-locations-nearby`.
Read mandatory context, codegraph, `user_locations_nearby.md`, backend nearby route/request/controller, and existing location list/detail patterns.
Work: document purpose, public route, GPS permission states, API params, response shape, missing files, reusable patterns, backend/doc mismatches, risks, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-24__user-locations-nearby__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-locations-nearby`.
Inspect scripts, route conventions, public layout, i18n registry, feature folder conventions, geolocation/browser constraints, and validation gates.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-24__user-locations-nearby__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-locations-nearby`.
Inspect API endpoints, `location.service`, location types, hooks, backend `NearbyLocationRequest`, and response shape.
Work: add/align nearby endpoint helper, params type, service method, query hook and mapper. Do not send unsupported filters.
Output: `.agent/artifacts/api-contracts/2026-05-24__user-locations-nearby__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-locations-nearby`.
Target route: `/nearby`.
Work: add App Router page, route constant, metadata, i18n keys, and page shell using existing public layout patterns.
Output: `.agent/artifacts/routing/2026-05-24__user-locations-nearby__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-locations-nearby`.
Work: implement nearby hero, GPS states, radius controls, result toolbar, list/grid/map region, loading, empty and error states.
Output: `.agent/artifacts/ui-specs/2026-05-24__user-locations-nearby__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-locations-nearby`.
Work: wire browser geolocation, nearby query, radius/sort refetch, retry behavior, and location card navigation.
Output: `.agent/artifacts/integration/2026-05-24__user-locations-nearby__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-locations-nearby`.
Work: complete permission retry, radius/sort controls, keyboard/accessibility states, responsive behavior, reset/fallback navigation and card hover/click interactions.
Output: `.agent/artifacts/interaction-specs/2026-05-24__user-locations-nearby__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-locations-nearby`.
Work: verify route is public, favorite actions are auth-safe if included, and no protected endpoint is called for guests.
Output: `.agent/artifacts/auth/2026-05-24__user-locations-nearby__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-locations-nearby`.
Run relevant lint/typecheck/route/build checks and browser smoke tests where possible. Fix feature-caused failures.
Output: `.agent/artifacts/test-cases/2026-05-24__user-locations-nearby__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-locations-nearby`.
Perform final review, deploy readiness check, artifact closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-24__user-locations-nearby__deploy-report.md` and `.agent/artifacts/review/2026-05-24__user-locations-nearby__review.md`
```
