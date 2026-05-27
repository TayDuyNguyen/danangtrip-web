# Project Setup Audit: Route & API Reality Review

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Verdict: **READY**

---

## 1) Overview of Current Project Base

This setup audit confirms that all baseline route files, configurations, and API integrations for the user profile subsystem are already defined and compatible.

---

## 2) Audit Findings

### 2.1 Route Folder & Component Conventions
- The route folder `src/app/[locale]/(main)/(protected)/profile/` exists and contains a page controller file `page.tsx` representing `/profile`.
- The profile sidebar (`src/features/profile/components/ProfileSidebar.tsx`) and mobile horizontal bar are already configured and link to the correct routes:
  - `/profile` (Hồ sơ cá nhân)
  - `/profile/password` (Đổi mật khẩu)
  - `/profile/bookings` (Đơn đặt tour)
  - `/profile/favorites` (Địa điểm yêu thích)
  - `/profile/ratings` (Đánh giá của tôi)
  - `/notifications` (Thông báo)
  - `/profile/recommendations` (Gợi ý cho bạn)
  - `/profile/delete` (Xóa tài khoản)

### 2.2 Route Constants & Middleware Protection
- `src/config/routes.ts` exports `PROTECTED_ROUTES` containing `PROFILE: "/profile"`.
- `src/middleware.ts` correctly registers this route group as protected, meaning any unauthenticated attempts are redirected to `/login` with appropriate callback forwarding.

### 2.3 HTTP Service & Endpoints
- `src/config/api.ts` maps:
  - `PROFILE: "/user/profile"`
  - `UPDATE_PROFILE: "/user/profile"`
  - `AVATAR: "/user/profile/avatar"`
- `src/services/profile.service.ts` exposes three functions:
  - `show()` (Axios GET request to `/user/profile`)
  - `update(data)` (Axios PUT request to `/user/profile`)
  - `updateAvatar(file)` (Axios POST request with multipart/form-data to `/user/profile/avatar`)
- All functions return promise-based API responses typed with inferred interfaces.

### 2.4 i18n Translation Bundles
- Locale directories `src/messages/vi/` and `src/messages/en/` contain a dedicated `settings.json` file.
- The `settings.json` file currently maps keys for the sidebar, breadcrumbs, `change_password`, and `delete_account`. 
- **Setup Task:** We need to add keys under a new `profile` namespace inside both translation files to support form labels, hints, validation messages, and submit/cancel button texts.

---

## 3) Verdict
- **Status:** **System Ready**
- **Action items for implementation:**
  - Create Zod validator schema for updating the profile.
  - Define typescript interfaces for request payloads.
  - Integrate React Query mutations (`useMutation`) using the existing `profileService`.
  - Formulate the UI specification.
