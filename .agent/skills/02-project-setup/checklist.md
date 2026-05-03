# Checklist: 02-project-setup

- [ ] Folder structure match `PROJECT_RULES.md` Section 3.
- [ ] Dependencies core đã cài: TanStack Query, Zustand, next-intl, Zod, Axios, Sonner.
- [ ] TypeScript `strict: true` trong `tsconfig.json`.
- [ ] Path aliases configured (`@/` → `src/`).
- [ ] API client setup: `src/lib/api-client.ts` với interceptors.
- [ ] TanStack Query Provider: `src/providers/query-provider.tsx` wrapping app.
- [ ] i18n setup: `src/i18n/`, `src/messages/vi/`, `src/messages/en/` tồn tại.
- [ ] `.env.example` cập nhật đầy đủ.
- [ ] `npm run dev` chạy thành công.
- [ ] `npm run typecheck` pass.
- [ ] `npm run lint` pass.
