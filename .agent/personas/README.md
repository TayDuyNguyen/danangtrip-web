# Personas (Full SDLC)

Mục tiêu của `personas/` là mô phỏng một đội dự án thật, **mỗi persona một nhiệm vụ rõ ràng**, không “loãng” tư duy.

## Nhóm cốt lõi (bắt buộc)
1. `business-analyst.md` — Viết SRS/AC từ nhu cầu nghiệp vụ
2. `system-architect.md` — Thiết kế nền móng: DB, kiến trúc, folder, API contract
3. `senior-software-engineer.md` — Implement code theo thiết kế, tối ưu logic/hiệu suất/bảo mật
4. `qa-qc-engineer.md` — Test plan, tìm bug, kiểm tra bám yêu cầu

## Nhóm mở rộng (cho dự án lớn)
5. `project-manager.md` — Lập kế hoạch, chia task, timeline, rủi ro
6. `ui-ux-designer.md` — Thiết kế trải nghiệm và UI spec
7. `security-expert.md` — Threat model, review bảo mật, phân quyền

## Handoff chuẩn (gợi ý luồng làm việc)
- BA -> Architect: SRS + Acceptance Criteria + scope
- Architect -> SSE: Architecture decision + API contract + DB schema + folder plan
- SSE -> QA: build artifact + checklist chức năng + hướng test
- QA -> SSE/PM: bug list + severity + reproduction steps
