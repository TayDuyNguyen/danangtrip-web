# Deploy Report: User Search Hardening — Session 2026-05-29

> Feature slug: `user-search-hardening`
> Date: 2026-05-29
> Status: `READY`
> Target Platform: Cloudflare Pages (OpenNext)
> Preceding session: `2026-05-28__user-search-hardening__deploy-report.md`

---

## 1. Session Scope (Delta from 2026-05-28)

Phiên làm việc ngày **2026-05-29** bổ sung các tính năng tracking tương tác và cải thiện UX cho trang tìm kiếm dựa trên feedback phiên trước. Các thay đổi nằm hoàn toàn trong phạm vi `user-search-hardening` đã lock.

### Files Modified

| File | Loại thay đổi |
|---|---|
| `src/features/search/components/SearchResultsClient.tsx` | Bổ sung interaction tracking, useSearchDiscovery, empty-state trending pills |
| `src/features/search/components/SearchResultHeader.tsx` | Tăng độ tương phản border/text/tab cho UI visibility |
| `src/features/search/components/SearchTabs.tsx` | Tab active glow effect, inactive tabs nổi bật hơn |

---

## 2. Quality Gates

| Check | Command | Result | Notes |
|---|---|---|---|
| **TypeScript** | `npx tsc --noEmit` | ✅ PASS | 0 errors |
| **ESLint** | `npx eslint SearchResultsClient.tsx --max-warnings=0` | ✅ PASS | 0 errors, 0 warnings |

---

## 3. Feature Delta — Technical Inventory

### 3.1 Interaction Tracking (`handleResultClick`)

```tsx
const handleResultClick = (item: SearchResult) => {
  void searchService.trackInteraction({
    event: "result_click",
    query: q.trim(),
    type, clicked_title, clicked_slug, clicked_type,
    source: "search_results_grid",
    session_id: getOrCreateSessionId(),
    page,
  });
};
```

- **Mục đích:** Ghi lại hành vi click kết quả tìm kiếm để phân tích conversion từng loại (tour vs location) và độ hữu ích của query.
- **Dependency:** `searchService.trackInteraction` (đã tồn tại trong `search.service.ts`), `getOrCreateSessionId` từ `@/utils/session` (đã tồn tại).
- **Fire-and-forget:** `void` — không block UI, không toast lỗi nếu API offline.

### 3.2 Discovery Keyword Integration (`useSearchDiscovery`)

```tsx
const { insights, trending, popular } = useSearchDiscovery();
const trendKeywords = insights.length > 0 ? insights : trending.length > 0 ? trending : popular;
```

- Hook `useSearchDiscovery` đã được refactor (phiên trước) để trả về `insights`, `trending`, `popular` từ endpoint `getTrendInsights`.
- Priority: `insights` > `trending` > `popular` — ưu tiên data realtime nhất.

### 3.3 Empty-State Trending Pills

Khi tìm kiếm không có kết quả, hiển thị tối đa **5 trending keyword pills** cho phép user nhảy thẳng vào query có kết quả. Mỗi click tracking thêm event `trending_click` tới backend.

### 3.4 UI Visibility Improvements

- **SearchTabs:** Tab active có `shadow-[0_0_12px_rgba(139,106,85,0.35)]` glow, font `semibold`, text `#f0d4be`; tab inactive `border-[#6b5a50]/80` thay vì `#404040/60`.
- **SearchResultHeader:** Border container gradient nâu amber `rgba(139,106,85,0.5)`, filter button có `border border-[#8b6a55]/60` nổi bật; trending pills inactive `text-[#c0a898]` thay vì `#737373`.
- **Tab counts:** Luôn hiển thị counts khi `counts.all > 0 || counts.tour > 0 || counts.location > 0`, không còn phụ thuộc `isSearchMode`.

---

## 4. Auth / Public Route Verification

Xác nhận tại phiên 2026-05-29:

- **Middleware (`middleware.ts`):** `/search` không nằm trong `protectedRoutes` → không redirect login.
- **Axios interceptor:** `handleLogout()` chỉ trigger khi `getAccessToken()` tồn tại → user khách không bị ảnh hưởng.
- **`trackInteraction`:** Fire-and-forget, không throw UI error nếu unauthenticated.
- **`useSearchDiscovery`:** Public API endpoint, không yêu cầu auth token.

---

## 5. Smoke Test Results

| Scenario | Status |
|---|---|
| `/search?q=&type=all` — Discovery mode load | ✅ OK |
| Tab counts hiển thị khi có dữ liệu (không cần nhập query) | ✅ Fixed |
| Tab active glow + inactive borders nổi bật | ✅ OK |
| Click kết quả → tracking event fired (fire-and-forget) | ✅ OK |
| Tìm kiếm không có kết quả → trending pills xuất hiện | ✅ OK |
| Trending pill click → tracking + updateUrl hoạt động | ✅ OK |
| User chưa đăng nhập vào `/search` → không redirect login | ✅ Confirmed |
| API lỗi 500 → toast lỗi, không redirect | ✅ Confirmed |

---

## 6. Deploy Readiness Verdict

- **Verdict:** ✅ **READY**
- **Breaking changes:** Không có.
- **Regressions:** Không phát hiện.
- **Rủi ro:** Rất thấp — `trackInteraction` là fire-and-forget, nếu endpoint chưa có trên API thì chỉ log lỗi console, không ảnh hưởng UI.
- **Action:** Sẵn sàng push branch và merge.
