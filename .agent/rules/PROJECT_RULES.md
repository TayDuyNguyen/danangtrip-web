---
description: "Project rules and architecture guide for DanangTrip Web (Next.js) — mandatory reference before code generation."
---

# DanangTrip Web — Project Rules & Architecture

This document is the primary operating guide for AI when working in this repository. Use it with `AGENTS.md` and `.agent/rules/GEMINI.md`.

---

## 1) Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript strict |
| Styling | Tailwind CSS 4 |
| i18n | `next-intl` (locale prefix `as-needed`) |
| Server State | `@tanstack/react-query` |
| Client State | `zustand` (+ persist middleware) |
| HTTP Client | `axios` with interceptors |
| Notifications | `sonner` |
| Validation | Custom validators + optional schema-based validation |

---

## 2) Repository Structure

```
src/
├── app/                  # App Router pages/layouts by locale
├── components/           # Shared UI/layout/common components
├── features/             # Feature modules (auth, home, ...)
├── services/             # API service wrappers
├── lib/                  # axios instance, firebase, shared libs
├── store/                # Global zustand stores
├── hooks/                # Reusable hooks
├── i18n/                 # next-intl routing/navigation/request config
├── messages/             # Locale dictionaries (vi, en)
├── config/               # env, routes, api endpoints
├── types/                # Shared TypeScript types
└── utils/                # Utilities and helpers
```

---

## 3) Decision Gate (Think Before Code)

Apply this process for non-trivial requests:

1. Impact scan: identify touched layers (`app` / `features` / `services` / `store` / `i18n`).
2. Clarify only when needed: ask focused questions on auth flow, locale behavior, API contract, or UX states.
3. Confirm before high-impact refactors (auth architecture, route strategy, i18n structure).

For small, clear requests, proceed directly after a quick impact scan.

---

## 4) Target Data Flow

Use this architecture for all new code and touched modules:

1. UI/Page (`src/app`, `src/components`, `src/features/*/components`)
2. Hook (`src/hooks` or `src/features/*/hooks`) for async/control logic
3. Service (`src/services`) for API operations
4. Axios client (`src/lib/axios.ts`) for auth headers, refresh, global error handling

Rules:
- Prefer calling hooks/services from UI; avoid ad-hoc API logic inside components.
- Keep services thin; move business branching to hooks or feature layer.

---

## 5) Next.js App Router Rules

1. Follow App Router conventions (`layout.tsx`, `page.tsx`, route groups).
2. Respect server/client boundaries:
   - Add `"use client"` only when required (state/effects/browser APIs).
   - Keep server components pure where possible.
3. Use `@/i18n/navigation` for locale-aware navigation in app UI.
4. Keep metadata in layout/page where appropriate, not scattered in components.

---

## 6) i18n Rules (Mandatory)

1. No hardcoded user-facing text in reusable UI; use translation keys.
2. Keep `src/messages/vi` and `src/messages/en` synchronized.
3. Namespace by feature (`common`, `home`, `login`, `register`, ...).
4. When adding/removing keys, update both locales in the same task.

---

## 7) Auth & Security Rules

1. Single source of truth for auth store (no duplicated auth stores).
2. Keep auth strategy consistent across:
   - middleware/proxy checks
   - client storage strategy
   - axios refresh/logout behavior
3. Never expose secrets in source code or commits.
4. Do not commit `.env*` with real credentials; update `.env.example` when adding new env vars.

---

## 8) TypeScript & Code Quality

1. No `any` in new/edited code (except strongly justified interop boundaries).
2. Use `import type` for type-only imports.
3. Keep function signatures explicit and side effects localized.
4. Prefer small, composable utilities over repeated inline logic.
5. Comments explain why, not what.

---

## 9) Routes & Navigation Integrity

1. Route constants in `src/config/routes.ts` must reflect real pages in `src/app`.
2. Do not leave primary nav links pointing to non-existing pages.
3. Protected routes must preserve locale and callback URL behavior.

---

## 10) Validation & Error Handling

1. Validate form input at UI boundary.
2. Normalize API error messages before displaying to users.
3. Keep global toast behavior centralized (axios/interceptor or shared helpers).

---

## 11) Validation Loop (Before Done)

Run and report:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If UI or i18n changed, also run relevant `.agent` checks when available:

```bash
python .agent/skills/i18n-localization/scripts/i18n_checker.py .
python .agent/skills/frontend-design/scripts/ux_audit.py .
```

Fallback policy:
- If optional `.agent` scripts fail due to environment/dependencies, report the exact failure.
- Core gates (`lint`, `tsc`, `build`) remain mandatory.

---

## 12) Git & Commit Rules

1. Conventional commits: `type(scope): subject`.
2. Keep subject concise and meaningful.
3. Do not mix unrelated refactor + feature in one commit.
4. Review diff and ensure validation loop passes before commit.

---

## 13) Skill Routing (.agent/skills)

Pick skills intentionally by task:

| Task Type | Primary Skills |
| --- | --- |
| Next.js architecture/layout/refactor | `architecture`, `nextjs-react-expert` |
| API and auth integration | `api-patterns`, `nodejs-best-practices`, `vulnerability-scanner` |
| UI work with Tailwind | `frontend-design`, `tailwind-patterns`, `web-design-guidelines` |
| i18n and locale consistency | `i18n-localization` |
| Debug and bug isolation | `systematic-debugging` |
| Testing and reliability | `testing-patterns`, `tdd-workflow`, `webapp-testing` |
| Lint/type/build quality gate | `lint-and-validate` |

Protocol:
1. Read selected skill `SKILL.md` first.
2. Use one primary skill, others as support.
3. Reflect applied skill guidance in implementation and reporting.

---

## 14) Definition of Done

A task is considered complete only when:

1. Behavior is correct (including edge cases).
2. Locale flow and translations are not regressed.
3. `lint`, `tsc --noEmit`, and `build` pass (or user approves known risk).
4. Final report includes changed files, validation status, and residual risks.

