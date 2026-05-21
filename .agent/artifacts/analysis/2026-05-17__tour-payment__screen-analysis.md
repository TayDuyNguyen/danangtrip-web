# Screen Analysis: Thanh toán / Kết quả đặt tour (Tour Payment)

## 1. Summary and Scope
- **Mục tiêu:** Xử lý toàn bộ luồng thanh toán sau khi người dùng submit form đặt tour. Chịu trách nhiệm tạo link thanh toán, chuyển hướng đến cổng thanh toán, polling kết quả từ server sau khi cổng thanh toán trả về callback, và hiển thị trạng thái thành công/thất bại.
- **Actor chính:** Khách hàng (User) đã đăng nhập và vừa thực hiện hành động đặt tour.
- **Screen type:** Checkout flow / Status tracker (không phải list hay detail truyền thống).
- **Module liên quan:** Bookings, Payments.

## 2. Design and Token Audit
> [!NOTE]
> **THỐNG NHẤT DESIGN TOKENS:**
> - Mockup gốc mô tả UI theo phong cách Light Mode.
> - Tuy nhiên, đã xác nhận với User là trang thanh toán sẽ tuân thủ nghiêm ngặt **`DESIGN.md`** của dự án (Dark Mode, Glassmorphism, nền `#080808`, chữ `#FFFFFF`, accent `#8B6A55`). Các mã màu Light Mode trong tài liệu `user_payment.md` sẽ được map tương ứng sang bảng màu Dark Mode.

## 3. Component Breakdown

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `PaymentLayout` | [NEW] | Layout | `src/app/[locale]/(main)/(protected)/payment/layout.tsx` | Layout riêng biệt chứa Minimal Header (không dùng header chung để tránh user thoát trang) |
| `PaymentHeader` | [NEW] | Molecule | `src/features/payment/components/PaymentHeader.tsx` | Chứa logo, text "Thanh toán an toàn" và thanh Progress steps |
| `CreatingLinkState` | [NEW] | Organism | `src/features/payment/components/CreatingLinkState.tsx` | Trạng thái hiển thị spinner trong lúc gọi API POST `/payments/create` |
| `RedirectCountdown` | [NEW] | Organism | `src/features/payment/components/RedirectCountdown.tsx` | Hiển thị thông tin đơn và progress bar đếm ngược 3s chuyển hướng |
| `PollingState` | [NEW] | Organism | `src/features/payment/components/PollingState.tsx` | Trạng thái chờ callback, đếm ngược tối đa 30s với spinner |
| `PaymentSuccessCard` | [NEW] | Organism | `src/features/payment/components/PaymentSuccessCard.tsx` | Bảng tóm tắt thông tin vé, tổng tiền sau khi thanh toán xong |
| `PaymentFailedCard` | [NEW] | Organism | `src/features/payment/components/PaymentFailedCard.tsx` | Bảng thông báo lỗi, đếm ngược 15 phút giữ vé để retry |

## 4. Responsive and UI States

| Section | Khởi tạo (Loading) | Thành công (Success) | Thất bại / Hủy (Error) | Hết giờ (Timeout) |
|---|---|---|---|---|
| `Page Container` | Hiển thị `CreatingLinkState` (Loading API) | N/A | N/A | N/A |
| `Redirect Gateway`| Progress bar chạy từ 0->100% trong 3s | Tự động chuyển hướng | N/A | N/A |
| `Polling` | Hiển thị `PollingState` 3s/lần | Chuyển sang `PaymentSuccessCard` | Chuyển sang `PaymentFailedCard` | Khuyến nghị kiểm tra email sau 30s |
| `FailedCard` | N/A | N/A | Hiển thị lỗi tương ứng + Countdown giữ vé 15 phút | N/A |

## 5. Data and API Mapping

| Field / Action | Type | Required | Source | Note |
|---|---|---|---|---|
| `booking_id` | `string/number` | ✓ | Lấy từ Context hoặc URL state | Dùng body cho POST `/payments/create` |
| `payment_method`| `string` | ✓ | Form đặt tour truyền qua | MoMo/VNPay/ZaloPay |
| Create Payment | `mutation` | ✓ | `POST /payments/create` | Trả về payment link để redirect |
| Status Polling | `query` | ✓ | `GET /payments/status/{transaction_code}` | Cần transaction code từ callback |
| Retry Payment | `mutation` | ✗ | `POST /payments/retry/{booking_code}` | Không cần body payload |
| Cancel Booking | `mutation` | ✗ | `POST /user/bookings/{id}/cancel` | Cho phép user hủy đơn nếu thanh toán lỗi |

## 6. Business, Auth & i18n Review
- **Auth Requirement:** 100% bắt buộc đăng nhập. Route phải nằm trong nhóm `(protected)`.
- **Business Rules:**
  - Nếu ở trạng thái *Thất bại*, đơn hàng được giữ (lock) thêm tối đa 15 phút. User có thể gọi `POST /payments/retry` để lấy link mới.
  - Polling trạng thái thanh toán chỉ giới hạn trong vòng 30 giây (mỗi 3 giây = 10 lần request). Quá số lần này sẽ chuyển sang màn hình "Timeout".
  - Chống reload: Cần đảm bảo nếu user f5 trong lúc đang tạo link thì không duplicate đơn hàng (dựa vào `booking_id`).
- **i18n Impact:** Cần namespace mới là `payment.json` chứa các message trạng thái (Đang xử lý, Thành công, Thất bại, Hủy, v.v.).

## 7. Assumptions & Open Questions
1. `[ASSUMPTION]` Khách hàng đến trang `/payment` thông qua việc push URL từ màn đặt tour với query parameter (vd: `/payment?booking_code=...&method=MOMO`) thay vì truyền qua global state. Điều này giúp an toàn nếu user vô tình tải lại trang.
2. `[ASSUMPTION]` API `GET /payments/status/{transaction_code}`: Khi gateway chuyển hướng (callback) về trang của chúng ta, nó sẽ gắn `transaction_code` trên URL để ta bắt lấy và polling.
3. `[OPEN QUESTION]` Giao diện áp dụng theo chuẩn Light Mode (như tài liệu `user_payment.md`) hay cần map về Dark Mode (như `DESIGN.md` hiện tại)? Kế hoạch bước 05 sẽ phụ thuộc trực tiếp vào câu trả lời này.
