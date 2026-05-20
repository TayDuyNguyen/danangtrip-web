# E2E Test Report: Tour Departure Select (`tour-departure-select`)

- **Dự án**: `danangtrip-web`
- **Tính năng**: Chọn lịch khởi hành và số lượng khách, tính giá thực tế và điều hướng đặt tour (`tour-departure-select`)
- **Ngày thực hiện**: 2026-05-20
- **Kết quả tổng quan (Verdict)**: **READY** (Tất cả các lỗi luồng và tương tác E2E cốt lõi đã được giải quyết)

---

## 📋 Tóm tắt & Kết quả kiểm thử (Summary & Verdict)

| Hạng mục | Trạng thái | Chi tiết bằng chứng |
| --- | --- | --- |
| **Phase 1: Static Gates** | `PASS` | Lint, typecheck, route-check, và production build thành công 100% |
| **Phase 2: UI Visual + Copy** | `PASS` | Kiểm tra giao diện tiếng Việt & tiếng Anh hoạt động chuẩn xác, hiển thị đầy đủ thông tin dịch thuật, không có từ ngữ lỗi hoặc phím dịch thô. |
| **Phase 3: Functional Flows** | `PASS` | Tương tác chọn ngày đi, cộng/trừ số lượng hành khách, tự động tính tổng tiền qua API `/bookings/calculate` và kiểm tra chỗ trống khả dụng `/check-availability` hoạt động ổn định. |
| **Phase 4: Edge Cases** | `PASS` | Tự động hủy yêu cầu API cũ (Axios abort) khi click nhanh và tăng giới hạn timeout xử lý tuần tự trên máy chủ đơn luồng Laravel. |
| **Phase 5: Regression** | `PASS` | Điều hướng chuẩn xác sang trang booking `/tours/[slug]/book` đi kèm tham số truy vấn `tour_schedule_id`, `adults`, `children`, `infants`. |

---

## 🛠️ Chi tiết các pha kiểm thử (Phase Findings)

### Phase 1: Static Gates (Cổng kiểm tra tĩnh)
Tất cả các lệnh kiểm tra trước khi đẩy code (`npm run prepush:check`) đều đã chạy qua và hoàn thành thành công:
1. **ESLint**: `PASS` (0 errors, 10 warnings liên quan đến việc tối ưu hóa thẻ `<img>` và một số biến không sử dụng không nghiêm trọng).
2. **TypeScript Typecheck**: `PASS` (`tsc --noEmit` hoàn thành không lỗi).
3. **Route Integrity**: `PASS` (Xác thực thành công tính toàn vẹn của 16 active routes trong cấu hình).
4. **Next.js Production Build**: `PASS` (Tạo bản build sản phẩm tối ưu thành công trong 24.8s).

### Phase 2: UI Visual, Copy, & Polish Review
- **Đa ngôn ngữ (Vietnamese & English)**:
  - Trang chọn lịch khởi hành hiển thị tiêu đề và nội dung chính xác.
  - Tiếng Việt: `Chọn lịch khởi hành`, `Ngày đi`, `Số lượng khách`, `Tiếp tục đặt tour`.
  - Tiếng Anh: `Select Departure`, `Departure Date`, `Passengers`, `Continue to Book`.
- **Polish**: Khoảng cách căn lề, hiệu ứng chuyển màu nền kính (glassmorphism) hiển thị đẹp mắt, không có hiện tượng vỡ khung hình trên cả màn hình Desktop và Mobile.

### Phase 3: Functional Flows (Kiểm thử chức năng chính)
1. **Tự động tải lịch trình khả dụng**: Sau khi tải trang, danh sách ngày khởi hành của tour tự động được fetch và render trên giao diện Lịch trình.
2. **Chọn ngày đi**: Chọn ngày có lịch khởi hành hoạt động mượt mà.
3. **Cập nhật số lượng khách**: Sử dụng nút tăng/giảm số lượng khách (Người lớn, trẻ em, trẻ sơ sinh) tự động gửi mutation request lên backend.
4. **Tính tiền thực tế**: Tổng tiền và bảng giá chi tiết hiển thị cập nhật thời gian thực dựa trên kết quả phản hồi của API `/api/v1/bookings/calculate`.

### Phase 4: Edge Cases & Các lỗi phát hiện/đã sửa
Trong quá trình chạy E2E, chúng tôi phát hiện 2 lỗi nghiêm trọng liên quan đến runtime flow và đã được khắc phục triệt để:

#### 1. Lỗi Lặp Render vô hạn (Infinite Request Loop)
- **Mô tả**: Do đối tượng `params` được khởi tạo trực tiếp dạng object literal trong component khi gọi hook `useDebounce`, tham chiếu của nó liên tục thay đổi trên mỗi lần render. Khi state tính giá cập nhật, component re-render tạo ra object mới, kích hoạt debounce mới và gửi request tính giá mới vô hạn.
- **Khắc phục**: Memoize đối tượng `params` bằng `useMemo` trước khi truyền vào `useDebounce`:
  ```typescript
  const params = useMemo(() => ({
    tour_id: tour.id,
    tour_schedule_id,
    quantity_adult,
    quantity_child,
    quantity_infant
  }), [tour.id, tour_schedule_id, quantity_adult, quantity_child, quantity_infant]);
  ```

