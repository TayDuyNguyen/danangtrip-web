---
description: "DanangTrip Web repository rules for architecture, code quality, delivery gates, and review discipline."
---

# DanangTrip Web - Repository Rules

This is the repository operating contract for AI and contributors working in this codebase.
Use this file together with `AGENTS.md`.

Goals:
- Keep architecture consistent.
- Reduce regressions in routes, i18n, auth, and UI behavior.
- Prefer rules that are observable and enforceable.

---

## 1. Scope

These rules apply to:
- `src/app`
- `src/components`
- `src/features`
- `src/services`
- `src/store`
- `src/hooks`
- `src/i18n`
- `src/messages`
- `src/config`
- `src/lib`
- `src/utils`

Priority:
1. Correctness and safety
2. Existing architecture consistency
3. Simplicity and maintainability
4. Performance and UX polish

---

## 2. Core Principles

### Must
- Prefer the smallest change that fully solves the problem.
- Preserve existing architecture unless the task explicitly requires refactor.
- Keep behavior explicit and local; avoid hidden side effects.
- Leave touched code cleaner than before.

### Should
- Favor composition over large multipurpose modules.
- Favor predictable patterns over clever abstractions.
- Optimize for readability by the next maintainer.

### Avoid
- Template-driven code that does not match this repository.
- New abstractions without at least two real consumers.
- Large cross-layer edits without clear justification.

---

## 3. Repository Shape

Canonical structure:

```text
src/
|-- app/          # routes, layouts, metadata, error boundaries
|-- components/   # shared UI and layout primitives
|-- features/     # feature-specific UI, hooks, validators, types
|-- services/     # API calls and service wrappers
|-- store/        # global client state only
|-- hooks/        # reusable cross-feature hooks
|-- i18n/         # routing and request config
|-- messages/     # locale dictionaries
|-- config/       # env, endpoints, routes, app config
|-- lib/          # low-level integrations and shared clients
|-- types/        # shared cross-feature types
|-- utils/        # stable generic helpers
|-- providers/    # app-wide providers (React Query, next-intl shell, etc.)
|-- proxy.ts      # Next.js 16 network boundary (i18n + auth redirects); matcher must cover unprefixed locales
```

Placement rules:
- Put feature-specific code under `src/features/<feature>/...`.
- Put shared UI primitives under `src/components/ui`.
- Put app shell and route layout concerns under `src/app` and `src/components/layout`.
- Put transport logic in `src/services`, not directly in UI components.
- **Feature Isolation**: Features must not import components from sibling features. Shared logic must be moved to `src/components/common`, `src/hooks`, or `src/services`.
- Do not create new top-level directories unless the current structure is clearly insufficient.

---

## 4. Change Intake Rules

Before non-trivial changes, perform an impact scan:
- Which layers are touched?
- Is the change local, cross-feature, or architectural?
- Does it affect routes, auth, i18n, shared UI, or data fetching?

Ask for confirmation before:
- Auth strategy changes
- Route structure changes
- Locale strategy changes
- Store ownership changes
- Shared component API changes with broad impact

Proceed without stopping for:
- Small bug fixes
- Copy changes
- Styling tweaks
- Isolated component updates

---

## 5. Architecture Boundaries

Preferred flow for client-driven features:
1. UI in `app`, `components`, or `features/*/components`
2. Control/data hook in `hooks` or `features/*/hooks`
3. API/service access in `services`
4. Shared client/integration in `lib`

Rules:
- Components should not contain ad-hoc HTTP logic when a service layer exists.
- Services should stay thin and transport-oriented.
- Business branching belongs in feature hooks or feature modules, not in low-level clients.
- Global store is for cross-page client state, not for all fetched server data by default.

---

## 6. Next.js App Router Rules

### Must
- Follow App Router conventions for `layout.tsx`, `page.tsx`, `error.tsx`, and `not-found.tsx`.
- Respect server/client boundaries.
- Add `"use client"` only when state, effects, event handlers, or browser APIs are required.
- Keep page metadata at route level where possible.

### Should
- Prefer server rendering when the UI does not require client interactivity.
- Keep client components focused and lightweight.

### Avoid
- Converting whole route trees to client components for convenience.
- Scattering metadata and route concerns into reusable presentation components.

---

## 7. State and Data Fetching

Use the simplest fitting mechanism:
- Server-rendered route data: route or server component
- Reusable client async logic: TanStack Query (via feature hooks)
- Cross-page client state: zustand store
- API transport and normalization: service layer

Rules:
- **TanStack Query** is the default for all client-side data fetching to ensure deduplication and caching.
- Do not duplicate the same source of truth across store, hook state, and storage without a clear ownership model.
- Prefer one ownership path for auth state.
- If local persistence is used, define what is persisted and why.
- Avoid fetching the same data in multiple sibling client components; rely on shared Query Keys to handle deduplication automatically.

---

## 8. Routes and Navigation

