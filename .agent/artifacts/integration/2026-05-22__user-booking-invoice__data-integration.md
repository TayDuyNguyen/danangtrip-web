# Tích hợp Dữ liệu & Luồng API: Hóa đơn PDF (user-booking-invoice)

Tài liệu này đặc tả cơ chế tích hợp dữ liệu từ Backend API, thông qua Axios Client Service Layer, tới giao diện người dùng.

---

## 1. Dòng dữ liệu (Data Pipeline Flow)

Luồng hoạt động từ lúc nhấp chuột của người dùng đến khi lưu file PDF cục bộ:

```mermaid
sequenceDiagram
    actor User as Người dùng
    participant UI as BookingDetailClient (UI)
    participant Svc as bookingService (Axios)
    participant API as Backend Controller (API)

    User->>UI: Bấm nút "In hóa đơn"
    UI->>UI: Kiểm tra thanh toán (pre-flight)
    alt Chưa thanh toán
        UI-->>User: Hiển thị Toast cảnh báo (#FEF3C7)
    else Đã thanh toán
        UI->>UI: Kích hoạt trạng thái loading (bg-[#3385D6])
        UI->>Svc: bookingService.invoice(bookingId)
        Svc->>API: GET /user/bookings/{id}/invoice
        alt API thành công
            API-->>Svc: Trả về 200 OK (MIME: application/pdf, raw binary stream)
            Svc-->>UI: ApiResponse chứa Blob
            UI->>UI: Tạo Object URL (createObjectURL)
            UI->>UI: Click thẻ <a> ẩn tải xuống (.pdf)
            UI->>UI: Thu hồi Object URL (revokeObjectURL)
            UI-->>User: Hiển thị Toast thành công (#ECFDF5)
        else API thất bại
            API-->>Svc: Trả về 400/500 Error (JSON bọc trong Blob)
            Svc-->>UI: Reject Promise (ApiResponse mang rawData là Blob)
            UI->>UI: Đọc text từ Blob lỗi (err.rawData.text())
            UI->>UI: Parse JSON để trích xuất error.message
            UI-->>User: Hiển thị Toast lỗi màu đỏ (#FEE2E2)
        end
        UI->>UI: Tắt trạng thái loading (isDownloading = false)
    end
```

---

## 2. Đặc tả Axios Client & Interceptor

### 2.1 Cấu hình responseType
Do kiểu dữ liệu nhận về là tệp nhị phân PDF, chúng ta cấu hình trực tiếp `responseType: "blob"` cho Axios Request:
```typescript
invoice: (id: number | string): Promise<ApiResponse<Blob>> =>
  axiosInstance.get(API_ENDPOINTS.BOOKINGS.INVOICE(id), { responseType: "blob" }),
```

### 2.2 Xử lý Lỗi đặc biệt với Interceptor
Vì responseType là `"blob"`, khi xảy ra lỗi ở server, Axios vẫn bọc lỗi JSON của server vào một đối tượng `Blob`. Do đó, `src/lib/axios.ts` đã được tùy chỉnh để gán `rawData: data` vào lỗi trả về, cho phép UI Component bắt được Blob thô này và giải nén thành text JSON:
```typescript
const errorResponse: ApiResponse & { rawData?: any } = {
  success: false,
  code: data?.code,
  error_key: data?.error_key,
  user_message: data?.user_message,
  errors: data?.errors,
  error: localizedMessage,
  message: localizedMessage,
  status,
  rawData: data, // Đối tượng Blob lỗi thô từ server
};
return Promise.reject(errorResponse);
```
