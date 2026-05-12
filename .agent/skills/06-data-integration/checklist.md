# Checklist: 06-data-integration

## Query Setup
- [ ] Query keys hierarchical: `['feature', 'list', params]` hoặc `['feature', 'detail', id]`
- [ ] `staleTime` set hợp lý (5-30 phút cho non-volatile data)
- [ ] `enabled` condition đúng cho dependent queries
- [ ] Parallel queries cho independent data (không chain enabled vô lý)

## Server / Client Boundary (Next.js App Router)
- [ ] Server Component prefetch data khi cần SEO hoặc LCP tốt
- [ ] Client Component dùng TanStack Query cho interactive data
- [ ] `HydrationBoundary` wrap đúng khi dùng server prefetch
- [ ] Không dùng `useQuery` trong Server Component

## Mutation
- [ ] Mutation `onSuccess` → `invalidateQueries` đúng query key
- [ ] Mutation `onSuccess` → toast success (qua i18n)
- [ ] Mutation `onError` → toast error (normalized, không raw error)
- [ ] Không invalidate toàn bộ queries (`invalidateQueries()` không có key)

## UI State Handling
- [ ] Loading state: Skeleton component (không full-page spinner cho list/table)
- [ ] Empty state: EmptyState component với message và CTA nếu có
- [ ] Error state: inline error với retry button hoặc toast
- [ ] Không có section nào render blank khi loading/empty/error

## Code Quality
- [ ] Không gọi API trực tiếp trong component — phải qua hook
- [ ] Không hardcode mock data trong production flow
- [ ] Không dùng `useEffect` để fetch data khi TanStack Query đã có
- [ ] `npm run typecheck` pass
- [ ] `npm run lint` pass

## Output
- [ ] Data integration doc tạo đúng path: `.agent/artifacts/integration/YYYY-MM-DD__<slug>__data-integration.md`
- [ ] Doc có data sources, query plan, mutation plan, UI state handling
