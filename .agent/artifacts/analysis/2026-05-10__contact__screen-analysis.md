# Screen Analysis: Form liên hệ

> Feature slug: `contact`
> Date: 2026-05-10
> Figma: [Stitch Project (Node 4ce8b91f82dd436a98adbf2a63648a63)](https://stitch.withgoogle.com/projects/385194501614952395?node-id=4ce8b91f82dd436a98adbf2a63648a63)

---

## 1) Summary
- **Mục đích**: Màn hình này cho phép người dùng (cả khách và thành viên) gửi thông tin liên hệ, thắc mắc hoặc góp ý cho ban quản trị Đà Nẵng Trip.
- **Người dùng chính**: Khách du lịch (GUEST) hoặc Người dùng đã đăng nhập (USER).
- **Module**: `contact` (Feature mới).

## 2) Design Token Audit
| Token | Figma Value | DESIGN.md Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Primary color | `#1D4ED8` (Blue) | `#8B6A55` (Brown) | ❌ No | Cần tuân thủ `DESIGN.md`. [CONFLICT] |
| Background | Light Grey (`#F9FAFB`) | `#080808` (Dark) | ❌ No | Cần tuân thủ dark mode của dự án. [CONFLICT] |
| Typography | Inter/Roboto | Inter & SFMono-Regular | ⚠️ Partial | Dùng font Inter làm chủ đạo. |
| Spacing | 24px-32px | 4px base (8, 12, 16, 24...) | ✅ Yes | Có thể map sang các token hiện có. |
| Border radius | Rounded (Figma default) | `7px` (Card), `9999px` (Button) | ⚠️ Partial | Cần quy hoạch lại theo `DESIGN.md`. |
| Shadow/Blur | Standard shadows | Glassmorphism (12px blur) | ❌ No | Chuyển sang phong cách Glassmorphism. |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| Header | `src/components/layout/Header.tsx` | No | Đảm bảo link "LIÊN HỆ" active. |
| Footer | `src/components/layout/Footer.tsx` | No | |
| Button | `src/components/ui/Button.tsx` | No | Dùng cho nút "Gửi tin nhắn". |
| Input | `src/components/ui/Input.tsx` | No | Dùng cho các trường text/email/tel. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer | Props interface |
|-----------|-------|-------------------|-----------------|
| ContactHero | Hero section với tiêu đề và ảnh nền Đà Nẵng | Organism | `title: string, subtitle: string` |
| ContactForm | Form nhập liệu chính | Molecule | `onSubmit: (data: ContactInput) => void` |
| ContactInfo | Hiển thị thông tin (Địa chỉ, SĐT, Email) | Molecule | `info: ContactDetails` |
| Textarea | UI component cho trường nhập liệu lớn | Atom | `label: string, error?: string, ...` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| - | - | - | - |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Submit Button | `isLoading` state (spinner) | - | - | - | `disabled` khi đang gửi | `hover:brightness-110` |
| Form Inputs | - | - | `border-red-500` | - | - | `border-primary` focus |
| Submit Success | - | - | - | Toast thông báo thành công | - | - |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `name` | string | ✅ Yes | min 2 chars | Nguyễn Văn A | body: `name` |
| `email` | string | ✅ Yes | email format | user@example.com | body: `email` |
| `phone` | string | ❌ No | regex phone | 0905123456 | body: `phone` |
| `subject` | string | ❌ No | - | Cần hỗ trợ đặt tour | body: `subject` |
| `message` | string | ✅ Yes | min 10 chars | Tôi muốn hỏi về... | body: `message` |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| POST | `/contacts` | 🌐 Public | `ContactInput` | `Contact` object | 422 (Validation), 500 |

## 8) Business Rules
- BR-01: Form chỉ được gửi khi các trường bắt buộc (`name`, `email`, `message`) đã hợp lệ.
- BR-02: Email phải đúng định dạng chuẩn.
- BR-03: Chống spam (ví dụ: rate limit hoặc captcha - [ASSUMPTION]).
- BR-04: Sau khi gửi thành công, reset form và hiển thị thông báo.

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| GUEST | Submit contact form | View contact list | |
| USER | Submit contact form | View contact list | |
| ADMIN | View/Reply contact | - | Thuộc module Dashboard (không nằm trong screen này) |

## 10) Edge Cases
- EC-01: Người dùng nhập email không tồn tại -> Backend validation.
- EC-02: Mất kết nối mạng khi đang gửi -> Hiển thị lỗi mạng, cho phép thử lại.
- EC-03: Nhập message quá dài -> Cần giới hạn ký tự (ví dụ: 1000).

## 11) Assumptions & Open Questions
### Assumptions
- [ASSUMPTION] A-01: `subject` là trường không bắt buộc (theo API list).
- [ASSUMPTION] A-02: Dự án sẽ dùng `react-hook-form` và `zod` để validate (standard dự án).
- [ASSUMPTION] A-03: Sẽ có bản đồ Google Maps hoặc OpenStreetMap đi kèm thông tin liên hệ.

### Open Questions
- Q-01: Có cần tích hợp Google reCAPTCHA không để tránh spam?
- Q-02: `subject` nên là text field hay là một dropdown (Select) các chủ đề có sẵn?

## 12) Implementation Checklist
- [ ] Types & API contract (`src/types/contact.ts`)
- [ ] UI components: `ContactHero`, `ContactForm`, `ContactInfo`, `Textarea`
- [ ] Feature hook: `useContact` (`src/features/contact/hooks/useContact.ts`)
- [ ] Route & page: `src/app/[locale]/contact/page.tsx`
- [ ] i18n synchronization: `src/messages/vi.json`, `src/messages/en.json`
- [ ] Data integration with TanStack Query
- [ ] Success/Error toast notifications
- [ ] Responsive testing (Mobile/Tablet/Desktop)
