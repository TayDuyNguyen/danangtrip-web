# Data Integration Plan: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Service scope: `src/services/search.service.ts`

---

## 1) Data Sources
| Purpose | Source | Server or Client | Notes |
|---|---|---|---|
| Lấy danh sách kết quả tìm kiếm | `GET /v1/search` | Client | Tải kết quả dựa trên query string và các bộ lọc dynamic. |
| Gợi ý từ khóa tự động (autocomplete) | `GET /v1/search/suggestions` | Client | Kích hoạt khi người dùng gõ vào ô tìm kiếm. |
| Lấy từ khóa phổ biến | `GET /v1/search/popular` | Client | Kích hoạt khi trang vừa tải và ô tìm kiếm trống. |
| Lấy từ khóa xu hướng | `GET /v1/search/trending` | Client | Kích hoạt khi trang vừa tải và ô tìm kiếm trống. |
| Lấy địa điểm & tour nổi bật | `GET /v1/locations/featured` & `GET /v1/tours/featured` | Client | Dùng để lấp đầy grid khi chưa thực hiện tìm kiếm. |

## 1.1) Data Ownership Notes
- **Query nào là source of truth**: `useQuery(["search", params])` (Tải dữ liệu danh sách tour và địa điểm thực tế).
- **Query nào là supporting lookup**:
  - `useQuery(["search", "suggestions"])` (Autocomplete).
  - `useQuery(["search", "popular"])` (Phổ biến).
  - `useQuery(["search", "trending"])` (Xu hướng).

## 2) Query / Hook Plan
| Query Key | Hook File | Trigger | staleTime | Notes |
|---|---|---|---|---|
| `["search", params]` | `src/features/search/hooks/use-search.ts` | Khi `q` không rỗng và tham số thay đổi | `5 * 60 * 1000` | Tải dữ liệu tìm kiếm thực tế |
| `["search", "suggestions", query]` | `src/features/search/hooks/use-search-suggestions.ts` (mới) | Khi người dùng nhập `query.length >= 2` | `2 * 60 * 1000` | Autocomplete gợi ý |
| `["search", "popular"]` | `src/features/search/hooks/use-search-discovery.ts` | Khi trang vừa tải | `30 * 60 * 1000` | Khắc phục lỗi map dữ liệu |
| `["search", "trending"]` | `src/features/search/hooks/use-search-discovery.ts` | Khi trang vừa tải | `15 * 60 * 1000` | Khắc phục lỗi map dữ liệu |

## 2.1) Parallel / Dependent Query Notes
- **useSearch**: Khi tab được đặt là `"all"`, hook này thực hiện gọi song song cả 2 API: `searchService.search` với loại `"tour"` và `searchService.search` với loại `"location"` qua `Promise.all`.
- **Suggestions Query**: Được kích hoạt chỉ khi từ khóa nhập vào tối thiểu 2 ký tự và không rỗng.

## 3) Mutation Plan
*Không có dữ liệu thay đổi (Mutation) trực tiếp trên trang tìm kiếm công khai.*

## 4) UI State Handling
| UI Section | Loading | Empty | Error | Success |
|---|---|---|---|---|
| Khung gợi ý Autocomplete | Spinner mờ bên góc phải input | Hiện thông báo: "Không tìm thấy kết quả phù hợp" | Ẩn dropdown | Hiển thị 5 gợi ý phù hợp nhất |
| Grid kết quả chính | `SearchGridSkeleton` (pulse layout) | Hiển thị vector 🔍 kèm nút bấm "Đặt lại bộ lọc" | Hiển thị bảng thông báo lỗi và nút "Thử lại" | Hiển thị danh sách card kết quả |

## 4.1) Error Strategy
| Error Type | UI Handling | Toast | Retry |
|---|---|---|---|
| API tìm kiếm lỗi | Hiển thị thông báo lỗi ngay tại Grid thay thế cho danh sách card | Có | Nhấn nút "Thử lại" |
| API suggestions lỗi | Ẩn dropdown gợi ý âm thầm, không ảnh hưởng input chính | Không | Tự động khi người dùng gõ lại ký tự |

## 5) Files Expected To Change
- `src/features/search/hooks/use-search-discovery.ts`
- `src/features/search/hooks/use-search-suggestions.ts` [NEW]
- `src/features/search/components/SearchResultHeader.tsx`

## 6) Risks / Open Questions
- **R-01**: Cần đảm bảo hàm debounce của suggestions hoạt động chính xác ở mức 300ms nhằm tránh việc gọi API liên tục mỗi khi nhấn phím (key stroke).
