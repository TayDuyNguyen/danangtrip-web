# Phân tích Giao diện: Trung tâm Thông báo (notifications)

- **Feature Slug:** `notifications`
- **Ngày thực hiện:** 2026-05-22
- **Nguồn tài liệu:**
  - [user_notifications.md](file:///D:/DATN/DATN_Tài%20liệu/docs/page/user_notifications.md) (Tài liệu đặc tả nghiệp vụ)
  - [api_list.md](file:///D:/DATN/DATN_Tài%20liệu/docs/api/api_list.md) (Định nghĩa API)
  - [notification.service.ts](file:///D:/DATN/danangtrip-web/src/services/notification.service.ts) (Lớp truyền tải dữ liệu frontend)
  - [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md) (Quy chuẩn thiết kế dự án)

---

## 1) Summary
- **Mục đích:** Cho phép người dùng xem danh sách các thông báo cá nhân (đơn hàng, đánh giá, hệ thống, khuyến mãi). Cung cấp tùy chọn lọc thông báo chưa đọc, đánh dấu đã đọc một hoặc tất cả, xóa thông báo và chuyển hướng nhanh tới thực thể liên quan (Deep-linking) như trang chi tiết đơn hàng hoặc chi tiết bài viết/địa điểm.
- **Actor chính:** Người dùng đã xác thực (🔐 Protected Route).
- **Feature/Module:** Thông báo (`notifications`).
- **Source inputs đã dùng:** `user_notifications.md`, `DESIGN.md`, `api_list.md`, `notification.service.ts`, `notification.types.ts`.

---

## 2) Design Token Audit
Bám sát quy chuẩn thẩm mỹ tối giản, cao cấp của dự án tại [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md):
- **Màu sắc & Trực quan (Glassmorphism):**
  - Nền surface thẻ thông báo: Sử dụng nền trong suốt kèm hiệu ứng kính mờ `#080808/40` kết hợp viền mảnh `#262626` và blur nền `backdrop-blur-md`.
  - Trạng thái chưa đọc (Unread State): Hiển thị chấm tròn màu thương hiệu `#8B6A55` ở góc phải thẻ, và một viền mờ màu `#8B6A55/10` chạy dọc bên trái thẻ thông báo để báo hiệu. Khi được đánh dấu đã đọc, viền này biến mất mượt mà (`transition-all duration-300`).
  - Biểu tượng danh mục (Semantic Icons):
    - **Booking**: Icon vé/giỏ hàng màu xanh dương (#3B82F6) để hiển thị thông báo về đơn đặt phòng/tour.
    - **Rating**: Icon ngôi sao màu vàng hổ phách (#F59E0B) hiển thị thông báo phản hồi đánh giá.
    - **System**: Icon thông tin màu xám/trắng (#9CA3AF) hiển thị thông báo cập nhật tài khoản, bảo trì hệ thống.
    - **Promotion**: Icon nhãn giá màu cam (#F97316) hiển thị các thông báo khuyến mãi du lịch.
- **Hoạt ảnh (Animations):**
  - Hiệu ứng xuất hiện: Danh sách thẻ hiển thị theo dạng trượt nhẹ từ dưới lên `reveal-up` và trễ hoạt ảnh tăng dần `reveal-delay-X` (100ms, 200ms, 300ms) để tạo nhịp điệu chuyển động sang trọng.
  - Hiệu ứng xóa thẻ: Khi nhấn xóa thông báo, thẻ sẽ biến mất với hiệu ứng thu nhỏ `scale-95` và làm mờ `opacity-0` diễn ra trong 250ms trước khi bị loại bỏ khỏi DOM.
- **Kiểu chữ (Typography):**
  - Tiêu đề chính "Thông báo" sử dụng cỡ chữ `30px` đến `36px` font `Inter` với độ đậm `font-extrabold` màu trắng `#FFFFFF` phù hợp với cấu trúc tiêu đề các trang Profile/Favorites hiện tại.
  - Nội dung thông báo hiển thị font chữ Inter cỡ chữ `14px` màu xám trung tính `#d4d4d4`. Thời gian tạo thông báo hiển thị cỡ chữ `12px` font `SFMono-Regular` màu `#737373` để tăng tính kỹ thuật và chi tiết.

---

## 3) Component Breakdown

Giao diện sẽ được chia thành các component nhỏ, đặt dưới thư mục `src/features/notifications/components/` để đảm bảo tính cô lập và khả năng tái sử dụng.

### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `ProtectedLayout` | `src/app/[locale]/(main)/(protected)/layout.tsx` | ✗ Không | Quản lý bảo vệ tuyến đường yêu cầu đăng nhập. |
| `Header` | `src/components/layout/Header.tsx` | ✗ Không | Header thanh điều hướng chính của website. |
| `Footer` | `src/components/layout/Footer.tsx` | ✗ Không | Footer chân trang của website. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `NotificationsPageClient` | Client Component chính điều phối luồng dữ liệu, quản lý trạng thái phân trang, bộ lọc tab (Tất cả/Chưa đọc), kích hoạt các mutations và toast thông báo thành công/thất bại. | Organism (Client Shell) | N/A |
| `NotificationsHeader` | Hiển thị tiêu đề "Thông báo" và nút hành động "Đánh dấu tất cả đã đọc" (hiển thị có điều kiện). | Molecule | `{ unreadCount: number, onMarkAllRead: () => void, isMarkingAll: boolean }` |
| `NotificationsFilterTabs` | Các tab chuyển đổi lọc giữa "Tất cả" và "Chưa đọc" kèm số đếm phụ lục. | Molecule | `{ activeTab: 'all' \| 'unread', onChange: (tab: 'all' \| 'unread') => void, unreadCount: number, totalCount: number }` |
| `NotificationItemCard` | Thẻ hiển thị thông báo chi tiết bao gồm icon danh mục, tiêu đề, thời gian tạo, chấm chưa đọc và nút xóa thông báo. | Molecule | `{ item: Notification, onMarkRead: (id: number) => void, onRemove: (id: number) => void, isRemoving: boolean }` |
| `NotificationsEmptyState` | Hiển thị khi danh sách thông báo rỗng hoặc bộ lọc rỗng, kèm hình minh họa và nút điều hướng CTA. | Molecule | `{ type: 'all' \| 'unread' }` |
| `NotificationsSkeleton` | Hiển thị khung xương giả lập dữ liệu trong quá trình tải. | Molecule | N/A |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `routes.ts` | `src/config/routes.ts` | Khai báo hằng số `NOTIFICATIONS: "/notifications"` trong `PROTECTED_ROUTES` và xuất ra ngoài. | Cấu hình định tuyến trong ứng dụng. |
| `middleware.ts` | `src/middleware.ts` | Thêm tuyến đường `"/notifications"` vào danh sách `protectedRoutes`. | Kích hoạt bảo vệ định tuyến ở tầng mạng (Edge Middleware). |
| `request.ts` | `src/i18n/request.ts` | Import và đăng ký file ngôn ngữ mới `notifications.json` cho cả hai ngôn ngữ `vi` và `en`. | Hỗ trợ dịch đa ngôn ngữ cho tính năng thông báo. |

---

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | Bố cục căn giữa có độ rộng tối đa `max-w-4xl mx-auto px-4`. Các thẻ hiển thị hàng dọc với các nút hành động (Đánh dấu đã đọc, Xóa) hiển thị tinh tế khi hover. | Baseline |
| Tablet (768-1023px) | Bố cục thu hẹp nhẹ. Nút xóa hiển thị trực tiếp thay vì hover để thân thiện với cử chỉ chạm vuốt trên máy tính bảng. | Hiển thị trực quan các nút hành động. |
| Mobile (<768px) | Tiêu đề và nút "Đánh dấu tất cả đã đọc" được xếp chồng theo chiều dọc (flex-col). Khoảng cách padding thẻ thu gọn nhẹ. Vuốt nhẹ hoặc nút bấm xóa thu gọn tối đa để tránh tràn giao diện. | Chuyển đổi linh hoạt layout và nút hành động. |

---

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Trang Thông báo (`NotificationsPageClient`) | Hiển thị `NotificationsSkeleton` nhấp nháy êm dịu | Hiển thị `NotificationsEmptyState` | Hiển thị thông báo lỗi kèm nút "Tải lại" (Retry) | Hiển thị danh sách thẻ thông báo | Vô hiệu hóa phân trang và các tab lọc trong lúc tải | N/A |
| Thẻ Thông báo (`NotificationItemCard`) | Khung xương skeleton màu nền `#171717` nhấp nháy nhẹ | N/A | N/A | Hiển thị dữ liệu thật của thông báo | Bị làm mờ và vô hiệu hóa tương tác khi đang trong mutation xóa (`opacity-50 pointer-events-none`) | Thay đổi nhẹ viền sang màu `#8B6A55/30`, hover nút xóa hiển thị màu đỏ nhạt |
| Nút hành động (Đánh dấu tất cả) | Trạng thái loading quay tròn nhẹ | N/A | Toast báo lỗi | Cập nhật toàn bộ thẻ chưa đọc về đã đọc ngay lập tức | Vô hiệu hóa nếu không có thông báo chưa đọc nào | Nút bấm đổi sang nền sáng hơn |

---

## 6) Data Fields
Dựa trên đặc tả của `notification.types.ts`, cấu trúc dữ liệu thẻ thông báo bao gồm:
| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | `number` | ✓ | ID duy nhất của thông báo | `15` |
| `type` | `string` | ✓ | Danh mục thông báo để hiển thị Icon và màu sắc tương ứng | `"booking"`, `"rating"`, `"system"`, `"promotion"` |
| `title` | `string` | ✓ | Tiêu đề thông báo ngắn gọn | `"Đơn đặt phòng thành công"` |
| `message` | `string` | ✓ | Nội dung chi tiết của thông báo | `"Đơn đặt phòng khách sạn Mường Thanh của bạn đã được xác nhận thành công."` |
| `data` | `Record<string, unknown> \| null` | ✗ | Metadata chứa đường dẫn định tuyến chi tiết | `{ "url": "/bookings/code/DT-12345" }` |
| `read_at` | `string \| null` | ✗ | Thời điểm đọc thông báo (null tương đương chưa đọc) | `"2026-05-22T08:05:00Z"` |
| `created_at` | `string` | ✓ | Thời điểm tạo thông báo | `"2026-05-22T08:00:00Z"` |

---

## 7) API Endpoints
Bản đồ tích hợp API hoàn thiện tương ứng với lớp `notificationService`:
| Method | Path | Auth | Request params | Response | Error codes |
|--------|------|------|----------------|----------|-------------|
| GET | `/user/notifications` | 🔐 Có | `?page={page}&per_page={per_page}&read={read}` | `ApiResponse<NotificationListResponse>` | `401 Unauthorized` |
| GET | `/user/notifications/unread-count` | 🔐 Có | N/A | `ApiResponse<NotificationUnreadCount>` | `401 Unauthorized` |
| PATCH | `/user/notifications/{id}/read` | 🔐 Có | N/A | `ApiResponse<Notification>` | `401 Unauthorized`, `404 Not Found` |
| PATCH | `/user/notifications/read-all` | 🔐 Có | N/A | `ApiResponse<unknown>` | `401 Unauthorized` |
| DELETE | `/user/notifications/{id}` | 🔐 Có | N/A | `ApiResponse<unknown>` | `401 Unauthorized`, `404 Not Found` |

---

## 8) Business Rules
- **BR-01 (Auth Guard):** Toàn bộ giao diện thông báo chỉ khả dụng cho người dùng đã đăng nhập. Middleware sẽ tự động kiểm soát quyền truy cập.
- **BR-02 (Deep-linking & Auto-read):** Khi người dùng click vào một thẻ thông báo có thuộc tính `data.url`:
  1. Gửi ngầm request `PATCH` đánh dấu thông báo này đã đọc.
  2. Đồng thời chuyển hướng người dùng tới trang `data.url` tương ứng.
- **BR-03 (Bulk Mark Read Visibility):** Nút "Đánh dấu tất cả đã đọc" sẽ chỉ hiển thị hoặc chỉ ở trạng thái kích hoạt khi số lượng chưa đọc (`unreadCount`) lớn hơn 0.
- **BR-04 (Optimistic State Sync):** Khi đánh dấu một thông báo là đã đọc hoặc xóa nó đi, hệ thống sẽ thực hiện tối ưu hóa cache React Query lạc quan nhằm cập nhật số lượng thông báo chưa đọc trên Header ngay lập tức mà không cần chờ API phản hồi xong.

---

## 9) Edge Cases
- **EC-01 (Không có liên kết data.url):** Một số thông báo hệ thống hoặc khuyến mãi chỉ mang tính chất thông báo hiển thị, không chứa link định tuyến. <br>*Giải pháp:* Khi click vào các thẻ này, chỉ kích hoạt đánh dấu đã đọc (nếu chưa đọc) và không thực hiện chuyển hướng. Thẻ sẽ không hiển thị icon mũi tên chỉ hướng đi.
- **EC-02 (Xóa toàn bộ thông báo từ trang nhiều trang):** Người dùng đang ở trang phân trang số 2 và thực hiện xóa toàn bộ thông báo trên trang đó. <br>*Giải pháp:* Tự động giảm chỉ số phân trang `page` về `page - 1` (nếu `page > 1` và danh sách rỗng sau khi xóa) để tránh hiển thị trang trống không cần thiết.
- **EC-03 (Mất kết nối mạng đột ngột khi thao tác nhanh):** Người dùng liên tục nhấn xóa nhiều thẻ trong điều kiện mạng yếu. <br>*Giải pháp:* Sử dụng trạng thái `isRemoving` để vô hiệu hóa tương tác trên thẻ đó và hiển thị vòng xoay loading cục bộ để tránh trùng lặp request.

---

## 10) Assumptions & Open Questions
### Assumptions
- **[ASSUMPTION] A-01:** Phân trang thông báo được giới hạn mặc định `per_page: 10` để đảm bảo tốc độ tải trang nhanh và tối ưu hóa lượng dữ liệu truyền qua mạng.
- **[ASSUMPTION] A-02:** API `/user/notifications` đã hỗ trợ tham số lọc trạng thái `read=false` (cho Chưa đọc) và `read=true` (cho Đã đọc) hoặc bỏ trống (cho Tất cả). Chúng tôi sẽ map tham số lọc này từ Tab UI tương ứng sang API params một cách chính xác.

### Open Questions
- **Q-01:** Có cần hiển thị thông báo nổi (Sonner toast) khi có thông báo mới đẩy về theo thời gian thực (Websocket) hay không? Tạm thời trong phạm vi hiện tại, chúng ta sẽ chỉ giải quyết hiển thị danh sách kéo (pull-based HTTP polling/queries) theo đúng mô tả nghiệp vụ.
