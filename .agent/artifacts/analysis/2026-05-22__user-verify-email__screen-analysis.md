# Screen Analysis: Xác thực Email (Email Verification)

> Feature slug: `user-verify-email`
> Date: 2026-05-22
> Figma: N/A (Based on SRS document `user_verify_email.md` & `DESIGN.md` theme mapping)

---

## 1) Summary
- **Mục đích:** Xác thực địa chỉ email của người dùng sau khi đăng ký tài khoản hoặc khi yêu cầu xác thực lại. Người dùng có thể tự động xác thực khi bấm vào link có chứa token từ email, hoặc nhập mã OTP 6 số thủ công ngay tại giao diện.
- **Ai là người dùng chính?** Người dùng chưa xác thực email (có link token) hoặc người dùng đã đăng nhập nhưng chưa xác thực email (nhập OTP thủ công).
- **Thuộc feature/module nào?** Xác thực tài khoản / Bảo mật (`auth`).
- **Source inputs nào đã dùng?** `user_verify_email.md`, `auth.service.ts`, `auth.types.ts`, `DESIGN.md`.

## 2) Design Token Audit
| Token | Figma/SRS Value | DESIGN.md Value | Match? | Note |
|---|---|---|---|---|
| Primary color | `#0066CC` | `#8B6A55` | ✗ No | Thay thế tông màu xanh dương của SRS bằng màu thương hiệu `#8B6A55` của dự án (viền focus, nút bấm chính, active link). |
| Secondary color | N/A | `#5C3822` | N/A | Sử dụng cho hiệu ứng nền gradient và các điểm nhấn phụ. |
| Neutral/Background | `white` | `#080808` | ✗ No | Switch hoàn toàn sang nền tối `#080808` kết hợp canvas hạt bụi mờ bay chậm `<AmbientBackground />` tạo cảm giác sang trọng. |
| Surface (Card) | `white`, radius-16 | `#080808` / `#030303` | ✗ No | Center card sử dụng Glassmorphism nền tối, viền mỏng `#262626`, bo góc tròn `7px` (hoặc `8px`/`12px`), có conic gradient phát sáng động. |
| Border | `#E2E8F0` | `#262626` | ✗ No | Tất cả các viền (của card và ô nhập OTP) mặc định dùng màu `#262626`, khi focus chuyển sang `#8B6A55`. |
| Typography | Inter | Inter & SFMono-Regular | ✓ Yes | Ghép cặp phong cách Inter (cho nhãn, đề mục) và SFMono-Regular (cho mã số OTP hoặc text phụ). |
| Spacing | `p-32`, `mt-80px` | `base: 4px`, gaps: `8px`/`12px`/`16px` | ✗ No | Căn chỉnh các khoảng cách padding và gap của Card theo nhịp độ bội số 4px trong DESIGN.md (24px/16px). |
| Corner radius | `radius-12`, `radius-16` | `4px`, `7px`, `8px`, `12px`, `9999px` | ✗ No | Nút bấm chính bo tròn hoàn toàn `rounded-full` (`9999px`), ô nhập OTP bo `8px`/`12px`, Card bo `7px`/`8px`. |
| Shadow/Blur | `shadow-card` | Blur `12px`, gradient shell | ✗ No | Bỏ shadow thông thường, dùng hiệu ứng kính mờ (backdrop-blur) kèm khung viền mỏng chuyển màu gradient (gradient border shell). |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|---|---|---|---|
| `AmbientBackground` | `src/components/layout/AmbientBackground.tsx` | ✗ Không | Canvas hạt WebGL/2D làm nền động phía sau card xác thực để tạo chiều sâu đồng bộ với các trang auth khác. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer (Atom/Molecule/Organism) | Props interface |
|---|---|---|---|
| `VerifyEmailForm` | Khối Center Card chính quản lý toàn bộ giao diện và logic của trang xác thực email (Tự động verify bằng token từ URL, Form nhập mã OTP thủ công, Thông báo thành công kèm countdown, Thông báo thất bại, Gửi lại mã). | Organism | `{ token?: string, email?: string }` |
| `OtpInputGroup` | Nhóm 6 ô input số OTP chuyên dụng, hỗ trợ auto-focus, backspace di chuyển tiêu điểm, paste chuỗi số và submit tự động. | Molecule | `{ value: string, onChange: (val: string) => void, error?: boolean, disabled?: boolean }` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|---|---|---|---|
| `routes.ts` | `src/config/routes.ts` | Thêm định nghĩa `VERIFY_EMAIL: "/verify-email"` vào `AUTH_ROUTES`. | Đã chỉnh sửa (Verify). Đảm bảo định tuyến đồng bộ trên toàn hệ thống. |
| `middleware.ts` | `src/middleware.ts` | Cho phép `/verify-email` truy cập công khai (kể cả khi không có cookie token) vì người dùng click link email thường chưa đăng nhập trên thiết bị đó. Tuy nhiên, nếu user đã đăng nhập mà email chưa xác thực thì vẫn cho phép vào để nhập OTP. Do đó, cần thêm `/verify-email` vào danh sách ngoại lệ hoặc route xử lý linh hoạt. | Đảm bảo tính khả dụng của link email. |
| `request.ts` (i18n) | `src/i18n/request.ts` | Nhập khẩu tĩnh `verify-email.json` của cả 2 ngôn ngữ và đăng ký vào messages map. | Đã chỉnh sửa (Verify). Hỗ trợ i18n cho route mới. |
| `verify-email.json` (i18n) | `src/messages/vi/verify-email.json`, `en/verify-email.json` [NEW] | Tạo file bản dịch cho toàn bộ nhãn, thông báo và trạng thái của màn hình này. | Đã tạo (Verify). Bản dịch sẵn sàng hoạt động. |
| `verify-email/page.tsx` | `src/app/[locale]/(auth)/verify-email/page.tsx` [NEW] | Khởi tạo trang Server Component hứng các tham số query `token` và `email` từ URL, render `VerifyEmailForm`. | Đã tạo (Verify). Hướng định tuyến chính xác trong App Router. |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|---|---|---|
| Desktop (≥1024px) | Center card nổi bật ở giữa với lớp viền phát sáng động (conic gradient) | Baseline |
| Tablet (768-1023px) | Center card nổi bật ở giữa, kích thước thu gọn nhẹ | Giữ nguyên tỷ lệ, padding điều chỉnh cho vừa màn hình máy tính bảng |
| Mobile (<768px) | Center card chiếm toàn bộ chiều rộng (`w-full`), lề `px-4`, background phủ mờ | Bỏ viền phát sáng động dạng conic để tối ưu phần cứng di động, OTP Input tự dãn cách hợp lý. |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|---|---|---|---|---|---|---|
| **Auto-verify (URL Token)** | Spinner xoay tròn chính giữa card kèm dòng chữ "Đang xác thực email..." | N/A | Chuyển sang card thất bại kèm lý do tương ứng (hết hạn, sai token) | Chuyển sang card thành công và bắt đầu countdown | N/A | N/A |
| **OTP Input Form** | N/A | N/A | Viền 6 ô input đổi màu đỏ `#EF4444` | Khi nhập đủ 6 số, kích hoạt tự động submit | Khóa không cho sửa khi đang gọi API | Viền ô focus đổi sang màu nhấn `#8B6A55` |
| **Gửi lại mã (Resend)** | Hiển thị trạng thái đang gửi | N/A | Hiển thị Toast thông báo lỗi | Hiển thị Toast thành công và chạy countdown khóa nút bấm | Nút "Gửi lại" hiển thị dạng countdown giây đếm ngược màu xám, không click được | Khi hết countdown, nút có hover gạch chân màu nhấn `#8B6A55` |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|---|---|---|---|---|---|
| `token` | `string` | ✗ Optional | Không trống (nếu truyền) | `eyJhbGciOiJIUzI1Ni...` | URL search params (`?token=`) |
| `email` | `string` | ✗ Optional | Đúng định dạng email (nếu truyền) | `user@example.com` | URL search params (`?email=`) |
| `code` | `string` | ✗ Optional | Chuỗi 6 chữ số (`/^\d{6}$/`) | `123456` | OTP Input form |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|---|---|---|---|---|---|
| POST | `/auth/verify-email` | ✗ Không bắt buộc | `{ token?: string, code?: string }` | `ApiResponse<unknown>` | `400 Bad Request` (Token/Code không hợp lệ hoặc hết hạn) |
| POST | `/auth/resend-verification` | 🔐 Có (JWT cookie) | `{ email?: string }` (hoặc lấy từ phiên đăng nhập hiện tại) | `ApiResponse<unknown>` | `400 Bad Request` / `401 Unauthorized` |

