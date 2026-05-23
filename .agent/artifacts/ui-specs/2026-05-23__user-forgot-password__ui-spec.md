# UI Spec: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Source analysis: [2026-05-23__user-forgot-password__screen-analysis.md](file:///D:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-23__user-forgot-password__screen-analysis.md)

---

## 1) Summary
- **Mục tiêu UI của feature:** Xây dựng một giao diện khôi phục mật khẩu công cộng hoàn chỉnh, đồng điệu, và sang trọng, kế thừa hoàn hảo ngôn ngữ thiết kế của các trang auth đi trước.
- **Bề mặt chính user tương tác:** 
  - Form nhập liệu địa chỉ email với validation tức thì (instant validation).
  - Nút Submit gửi yêu cầu phục hồi mật khẩu có hiệu ứng Loading vi mô.
  - Màn hình phản hồi thành công trung lập (Neutral Success state) thân thiện kèm nút gửi lại (Resend) và nút quay lại trang Đăng nhập.

## 1.1) UI Delivery Goal
- **Above-the-fold content:** 
  - Brand name `DaNangTrip` màu đồng `#8B6A55` sáng chữ.
  - Tiêu đề màn hình: `Quên mật khẩu?` / `Forgot password?` cỡ chữ lớn, nổi bật màu trắng.
  - Phụ đề (Subtitle): Dòng mô tả ngắn gọn định hướng người dùng.
  - Nhập liệu Email (Email Input) với biểu tượng Solar nét mảnh (linear).
- **Secondary/supporting UI:** 
  - Liên kết phụ điều hướng quay lại Đăng nhập có biểu tượng mũi tên lùi `IoChevronBack`.
  - Hiệu ứng viền xoay gradient conic quanh bề mặt card trên môi trường Desktop.
  - Hiệu ứng nền mờ chuyển động sâu lắng `AmbientBackground`.

---

## 2) Component Matrix
### [REUSE]
| Component | Path | Why reuse | Notes |
|---|---|---|---|
| `Input` | `src/components/ui/input.tsx` | Kế thừa input được thiết kế sẵn cho dự án. | Phục vụ nhập Email, có nhãn label và icon Solar đi kèm. |
| `AmbientBackground` | `src/components/layout/AmbientBackground.tsx` | Đồng bộ hóa hiệu ứng nền chuyển động của các trang Auth. | Dùng làm lớp nền mờ tối tinh tế. |

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `ForgotPasswordForm` | Organism | Xử lý toàn bộ logic hiển thị form khôi phục mật khẩu, các trạng thái validation, submit, success và đếm ngược gửi lại. | `interface ForgotPasswordFormProps { email?: string; }` |

### [MOD]
| Component | Path | Required change | Impact |
|---|---|---|---|
| `LoginForm` | `src/features/auth/components/login-form.tsx` | Cập nhật thuộc tính `href` của nút Quên mật khẩu từ `ROUTES.CONTACT` sang `ROUTES.FORGOT_PASSWORD`. | Giúp điều hướng người dùng chuẩn xác. |
| `src/features/auth/index.ts` | `src/features/auth/index.ts` | Thêm lệnh `export { ForgotPasswordForm } from "./components/forgot-password-form";` | Export tập trung (Barrel Export) giúp các trang Router dễ dàng import component sạch sẽ. |

---

## 3) UI States
| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| **Input Email** | N/A | Nhãn label và placeholder mặc định. | Khung input đổi viền đỏ, hiển thị nhãn lỗi tiếng Việt/tiếng Anh ở chân input. | Khung viền đổi sang màu đồng sáng dịu khi nhập đúng format. | Vô hiệu hóa tính năng nhập liệu khi API đang thực thi. |
| **Nút Gửi Link (Submit)** | Hiển thị Spinner SVG xoay tròn và chữ `Đang xử lý...` / `Processing...`. | N/A | N/A | Form chính bị ẩn đi để nhường chỗ cho giao diện Success. | Bị vô hiệu hóa khi Email rỗng, sai format hoặc đang gửi API. |
| **Giao diện Thành công** | N/A | N/A | N/A | Hiển thị card thông báo Success màu đồng nhạt, có nút bấm "Gửi lại" và nút "Quay lại Đăng nhập". | N/A |

