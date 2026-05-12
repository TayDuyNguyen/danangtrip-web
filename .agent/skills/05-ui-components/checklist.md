# Checklist: 05-ui-components

- [ ] Đã đọc `DESIGN.md` trước khi build.
- [ ] Đã scan `src/components/ui/` cho reuse — chỉ tạo mới khi cần.
- [ ] Mọi color/spacing/radius/typography dùng đúng `DESIGN.md` tokens.
- [ ] Components có typed props interface — không `any`.
- [ ] Components KHÔNG gọi API — chỉ nhận data qua props.
- [ ] Responsive: mobile-first, hoạt động ở mobile/tablet/desktop.
- [ ] States covered qua props: loading (skeleton), empty, error, success.
- [ ] Hover/focus states có transitions theo DESIGN.md motion tokens.
- [ ] Icons chỉ dùng Solar iconset.
- [ ] Glass surfaces & gradient border shells theo DESIGN.md (nếu applicable).
- [ ] Entrance animations: `reveal-up` classes cho sections.
- [ ] Không có component trùng lặp với existing components.
- [ ] `npm run typecheck` pass.
- [ ] `npm run lint` pass.
- [ ] UI spec tạo đúng path: `.agent/artifacts/ui-specs/...`.
