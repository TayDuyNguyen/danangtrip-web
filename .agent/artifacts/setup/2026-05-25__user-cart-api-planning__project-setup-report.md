# Project Setup Report: User Cart Feature (user-cart-api-planning)

- **Feature Slug**: `user-cart-api-planning`
- **Objective**: Audit the repository configuration, dependency versions, API utilities, and build system before implementing the User Cart feature.
- **Audit Date**: 2026-05-25
- **Verdict**: **PASS** (Base setup is ready, backend needs database table and API routes).

---

## 1. Dependency & Scripts Audit

We verified the core packages and verified the versions matching the project specifications:

| Package | Expected Version | Actual Version | Status |
|---|---|---|---|
| **Next.js** | App Router | `16.2.3` | **PASS** |
| **React** | 19.x | `19.2.4` | **PASS** |
| **Tailwind CSS** | v4 | `4.x` (with postcss) | **PASS** |
| **TanStack Query** | v5 | `5.99.0` | **PASS** |
| **Zustand** | v5 | `5.0.12` | **PASS** |
| **Zod** | v4 | `4.3.6` | **PASS** |
| **Axios** | v1 | `1.15.0` | **PASS** |
| **next-intl** | v4 | `4.9.1` | **PASS** |
| **Vitest** | v4 | `4.1.5` | **PASS** |

### Verified CLI Command Scripts:
- `npm run lint` -> Runs ESLint.
- `npm run typecheck` -> Runs `tsc --noEmit`.
- `npm run check:routes` -> Verifies Next.js app routes against route configuration.
- `npm run build` -> Next.js production build (`next build --webpack`).
- `npm run prepush:check` -> Standard repository sanity check script. Runs lint, typecheck, check:routes, and build.

---

## 2. Config & Path Mapping Audit

- **TypeScript Path Mapping**: `tsconfig.json` correctly defines `"@/*": ["./src/*"]` mapping which matches Next.js imports.
- **Next Config**: `next.config.ts` wraps configuration using `withNextIntl` correctly. Uses Webpack loader configurations.
- **Environment variables**: `.env.local` contains `NEXT_PUBLIC_API_URL` pointing to local Laravel API `http://localhost:8000/v1` or equivalent.

---

## 3. Runtime & Middleware Audit

- **Axios Client (`src/lib/axios.ts`)**: 
  - Standardized client instance configured with Cookie synchronization.
  - Automatically appends token: `Authorization: Bearer ${token}`.
  - Handles expired token refreshes calling `/auth/refresh` on `401 Unauthorized` responses and automatically clears stores and redirects on failure.
- **Providers (`src/providers/providers.tsx`)**:
  - Wrapping order: `QueryClientProvider` -> `NextIntlClientProvider`.
  - Configured with `LocaleHtmlLang` helper injection and `sonner` toaster configuration.
- **Edge Middleware (`src/middleware.ts`)**:
  - Uses `experimental-edge` runtime.
  - Handles locale detection and routing mapping to `/en` and `/vi`.
  - Protects specific routes (like `/profile`, `/payment`, `/settings`) by redirecting unauthenticated users to `/login?callbackUrl=...`.
  - **Verdict**: `/cart` remains public, which correctly bypasses middleware restrictions, allowing guests to use the local-storage cart before logging in.

---

## 4. Gaps and Tasks Identified for User Cart Implementation

Since this feature spans both frontend and backend:
1. **Backend Database Table**: Need to run a migration creating `cart_items` in the backend database.
2. **Backend API Endpoints**: Register endpoints in `routes/api.php` under the JWT auth middleware.
3. **Cart Model & Controller**: Implement `CartItem` model and `CartController` with store, index, update, delete, clear, and merge actions.
4. **Zustand Local Sync**: Implement a client-side Zustand store hook (`src/store/cart.store.ts`) that manages memory array logic if guest, and triggers backend endpoints if logged in.
5. **Merge Flow on Auth State Change**: Hook into login hooks or page mount context to check if guest cart contains items, merge them, and flush local storage.

---

## 5. Verification Commands
Before submitting code:
```bash
npm run prepush:check
```
Ensure Vitest suites execute without failures:
```bash
npx vitest run
```
