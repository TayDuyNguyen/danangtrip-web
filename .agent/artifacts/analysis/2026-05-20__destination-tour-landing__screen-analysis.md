# Screen Analysis: Landing tour Đà Nẵng

> Feature slug: `destination-tour-landing`
> Date: 2026-05-20
> Figma: NONE (Derive from `user_destination_tour_landing.md` and repo patterns)

---

## 1) Summary
- **Mục tiêu**: Tạo trang bán tour theo điểm đến Đà Nẵng, tối ưu cho SEO và giúp khách lọc/chọn tour nhanh.
- **Người dùng chính**: Khách du lịch vãng lai (Guest) và User đã đăng nhập.
- **Module/Feature**: `tour` / `destination`
- **Source inputs**: `user_destination_tour_landing.md`, `REPO_FACTS.md`, `DESIGN.md`.

## 2) Design Token Audit
| Token | Figma Value | DESIGN.md Value | Match? | Note |
|-------|-------------|-----------------|--------|------|
| Primary color | N/A | #8B6A55 | ✓ | |
| Typography | N/A | Inter / SFMono | ✓ | |
| Spacing | N/A | Base 4px | ✓ | |
| Border radius | N/A | 7px (Card), 9999px (Button) | ✓ | |
| Shadow/Blur | N/A | Glass (Blur 12px) | ✓ | |

## 3) Component Breakdown
### [REUSE] — Components đã có
| Component | Path | Cần chỉnh sửa? | Note |
|-----------|------|-----------------|------|
| `TourCard` | `src/components/common/TourCard.tsx` | No | |
| `TourGrid` | `src/features/tour/components/TourGrid.tsx` | No | |
| `TourSearchBar` | `src/features/tour/components/TourSearchBar.tsx` | [MOD] | Thêm context điểm đến mặc định nếu cần. |
| `Loading` | `src/components/ui/Loading.tsx` | No | |
| `Button` | `src/components/ui/Button.tsx` | No | |

### [NEW] — Components cần tạo mới
| Component | Mô tả | Thuộc layer | Props interface |
|-----------|-------|-------------|-----------------|
| `DestinationHero` | Hero section với ảnh và mô tả Đà Nẵng | Section | `{ title: string, description: string, image: string }` |
| `DestinationFilterBar` | Thanh lọc tour dành riêng cho landing | Organism | `{ categories: Category[], onFilter: (filters: Filters) => void }` |
| `SEOContent` | Section chứa nội dung SEO và FAQ | Section | `{ content: string, faqs: FAQ[] }` |

### [MOD] — Components cần chỉnh sửa
| Component | Path | Thay đổi gì | Impact |
|-----------|------|-------------|--------|
| `ROUTES` | `src/config/routes.ts` | Thêm route `/du-lich-da-nang` | Kích hoạt route mới |

## 4) Responsive Behavior
| Breakpoint | Layout | Thay đổi so với desktop |
|------------|--------|------------------------|
| Desktop (≥1024px) | 12-column grid | Baseline |
| Tablet (768-1023px) | 2-column tour grid | Thu nhỏ hero padding |
| Mobile (<768px) | 1-column tour grid | Filter bar chuyển thành drawer hoặc sticky mobile top |

## 5) UI States
| Component/Section | Loading | Empty | Error | Success | Disabled | Hover/Focus |
|-------------------|---------|-------|-------|---------|----------|-------------|
| Tour List | `TourCardSkeleton` | "Không tìm thấy tour" + CTA | Retry button | Render grid | N/A | Card zoom scale |
| Filter Bar | Pulse skeleton | Hidden | Silent | Render pills | Opacity 50% | Highlight pill |
| Hero | Skeleton text | Hidden | Fallback text | Render image/text | N/A | N/A |

## 6) Data Fields
| Field | Type | Required | Validation | Example | Source API |
|-------|------|----------|------------|---------|------------|
| `id` | `number` | ✓ | Positive | 1 | `GET /tours` |
| `name` | `string` | ✓ | Non-empty | "Tour Bà Nà Hills" | `GET /tours` |
| `price_adult` | `string` | ✓ | Numeric string | "1200000" | `GET /tours` |
| `slug` | `string` | ✓ | Slug format | "tour-ba-na-hills" | `GET /tours` |
| `featured_image` | `string` | ✗ | URL | "..." | `GET /tours` |

## 7) API Endpoints
| Method | Path | Auth | Request | Response | Error codes |
|--------|------|------|---------|----------|-------------|
| `GET` | `/tours` | Public | `{ destination_id: 1, ... }` | `Tour[]` | 400, 500 |
| `GET` | `/tour-categories` | Public | N/A | `Category[]` | 500 |
| `GET` | `/landing-pages/da-nang` | Public | N/A | `LandingData` | 404 (Fallback) |

## 8) Business Rules
- **BR-01**: Nếu API `landing-pages` chưa có, sử dụng nội dung hardcode trong `src/messages`.
- **BR-02**: Bộ lọc phải đồng bộ với URL params để hỗ trợ back/forward và chia sẻ link.
- **BR-03**: Mặc định sắp xếp theo tour nổi bật (Featured).

## 9) Actors & Permissions
| Actor/Role | Can do | Cannot do | Notes |
|------------|--------|-----------|-------|
| Guest | Xem danh sách, lọc, tìm kiếm | Đặt tour (cần login ở bước sau) | Public browsing |
| User | Xem danh sách, lọc, yêu thích | N/A | |

## 10) Edge Cases
- **EC-01**: Không có tour nào thỏa mãn bộ lọc -> Hiển thị nút "Xóa tất cả bộ lọc".
- **EC-02**: Slug landing không tồn tại -> Chuyển hướng về trang danh sách tour chung hoặc 404.

## 11) Assumptions & Open Questions
### Assumptions
- [ASSUMPTION] A-01: Đà Nẵng có `id=1` hoặc slug `da-nang` trong hệ thống.
- [ASSUMPTION] A-02: Layout Hero sử dụng token `glassmorphism` chuẩn của repo.

### Open Questions
- Q-01: Có cần hỗ trợ đa ngôn ngữ ngay cho nội dung SEO hardcode không? (Yes, theo PROJECT_RULES).

## 12) Implementation Checklist
- [x] Step 01: Screen Analysis
- [ ] Step 02: Project Setup Audit (Skip if ready)
- [ ] Step 03: Types & API contract
- [ ] Step 04: Route & layout
- [ ] Step 05: UI components (`DestinationHero`, `FilterBar`)
- [ ] Step 06: Data integration (`useTours`, `useCategories`)
- [ ] Step 07: Interactions (URL Sync, Filters)
- [ ] Step 08: Auth/permissions (N/A for public landing)
- [ ] Step 09: Testing
- [ ] Step 10: Optimization

## 13) Files / Areas Likely To Change
- `src/config/routes.ts`
- `src/features/destination/...` (New folder)
- `src/app/[locale]/(main)/(public)/destinations/da-nang/tours/page.tsx`
- `src/messages/vi/destination.json`
- `src/messages/en/destination.json`
