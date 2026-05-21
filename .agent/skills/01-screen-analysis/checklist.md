# Checklist: 01-screen-analysis

## Input
- [ ] Đã đọc PRD/SRS/notes liên quan đến màn hình này
- [ ] Đã phân tích Figma/mockup: layout, colors, spacing, typography
- [ ] Đã đối chiếu endpoint với `src/config/api.ts` và `api_list.md`

## Design Token Audit
- [ ] Design tokens đã đối chiếu với `DESIGN.md`
- [ ] Conflicts (nếu có) đã flag rõ ràng

## Component Breakdown
- [ ] Có bảng `[REUSE]` / `[NEW]` / `[MOD]` — không chỉ bullet list
- [ ] Mỗi component có: path (nếu reuse), layer, reason
- [ ] Không ghi "reuse" mà không có path cụ thể

## Responsive & UI States
- [ ] Responsive behavior mô tả cụ thể: mobile / tablet / desktop
- [ ] UI states liệt kê per section (không chung chung): loading, empty, error, success, disabled
- [ ] Loading state chỉ rõ skeleton hay spinner
- [ ] Empty state chỉ rõ component hay message

## Data & API
- [ ] Data fields liệt kê đủ: field name, type, required, validation, source endpoint
- [ ] Endpoint đối chiếu với `src/config/api.ts` — không tự đặt tên
- [ ] Server/client ownership ghi rõ cho từng data source

## Business Rules & Edge Cases
- [ ] Business rules đánh số BR-01, BR-02, ...
- [ ] Edge cases đánh số EC-01, EC-02, ...
- [ ] Có ít nhất: empty dataset, validation lỗi, auth/permission case

## Assumptions & Quality
- [ ] Mọi điểm không chắc chắn đã ghi `[ASSUMPTION]`
- [ ] Không có code trong output — chỉ tài liệu phân tích
- [ ] Có section "Files / Areas Likely To Change"
- [ ] SEO/metadata impact ghi rõ nếu có

## Output
- [ ] Output file đúng path: `.agent/artifacts/analysis/YYYY-MM-DD__<slug>__screen-analysis.md`
- [ ] Tài liệu đủ để `03`, `04`, `05`, `06`, `07` dùng tiếp mà không hỏi lại
