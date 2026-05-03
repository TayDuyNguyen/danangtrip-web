# Checklist: 06-data-integration

- [ ] Data flow đúng: service → hook (TanStack Query) → UI.
- [ ] Custom hooks tạo tại `src/features/<feature>/hooks/`.
- [ ] Query keys hierarchical: `["feature", "resource", "type/id"]`.
- [ ] `staleTime` set hợp lý (5-30 min cho non-volatile data).
- [ ] Loading state: Skeleton screens (không full-page spinner).
- [ ] Error state: normalize errors + toast notification (`sonner`).
- [ ] Empty state: hiển thị empty component hoặc hide section.
- [ ] Không có HTTP logic trực tiếp trong UI components.
- [ ] Không có fake/mock data trong production components.
- [ ] User-facing messages dùng i18n keys (không hardcode).
- [ ] Sibling components dùng chung query key → chỉ 1 request.
- [ ] `npm run typecheck` pass.
- [ ] `npm run lint` pass.
