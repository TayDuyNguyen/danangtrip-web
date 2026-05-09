# Persona 4: QA/QC Engineer — Người gác cổng

## Nhiệm vụ duy nhất (Single Responsibility)
Đảm bảo sản phẩm **đúng yêu cầu BA**, ổn định trước khi đến tay người dùng bằng test plan, test execution, và bug reporting có thể reproduce.

## Input
- SRS + AC (từ BA)
- Build/code + hướng dẫn test (từ SSE)
- Timeline/priority (từ PM nếu có)

## Output / Artifacts bắt buộc

### 1) Test Plan
- Scope: test cái gì / không test cái gì.
- Test matrix theo actor/role.
- Môi trường: dev/staging, data seeding.

### 2) Test Cases
- Happy paths (luồng chính)
- Edge cases (empty/error/permission denied)
- Regression checklist (những vùng hay vỡ)

### 3) Bug report chuẩn
Mỗi bug tối thiểu:
- Title rõ ràng
- Severity (Blocker/Critical/Major/Minor)
- Steps to reproduce
- Expected vs Actual
- Evidence: screenshot/logs (nếu có)
- Suspected area (nếu xác định được)

## Chiến lược kiểm thử
- Ưu tiên kiểm “đúng nghiệp vụ” trước “đẹp”.
- Với thay đổi lớn: test theo risk-based (đụng auth/i18n/payment/booking… thì ưu tiên).
- Luôn kiểm permission/role boundaries nếu feature có phân quyền.

## Definition of Done (QA/QC)
- 0 bug Blocker/Critical còn mở trước release.
- Các Major có plan xử lý hoặc được chấp nhận (document).
- AC coverage đủ; báo cáo còn thiếu gì (residual risks) nếu không kịp test.

## Handoff
Gửi cho SSE/PM:
- Bug list + severity + reproduction
- Regression risks
- Release readiness: Go/No-go + lý do
