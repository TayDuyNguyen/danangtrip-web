# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-locations-by-category`.

## Current Decision Snapshot

Date locked: `2026-05-23`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Dia diem theo danh muc`
- Feature slug: `user-locations-by-category`
- Main route: `/categories/[slug]/locations`
- Target page path: `src/app/[locale]/(main)/(public)/categories/[slug]/locations/page.tsx`
- Target feature folder: `src/features/locations/category`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_locations_by_category.md`
- Primary API: `GET /categories/{slug}/locations?page=&per_page=12&sort=&order=`
- Supporting APIs: `GET /categories`, `GET /location-categories`, `GET /locations/districts`, favorite APIs if existing contract is safe.
- Status: selected next screen after `user-my-ratings` Step 10 completion.
- Implementation reality: `user-my-ratings` is implemented and validated with deploy/review artifacts. `/categories/{slug}/locations` has backend API and partial service support, but no App Router page yet.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: only choose screens that do not yet have route/page/component code in the web repo.
- Codegraph/repo contains `src/app/[locale]/(main)/(protected)/profile/ratings/page.tsx` and `src/features/profile/ratings`; do not rebuild my-ratings.
- Codegraph/repo has no route/page for `categories/[slug]/locations`.
- Backend has public `GET /categories/{slug}/locations`.
- `locationService.getByCategory(categorySlug)` exists but currently needs params/pagination alignment.
- This screen closes a public discovery route linked conceptually from category cards and reuses the existing locations list UI.
- `user_booking_invoice` remains an action flow in booking detail, not the next standalone page unless explicitly requested.
- `user_profile_delete` and `user_cart` remain planned/API-risk screens, so they are not selected.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Codegraph confirms `profile/ratings` files exist.
- Codegraph may still list stale recommendation paths; verify against `rg --files` before acting on route facts.
- Repo has `src/app/[locale]/(main)/(public)/locations/page.tsx` and reusable `src/features/locations` list components.
- Repo has no `src/app/[locale]/(main)/(public)/categories/[slug]/locations/page.tsx`.
- Existing reusable pieces: `LocationListClient`, `LocationHeader`, `LocationFilters`, `LocationGrid`, `LocationCard`, `useLocations`, `useLocationCategories`, and `location-query-mapper`.
- `src/services/location.service.ts` has `getByCategory` but it returns `ApiResponse<Location[]>`; Step 03 must align it with the real paginated backend response if needed.
- `src/config/api.ts` has `LOCATIONS.CATEGORIES: "/categories"` but no explicit `LOCATIONS.BY_CATEGORY(slug)` helper yet.

## Goals

- Deliver the missing public `/categories/{slug}/locations` screen through the 10-step pipeline.
- Reuse the location list layout while locking the category context from the URL slug.
- Show category-aware hero/breadcrumb, result count, subcategory pills if backend exposes them, filters without category checkbox, grid/list, pagination, empty/error states.
- Support URL params for district, price level, rating, subcategory, sorting and page when backend supports them.
- Add route constant and API helper only if they fit existing route/config patterns.
- Do not implement nearby, tours-by-category, blog-by-category, cart, profile delete, admin screens, or rebuild generic locations list.
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
7. Latest relevant `user-locations-by-category` artifacts if any
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
| `03-types-api-contract` | Contract/code foundation | Align category locations endpoint, params, paginated response types, service method, hook and mapper. |
| `04-layout-routing` | Routing/code scaffold | Add public App Router page, route constant if used, metadata and i18n namespace/keys. |
| `05-ui-components` | Code-producing | Implement category hero, breadcrumb, subcategory pills, toolbar, reused filters, grid, skeleton, empty/error states. |
| `06-data-integration` | Code-producing | Wire category detail/list query, URL params, pagination, retry, and favorite action only if contract-safe. |
| `07-interactions` | Code-producing | Implement filter changes, subcategory pills, sort/page navigation, card navigation, reset/retry and responsive behavior. |
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
- Feature slug: `user-locations-by-category`
- Screen name: `Dia diem theo danh muc`
- Main route: `/categories/[slug]/locations`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\categories\[slug]\locations\page.tsx`
- Target feature folder: `D:\DATN\danangtrip-web\src\features\locations\category`
- Feature type: public category-filtered locations listing page.
- Do not switch to nearby, tours-by-category, blog-by-category, cart, profile delete, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-my-ratings` completed Step 10 and exists in repo.
- `/categories/{slug}/locations` has no route/page/component code.
- Backend has public `GET /categories/{slug}/locations`.
- Screen doc exists: `D:\DATN\DATN_Document\docs\page\user_locations_by_category.md`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-locations-by-category` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_locations_by_category.md`
- Related docs: `user_locations_list.md`, `user_location_detail.md`, `user_home.md`, `user_favorites.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend route: `D:\DATN\danangtrip-api\routes\api.php`
- Backend controller/service/repository for category locations under `D:\DATN\danangtrip-api\app`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\services\location.service.ts`
- `D:\DATN\danangtrip-web\src\features\locations`
- `D:\DATN\danangtrip-web\src\features\locations\components\LocationListClient.tsx`
- `D:\DATN\danangtrip-web\src\features\locations\hooks\use-locations.ts`
- `D:\DATN\danangtrip-web\src\features\locations\utils\location-query-mapper.ts`
- `D:\DATN\danangtrip-web\src\features\home`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

