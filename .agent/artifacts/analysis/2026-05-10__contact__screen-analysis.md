# Screen Analysis: 7-Form liên hệ (Contact Form)

> Feature slug: `contact`
> Date: 2026-05-10
> Figma: [Link](https://www.figma.com/design/jBSVaZS15xgvU06pdY6j5d/Danang-trip?node-id=32-16501&t=NSSLqcAHUf0ZdvPt-4)

---

## 1) Summary
- **Mục đích**: Cung cấp giao diện cho người dùng liên hệ với DaNangTrip để yêu cầu hỗ trợ, tư vấn tour hoặc hợp tác kinh doanh.
- **Người dùng chính**: Khách du lịch (Guest/User), Đối tác tiềm năng.
- **Module**: `Contact` (thuộc Public routes).

## 2) Design Token Audit
| Token | Figma Value | DESIGN.md Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Primary color | `#8B6A55` | `#8B6A55` | ✅ | |
| Background | Dark/Glassy | `#080808` / Glass | ✅ | |
| Typography | Inter / SFMono | Inter / SFMono | ✅ | |
| Spacing | Grid base 4px | Base 4px | ✅ | |
| Border radius | 8px/12px/Full | 4px, 7px, 8px, 12px, 9999px | ✅ | |
| Shadow/Blur | Glass 12px | Glass 12px blur | ✅ | |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `Input` | `src/components/ui/Input.tsx` | Không | Dùng cho Name, Email, Phone. |
| `Button` | `src/components/ui/Button.tsx` | Không | Dùng cho nút Submit. |
| `Select` | `src/components/ui/Select.tsx` | Không | Dùng cho Subject dropdown. |
| `AmbientBackground` | `src/components/layout/AmbientBackground.tsx` | Không | Nền ambient cho trang. |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer | Props interface |
|-----------|-------|-------------|-----------------|
| `Textarea` | Component nhập liệu nhiều dòng. | Atom | `TextareaHTMLAttributes` + `label`, `error`. |
| `ContactForm` | Form chính chứa các inputs và logic xử lý. | Organism | - |
| `ContactInfo` | Hiển thị thông tin liên hệ (Địa chỉ, Hotline, Email, Social). | Molecule | `info: ContactInfoData` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| - | - | - | - |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | 2 Columns: Info (left/right) & Form (right/left) | Baseline |
| Tablet (768-1023px) | 1 Column: Info trên, Form dưới | Stacked layout |
| Mobile (<768px) | 1 Column, padding nhỏ hơn | Full width inputs |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Submit Button | Spinner icon | - | - | - | `disabled` khi submitting | Độ sáng thay đổi |
| Input Fields | - | - | Border đỏ, msg | - | - | Border #8B6A55 |
| Form Submit | - | - | Toast error | Toast success + Reset form | - | - |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `name` | string | No | Tối đa 100 ký tự | Nguyen Van A | `ContactPayload` |
| `email` | string | Yes | Email format | user@example.com | `ContactPayload` |
| `phone` | string | No | Phone format (regex) | 0901234567 | `ContactPayload` |
| `subject` | string | Yes | Không trống | Support | `ContactPayload` |
| `message` | string | Yes | Tối thiểu 10 ký tự | I want to book a tour... | `ContactPayload` |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| POST | `/contacts` | 🌐 | `ContactPayload` | `ApiResponse<unknown>` | 400, 422, 500 |

## 8) Business Rules
- **BR-01**: Form phải validate trước khi gửi (Client-side validation với Zod).
- **BR-02**: Sau khi gửi thành công, hiển thị Toast thông báo và reset form.
- **BR-03**: Subject có thể chọn từ danh sách (Support, Partnership, Feedback, Other).
- **BR-04**: Tích hợp reCAPTCHA (nếu cần bảo mật cao - [ASSUMPTION]).

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Guest/User | Gửi form liên hệ | - | Không cần login. |

## 10) Edge Cases
- **EC-01**: Network timeout khi gửi form -> Hiển thị thông báo lỗi retry.
- **EC-02**: Spam protection -> Giới hạn số lần gửi (Rate limit từ BE).
- **EC-03**: Form gửi kèm Tour ID (từ trang chi tiết tour) -> Tự động điền subject hoặc message.

## 11) Assumptions & Open Questions
### Assumptions
- [ASSUMPTION] A-01: reCAPTCHA chưa bắt buộc ở phase này nhưng nên dự phòng.
- [ASSUMPTION] A-02: Endpoint `/contacts` đã hỗ trợ đầy đủ các fields trong `ContactPayload`.

### Open Questions
- Q-01: Có cần gửi đính kèm file (ảnh/doc) trong contact form không? (Hiện API chưa có).

## 12) Implementation Checklist
- [ ] Types & API contract (`src/services/contact.service.ts` đã có basic)
- [ ] Tạo component `Textarea` trong `src/components/ui`
- [ ] Xây dựng `ContactForm` với `react-hook-form` và `zod`
- [ ] Xây dựng `ContactInfo` hiển thị metadata (lấy từ common messages hoặc config)
- [ ] Cập nhật `src/app/[locale]/(main)/(public)/contact/page.tsx`
- [ ] Thêm translations đầy đủ trong `src/messages/*/contact.json`
- [ ] Tích hợp `contactService.submit`
- [ ] Thêm entrance animations (`reveal-up`)
- [ ] Testing form validation và submission
