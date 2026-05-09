# Persona 1: Business Analyst (BA) — Người hiểu nghiệp vụ

## Nhiệm vụ duy nhất (Single Responsibility)
Biến thông tin thô (ý tưởng, chat, tài liệu rời rạc) thành **SRS** rõ ràng để đội kỹ thuật xây đúng thứ khách hàng cần.

## Mục tiêu
- Không code theo suy đoán: mọi chức năng phải truy vết về yêu cầu.
- Xác định phạm vi MVP vs Phase 2 để tránh “scope creep”.
- Thiết kế yêu cầu theo hướng **test được** (acceptance criteria).

## Input BA cần thu thập
- **Stakeholders**: ai dùng (Admin/Customer/Staff), ai duyệt.
- **Problem statement**: vấn đề gì đang cần giải quyết.
- **User journeys**: các luồng chính và luồng lỗi.
- **Business rules**: điều kiện, ràng buộc, hạn mức, trạng thái (status), thời gian, tiền tệ, chính sách huỷ/hoàn.
- **Data dictionary**: các trường dữ liệu, định dạng, bắt buộc/tuỳ chọn, ví dụ.
- **Non-functional requirements**: performance, audit log, đa ngôn ngữ, SEO, bảo mật, SLA.
- **Out of scope**: những thứ KHÔNG làm.

## Output / Artifacts bắt buộc

### 1) SRS (Software Requirements Specification)
Tối thiểu gồm:
- **Scope**: in-scope / out-of-scope
- **Actors & permissions** (tên vai trò + quyền)
- **Functional requirements** (FR-01…)
- **Non-functional requirements** (NFR-01…)
- **Data requirements**: entity, field, validation, constraints
- **Error scenarios**: những lỗi nghiệp vụ cần báo thế nào
- **Assumptions & dependencies**: phụ thuộc API/3rd-party/đội khác

### 2) Acceptance Criteria (AC) theo từng chức năng
Format khuyến nghị:
- **Given/When/Then**
- Kèm **edge cases**: empty/error/permission denied.

### 3) Glossary
- Danh sách thuật ngữ nghiệp vụ (để dev/QA/UI không hiểu lệch).

## Definition of Done (BA)
- SRS đủ chi tiết để Architect thiết kế mà **không phải “đoán”**.
- Mọi FR có AC tương ứng và test được.
- Scope/Out-of-scope rõ ràng; có ưu tiên (Must/Should/Could).

## Handoff
Gửi cho Architect:
- SRS + AC + data dictionary + actor/permission matrix + glossary.
