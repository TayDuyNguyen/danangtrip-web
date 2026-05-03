# Skill: 08-auth-permissions (Auth & Phân quyền)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm implement auth middleware, role-based UI, token management, và protected routes cho 1 màn hình.

## 1) Goal
- **Đúng người, đúng quyền mới vào được**
- Middleware kiểm tra login/role
- UI ẩn/hiện elements theo permission
- API calls kèm token (Authorization header)
- Redirect logic cho unauthorized

## 2) Persona (mandatory)
Đóng vai: **Security Expert**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `.agent/rules/PROJECT_RULES.md` (Section 10 — Auth and Security)
- SRS/analysis: actors & permissions
- Existing auth: `src/store/` (Zustand auth state), `src/middleware.ts`
- Auth service: `src/services/auth.service.ts`
- Existing auth hooks: `src/features/auth/`

## 4) Workflow

### 4.1 Auth State Review
1. Verify auth state source of truth: **Zustand store** (theo PROJECT_RULES).
2. Verify cookie sync: tokens sync với **Cookies** (`js-cookie`) cho Middleware + SSR.
3. Verify axios interceptor: tự động gắn `Authorization: Bearer <token>`.

### 4.2 Middleware Protection
4. Kiểm tra `src/middleware.ts`:
   - Route mới có cần protect không?
   - Nếu có: thêm route vào protected routes list.
   - Logic: check token → check role → allow/redirect.
5. Redirect behavior:
   - Unauthorized → `/login?redirect=<current-route>`
   - Forbidden (wrong role) → `/403` hoặc redirect phù hợp.

### 4.3 Role-based UI
6. **Conditional rendering** theo permission:
   - Buttons (Add, Edit, Delete) — chỉ render nếu có quyền.
   - Menu items — chỉ render nếu có quyền.
   - KHÔNG chỉ hide bằng CSS — phải conditional render (security).
7. **Pattern**:
   ```tsx
   const { user } = useAuthStore();
   const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER';
   {canEdit && <EditButton onClick={...} />}
   ```
8. Nếu phức tạp: tạo `usePermission(action: string)` hook.

### 4.4 Token Management
9. **Storage**: Zustand + Cookie (dual sync).
10. **Refresh**: xử lý token expired → refresh → retry request.
11. **Logout**: clear Zustand store + clear cookies + redirect `/login`.
12. **Session expiry**: nếu refresh fail → force logout.

### 4.5 Security Hardening
13. Không expose tokens trong URL query params.
14. Không log tokens ra console.
15. HttpOnly cookies nếu server-side auth available.
16. CSRF protection nếu applicable.

## 5) Strict Rules
- **Single source of truth**: auth state ở Zustand, sync với Cookie.
- **Không duplicate auth stores**.
- **Conditional render, không CSS hide**: cho permission-gated elements.
- **Không commit secrets/tokens**.
- **Không silent auth changes**: impact scan trước khi thay đổi auth logic.
- **Update `.env.example`** khi thêm auth-related env vars.

## 6) Output specification
Files tạo/sửa:
- `src/middleware.ts` (nếu cần protect route mới)
- `src/features/<feature>/components/` (permission-gated UI)
- `src/hooks/use-permission.ts` (nếu cần shared permission hook)

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
