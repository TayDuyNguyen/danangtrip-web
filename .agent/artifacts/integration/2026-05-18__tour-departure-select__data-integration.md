# Data Integration Plan: Chọn lịch khởi hành (Tour Departure Select)

## 1. Data Source Breakdown

| Source / Endpoint | Purpose | Ownership (Server/Client) | Notes |
|---|---|---|---|
| `GET /tours/{slug}` | Lấy thông tin cơ bản của tour (tên, hình ảnh, metadata SEO). | **Server Component** (`page.tsx`) | Trả về `Tour`, truyền qua props xuống `DepartureSelectClient`. Nếu lỗi (404), gọi `notFound()`. |
| `GET /tours/{id}/schedules` | Lấy danh sách lịch khởi hành để hiển thị trên Calendar. | **Client Query** (`useTourSchedules`) | Tự động chạy ngay khi Client mount, key `["tours", "schedules", tourId, params]`. |
| Local Computation | Tính tổng tiền tạm tính dựa trên số lượng khách và giá của `Tour`. | **Client State** (React State/Memo) | *Thay thế* `POST /bookings/calculate` vì route này dành cho cả người dùng Public (API yêu cầu Auth). |

## 2. Query Strategy

### 2.1 Server Data (`Tour`)
- **Action**: `tourService.getDetail(slug)`
- **Ownership**: Được gọi trực tiếp bên trong `page.tsx` và `generateMetadata`. Data tĩnh sẽ truyền thẳng xuống client.

### 2.2 Client Query (`TourSchedule[]`)
- **Hook**: `useTourSchedules(tourId)`
- **Key**: `["tours", "schedules", tourId, undefined]`
- **Trigger**: Mount ngay lập tức do `enabled: !!tourId` mặc định.
- **StaleTime**: Mặc định từ global provider.

## 3. Mutation Strategy

- **Mutation Mặc định**: Ở luồng Chọn Lịch Khởi Hành, không có Mutation trực tiếp gửi lên server (như tạo booking mới).
- **Handoff (Chuyển trang)**: Sử dụng URL Search Params để serialize State của Client (ví dụ: `?schedule_id=X&adults=Y&children=Z&infants=W`) và truyền cho màn hình `/book` (Booking Form).

## 4. UI State Handling

| Section | Loading State | Error State | Empty State |
|---|---|---|---|
| **Page Shell** | (Được Next.js bao bọc bằng `loading.tsx` nếu có) | Chuyển qua trang `notFound()` hoặc `error.tsx` của hệ thống. | N/A |
| **Lịch khởi hành** | Hiển thị `<div className="animate-pulse bg-surface-container-low" />` dạng Skeleton bằng chiều cao của Calendar (`400px`). | - | `ScheduleCalendar` xử lý không hiện ngày nào active. |
| **Số lượng khách** | Mặc định render ngay lập tức (không cần tải thêm data). | - | N/A (Mặc định 1 người lớn) |
| **Giá tạm tính** | Cập nhật tức thì (Sync) do dùng computation nội bộ thay vì fetch mạng. | N/A | N/A |

## 5. Implementation Status
- **Hoàn thành**: 
  - `page.tsx` đã gọi `getDetail`.
  - `DepartureSelectClient.tsx` đã dùng `useTourSchedules`.
  - UI State Handling (Skeleton cho lịch, tính toán Sync) đã được code xong trong luồng `05-ui-components`.
- **Handoff for Next Steps**: Không có action nào cần viết code cho bước này, vì pattern chia chác Data và UI đã được ghép nối chặt chẽ và test-ready.