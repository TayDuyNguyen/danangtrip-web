# Hợp đồng API: Tải Hóa đơn PDF (user-booking-invoice)

Tài liệu này đặc tả sự thay đổi của endpoint hóa đơn PDF để hỗ trợ dữ liệu nhị phân (`application/pdf`) thay vì giả lập JSON như trước đây.

---

## 1. Phân tích Endpoint và Đặc tả Nhị phân

### 1.1 Tải Hóa đơn PDF
- **Endpoint:** `GET /api/v1/user/bookings/{id}/invoice`
- **Định nghĩa Route Backend:** `BookingController@invoice`
- **Xác thực:** 🔐 Cần Token Bearer (`Authorization: Bearer <token>`)
- **Mô tả:** Trả về tệp tin PDF trực tiếp để tải xuống hoặc xem trước trên trình duyệt.
- **Tiêu đề phản hồi dự kiến (Headers):**
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="invoice.pdf"` hoặc `inline`
- **Kiểu dữ liệu phía Client:** nhị phân `Blob`

---

## 2. Thay đổi tại Client Service Layer

Để hỗ trợ tệp nhị phân, Axios cần biết cách xử lý luồng nhị phân thông qua tham số `responseType: "blob"`.

### 2.1 Định nghĩa Dịch vụ:
```typescript
// Sửa đổi trong src/services/booking.service.ts
export const bookingService = {
  // ...
  invoice: (id: number | string): Promise<ApiResponse<Blob>> =>
    axiosInstance.get(API_ENDPOINTS.BOOKINGS.INVOICE(id), { responseType: "blob" }),
  // ...
};
```

---

## 3. Quản lý Lỗi Giao dịch (Safe Binary Error Handling)

Khi API gặp lỗi (ví dụ: `400 Bad Request` do đơn chưa thanh toán, hoặc `500 Server Error`), backend vẫn trả về nội dung lỗi dạng JSON nhưng Axios (vì được cấu hình nhận `blob`) sẽ nhận được phản hồi lỗi dưới dạng `Blob` nhị phân chứa chuỗi ký tự JSON.

### Phương án phân giải lỗi:
Khi bắt được lỗi `AxiosError`, chúng ta kiểm tra dữ liệu phản hồi:
1. Nếu `error.response.data` là một đối tượng `Blob` và kiểu của nó là `application/json` (hoặc chúng ta tiến hành đọc Blob để kiểm tra cấu trúc):
2. Thực hiện đọc dữ liệu text từ Blob bằng:
   ```typescript
   const text = await error.response.data.text();
   const errorJson = JSON.parse(text);
   const message = errorJson.message || "Tải hóa đơn thất bại.";
   ```
3. Hiển thị thông điệp lỗi chính xác từ backend thay vì thông báo lỗi chung chung.

---

## 4. Danh sách các File ảnh hưởng

- `src/services/booking.service.ts` (Sửa kiểu dữ liệu và tham số Axios)
- `src/features/tour/components/BookingDetailClient.tsx` (Sửa đổi logic nút in hóa đơn)
