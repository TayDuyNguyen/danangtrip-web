# Auth & Permissions Review: Favorites

> Feature slug: `favorites`
> Date: 2026-05-22
> Route scope: `/favorites`

---

## 1) Protected Routes
| Route | Middleware Needed | Redirect Behavior | Notes |
|---|---|---|---|
| `/favorites` | Yes | If guest (not authenticated), redirect to `/login?callbackUrl=%2Ffavorites` | Synchronized locale-aware redirect (`/en/login?callbackUrl=%2Fen%2Ffavorites` or `/login?callbackUrl=%2Ffavorites`). |

*Note: Added `/favorites` to `protectedRoutes` in [src/middleware.ts](file:///d:/DATN/danangtrip-web/src/middleware.ts) to enforce Server-Side Edge redirect, matching the client-side `ProtectedLayout` gating.*

## 2) Role Matrix
| Role | View | Create | Update | Delete | Notes |
|---|---|---|---|---|---|
| guest | No | No | No | No | Redirected to login page. |
| user | Yes | Yes | N/A | Yes | Allowed to view personal favorites, add items to favorites, and delete favorites. |
| admin | Yes | Yes | N/A | Yes | Same access rights as user. |

## 2.1) Action Matrix
| Action | Allowed Role(s) | UI Behavior | Backend Expectation | Notes |
|---|---|---|---|---|
| View Saved Favorites | `user`, `admin` | Render grid/list of saved locations with pagination & sorting. | `GET /user/favorites` | Returns list of favorited items. |
| Add Location/Tour | `user`, `admin` | Toggles heart icon to filled. | `POST /user/favorites` | Handled via shared hook `useFavoriteToggle`. |
| Remove Location/Tour | `user`, `admin` | Toggles heart icon to empty / Removes card from `/favorites` layout. | `DELETE /user/favorites` | Handled via shared hook `useFavoriteToggle` with 5-second Toast Undo window. |

## 3) Guarded UI Actions
| UI Element | Visible To | Why |
|---|---|---|
| Favorite Page Layout | `user`, `admin` | Contains personal saved items. Hidden from guest via page routing/guarding. |
| "Add to Favorite" Heart button | `guest`, `user`, `admin` | Guests can see the button on public details pages but need to authenticate to perform the action. |

## 3.1) Hidden vs Disabled Decisions
| UI Element | Hidden or Disabled | Reason | Risk |
|---|---|---|---|
| Favorite Page Link (Header/Profile menu) | Hidden | Guests should not see the favorites route options in their navigation before logging in. | Minimal. Standard UX pattern. |
| Heart button (public details) | Visible (Enabled) | Guests should know favoriting is a feature. Clicking it when unauthenticated is caught, but needs smoother redirection. | If guest clicks it, standard mutation fails without redirection unless handled client-side. |

## 4) Risks / Assumptions
- **[ASSUMPTION] A-01**: Access to `/favorites` endpoint (`GET`, `POST`, `DELETE` under `/user/favorites`) is strictly governed by the backend JWT authorization checking.
- **[RISK] R-01**: Standard `useFavoriteToggle` hook does not check `isAuthenticated` on the client side before triggering mutations. If a guest user clicks the Heart button on Location/Tour details, the API request fails with `401 Unauthorized` without redirecting them to `/login` (since the Axios interceptor only redirects if a token is present but expired). *Recommendation: Add a client-side auth check or prompt login modal directly on action click if unauthenticated.*

## 5) Files / Areas Affected
- [src/middleware.ts](file:///d:/DATN/danangtrip-web/src/middleware.ts) — Added `/favorites` to list of edge-redirected protected routes.
- [src/app/[locale]/(main)/(protected)/favorites/page.tsx](file:///d:/DATN/danangtrip-web/src/app/%5Blocale%5D/%28main%29/%28protected%29/favorites/page.tsx) — Uses `ProtectedLayout` for client-side gating.
- [src/hooks/useFavorite.ts](file:///d:/DATN/danangtrip-web/src/hooks/useFavorite.ts) — Query check hook is disabled for guests (`enabled: isAuthenticated`).