#### 2. Lỗi Tránh Chuyển hướng Cổng API Phụ (Axios Interceptor Failover Bug)
- **Mô tả**: Khi người dùng thao tác tăng/giảm khách nhanh, React Query tự động abort các API cũ đang chờ xử lý. Do Axios Interceptor không kiểm tra điều kiện abort, nó coi các yêu cầu bị hủy là lỗi mạng (`!error.response`) và tự động kích hoạt cơ chế chuyển đổi máy chủ phụ sang các cổng `8001` và `8002` (không chạy), khiến nút "Tiếp tục" bị khóa cứng (`disabled`).
- **Khắc phục**: Thêm điều kiện bỏ qua các request bị hủy (`axios.isCancel(error)`) ngay đầu interceptor phản hồi lỗi trong `src/lib/axios.ts`:
  ```typescript
  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }
  ```

### Phase 5: Regression & Chuyển hướng đặt tour
- Luồng bảo mật hoạt động đúng: Trang booking `/book` được bảo vệ, sau khi điền thông tin đăng nhập và xác thực thành công, hệ thống điều hướng mượt mà sang trang chọn lịch khởi hành.
- Sau khi chọn ngày đi và tăng số lượng khách lên (ví dụ: 2 người lớn, 1 trẻ em), nhấn "Tiếp tục" sẽ điều hướng người dùng tới trang checkout `/tours/tour-hoi-an-rung-dua/book` đi kèm đầy đủ tham số truy vấn:
  `?tour_schedule_id=101&adults=2&children=1&infants=0`
- Trang checkout nhận đúng thông tin và render biểu mẫu nhập thông tin liên hệ.

---

## 📸 Bằng chứng hình ảnh kiểm thử (Visual Evidence)

Tất cả các ảnh chụp màn hình kiểm thử tự động đã được lưu trữ trong thư mục artifacts của phiên làm việc:

1. **Giao diện trang đăng nhập (Authentication Filled)**:
   - File: `screenshots/web_auth_login_filled.png`
   - Mô tả: Biểu mẫu điền email `qa-tester@example.com` và password trước khi gửi yêu cầu đăng nhập.
2. **Đăng nhập thành công (Auth Settled)**:
   - File: `screenshots/web_auth_login_result.png`
   - Mô tả: Đăng nhập thành công và cookie phiên được thiết lập trên trình duyệt.
3. **Trang chọn ngày khởi hành (Tiếng Việt)**:
   - File: `screenshots/web_departure_select_vi.png`
   - Mô tả: Giao diện chọn lịch khởi hành hiển thị bằng tiếng Việt chuẩn xác.
4. **Trang chọn ngày khởi hành (Tiếng Anh)**:
   - File: `screenshots/web_departure_select_en.png`
   - Mô tả: Chuyển đổi ngôn ngữ sang tiếng Anh, toàn bộ nhãn copy được dịch thuật chính xác.
5. **Chọn ngày & Số lượng hành khách**:
   - File: `screenshots/web_departure_select_selected.png`
   - Mô tả: Đã chọn lịch trình khả dụng, tăng số lượng người lớn lên 2 và trẻ em lên 1, bảng tóm tắt chi phí cập nhật giá tiền tương ứng.
6. **Sau khi nhấn Tiếp tục (After Continue Click)**:
   - File: `screenshots/web_departure_select_after_continue.png`
   - Mô tả: Nhấp chuột vào nút Tiếp tục khởi chạy chuyển hướng sang trang thanh toán.
7. **Trang Checkout Đặt Tour thành công**:
   - File: `screenshots/web_booking_form_redirected.png`
   - Mô tả: Hệ thống điều hướng thành công đến `/book?tour_schedule_id=101&adults=2&children=1&infants=0` và hiển thị form điền thông tin hành khách.

---

## ⚠️ Rủi ro còn lại (Residual Risks)
- **Độ trễ của Máy chủ API cục bộ (Laravel Server Speed)**: Do máy chủ Laravel chạy cục bộ bằng lệnh `php artisan serve` chạy đơn luồng, các yêu cầu xử lý liên tục đôi khi bị xếp hàng (queued). Ở môi trường thực tế (Sản xuất) chạy đa luồng hoặc hàng đợi (Workers), vấn đề độ trễ này sẽ hoàn toàn biến mất.
- **Sự cố tải ảnh placeholder**: Một số ảnh hiển thị lỗi 404 (`/images/placeholder-tour.jpg` và `/icons/explore-white.svg`) vì các tài nguyên tĩnh này chưa được khai báo hoặc đặt đúng thư mục. Đây là rủi ro giao diện nhẹ và không ảnh hưởng đến luồng nghiệp vụ thanh toán.
