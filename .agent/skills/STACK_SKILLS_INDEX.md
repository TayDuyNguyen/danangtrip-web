# STACK SKILLS INDEX - DanangTrip Web

Master index for the 10 local skills in `.agent/skills/`.
Current selected web screen: `user-verify-email`.

## Current Decision Snapshot

Date locked: `2026-05-22`

- Repo: `D:\DATN\danangtrip-web`
- Selected screen: `Xac thuc Email`
- Feature slug: `user-verify-email`
- Route: `/verify-email`
- Target page: `src/app/[locale]/(auth)/verify-email/page.tsx` or nearest App Router reality
- Primary doc: `D:\DATN\DATN_Document\docs\page\user_verify_email.md`
- API: protected `POST /auth/verify-email` with body `{ otp: string }`
- Resend API: protected `POST /auth/resend-verification`
- Backend reality: both verify/resend routes are inside `jwt.auth`; this is an authenticated OTP flow, not a public token-link flow.
- Implementation status: Step 10 completed; source files, corrected artifacts, deploy report, review report, and memory handoff exist.
- Validation status: `npm.cmd run typecheck` PASS; `npm.cmd run lint` PASS; `npm.cmd run build` PASS; `npm.cmd run prepush:check` PASS on 2026-05-22.
- Cross-project order: this web feature is closed; select the next web feature independently from admin.

## Codegraph Findings

Read `D:\DATN\danangtrip-web\.codegraph\codegraph.db` before changing this feature, but do not treat it as fully current until it is rebuilt.

- Current `.codegraph` still indexes the older auth boundary but does not list the newly created `verify-email` route/component files. Repo reality overrides codegraph for this feature until codegraph is regenerated.
- `src/services/auth.service.ts` is the existing auth API service boundary and already imports `VerifyEmailRequest`.
- `src/types/auth.types.ts` defines `VerifyEmailRequest` as `{ otp: string }` after contract correction.
- `src/config/routes.ts` currently has `AUTH_ROUTES.LOGIN` and `AUTH_ROUTES.REGISTER`; add/verify `AUTH_ROUTES.VERIFY_EMAIL` if route constants are used.
- `src/features/auth/hooks/use-auth.ts` calls `authService` and `useAuthStore`; only extend it if verification needs shared auth state.
- Existing auth UI references: `src/features/auth/components/login-form.tsx`, `src/features/auth/components/register-form.tsx`.
- New repo reality to include after codegraph rebuild: `src/app/[locale]/(auth)/verify-email/page.tsx`, `src/features/auth/components/verify-email-form.tsx`, `src/features/auth/components/otp-input-group.tsx`, `src/messages/vi/verify-email.json`, `src/messages/en/verify-email.json`.

## Goals

- Stay aligned with the real `danangtrip-web` repository.
- Treat `.agent` memory/artifacts and repo reality as source of truth.
- Produce reusable artifacts for each step.
- Do not reuse old `user-profile-password` prompts for new work.
- Do not use legacy `DATN_T...` document paths; current docs root is `D:\DATN\DATN_Document`.

## Canonical Read Order

Before every skill step, read in this order:

1. `AGENTS.md`
2. `.agent/rules/PROJECT_RULES.md`
3. `.agent/rules/REPO_FACTS.md`
4. `.agent/memory/WORKING_STATE.md`
5. `.agent/memory/HANDOFF.md`
6. `.agent/memory/SESSION_LOG.md`
7. Latest relevant artifacts for `user-verify-email`
8. `.agent/skills/STACK_SKILLS_INDEX.md`
9. Current step `SKILL.md`
10. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
11. Real repo sources and docs listed in the prompt

