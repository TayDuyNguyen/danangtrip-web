# Tài liệu Cấu trúc Định tuyến: Địa điểm Yêu thích (favorites)

- **Feature Slug:** `favorites`
- **Ngày thiết lập:** 2026-05-22
- **Tình trạng:** Đã thiết lập Route Shell

---

## 1) Cấu trúc File & Thư mục

Route `/favorites` được định nghĩa trong App Router của Next.js dưới nhóm tuyến đường được bảo vệ `(protected)`:

```
src/app/[locale]/(main)/(protected)/favorites/
└── page.tsx (Server Component - Entry Point)
```

Sử dụng phân cấp này giúp trang tự động thừa hưởng cơ chế bảo vệ đăng nhập từ `src/app/[locale]/(main)/(protected)/layout.tsx`.

---

## 2) Đăng ký & Bảo vệ Tuyến đường

### 2.1) Hằng số Route
Định nghĩa route trong [routes.ts](file:///D:/DATN/danangtrip-web/src/config/routes.ts):
```typescript
export const PROTECTED_ROUTES = {
  ...
  FAVORITES: "/favorites",
} as const;
```

### 2.2) Middleware Guard
Mọi request truy cập `/favorites` (hoặc các ngôn ngữ như `/vi/favorites`, `/en/favorites`) đi qua `middleware.ts`. Vì nằm trong nhóm tuyến đường protected, nếu người dùng chưa đăng nhập, hệ thống sẽ thực hiện redirect:
```
GET /favorites -> Redirect -> /login?callbackUrl=%2Ffavorites
```

---

## 3) Quản lý Locale & SEO Metadata

Do trang hỗ trợ đa ngôn ngữ, chúng tôi sử dụng `next-intl` để quản lý việc tải động các cặp ngôn ngữ.

### 3.1) Đăng ký Locale Namespace
Để tối ưu hóa việc phân tách gói bundle trên Cloudflare Workers, file ngôn ngữ được import tĩnh tại [request.ts](file:///D:/DATN/danangtrip-web/src/i18n/request.ts):
- [vi/favorites.json](file:///D:/DATN/danangtrip-web/src/messages/vi/favorites.json)
- [en/favorites.json](file:///D:/DATN/danangtrip-web/src/messages/en/favorites.json)

### 3.2) SEO Metadata
Trang định nghĩa hàm `generateMetadata` bất đồng bộ để thiết lập tiêu đề và mô tả động tương ứng với ngôn ngữ đang xem:
- **Tiếng Việt:**
  - Tiêu đề: *Địa điểm yêu thích*
  - Mô tả: *Quản lý danh sách địa điểm du lịch yêu thích của bạn tại Đà Nẵng.*
- **Tiếng Anh:**
  - Tiêu đề: *Favorite Locations*
  - Mô tả: *Manage your favorite travel locations in Da Nang.*

---

## 4) Kiểm thử Định tuyến (Routing Verification)

- **Trường hợp Khách vãng lai:**
  1. Truy cập `http://localhost:3000/favorites`
  2. Kỳ vọng: Redirect về trang đăng nhập với callback url chính xác.
- **Trường hợp Đã đăng nhập:**
  1. Truy cập `http://localhost:3000/favorites`
  2. Kỳ vọng: Hiển thị trang Yêu thích mà không bị chặn, tiêu đề tab khớp với ngôn ngữ được thiết lập.
