# DanangTrip Web Agent Kit

Bộ `.agent/` này là **project-local operating kit** dành riêng cho `danangtrip-web`.
Mục tiêu của nó là giúp AI:

1. Bám đúng codebase thực tế
2. Sinh ra tài liệu chi tiết, dùng lại được cho team
3. Đi theo pipeline rõ ràng từ phân tích màn hình đến review bàn giao

Khi có xung đột, hãy ưu tiên:

1. `.agent/rules/PROJECT_RULES.md`
2. Repo thực tế (`package.json`, `src/`, `next.config.ts`, `vitest.config.ts`, `scripts/`)
3. Các `SKILL.md` trong `.agent/skills/`

`ARCHITECTURE.md` là file inventory và định hướng sử dụng, không phải source of truth cho runtime architecture.

## Inventory thực tế

Hiện `.agent/` của repo này có:

- `10` pipeline skills trong `.agent/skills/`
- `20` agent profiles trong `.agent/agents/`
- Persona docs trong `.agent/personas/`
- Memory docs trong `.agent/memory/`
- Config/runtime helper files trong `.agent/config/`, `.agent/runtime/`
- Local validation helpers trong `.agent/scripts/`
- Artifact output folders trong `.agent/artifacts/`

## Directory Map

```text
.agent/
├── agents/       # Specialist agent profiles
├── artifacts/    # Documents generated during work
├── config/       # Local agent settings
├── memory/       # Project memory and knowledge notes
├── personas/     # Persona docs used by pipeline skills
├── rules/        # Project operating rules
├── scripts/      # Local validation helpers
├── runtime/      # Local runtime support files
└── skills/       # 10-step feature/documentation pipeline
```

## Core Principle

Bộ này được tối ưu cho **artifact-first delivery**.

Điều đó có nghĩa là:

- Mỗi step nên để lại tài liệu rõ ràng
- Tài liệu phải đủ chi tiết để review lại sau
- Tài liệu phải bám repo thật, không dùng assumptions từ template cũ
- Khi repo không có tool/test/setup nào đó, tài liệu phải nói rõ thay vì giả định

## Pipeline Skills

| # | Skill | Mục tiêu | Artifact chính |
|---|---|---|---|
| 01 | `01-screen-analysis` | Phân tích màn hình, UX, API, business rules | `artifacts/analysis/` |
| 02 | `02-project-setup` | Audit project base trước khi triển khai | `artifacts/setup/` |
| 03 | `03-types-api-contract` | Types, validators, service contract | `artifacts/api-contracts/` |
| 04 | `04-layout-routing` | Route plan, layout plan, i18n plan | `artifacts/routing/` |
| 05 | `05-ui-components` | UI spec và component plan | `artifacts/ui-specs/` |
| 06 | `06-data-integration` | Query/service wiring plan | `artifacts/integration/` |
| 07 | `07-interactions` | Form/CRUD/filter/search/pagination spec | `artifacts/interaction-specs/` |
| 08 | `08-auth-permissions` | Auth/permission review | `artifacts/auth/` |
| 09 | `09-testing` | Test report và validation evidence | `artifacts/test-cases/` |
| 10 | `10-optimization-deploy` | Deploy report và review bàn giao | `artifacts/deploy/`, `artifacts/review/` |

Master index:

- `.agent/skills/STACK_SKILLS_INDEX.md`

## Artifact Layout

```text
.agent/artifacts/
├── analysis/
├── api-contracts/
├── auth/
├── deploy/
├── integration/
├── interaction-specs/
├── review/
├── routing/
├── setup/
├── test-cases/
└── ui-specs/
```

Tên file chuẩn:

```text
YYYY-MM-DD__<feature-slug>__<artifact-name>.md
```

Ví dụ:

```text
2026-05-10__contact__screen-analysis.md
2026-05-10__contact__api-contract.md
2026-05-10__contact__route-plan.md
2026-05-10__contact__review.md
```

## Documentation Standard

Mọi tài liệu sinh ra từ skill nên tuân thủ:

- Lưu file dưới dạng `UTF-8`
- Không để lỗi ký tự kiểu `Ã`, `â†’`, `má»¥c`
- Mỗi tài liệu chỉ có `1` H1
- Có metadata đầu file: feature slug, date, source inputs
- Có `[ASSUMPTION]` khi còn điểm chưa chắc
- Có `Open Questions` nếu còn blocker về requirement
- Chỉ ra file hoặc khu vực code dự kiến bị ảnh hưởng

## Important Notes

- Không tham chiếu `workflows` dưới `.agent/` nếu file đó không tồn tại thật.
- Không coi Playwright là test setup mặc định khi repo chưa có `playwright.config.ts`.
- Không coi MSW là bắt buộc khi repo chưa có setup tương ứng.
- Khi tài liệu mô tả command kiểm tra, hãy ưu tiên command thực sự có trong `package.json`.
