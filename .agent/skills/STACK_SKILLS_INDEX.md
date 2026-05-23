# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-my-ratings`.

## Current Decision Snapshot

Date locked: `2026-05-23`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Danh gia cua toi`
- Feature slug: `user-my-ratings`
- Main route: `/profile/ratings`
- Target page path: `src/app/[locale]/(main)/(protected)/profile/ratings/page.tsx`
- Target feature folder: `src/features/profile/ratings`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_my_ratings.md`
- Primary API: `GET /user/ratings?page=1&per_page=10`
- Supporting APIs: `PUT /ratings/{id}`, `DELETE /ratings/{id}`, optional `POST /upload/images`
- Status: selected next screen after `user-recommendations` Step 10 completion.
- Implementation reality: `user-recommendations` is implemented and validated with deploy/review artifacts. `/profile/ratings` has API constants/service support but no App Router page or dedicated UI components yet.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Current selection rule: only choose screens that do not yet have route/page/component code in the web repo.
- Codegraph/repo contains `src/app/[locale]/(main)/(protected)/recommendations/page.tsx` and `src/features/recommendations`; do not rebuild recommendations.
- Codegraph/repo has no `profile/ratings` route/page.
- `user_my_ratings.md` is a protected account screen linked from `user_profile.md`.
- Backend/API inventory exposes `GET /user/ratings`, `PUT /ratings/{id}`, and `DELETE /ratings/{id}`.
- Existing repo already has `API_ENDPOINTS.USER.RATINGS`, `API_ENDPOINTS.RATINGS.UPDATE`, `API_ENDPOINTS.RATINGS.DELETE`, `ratingService.update`, `ratingService.delete`, and `profileService.ratings`.
- This screen closes a visible profile navigation gap and reuses existing rating/card/modal patterns.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Codegraph confirms recommendations files exist; treat `user-recommendations` as completed/hardening-only.
- Codegraph has no file path matching `profile/ratings`.
- Existing protected profile shell exists under `src/app/[locale]/(main)/(protected)/profile`.
- Existing profile navigation lives in `src/features/profile/components/ProfileSidebar.tsx` and `ProfileMobileNav.tsx`.
- Existing rating logic/patterns live in `src/services/rating.service.ts`, `src/services/profile.service.ts`, `src/types/location-rating.types.ts`, `src/features/locations/components/detail/LocationReviews.tsx`, `WriteReviewModal.tsx`, and `src/features/tour/components/ReviewSection.tsx`.
- `src/config/api.ts` already exposes the required ratings endpoints; Step 03 should align types/hooks rather than duplicate endpoints.
- `src/config/routes.ts` does not yet expose `/profile/ratings` under `PROTECTED_ROUTES`.

## Goals

- Deliver the missing `/profile/ratings` protected account screen through the 10-step pipeline.
- Display all user-authored ratings with tabs/filters for all, location, tour, and status if backend supports it.
- Support pagination, loading, empty, error, retry, edit, delete, and image preview states.
- Reuse existing profile layout/sidebar and existing rating service contracts.
- Keep edit/delete actions owner-safe and authenticated-only.
- Do not implement unrelated screens: nearby, category pages, cart, profile delete, admin screens, or recommendation hardening.
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
7. Latest relevant `user-my-ratings` artifacts if any
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
| `03-types-api-contract` | Contract/code foundation | Align user ratings params/response types, profile/rating service methods, query keys, hooks, and mapper. |
| `04-layout-routing` | Routing/code scaffold | Add protected route page, route constant, profile sidebar/mobile nav active item if missing, metadata and i18n namespace. |
| `05-ui-components` | Code-producing | Implement header, tabs, rating cards, status badges, edit modal, delete dialog, image thumbnails/lightbox entry, skeleton, empty/error states. |
| `06-data-integration` | Code-producing | Wire user ratings query, filter/pagination params, update/delete mutations, invalidation and optimistic-safe UI states. |
| `07-interactions` | Code-producing | Implement tab switching, pagination, entity navigation, edit/save, delete confirm, retry, toasts, disabled/loading/focus behavior. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify protected route, authenticated API header, owner-only mutation assumptions, 401/403 behavior and callback redirect. |
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
- Feature slug: `user-my-ratings`
- Screen name: `Danh gia cua toi`
- Main route: `/profile/ratings`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(protected)\profile\ratings\page.tsx`
- Target feature folder: `D:\DATN\danangtrip-web\src\features\profile\ratings`
- Feature type: protected profile ratings management page.
- Do not switch to recommendations, nearby, category pages, cart, profile delete, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-recommendations` completed Step 10 and exists in repo.
- `/profile/ratings` has no route/page/component code.
- Backend and frontend endpoint constants already exist for user ratings, update, and delete.
- Screen doc exists: `D:\DATN\DATN_Document\docs\page\user_my_ratings.md`.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant `user-my-ratings` artifacts if any
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_my_ratings.md`
- Related docs: `user_profile.md`, `user_rating_edit_modal.md`, `user_rating_delete.md`, `user_rating_images_lightbox.md`, `user_locations_list.md`, `user_tours_list.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`
- Backend rating service/controller/request files under `D:\DATN\danangtrip-api\app`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\middleware.ts`
- `D:\DATN\danangtrip-web\src\services\profile.service.ts`
- `D:\DATN\danangtrip-web\src\services\rating.service.ts`
- `D:\DATN\danangtrip-web\src\types\location-rating.types.ts`
- `D:\DATN\danangtrip-web\src\features\profile\components`
- `D:\DATN\danangtrip-web\src\features\locations\components\detail\LocationReviews.tsx`
- `D:\DATN\danangtrip-web\src\features\locations\components\detail\WriteReviewModal.tsx`
- `D:\DATN\danangtrip-web\src\features\tour\components\ReviewSection.tsx`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