If these sources conflict, follow the earlier item unless repo reality proves the earlier item stale; record stale facts in the artifact.

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
| `03-types-api-contract` | Contract/code foundation | Add/update types, endpoint constants, services, schemas, mappers if missing. |
| `04-layout-routing` | Routing/code scaffold | Add/update route files, metadata, route constants, i18n route keys if missing. |
| `05-ui-components` | Code-producing | Implement/update UI components immediately. |
| `06-data-integration` | Code-producing | Wire service calls, mutations, loading, success, error, empty states. |
| `07-interactions` | Code-producing | Implement OTP parsing/submission, retry, redirects, resend cooldown, toasts. |
| `08-auth-permissions` | Code-producing when guards are wrong | Verify authenticated OTP behavior for the email verification flow. |
| `09-testing` | Validation/fix loop | Run checks/tests and fix feature-caused failures. |
| `10-optimization-deploy` | Finalization/fix loop | Final review, deploy readiness artifacts, memory handoff. |

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
| Testing | Vitest v4 |
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
- Feature slug: `user-verify-email`
- Screen name: `Xac thuc Email`
- Main route: `/verify-email`
- Target page path: `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\verify-email\page.tsx` or nearest App Router reality.
- Feature type: authenticated account security screen for verifying user email through OTP.
- Do not switch to password, cart, bookings, profile hardening, or unrelated auth screens.

WHY THIS IS NEXT
- `user-profile-password` is already implemented in repo reality.
- Progress report lists `user-verify-email` as the next near account/security backlog item.
- Backend route exists for protected `POST /auth/verify-email` and requires authenticated user + `otp`.
- Codegraph shows `authService`, `VerifyEmailRequest`, auth route config, and auth UI patterns already exist.

