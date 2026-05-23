# Deploy Readiness Report: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Môi trường phân phối**: Cloudflare Workers qua OpenNext
- **Trạng thái deploy**: **SẴN SÀNG DEPLOY (READY)**

---

## 1. Cloudflare Workers Alignment (Tương thích Edge Runtime)

Chúng ta sử dụng Cloudflare Workers làm nền tảng chạy chính thức. Vì Edge Runtime không hỗ trợ các tính năng Node.js Proxy truyền thống và yêu cầu tài nguyên biên dịch phải siêu nhẹ, mã nguồn mới viết hoàn toàn đáp ứng các điều kiện sau:

- **Static translation import**: Đã khai báo import tĩnh và registry cho file `reset-password.json` trong `src/i18n/request.ts`. Tránh sử dụng import động bất đồng bộ (`import()`) có thể gây ra lỗi trả về `undefined .default` trên Worker bundle.
- **Edge Middleware**: Cấu hình Edge runtime được bật rõ ràng (`export const runtime = "experimental-edge"`) tại `src/middleware.ts` giúp xử lý chuyển hướng nhanh chóng ở lớp mạng phân phối ngoài cùng của Cloudflare.
- **Strict Types check & Linting**: Toàn bộ dự án đã vượt qua bài kiểm định của Typescript và ESLint, đảm bảo không xảy ra bất kỳ lỗi đóng gói Webpack nào trong build process.

---

## 2. Next.js Production Build Validation (Xác minh bản Build tối ưu)

Hệ thống Next.js đã hoàn thành biên dịch gói tối ưu hoá production thành công tốt đẹp:
- **Tên trang**: `/reset-password`
- **Trạng thái**: Dynamic (`ƒ`) - được kích hoạt render động theo yêu cầu (on-demand) nhờ đón nhận searchParams bất đồng bộ.
- **Kích thước & Tài nguyên**: Tối ưu hóa cực nhẹ nhờ sử dụng component Client tinh giản chỉ chứa form, còn banner được render tĩnh ở server.

---

## 3. Recommended Rollout Strategy (Đề xuất triển khai)

1. **Bước 1 (Merge & Build)**: Tiến hành tạo nhánh mới (ví dụ: `feat/DATN-86/user-reset-password`) để merge code.
2. **Bước 2 (Wrangler Deploy)**: Chạy lệnh deploy thông qua OpenNext:
   ```bash
   npx wrangler deploy
   ```
3. **Bước 3 (Smoke Test)**: Truy cập trực tiếp đường dẫn môi trường Staging/Production để thực thi 4 kịch bản kiểm thử thủ công đã đặc tả trong [test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-23__user-reset-password__test-report.md).
