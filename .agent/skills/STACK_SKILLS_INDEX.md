# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-tours-by-category`.

## Current Decision Snapshot

Date locked: `2026-05-24`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Tour theo danh muc`
- Feature slug: `user-tours-by-category`
- Main route: `/tour-categories/{slug}/tours`
- Target page path: `src/app/[locale]/(main)/(public)/tour-categories/[slug]/tours/page.tsx`
- Target feature folder: `src/features/tour/category`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_tours_by_category.md`
- Primary API: `GET /tour-categories/{slug}/tours`
- Supporting API: `GET /tour-categories`
- Status: selected next screen after `user-locations-nearby` Step 10 completion and merge to `dev`.
- Implementation reality: `user-locations-by-category` and `user-locations-nearby` are implemented and validated with deploy/review artifacts. Tour category route has backend API support but no App Router page yet.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: choose a documented screen that still lacks route/page/component code in the web repo.
- Codegraph/repo contains `src/app/[locale]/(main)/(public)/nearby/page.tsx` and `src/features/locations/nearby`; do not rebuild nearby.
- Repo has reusable tour list/card/filter patterns under `src/features/tour`.
- Repo has no `src/app/[locale]/(main)/(public)/tour-categories/[slug]/tours/page.tsx`.
- Backend has public `GET /tour-categories/{slug}/tours` validated by `ToursBySlugTourCategoryRequest`.
- This screen continues public tour discovery after the generic tour list and tour detail flows.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Codegraph was refreshed on `2026-05-24 13:21`; verify with real files because generated indexes can lag.
- Existing public tour APIs are defined in `src/config/api.ts` under `API_ENDPOINTS.TOURS`.
- Existing tour service has `getCategories()` and `getAll(params)`, but no category-slug `getByCategorySlug(slug, params)` helper yet.
- Existing route config has `PUBLIC_ROUTES.TOURS` and `PUBLIC_ROUTES.TOUR_DETAIL`, but no category tours route helper yet.
- Existing reusable pieces include `TourCard`, `FilterSidebar`, `useTourFilters`, tour mapper, and tour list page patterns.
- Backend request currently supports only `page`, `per_page`, `sort_by`, `sort_order`, and `booking_availability` for this route.

## Goals

