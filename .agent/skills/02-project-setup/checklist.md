# Checklist: 02-project-setup

- [ ] Folder structure match `PROJECT_RULES.md` Section 3.
- [ ] Dependencies core đã cài: TanStack Query, Zustand, next-intl, Zod, Axios, Sonner.
- [ ] TypeScript `strict: true` trong `tsconfig.json`.
- [ ] Path aliases configured (`@/` → `src/`).
- [ ] API client setup: `src/lib/axios.ts` với interceptors.
- [ ] App providers setup: `src/providers/providers.tsx` wrapping app.
- [ ] i18n setup: `src/i18n/`, `src/messages/vi/`, `src/messages/en/` tồn tại.
- [ ] Middleware setup: `src/middleware.ts` phù hợp locale + auth flow.
- [ ] `.env.example` cập nhật đầy đủ.
- [ ] `npm run dev` chạy thành công.
- [ ] `npm run typecheck` pass.
- [ ] `npm run lint` pass.
- [ ] Setup report tạo đúng path: `.agent/artifacts/setup/...`.
