# Screen Analysis: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Figma: N/A (Based on SRS and `user_search.md` specifications)

---

## 1) Summary
- **Mục tiêu màn hình**: Tìm kiếm địa điểm du lịch và tour du lịch tại Đà Nẵng, áp dụng bộ lọc nâng cao (danh mục, quận/huyện, khoảng giá, đánh giá), và cung cấp trải nghiệm tìm kiếm mượt mà với autocomplete gợi ý từ khóa, các từ khóa phổ biến/xu hướng và lịch sử tìm kiếm của người dùng.
- **Ai là người dùng chính**: Khách du lịch (vãng lai hoặc đã đăng nhập).
- **Thuộc feature/module nào**: `search`
- **Source inputs nào đã dùng**:
  - `D:\DATN\DATN_Tài liệu\docs\page\user_search.md`
  - Code thực tế trong `danangtrip-web` và `danangtrip-api`
  - `DESIGN.md` và `globals.css` (Màu sắc và hiệu ứng Glassmorphism)

## 2) Design Token Audit
| Token | Figma/SRS Value | DESIGN.md Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Primary color | `#0066CC` | `#8B6A55` | ✗ No | Dự án web hiện tại dùng tông màu đồng đất ấm (`#8B6A55`) thay cho màu xanh lam trong SRS. Chúng ta sẽ tuân thủ tông màu `#8B6A55` của web để duy trì tính nhất quán. |
| Typography | Inter, SFMono-Regular | Inter, SFMono-Regular | ✓ Yes | |
| Spacing | Khung 4px | 4px base | ✓ Yes | |
| Border radius | 12px | 8px (standard), 12px | ✓ Yes | |
| Shadow/Blur | Shadow modal | Glassmorphism blur (12px) | ✓ Yes | Sử dụng `glass-retro` cho popup autocomplete và filter sheet. |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `SearchGrid` | `src/features/search/components/SearchGrid.tsx` | Không | Grid hiển thị danh sách kết quả |
| `SearchResultCard` | `src/features/search/components/SearchResultCard.tsx` | Không | Card hiển thị kết quả tour/địa điểm đơn lẻ |
| `SearchTabs` | `src/features/search/components/SearchTabs.tsx` | Không | Tab chuyển đổi giữa Tất cả/Địa điểm/Tour |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|-----------|-------|--------------------------------------|-----------------|
| `SearchSuggestionsDropdown` | Dropdown hiển thị các gợi ý tự động khi người dùng đang gõ nhập từ khóa tìm kiếm. | Molecule | `{ query: string; isOpen: boolean; onClose: () => void; onSelect: (val: string) => void; }` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `SearchResultHeader` | `src/features/search/components/SearchResultHeader.tsx` | Tích hợp dropdown gợi ý tự động (autocomplete), hiển thị lịch sử tìm kiếm của người dùng và hiển thị đúng các từ khóa phổ biến/xu hướng từ API. | Thêm popup autocomplete và quản lý lịch sử tìm kiếm local storage |
| `SearchFiltersSheet` | `src/features/search/components/SearchFiltersSheet.tsx` | Ẩn bộ lọc danh mục (Category) khi ở tab "Tất cả" để tránh xung đột mã danh mục giữa tour và địa điểm. | Tránh lỗi áp dụng mã danh mục sai loại thực thể |
| `useSearch` | `src/features/search/hooks/use-search.ts` | Ẩn phân trang hoặc đồng bộ meta phân trang phù hợp khi tìm kiếm hỗn hợp ở tab "Tất cả". | Phân trang hoạt động chính xác |
| `useSearchDiscovery` | `src/features/search/hooks/use-search-discovery.ts` | Khắc phục bug mapping dữ liệu popular/trending từ dạng object thành chuỗi `string[]`. | Hiển thị đúng từ khóa phổ biến và xu hướng |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | Grid 3 cột cho kết quả, input nằm ngang với nút bộ lọc | Baseline |
| Tablet (768-1023px) | Grid 2 cột cho kết quả, bộ lọc mở dạng Sidebar | Tương thích tốt với các nút điều khiển |
| Mobile (<768px) | Grid 1 cột, input tìm kiếm chiếm trọn chiều rộng, nút mở bộ lọc nằm phía dưới hoặc dạng icon | Tối ưu hóa padding và kích thước text |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Autocomplete Dropdown | Hiện spinner nhỏ trong input | Hiển thị "Không tìm thấy kết quả phù hợp" | Ẩn dropdown hoặc hiện thông báo lỗi nhẹ | Hiển thị danh sách gợi ý | N/A | Nhấn phím mũi tên di chuyển, hover đổi màu nền |
| Search Result Grid | Skeleton grid nhấp nháy | Hiển thị hình vẽ 🔍 + "Không tìm thấy kết quả" + nút Reset bộ lọc | Hiện thông báo lỗi hoặc ẩn | Hiển thị danh sách card kết quả | N/A | Hover card phóng to nhẹ, đổi viền |
| Filter Sheet | Spinner hoặc skeleton trong Select | Hiển thị danh sách trống | Hiển thị lỗi tải | Cho phép chọn bộ lọc | N/A | Hover nút bấm đổi độ sáng |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `q` | `string` | ✗ | Max 100 ký tự | `"Sơn Trà"` | `GET /v1/search` |
| `type` | `"tour" \| "location" \| "all"` | ✗ | Chỉ được chọn các giá trị này | `"tour"` | `GET /v1/search` |
| `category_id` | `number` | ✗ | ID phải tồn tại | `2` | `GET /v1/search` (Location) |
| `tour_category_id` | `number` | ✗ | ID phải tồn tại | `1` | `GET /v1/search` (Tour) |
| `district` | `string` | ✗ | Max 50 ký tự | `"Sơn Trà"` | `GET /v1/search` |
| `price_min` | `number` | ✗ | Phải ≥ 0 | `500000` | `GET /v1/search` |
| `price_max` | `number` | ✗ | Phải >= price_min | `2000000` | `GET /v1/search` |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| `GET` | `/v1/search` | ✗ | `SearchRequestParams` | `PaginatedResponse<Tour \| Location>` | 500, 422 |
| `GET` | `/v1/search/suggestions` | ✗ | `{ q: string, limit: number }` | `{ query: string, suggestions: string[] }` | 500 |
| `GET` | `/v1/search/popular` | ✗ | `{ limit: number, days: number }` | `{ popular: [{ query: string, count: number }] }` | 500 |
| `GET` | `/v1/search/trending` | ✗ | `{ limit: number }` | `{ trending: [{ query: string, count: number }] }` | 500 |

