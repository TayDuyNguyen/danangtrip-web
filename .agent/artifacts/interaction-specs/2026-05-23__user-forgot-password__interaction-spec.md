# Interaction Spec: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Source data plan: [2026-05-23__user-forgot-password__data-integration.md](file:///D:/DATN/danangtrip-web/.agent/artifacts/integration/2026-05-23__user-forgot-password__data-integration.md)

---

## 1) Summary
- **Mục tiêu tương tác:** Thiết lập trải nghiệm nhập liệu, phản hồi và phản ứng bàn phím tinh tế nhất, giúp người dùng cảm nhận sự mượt mà và an tâm tuyệt đối (Wow factor).
- **Hành động cốt lõi:** Nhập email -> Submit nhanh bằng phím Enter -> Chuyển hướng Success -> Spam protection qua bộ đếm Cooldown.

---

## 2) Key Interactive Elements & Behaviors

### 2.1) Input Field Interactions (Email Input)
- **Focus State:** Khi trỏ chuột hoặc tab vào input, đường viền lập tức chuyển từ màu xám trung tính `#262626` sang màu đồng `#8B6A55` trong vòng 150ms. Nhãn label trượt nhẹ từ dưới lên và hiển thị độ mờ 100%.
- **Validation Trigger:** Xảy ra tại sự kiện `onBlur` (khi người dùng chuyển sang click nơi khác hoặc nhấn nút Submit). Nhập sai định dạng -> khung viền đổi màu đỏ lập tức và hiển thị text cảnh báo Zod.
- **Error Clear:** Khi người dùng bắt đầu nhấn phím nhập ký tự mới, thông điệp lỗi tự động biến mất và viền quay lại trạng thái focus màu đồng sang trọng.

### 2.2) Primary CTA Button (Submit)
- **Disabled State:** Nút submit bị vô hiệu hóa khi:
  - Trường Email rỗng hoặc chứa khoảng trắng.
  - Email nhập sai định dạng validation.
  - API đang gọi xử lý (`requestMutation.isPending`).
- **Keyboard Navigation:** Hỗ trợ người dùng nhấn phím `Enter` bất cứ lúc nào khi đang nhập trong Input để kích hoạt gửi form tức thì nhờ bọc thẻ `<form onSubmit={handleSubmit}>` chuẩn ngữ nghĩa HTML5.

### 2.3) Resend Cooldown Timer (Spam Prevention)
- **Cooldown duration:** **60 giây** (đếm ngược từng giây một).
- **Behavior:**
  - Ngay khi gửi thành công và chuyển sang màn hình Success, bộ cooldown đếm ngược được kích hoạt tự động.
  - Nút "Gửi lại" (Resend) bị vô hiệu hóa và hiển thị chữ `Gửi lại sau 58s...` màu đồng dịu mát.
  - Khi bộ đếm về 0, nút Resend hiển thị rõ ràng, cho phép click lại, hover đổi màu chữ sáng để người dùng chủ động tương tác.

---

## 3) Feedback Mechanism (Toasts & Micro-interactions)
- **Success Toast:** Khi người dùng click gửi lại thành công -> hiển thị Toast thông báo xanh lá góc phải: `Đã gửi lại email khôi phục thành công!`.
- **Error Toast:** Khi kết nối internet lỗi hoặc máy chủ sập -> hiển thị Toast đỏ cảnh báo: `Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau.`.

---

## 4) Files Expected To Change
- `src/features/auth/components/forgot-password-form.tsx` (Đã hoàn thiện các tương tác)

---

## 5) Interaction Verification Checklist
- [x] Đã xử lý chặn Double Submit (spam click).
- [x] Đã cấu hình bộ đếm Cooldown 60s đúng chuẩn kỹ thuật.
- [x] Đã hỗ trợ phím Enter và Instant validation tại `onBlur`.
- [x] Đã tích hợp Toaster `sonner` thông minh báo trạng thái vi mô.
