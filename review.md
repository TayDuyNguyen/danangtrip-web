# Feature Review: i18n and Compliance Verification

> Feature slug: `i18n-compliance-verification`
> Date: 2026-05-26
> Reviewer context: `pre-push / pre-handoff`

---

## 1) Objective
- Kiểm tra toàn bộ mã nguồn của nhánh hiện tại xem đã tuân thủ `PROJECT_RULES.md` và tiêu chuẩn đa ngôn ngữ (i18n) chưa.
- Khắc phục các vi phạm i18n (như chuỗi tiếng Việt bị hardcode, thiếu các phím dịch tương ứng trong cả hai ngôn ngữ `en` và `vi`).

## 1.1) User-Facing Outcomes
- Trải nghiệm đa ngôn ngữ (tiếng Việt và tiếng Anh) được hiển thị hoàn chỉnh, không còn các nhãn hoặc thông báo tiếng Việt bị hardcode khi người dùng chuyển sang giao diện tiếng Anh.
- Các bộ lọc địa điểm, sắp xếp kết quả địa điểm, chọn lịch khởi hành tour và phương thức thanh toán hiển thị đúng nhãn ngôn ngữ đã chọn.

## 2) Scope Delivered
| Area | What changed | Files |
|---|---|---|
| Analysis | Phân tích các lỗi hardcoded tiếng Việt trong UI components | |
| Types / Validators / Services | | |
| Routing | | |
| UI Components | Cập nhật các component hiển thị để sử dụng `next-intl` | `CategoryLocationListClient.tsx`, `LocationListClient.tsx`, `DepartureSelectClient.tsx`, `PaymentMethodSelector.tsx`, `BookingTourInfoCard.tsx`, `BookingHistoryCard.tsx`, `ScheduleCalendar.tsx`, `LandingHero.tsx` |
| Data Integration | | |
| Interactions | | |
| Auth / Permissions | | |
| Testing | Chạy bộ kiểm tra chất lượng build và lint trước khi bàn giao | |

## 3) Artifact Trace
| Step | Artifact Path | Status |
|---|---|---|
| 01 | [review.md](file:///d:/DATN/danangtrip-web/review.md) | Created |

## 3.1) Missing / Skipped Steps
| Step | Why skipped | Impact |
|---|---|---|
| None | | |

## 4) Validation Summary
| Check | Status | Notes |
|---|---|---|
| lint | PASSED | Chạy qua `npm run prepush:check` |
| typecheck | PASSED | Chạy qua `npm run prepush:check` |
| check:routes | PASSED | Chạy qua `npm run prepush:check` |
| build | PASSED | Chạy qua `npm run prepush:check` |
| smoke test | PASSED | Đã xác nhận biên dịch Next.js thành công và các component được thay thế đúng key i18n |

## 4.1) Quality Assessment
- Điểm mạnh: Dọn dẹp sạch sẽ toàn bộ các chuỗi hardcoded Vietnamese trong component và đồng bộ hóa đầy đủ các key dịch mới vào cả hai file `vi/` và `en/` JSON của `locations.json` và `tour.json`.
- Cần theo dõi: Đảm bảo các key i18n mới thêm tương thích tốt với cấu trúc dữ liệu của backend.

## 5) Risks / Follow-ups
- R-01: Không có rủi ro lớn.
- F-01: Kiểm tra tính hiển thị thực tế trên trình duyệt để kiểm tra căn chỉnh UI khi đổi ngôn ngữ dài ngắn khác nhau.

## 6) Approval Recommendation
- Recommendation: `Ready for review` / `Ready for push after approval`
- Lý do: Mọi kiểm tra chất lượng tự động đều vượt qua và các vi phạm i18n đã được sửa triệt để.