- Deliver the missing public `/tour-categories/{slug}/tours` screen through the 10-step pipeline.
- Add route/page, API helper, service method, types, query hook, and UI using existing tour patterns.
- Show category-context hero/breadcrumb, filtered tour results, sort controls, pagination, loading, empty, and error states.
- Reuse the tour list/card architecture where possible.
- Do not send unsupported filters such as `price_min`, `price_max`, `duration`, `available_from`, or `available_to` unless backend is extended first.
- Do not implement generic tours list, tour detail, locations, blog category, cart, admin, or backend-only work.
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
7. Latest relevant `user-tours-by-category` artifacts if any
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
| `03-types-api-contract` | Contract/code foundation | Add/align endpoint helper, params type, response type, service method, hook and mapper if needed. |
| `04-layout-routing` | Routing/code scaffold | Add public App Router page, route constant, metadata and i18n keys. |
| `05-ui-components` | Code-producing | Implement category hero, breadcrumb, result toolbar, tour grid/list, pagination, skeleton, empty/error states. |
| `06-data-integration` | Code-producing | Wire slug, category/tours query, supported filters, sort, pagination, and card navigation. |
| `07-interactions` | Code-producing | Implement reset/sort/pagination/card interactions, responsive behavior, keyboard/accessibility states. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify public access and no protected endpoint leakage. |
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
- Feature slug: `user-tours-by-category`
- Screen name: `Tour theo danh muc`
- Main route: `/tour-categories/{slug}/tours`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\tour-categories\[slug]\tours\page.tsx`
- Target feature folder: `D:\DATN\danangtrip-web\src\features\tour\category`
- Feature type: public tour category listing screen.
- Do not switch to generic tours list, tour detail, locations, blog category, cart, profile delete, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-locations-nearby` completed Step 10 and exists in repo.
- `/tour-categories/{slug}/tours` has no route/page/component code.
- Backend has public `GET /tour-categories/{slug}/tours`.
- Screen doc exists: `D:\DATN\DATN_Document\docs\page\user_tours_by_category.md`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-tours-by-category` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_tours_by_category.md`
- Related docs: `user_tours_list.md`, `user_tour_detail.md`, `user_tour_departure_select.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend route: `D:\DATN\danangtrip-api\routes\api.php`
- Backend request: `D:\DATN\danangtrip-api\app\Http\Requests\TourCategory\ToursBySlugTourCategoryRequest.php`
- Backend controller/service/repository: `TourCategoryController.php`, `TourCategoryService.php`, `TourCategoryRepository.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\services\tour.service.ts`
- `D:\DATN\danangtrip-web\src\features\tour`
- `D:\DATN\danangtrip-web\src\features\tour\components`
- `D:\DATN\danangtrip-web\src\features\tour\hooks\useTourFilters.ts`
- `D:\DATN\danangtrip-web\src\features\tour\utils\tour-mapper.ts`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

CONTRACT DETAILS
- `GET /tour-categories/{slug}/tours` requires a valid category slug.
- Supported optional params from backend request: `page`, `per_page`, `sort_by`, `sort_order`, `booking_availability`.
- Supported `sort_by`: `created_at`, `price_adult`, `rating_avg`, and input `price` which backend normalizes to `price_adult`.
- Supported `sort_order`: `asc`, `desc`.
- Do not send unsupported `price_min`, `price_max`, `duration`, `available_from`, `available_to`, `tour_category_id`, `q`, or `search` unless backend is extended first.
- If category slug does not exist, show a clear 404/empty state and CTA back to `/tours`.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-tours-by-category` and small shared tour helpers needed by this screen.
- Prefer existing tour list/card/i18n patterns over a parallel architecture.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-tours-by-category`.
Read mandatory context, codegraph, `user_tours_by_category.md`, backend tour category route/request/controller/service/repository, and existing tour list/detail patterns.
Work: document purpose, public route, API params, response shape, missing files, reusable patterns, backend/doc mismatches, risks, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-24__user-tours-by-category__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-tours-by-category`.
Inspect scripts, route conventions, public layout, i18n registry, feature folder conventions, and validation gates.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-24__user-tours-by-category__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-tours-by-category`.
Inspect API endpoints, `tour.service`, tour types, hooks, backend `ToursBySlugTourCategoryRequest`, and response shape.
Work: add/align category tours endpoint helper, params type, service method, query hook and mapper. Do not send unsupported filters.
Output: `.agent/artifacts/api-contracts/2026-05-24__user-tours-by-category__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-tours-by-category`.
Target route: `/tour-categories/{slug}/tours`.
Work: add App Router page, route constant, metadata, i18n keys, and page shell using existing public tour layout patterns.
Output: `.agent/artifacts/routing/2026-05-24__user-tours-by-category__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-tours-by-category`.
Work: implement category hero, breadcrumb, result toolbar, supported filters/sort controls, tour grid/list region, loading, empty and error states.
Output: `.agent/artifacts/ui-specs/2026-05-24__user-tours-by-category__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-tours-by-category`.
Work: wire slug route params, category tours query, pagination, sort, booking availability filter, category context, and tour card navigation.
Output: `.agent/artifacts/integration/2026-05-24__user-tours-by-category__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-tours-by-category`.
Work: complete sort/filter reset, pagination, card click/CTA, responsive behavior, accessible controls and invalid slug handling.
Output: `.agent/artifacts/interaction-specs/2026-05-24__user-tours-by-category__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-tours-by-category`.
Work: verify route is public, no protected endpoints are called, and booking CTAs keep existing auth behavior.
Output: `.agent/artifacts/auth/2026-05-24__user-tours-by-category__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-tours-by-category`.
Run relevant lint/typecheck/route/build checks and browser smoke tests where possible. Fix feature-caused failures.
Output: `.agent/artifacts/test-cases/2026-05-24__user-tours-by-category__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-tours-by-category`.
Perform final review, deploy readiness check, artifact closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-24__user-tours-by-category__deploy-report.md` and `.agent/artifacts/review/2026-05-24__user-tours-by-category__review.md`
```