## 8) Business Rules
- **BR-01 (Auto-submit):** Khi điền đủ 6 ký tự số vào form OTP, hệ thống sẽ tự động gọi mutation xác thực mà không cần user bấm nút "Xác thực".
- **BR-02 (Resend Limit):** Nút "Gửi lại email" chỉ được bấm sau mỗi 60 giây. Trong thời gian đếm ngược, nút sẽ bị disable và hiển thị thời gian còn lại (ví dụ: "Gửi lại sau 45s").
- **BR-03 (Tự động chuyển hướng):** Sau khi xác thực thành công, hệ thống hiển thị thông báo thành công và đếm ngược tự động chuyển hướng về trang chủ `/` (hoặc `/login` nếu chưa có phiên đăng nhập) sau 3 giây.
- **BR-04 (URL Token Priority):** Nếu URL có chứa tham số `token`, giao diện sẽ lập tức bỏ qua màn hình nhập OTP và tiến hành tự động xác thực bằng token. Chỉ khi không có token, màn hình nhập OTP mới hiển thị.

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|---|---|---|---|
| **Public Guest** | Truy cập màn hình qua link email, tự động xác thực bằng token URL. | Xem trang nhập OTP thủ công cho email cụ thể (nếu không có email/token trong URL hoặc không đăng nhập). | Sử dụng token URL làm khóa bảo mật chính. |
| **Logged-in Unverified User** | Truy cập `/verify-email` để xem form nhập OTP thủ công, nhập OTP, yêu cầu gửi lại email xác thực. | Đăng nhập/xem các trang bảo mật nâng cao khác (nếu middleware bắt buộc email đã được verify trước khi vào). | Sử dụng cookie JWT của phiên đăng nhập hiện tại để tự động gọi resend. |

