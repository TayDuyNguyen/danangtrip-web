---
name: 02-project-setup
description: Audit the project base before feature work and produce a reusable setup report. Use when validating dependencies, config, route tooling, and baseline architecture.
---

# Skill: 02-project-setup

## Overview

Skill này dùng để audit project base của `danangtrip-web` trước khi triển khai feature và để lại **project setup report** cho team.
Nó giúp khóa lại stack thực tế, commands thực tế, và các risk ở tầng nền trước khi làm sâu vào feature.

## Required Input

- `persona.md`
- `.agent/rules/PROJECT_RULES.md`
- `DESIGN.md`
- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `vitest.config.ts`
- `src/lib/axios.ts`
- `src/providers/providers.tsx`
- `src/middleware.ts`

## Recommended Questions To Answer

1. Scripts trong repo có khớp docs hiện tại không?
2. Cấu trúc `src/` có bám rule không?
3. Middleware, i18n, auth sync có đang ổn không?
4. Route tooling (`check:routes`, `prepush:check`) có phải baseline thực sự không?
5. Có blocker nào ảnh hưởng cả pipeline không?

## Process

### 1) Dependency And Scripts Audit

Kiểm tra:

- dependencies cốt lõi và version
- build/deploy scripts
- test scripts
- route validation scripts

### 2) Repository Shape Audit

So khớp repo với `PROJECT_RULES.md`:

- `src/app/`
- `src/features/`
- `src/services/`
- `src/messages/`
- `src/providers/`

### 3) Config Audit

Kiểm tra:

- aliases (`@/` → `src/`)
- Next.js config
- Vitest config
- env example

### 4) Runtime Audit

Rà:

- axios client và interceptors
- providers wiring
- middleware (locale + auth)
- auth cookie/store sync

### 5) Result And Recommendation

Tài liệu cuối phải trả lời:

- pass/fail từng nhóm
- blocker nào có
- warning nào có
- có thể tiếp tục triển khai feature hay chưa

## Audit Checklist Nhanh

### Stack thực tế cần verify

```
Framework:    Next.js App Router (latest)
React:        19.x
Styling:      Tailwind CSS v4
Data fetch:   TanStack Query v5
State:        Zustand v5
Validation:   Zod v4
HTTP:         Axios v1
i18n:         next-intl v4
Testing:      Vitest v4
Deploy:       Cloudflare Workers via OpenNext (wrangler.jsonc)
```

### Commands phải tồn tại và chạy được

```bash
npm run lint              # ESLint
npm run typecheck         # tsc --noEmit
npm run check:routes      # Route integrity check
npm run build             # Next.js build
npm run prepush:check     # lint + typecheck + check:routes + build
npm run build:cloudflare  # OpenNext Cloudflare build
npm run deploy:cloudflare # Deploy to Cloudflare Workers
```

### axiosInstance phải có

```ts
// src/lib/axios.ts — kiểm tra các điểm sau
// ✓ baseURL từ env (NEXT_PUBLIC_API_URL)
// ✓ request interceptor gắn Bearer token từ cookie
// ✓ response interceptor xử lý 401 → clear auth + redirect
// ✓ không hardcode token trong service files
```

### Providers phải wrap đúng thứ tự

```tsx
// src/providers/providers.tsx — kiểm tra thứ tự
<QueryClientProvider client={queryClient}>
  <NextIntlClientProvider>
    {children}
  </NextIntlClientProvider>
</QueryClientProvider>
```

### Middleware phải handle

```ts
// src/middleware.ts — kiểm tra
// ✓ next-intl locale routing
// ✓ Protected route redirect khi chưa auth
// ✓ Không tạo redirect loop (login → protected → login)
// ✓ matcher config đúng (exclude _next/static, api, v.v.)
```

### Next.js config phải có

```ts
// next.config.ts — kiểm tra
// ✓ withNextIntl wrapper
// ✓ Image domains/remotePatterns nếu dùng next/image với external URLs
// ✓ Không có deprecated config
```

### TypeScript alias phải đúng

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
// Phải khớp với next.config.ts nếu có custom webpack alias
```

### Route integrity

```bash
# npm run check:routes phải pass
# Script này verify các route trong src/config/routes.ts
# tồn tại thật trong src/app/[locale]/
```

## Output Document

Tạo file:

- `.agent/artifacts/setup/YYYY-MM-DD__<feature-slug>__project-setup-report.md`

Nếu audit chung cho project, có thể dùng `project-base` làm `feature-slug`.

Template:

- `template_project_setup.md`

## Strict Rules

- Không đổi stack ở bước này nếu user chưa yêu cầu
- Không thêm dependency chỉ để hợp docs
- Nếu phát hiện vấn đề, phải nêu hướng fix nhỏ nhất
- Không báo "ổn" nếu chưa kiểm thực tế file/config liên quan

## Red Flags

Nếu thấy những dấu hiệu sau, phải flag trong audit:

- `axiosInstance` không có interceptor → mọi service phải tự gắn token thủ công
- `middleware.ts` không handle locale → next-intl routing bị lỗi
- `tsconfig.json` alias `@/` không trỏ đúng `./src/*` → import lỗi
- `npm run check:routes` không tồn tại → route drift không được phát hiện
- `npm run prepush:check` không tồn tại → không có quality gate trước push
- `wrangler.jsonc` thiếu → không deploy được lên Cloudflare Workers
- `.env.example` thiếu `NEXT_PUBLIC_API_URL` → dev mới không biết cần set gì

## Documentation Expectations

Setup report tốt phải có:

- summary (mục tiêu audit, verdict ready/not ready)
- dependency audit (version thực tế vs expected)
- config audit (alias, Next.js config, env vars)
- runtime/middleware audit (axios, providers, middleware)
- command baseline (tất cả commands có chạy được không)
- risks/gaps
- next actions

## Verification

- Đối chiếu `checklist.md`
- Report phải giúp người đọc biết: `base đã sẵn sàng chưa`
- Mọi mục phải có status rõ ràng: `PASS` / `FAIL` / `WARNING` / `NOT CHECKED`
