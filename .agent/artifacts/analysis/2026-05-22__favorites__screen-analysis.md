# Phân tích Giao diện: Địa điểm Yêu thích (favorites)

- **Feature Slug:** `favorites`
- **Ngày thực hiện:** 2026-05-22
- **Nguồn tài liệu:**
  - [user_favorites.md](file:///D:/DATN/DATN_Tài%20liệu/docs/page/user_favorites.md) (Tài liệu gốc)
  - [api_list.md](file:///D:/DATN/DATN_Tài%20liệu/docs/api/api_list.md) (Định nghĩa API)
  - [favorite.service.ts](file:///D:/DATN/danangtrip-web/src/services/favorite.service.ts) (Lớp truyền tải dữ liệu frontend)
  - [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md) (Quy chuẩn thiết kế dự án)

---

## 1) Summary
- **Mục đích:** Cho phép người dùng xem danh sách các địa điểm du lịch đã lưu yêu thích (location-only scope theo đặc tả giao diện). Cung cấp tùy chọn đổi kiểu xem (Grid/List), sắp xếp, phân trang và hủy lưu yêu thích kèm tính năng hoàn tác (Undo) trực quan bằng toast thông báo trong vòng 5 giây.
- **Actor chính:** Người dùng đã đăng nhập (🔐 Protected Route).
- **Feature/Module:** Yêu thích (`favorites`).
- **Source inputs đã dùng:** `user_favorites.md`, `DESIGN.md`, `api_list.md`, `favorite.service.ts`, `LocationCard.tsx`.

---

## 2) Design Token Audit
Bám sát quy chuẩn thẩm mỹ tối giản, cao cấp của chế độ tối (Dark Mode) tại [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md):
- **Màu sắc chính (Conflict Resolution):**
  - Đặc tả gốc (`user_favorites.md`) sử dụng mã màu xanh dương `#0066CC` làm màu chủ đạo cho các CTA, toggle hoạt động và nút bấm hoàn tác.
  - Tuy nhiên, theo thứ tự ưu tiên của quy tắc dự án (PROJECT_RULES §1), chúng tôi bắt buộc phải sử dụng mã màu primary `#8B6A55` (màu nâu đất nung/terra) của `DESIGN.md` để đồng nhất với toàn bộ hệ thống.
  - Các nút hành động chính, viền toggle active, và chữ hoàn tác trong toast sẽ chuyển từ `#0066CC` sang `#8B6A55`.
  - Nền surface sử dụng `#080808` và `#030303` với cấu trúc viền `#262626` dạng Glassmorphism.
  - Nút xóa yêu thích (biểu tượng trái tim): hiển thị màu đỏ `#EF4444` (trái tim được lấp đầy - filled). Khi hover sẽ có hiệu ứng phóng to `scale-110` nhẹ nhàng và thay đổi độ mờ nền.
- **Hoạt ảnh (Animations):**
  - Hiệu ứng biến mất của thẻ khi xóa yêu thích: `opacity 0 -> scale 0.8 -> remove DOM` diễn ra trong vòng 300ms để người dùng cảm thấy mượt mà.
  - Thẻ địa điểm có hiệu ứng hover nâng nhẹ: `transform translateY(-2px)` kết hợp chuyển đổi viền sáng nhẹ `#8B6A55/30` và đổ bóng mềm.
- **Kiểu chữ (Typography):**
  - Tiêu đề chính "Địa điểm yêu thích" sử dụng cỡ chữ `20px` font `Inter` với độ đậm `bold` (700) màu trắng `#FFFFFF` (thay vì `#1E293B` của light mode đặc tả).
  - Nhãn số lượng địa điểm sử dụng cỡ chữ `14px` màu xám nhạt `#A3A3A3` (thay vì `#94A3B8`).
- **Corner Radii:** Bo góc thẻ địa điểm chuẩn `12px` (hoặc `7px` theo style card của DESIGN.md), nút bấm bo góc tròn hoàn toàn (`rounded-full` / `9999px`) hoặc `8px` tùy theo layout.

---

## 3) Component Breakdown

Giao diện sẽ được chia thành các component nhỏ, đặt dưới thư mục `src/features/favorites/components/` để đảm bảo tính module hóa và dễ bảo trì.

### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `ProtectedLayout` | `src/app/[locale]/(main)/(protected)/layout.tsx` | ✗ Không | Quản lý bảo vệ tuyến đường yêu cầu đăng nhập. |
| `Header` | `src/components/layout/Header.tsx` | ✗ Không | Header thanh điều hướng chính của website. |
| `Footer` | `src/components/layout/Footer.tsx` | ✗ Không | Footer chân trang của website. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `FavoritesPageClient` | Component client chính điều phối luồng dữ liệu, lưu trữ state về kiểu xem (Grid/List), sắp xếp (sort), phân trang (page), và kích hoạt toast hoàn tác. | Organism (Client Shell) | N/A |
| `FavoritesPageHeader` | Hiển thị tiêu đề "Địa điểm yêu thích" và tổng số lượng địa điểm đã lưu. | Molecule | `{ count: number }` |
| `FavoritesViewToggle` | Các nút chuyển đổi giữa chế độ xem Grid và List. | Molecule | `{ view: 'grid' \| 'list', onChange: (view: 'grid' \| 'list') => void }` |
| `FavoritesSortSelect` | Dropdown lựa chọn tiêu chí sắp xếp. | Molecule | `{ value: string, onChange: (val: string) => void }` |
| `FavoriteCardGrid` | Khung lưới chứa danh sách các thẻ địa điểm yêu thích. | Organism | `{ children: React.ReactNode }` |
| `FavoriteCardItem` | Thẻ hiển thị địa điểm ở dạng lưới Grid (ảnh dọc, thông tin bên dưới, nút xóa nổi ở góc phải). | Molecule | `{ item: FavoriteItem, onRemove: (id: number) => void }` |
| `FavoriteListItem` | Thẻ hiển thị địa điểm ở dạng hàng ngang List (ảnh bên trái, thông tin bên phải). | Molecule | `{ item: FavoriteItem, onRemove: (id: number) => void }` |
| `FavoritesEmptyState` | Hiển thị khi danh sách yêu thích rỗng, có nút CTA dẫn tới `/locations`. | Molecule | N/A |
| `FavoritesSkeleton` | Hiển thị khung xương giả lập dữ liệu trong quá trình tải. | Molecule | `{ view: 'grid' \| 'list' }` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `favorite.service.ts` | `src/services/favorite.service.ts` | Bổ sung phương thức `getFavorites(params: FavoritesListParams)` để fetch danh sách địa điểm đã lưu yêu thích từ API `/user/favorites`. | Cung cấp dữ liệu cho frontend hiển thị. |
| `routes.ts` | `src/config/routes.ts` | Khai báo hằng số `FAVORITES: "/favorites"` trong `PROTECTED_ROUTES` và xuất ra ngoài. | Cấu hình định tuyến trong ứng dụng. |
| `request.ts` | `src/i18n/request.ts` | Import và đăng ký file ngôn ngữ mới `favorites.json` cho cả hai ngôn ngữ `vi` và `en`. | Hỗ trợ dịch đa ngôn ngữ cho tính năng yêu thích. |

---

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | **Grid view:** 3 cột (`grid-cols-3 gap-5`) <br>**List view:** Cột dọc, các hàng có chiều rộng đầy đủ. | Baseline |
| Tablet (768-1023px) | **Grid view:** 2 cột (`grid-cols-2 gap-4`) <br>**List view:** Giữ nguyên dạng hàng ngang nhưng thu nhỏ ảnh thu nhỏ (`w-36 h-28`). | Điều chỉnh số cột lưới và kích thước ảnh. |
| Mobile (<768px) | **Grid view:** 1 cột (`grid-cols-1 gap-4`) <br>**List view:** Chuyển đổi thẻ hàng ngang thành hàng dọc tự động để tránh chật chội màn hình. | Dàn hàng 100% chiều rộng cho cả Grid và List. |

---

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Danh sách Yêu thích (`FavoritesPageClient`) | Hiển thị `FavoritesSkeleton` tương ứng với kiểu xem hiện tại | Hiển thị `FavoritesEmptyState` | Hiển thị thông báo lỗi kèm nút "Tải lại" (Retry) | Hiển thị danh sách thẻ địa điểm | Vô hiệu hóa phân trang trong lúc tải | N/A |
| Thẻ Yêu thích (`FavoriteCardItem` / `FavoriteListItem`) | Khung xương skeleton màu nền `#171717` nhấp nháy nhẹ | N/A | N/A | Hiển thị dữ liệu thật | N/A | Hover viền sáng màu `#8B6A55/30`, di chuyển nhẹ `-2px` |
| Nút xóa yêu thích (Icon ❤️) | Bị vô hiệu hóa khi đang xử lý | N/A | Toast báo lỗi xóa | Kích hoạt hiệu ứng ẩn thẻ và hiện toast thông báo | Tránh click đúp | Phóng to nhẹ `scale-110`, nền chuyển sang đỏ nhạt |
| Toast Hoàn tác | N/A | N/A | Toast tự đóng | Khôi phục thẻ ngay lập tức về vị trí cũ | N/A | Nút hoàn tác gạch chân khi hover |

---

## 6) Data Fields
API `/user/favorites` trả về danh sách các bản ghi yêu thích có chứa đối tượng `location` lồng ghép. Các trường dữ liệu chính bao gồm:
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `id` | `number` | ✓ | ID của bản ghi yêu thích | `5` | `GET /user/favorites` |
| `location_id` | `number` | ✓ | ID địa điểm tương ứng | `102` | `GET /user/favorites` |
| `created_at` | `string` | ✓ | Thời điểm lưu yêu thích | `"2026-05-22T08:00:00Z"` | `GET /user/favorites` |
| `location.name` | `string` | ✓ | Tên địa điểm | `"Bán đảo Sơn Trà"` | `GET /user/favorites` (Nested) |
| `location.slug` | `string` | ✓ | Slug định tuyến | `"ban-dao-son-tra"` | `GET /user/favorites` (Nested) |
| `location.thumbnail`| `string \| null` | ✗ | Link ảnh đại diện địa điểm | `"/images/sontra.jpg"` | `GET /user/favorites` (Nested) |
| `location.district` | `string` | ✓ | Quận/Huyện | `"Sơn Trà"` | `GET /user/favorites` (Nested) |
| `location.avg_rating`| `string` | ✓ | Điểm đánh giá trung bình | `"4.8"` | `GET /user/favorites` (Nested) |
| `location.review_count`| `number` | ✓ | Số lượng bài đánh giá | `120` | `GET /user/favorites` (Nested) |
| `location.price_min`| `number \| null`| ✗ | Mức giá thấp nhất | `0` (Free) | `GET /user/favorites` (Nested) |

---

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| GET | `/user/favorites` | 🔐 Có | `?page={page}&per_page={per_page}` | `ApiResponse<PaginatedResponse<FavoriteItem>>` | `401 Unauthorized` |
| POST | `/user/favorites` | 🔐 Có | body: `{ location_id: number }` | `ApiResponse<unknown>` | `401 Unauthorized`, `409 Conflict` (đã lưu trước đó) |
| DELETE | `/user/favorites` | 🔐 Có | body: `{ location_id: number }` | `ApiResponse<unknown>` | `401 Unauthorized`, `404 Not Found` |

---

## 8) Business Rules
- **BR-01 (Auth Protection):** Route `/favorites` là trang được bảo vệ. Người dùng chưa xác thực sẽ bị redirect về `/login?callbackUrl=%2Ffavorites`.
- **BR-02 (Undo Window):** Khi nhấn xóa địa điểm yêu thích, hệ thống sẽ thực hiện xóa tạm thời trên UI (optimistic UI update) và hiện toast thông báo tồn tại trong **5 giây**. Nếu người dùng nhấn "Hoàn tác", hệ thống gửi yêu cầu `POST /user/favorites` để đưa lại địa điểm vào danh sách. Nếu sau 5 giây không có hành động hoàn tác, API `DELETE /user/favorites` sẽ được xác nhận thực thi (hoặc gửi DELETE ngay và POST lại nếu hoàn tác - tối ưu nhất là gửi DELETE ngay và POST lại để tránh giữ trạng thái phức tạp trên backend).
- **BR-03 (Sorting Client/Server):** API hiện tại chỉ hỗ trợ phân trang (`page`, `per_page`) mà chưa hỗ trợ tham số sắp xếp. Do đó, việc sắp xếp (Mới nhất, Cũ nhất, Tên A-Z, Đánh giá cao nhất) sẽ được xử lý **client-side** trên mảng dữ liệu đã fetch về (hoặc nếu phân trang nhiều trang, chúng ta fetch toàn bộ hoặc sắp xếp trên trang hiện tại).
  * *Assumption:* Do số lượng yêu thích thường không quá lớn (dưới 50 địa điểm), chúng ta có thể đặt mặc định `per_page: 50` hoặc thực hiện sắp xếp trực tiếp trên dữ liệu trang hiện tại nếu dùng pagination chuẩn.

---

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Khách hàng đăng nhập (Owner) | - Xem danh sách địa điểm yêu thích của mình. <br>- Chuyển đổi kiểu xem Grid/List. <br>- Sắp xếp và phân trang danh sách. <br>- Hủy yêu thích và Hoàn tác. <br>- Click điều hướng xem chi tiết địa điểm. | Xem hoặc sửa đổi danh sách yêu thích của tài khoản khác. | Chủ thể chính của màn hình. |
| Khách vãng lai | N/A | Truy cập bất kỳ phần nào của màn hình. | Bị chặn ngay từ middleware. |

---

## 10) Edge Cases
- **EC-01 (Hoàn tác thất bại):** Người dùng bấm hoàn tác nhưng mạng bị lỗi hoặc token hết hạn. <br>*Giải pháp:* Hiển thị toast lỗi "Không thể hoàn tác yêu thích" và giữ nguyên giao diện đã xóa.
- **EC-02 (Địa điểm bị xóa khỏi hệ thống):** Một địa điểm nằm trong danh sách yêu thích nhưng bị Admin xóa khỏi cơ sở dữ liệu. <br>*Giải pháp:* Backend trả về lồng ghép `location: null`. Frontend cần lọc bỏ các bản ghi có `location === null` hoặc hiển thị thẻ bị vô hiệu hóa kèm thông báo "Địa điểm này không còn tồn tại" và tự động xóa.
- **EC-03 (Click xem chi tiết ngay sau khi xóa):** Người dùng bấm xóa thẻ, nhưng thẻ chưa biến mất hoàn toàn trên UI và họ cố tình click vào nút "Xem chi tiết". <br>*Giải pháp:* Vô hiệu hóa thuộc tính tương tác (pointer-events-none) của thẻ ngay khi nhấn nút xóa yêu thích.

---

## 11) Assumptions & Open Questions
### Assumptions
- **[ASSUMPTION] A-01:** Đặc tả chỉ yêu cầu quản lý địa điểm yêu thích (`location_id`), mặc dù API hỗ trợ cả tour. Do đó, giao diện và hook sẽ được thiết kế tập trung tối đa vào hiển thị địa điểm (LocationCard-like layout).
- **[ASSUMPTION] A-02:** Toast hoàn tác sẽ gửi trực tiếp yêu cầu `DELETE` khi bấm nút xóa, và nếu bấm "Hoàn tác" sẽ thực thi `POST` để lưu lại. Điều này giúp đồng bộ dữ liệu nhanh và hạn chế việc treo request trì hoãn trên client.

### Open Questions
- **Q-01:** Phía backend có dự định hỗ trợ trường `sort` cho `/user/favorites` trong tương lai không? Tạm thời trong Step 03-05 chúng ta sẽ cài đặt bộ lọc sắp xếp client-side để đảm bảo tính năng chạy đúng.

---

## 12) Implementation Checklist
- [x] Rà soát và cập nhật WORKING_STATE.md
- [ ] Bổ sung `getFavorites` vào `src/services/favorite.service.ts`
- [ ] Thêm route `/favorites` vào `src/config/routes.ts`
- [ ] Đăng ký file ngôn ngữ `favorites.json` vào `src/i18n/request.ts`
- [ ] Tạo file dịch `src/messages/vi/favorites.json` và `src/messages/en/favorites.json`
- [ ] Tạo route shell `src/app/[locale]/(main)/(protected)/favorites/page.tsx`
- [ ] Viết các components hiển thị UI (`FavoritesPageClient`, `FavoriteCardItem`, v.v.)
- [ ] Viết query hooks `useFavoritesQuery` và mutation hooks `useFavoriteMutation`
- [ ] Thực hiện kiểm thử chất lượng code (`npm run prepush:check`)
- [ ] Tạo báo cáo deploy-report và review.md để hoàn thiện tính năng.

---

## 13) Files / Areas Likely To Change
- `src/services/favorite.service.ts`
- `src/config/routes.ts`
- `src/i18n/request.ts`
- `src/messages/vi/favorites.json` (New)
- `src/messages/en/favorites.json` (New)
- `src/app/[locale]/(main)/(protected)/favorites/page.tsx` (New)
- `src/features/favorites/...` (New directory and components)