## 10) Edge Cases
- **EC-01 (Người dùng paste mã OTP dài hoặc chứa chữ):** Người dùng sao chép mã OTP từ email rồi dán vào ô đầu tiên. <br>*Giải pháp:* Bắt sự kiện `onPaste`, lọc ra chỉ giữ các ký tự số, lấy đúng 6 chữ số đầu tiên và điền tự động vào 6 ô input, kích hoạt tự động submit.
- **EC-02 (Link xác thực hết hạn hoặc dùng rồi):** Người dùng bấm vào link email cũ đã hết hạn. <br>*Giải pháp:* Hiển thị màn hình Xác thực thất bại kèm thông báo rõ ràng "Mã xác thực đã hết hạn hoặc không hợp lệ" và nút để người dùng thử nhập OTP thủ công hoặc quay về.
- **EC-03 (Token email sai định dạng):** URL chứa token giả mạo hoặc trống. <br>*Giải pháp:* Hiển thị lỗi xác thực thất bại, hướng dẫn người dùng kiểm tra hòm thư hoặc đăng nhập lại để nhận mã mới.

## 11) Assumptions & Open Questions
### Assumptions
- **[ASSUMPTION] A-01:** API `/auth/verify-email` chấp nhận cả `token` (chuỗi dài từ link) và `code` (mã OTP 6 số) thông qua cùng một payload gửi lên.
- **[ASSUMPTION] A-02:** Người dùng khi click link xác thực từ email có thể không có phiên đăng nhập (session cookie) trên trình duyệt hiện tại. Do đó, API xác thực bằng `token` phải hoạt động không cần Header Authorization JWT.

### Open Questions
- *Không có.*

## 12) Implementation Checklist
- [x] Types & API contract (`VerifyEmailRequest`, `VerifyEmailSchema`, Zod schema, authService methods)
- [x] Route & layout setup (`/verify-email` route, metadata translation configurations, scaffolding `/verify-email/page.tsx`)
- [ ] UI components:
  - [ ] `OtpInputGroup` (keyboard focus, backspace, paste handler)
  - [ ] `VerifyEmailForm` (glassmorphic card, sub-views for loading/otp/success/failure/already-verified)
- [ ] Data integration:
  - [ ] Wire React Query mutations for verify email (`useMutation`)
  - [ ] Wire React Query mutation for resend email
- [ ] Interactions:
  - [ ] OTP auto-submit
  - [ ] Countdown timer for redirection (3s)
  - [ ] Resend email lockout counter (60s)
  - [ ] Toast notification integration
- [ ] Auth/permissions (ensure middleware.ts handles public vs protected access correctly)
- [ ] Testing & verification (`prepush:check`, lint, typecheck, build validation)

## 13) Files / Areas Likely To Change
- `src/config/routes.ts`
- `src/middleware.ts`
- `src/i18n/request.ts`
- `src/messages/vi/verify-email.json`
- `src/messages/en/verify-email.json`
- `src/app/[locale]/(auth)/verify-email/page.tsx`
- `src/features/auth/components/otp-input-group.tsx`
- `src/features/auth/components/verify-email-form.tsx`
- `src/features/auth/index.ts`
