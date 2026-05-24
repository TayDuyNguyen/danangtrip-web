# UI Spec: Địa điểm Yêu thích (favorites)

> Feature slug: `favorites`
> Date: 2026-05-22
> Source analysis: `D:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-22__favorites__screen-analysis.md`

---

## 1) Summary
- **Mục tiêu UI:** Xây dựng giao diện trang danh sách các địa điểm được lưu yêu thích của người dùng. Cho phép người dùng chuyển đổi linh hoạt giữa chế độ xem lưới (Grid) và danh sách (List), sắp xếp danh sách theo thời gian lưu hoặc theo đánh giá, và thực hiện xóa khỏi danh sách yêu thích kèm tính năng hoàn tác (Undo) qua toast thông báo.
- **Bề mặt chính tương tác:**
  - Nút chuyển đổi View (Grid/List).
  - Dropdown sắp xếp (Mới nhất, Cũ nhất, Tên A-Z, Đánh giá cao nhất).
  - Danh sách thẻ địa điểm hiển thị hình ảnh, tên địa điểm, đánh giá, khoảng giá, mô tả ngắn, và nút Hủy yêu thích dạng trái tim màu đỏ nổi bật.
  - Toast thông báo hỗ trợ nút "Hoàn tác" khôi phục trạng thái.

## 1.1) UI Delivery Goal
- **Above-the-fold content:** 
  - Tiêu đề trang (`FavoritesPageHeader`) kèm tổng số lượng địa điểm yêu thích đang có.
  - Thanh bộ lọc sắp xếp và nút chuyển đổi chế độ xem (`FavoritesSortSelect`, `FavoritesViewToggle`).
  - Lưới/Hàng đầu tiên của danh sách địa điểm yêu thích hoặc trạng thái rỗng (`FavoritesEmptyState`).
- **Secondary/supporting UI:**
  - Phần phân trang ở cuối trang danh sách (`StandardPagination`).
  - Các hiệu ứng chuyển cảnh mượt mà: di chuột (hover) nâng thẻ, hiệu ứng xóa thẻ (fade-out và scale-down), hiệu ứng skeleton lung linh trong lúc tải trang.

## 2) Component Matrix

### [REUSE]
| Component | Path | Why reuse | Notes |
|---|---|---|---|
| `ProtectedLayout` | `src/app/[locale]/(main)/(protected)/layout.tsx` | Đảm bảo tính năng chỉ truy cập được khi đã đăng nhập | Layout chung bảo vệ các trang người dùng. |
| `StandardPagination` | `src/components/ui/pagination.tsx` | Đồng bộ bộ điều khiển phân trang của dự án | Tái sử dụng nguyên vẹn. |
| `Button` | `src/components/ui/button.tsx` | Đồng bộ phong cách nút bấm | Tái sử dụng cho nút "Tải lại" và các nút hành động. |

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `FavoritesPageClient` | Organism (Client Shell) | Component cha điều phối trạng thái hiển thị, phân trang, sắp xếp client-side, và logic optimistic delete / undo toast. | Không có |
| `FavoritesPageHeader` | Molecule | Hiển thị tiêu đề "Địa điểm yêu thích" và số lượng địa điểm. | `{ count: number }` |
| `FavoritesViewToggle` | Molecule | Chuyển đổi giữa giao diện dạng lưới (Grid) và danh sách (List). | `{ view: 'grid' \| 'list', onChange: (view: 'grid' \| 'list') => void }` |
| `FavoritesSortSelect` | Molecule | Dropdown lựa chọn tiêu chí sắp xếp cho danh sách địa điểm. | `{ value: 'newest' \| 'oldest' \| 'name_asc' \| 'rating_desc', onChange: (val: 'newest' \| 'oldest' \| 'name_asc' \| 'rating_desc') => void }` |
| `FavoriteCardGrid` | Organism | Khung layout dạng Grid responsive chứa danh sách thẻ địa điểm. | `{ children: React.ReactNode }` |
| `FavoriteCardItem` | Molecule | Thẻ địa điểm hiển thị dạng lưới (Grid card). Hỗ trợ nút Xóa và hiệu ứng hover. | `{ item: FavoriteItem, onRemove: (id: number) => void, isRemoving?: boolean }` |
| `FavoriteListItem` | Molecule | Thẻ địa điểm hiển thị dạng hàng ngang (List row). Hỗ trợ nút Xóa và hiệu ứng hover. | `{ item: FavoriteItem, onRemove: (id: number) => void, isRemoving?: boolean }` |
| `FavoritesEmptyState` | Molecule | Hiển thị khi danh sách yêu thích không có phần tử nào. Đi kèm icon trái tim và nút CTA "Khám phá ngay". | Không có |
| `FavoritesSkeleton` | Molecule | Khung xương giả lập tải dữ liệu hiển thị tương thích theo kiểu xem lưới hoặc danh sách. | `{ view: 'grid' \| 'list' }` |

### [MOD]
| Component | Path | Required change | Impact |
|---|---|---|---|
| `favorite.service.ts` | `src/services/favorite.service.ts` | Bổ sung phương thức `getFavorites` tích hợp với API `/user/favorites`. | Chuẩn bị data layer cho UI. |
| `routes.ts` | `src/config/routes.ts` | Khai báo hằng số định tuyến `FAVORITES` trong danh mục `PROTECTED_ROUTES`. | Hỗ trợ bảo vệ route và điều hướng. |
| `request.ts` | `src/i18n/request.ts` | Khai báo file ngôn ngữ `favorites.json`. | Hỗ trợ dịch đa ngôn ngữ cho UI. |

