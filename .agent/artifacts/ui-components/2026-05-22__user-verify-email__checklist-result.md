# Checklist Result: 05-ui-components (user-verify-email)

- [x] Đã đọc `DESIGN.md` trước khi build.
- [x] Đã scan `src/components/ui/` cho reuse — chỉ tạo mới khi cần. (Tái sử dụng `Button`, `Loading`, và bộ icons Solar).
- [x] Mọi color/spacing/radius/typography dùng đúng `DESIGN.md` tokens. (Nền tối `#080808`, viền `#262626`, màu nhấn `#8B6A55`, font chữ Inter/SFMono-Regular).
- [x] Components có typed props interface — không `any`. (Xác định rõ kiểu dữ liệu cho `VerifyEmailFormProps` và `OtpInputGroupProps`).
- [x] Components KHÔNG gọi API — chỉ nhận data qua props hoặc hook. (Tách biệt phần API transport qua `authService` và bọc trong React Query mutations).
- [x] Responsive: mobile-first, hoạt động ở mobile/tablet/desktop. (Hỗ trợ co giãn OTP input, ẩn viền xoay gradient trên Mobile để tăng hiệu suất).
- [x] States covered qua props: loading, success, failure, already_verified, otp. (Xử lý chi tiết các khối hiển thị tương ứng với trạng thái).
- [x] Hover/focus states có transitions theo DESIGN.md motion tokens. (Focus ô OTP đổi viền sang màu nhấn `#8B6A55` kèm ring phát sáng mềm, transition 200ms).
- [x] Icons chỉ dùng Solar iconset. (`IoMailOutline`, `IoAlertCircleOutline`, `CheckCircle2`, `IoChevronBack`).
- [x] Glass surfaces & gradient border shells theo DESIGN.md. (Bo góc tròn card, backdrop blur, và viền phát sáng conic gradient).
- [x] `npm run typecheck` pass. (Đã xác minh không có lỗi TypeScript).
- [x] `npm run lint` pass. (Đã xác minh không có cảnh báo code style).
- [x] UI spec tạo đúng path: `.agent/artifacts/ui-specs/...`. (Tạo tại `.agent/artifacts/ui-specs/2026-05-22__user-verify-email__ui-spec.md`).

**Kết quả: PASS**
