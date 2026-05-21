---
name: 10-optimization-deploy
description: Produce final build, deploy, smoke-test, and handoff documents aligned with Cloudflare deployment reality. Use when wrapping up feature work.
---

# Skill: 10-optimization-deploy

## Overview

## When to Use

- When wrapping up a feature before handoff, push, preview, or deploy.
- When build/deploy readiness must be summarized for review.
- When testing already produced a verdict and a final delivery package is needed.

Đây là bước cuối của pipeline. Skill này tạo ra:

- `deploy report`: ghi nhận build, performance, smoke test, và readiness
- `review report`: bản tổng kết chi tiết để USER duyệt trước khi push

Nếu `09-testing` là bước ghi nhận kiểm thử, thì `10-optimization-deploy` là bước **tổng hợp toàn bộ chất lượng bàn giao**.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- `DESIGN.md`
- `next.config.ts`
- `package.json`
- `wrangler.jsonc`
- **Test report từ `09-testing`** — bắt buộc, phải là `READY` hoặc `READY WITH RISKS`
- Các artifact đã có từ những bước trước

## Gate Từ Skill 09

**Trước khi bắt đầu skill 10, kiểm tra test report:**

```
Test report verdict là gì?

NOT READY  →  DỪNG NGAY
              Không tạo deploy-report hay review.md
              Thông báo: "Skill 09 chưa pass. Fix các blocking issues trước."

READY WITH RISKS  →  Tiếp tục nhưng phải ghi rõ risks trong deploy-report
                     Reviewer phải acknowledge risks trước khi push

READY  →  Tiếp tục bình thường
```

## Real Commands In This Repo

```bash
npm run lint
npm run typecheck
npm run check:routes
npm run build
npm run prepush:check
npm run build:cloudflare
npm run preview:cloudflare
npm run deploy:cloudflare
```

## Delivery Intent

Skill này nên trả lời:

1. Build hiện tại có ổn không?
2. Deploy readiness có ổn không?
3. Smoke test đã đi đến đâu?
4. USER có đủ thông tin để duyệt chưa?

## Process

### 0) Artifact Trace Check

Trước khi viết bất kỳ report nào, kiểm tra artifacts đã có:

```
✓ analysis/...__screen-analysis.md        → bước 01
? api-contracts/...__api-contract.md      → bước 03 (nếu có data)
? routing/...__route-plan.md              → bước 04 (nếu có route mới)
? ui-specs/...__ui-spec.md                → bước 05 (nếu có UI mới)
? integration/...__data-integration.md   → bước 06 (nếu có data wiring)
? interaction-specs/...__interaction-spec.md → bước 07 (nếu có interaction)
? auth/...__auth-permissions-review.md   → bước 08 (nếu có auth)
✓ test-cases/...__test-report.md          → bước 09 (bắt buộc)
```

Nếu thiếu artifact bắt buộc → ghi rõ trong review.md phần nào chưa có.

### 1) Build And Readiness Review

Ghi rõ:

- lint
- typecheck
- check:routes
- build
- prepush:check

### 2) Performance / Bundle Review

Rà:

- chunk size (target: initial JS < 200KB gzipped)
- dynamic imports cho heavy components
- data waterfalls (server prefetch vs client waterfall)
- obvious performance hotspots

### 3) Smoke Test Review

Tối thiểu nên kiểm:

- page load
- critical flow
- locale switch (vi/en)
- auth redirect
- browser console (zero errors)

### 4) Review / Walkthrough Handoff

`review.md` phải giúp USER hiểu:

- feature làm gì
- thay đổi ở đâu
- validation tới đâu
- risk còn gì

### 5) Git Handoff — Gợi ý và Chờ Lệnh

Sau khi tạo xong `deploy-report.md` và `review.md`, AI phải:

#### Bước 1 — Gợi ý tên nhánh

Convention bắt buộc:

```
<type>/DATN-<STT>/<mô-tả-ngắn>
```

**Cách xác định STT — chạy lệnh này trước:**

```bash
git branch -a | grep -oP 'DATN-\K[0-9]+' | sort -n | tail -1
```

Lấy số lớn nhất tìm được, cộng thêm 1 → đó là STT cho nhánh mới.

**Ví dụ:**
```
Nhánh hiện có: feat/DATN-63/tour-crud, fix/DATN-64/filter-bug
→ STT mới nhất: 64
→ STT cho nhánh mới: 65
→ Tên nhánh gợi ý: feat/DATN-65/create-tour-list
```

**Các type:**
```
feat     → tính năng mới
fix      → bug fix
refactor → refactor không đổi behavior
chore    → config, deps, tooling
docs     → chỉ đổi docs/comments
test     → thêm/sửa tests
```

**Mô tả ngắn:** kebab-case, tối đa 4-5 từ, mô tả đúng việc đang làm.

```
feat/DATN-65/create-tour-list
fix/DATN-66/tour-filter-reset
refactor/DATN-67/tour-mapper-cleanup
```

#### Bước 2 — Gợi ý commit message

Theo format Conventional Commits:

```
<type>(<scope>): <short description>

<body — optional, mô tả chi tiết nếu cần>

<footer — optional, refs issue nếu có>
```

