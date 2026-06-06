# UI Spec: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Source analysis: `2026-05-28__user-search-hardening__screen-analysis.md`

---

## 1) Summary
- **Mục tiêu UI**: Củng cố các thành phần giao diện của trang tìm kiếm, đảm bảo hoạt động mượt mà ở cả chế độ máy tính (desktop) và điện thoại (mobile). Thiết kế mang phong cách Glassmorphism đồng nhất với hệ thống.
- **Bề mặt tương tác chính**:
  - Input tìm kiếm có debounced và popup gợi ý tự động (autocomplete dropdown).
  - Panel bộ lọc kéo từ cạnh phải (Filter Drawer).
  - Tab chọn phân loại kết quả và phân trang kết quả tìm kiếm.

## 1.1) UI Delivery Goal
- **Above-the-fold content**:
  - Thanh tìm kiếm trung tâm lớn dạng Glassmorphism tích hợp input, nút mở bộ lọc.
  - Từ khóa phổ biến và xu hướng nổi bật (khi chưa gõ từ khóa) để kích thích tìm kiếm.
- **Secondary/supporting UI**:
  - Danh sách card kết quả (Tour/Location) được hiển thị theo grid.
  - Phân trang dưới cùng.
  - Panel Drawer bộ lọc nâng cao.

## 2) Component Matrix
### [REUSE]
| Component | Path | Why reuse | Notes |
|---|---|---|---|
| `SearchGrid` | `src/features/search/components/SearchGrid.tsx` | Grid hiển thị danh sách card | Đã hỗ trợ responsive tốt. |
| `SearchResultCard` | `src/features/search/components/SearchResultCard.tsx` | Card hiển thị kết quả tour/địa điểm | Hiển thị thông tin rating, thumbnail, badge tương ứng. |
| `SearchTabs` | `src/features/search/components/SearchTabs.tsx` | Chuyển đổi tab loại thực thể | Đã có hiệu ứng hover và active. |

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `SearchSuggestionsDropdown` | Molecule | Gợi ý các từ khóa khi người dùng nhập tối thiểu 2 ký tự | `{ query: string; isOpen: boolean; onClose: () => void; onSelect: (val: string) => void; }` |

### [MOD]
| Component | Path | Required change | Impact |
|---|---|---|---|
| `SearchResultHeader` | `src/features/search/components/SearchResultHeader.tsx` | Gắn component Autocomplete dropdown, thiết kế phần lịch sử tìm kiếm local storage | Cải thiện UX tìm kiếm, giúp người dùng truy cập nhanh từ khóa cũ. |
| `SearchFiltersSheet` | `src/features/search/components/SearchFiltersSheet.tsx` | Ẩn danh mục lọc khi type là "Tất cả" (all) để tránh bug trùng mã danh mục | Ngăn ngừa việc lọc sai loại dữ liệu. |

## 3) UI States
| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| Input & Autocomplete | Biểu tượng loading xoay nhẹ | Hiển thị "Không tìm thấy gợi ý nào" | Ẩn dropdown hoặc hiện thông báo lỗi | Hiển thị danh sách gợi ý | N/A |
| Result Grid | Hiển thị `SearchGridSkeleton` | Hiển thị hình vẽ 🔍 + "Không tìm thấy kết quả" | Hiển thị thông báo lỗi hệ thống | Hiển thị danh sách card kết quả | N/A |
| Filter Drawer | Trạng thái loading của các Select | Hiển thị danh sách trống | Hiển thị lỗi tải | Cho phép chọn các option | N/A |

## 3.1) Motion / Interaction Notes
| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| `SearchSuggestionsDropdown` | Dòng được chọn đổi màu nền sang `#8b6a55/20` | Xuất hiện slide-down nhẹ nhàng (700ms) | Hỗ trợ tương tác mượt. |
| `SearchResultCard` | Phóng to nhẹ, đổi viền sang màu `#8b6a55/65` | Reveal-up (700ms) với stagger delay tăng dần | Hiệu ứng WOW theo `DESIGN.md`. |
| `SearchFiltersSheet` | Trượt từ phải sang (slide-in-from-right) | Overlay mờ dần (fade-in) | Trải nghiệm Drawer cao cấp. |

## 4) Responsive Notes
| Breakpoint | Behavior | Notes |
|---|---|---|
| Mobile | Input tìm kiếm giãn rộng 100%, nút bộ lọc chuyển xuống dưới hoặc thu gọn | Tránh tràn màn hình. |
| Tablet | Grid kết quả chuyển thành 2 cột | Cân đối không gian hiển thị. |
| Desktop | Grid kết quả 3 cột, input và nút bộ lọc nằm ngang | Tối ưu trải nghiệm màn hình rộng. |

## 5) Files Expected To Change
- `src/features/search/components/SearchResultHeader.tsx`
- `src/features/search/components/SearchFiltersSheet.tsx`

## 6) Build Order
1. **Atoms**: Tạo kiểu dữ liệu / types cho autocomplete suggestion và search history.
2. **Molecules**: Tạo mới `SearchSuggestionsDropdown` component.
3. **Organisms**: Chỉnh sửa `SearchResultHeader` để tích hợp dropdown gợi ý và phần hiển thị lịch sử tìm kiếm.
4. **Page assembly**: Chỉnh sửa `SearchFiltersSheet` để tinh chỉnh việc hiển thị bộ lọc danh mục.