### Must
- `src/config/routes.ts` must reflect real, current application routes.
- Navigation used in visible UI must only point to existing pages.
- Locale-aware app navigation should use the i18n navigation helpers where appropriate.

### Planned Routes Policy
- Planned or future routes must be clearly separated from active routes.
- Planned routes must not be exported in a way that makes them look safe for current UI navigation.
- Do not link users to placeholder or missing pages from primary navigation, cards, CTAs, or dashboards.

### Protected Routes
- Preserve locale behavior.
- Preserve redirect or callback behavior when auth is required.

---

## 9. i18n Rules

### Must
- No hardcoded user-facing text in shared or reusable UI.
- Keep `src/messages/vi` and `src/messages/en` synchronized in the same task.
- Namespace translations by feature or domain.
- **Namespace Pattern**: Use the pattern that best fits the component's needs:
  - **Scoped** (`useTranslations("login")`): when a component only needs keys from **one namespace**. Use relative key paths (`t("email_label")`). This is the default recommended by next-intl.
  - **Unscoped** (`useTranslations()`): when a component needs keys from **multiple namespaces** simultaneously. Use fully qualified paths (`t("home.featured_locations.tagline")`).
- **No phantom namespaces**: The namespace string passed to `useTranslations()` must correspond to a real key in the loaded messages object (e.g., `"common"`, `"home"`, `"login"`, `"register"`, `"search"`). Sub-objects like `"accessibility"` or `"search.tabs"` are **not valid top-level namespaces**.

### Should
- Keep translation keys stable and descriptive.
- Prefer adding keys close to the feature namespace instead of dumping into a catch-all file.
- Use scoped namespace as the default; switch to unscoped only when crossing namespace boundaries in the same component.

### Avoid
- Mixing translated and hardcoded text in the same reusable component.
- Adding one locale without updating the other.
- Passing sub-paths as the scoped namespace (e.g., `useTranslations("search.tabs")` — invalid, use `useTranslations("search")` then `t("tabs.all")`).

---

## 10. Auth and Security

### Must
- Maintain a single source of truth for auth state (Zustand).
- **Auth Sync**: Auth state (tokens) must be synchronized with **Cookies** (`js-cookie`) to enable Middleware and Server Side Rendering (SSR) access.
- Keep middleware or proxy behavior, client persistence, and logout behavior aligned.
- Never commit real secrets or credentials.
- Update `.env.example` when adding required environment variables.

### Should
- Minimize token exposure in browser-accessible storage.
- Be explicit about cookie, storage, and refresh responsibilities.

### Avoid
- Duplicated auth stores
- Mixed token strategies without a defined ownership model
- Silent auth behavior changes without reviewing affected layers

---

## 11. TypeScript and Code Quality

### Must
- Keep `strict` TypeScript compatibility.
- Avoid `any` in new or modified code except justified boundaries.
- Use `import type` for type-only imports where applicable.
- Keep function signatures clear and side effects localized.

### Should
- Prefer narrow types and explicit return shapes.
- Extract repeated logic when duplication is real, not hypothetical.
- Keep helpers generic only when they are reused.
- **Utility-first reuse**: Before creating a new helper, search existing utilities in `src/utils/`, feature helpers, and shared hooks to reuse or extend current logic.
- If an existing helper is 70-80% compatible, extend it with optional parameters and preserve backward compatibility.

### Avoid
- God components
- Shared utility dumping grounds
- Large functions mixing rendering, transformation, and transport logic
- Duplicate helpers with overlapping behavior under different names

---

## 12. UI, Accessibility, and UX

### Must
- Preserve semantic HTML where practical.
- Keep interactive elements accessible by keyboard and screen reader basics.
- Handle loading, empty, error, and success states for user-critical flows.
- **Skeleton Pattern**: Prefer Skeleton screens over full-page loaders or "null" returns to prevent Cumulative Layout Shift (CLS).

### Should
- Reuse shared UI primitives before inventing new variants.
- Keep visual language consistent with the existing product surface.

### Avoid
- Hardcoded one-off visual tokens repeated across multiple components
- Toasts and error messaging scattered with inconsistent wording
- Decorative UI that obscures primary task completion

---

## 13. Validation and Error Handling

### Must
- Validate user input at the boundary where it enters the system.
- Normalize API errors before surfacing them in UI.
- Keep user-facing failure states actionable and non-ambiguous.

### Should
- Centralize repeated error formatting or toast behavior.
- Distinguish validation errors from network or server failures.

### Avoid
- Raw backend errors directly shown to users
- Silent catches without fallback behavior or logging path

---

## 14. Testing and Verification

Testing expectations:
- Bug fix: verify the failing path and the corrected path.
- UI change: verify rendering and basic interaction.
- Logic change: add or update automated tests when test infrastructure exists for the touched area.
- Cross-cutting change: run the broader validation loop.

Current repository baseline:
- This repository may not yet have complete automated test coverage.
- Lack of tests is not a reason to skip verification.
- When tests do not exist, report the verification you performed and the remaining risk.

