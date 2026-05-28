# Route Plan: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Route scope: `/search`

---

## 1) Summary
- Feature này thực hiện củng cố (hardening) trang tìm kiếm `/search` hiện có.
- Route nằm trong nhóm public `(public)` tại địa chỉ `src/app/[locale]/(main)/(public)/search/page.tsx`.

## 1.1) Route Decision
- **Route type**: `extend` (Mở rộng và cải tiến trang tìm kiếm hiện tại).
- **Server-first or client-heavy**: Hỗn hợp.
  - Trang chính `page.tsx` là **Server-first** để tải trước metadata thông dịch i18n và trích xuất tham số query ban đầu từ URL.
  - Component chính `SearchResultsClient.tsx` là **Client-heavy** vì nó điều khiển bộ lọc Drawer, tab chọn, và thanh input tìm kiếm tương tác.
- **Why**: Cần render metadata động từ phía Server, đồng thời xử lý các phản hồi tương tác mượt mà của Client như debounced input và mở panel bộ lọc.

## 2) Route Files
| Route Path | File | Layout | Server / Client Notes | Metadata |
|---|---|---|---|---|
| `/search` | `src/app/[locale]/(main)/(public)/search/page.tsx` | Kế thừa layout chung `(main)` | Server Component, truyền `initialQuery` xuống Client | Sử dụng `generateMetadata` động qua `getTranslations` của `next-intl` |

## 3) Route Config Impact
| File | Change Needed | Notes |
|---|---|---|
| `src/config/routes.ts` | Không thay đổi | Route `/search` đã được định nghĩa sẵn qua `ROUTES.SEARCH` |

## 3.1) Server / Client Boundary Notes
| Area | Server or Client | Reason |
|---|---|---|
| `page.tsx` | Server | Lấy các tham số `params` và `searchParams` không đồng bộ, tạo thẻ tiêu đề trang chuẩn SEO. |
| `SearchResultsClient.tsx` | Client | Quản lý state của bộ lọc (Zustand/URL), tab đang hiển thị và xử lý phân trang. |
| `SearchResultHeader.tsx` | Client | Quản lý input và debounce sự kiện nhập để hiển thị gợi ý autocomplete dropdown. |
| `SearchFiltersSheet.tsx` | Client | Drawer bộ lọc nâng cao tương tác với nhiều nút bấm và trường nhập khoảng giá. |

## 4) Locale / Navigation Impact
| Item | Locale Keys | Notes |
|---|---|---|
| Breadcrumb | `breadcrumb.search` | Đã được định nghĩa trong `common.json`. |
| Menu / CTA | `search.suggestions.*` | Đã bổ sung đầy đủ các key dịch cho gợi ý, loading, lỗi gợi ý trong `search.json`. |

## 5) Files Expected To Change
- `src/features/search/components/SearchResultHeader.tsx`
- `src/features/search/components/SearchFiltersSheet.tsx`
- `src/features/search/hooks/use-search-discovery.ts`
- `src/features/search/types/search.types.ts`

## 6) Risks / Open Questions
- **R-01**: Cần đảm bảo việc đồng bộ URL query-string (`router.replace`) không tạo ra hiện tượng nhấp nháy hoặc tự động cuộn trang (sử dụng `{ scroll: false }`).
