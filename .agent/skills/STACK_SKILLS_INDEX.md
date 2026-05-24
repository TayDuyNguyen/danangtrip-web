# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-blog-by-category`.

## Current Decision Snapshot

Date locked: `2026-05-24`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Blog theo danh muc`
- Feature slug: `user-blog-by-category`
- Main route: `/blog?category_id={id}`
- Target page path: `src/app/[locale]/(main)/(public)/blog/page.tsx`
- Target feature folder: `src/features/blog`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_blog_by_category.md`
- Primary API: `GET /blog?category_id={id}&page={page}&per_page={per_page}`
- Supporting API: `GET /blog/categories`
- Status: selected next screen after `user-tours-by-category` Step 10 completion and merge to `dev`.
- Implementation reality: `user-tours-by-category` is implemented and validated with deploy/review/test artifacts. Blog category filtering already partially exists in `BlogContent`, but there is no dedicated delivery artifact/hardening pass for `user_blog_by_category.md`.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: choose a documented screen that is not yet delivered through the 10-step pipeline.
- Progress report `0.0.10` locks web next screen as `user-blog-by-category`.
- Codegraph was refreshed on `2026-05-24 16:05`; verify with real files because generated indexes can lag.
- Repo already contains `/blog`, `BlogContent`, `BlogSidebar`, `BlogCategoryScrollRow`, `blogService.getLatest`, `blogService.getSidebarData`, and `BlogFilterParams.category_id`.
- Repo already parses `category_id` from query params and highlights sidebar categories in most cases, but this needs validation against the screen doc: active category, invalid category state, empty copy, result count, pagination, and metadata behavior.
- This is a query-state hardening/backfill screen, not a new route. Do not create `/blog/categories/...` unless the current docs or product owner explicitly changes the route.
- `user-profile-delete` and `user-cart` remain lower priority because their flows are planned/API-dependent.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Codegraph file timestamp: `2026-05-24 16:05`.
- Existing route: `src/app/[locale]/(main)/(public)/blog/page.tsx`.
- Existing detail route: `src/app/[locale]/(main)/(public)/blog/[slug]/page.tsx`.
- Existing component: `src/features/blog/components/BlogContent.tsx` reads `category_id` from `useSearchParams`.
- Existing sidebar: `src/features/blog/components/BlogSidebar.tsx` supports `selectedCategoryId` and `onCategorySelect`.
- Existing API: `src/services/blog.service.ts` calls `API_ENDPOINTS.BLOG.LIST` and `API_ENDPOINTS.BLOG.CATEGORIES`.
- Existing types: `src/features/blog/types/index.ts` has `BlogFilterParams.category_id`.
- Backend route reality: `routes/api.php` has `GET /blog` and `GET /blog/categories`.
- The screen doc expects category id validation, active category UI, category-specific result count, empty state, pagination, and SEO/meta alignment.

## Goals

