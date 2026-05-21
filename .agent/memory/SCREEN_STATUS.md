# Thống kê Màn hình — danangtrip-web

> Cập nhật: 2026-05-14
> Tổng: 42 màn (12 done + 2 partial + 3 skeleton + 25 chưa triển khai)
> Thứ tự: từ trên xuống = thứ tự triển khai khuyến nghị

---

## Chú thích trạng thái

- ✅ DONE — Đã triển khai hoàn chỉnh
- 🔧 PARTIAL — Đã có nhưng thiếu tính năng
- 🦴 SKELETON — Chỉ có page shell, chưa có UI thực
- ⬜ TODO — Chưa triển khai
- 📋 PLANNED — Feature planned, chưa có API backend

---

| # | Màn hình | Tài liệu | Trạng thái | Note |
|---|----------|----------|------------|------|
| | **MODULE: Public — Trang chính** | | | |
| 1 | Trang chủ | `docs/page/user_home.md` · `screen/1_Guest/01.1-Trang_Chu_Guest` | ✅ DONE | Hero, StatsBar, CategoryGrid, FeaturedLocations, Tours, Blog |
| 2 | Tìm kiếm | `docs/page/user_search.md` · `screen/1_Guest/02.1-Tim_Kiem` | ✅ DONE | SearchResultsClient, filters, suggestions |
| 3 | Liên hệ | `docs/page/user_contact.md` · `screen/1_Guest/08-Trang_Lien_He` | ✅ DONE | ContactHero, ContactForm (có tests) |
| 4 | Giới thiệu Đà Nẵng | *(cần tạo doc)* · `screen/1_Guest/05.1-Gioi_Thieu_Da_Nang` | 🦴 SKELETON | Chỉ title + subtitle |
| | **MODULE: Locations** | | | |
| 5 | Danh sách Địa điểm | `docs/page/user_locations_list.md` · `screen/1_Guest/03.2-Danh_Sach_Dia_Diem` | ✅ DONE | LocationListClient, filter, grid, pagination |
| 6 | Chi tiết Địa điểm | `docs/page/user_location_detail.md` · `screen/1_Guest/04.1-Chi_Tiet_Dia_Diem_Guest` | ✅ DONE | SSR metadata, Gallery, Reviews, WriteReviewModal |
| 7 | Địa điểm theo Danh mục | `docs/page/user_locations_by_category.md` · `screen/1_Guest/03.1-Danh_Muc_Dia_Diem` | ⬜ TODO | Tái sử dụng LocationList + filter |
| 8 | Địa điểm lân cận | `docs/page/user_locations_nearby.md` · `screen/1_Guest/04.3-Dia_Diem_Lan_Can` | ⬜ TODO | Cần GPS API |
| | **MODULE: Tours** | | | |
| 9 | Danh sách Tour | `docs/page/user_tours_list.md` · `screen/1_Guest/07.1-Danh_Sach_Tour` | ✅ DONE | FilterSidebar, TourGrid, sort, search, pagination |
| 10 | Chi tiết Tour | `docs/page/user_tour_detail.md` · `screen/1_Guest/07.2-Chi_Tiet_Tour` | ✅ DONE | SSR, ImageGallery, Itinerary, Reviews, BookingSidebar |
| 11 | Tour theo Danh mục | `docs/page/user_tours_by_category.md` · *(thiếu prototype)* | ⬜ TODO | Tái sử dụng TourList + filter |
| | **MODULE: Blog** | | | |
| 12 | Danh sách Blog | `docs/page/user_blog_list.md` · `screen/1_Guest/06.1-Cam_Nang_Du_Lich` | ✅ DONE | BlogHero, BlogContent, CategoryScrollRow |
| 13 | Chi tiết Bài viết | `docs/page/user_blog_detail.md` · *(thiếu prototype)* | ✅ DONE | SSR, ReadingProgress, TOC, RichText, RelatedPosts |
| | **MODULE: Auth** | | | |
| 14 | Đăng nhập | `docs/page/user_login.md` · *(thiếu prototype)* | ✅ DONE | LoginForm feature |
| 15 | Đăng ký | `docs/page/user_register.md` · *(thiếu prototype)* | ✅ DONE | RegisterForm feature |
| 16 | **Quên mật khẩu** | `docs/page/user_forgot_password.md` · *(thiếu prototype)* | ⬜ TODO | Auth service có sẵn |
| 17 | **Đặt lại mật khẩu** | `docs/page/user_reset_password.md` · *(thiếu prototype)* | ⬜ TODO | Phụ thuộc Forgot Password |
| 18 | **Xác thực Email** | `docs/page/user_verify_email.md` · `screen/2_User/04.1~04.4-Xac_Thuc_Email` | ⬜ TODO | 4 sub-states (đang xử lý, OTP, thành công, thất bại) |
| | **MODULE: Booking Flow (P0)** | | | |
| 19 | **Đặt Tour** | `docs/page/user_tour_booking.md` · `screen/2_User/09.1-Dat_Tour` | ⬜ TODO | **ƯU TIÊN CAO** — booking.service + types đã sẵn |
| 20 | **Thanh toán** | `docs/page/user_payment.md` · `screen/2_User/09.2-Thanh_Toan` | ⬜ TODO | payment.service đã có |
| 21 | **Kết quả Thanh toán** | `docs/page/user_payment_result.md` · `screen/2_User/09.4-Thanh_Toan_Thanh_Cong` | ⬜ TODO | |
| | **MODULE: User Profile** | | | |
| 22 | Trang Cá nhân | `docs/page/user_profile.md` · `screen/2_User/05.1-Trang_Ca_Nhan` | 🔧 PARTIAL | Chỉ view, chưa có edit form + upload avatar |
| 23 | **Đổi mật khẩu** | `docs/page/user_profile_password.md` · `screen/2_User/05.2-Doi_Mat_Khau` | ⬜ TODO | profile.service.changePassword đã có |
| 24 | **Xóa tài khoản** | `docs/page/user_profile_delete.md` · `screen/2_User/05.3-Xoa_Tai_Khoan` | ⬜ TODO | |
| | **MODULE: Favorites** | | | |
| 25 | **Địa điểm Yêu thích** | `docs/page/user_favorites.md` · `screen/2_User/07-Dia_Diem_Yeu_Thich` | ⬜ TODO | favorite.service + useFavorite hook đã có |
| | **MODULE: Bookings Management** | | | |
| 26 | **DS Đơn đặt tour** | `docs/page/user_bookings_list.md` · `screen/2_User/08.1-Danh_Sach_Don_Dat_Tour` | ⬜ TODO | booking.service.list đã có |
| 27 | **Chi tiết Đơn đặt** | `docs/page/user_booking_detail.md` · `screen/2_User/08.2-Chi_Tiet_Don_Dat_Tour` | ⬜ TODO | booking.service.detail đã có |
| 28 | Đơn đặt theo Mã | `docs/page/user_booking_by_code.md` · *(thiếu prototype)* | ⬜ TODO | Tái sử dụng booking detail |
| 29 | Hóa đơn PDF | `docs/page/user_booking_invoice.md` · *(thiếu prototype)* | ⬜ TODO | booking.service.invoice đã có |
| | **MODULE: Ratings** | | | |
| 30 | **Đánh giá của tôi** | `docs/page/user_my_ratings.md` · `screen/2_User/03.2-Danh_Gia_Cua_Toi_v2` | ⬜ TODO | rating.service đã có |
| 31 | Modal Sửa đánh giá | `docs/page/user_rating_edit_modal.md` · — | ⬜ TODO | Component |
| 32 | Dialog Xóa đánh giá | `docs/page/user_rating_delete.md` · — | ⬜ TODO | Component |
| 33 | Button Hữu ích | `docs/page/user_rating_helpful.md` · — | 🔧 PARTIAL | Service có, UI chưa |
| 34 | Lightbox ảnh đánh giá | `docs/page/user_rating_images_lightbox.md` · — | ⬜ TODO | Component |
| | **MODULE: Notifications** | | | |
| 35 | **Thông báo** | `docs/page/user_notifications.md` · `screen/2_User/10-Thong_Bao` | ⬜ TODO | notification.service đã đầy đủ |
| | **MODULE: Discovery** | | | |
| 36 | Gợi ý cho bạn | `docs/page/user_recommendations.md` · `screen/1_Guest/09-Goi_Y_Cho_Ban` | ⬜ TODO | Cần auth + history tracking |
| 37 | Chọn lịch khởi hành | `docs/page/user_tour_departure_select.md` · — | ⬜ TODO | Modal trong Tour Detail — BookingSidebar đã có 1 phần |
| | **MODULE: Planned Features** | | | |
| 38 | Giỏ hàng | `docs/page/user_cart.md` · *(thiếu prototype)* | 📋 PLANNED | Chưa có API backend |
| 39 | Landing Tour điểm đến | `docs/page/user_destination_tour_landing.md` · *(thiếu prototype)* | 📋 PLANNED | SEO landing page |
| | **System Pages** | | | |
| 40 | Settings | — | 🦴 SKELETON | Chỉ title, chưa rõ scope |
| 41 | User Dashboard | — | 🦴 SKELETON | Welcome message cơ bản |

---

## Lộ trình triển khai

```
Phase 1 — Booking Flow (P0):
  → #19 Đặt Tour
  → #20 Thanh toán
  → #21 Kết quả Thanh toán

Phase 2 — User Hub:
  → #25 Favorites
  → #22 Profile (hoàn thiện edit)
  → #23 Đổi mật khẩu

Phase 3 — Booking Management:
  → #26 DS Đơn đặt tour
  → #27 Chi tiết Đơn đặt

Phase 4 — Auth Complete:
  → #16 Quên mật khẩu
  → #17 Đặt lại mật khẩu
  → #18 Xác thực Email

Phase 5 — Engagement:
  → #35 Thông báo
  → #30 Đánh giá của tôi
  → #31-34 Rating components

Phase 6 — Discovery:
  → #7 ĐĐ theo Danh mục
  → #11 Tour theo Danh mục
  → #8 ĐĐ lân cận
  → #36 Gợi ý cho bạn
```
