# Review Report: User Search Hardening — Session 2026-05-29

> Feature slug: `user-search-hardening`
> Date: 2026-05-29
> Status: `READY FOR PUSH`
> Preceding review: `2026-05-28__user-search-hardening__review.md`

---

## 1. Objective (Session Delta)

Bổ sung tính năng **interaction tracking** (click result, click trending), tích hợp **useSearchDiscovery** để hiển thị trending keywords ở empty-state, sửa bug **tab counts không hiển thị** khi discovery mode, và nâng cao **UI visibility** (tab glow, trending pills sáng hơn, border filter rõ hơn).

---

## 2. Delivered Scope (2026-05-29)

### Mới bổ sung

| # | Tính năng | File |
|---|---|---|
| 1 | `handleResultClick` — tracking sự kiện click kết quả | `SearchResultsClient.tsx` |
| 2 | Empty-state trending pills (5 pills, click → search + track) | `SearchResultsClient.tsx` |
| 3 | `useSearchDiscovery` integration + `trendKeywords` fallback chain | `SearchResultsClient.tsx` |
| 4 | Tab counts luôn hiển thị khi có data, bất kể `isSearchMode` | `SearchResultsClient.tsx` |

### UI visibility cải thiện

| Component | Thay đổi |
|---|---|
| `SearchTabs` | Active tab glow `shadow`, inactive `border-[#6b5a50]/80`, font `semibold` |
| `SearchResultHeader` | Container gradient border amber nổi hơn, filter button có border rõ |
| `SearchResultHeader` | Trending pills inactive `text-[#c0a898]` thay `#737373`, label `#a89080` + bold |

---

## 3. Artifact Trace — Step 10 Pipeline (Session 2)

| Step | Artifact | Status |
|---|---|---|
| TypeScript check | `npx tsc --noEmit` | ✅ PASS — 0 errors |
| ESLint check | `npx eslint SearchResultsClient.tsx` | ✅ PASS — 0 errors, 0 warnings |
| Auth/public route | Middleware + axios interceptor review | ✅ PASS — public route confirmed |
| Deploy report | `.agent/artifacts/deploy/2026-05-29__user-search-hardening__deploy-report.md` | ✅ Written |

---

## 4. Bug Fixes Confirmed

| Bug | Root Cause | Fix |
|---|---|---|
| Tab counts không hiện ở `/search?q=&type=all` | `counts={isSearchMode ? counts : undefined}` → khi `isSearchMode=false` thì truyền `undefined` | Đổi sang `counts={counts.all > 0 \|\| ... ? counts : undefined}` |
| Trending/popular text quá mờ | Color `#737373/60`, border `#404040/60` | Nâng lên `#c0a898`, `#6b5a50/80` |
| Tab inactive không rõ | Không có nền, border nhạt | Thêm `bg-[#1a1510]/60`, border `#6b5a50/80` |

---

## 5. Technical Decisions

1. **`insights > trending > popular` fallback chain:** Ưu tiên data realtime nhất (`insights` từ `getTrendInsights`) trước khi fallback sang `trending` (24h) và `popular` (30 ngày). Tránh hiển thị data cũ khi data mới có sẵn.

2. **Fire-and-forget tracking:** Dùng `void searchService.trackInteraction(...)` không await, không try/catch ở UI — nếu API tracking lỗi, UX không bị ảnh hưởng. Pattern này nhất quán với các tracking calls khác trong `SearchResultHeader`.

3. **`getOrCreateSessionId`:** Session ID được tạo lazy và lưu trong `sessionStorage` (đã tồn tại ở `@/utils/session`), đảm bảo correlation tracking trong 1 phiên mà không cần user đăng nhập.

4. **Counts condition:** Dùng `counts.all > 0 || counts.tour > 0 || counts.location > 0` thay vì `isSearchMode` để tránh giấu counts trong discovery mode khi có dữ liệu thực.

---

## 6. Full Pipeline Summary (Session 1 + Session 2)

| Step | Session | Artifact |
|---|---|---|
| 01 Screen Analysis | 2026-05-28 | `analysis/2026-05-28__user-search-hardening__screen-analysis.md` |
| 02 Project Setup | 2026-05-28 | `setup/2026-05-28__user-search-hardening__project-setup-report.md` |
| 03 API Contract | 2026-05-28 | `api-contracts/2026-05-28__user-search-hardening__api-contract.md` |
| 04 Layout & Routing | 2026-05-28 | `routing/2026-05-28__user-search-hardening__route-plan.md` |
| 05 UI Components | 2026-05-28 | `ui-specs/2026-05-28__user-search-hardening__ui-spec.md` |
| 06 Data Integration | 2026-05-28 | `integration/2026-05-28__user-search-hardening__data-integration.md` |
| 07 Interactions | 2026-05-28 | `interaction-specs/2026-05-28__user-search-hardening__interaction-spec.md` |
| 08 Auth & Permissions | 2026-05-28 + 2026-05-29 | `auth/2026-05-28__user-search-hardening__auth-permissions-review.md` |
| 09 Testing | 2026-05-28 | `test-cases/2026-05-28__user-search-hardening__test-report.md` |
| 10 Deploy (S1) | 2026-05-28 | `deploy/2026-05-28__user-search-hardening__deploy-report.md` |
| 10 Deploy (S2) | 2026-05-29 | `deploy/2026-05-29__user-search-hardening__deploy-report.md` ← THIS |

---

## 7. Risks & Follow-ups

- **Rủi ro:** Không phát hiện rủi ro nghiêm trọng.
- **`searchService.trackInteraction`:** Cần xác nhận endpoint `/search/interact` (hoặc tương đương) đã được implement phía API (`danangtrip-api`). Nếu chưa, chỉ log 404 console, không ảnh hưởng UX.
- **Kế hoạch tiếp theo:** Feature `user-search-hardening` đã **COMPLETE**. Progress report cần update: đánh dấu `user-search-hardening` = Done, đề xuất screen tiếp theo.
