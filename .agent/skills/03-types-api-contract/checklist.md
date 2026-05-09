# Checklist: 03-types-api-contract

- [ ] TypeScript interfaces đã tạo, match data fields trong analysis.
- [ ] Không có `any` — dùng `unknown` + type guard nếu cần.
- [ ] `import type` cho type-only imports.
- [ ] Zod schemas đã tạo cho request bodies.
- [ ] Zod schemas sync với TypeScript types (`z.infer<typeof schema>`).
- [ ] API service functions đã tạo, async + typed.
- [ ] Service dùng axios instance từ `src/lib/` — không raw fetch.
- [ ] Service chỉ chứa transport logic — không business logic.
- [ ] Không import chéo sibling features.
- [ ] API contract doc đã tạo đúng path.
- [ ] `npm run typecheck` pass.
