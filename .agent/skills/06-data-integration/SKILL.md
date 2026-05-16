---
name: 06-data-integration
description: Plan how real data flows through services, hooks, and UI. Use when wiring API responses into pages or feature components.
---

# Skill: 06-data-integration

## Overview

## When to Use

- When wiring real API data into UI.
- When query ownership, mutation flow, or invalidate behavior needs to be planned explicitly.
- When a feature is at risk of data-flow drift between service, hook, and UI layers.

Skill này mô tả cách nối data thật vào UI theo flow:

```
service → TanStack Query hook → UI component
```

Với page server-first (Next.js App Router), tài liệu cũng phải ghi rõ phần nào fetch ở server, phần nào hydrate xuống client.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- `src/lib/react-query.ts`
- `src/providers/providers.tsx`
- `src/services/<feature>.service.ts`
- `src/features/<feature>/hooks/`
- Existing feature hook patterns

## Recommended Questions To Answer

1. Data source nào thuộc server-first (RSC)?
2. Data source nào nên fetch ở client qua TanStack Query?
3. Query key nào dùng chung giữa các feature?
4. Mutation nào phải invalidate gì?
5. UI state nào dễ bị bỏ quên?

## Process

### 1) Data Source Breakdown

Liệt kê rõ:

- source (endpoint/service)
- purpose
- ownership: server component hay client query

### 2) Query Strategy

Ghi:

- query key (hierarchical)
- trigger condition
- staleTime
- dependency (enabled condition)

### 3) Mutation Strategy

Phải mô tả:

- mutation nào tồn tại
- success handling (invalidate + toast)
- error handling
- invalidation target

### 4) UI State Handling

Không chỉ ghi chung chung.
Phải nói:

- section nào loading ra sao (skeleton hay spinner)
- empty hiển thị/hide như thế nào
- error đi qua toast hay inline state

### 5) Handoff To Implementation

Data integration plan phải để người code biết:

- hook files nào cần có
- services nào liên quan
- skeleton files nào nên có

## Pattern Chuẩn Của Repo

### Query key convention — hierarchical

```ts
// src/features/tours/hooks/useTourQueries.ts
const tourKeys = {
  all: ['tours'] as const,
  lists: () => [...tourKeys.all, 'list'] as const,
  list: (params: TourListParams) => [...tourKeys.lists(), params] as const,
  details: () => [...tourKeys.all, 'detail'] as const,
  detail: (slug: string) => [...tourKeys.details(), slug] as const,
};
```

### useQuery pattern — client-side

```ts
export const useTourList = (params: TourListParams) => {
  return useQuery({
    queryKey: tourKeys.list(params),
    queryFn: () => tourService.getList(params).then(res => res.data.data),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTourDetail = (slug: string) => {
  return useQuery({
    queryKey: tourKeys.detail(slug),
    queryFn: () => tourService.getDetail(slug).then(res => res.data.data),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};
```

### Server component prefetch pattern — Next.js App Router

```tsx
// src/app/[locale]/tours/page.tsx (Server Component)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { tourService } from '@/services/tour.service';

export default async function ToursPage() {
  const queryClient = new QueryClient();

  // Prefetch ở server — client sẽ không refetch ngay
  await queryClient.prefetchQuery({
    queryKey: tourKeys.list({ page: 1 }),
    queryFn: () => tourService.getList({ page: 1 }).then(res => res.data.data),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TourListClient /> {/* Client component dùng useTourList */}
    </HydrationBoundary>
  );
}
```

### useMutation pattern — với invalidation

```ts
export const useSubmitContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ContactFormValues) => contactService.submit(data),
    onSuccess: () => {
      // Invalidate nếu có list cần refresh
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast.success('Gửi thành công');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

### UI state handling — cụ thể per section

```tsx
// Client component
'use client';

function TourListClient() {
  const [params, setParams] = useState<TourListParams>({ page: 1 });
  const { data, isLoading, isError, refetch } = useTourList(params);

  // Loading: skeleton, không phải spinner
  if (isLoading) return <TourCardSkeleton count={6} />;

  // Error: inline với retry
  if (isError) return <ErrorState onRetry={refetch} />;

  // Empty: empty state với message
  if (!data?.items.length) return <EmptyState message="Chưa có tour nào" />;

  return (
    <>
      <TourGrid tours={data.items} />
      <Pagination total={data.total} page={params.page} onChange={...} />
    </>
  );
}
```

### Server vs Client ownership decision

```
Dùng Server Component (RSC) khi:
- Data không thay đổi theo user interaction
- SEO quan trọng (tour detail, landing page)
- Data cần prefetch cho LCP

Dùng Client Query khi:
- Data thay đổi theo filter/search/pagination
- Cần optimistic update
- Data phụ thuộc vào user action
```

## Output Document

Tạo file:

- `.agent/artifacts/integration/YYYY-MM-DD__<feature-slug>__data-integration.md`

Template:

- `template_data_integration.md`

## Strict Rules

- Không gọi API trực tiếp trong UI component nếu đã có service layer
- Không hardcode fake data trong production flow
- Query keys phải hierarchical
- Error handling phải normalize trước khi hiển thị — không show raw axios error
- Server component không được import client-only hooks
- `"use client"` chỉ đặt ở component thật sự cần interactivity

## Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| "Page đơn giản, fetch trong useEffect cho nhanh" | Không có caching, không có loading state chuẩn, không dedup request |
| "Server component fetch rồi, không cần TanStack Query" | Đúng cho static data — nhưng filter/pagination cần client query |
| "Invalidate all queries cho chắc" | Refetch toàn bộ app — tốn bandwidth và gây flicker |
| "Loading state chỉ cần spinner là đủ" | Skeleton giữ layout ổn định, tránh CLS |


## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Query key là string đơn giản `'tours'` → invalidation không chính xác
- Mutation không invalidate sau success → UI hiển thị data cũ
- Server component dùng `useQuery` → runtime error
- Client component fetch data trong `useEffect` thay vì TanStack Query → không có caching
- `isLoading` nhưng không có skeleton → layout shift
- Error chỉ `console.error` → user không biết có lỗi

## Documentation Expectations

Data integration doc tốt phải có:

- data sources (endpoint, purpose, server/client ownership)
- query plan (key, trigger, staleTime, enabled)
- mutation plan (action, invalidate, feedback)
- UI state handling (loading/empty/error per section)
- files expected to change

## Verification

- Đối chiếu `checklist.md`
- Tài liệu phải chỉ ra đủ hooks, services, UI states, query ownership
- Mọi mutation phải có invalidation strategy
- Server/client boundary phải được ghi rõ cho từng data source