MANDATORY READ ORDER BEFORE ANY WORK
1. `D:\DATN\danangtrip-web\AGENTS.md`
2. `D:\DATN\danangtrip-web\.agent\rules\PROJECT_RULES.md`
3. `D:\DATN\danangtrip-web\.agent\rules\REPO_FACTS.md`
4. `D:\DATN\danangtrip-web\.agent\memory\WORKING_STATE.md`
5. `D:\DATN\danangtrip-web\.agent\memory\HANDOFF.md`
6. `D:\DATN\danangtrip-web\.agent\memory\SESSION_LOG.md`
7. `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
8. Current step `SKILL.md`
9. `D:\DATN\danangtrip-web\.codegraph\codegraph.db`
10. Screen/API/repo references listed below

SCREEN AND API REFERENCES
- Progress report: `D:\DATN\DATN_Document\docs\project_delivery_progress_report.md`
- Primary screen doc: `D:\DATN\DATN_Document\docs\page\user_verify_email.md`
- Related docs: `D:\DATN\DATN_Document\docs\page\user_register.md`; `D:\DATN\DATN_Document\docs\page\user_login.md`; `D:\DATN\DATN_Document\docs\page\user_profile_password.md`
- User page list: `D:\DATN\DATN_Document\docs\reference\list_page_user.md`
- API list: `D:\DATN\DATN_Document\docs\api\api_list.md`
- Backend routes: `D:\DATN\danangtrip-api\routes\api.php`

REPO CONTEXT TO READ
- `D:\DATN\danangtrip-web\DESIGN.md`
- `D:\DATN\danangtrip-web\package.json`
- `D:\DATN\danangtrip-web\src\config\api.ts`
- `D:\DATN\danangtrip-web\src\config\routes.ts`
- `D:\DATN\danangtrip-web\src\services\auth.service.ts`
- `D:\DATN\danangtrip-web\src\types\auth.types.ts`
- `D:\DATN\danangtrip-web\src\features\auth\hooks\use-auth.ts`
- `D:\DATN\danangtrip-web\src\features\auth\components\login-form.tsx`
- `D:\DATN\danangtrip-web\src\features\auth\components\register-form.tsx`
- `D:\DATN\danangtrip-web\src\store\auth.store.ts`
- `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\login\page.tsx`
- `D:\DATN\danangtrip-web\src\app\[locale]\(auth)\register\page.tsx`
- `D:\DATN\danangtrip-web\src\messages\vi`
- `D:\DATN\danangtrip-web\src\messages\en`

CODEGRAPH FINDINGS TO HONOR
- `auth.service.ts` is the service boundary and already imports `VerifyEmailRequest`.
- `auth.types.ts` defines `VerifyEmailRequest`; verify real fields before UI work.
- `routes.ts` has `AUTH_ROUTES.LOGIN` and `AUTH_ROUTES.REGISTER`; add/verify `VERIFY_EMAIL` if route constants are used.
- Use `login-form.tsx` and `register-form.tsx` as auth UI/focus/i18n references.

REQUIRED API FLOW
- Verify email by authenticated OTP through real `POST /auth/verify-email` with body `{ otp: string }`.
- Backend request class requires field `otp`; do not send `{ code }` or `{ token }`.
- Resend uses protected `POST /auth/resend-verification`; it requires the same authenticated user context.
- `/verify-email` may render as an auth-page route, but API calls require an access token. If unauthenticated, show a clear sign-in/retry path instead of pretending token-link verification succeeded.
- Support loading, success, invalid/expired OTP, already verified, unauthorized/API error, and retry states.
- Preserve locale-aware navigation and auth-page layout conventions.

EXPECTED UX
- Minimal auth page with brand/header and centered verification card.
- Auto-submit only when URL has a real OTP-compatible param (`otp`; legacy `token` may be treated as OTP only for backward compatibility).
- Manual OTP/resend mode is the canonical backend-supported flow.
- Success state redirects or links to home/login/profile according to repo auth flow.
- Error state explains invalid/expired token and offers retry/navigation.
- All user-facing text is localized in `vi` and `en`.

PIPELINE ORDER
1. `01-screen-analysis`
2. `02-project-setup` if required by repo rules or stale audit
3. `03-types-api-contract`
4. `04-layout-routing`
5. `05-ui-components`
6. `06-data-integration`
7. `07-interactions`
8. `08-auth-permissions`
9. `09-testing`
10. `10-optimization-deploy`

ARTIFACT TARGETS
- Analysis: `.agent/artifacts/analysis/YYYY-MM-DD__user-verify-email__screen-analysis.md`
- Project audit: `.agent/artifacts/setup/YYYY-MM-DD__user-verify-email__project-setup-report.md`
- API contract: `.agent/artifacts/api-contracts/YYYY-MM-DD__user-verify-email__api-contract.md`
- Routing: `.agent/artifacts/routing/YYYY-MM-DD__user-verify-email__route-plan.md`
- UI spec: `.agent/artifacts/ui-specs/YYYY-MM-DD__user-verify-email__ui-spec.md`
- Data integration: `.agent/artifacts/integration/YYYY-MM-DD__user-verify-email__data-integration.md`
- Interaction spec: `.agent/artifacts/interaction-specs/YYYY-MM-DD__user-verify-email__interaction-spec.md`
- Auth review: `.agent/artifacts/auth/YYYY-MM-DD__user-verify-email__auth-permissions-review.md`
- Test report: `.agent/artifacts/test-cases/YYYY-MM-DD__user-verify-email__test-report.md`
- Deploy report: `.agent/artifacts/deploy/YYYY-MM-DD__user-verify-email__deploy-report.md`
- Final review: `.agent/artifacts/review/YYYY-MM-DD__user-verify-email__review.md`

VALIDATION COMMANDS
- `npm.cmd run lint` on PowerShell, or `npm run lint` in shells where npm scripts are allowed
- `npm.cmd run typecheck` on PowerShell, or `npm run typecheck` in shells where npm scripts are allowed
- `npm run build`
- `npm run prepush:check` if available and feasible

BEGIN NOW
Start by refreshing artifacts/memory for the corrected authenticated OTP contract. Current source passes lint/typecheck, but `.codegraph` is stale for the newly added verify-email files and should be regenerated before using it as final review evidence.
```

## Step Prompts - user-verify-email

### Step 01

```text
Activate `01-screen-analysis` for `user-verify-email`.
Repo: `D:\DATN\danangtrip-web`
Read canonical order plus `.agent/skills/01-screen-analysis/SKILL.md`.
Inputs: progress report, `user_verify_email.md`, related login/register/password docs, API list, backend routes, codegraph findings.
Work: analyze authenticated OTP/resend flow, states, route/layout, i18n, API mismatches. Do not edit product code.
Output: `.agent/artifacts/analysis/YYYY-MM-DD__user-verify-email__screen-analysis.md`
```

