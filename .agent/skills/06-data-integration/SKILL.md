# Skill: 06-data-integration (Tích hợp Data — Gắn API vào UI)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm wire data thật vào UI components, tạo custom hooks, và xử lý đầy đủ loading/error/empty states.

## 1) Goal
Gắn API vào UI để:
- UI hiển thị **data thật** từ backend
- Đầy đủ **states**: loading (skeleton), error (boundary + toast), empty
- Data flow đúng: **service → hook (TanStack Query) → UI**

## 2) Persona (mandatory)
Đóng vai: **Senior Software Engineer (SSE)**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (Sections 5, 7, 12, 13, 21)
- API service file: `src/services/<feature>.service.ts`
- UI components: `src/features/<feature>/components/`
- Existing hooks: `src/hooks/`, `src/features/*/hooks/`
- TanStack Query patterns: check existing hooks cho conventions

## 4) Workflow

### 4.1 Tạo Custom Hooks (Client-side fetching)
1. Hook file: `src/features/<feature>/hooks/use-<resource>.ts`
2. Pattern cho **READ** (useQuery):
   ```ts
   export function useFeatureList(params: ListParams) {
     return useQuery({
       queryKey: ['feature', 'list', params],
       queryFn: () => featureService.getList(params),
       staleTime: 5 * 60 * 1000, // 5 min
     });
   }
   ```
3. Pattern cho **MUTATION** (useMutation):
   ```ts
   export function useCreateFeature() {
     const queryClient = useQueryClient();
     return useMutation({
       mutationFn: featureService.create,
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['feature'] });
         toast.success(t('create_success'));
       },
       onError: (error) => {
         toast.error(normalizeError(error));
       },
     });
   }
   ```
4. Query key strategy: **hierarchical** `["feature", "resource", "type/id"]`
5. `staleTime`: 5-30 min cho non-volatile data.

### 4.2 Server Component Data (nếu applicable)
6. Nếu page là Server Component: gọi API trực tiếp (async):
   ```tsx
   export default async function Page() {
     const data = await featureService.getList({ ... });
     return <FeatureList data={data} />;
   }
   ```
7. Pass data xuống Client Component qua props.

### 4.3 Loading States
8. **Skeleton screens** (ưu tiên — theo PROJECT_RULES):
   - Tạo `<FeatureSkeleton />` matching layout của component thật
   - Dùng trong `isLoading` / Suspense boundary
9. Không dùng full-page spinner — CLS-friendly.

### 4.4 Error States
10. **Error boundary**: catch unhandled errors ở route level.
11. **API errors**: normalize trước khi hiển thị.
12. **Toast notification**: dùng `sonner` cho error feedback.
13. **Retry**: TanStack Query auto-retry 3 lần (default), custom nếu cần.

### 4.5 Empty States
14. Khi API trả empty array:
    - **User-critical flows**: hiển thị empty state component (icon + message + CTA).
    - **Decorative sections**: hide section hoàn toàn (theo PROJECT_RULES).
15. Message dùng i18n keys, không hardcode.

## 5) Strict Rules
- **Data flow bắt buộc**: service → hook → UI. KHÔNG gọi API trực tiếp trong component.
- **No fake data**: KHÔNG hardcode mock data cho production components.
- **Query key dedupe**: sibling components dùng chung query key → chỉ 1 request.
- **Error normalization**: KHÔNG hiện raw backend error cho user.
- **i18n**: mọi user-facing message (toast, empty state) phải dùng translation keys.
- **Loading = Skeleton**: ưu tiên skeleton over spinner.

## 6) Output specification
Files tạo/sửa:
- `src/features/<feature>/hooks/use-<resource>.ts` (custom hooks)
- `src/features/<feature>/components/<Component>.tsx` (wired with data)
- `src/features/<feature>/components/<Component>Skeleton.tsx` (skeleton)

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
