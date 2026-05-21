# UI Specification: Chi tiết Đơn đặt theo Mã đơn (user-booking-by-code)

- **Feature slug:** `user-booking-by-code`
- **Ngày thực hiện:** 2026-05-21
- **Trạng thái:** Hoàn thành thiết kế và hiện thực hóa thông qua việc tái sử dụng `BookingDetailClient`.

---

## 1) Overview & Layout Design
Trang chi tiết đơn đặt theo mã đơn được tổ chức thành cấu trúc 2 cột linh hoạt (responsive grid):
- **Cột trái (2/3 chiều rộng màn hình trên desktop):**
  - **Status Timeline:** Hiển thị 4 cột mốc quan trạng thái: Chờ thanh toán (`pending`), Đã xác nhận (`confirmed`), Đã hoàn thành (`completed`), Đã hủy (`cancelled`). Azure Blue làm màu sắc tiến trình chính.
  - **Tour Info Card:** Hiển thị ảnh thumbnail tour bo tròn chuẩn `12px`, tiêu đề tour kích thước lớn, ngày đi, số lượng từng nhóm khách (người lớn, trẻ em, trẻ sơ sinh).
  - **Customer Info Card:** Khung hiển thị thông tin người đại diện (Họ tên, email, điện thoại, địa chỉ, ghi chú đặc biệt) với nền bo góc và viền mờ.
- **Cột phải (1/3 chiều rộng màn hình trên desktop):**
  - **Price Summary Card:** Bảng phân tích chi tiết doanh thu (đơn giá người lớn x số lượng, đơn giá trẻ em x số lượng, tổng tiền gốc, giảm giá, tổng tiền thanh toán). Tổng tiền thanh toán được tô màu nhấn `#FF6B35`.
  - **Cancellation Warning Block:** Nếu đơn hàng có trạng thái `cancelled`, hiển thị một khối cảnh báo màu đỏ nhạt bo góc `16px` với nhãn `Lý do hủy đơn` và nội dung lý do hủy được bọc trong một container nền tối đơn sắc font chữ monospaced.
  - **Rebook CTA Button:** Nút đặt lại tour nổi bật màu Azure Blue dành cho các đơn hàng đã bị hủy.

---

## 2) Component Reuse Strategy (100% Shared UI)
Nhờ thiết kế kiến trúc thông minh, chúng ta đã tái sử dụng 100% mã nguồn hiển thị của `BookingDetailClient.tsx`:
- Giao diện, bố cục, các card thông tin, Timeline trạng thái và Dialog hủy đơn khớp hoàn hảo với trang chi tiết booking truyền thống (`/bookings/{id}`).
- Việc chuyển đổi giữa việc tải theo `id` (hệ thống) và `bookingCode` (mã đơn hàng) diễn ra hoàn toàn tự động ở tầng truy vấn dữ liệu bên trong component dựa trên sự hiện diện của prop `bookingCode`.

---

## 3) Responsive Breaks
- **Desktop (≥ 1024px):** Layout Grid 3 cột (2 cột trái, 1 cột phải). Mọi thành phần hiển thị cân đối. Khoảng cách biên an toàn `space-y-8`.
- **Tablet (768px - 1023px):** Thu gọn về Layout 1 cột dọc (`flex flex-col`). Timeline và Tour Info Card xếp lên đầu để người dùng dễ quan sát nhất.
- **Mobile (< 768px):** Padding thu nhỏ về `p-4` để tiết kiệm tối đa diện tích màn hình. Tiêu đề hiển thị ngắn gọn, các nút bấm thao tác (In hóa đơn, Hủy đơn) tự động căn rộng 100% màn hình (`w-full`) để người dùng dễ thao tác bằng ngón cái.

---

## 4) Visual States & Interactions
- **Loading State:** Thể hiện bằng component `BookingDetailSkeleton` với các khung xám bo tròn chuyển động nhịp nhàng (pulse animation), tạo cảm giác tải trang mượt mà và premium.
- **Error State:** Hiển thị thông báo dạng Glassmorphism nền đỏ nhạt kèm Icon cảnh báo đỏ rực rỡ, đi kèm mô tả lỗi chi tiết và 2 nút hành động:
  - `Quay lại danh sách` (Chuyển hướng về `/bookings`).
  - `Thử lại` (Thực hiện gọi `refetch()` tải lại dữ liệu).
- **Success State:** Hiển thị đầy đủ thông tin chi tiết đơn hàng cùng các nút thao tác nhanh ở Header:
  - Nút quay lại (nút mũi tên tròn bo).
  - Tải hóa đơn JSON: Đóng gói toàn bộ payload dữ liệu đơn hàng thành tệp tin JSON và tự động tải về dưới tên `invoice-{bookingCode}.json`.
  - In hóa đơn: Kích hoạt hộp thoại in mặc định của trình duyệt (`window.print()`), tự động ẩn các nút điều hướng và header để có giao diện in tối giản sạch sẽ.
  - Hủy đặt đơn: Dialog hiện lên cho phép người dùng nhập lý do hủy với số ký tự tối thiểu là 10.
