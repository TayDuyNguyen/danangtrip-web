# Data Integration Plan: user-profile

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Target screen: **user-profile**

---

## 1) State & Fetching Architecture

We will implement a custom TanStack Query hook at `src/features/profile/hooks/useProfileQueries.ts` to manage profile data fetching, profile updating, and image uploading.

```
                  ┌──────────────────────────────┐
                  │      React Query cache       │
                  │  Key: ["user", "profile"]    │
                  └──────────────┬───────────────┘
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
            [useProfileQuery]      [useUpdateProfileMutation]
                     │                       │
                     ▼                       ▼
           profileService.show()   profileService.update()
                     │                       │
                     ▼                       ▼
              GET /user/profile       PUT /user/profile
```

---

## 2) Query Key Strategy & Queries

### 2.1 Profile Query
- **Hook Name:** `useProfileQuery`
- **Query Key:** `["user", "profile"]`
- **Service call:** `profileService.show()`
- **Stale Time:** `5 minutes` (to avoid repeated unnecessary fetches on settings navigation tab changes).

### 2.2 Profile Invalidation
On successful update (`PUT /user/profile`) or avatar upload (`POST /user/profile/avatar`), the cache key `["user", "profile"]` and `["auth", "me"]` (if exists) will be invalidated. This ensures that:
- The sidebar avatar picture and display name update immediately.
- The edit form fields sync with the latest backend state.
- The global header initials/avatar refresh.

---

## 3) Mutation Hooks

### 3.1 Update Profile
- **Hook Name:** `useUpdateProfileMutation`
- **Service call:** `profileService.update(data)`
- **Behavior:**
  - Invokes mutation on form submit.
  - Invalidates `["user", "profile"]` on success.
  - Fires success toast or maps validation errors to form states on failure.

### 3.2 Update Avatar
- **Hook Name:** `useUpdateAvatarMutation`
- **Service call:** `profileService.updateAvatar(file)`
- **Behavior:**
  - Invokes mutation immediately when the file picker yields a file.
  - Displays local loading spinner over the avatar circular shape.
  - Invalidates `["user", "profile"]` and updates the display on success.
