# Auth & Permissions Review: user-forgot-password

> Feature slug: `user-forgot-password`
> Date: 2026-05-23
> Route scope: `/forgot-password`

---

## 1) Protected Routes
| Route | Middleware Needed | Redirect Behavior | Notes |
|---|---|---|---|
| `/forgot-password` | **Bypass** (Không bảo vệ bằng token) | Người dùng chưa đăng nhập: Xem bình thường.<br>Người dùng đã đăng nhập (có token cookie): Chuyển hướng tự động về trang chủ `/` hoặc `/en`. | Tuyến đường này được định nghĩa thuộc nhóm `authRoutes` công cộng. Chuyển hướng người dùng đã đăng nhập ngăn ngừa việc thực thi quy trình khôi phục mật khẩu không cần thiết. |

---

## 2) Role Matrix
| Role | View | Create | Update | Delete | Notes |
|---|---|---|---|---|---|
| **guest (Khách)** | ✓ | ✓ | N/A | N/A | Khách chưa đăng nhập là actor chính của màn hình này, được phép gửi yêu cầu tạo liên kết đặt lại mật khẩu. |
| **user (Thành viên)** | ✗ | ✗ | N/A | N/A | Bị Middleware chặn và chuyển hướng về trang chủ khi truy cập trang này. |
| **admin (Quản trị)** | ✗ | ✗ | N/A | N/A | Bị Middleware chặn tương tự thành viên thông thường. |

## 2.1) Action Matrix
| Action | Allowed Role(s) | UI Behavior | Backend Expectation | Notes |
|---|---|---|---|---|
| **Gửi email khôi phục** | guest (Khách chưa auth) | Điền form email -> Submit thành công -> Nhận giao diện thông báo trung lập. | `POST /auth/forgot-password` không kiểm tra Access Token. | Hoàn toàn công khai. |

---

## 3) Guarded UI Actions
| UI Element | Visible To | Why |
|---|---|---|
| **Form Quên Mật Khẩu** | guest | Chỉ khách chưa đăng nhập mới cần nhìn thấy form khôi phục mật khẩu. |
| **Liên kết Đăng nhập** | guest | Khách có thể chủ động chuyển hướng quay lại trang Đăng nhập bất cứ lúc nào. |

## 3.1) Hidden vs Disabled Decisions
| UI Element | Hidden or Disabled | Reason | Risk |
|---|---|---|---|
| **Nút Submit Form** | **Disabled** | Bị vô hiệu hóa khi email trống, nhập sai format hoặc khi API đang gọi bất đồng bộ. | Tránh người dùng bấm gửi liên tục (Spam) gây overload máy chủ. |
| **Nút Gửi Lại (Resend)** | **Disabled** (trong 60 giây Cooldown) | Bị vô hiệu hóa và đếm ngược giây khi vừa gửi thành công. | Ngăn chặn hành vi spam email liên tục. |

---

## 4) Risks / Assumptions
- **[ASSUMPTION] A-01:** Phân quyền và kiểm tra cookie token tại Edge Middleware hoạt động nhanh nhạy, đồng bộ hoàn hảo với js-cookie ở phía client.
- **R-01 (Bypass Interceptor):** Tuyến đường API `/auth/forgot-password` phải được loại bỏ khỏi cơ chế chèn Bearer token của Axios interceptor. *(Đã kiểm tra thực tế: File `src/lib/axios.ts` đã khai báo bypass thành công, rủi ro bằng 0).*

---

## 5) Files / Areas Affected
- `src/middleware.ts` (Đã cập nhật chặn tuyến đường)
- `src/lib/axios.ts` (Đã đối chiếu bypass auth)
- `src/features/auth/components/forgot-password-form.tsx` (Đã kiểm tra giao diện phân quyền)
