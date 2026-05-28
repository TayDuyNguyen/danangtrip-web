# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web task: `user-home-hardening`.

## Current Decision Snapshot

Date locked: `2026-05-27`

- Repo: `D:\DATN\danangtrip-web`
- Supporting repo: `D:\DATN\danangtrip-api`
- Document repo: `D:\DATN\DATN_Document`
- Selected screen/task: `Trang chu hardening`
- Feature slug: `user-home-hardening`
- Main route: `/`
- Target route file: `src/app/[locale]/(main)/page.tsx`
- Target feature folder: `src/features/home`
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_home.md`
- Primary APIs / data sources to verify:
  - Weather: current Open-Meteo based `weather.service.ts` / `use-weather`
  - Statistics: `statistics.service.ts`
  - Featured locations: `location.service.ts`, home location hooks
  - Tour categories / featured tours / hot tours: `tour.service.ts`, home tour hooks
  - Latest blog: `blog.service.ts`, home blog hook
- Status: selected after codegraph confirmed `user-profile` already has route/form/API code. No remaining web main screen is clearly missing route/page code; this is the highest-impact hardening/closeout task.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Progress report `0.0.14` uses the current codegraph-first rule: screens that already have route/page/component/service code are not selected as "missing code" work.
- Codegraph snapshot `2026-05-27 22:41:04`: web `files=363`, `nodes=3087`, `edges=6185`; API `files=461`, `nodes=4423`, `edges=6334`.
- Repo reality confirms previous candidates already have code:
  - `user-profile`: `/profile`, profile edit/avatar components/hooks/service.
  - `user-profile-delete`: `/profile/delete`.
  - `user-cart`: `/cart`.
  - `user-recommendations`: `/profile/recommendations`.
  - `user-my-ratings`: `/profile/ratings`.
  - `user-locations-by-category`: `/categories/[slug]/locations`.
  - `user-locations-nearby`: `/nearby`.
  - `user-tours-by-category`: `/tour-categories/[slug]/tours`.
  - `user_booking_invoice`: no standalone page by doc; invoice action exists in booking detail.
- `user-home` has route and rich code, but no dedicated deploy artifact found. It is the best next hardening target because it is the first public screen and has multiple data sources, image fallbacks, search/navigation behavior and responsive sections.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` and `D:\DATN\danangtrip-api\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Existing web framework: Next.js App Router + React 19 + TypeScript.
- Current home route:
  - `src/app/[locale]/(main)/page.tsx`
- Existing home modules to inspect and reuse:
  - `src/features/home/components/Hero.tsx`
  - `src/features/home/components/StatsBar.tsx`
  - `src/features/home/components/CategoryGrid.tsx`
  - `src/features/home/components/FeaturedLocations.tsx`
  - `src/features/home/components/TourCategories.tsx`
  - `src/features/home/components/FeaturedTours.tsx`
  - `src/features/home/components/HotTours.tsx`
  - `src/features/home/components/TravelBlog.tsx`
  - `src/features/home/hooks/use-locations.ts`
  - `src/features/home/hooks/use-tours.ts`
  - `src/features/home/hooks/use-blog.ts`
  - `src/features/home/hooks/use-statistics.ts`
  - `src/features/home/utils/home-image-fallbacks.ts`
  - `src/hooks/use-weather.ts`
  - `src/services/weather.service.ts`
  - `src/services/statistics.service.ts`
  - `src/services/location.service.ts`
  - `src/services/tour.service.ts`
  - `src/services/blog.service.ts`
- This task should not redesign the entire site. Keep edits focused to behavior gaps, stale docs/API assumptions, broken loading/error/empty states, image fallbacks, search/navigation issues and responsive defects on `/`.

## Goals

- Deliver a dedicated 10-step hardening/closeout for `user-home-hardening`.
- Verify the home page against `user_home.md` and repo/API reality.
- Harden hero search, weather display, stats, location categories, featured locations, tour categories, featured tours, hot tours and latest blog sections.
- Ensure API failures render professional fallbacks instead of blank or broken UI.
- Verify image fallbacks and links route to real pages.
- Verify desktop/mobile layout and no text overlap.
- Produce artifacts for every step and update memory after each step.
- Use docs root `D:\DATN\DATN_Document`.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant home, route/API review and public discovery artifacts
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
13. `D:\DATN\DATN_Document\docs\page\user_home.md`
14. Real repo sources listed in this prompt

If sources conflict, follow repo reality and record stale facts in the artifact.

## Memory Continuity Rules

- At the start of each step, update `.agent/memory/WORKING_STATE.md`.
- After each completed step, update `.agent/memory/WORKING_STATE.md` and append `.agent/memory/SESSION_LOG.md`.
- Update `.agent/memory/HANDOFF.md` if paused, blocked, waiting for approval, or incomplete.
- Do not claim a step is complete until the artifact and memory updates are complete.

## Coding Responsibility By Skill

| Skill | Execution mode | Code expectation |
| --- | --- | --- |
| `01-screen-analysis` | Analysis | Inventory home doc, code, API/data sources, stale facts and hardening risks. |
| `02-project-setup` | Audit/setup | Verify i18n namespaces, services/hooks, route shell, package scripts and artifact paths. |
| `03-types-api-contract` | Contract | Confirm statistics/weather/location/tour/blog request/response shapes and fallbacks. |
| `04-layout-routing` | Routing/layout | Verify `/` route, locale behavior, home section order, links and metadata needs. |
| `05-ui-components` | UI hardening | Fix section UI, loading/error/empty states, image fallbacks and responsive defects. |
| `06-data-integration` | Integration | Verify/wire data hooks, cache keys, API params, error mapping and fallback behavior. |
| `07-interactions` | Interaction | Verify hero search, category/tour links, carousel/scroll interactions, keyboard and mobile behavior. |
| `08-auth-permissions` | Review | Verify public route behavior, no auth-only leaks and correct handling of logged-in header state. |
| `09-testing` | Validation/fix loop | Run relevant checks and fix feature-caused failures. |
| `10-optimization-deploy` | Finalization | Final review, deploy readiness artifact, memory handoff and progress prompt recommendation. |

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
- Feature slug: `user-home-hardening`
- Screen name: `Trang chu hardening`
- Main route: `/`
- Route file: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\page.tsx`
- Feature folder: `D:\DATN\danangtrip-web\src\features\home`
- Feature type: public home page hardening/closeout.
- Do not switch to profile, cart, recommendations, locations category, tours category, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-profile` already has real route/form/API code, so it is not a missing-code next screen.
- Codegraph shows the other previously stale web backlog candidates also have route/page code or intentional action integration.
- `user_home.md` maps to `/`; route and components exist, but no dedicated deploy artifact was found.
- Home is high-impact and integrates weather, statistics, locations, tours, blog, search and navigation.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant home/public discovery/route review artifacts
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
13. `D:\DATN\DATN_Document\docs\page\user_home.md`

SCREEN AND API REFERENCES
- Page: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\page.tsx`
- Components/hooks: `D:\DATN\danangtrip-web\src\features\home`
- Weather: `D:\DATN\danangtrip-web\src\hooks\use-weather.ts`, `D:\DATN\danangtrip-web\src\services\weather.service.ts`
- Services: statistics, location, tour and blog services under `src/services`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`

CONTRACT DETAILS
- Verify actual services and API endpoints before changing code.
- Prefer existing home hooks and service patterns.
- Keep `/` public and locale-safe.
- Treat planned doc endpoints as stale unless repo/API reality confirms them.
- Make failure states explicit and polished; do not leave blank sections.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-home-hardening` except shared components/services required by the home route.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-home-hardening`.
Read mandatory context, codegraph, `user_home.md`, home route/components/hooks/services and backend route/API inventory.
Work: document purpose, route, API/data contract, existing code, stale doc facts, missing closeout evidence, risks and hardening plan.
Output: `.agent/artifacts/analysis/2026-05-27__user-home-hardening__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-home-hardening`.
Inspect home route conventions, i18n namespaces, service/hook conventions, asset fallback setup, artifact/memory paths and package scripts.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-27__user-home-hardening__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-home-hardening`.
Inspect statistics/weather/location/tour/blog service contracts, frontend types and backend route support.
Work: confirm or align request params, response types, cache keys, fallback data and error handling expectations.
Output: `.agent/artifacts/api-contracts/2026-05-27__user-home-hardening__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-home-hardening`.
Work: verify `/` route, locale behavior, section order, metadata, header/footer integration and all outbound links.
Output: `.agent/artifacts/routing/2026-05-27__user-home-hardening__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-home-hardening`.
Work: harden hero, stats, category grid, featured locations, tour categories, featured/hot tours, latest blog, loading/error/empty states and responsive layout.
Output: `.agent/artifacts/ui-specs/2026-05-27__user-home-hardening__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-home-hardening`.
Work: verify/wire weather, statistics, locations, tours and blog data hooks, API params, cache invalidation/refetch, fallback behavior and error handling.
Output: `.agent/artifacts/integration/2026-05-27__user-home-hardening__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-home-hardening`.
Work: verify hero search, category filters, CTA links, horizontal scroll controls, keyboard/accessibility and mobile interactions.
Output: `.agent/artifacts/interaction-specs/2026-05-27__user-home-hardening__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-home-hardening`.
Work: verify public route behavior, logged-in header state, no auth-only data leakage and no protected API misuse.
Output: `.agent/artifacts/auth/2026-05-27__user-home-hardening__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-home-hardening`.
Run relevant lint/typecheck/build/prepush checks and fix feature-caused failures.
Output: `.agent/artifacts/test-cases/2026-05-27__user-home-hardening__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-home-hardening`.
Perform final review, deploy readiness check, artifact closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-27__user-home-hardening__deploy-report.md` and `.agent/artifacts/review/2026-05-27__user-home-hardening__review.md`
```
