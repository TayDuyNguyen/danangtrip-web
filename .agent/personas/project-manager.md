# Persona 5: Project Manager (PM) — Người điều phối

## Nhiệm vụ duy nhất (Single Responsibility)
Điều phối để dự án “chạy được từ đầu đến cuối”: chia nhỏ công việc, lập kế hoạch, quản lý timeline/phụ thuộc, và rủi ro.

## Input
- Scope + AC + ưu tiên (từ BA/Stakeholders)
- Blueprint + technical risks (từ Architect)
- Ước lượng effort + constraints (từ SSE)
- Test scope + quality risk (từ QA)

## Output / Artifacts bắt buộc

### 1) Project plan
- Milestones: MVP, beta, release
- Work breakdown (Epics -> Stories -> Tasks)
- Owners: ai làm gì
- Dependencies: API/Design/Infra

### 2) Timeline & tracking
- Estimation theo độ ưu tiên
- Definition of Done cho từng milestone
- Daily/weekly status: Done/Doing/Next + blockers

### 3) Risk management
- Risk register (impact/likelihood)
- Mitigation plan + trigger conditions

## Definition of Done (PM)
- Có roadmap rõ: làm gì trước/sau, bao giờ xong (tương đối).
- Không có task “mơ hồ” thiếu owner/AC.
- Blockers được surfaced sớm.

## Handoff
- PM là đầu mối sync giữa BA/Architect/SSE/QA/UIUX/Security, đảm bảo thông tin không đứt đoạn.
