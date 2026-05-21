# Data Integration: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

- **Feature slug:** `user-booking-by-code`
- **Ngày thực hiện:** 2026-05-21
- **Trạng thái:** Tích hợp dữ liệu thành công với API endpoint `GET /user/bookings/code/{booking_code}`.

---

## 1) Data Query Pipeline
Chúng ta sử dụng TanStack Query v5 để quản lý vòng đời dữ liệu của truy vấn đơn hàng bằng mã đơn.

```typescript
export function useBookingDetailByCode(bookingCode: string) {
  return useQuery({
    queryKey: ["bookings", "detail-by-code", bookingCode],
    queryFn: () => bookingService.detailByCode(bookingCode).then((res) => res.data),
    enabled: Boolean(bookingCode),
    staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 60 giây đầu
  });
}
```

- **Query Key:** `["bookings", "detail-by-code", bookingCode]`. Key này nằm chung nhánh `bookings` nên khi bất kỳ hành động hủy đơn nào xảy ra (qua `useCancelBooking` đột biến mutation), cache query của chi tiết mã đơn hàng cũng sẽ tự động được thu hồi (invalidate) nhờ cấu hình:
  ```typescript
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  }
  ```
- **Conditional Fetching:** Chỉ kích hoạt khi `bookingCode` có giá trị thực tế (tránh gọi API rác với giá trị `undefined` hoặc rỗng).

---

## 2) Secondary Action Integration (Action Flow Mapping)
Khi dữ liệu được tải thành công từ endpoint tra cứu theo mã đơn hàng, đối tượng `booking` được trả về sẽ có ID số thực tế `booking.id`.
Chúng ta sử dụng ID này để làm đối số cho các hành động phụ tiếp theo:

### A. Hủy đơn hàng (Cancel Booking Mutation)
- Component tích hợp: `CancelBookingDialog` nhận prop `bookingId={booking.id}`.
- Khi người dùng xác nhận và nhập lý do hủy hợp lệ, mutation `useCancelBooking` sẽ được kích hoạt để thực hiện yêu cầu hủy lên API: `POST /user/bookings/{id}/cancel`.
- Sau khi hủy thành công, nó sẽ tự động kích hoạt refetch của query detail để cập nhật trạng thái hiển thị của Timeline sang `cancelled`.

### B. Tải hóa đơn dạng JSON
- Khi nhấn nút `Tải hóa đơn (JSON)`, ứng dụng sẽ gọi hàm: `bookingService.invoice(booking.id)`.
- Kết quả nhận được sẽ được serialize thành tệp tin văn bản JSON và tự động đẩy xuống trình duyệt để tải về.
