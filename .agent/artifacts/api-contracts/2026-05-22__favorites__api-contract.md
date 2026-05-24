# Tài liệu Contract API: Địa điểm Yêu thích (favorites)

- **Feature Slug:** `favorites`
- **Ngày thiết lập:** 2026-05-22
- **Tình trạng:** Sẵn sàng kết nối
- **Base URL:** `/user/favorites`

---

## 1) Luồng nghiệp vụ & Endpoint chính

Hệ thống quản lý địa điểm yêu thích của người dùng thông qua 3 hành động chính:
1. **Lấy danh sách địa điểm yêu thích (GET):** Truy cập `/user/favorites` có phân trang.
2. **Thêm địa điểm vào danh sách yêu thích (POST):** Lưu địa điểm mới.
3. **Xóa địa điểm khỏi danh sách yêu thích (DELETE):** Hủy lưu địa điểm.

---

## 2) Chi tiết các Endpoint

### 2.1) Lấy danh sách yêu thích
- **Endpoint:** `GET /user/favorites`
- **Xác thực:** 🔐 Yêu cầu Header `Authorization: Bearer <token>`
- **Tham số Request Query (Query Params):**
  | Tham số | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
  |---------|--------------|----------|----------|-------|
  | `page` | `number` | Không | `1` | Số trang muốn tải |
  | `per_page` | `number` | Không | `12` | Số lượng phần tử mỗi trang |

- **Response thành công (`200 OK`):**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Success",
    "data": {
      "data": [
        {
          "id": 5,
          "location_id": 102,
          "tour_id": null,
          "created_at": "2026-05-22T08:00:00Z",
          "location": {
            "id": 102,
            "name": "Bán đảo Sơn Trà",
            "slug": "ban-dao-son-tra",
            "category_id": 2,
            "subcategory_id": null,
            "description": "Bán đảo Sơn Trà được mệnh danh là lá phổi xanh của thành phố Đà Nẵng...",
            "short_description": "Lá phổi xanh kỳ vĩ của Đà Nẵng",
            "address": "Phường Thọ Quang, Quận Sơn Trà, Đà Nẵng",
            "district": "Sơn Trà",
            "ward": "Thọ Quang",
            "latitude": "16.1205",
            "longitude": "108.2785",
            "price_min": 0,
            "price_max": 0,
            "price_level": 1,
            "thumbnail": "/images/sontra.jpg",
            "images": ["/images/sontra.jpg", "/images/sontra_2.jpg"],
            "avg_rating": "4.8",
            "review_count": 120,
            "created_at": "2026-05-01T00:00:00Z",
            "updated_at": "2026-05-15T00:00:00Z"
          }
        }
      ],
      "current_page": 1,
      "last_page": 3,
      "per_page": 12,
      "total": 30,
      "next_page_url": "/user/favorites?page=2&per_page=12",
      "prev_page_url": null,
      "first_page_url": "/user/favorites?page=1&per_page=12",
      "last_page_url": "/user/favorites?page=3&per_page=12"
    }
  }
  ```

---

### 2.2) Thêm địa điểm vào yêu thích (Dùng cho Hoàn tác)
- **Endpoint:** `POST /user/favorites`
- **Xác thực:** 🔐 Yêu cầu Header `Authorization: Bearer <token>`
- **Request Body (JSON):**
  ```json
  {
    "location_id": 102
  }
  ```
- **Response thành công (`200 OK` hoặc `201 Created`):**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Địa điểm đã được thêm vào danh sách yêu thích",
    "data": null
  }
  ```
- **Các mã lỗi có thể gặp:**
  - `401 Unauthorized`: Token không hợp lệ hoặc hết hạn.
  - `409 Conflict`: Địa điểm đã nằm trong danh sách yêu thích từ trước.
  - `404 Not Found`: Không tìm thấy `location_id` chỉ định.

---

### 2.3) Xóa địa điểm khỏi yêu thích
- **Endpoint:** `DELETE /user/favorites`
- **Xác thực:** 🔐 Yêu cầu Header `Authorization: Bearer <token>`
- **Request Body (JSON - Axios config `{ data }`):**
  ```json
  {
    "location_id": 102
  }
  ```
- **Response thành công (`200 OK`):**
  ```json
  {
    "success": true,
    "code": 200,
    "message": "Đã xóa địa điểm khỏi danh sách yêu thích",
    "data": null
  }
  ```
- **Các mã lỗi có thể gặp:**
  - `401 Unauthorized`: Token không hợp lệ hoặc hết hạn.
  - `404 Not Found`: Địa điểm này chưa từng được yêu thích hoặc không tồn tại.

---

## 3) Cách thức tích hợp Service layer (Frontend)

Service layer được định nghĩa thông qua `favoriteService` trong `src/services/favorite.service.ts`:

- **Đọc danh sách:**
  ```typescript
  const res = await favoriteService.getFavorites({ page: 1, per_page: 12 });
  if (res.success) {
    const list = res.data.data;
    const total = res.data.total;
  }
  ```

- **Xử lý Xóa Optimistic & Hoàn tác:**
  1. Khi người dùng click nút ❤️ (Xóa):
     - Xóa tạm thời thẻ đó khỏi state UI.
     - Hiển thị Toast thông báo với action "Hoàn tác".
     - Gửi ngay request `favoriteService.removeFavorite({ location_id })`.
  2. Nếu người dùng chọn "Hoàn tác" trên toast:
     - Gửi request `favoriteService.addFavorite({ location_id })`.
     - Sau khi thêm lại thành công, gọi `queryClient.invalidateQueries` để cập nhật lại danh sách.
  3. Nếu request xóa thất bại:
     - Khôi phục lại thẻ trong danh sách và hiện thông báo lỗi.
