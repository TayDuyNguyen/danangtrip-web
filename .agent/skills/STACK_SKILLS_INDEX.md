# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web task: `user-search-hardening`.

## Current Decision Snapshot

Date locked: `2026-05-29`

- Repo: `D:\DATN\danangtrip-web`
- Supporting repo: `D:\DATN\danangtrip-api`
- Document repo: `D:\DATN\DATN_Tài liệu`
- Selected screen/task: `Tim kiem hardening`
- Feature slug: `user-search-hardening`
- Main route: `/search`
- Target route file: `src/app/[locale]/(main)/(public)/search/page.tsx`
- Target feature folder: `src/features/search`
- Primary doc: `D:\DATN\DATN_Tài liệu\docs\page\user_search.md`
- Primary APIs / data sources to verify:
  - Search results query via search service / API wiring already used by `SearchResultsClient`
  - Filter state, query-string sync, pagination and result mapping
  - Card/image fallback behavior for mixed result entities
- Status: selected after progress report `0.0.17` confirmed web still has `0` missing route/page screens, while `/search` still lacks a dedicated hardening closeout artifact.
- Cross-project rule: this web prompt is independent from admin; do not use admin progress to decide web steps.

## Why This Is Next

- Progress report `0.0.17` promotes `user-search-hardening` as the next web item after `user-home-hardening`.
- Repo reality confirms the route exists:
  - `src/app/[locale]/(main)/(public)/search/page.tsx`
  - `src/features/search/components/SearchResultsClient.tsx`
  - `src/features/search/components/SearchFiltersSheet.tsx`
  - `src/features/search/components/SearchResultCard.tsx`
  - `src/features/search/components/SearchGrid.tsx`
- This is now the highest-value web hardening candidate because:
  - it is public-facing and high-traffic,
  - it already has code that can be audited and polished,
  - web no longer has any documented main screen missing route/page code,
  - it does not yet have a dedicated Step 10 closeout artifact,
  - recent hardening already touched search filter clarity for `type=all`, so the remaining work is still naturally centered on `/search`.

## Codegraph / Repo Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` and `D:\DATN\danangtrip-api\.codegraph\codegraph.db` before changing this feature, then verify against repo reality.

- Existing web framework: Next.js App Router + React 19 + TypeScript.
- Current search route:
  - `src/app/[locale]/(main)/(public)/search/page.tsx`
- Existing search modules to inspect and reuse:
  - `src/features/search/components/SearchResultsClient.tsx`
  - `src/features/search/components/SearchFiltersSheet.tsx`
  - `src/features/search/components/SearchResultCard.tsx`
  - `src/features/search/components/SearchGrid.tsx`
  - search hooks/services/utilities discovered by Step 01 in `src/features/search`, `src/services`, and query mapping helpers
- Recent repo reality already confirms:
  - all-mode filter wording has been clarified,
  - `Danh mục địa điểm` / `Danh mục tour` behavior is now explicit,
  - `/search` still needs dedicated closeout artifacts rather than first-pass implementation.
- This task should not redesign unrelated pages. Keep edits focused to behavior gaps, query/filter synchronization, loading/error/empty states, result cards, pagination, image fallback handling, and responsive/mobile filtering behavior on `/search`.

## Goals

- Deliver a dedicated 10-step hardening/closeout for `user-search-hardening`.
- Verify the search page against `user_search.md` and repo/API reality.
- Harden search result fetching, filters, cards, empty/error/loading states, and route/query-state behavior.
- Ensure API failures render professional fallbacks instead of blank or broken UI.
- Verify desktop/mobile layout and no text overlap.
- Produce artifacts for every step and update memory after each step.
- Use docs root `D:\DATN\DATN_Tài liệu`.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant search/home/public discovery artifacts
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Tài liệu\docs\project_delivery_progress_report.md`
13. `D:\DATN\DATN_Tài liệu\docs\page\user_search.md`
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
- Feature slug: `user-search-hardening`
- Screen name: `Tim kiem hardening`
- Main route: `/search`
- Route file: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\search\page.tsx`
- Feature folder: `D:\DATN\danangtrip-web\src\features\search`
- Feature type: public search page hardening/closeout.
- Do not switch to profile, home, cart, admin, or backend-only tasks.

