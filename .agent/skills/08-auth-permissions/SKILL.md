---
name: 08-auth-permissions
description: Review middleware, auth state, and permission-gated UI. Use when a feature changes access control or exposes privileged actions.
---

# Skill: 08-auth-permissions

## Overview

Skill này dùng để rà soát auth, middleware, permission matrix, và UI gating trước khi bàn giao feature có yếu tố bảo vệ truy cập.
Mục tiêu là để route behavior, cookie/store sync, và UI permission cùng khớp một logic.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- `src/middleware.ts`
- `src/store/auth.store.ts`
- `src/utils/auth.helper.ts`
- `src/lib/axios.ts`
- `src/config/routes.ts`
- Feature analysis / route plan

## Recommended Questions To Answer

1. Route nào cần protect?
2. Feature này có role matrix hay chỉ cần login check?
3. UI nào phải hidden hoàn toàn?
4. Redirect behavior có rõ chưa?
5. Có duplicate auth logic ở đâu không?

## Process

### 1) Route Protection Review

Liệt kê:

- routes chịu ảnh hưởng
- route nào cần middleware/protected handling
- redirect behavior

### 2) Role Matrix Review

Mô tả:

- role nào được xem
- role nào được create/update/delete
- role nào được export/approve nếu có

### 3) UI Gating Review

Nói rõ:

- button/menu nào hidden hoàn toàn
- button/menu nào disabled
- lý do cho từng quyết định

### 4) Auth Flow Integrity Review

Kiểm tra:

- cookie/store sync
- interceptor attach
- logout flow
- expired token handling

## Pattern Chuẩn Của Repo

### Middleware pattern — Next.js App Router

```ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from '@/config/routes';

const PROTECTED_ROUTES = [
  '/profile',
  '/bookings',
  '/checkout',
];

const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  // Chưa login → redirect về login
  if (isProtected && !token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Đã login → không vào auth routes
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### Auth store pattern — Zustand là source of truth

```ts
// src/store/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
```

### UI gating pattern — conditional render, không CSS hide

```tsx
// GOOD: Conditional render — user không thể inspect DOM để thấy button
const { user, isAuthenticated } = useAuthStore();

{isAuthenticated && (
  <Button onClick={handleBooking}>Đặt tour</Button>
)}

// GOOD: Role-based render
{user?.role === 'premium' && (
  <PremiumFeatureButton />
)}

// BAD: CSS hide — user vẫn thấy trong DOM
<Button style={{ display: isAuthenticated ? 'block' : 'none' }}>
  Đặt tour
</Button>
```

### Axios interceptor — attach token tự động

```ts
// src/lib/axios.ts
axiosInstance.interceptors.request.use((config) => {
  // Token lấy từ cookie, không từ localStorage
  const token = getCookie('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear store và redirect về login
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Redirect với return URL

```ts
// Sau khi login thành công
const searchParams = useSearchParams();
const redirect = searchParams.get('redirect') || ROUTES.HOME;
router.push(redirect);
```

## Output Document

Tạo file:

- `.agent/artifacts/auth/YYYY-MM-DD__<feature-slug>__auth-permissions-review.md`

Template:

- `template_auth_review.md`

## Strict Rules

- Zustand là source of truth cho auth state — không đọc cookie trực tiếp trong component
- Không duplicate auth ownership — interceptor xử lý token attach, không làm lại trong service
- Không CSS-hide thay cho permission gating
- Nếu không chắc role matrix, ghi `[ASSUMPTION]`
- Middleware redirect không được tạo vòng lặp (login → protected → login)

## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Component đọc cookie trực tiếp thay vì qua `useAuthStore` → bypass store sync
- `display: none` dùng để ẩn button theo permission → user thấy trong DOM
- Middleware redirect về `/login` nhưng `/login` cũng bị protect → infinite redirect loop
- Service tự gắn `Authorization` header thay vì để interceptor làm → duplicate logic
- Logout chỉ clear cookie nhưng không clear Zustand store → stale auth state

## Common Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| "Feature này public, không cần auth review" | Vẫn cần ghi N/A rõ ràng — không bỏ qua im lặng |
| "Chỉ cần check `isAuthenticated` là đủ" | Nếu có role-based UI, cần check cả `user.role` |
| "CSS hide nhanh hơn conditional render" | User có thể inspect DOM và thấy hidden elements |
| "Interceptor đã xử lý 401, không cần check trong component" | Đúng — nhưng phải verify interceptor đang hoạt động đúng |

## Documentation Expectations

Auth review tốt phải có:

- protected routes (list + redirect behavior)
- role matrix (ai được làm gì)
- guarded UI actions (button/menu nào bị gate)
- redirect/token flow notes
- risks/assumptions

## Verification

- Đối chiếu `checklist.md`
- Auth review phải có protected route list, role matrix, và guarded UI actions
- Mọi route protected phải có redirect behavior rõ ràng
- Không có UI action nào bị gate bằng CSS hide
