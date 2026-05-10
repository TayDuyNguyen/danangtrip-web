# Feature Review: Contact Form (Màn hình Liên hệ) - Chi tiết 10 Bước
**Date**: 2026-05-10
**Status**: COMPLETED & VERIFIED
**Branch**: `feat/DATN-65/contact-form-integration`
**Commit**: `feat: implement contact form with full validation and backend integration`

---

## Quá trình thực hiện chi tiết

### Bước 1: Phân tích yêu cầu / SRS
- **Mục tiêu**: Xây dựng trang liên hệ cho phép người dùng gửi thông tin yêu cầu (tên, email, số điện thoại, tiêu đề, nội dung).
- **Yêu cầu kỹ thuật**: Sử dụng App Router, i18n đa ngôn ngữ, validation bằng Zod, giao diện Glassmorphism cao cấp.
- **Tình trạng**: Đã hoàn thành phân tích và xác định cấu trúc route tại `/[locale]/(main)/(public)/contact`.

### Bước 2: Thiết kế cấu trúc dữ liệu / Zod Schema
- **File**: `src/features/contact/validators/contact.validator.ts`
- **Nội dung**: Định nghĩa `contactSchema` với các quy tắc:
  - `name`: Tối thiểu 2 ký tự.
  - `email`: Đúng định dạng email.
  - `phone`: Tùy chọn (optional).
  - `subject`: Tối thiểu 5 ký tự.
  - `message`: Tối thiểu 10 ký tự.
- **Lý do**: Đảm bảo dữ liệu gửi lên API luôn sạch và hợp lệ, đồng bộ giữa Client và Server.

### Bước 3: Xây dựng Service & Mock API
- **File**: `src/services/contact.service.ts`
- **Nội dung**: Tích hợp phương thức `submitForm` gọi đến API endpoint `POST /api/v1/contacts`.
- **Lý do**: Tách biệt logic gọi API khỏi UI components để dễ quản lý và test.

### Bước 4: Xây dựng Hooks & State logic
- **File**: `src/features/contact/hooks/use-contact.ts`
- **Nội dung**: Sử dụng `useMutation` từ TanStack Query để quản lý trạng thái loading, success, và error của form.
- **Lý do**: Tối ưu hóa việc quản lý state bất đồng bộ và tự động hiển thị Toast thông báo.

### Bước 5: Phát triển UI Components & Layout
- **Files**:
  - `src/features/contact/components/ContactForm.tsx`: Form nhập liệu chính.
  - `src/features/contact/components/ContactHero.tsx`: Phần tiêu đề trang với hiệu ứng gradient.
  - `src/features/contact/components/ContactInfoCard.tsx`: Card hiển thị thông tin liên hệ tĩnh.
  - `src/app/[locale]/(main)/(public)/contact/page.tsx`: File page chính lắp ghép các component.
- **Lý do**: Xây dựng giao diện theo phong cách Glassmorphism, đồng bộ với thiết kế chung của hệ thống.

### Bước 6: Tích hợp i18n (Đa ngôn ngữ)
- **Files**: `messages/vi.json`, `messages/en.json` (Namespace: `contact`).
- **Nội dung**: Dịch toàn bộ các label, placeholder, thông báo thành công và các câu thông báo lỗi validation.
- **Lý do**: Đảm bảo trải nghiệm người dùng tốt cho cả khách du lịch trong nước và quốc tế.

### Bước 7: Viết Unit Tests & Integration Tests
- **Files**:
  - `src/features/contact/__tests__/ContactForm.test.tsx`: Test việc render và submit form.
  - `src/features/contact/__tests__/use-contact.test.tsx`: Test logic hook và xử lý API thành công/thất bại.
- **Lý do**: Đảm bảo tính ổn định của mã nguồn, tránh regression khi thay đổi sau này.

### Bước 8: Kiểm thử E2E bằng Browser Subagent
- **Quá trình**: Sử dụng công cụ AI Browser truy cập `http://localhost:3000/contact`, nhập liệu thực tế và bấm gửi.
- **Kết quả**: Xác nhận form hiển thị đúng, bấm submit hiển thị loading, sau đó chuyển sang màn hình thành công. Kiểm tra Console không có lỗi Hydration nghiêm trọng.

### Bước 9: Tối ưu Performance, SEO & Accessibility
- **Optimization**:
  - Thêm `reveal-up` và `reveal-delay-X` cho hiệu ứng entrance mượt mà.
  - Sử dụng `generateMetadata` trong `page.tsx` để tối ưu SEO (title, description localized).
  - Sử dụng Semantic HTML (`<main>`, `<aside>`, `<section>`, `<form>`).
  - Thêm `aria-label` và `id` cho các input để hỗ trợ Screen Reader.

### Bước 10: Fix bugs phát sinh & Build Verification
- **Các lỗi đã fix**:
  - **Linting**: Loại bỏ các kiểu `any` không an toàn, sửa lỗi `displayName`.
  - **Import path**: Sửa lỗi sai đường dẫn import từ `contact.schema` sang `contact.validator`.
  - **Backend Bug**: Phát hiện và xử lý lỗi PostgreSQL ID sequence bị lệch khiến API trả về lỗi 500.
  - **Build**: Chạy thành công `npm run prepush:check` đảm bảo mọi tiêu chuẩn chất lượng.

---
**Kết luận**: Tính năng đã sẵn sàng để triển khai. Toàn bộ quá trình được kiểm soát chặt chẽ qua 10 bước tiêu chuẩn.

**Người thực hiện**: Antigravity (AI)
**Duyệt bởi**: [Đang chờ USER]
