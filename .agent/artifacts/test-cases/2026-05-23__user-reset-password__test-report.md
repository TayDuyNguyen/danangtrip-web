# Test Report: Đặt lại mật khẩu (user-reset-password)

- **Feature Slug**: `user-reset-password`
- **Ngày thực thi**: 2026-05-23
- **Người thực hiện**: AI Collaborator
- **Kết quả tổng quan**: **Tất cả các chốt chặn chất lượng (Quality Gates) đều ĐẠT (PASS)**

---

## 1. Automated Verification Checks (Cửa ngõ kiểm tra tự động)

Chúng tôi đã kích hoạt thành công quy trình kiểm tra chất lượng tự động thông qua lệnh kiểm thử chính thức của dự án:
```bash
npm run prepush:check
```

Kết quả chi tiết đạt được như sau:

| Tên chốt chặn | Lệnh kiểm tra | Trạng thái | Bằng chứng kiểm duyệt |
|---|---|---|---|
| **ESLint — Lint** | `npm run lint` | **ĐẠT (PASSED)** | Biên dịch hoàn tất mà không có bất kỳ cảnh báo (warning) hay lỗi (error) cú pháp hoặc vi phạm tiêu chuẩn coding style. |
| **TypeScript — Type Check** | `npm run typecheck` | **ĐẠT (PASSED)** | Xác thực kiểu dữ liệu tĩnh nghiêm ngặt (`tsc --noEmit`) đạt độ chính xác 100%. Tất cả các types/interfaces và static imports (`request.ts`) đều khớp hoàn hảo. |
| **Routes — Active Routes** | `npm run check:routes` | **ĐẠT (PASSED)** | Bộ định tuyến đã xác thực thành công 24 đường dẫn hoạt động thực tế bao gồm route mới `/reset-password` mà không có lỗi đứt gãy liên kết. |
| **Next.js — Production Build**| `npm run build` | **ĐẠT (PASSED)** | Build bản đóng gói tối ưu hoá production thành công trong 15.1s. Edge runtime biên dịch ổn định và bóc tách được trang dynamic: `ƒ /[locale]/reset-password`. |

---

## 2. Dynamic Router Page Output Evidence (Bằng chứng Biên dịch Trang)

Hệ thống Next.js App Router đã đóng gói trang `/reset-password` ở dạng **Dynamic Server-Rendered on demand (`ƒ`)** do có sử dụng `searchParams` bất đồng bộ ở lớp trang:
```text
Route (app)
...
├ ƒ /[locale]/forgot-password
...
├ ƒ /[locale]/reset-password
...
```

---

## 3. Manual Functional & UX Testing (Kịch bản kiểm thử thủ công khuyến nghị)

Sau khi deploy lên môi trường Staging/Dev, chúng tôi đề xuất thực hiện các ca kiểm thử hành vi sau:

### Case 1: Thiếu mã token trên URL
- **Cách thực hiện**: Truy cập trực tiếp đường dẫn `http://localhost:3000/vi/reset-password`.
- **Kết quả mong đợi**: Form nhập liệu bị ẩn hoàn toàn. Thay vào đó hiển thị thẻ kính mờ cảnh báo "Mã xác thực không hợp lệ", đi kèm nút "Yêu cầu liên kết mới" dẫn tới trang `/forgot-password`.

### Case 2: Đầy đủ token và email trên URL
- **Cách thực hiện**: Truy cập đường dẫn `http://localhost:3000/vi/reset-password?token=mocktoken123&email=tay.nguyen@example.com`.
- **Kết quả mong đợi**: Biểu mẫu nhập liệu hiển thị bình thường. Trường Email tự động điền giá trị `tay.nguyen@example.com`. Tập trung con trỏ (focus) tự động vào trường nhập mật khẩu mới.

### Case 3: Xác thực lỗi thời gian thực (Real-time Validation)
- **Cách thực hiện**: Nhập mật khẩu mới không hợp lệ (ví dụ: `123`) hoặc hai mật khẩu không trùng khớp. Nhấn chuột ra ngoài (Blur).
- **Kết quả mong đợi**: Hệ thống hiển thị thông báo lỗi màu đỏ ngay dưới ô nhập liệu tương ứng ("Mật khẩu phải có ít nhất 8 ký tự...", "Mật khẩu không khớp").

### Case 4: Thay đổi thành công (Success Flow)
- **Cách thực hiện**: Nhập thông tin hợp lệ -> Bấm "Xác nhận đổi mật khẩu".
- **Kết quả mong đợi**: Nút submit hiển thị trạng thái loading spinner và nhãn `"Đang xử lý..."`. Sau khi gọi API thành công, form chuyển tiếp mượt mà sang thẻ "Đặt lại thành công!" có tích xanh nổi bật cùng nút "Đăng nhập ngay".
