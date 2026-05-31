# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web task: `user-blog-list-hardening`.

## Current Decision Snapshot

Date locked: `2026-05-30`

- Repo: `D:\DATN\danangtrip-web`
- Supporting repo: `D:\DATN\danangtrip-api`
- Document repo: `D:\DATN\DATN_Document`
- Selected screen/task: `Blog list hardening`
- Feature slug: `user-blog-list-hardening`
- Main route: `/blog`
- Target route file: `src/app/[locale]/(main)/(public)/blog/page.tsx`
- Target feature folder: `src/features/blog` (if exists) or components under blog page
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_blog_list.md`
- Primary APIs / data sources to verify:
  - `GET /blog` (list with pagination + category filter)
  - `GET /blog/categories` (sidebar + category tabs)
- Status: selected after `user-search-hardening` completed with full deploy closeout on `2026-05-29`.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.
- Previous completed: `user-search-hardening` → deploy report `2026-05-29__user-search-hardening__deploy-report.md`.

## Why This Is Next

- `user-search-hardening` was completed on `2026-05-29` with full deploy/closeout artifact and prepush PASS.
- `/blog` is the next highest-value public web screen:
  - It has real route/page code at `src/app/[locale]/(main)/(public)/blog/page.tsx`.
  - It does not yet have a dedicated Step 10 closeout artifact.
  - Blog is a high-traffic public-facing screen with featured posts, category filters, pagination, popular posts sidebar, and tag cloud.
  - `user_blog_list.md` provides a detailed spec for this screen.
- Web still has `0` documented main screens missing route/page code; remaining work is hardening and closeout.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` and `D:\DATN\danangtrip-api\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Existing web framework: Next.js App Router + React 19 + TypeScript.
- Current blog list route:
  - `src/app/[locale]/(main)/(public)/blog/page.tsx`
- Existing blog modules to inspect and reuse:
  - `src/features/blog/` or `src/app/[locale]/(main)/(public)/blog/` components
  - Blog hooks/services/utilities discovered by Step 01
  - `src/features/blog/components/BlogContent.tsx`, `BlogSidebar.tsx`, `BlogSkeleton.tsx` (from session log)
- This task should harden the existing `/blog` page; do not redesign unrelated pages.

## Goals

- Deliver a dedicated 10-step hardening/closeout for `user-blog-list-hardening`.
- Verify the blog list page against `user_blog_list.md` and repo/API reality.
- Harden category tabs, featured post, post grid, pagination, sidebar (popular posts, categories, tags).
- Ensure API failures render professional fallbacks.
- Verify desktop/mobile layout, loading/empty/error states.
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
7. Latest relevant blog/public discovery artifacts
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
13. `D:\DATN\DATN_Document\docs\page\user_blog_list.md`
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
| `01-screen-analysis` | Analysis | Inventory search doc, code, API/data sources, stale facts and hardening risks. |
| `02-project-setup` | Audit/setup | Verify i18n namespaces, services/hooks, route shell, package scripts and artifact paths. |
| `03-types-api-contract` | Contract | Confirm search request/response shapes, filter params, result typing and fallback strategy. |
| `04-layout-routing` | Routing/layout | Verify `/search` route, locale behavior, metadata, query parsing and navigation links. |
| `05-ui-components` | UI hardening | Fix search header, filters, cards, loading/error/empty states and responsive defects. |
| `06-data-integration` | Integration | Verify/wire search query hooks, API params, cache keys, pagination and error mapping. |
| `07-interactions` | Interaction | Verify filter sheet behavior, query sync, pagination, keyboard/accessibility and mobile interactions. |
| `08-auth-permissions` | Review | Verify public route behavior, no auth-only leakage and correct behavior for logged-in header state. |
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
- Feature slug: `user-blog-list-hardening`
- Screen name: `Blog list hardening`
- Main route: `/blog`
- Route file: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\blog\page.tsx`
- Feature folder: `D:\DATN\danangtrip-web\src\features\blog` (verify or adapt to actual structure)
- Feature type: public blog list page hardening/closeout.
- Do not switch to profile, search, home, cart, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-search-hardening` completed on `2026-05-29` with deploy/closeout artifact.
- `/blog` has real route/page code but no dedicated Step 10 closeout artifact.
- Blog is a high-traffic public screen with featured post, category tabs, grid, pagination, sidebar.
- Web has `0` documented main screens missing route/page code.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant blog/public discovery artifacts
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
13. `D:\DATN\DATN_Document\docs\page\user_blog_list.md`

SCREEN AND API REFERENCES
- Page: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\blog\page.tsx`
- Components/hooks: inspect `src/features/blog`, `src/app/[locale]/(main)/(public)/blog/`
- Services/types: inspect `src/services`, `src/types`, and any blog-specific query helpers
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`

CONTRACT DETAILS
- Verify actual services and API endpoints before changing code.
- APIs: `GET /blog`, `GET /blog/categories`
- Keep `/blog` public and locale-safe.
- Make failure states explicit and polished; do not leave blank sections.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-blog-list-hardening` except shared components/services.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-blog-list-hardening`.
Read mandatory context, codegraph, `user_blog_list.md`, blog route/components/hooks/services and backend route/API inventory.
Work: document purpose, route, API/data contract, existing code, stale doc facts, missing closeout evidence, risks and hardening plan.
Output: `.agent/artifacts/analysis/2026-05-30__user-blog-list-hardening__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-blog-list-hardening`.
Inspect blog route conventions, i18n namespaces, service/hook conventions, artifact/memory paths and package scripts.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-30__user-blog-list-hardening__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-blog-list-hardening`.
Inspect blog service contracts, frontend types and backend route support.
Work: confirm or align request params (page, per_page, category_id), response types, pagination, and error handling expectations.
Output: `.agent/artifacts/api-contracts/2026-05-30__user-blog-list-hardening__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-blog-list-hardening`.
Work: verify `/blog` route, locale behavior, metadata, query parsing and all outbound links.
Output: `.agent/artifacts/routing/2026-05-30__user-blog-list-hardening__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-blog-list-hardening`.
Work: harden page hero, category tabs, featured post, blog grid, pagination, sidebar (categories, popular posts, tags cloud), loading/error/empty states.
Output: `.agent/artifacts/ui-specs/2026-05-30__user-blog-list-hardening__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-blog-list-hardening`.
Work: verify/wire blog query hooks, API params (page, category_id), cache keys, pagination, fallback behavior and error handling.
Output: `.agent/artifacts/integration/2026-05-30__user-blog-list-hardening__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-blog-list-hardening`.
Work: verify category tab interactions, query sync, pagination, keyboard/accessibility and mobile interactions.
Output: `.agent/artifacts/interaction-specs/2026-05-30__user-blog-list-hardening__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-blog-list-hardening`.
Work: verify public route behavior, no auth-only leakage and correct behavior for logged-in header state.
Output: `.agent/artifacts/auth/2026-05-30__user-blog-list-hardening__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-blog-list-hardening`.
Run relevant lint/typecheck/build or prepush checks and fix feature-caused failures.
Output: `.agent/artifacts/test-cases/2026-05-30__user-blog-list-hardening__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-blog-list-hardening`.
Perform final review, deploy readiness check, artifact closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-30__user-blog-list-hardening__deploy-report.md` and `.agent/artifacts/review/2026-05-30__user-blog-list-hardening__review.md`
```
