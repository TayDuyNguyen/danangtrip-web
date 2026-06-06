# Interaction Spec: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Feature scope: `src/features/search/...`

---

## 1) Main User Actions
| Action | Trigger | Validation | Success Feedback | Error Feedback |
|---|---|---|---|---|
| Nhập từ khóa tìm kiếm | Thay đổi nội dung input | Debounce 500ms trước khi tìm, gọi API suggestion khi ≥ 2 ký tự | Hiển thị Autocomplete gợi ý | Ẩn dropdown gợi ý |
| Chọn gợi ý từ Autocomplete | Click một item trong dropdown | Không | Điền từ khóa vào ô nhập và thực hiện tìm kiếm, cập nhật URL | N/A |
| Lọc kết quả nâng cao | Áp dụng thay đổi trong Filter Drawer | So khớp khoảng giá (Min ≤ Max) | Đóng Drawer, cập nhật tham số URL, reload Grid kết quả | Hiển thị lỗi trường giá tại Drawer |
| Xóa thẻ bộ lọc nhanh | Click nút `×` trên Tag bộ lọc ở Header | Không | Xóa tham số tương ứng trên URL, reload Grid kết quả | N/A |
| Đặt lại tất cả bộ lọc | Click nút "Đặt lại" (Reset) ở Header hoặc Drawer | Không | Xóa mọi tham số lọc trên URL (giữ lại `q` và `type`), reload Grid | N/A |
| Chuyển tab loại dữ liệu | Click tab Tất cả / Địa điểm / Tour | Không | Cập nhật tham số `type` trên URL, reset trang về `1` | N/A |
| Xem lịch sử tìm kiếm | Ô nhập tìm kiếm trống và nhấp chuột focus | Không | Hiển thị danh sách 5 từ khóa tìm kiếm gần nhất từ local storage | N/A |
| Xóa từ khóa lịch sử đơn lẻ | Click nút `×` trên dòng lịch sử | Không | Cập nhật local storage, ẩn dòng vừa xóa | N/A |

## 1.1) Action Priority
| Action | Priority | Why |
|---|---|---|
| Nhập từ khóa tìm kiếm | High | Trải nghiệm tìm kiếm chính của trang. |
| Chọn gợi ý Autocomplete | High | Giúp người dùng điều hướng nhanh và chính xác. |
| Lọc kết quả nâng cao | Medium | Đáp ứng nhu cầu phân loại thông tin sâu. |
| Lưu & xem lịch sử | Low | Cải thiện trải nghiệm tiện ích cho người dùng quay lại. |

## 2) Forms
*Không sử dụng React Hook Form do không có biểu mẫu nhập dữ liệu phức tạp cần submit lên server.*

## 3) Search / Filter / Pagination
| Control | URL Sync | Debounce | Notes |
|---|---|---|---|
| Input tìm kiếm chính | Có (`?q=...`) | 500ms cho việc tìm kiếm chính | Để giảm số lượng request tải kết quả. |
| Autocomplete dropdown | Không (Chỉ cập nhật state client) | 300ms cho việc hiển thị danh sách suggestions | Đảm bảo hiển thị nhanh khi đang gõ. |
| Các bộ lọc Drawer | Có (`?category=...&district=...&minPrice=...&maxPrice=...&rating=...`) | Không | Áp dụng tức thì khi nhấn nút "Áp dụng". |
| Phân trang | Có (`?page=...`) | Không | Tải trang dữ liệu mới, cuộn mượt mà. |

## 3.1) Default Values / Reset Logic
| Control | Default Value | Reset Behavior | Notes |
|---|---|---|---|
| Loại tìm kiếm (`type`) | `"all"` | Khôi phục về `"all"` | Khi đổi tab |
| Danh mục | `undefined` | Xóa key khỏi URL | Khi bấm đặt lại |
| Khoảng giá | `undefined` | Xóa key, clear text input | Khi bấm đặt lại |

## 4) Destructive / Protected Actions
*Không có hành động xóa dữ liệu phá hủy (destructive) hoặc được bảo vệ nghiêm ngặt bằng phân quyền (protected).*

## 4.1) Loading / Pending Behavior
| Action | Pending UI | Disabled Elements | Notes |
|---|---|---|---|
| Tải trang kết quả khi đổi bộ lọc/phân trang | Hiển thị loader mờ bán trong suốt đè lên Grid hiện tại | Vô hiệu hóa phân trang và các tab chọn | Tránh việc nhấn liên tục gây race condition. |

## 5) Files Expected To Change
- `src/features/search/components/SearchResultHeader.tsx`
- `src/features/search/components/SearchFiltersSheet.tsx`

## 6) Risks / Open Questions
- **R-01**: Đồng bộ state giữa Input nội bộ của Autocomplete dropdown và state tìm kiếm chính trong URL để tránh lệch từ khóa hiển thị.
