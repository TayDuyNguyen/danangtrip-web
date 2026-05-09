# Checklist: 01-screen-analysis

- [ ] Đã đọc PRD/SRS/notes liên quan đến màn hình này.
- [ ] Đã phân tích Figma/mockup: layout, colors, spacing, typography.
- [ ] Design tokens đã đối chiếu với `DESIGN.md` — conflicts (nếu có) đã flag.
- [ ] Component breakdown rõ ràng: `[REUSE]`, `[NEW]`, `[MOD]` với lý do.
- [ ] Responsive behavior đã mô tả: mobile / tablet / desktop.
- [ ] UI States liệt kê đủ: loading, empty, error, success, disabled, hover/focus.
- [ ] Data fields liệt kê đủ: field name, type, required, validation, example.
- [ ] API endpoints xác định: method, path, auth requirements.
- [ ] Business rules liệt kê: BR-xx với điều kiện rõ ràng.
- [ ] Actors & permissions xác định.
- [ ] Edge cases liệt kê (timeout, empty data, large dataset, concurrent).
- [ ] Output file đúng path: `.agent/artifacts/analysis/YYYY-MM-DD__<slug>__screen-analysis.md`.
- [ ] Không có code trong output — chỉ tài liệu phân tích.
- [ ] Mọi điểm không chắc chắn đã ghi `[ASSUMPTION]`.
