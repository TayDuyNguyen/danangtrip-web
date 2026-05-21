# Test Cases: Form liên hệ

> Feature slug: `contact`
> Date: 2026-05-10
> Coverage target: > 80%

---

## 1. Unit Tests: Components

### 1.1 ContactForm
| ID | Title | Given | When | Then |
|----|-------|-------|------|------|
| TC-01 | Render fields | Màn hình Contact load | | Hiển thị đủ 5 fields (Name, Email, Phone, Subject, Message) |
| TC-02 | Field Validation | Tên trống hoặc Email sai định dạng | Click "Gửi tin nhắn" | Hiện thông báo lỗi dưới từng field tương ứng |
| TC-03 | Loading State | Đang call API (isPending=true) | | Nút submit hiển thị "Đang gửi..." + spinner, các field bị disabled |
| TC-04 | Success State | Gửi thành công (isSuccess=true) | | Ẩn form, hiện màn hình Thành công với icon và lời cảm ơn |
| TC-05 | Reset Form | Đang ở màn hình Thành công | Click "Gửi tin nhắn khác" | Form quay lại trạng thái ban đầu, dữ liệu trống |

### 1.2 ContactInfoCard
| ID | Title | Given | When | Then |
|----|-------|-------|------|------|
| TC-06 | Render Info | Data tĩnh | | Hiển thị đúng địa chỉ, hotline, email, giờ làm việc |

---

## 2. Unit Tests: Hooks

### 2.1 useContactSubmit
| ID | Title | Given | When | Then |
|----|-------|-------|------|------|
| TC-07 | Success Flow | Mock service trả về success | Call `mutate(validData)` | `onSuccess` được gọi, toast success hiện, data reset |
| TC-08 | Error Flow | Mock service trả về error 500 | Call `mutate(validData)` | `onError` được gọi, toast error hiện |

---

## 3. Unit Tests: Validators

### 3.1 contactSchema
| ID | Title | Input | Expected |
|----|-------|-------|----------|
| TC-09 | Valid Data | Đủ fields bắt buộc, email đúng, name >= 2 | `safeParse` returns `success: true` |
| TC-10 | Invalid Email | `email: "abc"` | `safeParse` returns `success: false`, error: `email_invalid` |
| TC-11 | Message too short | `message: "short"` | `safeParse` returns `success: false`, error: `message_min_10` |

---

## 4. E2E Tests (Manual/Playwright)

| ID | Title | Flow | Expected |
|----|-------|------|----------|
| TC-12 | Happy Path | Điền đủ form -> Submit -> Success screen | Dữ liệu được gửi tới API, UI chuyển sang success |
| TC-13 | Locale Switch | Chuyển ngôn ngữ Việt -> Anh | Toàn bộ label, placeholder, validation message đổi sang tiếng Anh |
