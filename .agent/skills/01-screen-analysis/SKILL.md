---
name: 01-screen-analysis
description: Analyze a web screen from Figma, SRS, or requirement notes and produce an implementation-ready analysis document. Use when a new screen or major UI change is requested.
---

# Skill: 01-screen-analysis

## Overview

## When to Use

- When a new screen or major UI change needs structured analysis before implementation.
- When the requirement is still scattered across Figma, notes, PRD, or discussion.
- When downstream steps need one shared interpretation instead of ad hoc assumptions.

Skill này là điểm bắt đầu của pipeline cho `danangtrip-web`.
Nó biến input thô như Figma, SRS, note sản phẩm, hoặc mô tả từ USER thành **screen analysis document đủ chi tiết để các bước route, UI, data, auth, testing không phải tự suy diễn**.

Mục tiêu của output không phải là "ghi chú ngắn", mà là tài liệu đủ để:

- `03-types-api-contract` xác định đúng field và API
- `04-layout-routing` biết route/layout nào cần thay đổi
- `05-ui-components` biết component nào cần reuse hoặc tạo mới
- `06-data-integration` biết server/client boundary và query plan
- `07-interactions` biết action nào là trọng tâm

## Required Input

- `persona.md`
- Figma link, mockup, PRD, hoặc meeting notes
- `DESIGN.md`
- `.agent/rules/PROJECT_RULES.md`
- `.agent/rules/REPO_FACTS.md`
- `.agent/memory/WORKING_STATE.md`
- `.agent/memory/HANDOFF.md`
- `d:/DATN/DATN_Tài liệu/docs/api/api_list.md`
- `src/config/api.ts`
- `src/config/routes.ts`
- `.agent/memory/project-map.md`

## Recommended Questions To Answer

1. Đây là page mới, section mới, hay refactor của page cũ?
2. User chính của màn này là ai?
3. Màn này là public, auth-only, hay role-based?
4. Data nào hiển thị ngay khi load, data nào hiển thị theo interaction?
5. Có SEO, metadata, locale, hoặc route implication nào không?
6. Có assumption nào cần chặn lại trước khi sang bước code?

## Process

### 1) Summary And Scope

Xác định:

- mục tiêu màn hình
- actor chính
- module/feature liên quan
- screen type: list/detail/form/dashboard/landing section

### 2) Design And Token Audit

Không chỉ nhìn layout.
Phải đối chiếu với `DESIGN.md`:

- màu sắc
- typography
- spacing
- radii
- elevation / glass surfaces
- motion / reveal rhythm

Nếu mockup lệch khỏi token chuẩn, phải flag rõ.

### 3) Component Breakdown

Phân loại:

- `[REUSE]`
- `[NEW]`
- `[MOD]`

Mỗi component nên có:

- purpose
- path nếu reuse
- layer (atom / molecule / organism / section)
- impact nếu mod

### 4) Responsive And UI States

Phải mô tả:

- mobile
- tablet
- desktop

Mỗi section quan trọng nên có:

- loading
- empty
- error
- success
- disabled
- hover/focus nếu có interaction

### 5) Data And API Review

Phải map:

- field
- type
- required/optional
- validation expectation
- source endpoint
- server/client ownership nếu cần

### 6) Business / Auth / i18n Review

Phải ghi:

- business rules
- auth requirement
- locale/message impact
- edge cases
- open questions

## Output Example — Component Breakdown

Đây là ví dụ về component breakdown đúng chuẩn:

| Component | Type | Layer | Path | Reason |
|---|---|---|---|---|
| `TourCard` | [REUSE] | Molecule | `src/components/common/TourCard.tsx` | Đã có, chỉ cần truyền đúng props |
| `TourGrid` | [REUSE] | Organism | `src/features/tours/components/TourGrid.tsx` | Dùng lại grid layout |
| `TourCategoryFilter` | [NEW] | Molecule | `src/features/tours/components/TourCategoryFilter.tsx` | Chưa có filter theo category |
| `TourSearchBar` | [MOD] | Molecule | `src/components/common/SearchBar.tsx` | Cần thêm debounce và URL sync |

**Không được viết:**
```
- TourCard: reuse
- TourGrid: reuse
- Filter: new
```

## Output Example — UI States

Đây là ví dụ về UI states đúng chuẩn:

| Section | Loading | Empty | Error |
|---|---|---|---|
| Tour list | `TourCardSkeleton` × 6 | "Chưa có tour nào" + CTA | Inline error + retry button |
| Category filter | Skeleton pills × 5 | Ẩn filter bar | Toast error |
| Pagination | Disabled | Ẩn | N/A |

**Không được viết:**
```
- Loading state: có
- Empty state: có
- Error state: có
```

## Output Example — Data/API Mapping

| Field | Type | Required | Source | Note |
|---|---|---|---|---|
| `id` | `string` | ✓ | `GET /api/tours` | UUID |
| `name` | `string` | ✓ | `GET /api/tours` | |
| `slug` | `string` | ✓ | `GET /api/tours` | Dùng cho URL |
| `price` | `number \| null` | ✗ | `GET /api/tours` | null = liên hệ |
| `imageUrl` | `string \| null` | ✗ | `GET /api/tours` | Fallback to placeholder |
| `category.name` | `string` | ✓ | `GET /api/tours` | Nested object |

## Output Document

Tạo file:

- `.agent/artifacts/analysis/YYYY-MM-DD__<feature-slug>__screen-analysis.md`

Template:

- `template_screen_analysis.md`

## Strict Rules

- Không viết code ở bước này
- Không bịa endpoint hoặc business rule
- Chỗ nào chưa chắc phải đánh dấu `[ASSUMPTION]`
- Khi có xung đột giữa mockup và `DESIGN.md`, phải flag rõ
- Endpoint phải đối chiếu với `api_list.md` và `src/config/api.ts` — không tự đặt tên

## Rationalizations

| Lý do hay gặp | Thực tế |
|---|---|
| "Màn đơn giản, không cần analysis chi tiết" | Bước sau sẽ tự đoán và drift — tốn thêm thời gian fix |
| "Chưa có Figma, phân tích sau" | Phân tích từ SRS/notes trước, ghi `[ASSUMPTION]` cho phần chưa có mockup |
| "Component breakdown rõ rồi, không cần bảng" | Bảng giúp bước 05 đọc nhanh — prose dài khó scan |
| "API chưa có docs, bỏ qua phần data mapping" | Phải ghi `Open Question` — không được bỏ qua im lặng |


## Red Flags

Nếu thấy những dấu hiệu sau trong analysis, phải bổ sung:

- Component breakdown chỉ có tên, không có path/layer/reason → bước 05 không dùng được
- UI states chỉ ghi "có" → bước 05 không biết render gì
- Data mapping không có source endpoint → bước 03 phải tự đoán
- Không có business rules section → bước 07 sẽ miss edge cases
- Không có `[ASSUMPTION]` dù có nhiều điểm chưa chắc → silent assumption

## Documentation Expectations

Analysis tốt phải có:

- summary rõ (screen type, actor, module)
- design/token audit rõ (conflict với DESIGN.md nếu có)
- component breakdown rõ (bảng với path, layer, reason)
- UI states rõ (per section, không phải chung chung)
- data/API mapping rõ (field, type, source endpoint)
- auth/i18n impact rõ
- assumptions/open questions rõ

## Verification

- Đối chiếu `checklist.md`
- Tài liệu phải đủ chi tiết để `03`, `04`, `05`, `06`, `07` dùng tiếp mà không phải hỏi lại
- Người đọc phải hiểu được màn hình này mà không cần mở mockup lại ngay lập tức
