# Auth & Permissions Review: Notifications

> Feature slug: `notifications`
> Date: 2026-05-22
> Route scope: `/notifications`

---

## 1) Protected Routes
| Route | Middleware Needed | Redirect Behavior | Notes |
|---|---|---|---|
| `/notifications` | Yes | If guest (not authenticated), redirect to `/login?callbackUrl=%2Fnotifications` | Locale-aware redirection (e.g. `/en/login?callbackUrl=%2Fen%2Fnotifications`). |

*Note: The path `/notifications` has been officially registered under edge middleware `src/middleware.ts` within the protected routes array, enforcing early edge-level network redirect security.*

## 2) Role Matrix
| Role | View | Create | Update (Mark Read) | Delete | Notes |
|---|---|---|---|---|---|
| guest | No | No | No | No | Edge Middleware blocks and redirects immediately to login. |
| user | Yes | N/A | Yes | Yes | Can view own notifications, mark single/all as read, and delete. |
| admin | Yes | N/A | Yes | Yes | Same access permissions as standard user. |

## 2.1) Action Matrix
| Action | Allowed Role(s) | UI Behavior | Backend Expectation | Notes |
|---|---|---|---|---|
| View Notifications List | `user`, `admin` | Render list of notifications under `/notifications` | `GET /user/notifications` | Returns own paginated list. |
| Get Unread Count | `user`, `admin` | Displays count badge on navbar notification icon and header subtitle | `GET /user/notifications/unread-count` | Real-time counts. |
| Mark as Read | `user`, `admin` | Removes vertical unread strip, pulsate dot, and decrements counter | `PATCH /user/notifications/{id}/read` | Updates status on DB. |
| Mark All as Read | `user`, `admin` | Instantly updates all unread cards on current list, header count drops to 0 | `PATCH /user/notifications/read-all` | Bulk update endpoint. |
| Delete Notification | `user`, `admin` | Fades out card immediately and removes it from list with toast | `DELETE /user/notifications/{id}` | Permanently removes card. |

## 3) Guarded UI Actions
| UI Element | Visible To | Why |
|---|---|---|
| Header Bell Count Badge | `user`, `admin` | Displays current unread count. Hidden from guests (only initialized after token validation). |
| Mark All as Read Button | `user`, `admin` | Only visible when `unreadCount > 0`. |
| Card Delete Button (Trash) | `user`, `admin` | Standard deletion capability on hover/touch. |

## 3.1) Hidden vs Disabled Decisions
| UI Element | Hidden or Disabled | Reason | Risk |
|---|---|---|---|
| Notification Page Layout | Hidden (Redirect) | Non-logged-in users cannot access private notifications. | Minimal, standard auth protection. |
| Mark All as Read Button | Hidden | If there are no unread notifications, showing the button is redundant and visual clutter. | Minimal, clean design. |
| Delete Card Button | Disabled (`isRemoving`) | When deletion is in progress, the trash button is disabled and `pointer-events-none` is applied to avoid double request. | Minimizes race conditions. |

## 4) Risks / Assumptions
- **[ASSUMPTION] A-01**: Backend API `/user/notifications` enforces strict ownership checks, ensuring user A cannot view, mark read, or delete user B's notifications.
- **[RISK] R-01**: In case of dynamic token expiration during an active session, client mutations will fail with 401. Handled gracefully by axios error interceptor which clears invalid token and redirects to `/login`.

## 5) Files / Areas Affected
- [src/middleware.ts](file:///d:/DATN/danangtrip-web/src/middleware.ts) — Edge middleware path guarding.
- [src/app/[locale]/(main)/(protected)/notifications/page.tsx](file:///d:/DATN/danangtrip-web/src/app/%5Blocale%5D/%28main%29/%28protected%29/notifications/page.tsx) — Dynamic metadata and page routing.
- [src/features/notifications/hooks/useNotificationMutation.ts](file:///d:/DATN/danangtrip-web/src/features/notifications/hooks/useNotificationMutation.ts) — Query mutations.
