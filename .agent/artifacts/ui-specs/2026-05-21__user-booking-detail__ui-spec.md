# Đặc tả UI: Chi tiết Đơn đặt tour (user-booking-detail)

Tài liệu này trình bày chi tiết về mặt giao diện, layout và các hiệu ứng trực quan đã được thiết kế và triển khai cho màn hình **Chi tiết đơn đặt tour**.

---

## 1. Cấu trúc Layout & Bố cục (Responsive Grid Layout)

Giao diện sử dụng cấu trúc Grid linh hoạt bám sát chỉ dẫn trong [DESIGN.md](file:///D:/DATN/danangtrip-web/DESIGN.md):
- **Desktop (Màn hình lớn):** 
  - 3 Cột (Grid columns `lg:grid-cols-3`).
  - Cột trái chiếm 2 phần (`lg:col-span-2`), chứa:
    - **BookingStatusTimeline** (Tiến trình đơn hàng)
    - **BookingTourInfoCard** (Thông tin Tour)
    - **BookingCustomerInfoCard** (Thông tin khách hàng đại diện)
  - Cột phải chiếm 1 phần (`lg:col-span-1`), chứa:
    - **BookingPriceSummaryCard** (Bảng tính giá và chi tiết thanh toán)
    - **Thông báo lý do hủy** (Hiển thị ngay dưới bảng giá nếu đơn hàng ở trạng thái `cancelled`).
    - **Nút hành động phụ** (Đặt lại tour).
- **Mobile (Màn hình nhỏ):**
  - Chuyển thành layout 1 cột (`grid-cols-1`). Các khối thông tin xếp chồng từ trên xuống theo thứ tự tối ưu trải nghiệm đọc: Header -> Tiến trình (Timeline) -> Thông tin Tour -> Thông tin Khách hàng -> Bảng giá.

---

## 2. Đặc tả Các Thành phần UI Mới (UI Components Specification)

### 2.1 BookingStatusTimeline (Dòng thời gian Tiến trình)
- **Thiết kế:**
  - Responsive: Trên desktop hiển thị dạng ngang (Horizontal stepper), trên mobile tự động xoay dọc (Vertical stepper) giúp không bị vỡ giao diện.
  - Sử dụng các đường nối (`absolute` positioning) mảnh kết nối các vòng tròn bước đi.
- **Trạng thái trực quan (Color-coding):**
  - *Completed (Hoàn thành):* Vòng tròn màu `bg-primary` (#8B6A55) kèm dấu tick `CheckCircle2`.
  - *Active (Đang diễn ra):* Vòng tròn viền `border-primary` nhấp nháy (`animate-pulse`) kèm biểu tượng `Clock` xoay nhẹ.
  - *Cancelled (Bị hủy):* Vòng tròn màu đỏ nổi bật `bg-red-500` kèm biểu tượng `X`.
  - *Pending (Chờ):* Vòng tròn xám nhạt `bg-surface-container-high` hiển thị số thứ tự bước.

### 2.2 BookingTourInfoCard (Thẻ thông tin Tour)
- **Thiết kế:**
  - Layout chia đôi: Bên trái là ảnh thumbnail tỉ lệ thu nhỏ (`w-40 h-32` trên desktop) có border mờ, bên phải là tiêu đề và thông số.
  - Link tiêu đề tour dẫn thẳng đến trang chi tiết tour `/tours/${slug}` giúp người dùng dễ dàng xem lại.
- **Dữ liệu hiển thị:**
  - Tên tour (chữ trắng đậm, hover đổi sang màu primary).
  - Ngày khởi hành (kèm icon `Calendar`).
  - Thời lượng (kèm icon `Clock`).
  - Điểm khởi hành / đón (kèm icon `MapPin`).

### 2.3 BookingPriceSummaryCard (Thẻ chi tiết giá & thanh toán)
- **Thiết kế:**
  - Hiển thị công thức giá chi tiết của từng đối tượng khách hàng (Người lớn, trẻ em, em bé) dưới dạng bảng dữ liệu đơn cách chữ cách số (`font-mono text-xs tabular-nums`).
  - Nổi bật tổng số tiền cuối cùng ở chân thẻ với size lớn `text-xl font-bold text-primary`.
  - Cung cấp bảng metadata phụ thể hiện phương thức thanh toán, trạng thái thanh toán và trạng thái đặt tour dưới dạng các `Badge` màu sắc tiêu chuẩn (xanh lá cho `success/completed`, vàng cam cho `pending/warning`, đỏ cho `failed/error`).

### 2.4 BookingCustomerInfoCard (Thẻ thông tin khách đặt)
- **Thiết kế:**
  - Trình bày thông tin liên hệ của khách hàng đại diện đặt tour.
  - Mỗi hàng thông tin bao gồm icon màu primary, nhãn nhỏ chữ in hoa màu xám và giá trị chữ trắng nổi bật.
- **Dữ liệu hiển thị:**
  - Họ tên người đại diện (icon `User`).
  - Số điện thoại (icon `Phone`).
  - Email (icon `Envelope`).
  - Địa chỉ đón/trả hoặc liên lạc (icon `Estate`).
  - Ghi chú thêm (icon `CommentMessage`).

---

## 3. Hoạt ảnh & Trải nghiệm Tương tác (Animations & Micro-interactions)

- **Reveal Entrance:**
  - Toàn bộ trang áp dụng hiệu ứng `reveal-up` kết hợp hiệu ứng trượt nhẹ từ dưới lên khi tải dữ liệu xong.
- **Loading Skeleton:**
  - Khi đang tải dữ liệu từ API (`isLoading = true`), màn hình hiển thị toàn bộ khung xương (Skeleton structure) mô phỏng chính xác cấu trúc thật với hiệu ứng `animate-pulse` giúp giảm thiểu giật cục giao diện (Cumulative Layout Shift - CLS).
- **Print stylesheet:**
  - Trang được tích hợp CSS tối ưu khi in (`window.print()`). Lớp CSS `@media print` hoặc class Tailwind `print:hidden` tự động ẩn đi các nút điều hướng quay lại, nút in, và các dialog xác nhận, đảm bảo bản in hóa đơn ra giấy hoặc PDF luôn gọn gàng, chuyên nghiệp.
