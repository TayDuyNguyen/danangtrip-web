# UI Spec: Xác thực Email (Email Verification)

> Feature slug: `user-verify-email`
> Date: 2026-05-22
> Source analysis: [2026-05-22__user-verify-email__screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-22__user-verify-email__screen-analysis.md)

---

## 1) Summary
- **Mục tiêu UI:** Xây dựng màn hình xác thực tài khoản qua email để người dùng hoàn tất quá trình đăng ký hoặc xác thực bổ sung. Hỗ trợ 2 chế độ hiển thị linh hoạt: tự động xác thực khi có token URL và nhập mã OTP thủ công.
- **Bề mặt chính tương tác:** Center card thiết kế theo phong cách Glassmorphism đồng nhất với trang Login/Register, bao gồm 6 ô nhập mã OTP và nút nhấn gửi lại mã xác thực có đếm ngược.

## 1.1) UI Delivery Goal
- **Above-the-fold content:** Card trung tâm hiển thị tiêu đề động (Đang xác thực / Nhập mã OTP / Xác thực thành công / Xác thực thất bại), phần thông báo trạng thái, và nhóm ô nhập OTP 6 chữ số.
- **Secondary/supporting UI:** Nhóm nút hành động hỗ trợ (Gửi lại email xác thực kèm countdown 60s, nút "Quay lại trang chủ" hoặc "Thử lại").

## 2) Component Matrix
### [REUSE]
| Component | Path | Why reuse | Notes |
|---|---|---|---|
| `AmbientBackground` | `src/components/layout/AmbientBackground.tsx` | Nền canvas hạt WebGL chuyển động chậm để tạo độ sâu cho giao diện tối. | Đã tích hợp ở layout bao ngoài của `(auth)`. |
| `Link` | `src/i18n/navigation` | Chuyển hướng giữa các locale mà không làm mất trạng thái ngôn ngữ. | Dùng cho nút quay lại trang chủ / trang đăng nhập. |
| `IoMailOutline`, `IoCheckmarkCircleOutline`, `IoAlertCircleOutline` | `src/components/icons/solar.tsx` | Sử dụng bộ biểu tượng Solar nhất quán theo `DESIGN.md`. | Dùng làm icon trang trí cho các trạng thái thành công, lỗi, và gửi mail. |

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `VerifyEmailForm` | Organism | Quản lý khối giao diện trung tâm, nhận diện chế độ tự động hay thủ công, xử lý trạng thái API (loading/success/error) và countdowns. | `{ token?: string; email?: string; }` |
| `OtpInputGroup` | Molecule | Nhóm 6 ô input số chuyên dụng cho OTP, hỗ trợ tự động focus, xóa ngược bằng backspace, dán (paste) chuỗi và kích hoạt submit. | `{ value: string; onChange: (val: string) => void; error?: boolean; disabled?: boolean; }` |

### [MOD]
| Component | Path | Required change | Impact |
|---|---|---|---|
| `verify-email/page.tsx` | `src/app/[locale]/(auth)/verify-email/page.tsx` | Chuyển từ render placeholder sang render `VerifyEmailForm` thực tế kèm props truyền từ `searchParams`. | Đã được setup và sẵn sàng chạy khi form hoàn tất. |

## 3) UI States
| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| `VerifyEmailForm` (Auto-verify) | Hiển thị spinner và văn bản "Đang xác thực email..." | N/A | Khung thông báo lỗi màu đỏ nhạt, kèm mô tả lý do và nút bấm chuyển sang nhập OTP thủ công. | Khung thông báo thành công màu xanh lá nhạt kèm countdown 3 giây tự chuyển hướng. | Vô hiệu hóa nút và input khi đang gọi API xác thực. |
| `VerifyEmailForm` (OTP Form) | Hiển thị icon xoay tại nút bấm chính "Xác thực". | N/A | Hiển thị Toast thông báo lỗi của API dưới góc màn hình. | Hiển thị khung thông báo thành công của card. | Vô hiệu hóa các ô nhập liệu và nút bấm. |
| `OtpInputGroup` | N/A | N/A | 6 ô viền chuyển đỏ `#EF4444` và hiệu ứng rung nhẹ. | N/A | opacity-40, không cho phép nhập liệu hay click. |
| Resend Button | N/A | N/A | Hiển thị Toast lỗi gửi lại. | Hiển thị Toast thành công và kích hoạt bộ đếm ngược 60s. | Trở thành nhãn đếm ngược "Gửi lại sau 45s", màu chữ xám mờ. |

## 3.1) Motion / Interaction Notes
| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| `VerifyEmailForm` Card | N/A | `reveal-up` (fade-in & slide-up) khi mount vào DOM. | Tạo cảm giác nhẹ nhàng, mượt mà. |
| OTP Input | Viền đổi màu từ `#262626` sang `#8B6A55`, hiệu ứng ring-1 phát sáng nhẹ. | N/A | Giúp nhận diện ô đang nhập dễ dàng. |
| Nút hành động | Phóng to nhẹ (`scale-[1.02]`), đổi màu viền sáng lên, chuyển đổi opacity. | Transition 200ms ease-in-out. | Nâng cao cảm nhận phản hồi vật lý. |
| Khung viền phát sáng | N/A | Conic gradient xoay tròn vô hạn ở nền viền (`spin 4s linear infinite`). | Đồng bộ hiệu ứng viền phát sáng động với trang đăng nhập. |

## 4) Responsive Notes
| Breakpoint | Behavior | Notes |
|---|---|---|
| Mobile (<768px) | Card chiếm toàn bộ chiều ngang (`w-full`), loại bỏ viền gradient xoay để tiết kiệm pin/CPU di động. Background chuyển sang màu tối `#080808` thuần túy. | OTP input tự động co giãn (`w-10 h-12`), khoảng cách gap-2. |
| Tablet (768px - 1023px) | Card thu gọn về kích thước tối đa (`max-w-md`), căn giữa màn hình. Hiển thị viền gradient xoay nhẹ. | OTP input kích thước trung bình (`w-12 h-14`), gap-3. |
| Desktop (≥1024px) | Card căn giữa hoàn hảo, hỗ trợ hiển thị toàn bộ chiều sâu 3D trên nền Canvas WebGL. | Trải nghiệm tối đa các hiệu ứng bóng mờ (glassmorphism) và viền động. |

## 5) Files Expected To Change
- `src/features/auth/components/verify-email-form.tsx` (Viết lại toàn bộ)
- `src/features/auth/components/otp-input-group.tsx` (Đã khởi tạo, kiểm tra viền focus/error)
- `src/features/auth/index.ts` (Export các component mới)

## 6) Build Order
1. **Atoms:** Chỉnh sửa bổ sung/kiểm thử style cho các ô input trong `OtpInputGroup`.
2. **Molecules:** Tối ưu hóa `OtpInputGroup` và kiểm tra phản hồi sự kiện paste.
3. **Organisms:** Hoàn thiện `VerifyEmailForm` tích hợp đầy đủ các khối giao diện: Loading, OTP, Success, Failure.
4. **Page assembly:** Kết nối `VerifyEmailForm` vào `src/app/[locale]/(auth)/verify-email/page.tsx` và thực hiện build thử.
