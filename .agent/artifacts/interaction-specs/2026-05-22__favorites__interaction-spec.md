# Interaction Spec: Địa điểm Yêu thích (favorites)

> Feature slug: `favorites`
> Date: 2026-05-22
> Feature scope: `src/features/favorites/...`

---

## 1) Main User Actions
| Action | Trigger | Validation | Success Feedback | Error Feedback |
|---|---|---|---|---|
| **Xem danh sách yêu thích** | Truy cập route `/favorites` | Kiểm tra đăng nhập (được xử lý ở `ProtectedLayout`) | Hiển thị danh sách địa điểm yêu thích của người dùng. | Chuyển hướng về `/login?callbackUrl=%2Ffavorites` nếu chưa đăng nhập. |
| **Xóa yêu thích (Hủy lưu)** | Click biểu tượng ❤️ trên card | Yêu cầu đăng nhập, kiểm tra ID địa điểm hợp lệ | Thẻ địa điểm biến mất tức thì (Optimistic UI). Xuất hiện toast thông báo thành công có nút "Hoàn tác" tồn tại trong 5 giây. | Khôi phục thẻ địa điểm trên giao diện, hiển thị toast thông báo lỗi. |
| **Hoàn tác xóa (Undo)** | Click nút "Hoàn tác" trên toast thông báo | Trạng thái toast còn hiệu lực (< 5 giây) | Đưa địa điểm trở lại danh sách, ẩn toast, hiển thị toast khôi phục thành công. | Giữ nguyên trạng thái đã xóa, hiển thị toast thông báo lỗi hoàn tác. |
| **Thay đổi kiểu xem (Grid/List)** | Click các nút toggle dạng Grid/List | Trạng thái view hiện tại khác trạng thái click | Giao diện danh sách chuyển đổi mượt mà giữa dạng lưới và dạng dòng. | Không có |
| **Sắp xếp danh sách (Sort)** | Chọn tùy chọn trong dropdown | Giá trị sắp xếp hợp lệ | Danh sách địa điểm tự động sắp xếp lại theo tiêu chí và tự động đưa phân trang về trang 1. | Không có |
| **Phân trang (Pagination)** | Click số trang hoặc mũi tên điều hướng | Số trang trong phạm vi `1` đến `totalPages` | Cập nhật danh sách trang mới, tự động cuộn màn hình lên đầu trang mượt mà (smooth scroll). | Vô hiệu hóa điều hướng nếu trang không hợp lệ hoặc đang ở trang giới hạn. |

## 1.1) Action Priority
| Action | Priority | Why |
|---|---|---|
| **Xóa yêu thích & Hoàn tác** | High | Đây là tương tác cốt lõi làm thay đổi trạng thái dữ liệu (mutation). Trải nghiệm hoàn tác trong 5 giây thay thế confirm dialog giúp thao tác nhanh và mượt mà hơn. |
| **Xem danh sách & Phân trang** | High | Chức năng cơ bản để duyệt các địa điểm người dùng đã lưu. |
| **Sắp xếp & Thay đổi kiểu xem** | Medium | Các tiện ích bổ sung nâng cao trải nghiệm người dùng tùy chỉnh giao diện hiển thị. |

## 2) Forms
*Không áp dụng:* Trang danh sách yêu thích không chứa các biểu mẫu điền thông tin hoặc các ô nhập liệu cần kiểm thử Schema Zod.

## 3) Search / Filter / Pagination
| Control | URL Sync | Debounce | Notes |
|---|---|---|---|
| **Sắp xếp (Sort Select)** | Không | Không | Sắp xếp dữ liệu trực tiếp ở client-side trên mảng dữ liệu đã tải về. |
| **Kiểu xem (View Toggle)** | Không | Không | Trạng thái hiển thị cục bộ (local state `grid` hoặc `list`). |
| **Phân trang (Pagination)** | Không | Không | Phân trang client-side dựa trên mảng dữ liệu đã được sắp xếp. |

## 3.1) Default Values / Reset Logic
| Control | Default Value | Reset Behavior | Notes |
|---|---|---|---|
| **Sắp xếp (Sort Select)** | `newest` | Tự động đặt lại về `newest` khi tải lại trang | Lựa chọn mặc định là hiển thị các địa điểm được yêu thích gần đây nhất. |
| **Kiểu xem (View Toggle)** | `grid` | Giữ nguyên khi chuyển trang, reset khi F5 trang | Dạng lưới tối ưu về mặt hình ảnh. |
| **Phân trang (Pagination)** | `1` | Reset về `1` bất cứ khi nào tiêu chí sắp xếp (`sort`) thay đổi. | Tránh lỗi hiển thị trang rỗng khi tổng số trang bị giảm đi sau khi lọc/sắp xếp. |

## 4) Destructive / Protected Actions
| Action | Confirm UI | Permission | Notes |
|---|---|---|---|
| **Xóa yêu thích (Hủy lưu)** | Bỏ qua hộp thoại xác nhận (Confirm Dialog), thay thế bằng **Toast Undo Window** kéo dài 5 giây. | Yêu cầu đăng nhập (`Owner` mới được thực thi) | Cung cấp trải nghiệm cao cấp, tránh gây gián đoạn thao tác liên tục của người dùng bằng popup xác nhận phiền hà. |

## 4.1) Loading / Pending Behavior
| Action | Pending UI | Disabled Elements | Notes |
|---|---|---|---|
| **Đang thực thi Xóa / Hoàn tác** | Thay đổi độ mờ của thẻ địa điểm bị tác động, nút trái tim hiển thị hiệu ứng mờ nhạt. | Nút trái tim ❤️ trên thẻ đó bị vô hiệu hóa tạm thời (`pointer-events-none`) để ngăn chặn việc người dùng nhấn liên tiếp (double click) gây nhiễu luồng API. | Các thẻ khác vẫn có thể tương tác bình thường. |

## 5) Files Expected To Change
- `src/features/favorites/components/FavoritesPageClient.tsx` (Đã hoàn thiện logic tương tác)
- `src/features/favorites/components/FavoriteCardItem.tsx` (Đã hoàn thiện hiệu ứng click xóa)
- `src/features/favorites/components/FavoriteListItem.tsx` (Đã hoàn thiện hiệu ứng click xóa)

## 6) Risks / Open Questions
- **R-01 (Mất đồng bộ mạng khi Hoàn tác):** Nếu người dùng nhấn xóa địa điểm yêu thích (gửi API DELETE thành công) và nhanh chóng bấm "Hoàn tác", hệ thống sẽ gửi API POST để lưu lại địa điểm đó. Nếu mạng gặp sự cố đúng lúc bấm hoàn tác, dữ liệu thực tế trên database sẽ bị xóa mất nhưng UI có thể bị hiển thị sai.
  * *Giải pháp:* Trong hàm `onError` của add mutation (hoàn tác thất bại), hệ thống sẽ hiển thị toast lỗi và tự động đưa ID địa điểm vào danh sách xóa (`removingIds`) để ẩn thẻ khỏi màn hình, đảm bảo tính nhất quán giữa UI và DB.
