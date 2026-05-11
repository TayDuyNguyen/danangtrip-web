# Checklist: 04-layout-routing

- [ ] Route files tạo đúng path: `src/app/[locale]/<route>/page.tsx`.
- [ ] `src/config/routes.ts` đã cập nhật route mới.
- [ ] `generateMetadata` đã set ở route level.
- [ ] Layout wrapper tạo (nếu cần) và compose đúng với existing layouts.
- [ ] Server/Client boundary rõ ràng — `"use client"` chỉ ở components cần thiết.
- [ ] Không đánh `"use client"` cho toàn bộ page/route tree.
- [ ] i18n namespace tạo: `src/messages/vi/<feature>.json` + `en`.
- [ ] vi/en i18n files đồng bộ.
- [ ] Skeleton layout renders — route navigable.
- [ ] `npm run check:routes` pass.
- [ ] `npm run typecheck` pass.
- [ ] Route plan tạo đúng path: `.agent/artifacts/routing/...`.
