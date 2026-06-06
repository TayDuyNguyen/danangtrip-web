# Screen Analysis: Route & API Reality Review

> Feature slug: `web_route_api_next_screen_review`
> Date: 2026-05-27
> Figma: N/A

---

## 1) Summary
- This analysis serves to review all existing App Router routes, page implementations, API endpoints, and deploy artifacts in `danangtrip-web` and `danangtrip-api` to select and justify the next implementation screen/task.
- Main user: Developers and users accessing account settings.
- Related features/modules: Cart, Profile, Booking, Auth.
- Source inputs:
  - `D:\DATN\danangtrip-web\.agent\skills\STACK_SKILLS_INDEX.md`
  - `D:\DATN\danangtrip-api\routes\api.php`
  - `D:\DATN\danangtrip-web\src\config\routes.ts`
  - `D:\DATN\danangtrip-web\.agent\artifacts\deploy\`
  - `D:\DATN\DATN_Tài liệu\docs\project_delivery_progress_report.md` (v0.0.12)

---

## 2) Candidate Screen Matrix

We evaluated the remaining unimplemented or partially implemented screens against their API readiness, route definition, and user value.

| Candidate Screen | Route | Document | API Readiness | Priority | Recommendation & Rationale |
|---|---|---|---|---|---|
| **User Profile Edit & Avatar Upload** (`user-profile`) | `/profile` | `user_profile.md` | **Fully Ready** (`GET /user/profile`, `PUT /user/profile`, `POST /user/profile/avatar`) | **High (P0)** | **Recommended Candidate**. The route and basic profile page already exist, but the edit form and avatar upload functions are missing. This is a critical gap in the user account module. |
| **Settings Screen** (`user-settings`) | `/settings` | None | **None** | Low | Currently only a skeleton page shell. No API endpoints or detailed product requirements exist. |
| **Planned pages (dining/hotels/etc.)** | Various | Various | **None** (PLANNED) | Low | Placeholder routes in `routes.ts` without API or design details. Excluded. |

---

## 3) Selected Screen Justification: `user-profile`
- **Gap:** The existing page `/profile` at `src/app/[locale]/(main)/(protected)/profile/page.tsx` only renders read-only texts for name, email, phone, role, and joined date. It lacks the form inputs to edit, the buttons to submit/reset, and the image input to change avatar.
- **Backend Readiness:** `ProfileController` in `danangtrip-api` contains fully functioning endpoints:
  - `GET /user/profile` (returns detailed profile data)
  - `PUT /user/profile` (updates full_name, phone, birthdate, gender, city)
  - `POST /user/profile/avatar` (processes multipart/form-data upload for profile picture)
- **Downstream Actions:** In Step 03 we will define the Zod schemas and hook requirements for wrapping this feature, and Steps 04-09 will implement the form elements, Axios hooks, upload logic, and run prepush checks.

---

## 4) Verification & Assumptions

### Assumptions
- [ASSUMPTION] A-01: The backend `PUT /user/profile` accepts parameters `full_name`, `phone`, `birthdate`, `gender`, and `city`.
- [ASSUMPTION] A-02: `POST /user/profile/avatar` expects a multipart form key named `avatar`.

### Open Questions
- Q-01: Does next-intl translations already have keys for profile form labels and placeholder texts? Yes, they should be in `common.json` or `settings.json`. We will verify this during the project setup step.