CONTRACT DETAILS
- `GET /categories/{slug}/locations` loads paginated locations for a category slug.
- Query params may include `page`, `per_page`, `sort`, `order`, `district`, `price_level`, `subcategory_id`; verify backend before sending each.
- Do not call `/categories/{id}` with a slug unless backend supports slug lookup; derive category info from list/category response or the category-locations payload.
- Empty result should offer clear filter reset and `/locations` fallback.
- Favorite actions are optional and must only be wired if existing favorite service contract is safe.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-locations-by-category` and small shared location helpers needed by this screen.
- Prefer existing location list components and i18n patterns over a parallel architecture.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-locations-by-category`.
Read mandatory context, codegraph, `user_locations_by_category.md`, backend category locations route/service, and existing location list patterns.
Work: document purpose, public route, API params, response shape, missing files, reusable patterns, backend/doc mismatches, risks, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-23__user-locations-by-category__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-locations-by-category`.
Inspect scripts, route conventions, public layout, i18n registry, feature folder conventions, and validation gates.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-23__user-locations-by-category__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-locations-by-category`.
Inspect `api.ts`, `location.service.ts`, location types, query mapper, backend category request/controller/service/repository.
Work: add/align category-locations endpoint helper, request params, paginated response type, service method, hook and mapper.
Output: `.agent/artifacts/api-contracts/2026-05-23__user-locations-by-category__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-locations-by-category`.
Target route: `/categories/[slug]/locations`.
Work: add public App Router page, metadata, route constant if used, i18n namespace registration, and link alignment from category cards if safe.
Output: `.agent/artifacts/routing/2026-05-23__user-locations-by-category__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-locations-by-category`.
Work: implement category hero, breadcrumb, result count, subcategory pills, filtered location layout, reused cards/filter controls, skeletons, empty state, error state and responsive layout.
Output: `.agent/artifacts/ui-specs/2026-05-23__user-locations-by-category__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-locations-by-category`.
Work: wire category locations query, URL params, pagination, sort/filter state, loading/error/empty/retry states, and optional favorite toggle only if contract-safe.
Output: `.agent/artifacts/integration/2026-05-23__user-locations-by-category__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-locations-by-category`.
Work: implement filter changes, subcategory selection, sort/page navigation, reset filters, card navigation, retry, disabled states, keyboard/focus and responsive interaction details.
Output: `.agent/artifacts/interaction-specs/2026-05-23__user-locations-by-category__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-locations-by-category`.
Work: verify public access, safe optional favorite behavior for guests/authenticated users, no accidental protected-route requirement, and API error handling.
Output: `.agent/artifacts/auth/2026-05-23__user-locations-by-category__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-locations-by-category`.
Run as feasible: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, route checks, focused tests if available, and `npm.cmd run prepush:check`.
Work: fix feature-caused failures and document pass/fail/skipped commands.
Output: `.agent/artifacts/test-cases/2026-05-23__user-locations-by-category__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-locations-by-category`.
Inputs: artifacts 01-09, validation output, final git diff.
Work: final review for route/API/i18n/UI/interactions/auth/tests, run or cite final validation, create deploy report and review, update memory files.
Outputs: `.agent/artifacts/deploy/2026-05-23__user-locations-by-category__deploy-report.md`; `.agent/artifacts/review/2026-05-23__user-locations-by-category__review.md`
```
