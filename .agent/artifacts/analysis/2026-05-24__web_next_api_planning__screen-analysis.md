# Screen Analysis: Web Next API Planning / Screen Selection

**Feature Slug:** `web_next_api_planning`  
**Date:** 2026-05-24  
**Status:** Completed Selection  

---

## 1. Summary & Scope

The purpose of this planning phase is to audit the remaining undocumented or un-implemented candidate screens for the user web application (`danangtrip-web`) and decide which screen should be locked for the next implementation phase. 

### Candidate Screens:
1. **User Profile Deletion (`user-profile-delete`)**
   - **Route:** `/profile/delete`
   - **Access Control:** 🔐 Logged-in users only (`jwt.auth` / protected)
   - **Objective:** Allow users to permanently delete their account with password verification and checks for active bookings.
2. **User Cart (`user-cart`)**
   - **Route:** `/cart`
   - **Access Control:** Public / Guest session or Logged-in user
   - **Objective:** Store tours/schedules before checkout.

---

## 2. API Reality & Readiness Audit

We audited the backend API endpoints in `danangtrip-api` (`routes/api.php`) and compared them with the requirements for each candidate.

### Candidate 1: User Profile Deletion (`user-profile-delete`)
* **Expected API:** `DELETE /v1/user/account` (Accepts `password` in request body).
* **Current Backend Status:** ❌ **Not Ready**. 
  - There is an administrative deletion endpoint (`DELETE /v1/admin/users/{id}`), but no user-facing profile self-deletion endpoint under `jwt.auth` middleware group.
* **Database Constraints:** 
  - `bookings`: Has `foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();` (Preserves bookings as anonymized history, preventing data corruption).
  - `ratings`: Has `cascadeOnDelete()` (Auto-deletes ratings on user deletion). *Note: Cache stats for rated tours/locations must be manually updated to prevent averages from falling out of sync.*
  - `favorites`, `notifications`, `refresh_tokens`: All have `cascadeOnDelete()` constraints.

### Candidate 2: User Cart (`user-cart`)
* **Expected APIs:** `GET /cart`, `POST /cart/items`, `PUT /cart/items/{id}`, `DELETE /cart/items/{id}`, `POST /cart/checkout`.
* **Current Backend Status:** ❌ **Not Ready**.
  - No cart routes or endpoints exist in `routes/api.php`.
  - No database tables or migrations exist for a shopping cart system.
* **Product Notes:** The cart page is marked as optional in `user_cart.md` since the application supports direct tour checkout from the tour detail page.

---

## 3. Screen Selection Recommendation

Based on the audit, we recommend selecting **`user-profile-delete`** as the next screen for implementation, with a prerequisite step to create the backend self-deletion API in `danangtrip-api`.

### Selection Rationale:
1. **Critical Path/Privacy:** Deleting account is a fundamental privacy/GDPR feature, whereas the cart can be skipped because direct checkout from tour details is already implemented.
2. **Implementation Feasibility:** Adding a single `DELETE /v1/user/account` endpoint is highly feasible, secure, and clean. Implementing a complete database-backed cart system with guest sessions is out of scope and unnecessarily complex at this stage of delivery.

---

## 4. Required Backend API Modification (API Contract)

To make `user-profile-delete` fully functional, we will implement the following endpoint in `danangtrip-api`:

### Endpoint Specifications:
* **Method:** `DELETE`
* **Route:** `/v1/user/account`
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "password": "user_password_here"
  }
  ```

### Business Logic on Backend:
1. **Verification:** Validate password matches the authenticated user: `Hash::check($password, $user->password)`.
2. **Active Bookings Check:** Query bookings with pending/confirmed status:
   ```php
   Booking::where('user_id', $userId)->whereIn('booking_status', ['pending', 'confirmed'])->exists()
   ```
   If active bookings exist, block deletion and return `400 Bad Request` with message: `"Bạn có đơn hàng đang hoạt động. Vui lòng hủy hoặc hoàn thành trước khi xóa tài khoản."`
3. **Data Cleanup:**
   - Fetch all ratings of the user to identify which locations/tours they rated.
   - Delete rating images from storage.
   - Delete the user model (`$user->delete()`), which triggers database cascades for ratings, favorites, notifications, and tokens.
   - Recalculate and update location/tour review stats (`updateStats`) for the identified targets.
   - Delete user avatar from disk: `Storage::disk('public')->delete($user->avatar)`.
4. **Response:** Return `200 OK` on success.

---

## 5. Summary Table

| Component | Path / Route | Layer | Impact | Reason |
|---|---|---|---|---|
| `DELETE /user/account` | `danangtrip-api: DELETE /v1/user/account` | Backend API | [NEW] | Add account deletion endpoint with password confirmation and active bookings verification |
| `ProfileController` | `danangtrip-api: app/Http/Controllers/Api/ProfileController.php` | Backend Controller | [MOD] | Add `deleteAccount` action |
| `ProfileService` | `danangtrip-api: app/Services/ProfileService.php` | Backend Service | [MOD] | Add business logic for account deletion |
| `/profile/delete` | `danangtrip-web: /profile/delete` | Frontend Route | [NEW] | Add page and layout for confirmation flow |
| `ProfileSidebar` | `danangtrip-web: src/features/profile/components/ProfileSidebar.tsx` | Frontend Component | [MOD] | Add "Delete Account" link to the profile sidebar |
