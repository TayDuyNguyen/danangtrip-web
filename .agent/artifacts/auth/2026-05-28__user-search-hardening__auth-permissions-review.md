# Auth & Permissions Review: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Route scope: `/search`

---

## 1) Protected Routes
| Route | Middleware Needed | Redirect Behavior | Notes |
|---|---|---|---|
| `/search` | Không | N/A | Trang tìm kiếm hoàn toàn public, bất kỳ ai cũng có thể truy cập mà không cần đăng nhập. |

## 2) Role Matrix
| Role | View | Create | Update | Delete | Notes |
|---|---|---|---|---|---|
| guest | Có | Không | Không | Không | Chỉ có quyền đọc và sử dụng tính năng tìm kiếm, gợi ý. |
| user | Có | Không | Không | Không | Quyền giống guest đối với trang tìm kiếm. Có thể tương tác thêm yêu thích và xem lịch sử tìm kiếm cá nhân lưu local. |
| admin | Có | Không | Không | Không | Quyền giống user trên trang tìm kiếm. |

## 2.1) Action Matrix
| Action | Allowed Role(s) | UI Behavior | Backend Expectation | Notes |
|---|---|---|---|---|
| Thực hiện tìm kiếm | Tất cả | Visible | Không cần auth | |
| Xem lịch sử tìm kiếm gần đây | Tất cả | Hiển thị dropdown khi focus input rỗng | Lưu và truy xuất từ localStorage dựa trên UserId | Không gọi API |
| Thêm/xóa yêu thích từ card kết quả | User, Admin | Hiển thị nút trái tim trên card | Gửi request `POST /v1/user/favorites` (bắt buộc JWT token) | Nút này bị gate dựa trên `isAuthenticated` |

## 3) Guarded UI Actions
| UI Element | Visible To | Why |
|---|---|---|
| Nút yêu thích (trái tim) trên `SearchResultCard` | Người dùng đã đăng nhập | Khách vãng lai không thể lưu địa điểm/tour vào danh sách yêu thích. |
| Danh sách lịch sử tìm kiếm | Tất cả | Lưu cục bộ phân tách theo User ID / Guest |

## 3.1) Hidden vs Disabled Decisions
| UI Element | Hidden or Disabled | Reason | Risk |
|---|---|---|---|
| Nút yêu thích cho guest | Disabled / Yêu cầu đăng nhập | Hiện icon rỗng, khi click hiển thị Modal hoặc Toast yêu cầu đăng nhập. | Tăng tỷ lệ đăng ký của người dùng |

## 4) Risks / Assumptions
- **A-01**: Giả định rằng local storage là đủ an toàn để lưu trữ lịch sử tìm kiếm tạm thời của người dùng. Không lưu trữ thông tin nhạy cảm.

## 5) Files / Areas Affected
- `src/features/search/components/SearchResultHeader.tsx`
- `src/features/search/hooks/use-search-history.ts`
