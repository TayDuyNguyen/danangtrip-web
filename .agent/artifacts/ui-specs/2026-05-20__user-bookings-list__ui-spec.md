# UI Spec: Tour Booking History (user-bookings-list)

> Feature slug: `user-bookings-list`  
> Date: 2026-05-20  
> Source analysis: `2026-05-20__user-bookings-list__screen-analysis.md`  

---

## 1) Summary
- **UI Goal**: Cho phép khách du lịch xem, lọc và hủy các tour đã đặt. Trình bày danh sách trực quan, đồng bộ màu sắc theo phong cách thiết kế tối giản, sang trọng (premium dark mode) của DanangTrip.
- **Main Interface**: Trang `/bookings` chứa thanh tìm kiếm, tab lọc theo trạng thái (`Tất cả`, `Chờ xác nhận`, `Đã xác nhận`, `Hoàn tất`, `Đã hủy`), danh sách các thẻ tour đặt và hộp thoại hủy đơn (`CancelBookingDialog`).

## 1.1) UI Delivery Goal
- **Above-the-fold content**:
  - Tiêu đề trang: "Đơn đặt tour của tôi".
  - Thanh tìm kiếm và Tabs lọc trạng thái ngang.
  - Các thẻ đặt tour đầu tiên (chứa mã đơn hàng, tên tour, ngày đi, tổng tiền, trạng thái).
- **Secondary/Supporting UI**:
  - Phân trang dạng đơn giản (Prev/Next/Số trang).
  - Modal "Yêu cầu hủy đơn" có nhập lý do và cảnh báo điều khoản hoàn tiền.

---

## 2) Component Matrix

### [REUSE]
- **Button**: `src/components/ui/button.tsx` (hoặc dựng lại class Tailwind tương thích với primary button #171717, border #262626, radius full).
- **Skeleton**: `src/components/ui/skeleton.tsx` (nếu có, để tạo các loading skeleton).
- **Dialog**: `src/components/ui/dialog.tsx` (dùng để làm Cancel Dialog).
- **Badge**: Sử dụng Badge của hệ thống hoặc tự tạo CSS glass-badge.

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `BookingsHistoryClient` | Feature organism | Client container quản lý state (lọc, tìm kiếm, phân trang), fetch dữ liệu, hiển thị empty/loading/error states. | `locale: string` |
| `BookingHistoryCard` | Feature molecule | Thẻ hiển thị một đơn đặt tour, bao gồm thông tin chi tiết (ngày đặt, ngày khởi hành, thành viên, tổng tiền, trạng thái) và nút bấm hủy/đánh giá. | `booking: Booking`, `onCancelClick: (booking: Booking) => void` |
| `CancelBookingDialog` | Feature molecule | Modal điền lý do hủy đơn, tích hợp Zod validation `cancelBookingSchema`. | `isOpen: boolean`, `onClose: () => void`, `bookingId: number \| string`, `onSubmitSuccess: () => void` |

### [MOD]
- Không chỉnh sửa các component chung của hệ thống để tránh phá vỡ giao diện khác.

---

## 3) UI States

| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| `BookingsHistoryClient` | Skeleton list giữ nguyên khung layout, không dùng Spinner làm xê dịch bố cục. | `TourEmptyState` hiển thị biểu tượng kính lúp, thông điệp hướng dẫn và CTA "Khám phá Tour ngay". | Hiển thị thông báo lỗi kèm nút "Thử lại". | N/A (Hiển thị danh sách thẻ đơn hàng). | N/A |
| `BookingHistoryCard` | N/A | N/A | N/A | N/A | Các nút hành động chuyển sang trạng thái loading/disabled khi đang xử lý hủy. |
| `CancelBookingDialog` | Form disabled, nút Xác nhận hiển thị trạng thái loading. | N/A | Hiển thị lỗi xác thực Zod dưới ô nhập hoặc lỗi API dạng toast. | Toast thông báo thành công và tự động đóng modal. | Nút gửi bị vô hiệu hóa nếu lý do chưa đạt 10 ký tự. |

---

## 3.1) Motion / Interaction Notes

| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| **Tab Lọc Trạng thái** | Hiệu ứng chuyển động màu chữ (`text-white`), đường gạch chân trượt nhẹ (nếu dùng framer-motion) hoặc highlight viền. | Fade-in khi thay đổi. | Đem lại cảm giác mượt mà khi lọc. |
| **Thẻ đặt tour (Card)** | Hover: Tăng nhẹ độ sáng viền từ `#262626` lên `#404040` hoặc viền accent `#8B6A55` mỏng, nền tối hơi bóng lên. | Trượt nhẹ từ dưới lên (fade-in-up, duration 300ms). | Nhấn mạnh tính tương tác. |
| **Nút bấm Hành động** | Hover: scale nhẹ hoặc thay đổi opacity của màu nền. | N/A | |
| **Cancel Dialog** | Fade-in overlay và scale-up nhẹ khung modal (ease-out, duration 200ms). | Mượt mà, đóng/mở tự nhiên. | |

---

## 4) Responsive Notes

| Breakpoint | Behavior | Notes |
|---|---|---|
| **Mobile (< 768px)** | - Tabs hiển thị dạng cuộn ngang (overflow-x-auto, no-scrollbar).<br>- Thẻ đặt tour sắp xếp theo cột dọc (flex-col), thu nhỏ ảnh thumbnail tour hoặc đưa ảnh lên đầu thẻ.<br>- Nút bấm hành động kéo dãn full chiều ngang. | Đảm bảo ngón tay dễ chạm bấm. |
| **Tablet (768px - 1024px)** | - Thẻ đặt tour bố cục 2 cột (ảnh bên trái, text bên phải).<br>- Nút bấm nằm ở góc dưới cùng bên phải. | Giữ nguyên lưới căn chỉnh của dòng. |
| **Desktop (> 1024px)** | - Layout rộng, thẻ đặt tour dạng hàng ngang sang trọng, ảnh chiếm 1/5 chiều ngang.<br>- Nút bấm căn sang góc phải, kích thước chuẩn. | Trải nghiệm premium thoáng đãng. |

---

## 5) Files Expected To Change
- `src/features/tour/components/BookingsHistoryClient.tsx` [NEW]
- `src/features/tour/components/BookingHistoryCard.tsx` [NEW]
- `src/features/tour/components/CancelBookingDialog.tsx` [NEW]

---

## 6) Build Order
1. **Atoms & Helper UI**: Tạo các element phụ trợ hoặc import các UI primitive.
2. **CancelBookingDialog**: Xây dựng modal hủy đơn trước vì nó độc lập.
3. **BookingHistoryCard**: Phát triển thẻ hiển thị tour và cắm các nút hành động.
4. **BookingsHistoryClient**: Lắp ráp màn hình lớn, tích hợp bộ lọc, phân trang, và state.
5. **Page Assembly**: Cấu hình trang `src/app/[locale]/(main)/(protected)/bookings/page.tsx`.
