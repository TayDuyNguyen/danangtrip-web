# Interaction Spec: Tour Booking

> Feature slug: `tour-booking`
> Date: 2026-05-16
> Feature scope: `src/features/tour/components/BookingForm.tsx` and related hooks.

---

## 1) Main User Actions
| Action | Trigger | Validation | Success Feedback | Error Feedback |
|---|---|---|---|---|
| **Chọn ngày khởi hành** | Click vào ngày trong `ScheduleCalendar` | Ngày phải có trong danh sách lịch trống | Highlight ngày chọn + trigger `calculate` | Toast lỗi nếu lịch không hợp lệ |
| **Thay đổi số lượng** | Click +/- trong `QuantityCounter` | `adult >= 1`, `child/infant >= 0` | Cập nhật số lượng + trigger `calculate` | Toast lỗi nếu vượt quá `available_seats` |
| **Điền thông tin khách** | Nhập liệu vào `Input` / `Textarea` | Zod schema validation (real-time/on blur) | Xóa thông báo lỗi | Hiển thị thông báo lỗi dưới field |
| **Tiếp tục thanh toán** | Click button "Tiếp tục thanh toán" | Toàn bộ form valid + Đã đồng ý điều khoản | Redirect sang trang thanh toán | Toast error tổng hợp hoặc focus vào field lỗi |

## 1.1) Action Priority
| Action | Priority | Why |
|---|---|---|
| **Chọn ngày khởi hành** | High | Là điều kiện tiên quyết để xác định giá và khả năng phục vụ. |
| **Điền thông tin liên hệ** | High | Cần thiết để tạo bản ghi booking và liên lạc với khách. |
| **Đồng ý điều khoản** | Medium | Ràng buộc pháp lý và chính sách trước khi tạo giao dịch. |

## 2) Forms
| Form | Fields | Validator | Submit Flow | Reset / Cancel Flow |
|---|---|---|---|---|
| `BookingForm` | `tour_schedule_id`, `quantities`, `customer_info`, `payment_method`, `agree_terms` | `bookingSchema` (Zod) | `calculate` (debounce) -> `createBooking` mutation -> Redirect | N/A (Trang đơn, quay lại trang Detail để hủy) |

## 3) Search / Filter / Pagination
| Control | URL Sync | Debounce | Notes |
|---|---|---|---|
| `QuantityCounter` | No | 300ms | Debounce cho việc gọi API `calculate` để tránh spam. |
| `ScheduleCalendar` | No | No | Cập nhật local state và trigger `calculate` ngay lập tức. |

## 3.1) Default Values / Reset Logic
| Control | Default Value | Reset Behavior | Notes |
|---|---|---|---|
| `quantity_adult` | 1 | N/A | Tối thiểu 1 người lớn. |
| `payment_method` | "momo" | N/A | Phương thức phổ biến nhất. |
| `agree_terms` | false | N/A | User bắt buộc phải chủ động click. |

## 4) Destructive / Protected Actions
*Feature này không có hành động xóa trực tiếp, chỉ có tạo mới (Create).*

## 4.1) Loading / Pending Behavior
| Action | Pending UI | Disabled Elements | Notes |
|---|---|---|---|
| **Tải lịch khởi hành** | Skeleton Grid | N/A | Chặn chọn ngày khi chưa load xong. |
| **Tính giá (Calculate)** | Price summary skeleton pulse | Submit button | Đảm bảo giá hiển thị là giá mới nhất trước khi submit. |
| **Tạo booking (Submit)** | Button loading spinner | Toàn bộ form inputs | Ngăn chặn double submission. |

## 5) Files Expected To Change
- `src/features/tour/components/BookingForm.tsx` (Logic trung tâm)
- `src/features/tour/hooks/useBookingQueries.ts` (Mutations handling)
- `src/messages/vi/tour.json` (Thêm các key thông báo thành công/lỗi)
- `src/messages/en/tour.json` (Thêm các key thông báo thành công/lỗi)

## 6) Risks / Open Questions
- **R-01:** Race condition khi user thay đổi ngày và số lượng liên tục cực nhanh. Giải pháp: Sử dụng `abortController` hoặc TanStack Query auto-cancel.
- **Q-01:** Có cần hỗ trợ "Save for later" (lưu nháp) không? (Hiện tại: Không, chỉ hỗ trợ đặt hoàn tất).
