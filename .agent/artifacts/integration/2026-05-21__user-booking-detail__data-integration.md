# Tích hợp Dữ liệu: Chi tiết Đơn đặt tour (user-booking-detail)

Tài liệu này đặc tả cách thức tích hợp luồng dữ liệu động bằng TanStack Query (React Query) v5 giữa client (`danangtrip-web`) và API backend (`danangtrip-api`).

---

## 1. Truy vấn Chi tiết Đơn hàng (Query Integration)

### 1.1 Custom Hook: `useBookingDetail`
Truy vấn được định cấu hình trong [useBookingQueries.ts](file:///D:/DATN/danangtrip-web/src/features/tour/hooks/useBookingQueries.ts):
```typescript
export function useBookingDetail(id: number | string) {
  return useQuery({
    queryKey: ["bookings", "detail", id],
    queryFn: () => bookingService.detail(id).then((res) => res.data),
    staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 1 phút
  });
}
```

### 1.2 Luồng xử lý trạng thái (Data States Lifecycle)
- **Trạng thái tải (Loading):** Hiển thị màn hình khung xương (Skeletons) cấu trúc thật để tránh dịch chuyển bố cục đột ngột.
- **Trạng thái thành công (Success):** Render toàn bộ thông tin chi tiết:
  - `booking.booking_code` & `booking.booked_at`
  - `booking.booking_status` truyền vào `BookingStatusTimeline`
  - Đầu mục đầu tiên trong `booking.booking_items` hoặc `booking.items` truyền vào `BookingTourInfoCard`
  - Thông tin khách hàng đại diện truyền vào `BookingCustomerInfoCard`
  - Bảng chi tiết giá thanh toán truyền vào `BookingPriceSummaryCard`
- **Trạng thái lỗi (Error):** Hiển thị giao diện thông báo lỗi trực quan với tùy chọn "Thử lại" kích hoạt hàm `refetch()` từ React Query.

---

## 2. Hủy đơn đặt tour (Mutation Integration)

### 2.1 Custom Hook: `useCancelBooking`
Sử dụng mutation trong [useBookingQueries.ts](file:///D:/DATN/danangtrip-web/src/features/tour/hooks/useBookingQueries.ts):
```typescript
export function useCancelBooking() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: CancelBookingPayload }) => 
      bookingService.cancel(id, payload).then((res) => res.data),
    onSuccess: () => {
      // Làm mới toàn bộ cache liên quan đến đơn hàng
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
```

### 2.2 Quy trình kích hoạt & phản hồi (Interactive Flow)
1. Người dùng bấm **"Hủy đơn hàng"** trên Header trang chi tiết.
2. Mở dialog xác nhận `CancelBookingDialog`.
3. Validate lý do hủy qua Zod schema (tối thiểu 10 ký tự). Nếu không đạt, hiển thị lỗi inline ngay lập tức.
4. Gửi request `POST /api/v1/user/bookings/{id}/cancel` kèm payload `{ cancellation_reason }`.
5. Khi API phản hồi thành công:
   - Hiển thị toast thành công: *"Đơn hàng đã được yêu cầu hủy thành công."*
   - Kích hoạt `onSubmitSuccess()` (callback gọi `refetch()` của query chi tiết đơn hàng).
   - Đóng dialog. Trạng thái và dòng thời gian cập nhật ngay lập tức sang **"Đã hủy"** (màu đỏ).

---

## 3. Tải hóa đơn & In ấn (Invoice Action Integration)

- **Tải hóa đơn (JSON):**
  - Hàm `handleDownloadInvoice` gọi trực tiếp endpoint `bookingService.invoice(id)`.
  - Dữ liệu hóa đơn nhận về được định dạng lại thành file JSON đẹp và tự động kích hoạt tải xuống trình duyệt dưới tên `invoice-[MÃ_ĐƠN_HÀNG].json`.
- **In hóa đơn (window.print):**
  - Hàm `handlePrint` gọi phương thức in của trình duyệt (`window.print()`).
  - Giao diện in được tối ưu hóa thông qua các thẻ ẩn/hiển thị dành riêng cho in ấn (`print:hidden`, `hidden print:block`), giúp tạo ra một trang hóa đơn sạch đẹp không chứa thanh điều hướng, nút bấm phụ, v.v.
