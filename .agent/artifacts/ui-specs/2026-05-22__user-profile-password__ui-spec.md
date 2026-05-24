# UI Spec: Đổi mật khẩu (user-profile-password)

> Feature slug: `user-profile-password`
> Date: 2026-05-22
> Source analysis: [.agent/artifacts/analysis/2026-05-22__user-profile-password__screen-analysis.md](file:///d:/DATN/danangtrip-web/.agent/artifacts/analysis/2026-05-22__user-profile-password__screen-analysis.md)

---

## 1) Summary
- **Mục tiêu UI**: Xây dựng biểu mẫu đổi mật khẩu an toàn, trực quan, hỗ trợ đo độ mạnh mật khẩu và checklist điều kiện thời gian thực.
- **Bề mặt tương tác chính**: Biểu mẫu Đổi mật khẩu đặt trong Layout hồ sơ chia sẻ mới (gồm Sidebar định hướng và Breadcrumbs).

## 1.1) UI Delivery Goal
- **Above-the-fold content**: Trường nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới, cùng bộ công cụ trực quan đo độ mạnh mật khẩu.
- **Secondary/supporting UI**: Sidebar chứa menu chuyển hướng nhanh giữa các trang cài đặt tài khoản (`Hồ sơ`, `Đổi mật khẩu`, `Yêu thích`, `Thông báo`, `Đơn đặt tour`), và Breadcrumbs phía trên.

## 2) Component Matrix

### [REUSE]
| Component | Path | Why reuse | Notes |
|---|---|---|---|
| `Input` | `src/components/ui/Input.tsx` | Ô nhập mật khẩu có sẵn nút toggle ẩn/hiện mật khẩu và dịch thuật nhãn | Atom |
| `Button` | `src/components/ui/Button.tsx` | Nút có hiệu ứng nhấn active và hỗ trợ trạng thái loading xoay tròn | Atom |

### [NEW]
| Component | Layer | Purpose | Expected Props |
|---|---|---|---|
| `ProfileSidebar` | Molecule | Sidebar hiển thị thông tin người dùng và danh sách menu điều hướng | Không có props (sử dụng hook `useAuthStore` và `usePathname`) |
| `ProfileLayoutWrapper` | Organism | Cấu trúc layout 2 cột chia sẻ, tích hợp Breadcrumb | `{ children: React.ReactNode, activeSlug: string }` |
| `PasswordChangeForm` | Organism | Biểu mẫu đổi mật khẩu đầy đủ, bao gồm đo độ mạnh và checklist thời gian thực | Không có props (quản lý state nội bộ) |

### [MOD]
| Component | Path | Required change | Impact |
|---|---|---|---|
| `ProfilePage` | `src/app/[locale]/(main)/(protected)/profile/page.tsx` | Bọc phần giao diện cũ bên trong `ProfileLayoutWrapper` | Giao diện trang cá nhân có sidebar đồng bộ thay vì hiển thị toàn trang đơn lẻ. |

---

## 3) UI States
| Component | Loading | Empty | Error | Success | Disabled |
|---|---|---|---|---|---|
| `PasswordChangeForm` | Nút "Đổi mật khẩu" hiển thị spinner | N/A | Lỗi validate trường hoặc API hiển thị dưới trường tương ứng | Toast thông báo thành công và form reset | Nút Đổi mật khẩu bị vô hiệu hóa khi form không hợp lệ hoặc đang gửi |
| `ProfileSidebar` | Skeletons cho Avatar và tên (khi đang fetch profile nếu cần) | N/A | N/A | N/A | N/A |

## 3.1) Motion / Interaction Notes
| Component | Hover / Focus | Reveal / Motion | Notes |
|---|---|---|---|
| Input Fields | Border dưới chuyển sang màu `#8B6A55` khi focus | Label trượt nhẹ đi lên (`-translate-y-1 opacity-0` thành `translate-y-0 opacity-100`) | Sử dụng CSS transition mặc định của component `Input` |
| Sidebar Items | Chữ chuyển sang trắng, nền hover nhẹ `bg-white/5` | Smooth transition màu sắc | Có hiệu ứng gạch màu `#8B6A55` ở cạnh bên trái khi active |
| Password Strength Segments | N/A | Màu sắc các đoạn thay đổi trực quan tùy thuộc độ phức tạp mật khẩu | Chuyển đổi màu sắc mượt mà thông qua Tailwind transition |
| Submit Button | Border chuyển sang màu `#8B6A55`, chữ chuyển `#8B6A55` | Motion nhấn nhẹ `active:scale-95` | Kế thừa từ `Button.tsx` |

---

## 4) Responsive Notes
| Breakpoint | Behavior | Notes |
|---|---|---|
| Mobile (< 768px) | Layout 1 cột. Sidebar chuyển thành thanh điều hướng nằm ngang dạng tab cuộn ngang (Horizontal scroll tabs) phía trên tiêu đề trang. | Đảm bảo UX tốt nhất trên màn hình hẹp, không che khuất màn hình. |
| Tablet (768px - 1024px) | Layout 1 cột tương tự Mobile hoặc Sidebar gọn gàng xếp trên card chính. | Padding được thu hẹp về `p-6` để vừa vặn. |
| Desktop (>= 1024px) | Layout 2 cột rõ ràng. Cột trái là Sidebar (rộng 250px), cột phải là nội dung form (flex-1). | Sử dụng container `max-w-6xl` căn giữa trang. |

---

## 5) Files Expected To Change
- `src/app/[locale]/(main)/(protected)/profile/password/page.tsx` [NEW]
- `src/features/profile/components/ProfileSidebar.tsx` [NEW]
- `src/features/profile/components/ProfileLayoutWrapper.tsx` [NEW]
- `src/features/profile/components/PasswordChangeForm.tsx` [NEW]
- `src/app/[locale]/(main)/(protected)/profile/page.tsx` [MODIFY]

## 6) Build Order
1. **Atoms**: Tái sử dụng `Input`, `Button` hiện có.
2. **Molecules**: Xây dựng `ProfileSidebar` hiển thị thông tin người dùng và định hướng.
3. **Organisms**: Xây dựng `ProfileLayoutWrapper` (Breadcrumbs + cấu trúc layout) và `PasswordChangeForm` (logic kiểm tra độ mạnh, checklist).
4. **Page assembly**:
   - Gắn `PasswordChangeForm` vào trang `/profile/password/page.tsx`.
   - Cập nhật trang `/profile/page.tsx` sử dụng `ProfileLayoutWrapper`.