### Step 02

```text
Activate `02-project-setup` for `user-verify-email`.
Repo: `D:\DATN\danangtrip-web`
Inspect: `package.json`, `next.config.ts`, `vitest.config.ts`, route check scripts, auth route layout, i18n setup.
Work: audit setup/runtime readiness; fix only setup blockers.
Output: `.agent/artifacts/setup/YYYY-MM-DD__user-verify-email__project-setup-report.md`
```

### Step 03

```text
Activate `03-types-api-contract` for `user-verify-email`.
Inspect: `src/config/api.ts`, `src/services/auth.service.ts`, `src/types/auth.types.ts`, backend `routes/api.php`.
Work: verify `VerifyEmailRequest` uses `{ otp: string }`, `authService.verifyEmail`, `API_ENDPOINTS.AUTH.VERIFY_EMAIL`, protected resend endpoint, response/error shape; update code if missing/wrong.
Output: `.agent/artifacts/api-contracts/YYYY-MM-DD__user-verify-email__api-contract.md`
```

### Step 04

```text
Activate `04-layout-routing` for `user-verify-email`.
Target route: `/verify-email`
Target page: `src/app/[locale]/(auth)/verify-email/page.tsx`
Inspect: `src/config/routes.ts`, auth route pages/layouts, i18n navigation.
Work: add/verify page, metadata, `AUTH_ROUTES.VERIFY_EMAIL` if needed, locale behavior.
Output: `.agent/artifacts/routing/YYYY-MM-DD__user-verify-email__route-plan.md`
```

### Step 05

```text
Activate `05-ui-components` for `user-verify-email`.
References: `DESIGN.md`, `login-form.tsx`, `register-form.tsx`, `user_verify_email.md`.
Work: implement/polish verification card, loading, success, failure, already verified, retry, authenticated OTP/resend states.
Output: `.agent/artifacts/ui-specs/YYYY-MM-DD__user-verify-email__ui-spec.md`
```

### Step 06

```text
Activate `06-data-integration` for `user-verify-email`.
Inspect: `auth.service.ts`, `auth.types.ts`, page/container code.
Work: wire verify mutation/service call with `{ otp }`, URL OTP param parsing, API error mapping, loading/success/error states.
Output: `.agent/artifacts/integration/YYYY-MM-DD__user-verify-email__data-integration.md`
```

### Step 07

```text
Activate `07-interactions` for `user-verify-email`.
Work: implement retry, redirect countdown, navigation buttons, OTP auto-submit/resend countdown, toasts/messages, disabled states.
Output: `.agent/artifacts/interaction-specs/YYYY-MM-DD__user-verify-email__interaction-spec.md`
```

### Step 08

```text
Activate `08-auth-permissions` for `user-verify-email`.
Work: verify `/verify-email` page routing and authenticated API behavior. Backend requires `jwt.auth`, so document/signpost unauthenticated 401 behavior and fix guards only if repo policy requires it.
Output: `.agent/artifacts/auth/YYYY-MM-DD__user-verify-email__auth-permissions-review.md`
```

### Step 09

```text
Activate `09-testing` for `user-verify-email`.
Run as feasible: `npm run lint`, `npm run typecheck`, `npm run build`, focused tests if available, `npm run prepush:check`.
Work: fix feature-caused failures and document skipped commands.
Output: `.agent/artifacts/test-cases/YYYY-MM-DD__user-verify-email__test-report.md`
```

### Step 10

```text
Activate `10-optimization-deploy` for `user-verify-email`.
Work: final review, deploy readiness, validation evidence, update memory/session/handoff.
Outputs: `.agent/artifacts/deploy/YYYY-MM-DD__user-verify-email__deploy-report.md`; `.agent/artifacts/review/YYYY-MM-DD__user-verify-email__review.md`
```

## Files Commonly Read Before Most Tasks

- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- `package.json`
- `src/config/api.ts`
- `src/config/routes.ts`
- `src/services/auth.service.ts`
- `src/types/auth.types.ts`
- `src/features/auth/hooks/use-auth.ts`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/register-form.tsx`