- Deliver `user-blog-by-category` through the 10-step pipeline as a scoped hardening/backfill of `/blog?category_id={id}`.
- Verify and improve category query parsing, invalid `category_id` handling, active sidebar/category state, category-specific result count, empty state, pagination behavior, and metadata where feasible.
- Keep the existing `/blog` route and blog architecture. Reuse current `BlogContent`, `BlogSidebar`, hooks, service, and i18n.
- Do not build a new category route unless explicitly requested.
- Do not implement cart, profile delete, admin, backend-only work, generic blog CMS, or unrelated blog redesign.
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
7. Latest relevant `user-blog-by-category` artifacts if any
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
| `03-types-api-contract` | Contract/code foundation | Verify blog category params/types/service/response; add small alignment only if needed. |
| `04-layout-routing` | Routing/code scaffold | Keep `/blog`; align query-state route behavior, metadata/i18n as needed. |
| `05-ui-components` | Code-producing | Harden active category UI, result text, category empty/invalid states, and sidebar/category affordances. |
| `06-data-integration` | Code-producing | Wire validated category id, category lookup, pagination, and clear filters behavior. |
| `07-interactions` | Code-producing | Complete category click, pagination, reset, invalid id recovery, responsive/accessibility behavior. |
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
- Feature slug: `user-blog-by-category`
- Screen name: `Blog theo danh muc`
- Main route: `/blog?category_id={id}`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\blog\page.tsx`
- Target feature folder: `D:\DATN\danangtrip-web\src\features\blog`
- Feature type: public blog category query-state screen.
- Do not switch to blog detail, generic blog redesign, tours, locations, cart, profile delete, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-tours-by-category` completed Step 10 and exists in repo.
- Progress report `0.0.10` locks `user-blog-by-category` as the next web screen.
- `/blog?category_id={id}` is documented and API-ready.
- Current repo has partial category query handling but no dedicated delivery artifacts for `user_blog_by_category.md`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-blog-by-category` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_blog_by_category.md`
- Related docs: `user_blog_list.md`, `user_blog_detail.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend route: `D:\DATN\danangtrip-api\routes\api.php`
- Backend service/repository: `BlogController.php`, `BlogService.php`, `BlogPostRepository.php`, `BlogCategoryRepository.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\blog\page.tsx`
- `D:\DATN\danangtrip-web\src\services\blog.service.ts`
- `D:\DATN\danangtrip-web\src\features\blog`
- `D:\DATN\danangtrip-web\src\features\blog\components\BlogContent.tsx`
- `D:\DATN\danangtrip-web\src\features\blog\components\BlogSidebar.tsx`
- `D:\DATN\danangtrip-web\src\features\blog\hooks\useBlog.ts`
- `D:\DATN\danangtrip-web\src\features\blog\types\index.ts`
- `D:\DATN\danangtrip-web\src\messages\vi\blog.json`
- `D:\DATN\danangtrip-web\src\messages\en\blog.json`

CONTRACT DETAILS
- Route stays `/blog?category_id={id}`.
- `category_id` must be numeric and should map to an existing category from `GET /blog/categories`.
- Blog list API call: `GET /blog` with supported params `category_id`, `page`, `per_page`.
- Categories API call: `GET /blog/categories`.
- Active category should be visible in category controls/sidebar.
- Result copy should show category-specific count when a valid category is selected.
- Invalid category should show a clear empty/invalid category state with CTA back to `/blog`.
- Empty category should show an empty state specific to selected category.
- Pagination must preserve `category_id` and normalize invalid page values.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-blog-by-category` and small shared blog helpers needed by this screen.
- Prefer existing blog list/sidebar/service/i18n patterns over a parallel architecture.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-blog-by-category`.
Read mandatory context, codegraph, `user_blog_by_category.md`, backend blog route/service/repository, and existing blog list/detail patterns.
Work: document purpose, query route, API params, response shape, current partial implementation, missing hardening, reusable patterns, backend/doc mismatches, risks, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-24__user-blog-by-category__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-blog-by-category`.
Inspect scripts, route conventions, public layout, i18n registry, feature folder conventions, and validation gates.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-24__user-blog-by-category__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-blog-by-category`.
Inspect `blog.service`, `BlogFilterParams`, backend `GET /blog`, `GET /blog/categories`, and category response shape.
Work: align category query params/types/service assumptions. Add small helper/types only if needed. Do not introduce unsupported params.
Output: `.agent/artifacts/api-contracts/2026-05-24__user-blog-by-category__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-blog-by-category`.
Target route: `/blog?category_id={id}`.
Work: keep existing `/blog` route, document route/query behavior, and align metadata/i18n/page shell if needed for category state.
Output: `.agent/artifacts/routing/2026-05-24__user-blog-by-category__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-blog-by-category`.
Work: harden active category UI, category-specific result count, empty/invalid category state, clear filters CTA, and responsive sidebar/category affordances.
Output: `.agent/artifacts/ui-specs/2026-05-24__user-blog-by-category__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-blog-by-category`.
Work: wire validated category id, category lookup from sidebar data, blog query, pagination preserving `category_id`, invalid id recovery, and category-specific featured post behavior.
Output: `.agent/artifacts/integration/2026-05-24__user-blog-by-category__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-blog-by-category`.
Work: complete category selection, reset, pagination, browser query updates, keyboard/accessibility states, and mobile behavior.
Output: `.agent/artifacts/interaction-specs/2026-05-24__user-blog-by-category__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-blog-by-category`.
Work: verify route is public, no protected endpoints are called, and category query state cannot leak protected data.
Output: `.agent/artifacts/auth/2026-05-24__user-blog-by-category__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-blog-by-category`.
Run relevant lint/typecheck/route/build checks and browser smoke tests where possible. Fix feature-caused failures.
Output: `.agent/artifacts/test-cases/2026-05-24__user-blog-by-category__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-blog-by-category`.
Perform final review, deploy readiness check, artifact closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-24__user-blog-by-category__deploy-report.md` and `.agent/artifacts/review/2026-05-24__user-blog-by-category__review.md`
```
