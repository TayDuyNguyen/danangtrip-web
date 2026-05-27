# Route & Layout Plan: user-profile

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Target route: `/profile`

---

## 1) Route Structure

The route for the user profile editing is already active:
- **URL Path:** `/[locale]/profile`
- **Physical File:** `src/app/[locale]/(main)/(protected)/profile/page.tsx`
- **Route Type:** Protected (requires user token, guarded by `middleware.ts`).

---

## 2) Layout Strategy

We will reuse the existing **`ProfileLayoutWrapper`** and **`ProfileSidebar`** / **`ProfileMobileNav`** to match the general settings layout.

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (Common)                                            │
├─────────────────────────────────────────────────────────────┤
│  BREADCRUMB: Trang chủ / Hồ sơ cá nhân                      │
├──────────────────────────────────┬──────────────────────────┤
│  ProfileSidebar (Desktop Only)   │  ProfileEditContainer    │
│  - Avatar, Info, Action links    │  - Personal Info Form    │
│                                  │  - Save / Reset buttons  │
└──────────────────────────────────┴──────────────────────────┘
```

- **Sidebar Integration:** The sidebar will display the user's avatar image, name, email, and user role. The avatar image in the sidebar will be reactive to updates completed in the form.
- **Main Content integration:** We will replace the current view-only dashboard blocks inside `src/app/[locale]/(main)/(protected)/profile/page.tsx` with a container mounting the interactive form and the file uploader.
- **Responsive Layout:**
  - **Desktop (>= 1024px):** Two columns: sidebar on the left, profile edit card on the right.
  - **Mobile (< 1024px):** Single column: ProfileMobileNav on top as a swipeable list, followed directly by the profile edit card.
