# Screen Analysis: Chọn lịch khởi hành (Tour Departure Select)

## 1. Summary And Scope
- **Mục tiêu**: Cho phép người dùng chọn ngày khởi hành, điều chỉnh số lượng khách (người lớn, trẻ em, em bé), xem giá tạm tính và chuyển tiếp sang luồng đặt tour.
- **Actor chính**: Khách truy cập (Public) / Người dùng đã đăng nhập (User).
- **Module liên quan**: `tour` (Tour detail, Booking).
- **Screen type**: Selection Form / Modal (đề xuất: trang rời `/tours/[slug]/departures` với UI dạng panel hoặc dialog, tùy thuộc vào bước routing).

## 2. Design And Token Audit
- **Quy tắc**: Kế thừa toàn bộ design tokens từ `DESIGN.md`. Giao diện dùng Dark Mode (Background `#080808`, Surface `#030303`).
- **Màu nhấn**: Primary `#8B6A55` dùng cho nút CTA, lịch đang chọn, và trạng thái hover.
- **Chất liệu**: Sử dụng Glassmorphism (blur, border gradient shell) cho các panel và popover/modal nếu có.
- **Rhythm**: Spacing bội số của 4px.
- **Trạng thái**: Đồng nhất với giao diện Booking Form hiện tại.

## 3. Component Breakdown

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `ScheduleCalendar` | [REUSE] | Molecule | `src/features/tour/components/ScheduleCalendar.tsx` | Đã có sẵn, dùng để hiển thị lịch và trạng thái chỗ trống. Có thể cần chỉnh nhẹ nếu UI yêu cầu thêm thông tin. |
| `QuantityCounter` | [REUSE] | Molecule | `src/features/tour/components/QuantityCounter.tsx` | Đã có sẵn, dùng để chọn số lượng người lớn/trẻ em/em bé. |
| `OrderSummaryCard` | [REUSE] | Organism | `src/features/tour/components/OrderSummaryCard.tsx` | Đã có sẵn bên booking, có thể dùng lại hoặc [MOD] nhẹ để tái sử dụng hiển thị tổng tiền ở bước chọn lịch. |
| `DepartureSelectClient` | [NEW] | Organism | `src/features/tour/components/DepartureSelectClient.tsx` | Component client chứa state (lịch chọn, số lượng), gọi mutation `calculate` / `check-availability` và quản lý logic chuyển trang. |
| `DepartureSelectPage` | [NEW] | Page | `src/app/[locale]/(main)/(public)/tours/[slug]/departures/page.tsx` | (Giả định nếu tách trang rời) Server component fetch thông tin tour ban đầu. |

## 4. Responsive And UI States

| Section | Loading | Empty | Error | Trạng thái khác |
|---|---|---|---|---|
| **Lịch khởi hành** | `ScheduleCalendarSkeleton` | "Chưa có lịch khởi hành" + Nút Back | "Lỗi tải lịch" + Retry | Lịch hết chỗ: Disabled & mờ đi. Lịch đang chọn: Nổi bật. |
| **Số lượng khách** | Skeleton text & counters | N/A | N/A | Vượt quá số chỗ còn nhận: Disable nút Plus (+). |
| **Giá tạm tính** | Skeleton tổng tiền | Ẩn hoặc hiển thị 0đ | Báo lỗi API tính giá | Debounce khi thay đổi số lượng khách. |
| **CTA Tiếp tục** | Nút hiện spinner / Skeleton | Disabled | N/A | Chỉ enable khi đã chọn lịch hợp lệ & số khách > 0. |

## 5. Data And API Mapping

| Field / State | Type | Required | Source | Note |
|---|---|---|---|---|
| Danh sách lịch | `TourSchedule[]` | ✓ | `GET /api/v1/tours/{id}/schedules` | Lấy lịch `available`. Cần check `max_people - booked_people`. |
| Thông tin tour | `Tour` | ✓ | `GET /api/v1/tours/{slug}` | Lấy metadata, tên tour, hình ảnh để hiển thị tổng quan. |
| `schedule_id` / `tour_schedule_id` | `number` | ✓ | State Client | Trạng thái do người dùng chọn trên lịch. |
| `quantity_adult` | `number` | ✓ | State Client | Bắt buộc $\ge$ 1. Mặc định: 1. |
| `quantity_child` | `number` | ✗ | State Client | Tùy chọn, mặc định: 0. |
| `quantity_infant` | `number` | ✗ | State Client | Tùy chọn, mặc định: 0. |
| Giá tạm tính | `object` | ✗ | `POST /api/v1/bookings/calculate` | Fetch debounce khi state thay đổi. |
| Kiểm tra chỗ trống | `object` | ✗ | `POST /api/v1/tours/{id}/check-availability`| Gọi trước khi bấm Tiếp tục để đảm bảo chưa bị người khác đặt hết. |

## 6. Business / Auth / i18n Review
- **Business Rules**:
  - Phải chọn ít nhất 1 Người Lớn.
  - Số lượng tổng khách (hoặc quy tắc cụ thể của backend) không được vượt quá số chỗ còn lại (`max_people - booked_people`).
  - Nếu đã qua `booking_deadline`, không cho chọn lịch đó.
- **Auth Impact**:
  - Luồng xem lịch và tính giá là **Public**.
  - Việc chuyển sang trang `/tours/[slug]/book` có thể yêu cầu Login tùy vào middleware (Booking hiện tại yêu cầu Auth).
- **i18n Impact**:
  - Cần thêm/cập nhật keys trong `src/messages/vi/tour.json` và `src/messages/en/tour.json` cho: "Chọn lịch khởi hành", "Ngày đi", "Số lượng khách", "Kiểm tra chỗ trống", "Tiếp tục đặt tour".
- **Handoff (Chuyển tiếp qua Booking)**:
  - **Open Question / Assumption**: Chuyển tiếp các thông tin (`tour_schedule_id`, `adult`, `child`, `infant`) sang trang `/book` bằng URL Search Params (ví dụ: `?schedule=123&adult=2&child=1`) hoặc dùng Zustand store? 
  - *Recommendation*: Nên dùng URL Search Params để giữ trạng thái chia sẻ được (shareable link), và trang Booking lấy param từ URL làm giá trị mặc định cho form.

## 7. Open Questions / Risks
- `[ASSUMPTION]` API tính tổng tiền `POST /bookings/calculate` có thể yêu cầu Auth token không? Theo `api_list.md`, endpoint này có đánh dấu `🔐` (User). Nếu vậy, người dùng chưa đăng nhập ở màn hình chọn lịch sẽ bị lỗi 401 khi hiển thị giá tạm tính. 
  - *Mitigation*: Cần kiểm tra lại nếu public user không thể gọi `calculate`, client sẽ tự nhân giá trị (`price_adult * adult + price_child * child`) hoặc ẩn tính năng tạm tính cho đến khi sang trang đặt. Hoặc xác minh với backend.
- `[ASSUMPTION]` Quyết định UI cuối cùng: Màn hình này là modal tích hợp vào màn chi tiết Tour, hay là 1 route riêng `/departures`? Bước Routing (04) sẽ phải chốt điều này.