## 3) UI States
| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| `FavoritesPageClient` | Render `FavoritesSkeleton` tương ứng với kiểu xem hiện tại | Render `FavoritesEmptyState` | Hiển thị hộp thoại thông báo lỗi kèm nút "Tải lại" | Hiển thị danh sách địa điểm tương ứng | Vô hiệu hóa tương tác phân trang khi đang tải |
| `FavoriteCardItem` / `FavoriteListItem` | Hiển thị dạng skeleton tương ứng với layout | N/A | N/A | Render thông tin thực tế của địa điểm, thêm hiệu ứng chuyển dịch nhẹ khi hover | Vô hiệu hóa pointer-events khi `isRemoving = true` |
| Nút xóa (Icon ❤️ trên card) | Vô hiệu hóa (chặn double-click) | N/A | Hiển thị toast lỗi | Tải hiệu ứng mượt mà biến mất (opacity-0 scale-75) trong 300ms | N/A |

## 3.1) Motion / Interaction Notes
| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| Thẻ địa điểm (Grid/List) | Viền chuyển sáng màu nâu chủ đạo `#8B6A55/30`, thẻ dịch chuyển nhẹ lên trên `translateY(-6px)` hoặc `translateY(-4px)` kèm đổ bóng sâu hơn. | Trình diễn mịn màng trong 500ms (`transition-all duration-500`). | Sử dụng CSS transitions gốc thay vì thư viện bên ngoài để tối ưu hiệu năng. |
| Ảnh đại diện địa điểm | Tự động zoom nhẹ `scale-110` hoặc `scale-105` khi di chuột vào vùng thẻ. | Zoom chậm mịn màng trong 1000ms (`transition-transform duration-1000`). | Nhắm mục tiêu tạo cảm giác sống động, kích thích thị giác. |
| Nút xóa trái tim ❤️ | Nền chuyển sang đỏ sẫm/nhạt, biểu tượng trái tim phóng to nhẹ `scale-110`. | Nhanh chóng trong 300ms (`duration-300`). | Dễ nhìn, tạo phản hồi thị giác tức thì cho hành động hủy lưu. |
| Animation xóa thẻ | N/A | Thẻ chuyển sang mờ đục và thu nhỏ (`opacity-0 scale-75`) trong 300ms. | Sau khi animation kết thúc, toast thông báo hoàn tác sẽ xuất hiện. |

## 4) Responsive Notes
| Breakpoint | Behavior | Notes |
|---|---|---|
| Mobile (<768px) | - Chế độ Grid: Dàn 1 cột full-width (`grid-cols-1`).<br>- Chế độ List: Tự động chuyển đổi layout từ hàng ngang thành hàng dọc (vertical block layout) giống Grid để tránh vỡ chữ và ảnh thu nhỏ.<br>- Khoảng cách gap thu nhỏ còn `4px` - `8px` (`gap-4`). | Tối ưu hiển thị gọn gàng trên màn hình nhỏ. |
| Tablet (768px - 1023px) | - Chế độ Grid: Dàn 2 cột (`grid-cols-2`).<br>- Chế độ List: Giữ nguyên dạng hàng ngang nhưng thu nhỏ ảnh đại diện (`w-48 h-32`). | Bố cục cân đối. |
| Desktop (≥1024px) | - Chế độ Grid: Dàn 3 cột (`grid-cols-3 gap-6`).<br>- Chế độ List: Dàn hàng ngang hoàn chỉnh, ảnh thu nhỏ rộng (`w-56 h-40`), thông tin hiển thị rộng rãi bên phải. | Trình bày trực quan, sang trọng. |

## 5) Files Expected To Change
- `src/features/favorites/components/FavoritesPageClient.tsx`
- `src/features/favorites/components/FavoritesPageHeader.tsx`
- `src/features/favorites/components/FavoritesViewToggle.tsx`
- `src/features/favorites/components/FavoritesSortSelect.tsx`
- `src/features/favorites/components/FavoriteCardGrid.tsx`
- `src/features/favorites/components/FavoriteCardItem.tsx`
- `src/features/favorites/components/FavoriteListItem.tsx`
- `src/features/favorites/components/FavoritesEmptyState.tsx`
- `src/features/favorites/components/FavoritesSkeleton.tsx`

## 6) Build Order
1. **Atoms / Primitives:**
   - Đảm bảo các component nền tảng như `Button`, `StandardPagination`, và các icons Solar đã sẵn sàng và import đúng đường dẫn.
2. **Molecules (UI Tĩnh & Trạng thái):**
   - `FavoritesPageHeader`
   - `FavoritesViewToggle`
   - `FavoritesSortSelect`
   - `FavoritesEmptyState`
   - `FavoritesSkeleton`
3. **Organisms (Cards & Layouts):**
   - `FavoriteCardItem` (Grid card)
   - `FavoriteListItem` (List row)
   - `FavoriteCardGrid` (Grid layout)
4. **Page Assembly / Coordination:**
   - Kết nối tất cả các component con vào `FavoritesPageClient`.
   - Kết nối logic phân trang, sắp xếp và optimistic update cùng toast Undo vào page client chính.
   - Nhập `FavoritesPageClient` vào file Server Route `src/app/[locale]/(main)/(protected)/favorites/page.tsx`.
