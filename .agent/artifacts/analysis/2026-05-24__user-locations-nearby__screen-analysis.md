# Screen Analysis: Địa điểm lân cận (GPS)

> Feature slug: `user-locations-nearby`
> Date: 2026-05-24
> Source Documents: `D:\DATN\DATN_Document\docs\page\user_locations_nearby.md`, `D:\DATN\danangtrip-web\DESIGN.md`

---

## 1) Summary
- **Mục tiêu**: Cung cấp cho khách du lịch khả năng quét vị trí hiện tại dựa trên GPS trình duyệt để tìm các địa điểm vui chơi, ăn uống, tham quan tại Đà Nẵng trong phạm vi bán kính lựa chọn (1km đến 10km), kết hợp hiển thị bản đồ trực quan và danh sách sắp xếp theo khoảng cách.
- **Actor chính**: Khách vãng lai (Guest) và Thành viên đã đăng nhập (User).
- **Module/Feature**: `user-locations-nearby` (nằm trong cụm tính năng Khám phá địa điểm).
- **Source inputs**: `user_locations_nearby.md` (Tài liệu màn hình), `api_list.md` (Tài liệu API), `DESIGN.md` (Quy chuẩn thiết kế).

---

## 2) Design Token Audit
Chúng tôi đối chiếu thiết kế màn hình này với hệ thống token tối ở `DESIGN.md` để đảm bảo tính đồng bộ thị giác cực cao:

| Token | Mô tả / Giá trị (Mockup/Spec) | DESIGN.md Value | Match? | Note |
|-------|-----------------------------|-----------------|--------|------|
| **Primary Color** | `#0066CC` (Màu xanh trong tài liệu thô) | `#8B6A55` (Đồng cổ/vàng ấm) | ✗ **MOD** | Thay `#0066CC` thành tông màu chủ đạo `#8B6A55` của web để đồng bộ hoàn toàn với thương hiệu. |
| **Neutral Background** | Nền tối sâu | `#080808` | ✓ | Áp dụng nền tối sâu với lớp phủ WebGL/canvas. |
| **Card Surface** | Kính mờ (Glassmorphic) | Glassmorphic, 12px blur | ✓ | Dùng glassmorphism cho sidebar, card và control overlays. |
| **Typography** | Inter + SFMono-Regular | Inter & SFMono-Regular | ✓ | Trình bày tiêu đề bằng Inter, dữ liệu khoảng cách/tọa độ bằng SFMono-Regular. |
| **Border Radius** | Bo góc mềm mại | `7px`, `8px`, `12px` | ✓ | Thẻ location card compact dùng `8px` hoặc `12px` tương đồng với hệ thống. |
| **Shadow / Blur** | Bóng đổ mờ cho kính mờ | `backdrop-blur-md` (12px) | ✓ | Hiệu ứng chiều sâu cao cấp. |

---

## 3) Component Breakdown

### [REUSE] — Components đã có
Do đây là màn hình split-screen (Bản đồ + Sidebar danh sách ngang), chúng tôi có thể tái sử dụng các layout nền tảng và icons:

| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `PageShell` | `src/app/[locale]/(main)/layout.tsx` | Không | Sử dụng cấu trúc layout chung của trang public. |
| `Solar Icons` | `src/components/icons/solar.tsx` | Không | Tái sử dụng các icon Solar (đặc biệt là icon GPS, Star, Heart, Location). |

### [NEW] — Components cần tạo mới
Chúng tôi sẽ xây dựng các component chuyên biệt cho màn hình `/nearby`:

| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `LocationCardCompact` | Thẻ địa điểm hiển thị ngang cực gọn cho sidebar bản đồ. Có ảnh đại diện `64x64`, tên, khoảng cách (km), đánh giá sao, mức giá và danh mục. | Molecule | `{ location: Location; isHovered?: boolean; onHover?: (hovered: boolean) => void; }` |
| `NearbyMapSimulator` | Bản đồ mô phỏng cao cấp bằng CSS/SVG kết hợp tọa độ thực tế. Hiển thị marker người dùng (pulse xanh), marker địa điểm xung quanh, vòng tròn bán kính, hỗ trợ click marker mở popup. | Organism | `{ locations: Location[]; userCoords: { lat: number; lng: number } \| null; radius: number; hoveredLocationId: number \| null; onMarkerClick: (slug: string) => void; }` |
| `NearbyClient` | Client component chính để điều phối: xin quyền vị trí, kết nối hook lấy data, quản lý bộ lọc (bán kính, sắp xếp), hiển thị layout split-screen. | Organism | `{ locale: string }` |

### [MOD] — Components cần chỉnh sửa
Để hỗ trợ màn hình `/nearby`, chúng tôi cần khai báo thêm API và Routes cấu hình:

| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `API_ENDPOINTS` | `src/config/api.ts` | Thêm `LOCATIONS.NEARBY: "/locations/nearby"` | Khai báo endpoint gọi API. |
| `PUBLIC_ROUTES` | `src/config/routes.ts` | Thêm `NEARBY: "/nearby"` | Khai báo route công khai mới. |
| `locationService` | `src/services/location.service.ts` | Thêm phương thức `getNearby(params)` | Cung cấp hàm gọi HTTP Axios cho frontend. |
| `locations.json` | `src/messages/vi/locations.json` & `en/...` | Thêm namespace `"nearby"` với các chuỗi dịch tương ứng | Hỗ trợ đa ngôn ngữ hoàn toàn. |

---

## 4) Responsive Behavior

Do đây là màn hình split-screen (Bản đồ chiếm 50%, Danh sách chiếm 50%), thiết kế responsive sẽ điều chỉnh linh hoạt:

| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| **Desktop (≥1024px)** | Split-screen song song | **Baseline**: Bản đồ cố định bên trái (hoặc phải), sidebar danh sách cuộn dọc bên cạnh. Chiếm trọn chiều cao màn hình trừ Header/Hero. |
| **Tablet (768-1023px)** | Stack dọc (Bản đồ trên, Danh sách dưới) | Bản đồ thu nhỏ độ cao xuống cố định `300px`, danh sách địa điểm cuộn phía dưới. |
| **Mobile (<768px)** | Bản đồ thu nhỏ / Tab toggle | Bản đồ cố định `220px` với giao diện cuộn ngang các location cards ở dưới (carousel), hoặc nút chuyển đổi Tab "Xem Bản đồ" / "Xem Danh sách" để tối ưu hóa không gian. |

---

## 5) UI States

| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| **Main Grid** | Spinner lớn quay chậm kèm text `"Đang xin quyền vị trí..."` | Nút quick select bán kính lớn hơn (5km, 10km, 20km) + Text cảnh báo. | Khung thông báo lỗi xin quyền hoặc lỗi API + Nút `"Thử lại"`. | Hiển thị split layout bản đồ + danh sách. | N/A | N/A |
| **Card List** | 5 cards skeleton mờ chạy gradient | Ẩn danh sách, hiển thị banner gợi ý | Lỗi nhỏ hoặc Toast thông báo | Grid/List thẻ compact | N/A | Card viền vàng sáng `#8B6A55` nhẹ, scale nhẹ, marker trên map tương ứng kích hoạt bounce. |
| **Radius Selector** | Disabled | Ẩn hoặc mặc định | N/A | Click hoạt động bình thường | Mờ nhẹ khi đang load API | Nút chuyển đổi active/inactive |

---

## 6) Data Fields

Dữ liệu trả về từ API `/locations/nearby` là một danh sách các địa điểm hoạt động công khai kèm theo trường tính toán `distance` (Haversine formula):

| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `id` | `number` | ✓ | Số nguyên dương | `14` | `GET /locations/nearby` |
| `name` | `string` | ✓ | Chuỗi chữ | `"Cầu Rồng Đà Nẵng"` | `GET /locations/nearby` |
| `slug` | `string` | ✓ | Ký tự slug | `"cau-rong-da-nang"` | `GET /locations/nearby` |
| `thumbnail` | `string \| null` | ✗ | Đường dẫn URL | `"/uploads/cauroong.jpg"` | `GET /locations/nearby` |
| `avg_rating` | `string` | ✓ | Định dạng thập phân dạng chuỗi | `"4.8"` | `GET /locations/nearby` |
| `review_count` | `number` | ✓ | Số nguyên | `156` | `GET /locations/nearby` |
| `price_min` | `number \| null` | ✗ | Số tiền nguyên | `0` (Miễn phí) | `GET /locations/nearby` |
| `district` | `string` | ✓ | Chuỗi quận | `"Hải Châu"` | `GET /locations/nearby` |
| `latitude` | `string` | ✓ | Tọa độ vĩ độ | `"16.0612"` | `GET /locations/nearby` |
| `longitude` | `string` | ✓ | Tọa độ kinh độ | `"108.2268"` | `GET /locations/nearby` |
| **`distance`** | `number` | ✓ | Số thực (đơn vị km) | `1.245` | `GET /locations/nearby` |
| `category` | `object \| null` | ✗ | Eager-loaded relationship | `{ id: 1, name: "Tham quan" }` | `GET /locations/nearby` (Bổ sung qua modifier) |

---

## 7) API Endpoints

### `GET /v1/locations/nearby`
- **Auth**: Không yêu cầu (Public).
- **Request Parameters**:
  - `lat` (required, float): Vĩ độ hiện tại của thiết bị khách.
  - `lng` (required, float): Kinh độ hiện tại của thiết bị khách.
  - `radius` (optional, float): Bán kính quét (đơn vị: km, mặc định: 5. Tối thiểu: 0.1, Tối đa: 50).
  - `limit` (optional, integer): Số lượng trả về tối đa.
  - `sort_by` (optional, string): avg_rating, review_count, view_count, created_at, price_min. Mặc định sắp xếp theo khoảng cách gần nhất.
  - `sort_order` (optional, string): asc, desc.
- **Response** (`200 OK`):
  ```json
  {
    "status": 200,
    "data": [
      {
        "id": 14,
        "name": "Cầu Rồng",
        "slug": "cau-rong",
        "district": "Sơn Trà",
        "latitude": "16.0611",
        "longitude": "108.2274",
        "avg_rating": "4.9",
        "review_count": 89,
        "price_min": 0,
        "thumbnail": "/images/discovery/dragon-bridge.png",
        "distance": 1.25,
        "category": {
          "id": 3,
          "name": "Điểm tham quan",
          "slug": "diem-tham-quan"
        }
      }
    ]
  }
  ```
- **Error Codes**:
  - `422 Unprocessable Entity`: Thiếu `lat` hoặc `lng`, hoặc định dạng không đúng số.

---

## 8) Business Rules
- **BR-01 (Mặc định bán kính)**: Nếu người dùng không chỉ định, bán kính tìm kiếm mặc định sẽ là `5 km`.
- **BR-02 (Xử lý từ chối GPS)**: Khi trình duyệt hoặc người dùng chặn quyền truy cập vị trí, hệ thống KHÔNG được crash. Phải hiển thị banner thông báo lỗi thân thiện, đồng thời cung cấp danh sách quận tĩnh của Đà Nẵng để lọc nhanh thủ công làm phương án dự phòng tốt nhất.
- **BR-03 (Tính toán khoảng cách)**: Khoảng cách hiển thị trên giao diện card phải được làm tròn về `1 chữ số thập phân` (ví dụ: `1.2 km`) để đảm bảo thẩm mỹ trực quan.

---

## 9) Actors & Permissions

| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| **Khách vãng lai (Guest)** | Xem toàn bộ trang, cấp quyền GPS, đổi bán kính, xem bản đồ, chuyển hướng chi tiết địa điểm. | Lưu địa điểm vào danh sách yêu thích trực tiếp (Favorites). | Sẽ hiển thị modal Đăng nhập nếu click lưu yêu thích. |
| **Thành viên (User)** | Thực hiện toàn bộ quyền giống Guest, có thể Click lưu yêu thích trực tiếp không cần chuyển trang. | N/A | Đồng bộ hóa với Zustand store cho trạng thái yêu thích. |

---

## 10) Edge Cases
- **EC-01 (Tọa độ nằm ngoài Đà Nẵng / Việt Nam)**: Người dùng thực tế mở trang tại Hà Nội hoặc nước ngoài. Khoảng cách quét quá xa làm trống kết quả.
  * *Xử lý*: Hiển thị thông báo gợi ý `"Vị trí của bạn đang ở xa Đà Nẵng. Hãy thử tăng bán kính lên tối đa hoặc chọn nhập vị trí thủ công/chọn quận dự phòng"`.
- **EC-02 (Mất kết nối mạng giữa chừng khi GPS đang chạy)**: Không tải được bản đồ hoặc danh sách địa điểm.
  * *Xử lý*: Trạng thái báo lỗi kết nối có nút `"Thử lại"` rõ ràng.

---

## 11) Assumptions & Open Questions

### Assumptions
- **A-01**: Giả định rằng trình duyệt của người dùng hỗ trợ API `navigator.geolocation` (hầu như 99.9% trình duyệt hiện đại đều hỗ trợ).
- **A-02**: Giả định cơ sở dữ liệu backend đã nhập tọa độ `latitude` và `longitude` chính xác cho tất cả địa điểm đang hoạt động.

### Open Questions
- *Q-01*: Backend có cần bổ sung bộ lọc danh mục (`category_id`) cho API `/locations/nearby` trong tương lai không?
  * *Trả lời*: Tài liệu spec khóa chặt các param `lat`, `lng`, `radius`, `limit`, `sort_by`, `sort_order`. Để an toàn và nhất quán, chúng tôi sẽ thực hiện lọc danh mục ở phía frontend (client-side filter) trên kết quả trả về từ API gần đó để tránh phá vỡ validator của backend.

---

## 12) Implementation Checklist
- [x] **Step 01**: Thực hiện Screen Analysis chi tiết (Hoàn thành)
- [ ] **Step 02**: Kiểm tra tính sẵn sàng dự án và công cụ xác thực (Project Setup)
- [ ] **Step 03**: Định nghĩa các typescript types, endpoint config và service method (Types & API Contract)
- [ ] **Step 04**: Tạo cấu trúc Route `/nearby`, i18n keys và page metadata (Layout & Routing)
- [ ] **Step 05**: Tạo UI Components (NearbyClient, NearbyMapSimulator, LocationCardCompact) (UI Specs)
- [ ] **Step 06**: Tích hợp luồng dữ liệu query, đồng bộ Geolocation (Data Integration)
- [ ] **Step 07**: Xử lý tương tác, click marker, đổi bộ lọc, xử lý lỗi (Interactions)
- [ ] **Step 08**: Xác thực quyền truy cập và kiểm tra rò rỉ API khách (Auth & Permissions)
- [ ] **Step 09**: Kiểm thử chất lượng qua linter, typecheck và compiler (Testing)
- [ ] **Step 10**: Báo cáo kiểm định hoàn thiện sản phẩm và bàn giao (Optimization & Handoff)

---

## 13) Areas Likely To Change
- `src/config/api.ts` — Đăng ký API endpoint
- `src/config/routes.ts` — Đăng ký route URL
- `src/services/location.service.ts` — Thêm hàm API gọi backend
- `src/app/[locale]/(main)/(public)/nearby/page.tsx` — Page route Next.js
- `src/features/locations/nearby/...` — Feature directory (hooks, components)
- `src/messages/vi/locations.json` & `en/locations.json` — Tài nguyên ngôn ngữ đa quốc gia
- `D:\DATN\danangtrip-api\app\Repositories\Eloquent\LocationRepository.php` — Eager load relations trên API backend
