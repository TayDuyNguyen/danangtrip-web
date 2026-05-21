# Route Plan: Tour Booking History (user-bookings-list)

> Feature slug: `user-bookings-list`  
> Date: 2026-05-20  
> Route scope: `/bookings`  

---

## 1) Summary
- **Route Path**: `/bookings`
- **Route Group**: `(protected)` group under `src/app/[locale]/(main)/(protected)/bookings` (Requires Authentication).

## 1.1) Route Decision
- **Route type**: `new`
- **Server-first or client-heavy**: Server page shell rendering a client-heavy component (`BookingsHistoryClient`).
- **Why**: The page requires dynamic metadata and server-side locale resolution, but the core functionality (searching, tab-based filtering, pagination, and opening the cancel booking modal) relies heavily on client-side state and mutations.

---

## 2) Route Files

| Route Path | File | Layout | Server / Client Notes | Metadata |
|---|---|---|---|---|
| `/bookings` | `src/app/[locale]/(main)/(protected)/bookings/page.tsx` | Inherits parent layouts (Header, Footer, protected routes check) | Server Component wrapper. Renders `BookingsHistoryClient`. | Yes, dynamic metadata generated via `generateMetadata`. |

---

## 3) Route Config Impact

| File | Change Needed | Notes |
|---|---|---|
| `src/config/routes.ts` | Thêm `BOOKINGS: "/bookings"` vào `PROTECTED_ROUTES` và mapping `ROUTES`. | Đảm bảo middleware bảo mật nhận diện được đường dẫn và yêu cầu đăng nhập. |

---

## 3.1) Server / Client Boundary Notes

| Area | Server or Client | Reason |
|---|---|---|
| Page entry (`bookings/page.tsx`) | Server | Cần `generateMetadata` và `getTranslations` phía server cho SEO/i18n. |
| Dashboard wrapper (`BookingsHistoryClient.tsx`) | Client | Cần quản lý state của URL params (tab, page, search), xử lý React Query queries/mutations và kích hoạt modals. |
| Detail card (`BookingHistoryCard.tsx`) | Client | Có nút bấm hành động (Hủy đơn, Đánh giá, Đặt lại) phản hồi tức thì. |
| Cancel modal (`CancelBookingDialog.tsx`) | Client | Dialog tương tác đi kèm form xác thực bằng Zod. |

---

## 4) Locale / Navigation Impact

| Item | Locale Keys | Notes |
|---|---|---|
| **Header Dropdown Link** | `tour.history.header_link` | Thêm liên kết vào menu dropdown của Header cho người dùng đã đăng nhập. |
| **Title / Meta** | `tour.history.meta_title`, `tour.history.meta_description`, `tour.history.page_title` | Tiêu đề trang & Meta SEO cho cả hai ngôn ngữ. |
| **Status Tabs** | `tour.history.tabs.all`, `tour.history.tabs.pending`, `tour.history.tabs.confirmed`, `tour.history.tabs.completed`, `tour.history.tabs.cancelled` | Các tab trạng thái lọc. |
| **Card Fields & Actions** | `tour.history.booking_code`, `tour.history.travel_date`, `tour.history.booked_date`, `tour.history.quantity`, `tour.history.total_amount`, `tour.history.action_detail`, `tour.history.action_cancel`, `tour.history.action_review`, `tour.history.action_rebook` | Thông tin trên thẻ và các nhãn hành động. |
| **Cancel Modal** | `tour.history.cancel_title`, `tour.history.cancel_confirm`, `tour.history.cancel_reason_label`, `tour.history.cancel_reason_placeholder`, `tour.history.cancel_warning`, `tour.history.cancel_success`, `tour.history.cancel_failed`, `tour.history.button_close`, `tour.history.button_submit` | Các chuỗi hiển thị trong modal hủy. |
| **Empty State** | `tour.history.empty_title`, `tour.history.empty_desc`, `tour.history.empty_cta` | Trạng thái rỗng kèm CTA khám phá tour. |

---

## 5) Files Expected To Change
- `src/config/routes.ts`
- `src/messages/vi/tour.json`
- `src/messages/en/tour.json`
- `src/components/layout/Header.tsx`
- `src/app/[locale]/(main)/(protected)/bookings/page.tsx`
- `src/features/tour/components/BookingsHistoryClient.tsx`
- `src/features/tour/components/BookingHistoryCard.tsx`
- `src/features/tour/components/CancelBookingDialog.tsx`

---

## 6) Risks / Open Questions
- **R-01**: Đồng bộ số trang khi chuyển tab lọc: Nếu đang ở `page=2` của tab "Tất cả", khi nhấn sang tab "Đã hủy" (chỉ có 1 trang), danh sách có thể bị trống.  
  *Giải pháp*: Reset `page` về `1` bất cứ khi nào tab lọc trạng thái hoặc từ khóa tìm kiếm thay đổi.