Core quality gates before calling work complete:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Additional checks when relevant:

```bash
python .agent/skills/i18n-localization/scripts/i18n_checker.py .
python .agent/skills/frontend-design/scripts/ux_audit.py .
python .agent/skills/frontend-design/scripts/accessibility_checker.py .
python .agent/scripts/checklist.py .
```

Reporting rule:
- If a check is skipped, say why.
- If a script fails because of environment or missing dependency, report the exact failure.
- Do not claim completion without stating validation status.

---

## 15. Skill Routing Policy

Use only skills that exist in this repository and match the task.

Recommended mapping:

| Task | Primary Skill | Support Skills |
| --- | --- | --- |
| Next.js structure and rendering | `nextjs-react-expert` | `architecture`, `nextjs-project-rules` |
| UI implementation | `frontend-design` | `tailwind-patterns`, `web-design-guidelines` |
| API and service work | `api-patterns` | `nodejs-best-practices`, `vulnerability-scanner` |
| i18n changes | `i18n-localization` | `nextjs-project-rules` |
| Debugging | `systematic-debugging` | `code-review-checklist` |
| Testing and validation | `testing-patterns` | `tdd-workflow`, `lint-and-validate` |

Rules:
- Read the selected `SKILL.md` before substantial implementation.
- Use one primary skill and only the support skills that materially help.
- Do not reference skills that are not present under `.agent/skills`.

---

## 16. Review Checklist

Every meaningful change should be reviewed against:
- Correctness
- Edge cases
- Route integrity
- i18n consistency
- Auth consistency
- Accessibility basics
- Type safety
- Validation status
- Utility reuse check (search `src/utils/`, feature helpers, and shared hooks before adding new helper)

Utility checklist before adding a new helper:
- Search `src/utils/`, feature helpers, and shared hooks for equivalent logic.
- If an existing helper is close (about 70-80%), extend it instead of creating a new one.
- If a new helper is still required, document why existing helpers are not suitable.

For reviews, prioritize:
1. Bugs and regressions
2. Security and data integrity risks
3. Architectural drift
4. Missing tests or verification
5. Style and polish

---

## 17. Git and Delivery Discipline

### Must
- Keep commits focused.
- Use conventional commit style when creating commits.
- Separate refactor work from feature work unless tightly coupled.

### Should
- Review the diff before commit.
- Mention residual risk when validation is partial.

### Avoid
- Bundling unrelated cleanup into the same change
- Declaring "done" while known blockers remain unstated

---

## 18. Definition of Done

Work is done only when:
1. The requested behavior works.
2. Touched code follows repository boundaries.
3. Routes, auth, and locale behavior are not knowingly regressed.
4. Required translation files are synchronized when text changes.
5. Validation status is reported honestly.
6. Residual risks or skipped checks are stated explicitly.

---

## 19. Anti-Patterns for This Repository

Do not:
- Add visible links to non-existent routes.
- Hardcode reusable UI text that should be localized.
- Duplicate auth state ownership.
- Put API calls directly into many sibling components.
- Introduce broad abstractions to solve a one-off case.
- Keep stale template documentation that does not match the repository.

---

## 20. Rule Maintenance

This file must stay aligned with the actual repository.

When the codebase changes materially, update this file if any of the following become outdated:
- stack choices
- directory ownership
- route policy
- auth strategy
- validation commands
- skill references

If a rule is not realistic or not enforceable, rewrite it to be practical instead of aspirational.

---

## 21. Data Integrity & High-Performance Fetching

### Component Deduplication & Caching
- **Universal Caching**: Use TanStack Query to gộp yêu cầu (deduplication). Even if 10 components require the same Tour data, only one network request should be sent.
- **Query Key Strategy**: Use hierarchical keys: `["feature", "resource", "type/id"]` (e.g., `["home", "tours", "featured"]`).
- **Cache Policy**: Set reasonable `staleTime` (e.g., 5-30 mins) for non-volatile data to maximize performance and minimize server load.

### Strict Data Policy
- **Empty States Over Mocks**: Components should **hide their entire section** or show a clean empty state if the database is empty. 
- **No Invisible Mocks**: Hardcoded fake data (e.g., "15k users") is forbidden in production-ready components. The UI must accurately reflect the Backend database.
- **Graceful Error Handling**: If an API fails, provide appropriate error feedback or hide the affected section silently.

### Premium Visual Standards
- **Entrance Animations**: Use `reveal-up` CSS classes with staggered `reveal-delay-X` for all top-level sections to create a premium reveal effect.
- **Animation Rhythm**: Stagger delays must follow **100ms increments** (e.g., 100, 200, 300) to maintain a cohesive motion rhythm across the platform.
- **Aesthetic Tokens**: Use consistent Design Tokens (Glassmorphism, Azure primary color, soft shadows) to maintain "WOW" factor.
- **Interactive Feedback**: Always implement hover effects, active scales, and responsive loading/error feedback for a polished UX.
