# Data Integration Plan: Lịch sử đặt tour (user-bookings-list)

> Feature slug: `user-bookings-list`
> Date: 2026-05-20
> Service scope: `src/services/booking.service.ts`

---

## 1) Data Sources
| Purpose | Source | Server or Client | Notes |
|---|---|---|---|
| Get user bookings history (paginated, searched, and status filtered) | `/user/bookings` (`GET`) via `bookingService.list` | Client | Managed with `useUserBookings` hook. Syncs active tab and search query parameters. |
| Request tour booking cancellation | `/user/bookings/{id}/cancel` (`POST`) via `bookingService.cancel` | Client | Managed with `useCancelBooking` mutation hook. Requires a valid cancellation reason. |

## 1.1) Data Ownership Notes
- **`useUserBookings`** is the single source of truth for the list.
- URL parameters or local component state drive the search and active tab parameters, causing TanStack Query to automatically refetch and coordinate server data updates.

## 2) Query / Hook Plan
| Query Key | Hook File | Trigger | staleTime | Notes |
|---|---|---|---|---|
| `["bookings", "user-list", params]` | `src/features/tour/hooks/useBookingQueries.ts` | Mounting or changing search query / active tab. | `30000` (30s) | Uses `placeholderData` to retain current list during background queries. |

## 2.1) Parallel / Dependent Query Notes
No parallel or dependent queries exist for this list screen.

## 3) Mutation Plan
| Action | Service Function | Success Handling | Error Handling |
|---|---|---|---|
| Cancel booking | `bookingService.cancel` | Invalidates `["bookings"]` query cache key, shows success toast, resets textarea reason, and closes the Cancel Booking dialog. | Normalizes Axios error messages and displays a toast notification (`toast.error`). |

## 4) UI State Handling
| UI Section | Loading | Empty | Error | Success |
|---|---|---|---|---|
| **Search & Tabs Header** | Search indicator inside search input | N/A | N/A | Interactive tabs filter and search inputs |
| **Bookings List Area** | 3 pulsate card skeletons matching real layout size | `EmptyState` component with CTA redirecting to discover tours | Custom error card panel showing localized text and a "Try again" retry button | Grid/Flex list of `BookingHistoryCard` components with entrance animation delays |
| **Cancel Dialogue Modal** | Submit button disabled and shows spinner status | N/A | Zod error message below textarea, Axios error toast | Dialog closes, list refetches |

## 4.1) Error Strategy
| Error Type | UI Handling | Toast | Retry |
|---|---|---|---|
| Query Fetch Failure | Inline error card with retry button | No | "Try again" action button calls `refetch()` |
| Local Form Schema Validation | Red input borders, text validation error | No | User fixes input inline (Zod watches changes) |
| Mutation Request Failure | Form fields enabled, submit allowed | Yes | Submit button click retries mutation |

## 5) Files Expected To Change
- `src/features/tour/hooks/useBookingQueries.ts` [READ-ONLY / PRE-IMPLEMENTED]
- `src/features/tour/components/BookingsHistoryClient.tsx` [VERIFIED]
- `src/features/tour/components/BookingHistoryCard.tsx` [VERIFIED]
- `src/features/tour/components/CancelBookingDialog.tsx` [VERIFIED]

## 6) Risks / Open Questions
- **R-01**: User could double click the cancellation submit button during slow network calls.
  - *Mitigation*: The submit button is completely disabled and marked as loading (`isPending`) as soon as the mutation begins.
- **R-02**: Stale pages when paginating then searching.
  - *Mitigation*: Handlers inside `BookingsHistoryClient` reset page to `1` immediately when search term or tab filters change.
