# Project Setup Report: <Feature Name hoặc Project Base>

> Feature slug: `<feature-slug>`
> Date: YYYY-MM-DD
> Scope: `project base audit`

---

## 1) Summary
- Audit này phục vụ mục tiêu gì?
- Có blocker nào trước khi triển khai feature không?

## 1.1) Audit Verdict
- Ready / Not Ready:
- Lý do chính:

## 2) Dependency Audit
| Item | Expected | Actual | Status | Notes |
|---|---|---|---|---|
| Next.js | | | | |
| React | | | | |
| TanStack Query | | | | |
| Zustand | | | | |
| next-intl | | | | |
| Zod | | | | |

## 3) Config Audit
| Config | Check | Status | Notes |
|---|---|---|---|
| `tsconfig.json` | aliases / strict | | |
| `next.config.ts` | build/runtime config | | |
| `vitest.config.ts` | test config | | |
| `.env.example` | required vars present | | |

## 4) Runtime / Middleware Audit
| Area | Check | Status | Notes |
|---|---|---|---|
| `src/lib/axios.ts` | interceptor / auth | | |
| `src/providers/providers.tsx` | provider wiring | | |
| `src/middleware.ts` | locale + auth behavior | | |
| `scripts/check-routes.mjs` | route integrity tooling | | |

## 4.1) Command Baseline
| Command | Purpose | Status | Notes |
|---|---|---|---|
| `npm run lint` | lint | | |
| `npm run typecheck` | typecheck | | |
| `npm run check:routes` | route integrity | | |
| `npm run build` | build | | |
| `npm run prepush:check` | full gate | | |

## 5) Risks / Gaps
- R-01:
- R-02:

## 5.1) Smallest Safe Fixes
- Fix-01:
- Fix-02:

## 6) Recommended Next Actions
- [ ] Continue with feature implementation
- [ ] Fix blockers first
- [ ] Re-audit after config/dependency changes
