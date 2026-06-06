# Deploy Report: User Search Hardening

> Feature slug: `user-search-hardening`
> Date: 2026-05-28
> Status: `READY`
> Target Platform: Cloudflare Pages (OpenNext)

---

## 1. Quality Gates & Build Status

Tất cả các kiểm tra Quality Gates thông qua script `npm run prepush:check` đã hoàn thành thành công 100% không gặp lỗi:

| Step | Command | Status | Notes |
|---|---|---|---|
| **ESLint** | `npm run lint` | **PASS** | 0 error, 12 warnings (các warning nằm ở code cũ có sẵn, không ảnh hưởng). |
| **TypeScript** | `npm run typecheck` | **PASS** | Hoàn tất type checking an toàn không lỗi. |
| **Route Integrity** | `npm run check:routes` | **PASS** | Xác thực thành công 29 active route entries. |
| **Next.js Production Build** | `npm run build` | **PASS** | Build hoàn tất thành công trong 15.4s, các page tĩnh và dynamic được sinh ra đúng cấu trúc. |

---

## 2. Performance & Bundle Size Analysis

- **Initial Client JS**: Đạt chuẩn (< 200KB gzipped).
- **Edge Runtime Compatibility**: Do dự án triển khai trên Cloudflare Pages sử dụng OpenNext và Edge Runtime, chúng ta đã tối ưu hóa các module nhập vào để đảm bảo không sử dụng bất kỳ thư viện Node.js API gốc (`fs`, `path`, v.v.) nào trong client/server components của trang tìm kiếm `/search`.
- **Suggestions Auto-complete API calls**: Sử dụng debounce **300ms** để giảm thiểu số lượng network request đến backend (`danangtrip-api`) khi người dùng gõ phím.
- **Client Search History**: Lưu trữ lịch sử tìm kiếm tối đa 5 items trong `localStorage` giúp tải nhanh chóng không cần thêm request lên cơ sở dữ liệu.
- **Interleaving Results**: Việc trộn xen kẽ kết quả tìm kiếm được thực hiện tuyến tính bằng javascript ở client-side (`O(N)`), không ảnh hưởng đến hiệu năng tải trang.

---

## 3. Smoke Test Results

Các kịch bản smoke test đã được kiểm thử cục bộ:
1. **Trang Tìm kiếm chính (`/vi/search` & `/en/search`)**: Load bình thường, dữ liệu skeleton hiển thị mượt mà trước khi có danh sách thực tế.
2. **Trộn xen kẽ kết quả (Interleave) ở tab "Tất cả"**:
   - Khi chưa nhập từ khóa (Discovery Section): Hiển thị xen kẽ 3 tour nổi bật nhất và 3 địa điểm nổi bật nhất trong top 6.
   - Khi có từ khóa tìm kiếm (ví dụ "Bà"): Hiển thị xen kẽ kết quả tour và địa điểm (không còn tình trạng địa điểm lấn át toàn bộ trang đầu do viewCount lớn hơn nhiều so với bookingCount của tour).
3. **Autocomplete Suggestions**:
   - Khi nhập từ 2 ký tự (ví dụ "bà"), dropdown hiển thị danh sách địa danh khớp từ backend.
   - Nhấp vào một gợi ý thành công kích hoạt tìm kiếm và cập nhật thanh URL query parameters (`?q=bà`).
4. **Lịch sử tìm kiếm (Search History)**:
   - Hiển thị danh sách từ khóa cũ khi input được focus và chuỗi nhập rỗng.
   - Nút xóa nhanh lịch sử hoạt động chính xác.
5. **Bộ lọc danh mục (Category Filters Drawer)**:
   - Ẩn phần chọn Danh mục khi đang ở tab "Tất cả" (để tránh mapping sai ID danh mục giữa Tour và Địa điểm).
   - Hiển thị danh mục tương ứng khi ở tab "Địa điểm" hoặc "Tour".
6. **Console Log**: Không có lỗi runtime hay network request bị lỗi nào ghi nhận trên trình duyệt.

---

## 4. Deploy Readiness Verdict

- **Verdict:** **READY**
- **Risks:** Không có rủi ro lớn. Thuật toán trộn xen kẽ hoạt động ổn định và giải quyết triệt tốt vấn đề mất cân bằng hiển thị giữa Tour và Địa điểm ở chế độ "Tất cả".
- **Action:** Đã sẵn sàng deploy và push code.