WHY THIS IS NEXT
- `user-home-hardening` already has a dedicated Step 10 artifact.
- Progress report `0.0.17` selects `user-search-hardening` as the next web screen.
- Codegraph/repo reality confirms `/search` has real route/page/component code.
- Web currently has `0` documented main screens missing route/page code.
- Search is a high-impact public screen and still lacks dedicated closeout artifacts.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. Latest relevant search/home/public discovery artifacts
8. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. `D:\DATN\danangtrip-api\.codegraph\codegraph.db`
12. `D:\DATN\DATN_Tài liệu\docs\project_delivery_progress_report.md`
13. `D:\DATN\DATN_Tài liệu\docs\page\user_search.md`

SCREEN AND API REFERENCES
- Page: `D:\DATN\danangtrip-web\src\app\[locale]\(main)\(public)\search\page.tsx`
- Components/hooks: `D:\DATN\danangtrip-web\src\features\search`
- Services/types: inspect `src/services`, `src/types`, `src/features/search`, and any search-specific query helpers
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`

CONTRACT DETAILS
- Verify actual services and API endpoints before changing code.
- Prefer existing search hooks and query-state patterns.
- Keep `/search` public and locale-safe.
- Make failure states explicit and polished; do not leave blank sections.

EXECUTION RULES
- Follow the 10-step pipeline strictly.
- Do not mark a step complete without artifact and memory updates.
- Keep all edits scoped to `user-search-hardening` except shared components/services required by the search route.
- Run validation in Step 09 and Step 10 as allowed by the environment.
```

## Step-by-step Prompts

### Step 01

```text
Activate `01-screen-analysis` for `user-search-hardening`.
Read mandatory context, codegraph, `user_search.md`, search route/components/hooks/services and backend route/API inventory.
Work: document purpose, route, API/data contract, existing code, stale doc facts, missing closeout evidence, risks and hardening plan.
Output: `.agent/artifacts/analysis/2026-05-29__user-search-hardening__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-search-hardening`.
Inspect search route conventions, i18n namespaces, service/hook conventions, artifact/memory paths and package scripts.
Work: verify setup readiness and note blocking config/script issues only.
Output: `.agent/artifacts/setup/2026-05-29__user-search-hardening__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-search-hardening`.
Inspect search service contracts, frontend types and backend route support.
Work: confirm or align request params, response types, pagination, filter params and error handling expectations.
Output: `.agent/artifacts/api-contracts/2026-05-29__user-search-hardening__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-search-hardening`.
Work: verify `/search` route, locale behavior, metadata, query parsing and all outbound links.
Output: `.agent/artifacts/routing/2026-05-29__user-search-hardening__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-search-hardening`.
Work: harden search header, filter sheet, result cards, loading/error/empty states and responsive layout.
Output: `.agent/artifacts/ui-specs/2026-05-29__user-search-hardening__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-search-hardening`.
Work: verify/wire search query hooks, API params, cache keys, pagination, fallback behavior and error handling.
Output: `.agent/artifacts/integration/2026-05-29__user-search-hardening__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-search-hardening`.
Work: verify filter interactions, query sync, pagination, keyboard/accessibility and mobile interactions.
Output: `.agent/artifacts/interaction-specs/2026-05-29__user-search-hardening__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-search-hardening`.
Work: verify public route behavior, no auth-only leakage and no protected API misuse.
Output: `.agent/artifacts/auth/2026-05-29__user-search-hardening__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-search-hardening`.
Run relevant lint/typecheck/build/prepush checks and fix feature-caused failures.
Output: `.agent/artifacts/test-cases/2026-05-29__user-search-hardening__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-search-hardening`.
Perform final review, deploy readiness check, artifact closeout, memory handoff and prompt/progress update recommendation.
Output: `.agent/artifacts/deploy/2026-05-29__user-search-hardening__deploy-report.md` and `.agent/artifacts/review/2026-05-29__user-search-hardening__review.md`
```
