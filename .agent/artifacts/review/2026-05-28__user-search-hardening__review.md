# Review Report: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Status: `READY FOR PUSH`

---

## 1. Objective

Củng cố (hardening) trang tìm kiếm `/search` nhằm cải thiện trải nghiệm người dùng, khắc phục các lỗi mapping dữ liệu khám phá (popular & trending), sửa đổi logic trộn và sắp xếp ở tab "Tất cả" (type=all) để đảm bảo cân bằng hiển thị giữa Tour và Địa điểm, đồng thời bổ sung tính năng gợi ý tự động (autocomplete suggestions) cùng lịch sử tìm kiếm cục bộ (local storage search history).

---

## 2. Delivered Scope

Chúng ta đã chỉnh sửa và tạo mới các file nguồn sau để thực hiện mục tiêu:

### Mới (New)
1. **Component gợi ý**: [SearchSuggestionsDropdown.tsx](file:///d:/DATN/danangtrip-web/src/features/search/components/SearchSuggestionsDropdown.tsx) - Giao diện Glassmorphism hiển thị các gợi ý tìm kiếm khớp với từ khóa người dùng gõ.
2. **Hook Suggestions**: [use-search-suggestions.ts](file:///d:/DATN/danangtrip-web/src/features/search/hooks/use-search-suggestions.ts) - Quản lý việc truy vấn gợi ý từ backend với cơ chế debounce 300ms.
3. **Hook History**: [use-search-history.ts](file:///d:/DATN/danangtrip-web/src/features/search/hooks/use-search-history.ts) - Quản lý lịch sử tìm kiếm cục bộ (tối đa 5 từ khóa gần nhất).

### Sửa đổi (Modified)
1. **Hook Discovery Grid**: [use-search-discovery-grid.ts](file:///d:/DATN/danangtrip-web/src/features/search/hooks/use-search-discovery-grid.ts) - Cải tiến thuật toán sắp xếp ở Discovery Section để lấy xen kẽ (interleave) Tour và Địa điểm nổi bật, thay vì so sánh trực tiếp viewCount và bookingCount khiến Tour bị slice mất.
2. **Hook Search chính**: [use-search.ts](file:///d:/DATN/danangtrip-web/src/features/search/hooks/use-search.ts) - Cải tiến logic trộn kết quả tìm kiếm khi ở chế độ "Tất cả" (type=all) thành trộn xen kẽ, giải quyết triệt để lỗi chỉ hiển thị địa điểm do sự chênh lệch đơn vị đếm view/booking.
3. **Header tìm kiếm**: [SearchResultHeader.tsx](file:///d:/DATN/danangtrip-web/src/features/search/components/SearchResultHeader.tsx) - Tích hợp dropdown gợi ý tự động và giao diện lịch sử tìm kiếm khi focus vào input.
4. **Bộ lọc danh mục**: [SearchFiltersSheet.tsx](file:///d:/DATN/danangtrip-web/src/features/search/components/SearchFiltersSheet.tsx) - Ẩn phần lọc danh mục khi tab active là "Tất cả" (tránh xung đột tour/location category ID).
5. **Sửa lỗi mapping**: [use-search-discovery.ts](file:///d:/DATN/danangtrip-web/src/features/search/hooks/use-search-discovery.ts) - Sửa lỗi trích xuất dữ liệu popular/trending từ backend (trước đó sử dụng `extractItems` bị trả về mảng rỗng do backend trả về dạng `{ popular: [...] }`).
6. **Service & Types**: 
   - [search.service.ts](file:///d:/DATN/danangtrip-web/src/services/search.service.ts)
   - [search.types.ts](file:///d:/DATN/danangtrip-web/src/types/search.types.ts)
   - Bổ dung và đồng bộ các kiểu dữ liệu suggestions và query.
7. **Localization**: Bổ sung các key dịch thuật tương ứng trong:
   - [vi/search.json](file:///d:/DATN/danangtrip-web/src/messages/vi/search.json)
   - [en/search.json](file:///d:/DATN/danangtrip-web/src/messages/en/search.json)

---

## 3. Artifact Trace (10-Step Pipeline)

Toàn bộ quá trình phát triển tuân thủ quy trình 10 bước của dự án và các artifacts sau đã được ghi nhận:

- [x] **Step 01 - Screen Analysis:** [analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-28__user-search-hardening__screen-analysis.md)
- [x] **Step 02 - Project Setup:** [setup-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/setup/2026-05-28__user-search-hardening__project-setup-report.md)
- [x] **Step 03 - API Contract:** [api-contract.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/api-contracts/2026-05-28__user-search-hardening__api-contract.md)
- [x] **Step 04 - Layout & Routing:** [route-plan.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/routing/2026-05-28__user-search-hardening__route-plan.md)
- [x] **Step 05 - UI Specs:** [ui-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/ui-specs/2026-05-28__user-search-hardening__ui-spec.md)
- [x] **Step 06 - Data Integration:** [data-integration.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/integration/2026-05-28__user-search-hardening__data-integration.md)
- [x] **Step 07 - Interaction Specs:** [interaction-spec.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/interaction-specs/2026-05-28__user-search-hardening__interaction-spec.md)
- [x] **Step 08 - Auth & Permissions:** [auth-permissions-review.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/auth/2026-05-28__user-search-hardening__auth-permissions-review.md)
- [x] **Step 09 - Testing:** [test-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/test-cases/2026-05-28__user-search-hardening__test-report.md)
- [x] **Step 10 - Optimization & Deploy:** [deploy-report.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/deploy/2026-05-28__user-search-hardening__deploy-report.md)

---

## 4. Technical Decisions & Tradeoffs

1. **Interleaving Results for "All" Mode**: Quyết định trộn xen kẽ kết quả (1 tour, 1 location, 1 tour, 1 location...) thay vì sắp xếp gộp dựa trên viewCount (Địa điểm) và bookingCount (Tour). Do viewCount của địa điểm local (100 - 300) lớn hơn rất nhiều so với bookingCount của tour (0 - 5), việc so sánh trực tiếp viewCount và bookingCount khiến tour luôn bị xếp sau địa điểm và bị cắt bỏ (slice) ở trang đầu tiên. Giải pháp trộn xen kẽ giúp hiển thị cân bằng và đẹp mắt cho cả 2 loại dịch vụ.
2. **Local Search History**: Vì API lưu trữ search history trên backend chưa hoàn thiện, chúng tôi đã sử dụng `localStorage` để lưu trữ lịch sử ở phía client. Cơ chế này nhẹ, tải tức thời và không làm tăng tải cho server database.
3. **Debounce Auto-complete**: Đặt debounce ở mức **300ms** để tối ưu hóa hiệu năng, giảm số lượng query không cần thiết khi người dùng đang gõ nhanh.
4. **Category Filter Sync**: Quyết định ẩn Category Filter ở tab "Tất cả" là giải pháp tối ưu nhất để tránh lỗi mismatch ID danh mục giữa tour và địa điểm du lịch, vốn là hai bảng dữ liệu khác nhau ở phía API backend.

---

## 5. Risks & Follow-ups

- **Rủi ro:** Không phát hiện rủi ro nghiêm trọng nào. Giao diện và các API queries đều hoạt động an toàn và tương thích với Cloudflare Edge runtime.
- **Kế hoạch tiếp theo:** Sau khi USER duyệt code, thực hiện push code lên branch và tiến hành deploy/merge thử nghiệm.
