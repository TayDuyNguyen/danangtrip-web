# Route Plan: Tour Booking

> Feature slug: `tour-booking`
> Date: 2026-05-16
> Target Route: `/tours/{slug}/book`
> Route Group: `(protected)` (Requires authentication)

---

## 1) Route Structure
- **Path**: `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx`
- **Layout**: Reuses `src/app/[locale]/(main)/(protected)/layout.tsx` (handles auth redirection).
- **Breadcrumb Path**: Home > Tours > [Tour Name] > Booking

## 2) Metadata Strategy
- **Title**: `Đặt tour: [Tour Name] | DanangTrip` (Localized)
- **Description**: `Tiến hành đặt tour [Tour Name]. Đảm bảo chỗ của bạn ngay hôm nay.`
- **Implementation**: `generateMetadata` in `page.tsx`.

## 3) Server / Client Boundaries

| Section | Ownership | Reason |
|---------|-----------|--------|
| **Page Shell** | Server Component | Fetch tour detail by slug to ensure valid tour and for metadata. |
| **Header Minimal** | Server Component | Pure presentation. |
| **Progress Steps** | Client Component | Highlighting active step based on form state. |
| **Booking Form** | Client Component | Manages form state (React Hook Form), Zod validation, and API calls. |
| **Order Summary** | Client Component | Reacts to form changes (schedule, quantities) in real-time. |

## 4) Navigation & Config Impact
- **`src/config/routes.ts`**:
    ```ts
    // Add to PROTECTED_ROUTES or a new TOURS_BOOKING entry
    TOUR_BOOKING: (slug: string) => `/tours/${slug}/book`,
    ```

## 5) i18n Impact
New namespace `booking` inside `tour.json`:

```json
{
  "booking": {
    "title": "Đặt tour: {name}",
    "step_info": "Thông tin đặt tour",
    "step_payment": "Thanh toán",
    "step_confirm": "Xác nhận",
    "back": "Quay lại",
    "customer_info": "Thông tin khách hàng",
    "customer_note": "Thông tin này dùng để liên hệ và xác nhận đặt tour",
    "fill_from_profile": "Điền từ hồ sơ của bạn",
    "fill_now": "Điền ngay",
    "full_name": "Họ và tên",
    "email": "Email",
    "phone": "Số điện thoại",
    "address": "Địa chỉ",
    "note": "Ghi chú",
    "note_placeholder": "Yêu cầu đặc biệt, dị ứng thức ăn, v.v...",
    "payment_method": "Phương thức thanh toán",
    "terms_agree": "Tôi đồng ý với {terms} và {policy}",
    "terms_link": "Điều khoản sử dụng",
    "policy_link": "Chính sách hủy tour",
    "continue_payment": "Tiếp tục thanh toán",
    "order_summary": "Chi tiết đơn hàng",
    "cancellation_policy": "Chính sách hủy",
    "cancellation_note": "Hủy miễn phí trước 24 giờ kể từ lúc khởi hành. Hủy trong vòng 24 giờ sẽ chịu phí 50% tổng đơn hàng."
  }
}
```

## 6) Files Expected To Change
- `src/app/[locale]/(main)/(protected)/tours/[slug]/book/page.tsx` (New)
- `src/config/routes.ts` (Update)
- `src/messages/vi/tour.json` (Update)
- `src/messages/en/tour.json` (Update)
- `src/features/tour/components/BookingForm.tsx` (New - Client Component)
