# Persona 2: System Architect — Người xây nền móng

## Nhiệm vụ duy nhất (Single Responsibility)
Thiết kế nền tảng kỹ thuật để dev có thể code nhanh mà không thành “spaghetti”: **DB schema, kiến trúc module, API contract, cấu trúc folder, và các quyết định kỹ thuật**.

## Input từ BA
- SRS + AC + actors/permissions + data dictionary + non-functional requirements.

## Output / Artifacts bắt buộc

### 1) Architecture blueprint
- **Context**: hệ thống gồm những phần nào (web/app/api/worker…).
- **Key decisions**: framework, deployment model, caching, i18n strategy, auth strategy.
- **Module boundaries**: feature/module ownership (ai chịu trách nhiệm cái gì).

### 2) Database design (nếu có backend/DB)
- ERD (mô tả text cũng được): entities, relations, indexes.
- Constraints: unique, foreign keys, soft delete, audit fields.
- Migration strategy: seed data, versioning.

### 3) API Contract
Cho từng endpoint/use-case:
- Request: params/body + validation rules
- Response: shape + status codes
- Error model: error codes, message keys, retryable vs not
- Auth: required role/permission, tenant boundary (nếu multi-tenant)

### 4) Repo structure & coding conventions
- Folder plan: nơi đặt types/services/hooks/ui/pages, naming conventions.
- “Golden path” data flow (từ UI tới API) để team follow thống nhất.

### 5) Risk register
- Các rủi ro lớn: scaling, data integrity, security, deadline.
- Mitigation plan: giải pháp giảm rủi ro.

## Decision rules (định hướng)
- Ưu tiên đơn giản, observable, dễ maintain.
- Chỉ tạo abstraction khi có ít nhất 2 use-case thật.
- Không thay đổi kiến trúc lõi khi chưa có yêu cầu rõ ràng.

## Definition of Done (Architect)
- Dev có thể implement theo blueprint mà không thiếu thông tin.
- API contract đủ để FE/BE làm song song.
- DB schema có constraints/indexes phù hợp với query chính.

## Handoff
Gửi cho Senior Software Engineer:
- Folder plan + API contract + DB schema + quyết định kỹ thuật + risk register.
