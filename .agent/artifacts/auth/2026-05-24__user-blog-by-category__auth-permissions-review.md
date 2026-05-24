# Auth & Permissions Review: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`
- **Audit Verdict**: ✅ **PASSED** (Public route is fully accessible and safe from auth leakages)

---

## 1. Route Gating & Protection status

The `/blog` and `/blog?category_id={id}` routes are completely public and do not require user authentication.

- **Routes affected**: `/blog`, `/blog?category_id={id}`
- **Auth Required**: **No**
- **Middleware behavior**: The route is checked against public matchers and is bypassed without redirecting.
- **Redirect behavior**: Not applicable.

---

## 2. API Access Control

The backend endpoints used for this feature (`GET /v1/blog` and `GET /v1/blog/categories`) are defined as public routes in `routes/api.php` under Laravel:

```php
    // Blog: Public access
    Route::get('/blog', [BlogController::class, 'index']);
    Route::get('/blog/categories', [BlogController::class, 'categories']);
```

No authentication headers or JWT tokens are required to query these endpoints.

---

## 3. UI Guarding

No UI elements or actions (tabs, search queries, sidebar clicks, paginations) on this page are protected by role or login state. 

- **All Posts & Categories**: Visible to everyone.
- **CTA reset buttons**: Actionable by all guests.

---

## 4. Token & Interceptor Integrity

The HTTP layer (`src/lib/axios.ts`) includes a request interceptor that automatically attaches the bearer token if it exists in the browser cookies, ensuring that even if a logged-in user views this public page, their session token is passed securely to the backend without hardcoding logic.
If the session token expires (401 response from the server), the interceptor automatically clears the Zustand auth store and redirects the user to the login page smoothly.
