# Project Setup Report: danangtrip-web

## 1. Summary
- **Date**: 2026-05-18
- **Feature Slug**: `tour-departure-select`
- **Goal**: Audit the project baseline (commands, config, middleware, and architecture) before implementing the departure select screen.
- **Verdict**: **READY WITH MINOR WARNINGS**

## 2. Dependency & Script Audit
- **Framework**: Next.js 16.2.3 App Router — `PASS`
- **React**: 19.2.4 — `PASS`
- **Styling**: Tailwind CSS v4 — `PASS`
- **Data Fetching**: `@tanstack/react-query` v5 — `PASS`
- **State**: `zustand` v5 — `PASS`
- **Validation**: `zod` v4 — `PASS`
- **HTTP**: `axios` v1 — `PASS`
- **i18n**: `next-intl` v4 — `PASS`
- **Testing**: `vitest` v4 — `PASS`
- **Deploy**: Cloudflare Workers via `@opennextjs/cloudflare` — `PASS`

## 3. Command Baseline Audit
- `npm run check:routes`: `PASS` (Verified 15 active route entries)
- `npm run typecheck`: `PASS`
- `npm run lint`: `WARNING` (Found 10 warnings related to unused variables and `<img>` instead of `next/image`. No fatal errors.)

## 4. Config Audit
- **Next.js Config** (`next.config.ts`): `PASS` (Properly configured with `withNextIntl` and initialized for OpenNext Cloudflare).
- **TypeScript Aliases** (`tsconfig.json`): `PASS` (`@/*` correctly maps to `./src/*`, along with explicit folder paths).

## 5. Runtime & Middleware Audit
- **Axios Configuration** (`src/lib/axios.ts`): `PASS` (BaseURL from env, request interceptor attaches token from `js-cookie`, response interceptor handles 401 correctly).
- **Providers Hierarchy** (`src/providers/providers.tsx`): `PASS` (`QueryClientProvider` wraps `NextIntlClientProvider` correctly).
- **Edge Middleware** (`src/middleware.ts`): `PASS` (Runtime set to `experimental-edge`. Correctly handles `next-intl` locale routing and auth redirects without loop).

## 6. Risks & Next Actions
- **Risk**: A few unused variables and image tag warnings are present in previously built feature files (`tours/[slug]/book/page.tsx`, `BookingForm.tsx`, etc.). They don't block development but should be cleaned up during optimization.
- **Action**: The baseline is completely healthy. We can safely proceed to **Step 03-types-api-contract** to implement the required schemas and services for `tour-departure-select`.