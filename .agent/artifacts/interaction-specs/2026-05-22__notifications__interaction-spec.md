# Interaction Spec: Trung tâm Thông báo (notifications)

> Feature slug: `notifications`
> Date: 2026-05-22
> Feature scope: `src/features/notifications/...`

---

## 1) Main User Actions
| Action | Trigger | Validation | Success Feedback | Error Feedback |
|---|---|---|---|---|
| **Xem danh sách thông báo** | Truy cập route `/notifications` | Yêu cầu đăng nhập (Middleware edge redirects nếu chưa auth) | Hiển thị danh sách thông báo cá nhân phân trang (10 mục/trang). | Hiển thị skeleton và báo lỗi nếu API gặp sự cố. |
| **Lọc thông báo (All/Unread)** | Click các tab Tất cả / Chưa đọc | Trạng thái tab hiện tại khác tab được click | Khởi tạo lại danh sách ở trang 1 theo tham số lọc thích hợp (`read=false` nếu Chưa đọc). | Giữ nguyên danh sách hiện tại và thông báo lỗi. |
| **Đánh dấu một thông báo đã đọc** | Click vào thẻ thông báo chưa đọc | ID thông báo hợp lệ, chưa được đọc | UI làm mất chấm tròn chưa đọc và dải màu dọc bên trái tức thì (Optimistic UI), header badge giảm đi 1. | Khôi phục chấm tròn chưa đọc trên UI, hiển thị toast báo lỗi. |
| **Điều hướng Deep-linking** | Click thẻ có thuộc tính `data.url` | `data.url` hợp lệ (ví dụ `/bookings/code/DT-X`) | Gửi request mark-read chạy ngầm đồng thời dùng `useTransition` chuyển hướng mượt mà đến trang đích. | Chuyển hướng thất bại hoặc không đánh dấu được đã đọc, hiển thị toast báo lỗi. |
| **Đánh dấu tất cả đã đọc** | Click nút "Đánh dấu tất cả đã đọc" ở Header | `unreadCount > 0`, nút ở trạng thái hoạt động | Toàn bộ chấm đỏ chưa đọc biến mất, header badge đếm về 0, hiển thị toast báo thành công. | Khôi phục trạng thái cũ, hiển thị toast báo lỗi. |
| **Xóa thông báo** | Click biểu tượng Thùng rác trên thẻ | ID thông báo hợp lệ | Thẻ mờ đi (`opacity-50 pointer-events-none scale-95`), sau đó bị xóa hẳn khỏi DOM kèm toast thông báo thành công. | Khôi phục độ mờ và tỷ lệ của thẻ, hiển thị toast báo lỗi. |
| **Phân trang (Pagination)** | Click số trang hoặc nút mũi tên | Trang trong phạm vi hợp lệ (`1` đến `totalPages`) | Danh sách hiển thị trang dữ liệu mới, cuộn mượt mà lên đầu trang. | Nút bị vô hiệu hóa nếu đang ở trang biên. |

## 1.1) Action Priority
| Action | Priority | Why |
|---|---|---|
| **Xem & Lọc thông báo** | High | Chức năng cơ bản để duyệt thông tin cá nhân. |
| **Đọc, Đánh dấu tất cả đã đọc & Xóa** | High | Các tương tác cốt lõi thay đổi trạng thái dữ liệu trên server, cần phản hồi giao diện tức thì (Optimistic). |
| **Deep-linking** | High | Tương tác liền mạch đưa người dùng đến đúng nghiệp vụ phát sinh (Ví dụ đặt tour thành công -> Click -> Chi tiết đơn đặt tour). |

## 2) Forms
*Không áp dụng:* Trang danh sách thông báo không chứa các biểu mẫu điền thông tin hoặc các ô nhập liệu cần kiểm thử Schema Zod.

## 3) Search / Filter / Pagination
| Control | URL Sync | Debounce | Notes |
|---|---|---|---|
| **Bộ lọc Tab (All/Unread)** | Không | Không | Quản lý qua local state `activeTab`. Tự động đưa trang về 1 khi đổi tab. |
| **Phân trang (Pagination)** | Không | Không | Quản lý qua local state `page`, cập nhật tham số API để kéo dữ liệu mới. |

## 3.1) Default Values / Reset Logic
| Control | Default Value | Reset Behavior | Notes |
|---|---|---|---|
| **Bộ lọc Tab** | `all` | Reset về `all` khi tải lại trang | Hiển thị tất cả các loại thông báo theo thứ tự mới nhất. |
| **Phân trang** | `1` | Reset về `1` bất cứ khi nào đổi tab lọc. | Tránh trường hợp trang `unread` có ít phần tử hơn trang `all` dẫn đến lỗi hiển thị trang trống. |

## 4) Destructive / Protected Actions
| Action | Confirm UI | Permission | Notes |
|---|---|---|---|
| **Xóa thông báo** | Bỏ qua popup xác nhận để tăng tính nhanh gọn, thay bằng làm mờ card tức thì và hiển thị Sonner toast cho phép hoàn tác/phản hồi. | Yêu cầu đã đăng nhập (Chỉ xóa thông báo của cá nhân) | Sử dụng hiệu ứng `scale-95 duration-250` tinh tế để biểu thị việc biến mất. |

## 4.1) Loading / Pending Behavior
| Action | Pending UI | Disabled Elements | Notes |
|---|---|---|---|
| **Đang xóa thông báo** | Card bị gán `opacity-50 pointer-events-none scale-95` | Vô hiệu hóa toàn bộ tương tác trên thẻ đó | Các thẻ khác vẫn có thể click/hover bình thường. |
| **Đang đánh dấu tất cả đã đọc** | Nút chuyển sang trạng thái loading quay tròn nhẹ kèm text "Đánh dấu tất cả..." | Nút bị vô hiệu hóa tạm thời | Ngăn người dùng click đúp gửi trùng lặp request lên server. |

## 5) Files Expected To Change
- `src/features/notifications/components/NotificationsPageClient.tsx` (Điều phối tương tác)
- `src/features/notifications/components/NotificationItemCard.tsx` (Tương tác đơn lẻ và hiệu ứng)
- `src/features/notifications/components/NotificationsHeader.tsx` (Tương tác đánh dấu tất cả)
- `src/features/notifications/components/NotificationsFilterTabs.tsx` (Tương tác bộ lọc)

## 6) Risks / Open Questions
- **R-01 (Xóa thẻ cuối cùng trên phân trang):** Khi ở trang phân trang > 1, nếu xóa phần tử duy nhất còn lại trên trang đó, danh sách sẽ bị rỗng.
  * *Giải pháp:* Trong hàm `onSuccess` của remove mutation, hệ thống sẽ tự động phát hiện số lượng phần tử hiện tại (`currentItemsCount <= 1`), nếu đúng và `page > 1`, sẽ tự động lùi về trang trước `setPage(page - 1)`.