## 8) Business Rules
- **BR-01**: Khi từ khóa tìm kiếm `q` để trống, trang tìm kiếm `/search` không thực hiện gọi API tìm kiếm chính mà chuyển sang chế độ "Khám phá" (Discovery) hiển thị các địa điểm và tour nổi bật.
- **BR-02**: Khi người dùng nhập từ khóa tìm kiếm, dropdown gợi ý tự động chỉ hiển thị sau khi người dùng nhập tối thiểu 2 ký tự (debounce 300ms) để tối ưu hiệu năng API.
- **BR-03**: Khi người dùng nhấn nút xóa một thẻ bộ lọc hoặc nhấn nút "Đặt lại", URL query string phải được đồng bộ ngay lập tức và trang kết quả sẽ tự động refresh.

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Khách vãng lai (Guest) | Thực hiện tìm kiếm, xem kết quả, lọc, gợi ý, xem từ khóa hot. | Lưu yêu thích ( Favorites ) hoặc xem lịch sử tìm kiếm cá nhân từ DB (nếu có API). | Màn hình hoàn toàn public. |
| Người dùng đăng nhập | Đầy đủ quyền như Guest + thêm vào yêu thích từ card kết quả tìm kiếm + hiển thị lịch sử tìm kiếm riêng. | N/A | |

## 10) Edge Cases
- **EC-01: Không có mạng hoặc API gặp lỗi**: Hiển thị trạng thái lỗi trực quan ngay trên trang thay vì bị crash ứng dụng.
- **EC-02: Nhập các ký tự đặc biệt**: Bộ lọc và backend phải xử lý an toàn từ khóa tìm kiếm (escape SQL injection và XSS).
- **EC-03: Tab "Tất cả" khi kết quả của một bên rỗng**: Merge kết quả hiển thị của loại còn lại bình thường thay vì báo lỗi.

## 11) Assumptions & Open Questions
### Assumptions
- **A-01**: Quyết định không phát triển API lưu lịch sử tìm kiếm trên DB backend do thiết kế ban đầu chưa tích hợp sâu, thay vào đó sử dụng bộ nhớ cục bộ `localStorage` của trình duyệt theo từng tài khoản người dùng để tối ưu hóa thời gian tải và giảm tải hệ thống.

### Open Questions
- **Q-01**: API gợi ý tìm kiếm hiện tại (`/search/suggestions`) chỉ trả về danh sách các chuỗi văn bản đơn giản. Thiết kế trong `user_search.md` hiển thị đầy đủ tên, địa chỉ hoặc giá của địa điểm/tour. Vì vậy chúng tôi sẽ hiển thị dưới dạng danh sách gợi ý phẳng được thiết kế tinh tế dạng Glassmorphic phù hợp với dữ liệu thực tế từ backend.

## 12) Implementation Checklist
- [x] Step 01: Screen Analysis
- [ ] Step 02: Project Setup
- [ ] Step 03: Types & API contract
- [ ] Step 04: Route & layout
- [ ] Step 05: UI components
- [ ] Step 06: Data integration
- [ ] Step 07: Interactions
- [ ] Step 08: Auth/permissions
- [ ] Step 09: Testing

## 13) Files / Areas Likely To Change
- `src/features/search/hooks/use-search-discovery.ts`
- `src/features/search/components/SearchResultHeader.tsx`
- `src/features/search/components/SearchFiltersSheet.tsx`
- `src/features/search/types/search.types.ts`
