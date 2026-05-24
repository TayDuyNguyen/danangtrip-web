# Đặc tả Tương tác & Nghiệp vụ: Hóa đơn PDF (user-booking-invoice)

Tài liệu này chi tiết hóa các kịch bản tương tác người dùng, các kiểm tra nghiệp vụ chặn (pre-flight checks), cơ chế giải phóng tài nguyên và xử lý lỗi nâng cao.

---

## 1. Kiểm tra nghiệp vụ Chặn (Pre-flight Verification)

Trước khi tiến hành gửi bất cứ yêu cầu tải hóa đơn nào tới máy chủ, phía Frontend thực hiện kiểm tra an toàn tại chỗ:

```typescript
if (booking.payment_status !== "success" && booking.payment_status !== "paid") {
  // Hiển thị toast warning với màu sắc và nội dung quy định
  return;
}
```

### Lý do kỹ thuật:
- **Tối ưu băng thông:** Tránh các request vô ích tới server khi biết chắc chắn đơn chưa được thanh toán (chưa có hóa đơn).
- **Trải nghiệm người dùng:** Thông báo tức thời (< 50ms) cho người dùng biết lý do tại sao không in được hóa đơn thay vì chờ server phản hồi lâu.

---

## 2. Quản lý Tài nguyên Trình duyệt (Object URL Lifecycle Management)

Khi gọi API lấy dữ liệu nhị phân Blob thành công, chúng ta sử dụng cơ chế tạo Object URL tạm thời để kích hoạt tải xuống. Việc quản lý vòng đời của Object URL này là vô cùng quan trọng để tránh rò rỉ bộ nhớ (Memory Leak) ở Client:

1. **Khởi tạo URL:** `const blobUrl = window.URL.createObjectURL(res.data);`
2. **Kích hoạt download:** Tạo thẻ `<a>` ẩn, gán thuộc tính `href = blobUrl`, đính vào body, click, rồi gỡ bỏ (`remove`).
3. **Giải phóng URL tức thời:** Gọi `window.URL.revokeObjectURL(blobUrl);` ngay sau khi tải để báo cho trình duyệt giải phóng vùng nhớ chứa Blob đó.

---

## 3. Phân giải Lỗi Blob (Safe Binary Error Parsing)

Khi server trả về mã lỗi `400/500`, do interceptor của axios nhận `responseType: "blob"`, nó trả về một lỗi ApiResponse trong đó `err.rawData` là một `Blob`.
Để trích xuất được nguyên nhân lỗi thực sự, chúng ta thực hiện phân giải theo thứ tự ưu tiên:

```typescript
let errorMessage = t("invoice_server_error");
if (err?.rawData instanceof Blob) {
  try {
    // Chuyển đổi Blob nhị phân thành chuỗi văn bản
    const errorText = await err.rawData.text();
    // Phân tích chuỗi văn bản thành JSON
    const errorJson = JSON.parse(errorText);
    // Trích xuất thuộc tính lỗi
    errorMessage = errorJson.message || errorJson.user_message || errorMessage;
  } catch (parseErr) {
    console.error("Failed to parse error blob", parseErr);
  }
} else if (err?.message) {
  errorMessage = err.message;
}
```

Điều này đảm bảo cho dù backend trả về lỗi nghiệp vụ chi tiết (ví dụ: "Đơn hàng của bạn đã bị hủy, không thể xuất hóa đơn") thì giao diện người dùng vẫn hiển thị được chính xác thông điệp đó, thay vì chỉ hiện "Không thể tải hóa đơn. Vui lòng thử lại.".