**Ví dụ:**
```
feat(tours): add tour list page with filter and pagination

- Add /tours and /tours/[slug] routes (App Router)
- Add TourListClient with search/filter/pagination (URL-synced)
- Add useTourList and useTourDetail hooks
- Add tour.service.ts and contactFormSchema (Zod v4)
- Add i18n keys for vi/en (tour namespace)
- Server prefetch initial data for LCP optimization

Closes #15
```

**Các type phổ biến:**
```
feat     → tính năng mới
fix      → bug fix
refactor → refactor không đổi behavior
style    → format, spacing (không đổi logic)
chore    → deps, config, tooling
docs     → chỉ đổi docs/comments
test     → thêm/sửa tests
```

#### Bước 3 — Hiển thị lệnh git và CHỜ

Sau khi gợi ý, AI phải hiển thị các lệnh cần chạy và **dừng lại chờ lệnh từ USER**:

```
📋 Sẵn sàng push. Các lệnh cần chạy:

git checkout -b feat/tour-list
git add src/app/[locale]/tours/ src/features/tours/ src/services/tour.service.ts src/messages/
git commit -m "feat(tours): add tour list page with filter and pagination"
git push -u origin feat/tour-list

⚠️  AI sẽ KHÔNG tự chạy các lệnh này.
✋  Hãy xem xét review.md và deploy-report.md, sau đó gõ "push" hoặc "confirm push" để tiến hành.
```

#### Bước 4 — Chỉ push khi USER xác nhận

```
USER gõ "push" hoặc "confirm push"
  → AI chạy: git checkout -b <branch>
  → AI chạy: git add <files>
  → AI chạy: git commit -m "<message>"
  → AI chạy: git push -u origin <branch>

USER không xác nhận
  → AI dừng tại đây
  → Không tự ý push
```

**Tuyệt đối không push nếu:**
- USER chưa xác nhận
- `npm run prepush:check` chưa pass
- Test report là `NOT READY`

## Performance Checklist Cho Web

### Bundle size

```bash
# Sau khi build, kiểm tra output
npm run build

# Xem chunk sizes trong .next/analyze/ nếu có bundle analyzer
# Target: initial JS < 200KB gzipped
```

### Common issues cần rà

```
❌ Server component import client-only library → bundle bloat
❌ Không lazy-load heavy modal/dialog → tăng initial bundle
❌ Image không có width/height → CLS
❌ Image không dùng next/image → không optimize
❌ Data waterfall: client fetch sau khi server render → chậm LCP
```

### Cloudflare Workers specific

```bash
# Build cho Cloudflare
npm run build:cloudflare

# Preview local trước khi deploy
npm run preview:cloudflare

# Deploy
npm run deploy:cloudflare
```

Lưu ý Cloudflare Workers:

- Không có Node.js APIs (`fs`, `path`, v.v.)
- Edge runtime — không có long-running processes
- Bundle size limit: 1MB (compressed)

## Output Documents

Tạo các file:

- `.agent/artifacts/deploy/YYYY-MM-DD__<feature-slug>__deploy-report.md`
- `.agent/artifacts/review/YYYY-MM-DD__<feature-slug>__review.md`

Templates:

- `template_deploy_report.md`
- `template_review.md`

## Strict Rules

- Không gọi deploy-ready nếu quality gates chưa pass
- Không nói mơ hồ kiểu "seems fine"
- Nếu chưa chạy deploy thật hoặc smoke test thật, phải ghi rõ
- Không nhắc tool/setup không tồn tại trong repo
- **Tuyệt đối không tự ý `git push` — phải chờ USER xác nhận**
- **Phải gợi ý tên nhánh và commit message trước khi hỏi USER**
- `review.md` phải mô tả đúng stack hiện tại (Next.js App Router, Cloudflare Workers)

## Rationalizations

| Excuse | Rebuttal |
|---|---|
| "The test report is already enough." | A final delivery step still needs deploy readiness, smoke status, and reviewer-facing summary. |
| "Build passed, so deployment is fine." | Build pass alone does not cover deploy assumptions, smoke results, or operational risks. |
| "Reviewers can read the diff themselves." | A delivery report reduces ambiguity and accelerates final approval. |


## Red Flags

Nếu thấy những dấu hiệu sau, phải dừng và flag:

- Gọi "deploy-ready" khi `npm run prepush:check` chưa pass
- `review.md` chỉ là danh sách file thay đổi — không có objective, scope, risks
- Không ghi rõ Cloudflare-specific constraints
- Claim smoke test pass nhưng không có dev server chạy
- Push mà không có USER xác nhận → vi phạm nghiêm trọng
- Commit message không theo Conventional Commits format

## Documentation Expectations

### `deploy-report.md` nên có

- build status (lint/typecheck/build/prepush:check)
- performance/bundle notes
- smoke test notes
- deploy readiness verdict

### `review.md` nên có

- objective (feature làm gì)
- scope delivered (thay đổi ở đâu)
- artifact trace (bước nào đã đi qua)
- technical decisions (quyết định kỹ thuật đáng chú ý)
- validation summary
- risks / follow-ups

## Verification

- Đối chiếu `checklist.md`
- Cả `deploy-report` và `review.md` phải tồn tại trước khi xin user duyệt push
- Người đọc phải có thể hiểu feature mà không cần mở toàn bộ diff ngay lập tức