## 3.1) Motion / Interaction Notes
| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| **Form Container (Desktop)** | Hiển thị bóng mờ nhẹ `#8B6A55` lan tỏa xung quanh card. | Hiệu ứng viền xoay gradient conic quay 360 độ (`conic-gradient(from 0deg, transparent 0 240deg, rgba(139,106,85,0.3) 300deg, #8B6A55 360deg)`) tốc độ spin 4s mượt mà. | Mang lại cảm giác cao cấp và chiều sâu thị giác (Wow factor). |
| **Input Email** | Khi Focus, viền chuyển đổi từ màu xám trung tính `#262626` sang màu đồng sáng `#8B6A55` kèm hiệu ứng transition 150ms. | N/A | Giúp người dùng biết trường đang được thao tác. |
| **Nút bấm Submit / Quay lại** | Hover: Màu nền tối hơn, viền sáng màu đồng nhạt `#c59a5f`, chữ chuyển nhẹ màu đồng, scale nhẹ 1.02. | Hiệu ứng `reveal-up` khi màn hình được tải lên (staggered delay). | Tạo cảm xúc tương tác nhạy bén khi rê chuột. |

---

## 4) Responsive Notes
| Breakpoint | Behavior | Notes |
|---|---|---|
| Mobile (<768px) | - Trải phẳng Form ra toàn màn hình.<br>- Giảm padding trong (`p-6` xuống `p-4`).<br>- Ẩn hoàn toàn hiệu ứng xoay gradient conic và viền ngoài để tăng hiệu suất hiển thị và tập trung tối đa diện tích cho Form nhập liệu. | Đảm bảo tính khả dụng cực kỳ cao ở thiết bị di động. |
| Tablet (768-1023px) | - Căn giữa card Form trên nền đen mờ.<br>- Bề rộng tối đa giới hạn ở `max-w-md` (450px).<br>- Chỉ hiển thị một panel chứa Form nhập. | Đạt sự cân đối và dễ quan sát. |
| Desktop (≥1024px) | - Bố cục 2 cột (Two-panel layout) đẳng cấp.<br>- Cột trái hiển thị gradient tối thương hiệu từ `#5C3822` về `#080808` với tiêu đề thương hiệu cực đẹp.<br>- Cột phải chứa Form đăng nhập/quên mật khẩu.<br>- Kích hoạt đầy đủ hiệu ứng xoay viền gradient conic. | Tạo trải nghiệm WOW sang trọng bậc nhất. |

---

## 5) Files Expected To Change
- `src/features/auth/index.ts`
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/forgot-password-form.tsx` [NEW]
- `src/app/[locale]/(auth)/forgot-password/page.tsx` [MODIFY - Tích hợp form hoàn chỉnh]

---

## 6) Build Order
1. **Atoms / Types:** Đã hoàn chỉnh (dùng `ForgotPasswordRequest`, `forgotPasswordSchema`, và service API có sẵn).
2. **Molecules (i18n):** Khai báo các tệp `forgot-password.json` đa ngôn ngữ tĩnh và đăng ký trong `src/i18n/request.ts` *(Đã làm hoàn tất ở Bước 04)*.
3. **Organisms:** Triển khai mã nguồn component `ForgotPasswordForm` tại `src/features/auth/components/forgot-password-form.tsx` hoàn thiện tất cả layout, state, responsive và interactions.
4. **Export:** Đăng ký export `ForgotPasswordForm` tại `src/features/auth/index.ts`.
5. **Page assembly:** Thay thế page shell tạm thời tại `src/app/[locale]/(auth)/forgot-password/page.tsx` để import và render component `ForgotPasswordForm`.
