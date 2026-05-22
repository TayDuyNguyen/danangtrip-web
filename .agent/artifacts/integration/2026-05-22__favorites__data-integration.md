# Data Integration Plan: Địa điểm Yêu thích (favorites)

> Feature slug: `favorites`
> Date: 2026-05-22
> Service scope: `src/services/favorite.service.ts`

---

## 1) Data Sources
| Purpose | Source | Server or Client | Notes |
|---|---|---|---|
| Lấy danh sách địa điểm đã lưu yêu thích của người dùng | `favoriteService.getFavorites()` (`GET /user/favorites`) | Client (via TanStack Query) | Sử dụng tham số `per_page: 100` để hỗ trợ phân trang và sắp xếp client-side mượt mà không gây trễ request. |
| Thêm địa điểm vào danh sách yêu thích (hoặc phục hồi khi nhấn Hoàn tác) | `favoriteService.addFavorite()` (`POST /user/favorites`) | Client (via TanStack Query Mutation) | Cần truyền tham số `{ location_id: number }`. |
| Xóa địa điểm khỏi danh sách yêu thích | `favoriteService.removeFavorite()` (`DELETE /user/favorites`) | Client (via TanStack Query Mutation) | Cần truyền tham số `{ location_id: number }` ở phần body request. |

## 1.1) Data Ownership Notes
- **Query chính (Source of Truth):**
  - Query `["favorites", "list", params]` là nguồn dữ liệu duy nhất và chính xác nhất cho danh sách yêu thích của người dùng hiện tại.
- **Supporting Lookup / Cache Invalidation:**
  - Khi thực hiện các hành động Đăng ký yêu thích / Hủy đăng ký yêu thích, query key chính `["favorites"]` sẽ bị vô hiệu hóa (`invalidateQueries`) để đảm bảo tính đồng bộ trên tất cả các trang khác (như trang Chi tiết địa điểm hay Lưới danh sách địa điểm chung).

## 2) Query / Hook Plan
| Query Key | Hook File | Trigger | staleTime | Notes |
|---|---|---|---|---|
| `["favorites", "list", params]` | `src/features/favorites/hooks/useFavoritesQuery.ts` | Kích hoạt ngay khi trang `/favorites` được render và người dùng đã đăng nhập. | `30000` (30 giây) | Đặt thời gian staleTime ngắn để tránh render dữ liệu đã cũ, nhưng vẫn có khả năng caching khi chuyển đổi tab/trang nhanh. |

## 2.1) Parallel / Dependent Query Notes
| Query | Parallel or Dependent | Why |
|---|---|---|
| `["favorites", "list", params]` | Độc lập | Trang yêu thích hoạt động độc lập và chỉ yêu cầu trạng thái đăng nhập hợp lệ từ `ProtectedLayout` trước khi kích hoạt. |

## 3) Mutation Plan
| Action | Service Function | Success Handling | Error Handling |
|---|---|---|---|
| **Add Favorite (Hoàn tác)** | `favoriteService.addFavorite(params)` | - Invalidate queries: `["favorites"]`<br>- Toast thông báo thành công: `toast_added_back`<br>- Khôi phục ID địa điểm khỏi danh sách đang xóa (`removingIds`) trên UI. | - Toast thông báo lỗi hoàn tác: `toast_undo_error`<br>- Đưa lại ID địa điểm vào danh sách xóa trên UI. |
| **Remove Favorite (Xóa)** | `favoriteService.removeFavorite(params)` | - Invalidate queries: `["favorites"]`<br>- Đưa ID địa điểm vào danh sách ẩn tạm thời (`removingIds`) ngay lập tức để tạo phản hồi nhanh (Optimistic UI update).<br>- Trình diễn toast thông báo xóa thành công `toast_removed` có thời gian chờ 5 giây đi kèm CTA "Hoàn tác". | - Toast thông báo lỗi xóa: `toast_remove_error`<br>- Loại bỏ ID địa điểm khỏi danh sách ẩn tạm thời (`removingIds`) để thẻ xuất hiện lại. |

## 4) UI State Handling
| UI Section | Loading | Empty | Error | Success |
|---|---|---|---|---|
| **Danh sách Yêu thích** | Hiển thị `FavoritesSkeleton` mô phỏng giao diện lưới hoặc danh sách tương ứng với state xem hiện tại. | Hiển thị `FavoritesEmptyState` có thông điệp hướng dẫn và nút bấm CTA để đi tới trang Khám phá Địa điểm `/locations`. | Hiển thị hộp thoại lỗi dạng thẻ tối giản có nút bấm "Tải lại" (`refetch`). | Hiển thị danh sách địa điểm đã được phân trang và sắp xếp thành công. |

## 4.1) Error Strategy
| Error Type | UI Handling | Toast | Retry |
|---|---|---|---|
| **Lỗi tải danh sách ban đầu (API GET thất bại)** | Hiển thị khung thông báo lỗi tại vị trí danh sách. | Không dùng toast để tránh làm phiền, tập trung vào giao diện lỗi trực quan. | Có nút "Tải lại" kích hoạt trực tiếp hàm `refetch` từ TanStack Query. |
| **Lỗi thực thi hành động xóa** | Khôi phục thẻ địa điểm trên giao diện ngay lập tức. | Toast thông báo lỗi: `toast_remove_error` ("Không thể xóa địa điểm khỏi danh sách yêu thích"). | Không hỗ trợ tự động retry, người dùng có thể bấm nút xóa một lần nữa. |
| **Lỗi thực thi hoàn tác (add back)** | Giữ nguyên trạng thái đã xóa trên giao diện. | Toast thông báo lỗi hoàn tác: `toast_undo_error` ("Không thể hoàn tác hành động"). | Không hỗ trợ tự động retry. |

## 5) Files Expected To Change
- `src/features/favorites/hooks/useFavoritesQuery.ts` (Đã hoàn thiện)
- `src/features/favorites/hooks/useFavoriteMutation.ts` (Đã hoàn thiện)
- `src/features/favorites/components/FavoritesPageClient.tsx` (Đã kết nối data)

## 6) Risks / Open Questions
- **R-01 (Đồng bộ số lượng phía Client):** Do quá trình xóa và hoàn tác sử dụng optimistic update kết hợp độ trễ 5 giây của toast thông báo, số lượng hiển thị trên tiêu đề trang (`count`) sẽ được tính dựa trên số lượng thật trừ đi các ID đang trong hàng đợi xóa (`removingIds`). Điều này đảm bảo trải nghiệm người dùng luôn chính xác với những gì họ nhìn thấy trên màn hình.
- **Q-01 (Sắp xếp Client-side):** Vì API backend `/user/favorites` hiện tại chưa hỗ trợ sắp xếp trực tiếp qua câu lệnh SQL trên database, chúng ta fetch tối đa `per_page: 100` bản ghi và tiến hành sắp xếp (sort) cùng phân trang hoàn toàn bằng JavaScript ở phía client. Phương án này hoàn toàn khả thi và tối ưu về hiệu năng vì danh sách yêu thích của mỗi người dùng thường nhỏ hơn 100 địa điểm.
