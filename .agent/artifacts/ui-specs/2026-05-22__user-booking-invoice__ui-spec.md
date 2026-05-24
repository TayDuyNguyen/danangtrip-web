# Đặc tả Giao diện Người dùng: Hóa đơn PDF (user-booking-invoice)

Tài liệu này đặc tả giao diện và các trạng thái hiển thị của nút bấm tải hóa đơn PDF trong màn hình chi tiết đơn hàng.

---

## 1. Nút tải Hóa đơn PDF (Invoice Action Button)

### 1.1 Vị trí tích hợp
- Nút "In hóa đơn" tải PDF được đặt trong khu vực điều hướng / thao tác của Header Panel tại file `BookingDetailClient.tsx`.
- Nút này thay thế cho phiên bản thử nghiệm tải JSON thô trước đó, có nhãn đồng nhất: "In hóa đơn" (tiếng Việt) và "Print Invoice" (tiếng Anh).

### 1.2 Thiết kế Trạng thái Bình thường (Default State)
- **Vệ tinh:** Dạng viên tròn (`rounded-full`), cỡ chữ siêu nhỏ (`text-xs`), đậm (`font-semibold`).
- **Nền:** `#1F2937` (hoặc biến CSS tương ứng `bg-surface-container`).
- **Viền:** `border-border` hover đổi thành `border-primary/50`.
- **Màu chữ:** Trắng (`text-white`).

### 1.3 Thiết kế Trạng thái Đang tải (Loading State)
Khi người dùng click vào nút, hệ thống sẽ kích hoạt lệnh tải Blob từ máy chủ và nút chuyển sang trạng thái:
- **Nền:** Màu xanh dương thương hiệu `#3385D6` (`bg-[#3385D6]`).
- **Viền:** Màu xanh dương `#3385D6` (`border-[#3385D6]`).
- **Màu chữ:** Trắng (`text-white`).
- **Hiệu ứng Hover:** `hover:bg-[#3385D6]/90`.
- **Con trỏ:** `cursor-not-allowed` (chặn click trùng lặp).
- **Spinner xoay:**
  - Kích thước: `16px` (`h-4 w-4`).
  - Màu sắc: Trắng (`text-white`).
  - Hiệu ứng: `animate-spin`.
- **Nhãn hiển thị:** Đổi thành "Đang tải hóa đơn..." (được dịch từ `t("invoice_downloading")` qua i18n).

---

## 2. Thông báo Toast (Toast Notifications)

Sử dụng thư viện `sonner` với giao diện màu sắc được tùy chỉnh trực quan:

### 2.1 Toast Cảnh báo Chưa Thanh toán (Unpaid Warning)
- **Kịch bản:** Người dùng bấm "In hóa đơn" khi đơn đặt tour chưa thanh toán thành công.
- **Màu nền:** `#FEF3C7` (Màu vàng nhạt).
- **Màu chữ:** `#F59E0B` (Màu cam đậm).
- **Màu viền:** `#FCD34D`.
- **Nhãn hiển thị:** `t("invoice_unpaid_error")` (Việt: "Hóa đơn chỉ có sau khi thanh toán thành công", Anh: "Invoices are only available after successful payment").

### 2.2 Toast Lỗi Hệ thống (System Error)
- **Kịch bản:** Máy chủ bị lỗi hoặc phản hồi lỗi Blob (ví dụ: lỗi 500, lỗi 400).
- **Màu nền:** `#FEE2E2` (Màu đỏ nhạt).
- **Màu chữ:** `#EF4444` (Màu đỏ).
- **Màu viền:** `#FCA5A5`.
- **Nhãn hiển thị:** Trích xuất tự động từ Blob lỗi hoặc dùng `t("invoice_server_error")`.
