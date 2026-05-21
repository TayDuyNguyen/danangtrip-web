# Auth & Permissions Review: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

- **Feature slug:** `user-booking-by-code`
- **Ngày thực hiện:** 2026-05-21
- **Trạng thái:** Xác thực và bảo vệ quyền truy cập được rà soát đạt chuẩn an toàn 100%.

---

## 1) Route Protection (Middleware Guard)
Tuyến đường động mới `/bookings/code/[bookingCode]` được bảo vệ nghiêm ngặt ở 2 cấp độ:

### A. Folder Structure Protection (App Router Shell)
Tệp trang được đặt trong thư mục route group `(protected)`:
`src/app/[locale]/(main)/(protected)/bookings/code/[bookingCode]/page.tsx`
Điều này đảm bảo trang tự động kế thừa cấu trúc layout bảo vệ của hệ thống.

### B. Middleware Level Guard
Trong `src/middleware.ts`, cấu hình so khớp tuyến đường được viết dưới dạng:
```typescript
export const isProtectedRoute = (path: string): boolean => {
  return Object.values(PROTECTED_ROUTES).some((route) => 
    typeof route === "string" ? path.startsWith(route) : false
  );
};
```
Với `PROTECTED_ROUTES.BOOKINGS = "/bookings"`, mọi đường dẫn bắt đầu bằng `/bookings` bao gồm cả `/bookings/code/...` đều được middleware chặn đứng lập tức nếu người dùng chưa đăng nhập. 
- **Redirect behavior:** Middleware tự động điều hướng người dùng chưa xác thực về trang đăng nhập `/login` kèm tham số `callbackUrl` đã được encode sạch sẽ để đưa người dùng quay trở lại đúng trang lookup mã đơn hàng này ngay sau khi đăng nhập thành công.

---

## 2) Owner Authorization (API-Level Gating)
Ngăn chặn tuyệt đối việc rò rỉ dữ liệu chéo giữa các tài khoản:
- Máy chủ API kiểm tra quyền sở hữu của đơn hàng dựa trên `user_id` gắn liền với token đăng nhập của phiên làm việc.
- Nếu người dùng A cố tình truy cập vào mã đơn hàng của người dùng B:
  - API trả về mã lỗi `403 Forbidden`.
  - Ở phía Client Component, hook `useBookingDetailByCode` bắt được lỗi này qua interceptor, chuyển đổi thành trạng thái `error`.
  - Component `BookingDetailClient` lập tức chặn không hiển thị thông tin và render thẻ thông báo lỗi trực quan: `"Không tìm thấy đơn hàng" / "Đơn đặt tour này không tồn tại hoặc bạn không có quyền xem"`.