CONTRACT DETAILS
- `GET /user/ratings?page=1&per_page=10` loads the current user's ratings.
- Docs mention `type=location|tour`; verify backend support before sending this param. If unsupported, filter client-side or document the gap.
- `PUT /ratings/{id}` updates the current user's rating. Use existing `ratingService.update`.
- `DELETE /ratings/{id}` deletes the current user's rating. Use existing `ratingService.delete`.
- Image upload in edit modal is optional; only wire it if existing upload contract is safe and already supported.
- Cards must navigate to `/locations/{slug}` or `/tours/{slug}` when target slugs exist.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-my-ratings` and small shared rating/profile helpers needed by the screen.
- Prefer existing profile/rating patterns over a parallel architecture.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-my-ratings`.
Read mandatory context, codegraph, `user_my_ratings.md`, backend rating/profile contracts, and existing rating/profile UI patterns.
Work: document purpose, protected route, API params, response shape, missing files, reusable patterns, backend/doc mismatches, risks, and implementation plan.
Output: `.agent/artifacts/analysis/2026-05-23__user-my-ratings__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-my-ratings`.
Inspect scripts, route conventions, protected profile layout, i18n registry, feature folder conventions, and validation gates.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-23__user-my-ratings__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-my-ratings`.
Inspect `api.ts`, `profile.service.ts`, `rating.service.ts`, rating types, upload contract, backend rating request/service.
Work: align endpoint/types/service/hook/mapper needed for `GET /user/ratings`, `PUT /ratings/{id}`, and `DELETE /ratings/{id}`; document params, response, auth and error behavior.
Output: `.agent/artifacts/api-contracts/2026-05-23__user-my-ratings__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-my-ratings`.
Target route: `/profile/ratings`.
Work: add route constant, protected App Router page under profile, metadata, i18n namespace registration, and profile sidebar/mobile nav active item if missing.
Output: `.agent/artifacts/routing/2026-05-23__user-my-ratings__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-my-ratings`.
Work: implement page header, filter tabs, rating cards, status badges, edit modal, delete dialog, image thumbnails/lightbox entry, skeletons, empty state, error state, and responsive profile layout.
Output: `.agent/artifacts/ui-specs/2026-05-23__user-my-ratings__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-my-ratings`.
Work: wire user ratings query, pagination/filter state, update/delete mutations, cache invalidation, loading/error/empty/retry states, and optional image upload only if contract-safe.
Output: `.agent/artifacts/integration/2026-05-23__user-my-ratings__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-my-ratings`.
Work: implement tab switching, pagination, card navigation, edit/save, delete confirmation, retry, toasts, disabled states, keyboard/focus and responsive interaction details.
Output: `.agent/artifacts/interaction-specs/2026-05-23__user-my-ratings__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-my-ratings`.
Work: verify protected access, unauthenticated redirect to login with callback, authenticated API header behavior, owner-only update/delete assumptions, 401/403 handling, and no public data leakage.
Output: `.agent/artifacts/auth/2026-05-23__user-my-ratings__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-my-ratings`.
Run as feasible: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run build`, route checks, focused tests if available, and `npm.cmd run prepush:check`.
Work: fix feature-caused failures and document pass/fail/skipped commands.
Output: `.agent/artifacts/test-cases/2026-05-23__user-my-ratings__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-my-ratings`.
Inputs: artifacts 01-09, validation output, final git diff.
Work: final review for route/API/i18n/UI/interactions/auth/tests, run or cite final validation, create deploy report and review, update memory files.
Outputs: `.agent/artifacts/deploy/2026-05-23__user-my-ratings__deploy-report.md`; `.agent/artifacts/review/2026-05-23__user-my-ratings__review.md`
```
