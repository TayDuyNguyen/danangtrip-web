# STACK SKILLS INDEX  Pipeline triển khai 1 màn hình A→Z

> File này là bản hướng dẫn thao tác để kích hoạt các skill trong `.agent/skills/` theo đúng pipeline triển khai từng màn hình cho dự án `danangtrip-web`.
>
> **Cập nhật lần cuối:** Đã đồng bộ với codebase thực tế  đường dẫn file, stack, icon set, deploy target đều bám sát repo.

---

## Stack thực tế của dự án

| Hạng mục | Công nghệ |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| React | 19.2.4 |
| Styling | Tailwind CSS 4 |
| Data fetching | TanStack Query v5 (`@tanstack/react-query`) |
| State management | Zustand v5 |
| i18n | next-intl v4 |
| Validation | Zod v4 |
| HTTP client | Axios v1 (instance tại `src/lib/axios.ts`) |
| Auth storage | Zustand + localStorage persist + Cookie (`js-cookie`) |
| Icons | Solar (custom `src/components/icons/solar.tsx`) + `@iconscout/react-unicons` + `lucide-react` |
| Toast | sonner v2 |
| Animation | CSS `reveal-up` classes + GSAP ScrollTrigger + Lottie (`lottie-react`) |
| 3D/WebGL | Three.js (`three`) |
| Date | date-fns v4 |
| Select | react-select v5 |
| Testing | Vitest v4 + @testing-library/react v16 (jsdom) |
| Deploy | Cloudflare Workers via `@opennextjs/cloudflare` |
| Build | `npm run build` (webpack mode) / `npm run build:cloudflare` |

---

## Pipeline tổng quan

```
01-screen-analysis      Phan tich man hinh (khong code)
02-project-setup        Khoi tao/chuan bi project base
03-types-api-contract   Dinh nghia Types & API Contract
04-layout-routing       Xay dung Layout & Route
05-ui-components        Xay dung UI Components (Atomic Design)
06-data-integration     Tich hop Data (gan API vao UI)
07-interactions         Chuc nang tuong tac (CRUD, Filter, etc.)
08-auth-permissions     Auth & Phan quyen
09-testing              Testing (Unit + E2E)
10-optimization-deploy  Optimization & Build/Deploy
```

---

## 1) Danh sach 10 Skills

| # | Skill ID | Persona | Muc dich | Output |
|---|----------|---------|----------|--------|
| 01 | `01-screen-analysis` | Business Analyst | Doc PRD/Figma -> checklist UI + API + Business Rules | `artifacts/analysis/` |
| 02 | `02-project-setup` | DevOps Engineer | Setup project base neu la man dau tien | Project chay duoc |
| 03 | `03-types-api-contract` | System Architect | Dinh nghia TS interfaces, Zod schemas, API service | `types/`, `services/` |
| 04 | `04-layout-routing` | Senior Software Engineer | Tao route, layout, phan chia Server/Client Component | `app/[locale]/...` |
| 05 | `05-ui-components` | UI/UX Designer + SSE | Build UI theo Atomic Design tu Figma | `components/`, `features/` |
| 06 | `06-data-integration` | Senior Software Engineer | Gan API vao UI, xu ly states | Loading/Error/Empty states |
| 07 | `07-interactions` | Senior Software Engineer | CRUD, Filter, Search, Pagination, Export | Full interactions |
| 08 | `08-auth-permissions` | Security Expert | Auth middleware, role-based UI, token management | Auth flow hoan chinh |
| 09 | `09-testing` | QA/QC Engineer | Unit test + E2E test | Test cases + coverage |
| 10 | `10-optimization-deploy` | Performance Engineer + DevOps | Optimize + Build + Deploy | Lighthouse > 90, deployed |


---

## 2) File context bat buoc doc truoc khi lam bat ky skill nao

Truoc khi bat dau bat ky skill nao, AI PHAI doc cac file sau de hieu dung kien truc:

### Rules & Design
- `.agent/rules/PROJECT_RULES.md`  quy tac kien truc, code quality, delivery gates
- `DESIGN.md`  design tokens: mau sac, typography, spacing, motion, WebGL

### Core Infrastructure
- `src/lib/axios.ts`  axios instance co fallback URL logic, interceptor tu dong gan Bearer token, refresh token flow
- `src/lib/react-query.ts`  TanStack Query client config
- `src/lib/utils.ts`  utility functions chung (cn, clsx, tailwind-merge)

### Config
- `src/config/api.ts`  tat ca API_ENDPOINTS constants (AUTH, TOURS, LOCATIONS, SEARCH, BLOG, RATINGS, USER...)
- `src/config/routes.ts`  PUBLIC_ROUTES, AUTH_ROUTES, PROTECTED_ROUTES, DASHBOARD_ROUTES, PLANNED_ROUTES
- `src/config/env.ts`  environment variables
- `src/config/index.ts`  config object tong hop

### Auth
- `src/store/auth.store.ts`  Zustand auth store (user, token, isAuthenticated) + persist vao localStorage
- `src/utils/auth.helper.ts`  getAccessToken(), setAccessToken(), clearTokens() (dung Cookie js-cookie)
- `src/middleware.ts`  Edge middleware: i18n routing + auth protection (Cloudflare OpenNext, KHONG dung Node Proxy)
- `src/features/auth/`  auth components, hooks, services, validators

### i18n
- `src/i18n/routing.ts`  locales: ["vi", "en"], defaultLocale: "vi", localePrefix: "as-needed"
- `src/i18n/request.ts`  next-intl request config
- `src/i18n/navigation.ts`  locale-aware Link, useRouter, usePathname
- `src/messages/vi/`  vi translations (blog, common, contact, home, locations, login, register, search, settings, tour)
- `src/messages/en/`  en translations (phai dong bo voi vi)

### Shared UI
- `src/components/ui/`  Button, Input, Badge, Select, Loading, RatingStars, SearchInput, pagination/
- `src/components/layout/`  Header, Navbar, Footer, Sidebar, AmbientBackground, LanguageSwitcher
- `src/components/feedback/`  empty-state.tsx, toast.tsx
- `src/components/icons/solar.tsx`  Solar icon set (ICON SET CHINH cua du an)
- `src/providers/providers.tsx`  app-wide providers (QueryClientProvider, next-intl, etc.)

### Existing Features (de reuse patterns)
- `src/features/auth/`  auth flow mau
- `src/features/tour/`  tour feature mau (hooks, components, types)
- `src/features/locations/`  locations feature mau
- `src/features/search/`  search + suggestions
- `src/features/home/`  home page sections
- `src/features/blog/`  blog feature

### Services (de hieu pattern truoc khi viet moi)
- `src/services/auth.service.ts`
- `src/services/tour.service.ts`
- `src/services/location.service.ts`
- `src/services/search.service.ts`
- `src/services/blog.service.ts`
- `src/services/favorite.service.ts`
- `src/services/rating.service.ts`

### Types (de reuse truoc khi tao moi)
- `src/types/api.types.ts`  ApiResponse<T>, PaginatedResponse<T>
- `src/types/entities.types.ts`  Tour, Location, Blog entities
- `src/types/auth.types.ts`  User, LoginRequest, RegisterRequest
- `src/types/search.types.ts`  SearchParams, SearchResult
- `src/types/user.types.ts`  UserProfile, UpdateProfileRequest

### Hooks (de reuse truoc khi tao moi)
- `src/hooks/useDebounce.ts`  debounce hook (dung cho search)
- `src/hooks/useFavorite.ts`  favorite toggle hook
- `src/hooks/use-scroll-reveal.ts`  scroll reveal animation
- `src/hooks/use-click-outside.ts`  click outside detection
- `src/hooks/use-search-suggestions.ts`  search suggestions hook

---

---

## 3) Prompt chi tiet tung skill

### 3.1 - 01-screen-analysis

Kich hoat 01-screen-analysis

Context:
- Repo: d:/DATN/danangtrip-web
- Screen name: <ten man hinh>
- Figma link: <link hoac NONE>
- PRD/notes: <path hoac NONE>
- API docs: doc src/config/api.ts de biet endpoints co san

Files bat buoc doc truoc:
- .agent/skills/01-screen-analysis/persona.md
- .agent/skills/01-screen-analysis/SKILL.md
- .agent/skills/01-screen-analysis/checklist.md
- .agent/rules/PROJECT_RULES.md
- DESIGN.md
- src/config/api.ts (de map data fields voi endpoints thuc te)
- src/config/routes.ts (de biet routes hien co)

Required output:
- .agent/artifacts/analysis/YYYY-MM-DD__<feature-slug>__screen-analysis.md
  (dung template: .agent/skills/01-screen-analysis/template_screen_analysis.md)

Phan tich 5 muc:
1. Design tokens: mau sac, typography, spacing doi chieu voi DESIGN.md
2. Component breakdown: Atoms -> Molecules -> Organisms -> Template
3. Responsive: mobile-first breakpoints
4. UI states: loading, empty, error, success cho tung section
5. Data fields: map voi API_ENDPOINTS trong src/config/api.ts

Xac dinh:
- API endpoints can dung (tham chieu src/config/api.ts)
- Business rules va validation rules
- Auth requirements (public/protected/role-based)
- i18n keys can them vao src/messages/vi/ va src/messages/en/

KHONG viet code. Chi phan tich va output checklist.

---

### 3.2 - 02-project-setup

Kich hoat 02-project-setup

Context:
- Repo: d:/DATN/danangtrip-web
- Day co phai la lan dau setup project khong? <CO/KHONG>

Files bat buoc doc truoc:
- .agent/skills/02-project-setup/persona.md
- .agent/skills/02-project-setup/SKILL.md
- .agent/rules/PROJECT_RULES.md
- package.json (stack hien tai)
- tsconfig.json (path aliases: @/*, @/app/*, @/components/*, @/hooks/*, @/lib/*, @/services/*, @/types/*, @/utils/*, @/config/*, @/store/*)
- next.config.ts
- src/lib/axios.ts (HTTP client da co san - co fallback URL logic)
- src/providers/providers.tsx (providers da co san)

Stack hien tai (KHONG thay doi):
- Next.js 16.2.3, React 19.2.4, Tailwind 4
- TanStack Query v5, Zustand v5, next-intl v4, Zod v4, Axios v1
- Icons: Solar (src/components/icons/solar.tsx) + @iconscout/react-unicons + lucide-react
- Deploy: Cloudflare Workers via @opennextjs/cloudflare

Neu project da co (truong hop nay):
- Kiem tra dependencies trong package.json
- Kiem tra folder structure theo PROJECT_RULES Section 3
- Kiem tra path aliases trong tsconfig.json
- Kiem tra src/lib/axios.ts co fallback URL logic khong
- Kiem tra src/middleware.ts co dung cho Cloudflare OpenNext khong

Verify: npm run dev, npm run typecheck, npm run lint

---

### 3.3 - 03-types-api-contract

Kich hoat 03-types-api-contract

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- SRS/Analysis file: .agent/artifacts/analysis/YYYY-MM-DD__<feature-slug>__screen-analysis.md
- API endpoints: doc src/config/api.ts

Files bat buoc doc truoc:
- .agent/skills/03-types-api-contract/persona.md
- .agent/skills/03-types-api-contract/SKILL.md
- .agent/skills/03-types-api-contract/checklist.md
- .agent/skills/03-types-api-contract/template_api_contract.md
- .agent/rules/PROJECT_RULES.md (Sections 5, 11)
- src/config/api.ts (endpoints thuc te: AUTH, TOURS, LOCATIONS, SEARCH, BLOG, RATINGS, USER)
- src/types/api.types.ts (ApiResponse<T>, PaginatedResponse<T> - REUSE)
- src/types/entities.types.ts (entities hien co - REUSE truoc khi tao moi)
- src/types/auth.types.ts (User type - REUSE)
- src/services/tour.service.ts (pattern mau de follow)
- src/lib/axios.ts (dung api.get/post/put/patch/delete helper - KHONG dung raw axios)

Placement rules:
- Shared types (dung boi >= 2 features): src/types/<entity>.types.ts
- Feature-specific types: src/features/<feature>/types/index.ts
- Validators: src/features/<feature>/validators/<entity>.validator.ts
- Service: src/services/<feature>.service.ts

Service pattern bat buoc:
- Import api helper tu src/lib/axios.ts
- Moi function la async, typed day du input/output
- Khong chua business logic - chi transport
- Error: throw typed ApiResponse error (da xu ly trong interceptor)

Zod pattern:
- Export ca schema va inferred type
- Sync voi TypeScript types

Required outputs:
- src/types/<feature>.types.ts HOAC src/features/<feature>/types/index.ts
- src/features/<feature>/validators/<entity>.validator.ts
- src/services/<feature>.service.ts
- .agent/artifacts/api-contracts/YYYY-MM-DD__<feature-slug>__api-contract.md

---

### 3.4 - 04-layout-routing

Kich hoat 04-layout-routing

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- Route path: <vd: /tours, /tours/[slug], /profile>
- Layout requirements: <header+footer / fullpage / sidebar>
- Auth requirement: <public / protected / admin>

Files bat buoc doc truoc:
- .agent/skills/04-layout-routing/persona.md
- .agent/skills/04-layout-routing/SKILL.md
- .agent/skills/04-layout-routing/checklist.md
- .agent/rules/PROJECT_RULES.md (Sections 6, 8, 9)
- src/config/routes.ts (PUBLIC_ROUTES, AUTH_ROUTES, PROTECTED_ROUTES, PLANNED_ROUTES)
- src/i18n/routing.ts (locales: [vi, en], defaultLocale: vi, localePrefix: as-needed)
- src/i18n/navigation.ts (locale-aware Link, useRouter, usePathname)
- src/app/[locale]/layout.tsx (root layout hien co)
- src/middleware.ts (protected routes logic)
- src/components/layout/Header.tsx
- src/components/layout/Footer.tsx
- src/messages/vi/common.json (i18n keys mau)

Route structure:
- Public: src/app/[locale]/(main)/<route>/page.tsx
- Auth: src/app/[locale]/(auth)/<route>/page.tsx
- Protected: them vao PROTECTED_ROUTES trong src/config/routes.ts

Required outputs:
- src/app/[locale]/(main hoac auth)/<route>/page.tsx
- src/app/[locale]/(main hoac auth)/<route>/layout.tsx (neu can)
- Cap nhat src/config/routes.ts
- Cap nhat src/messages/vi/<feature>.json (tao moi neu chua co)
- Cap nhat src/messages/en/<feature>.json (PHAI dong bo voi vi)

Execution notes:
- use client chi khi can state/effect/event handler/browser API
- Page metadata dat o route level
- Locale-aware navigation: dung Link, useRouter tu src/i18n/navigation.ts
- Sau khi tao route: npm run check:routes

---

### 3.5 - 05-ui-components

Kich hoat 05-ui-components

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- Figma link: <link hoac NONE>
- Screen analysis: .agent/artifacts/analysis/YYYY-MM-DD__<feature-slug>__screen-analysis.md

Files bat buoc doc truoc:
- .agent/skills/05-ui-components/persona.md
- .agent/skills/05-ui-components/SKILL.md
- .agent/skills/05-ui-components/checklist.md
- DESIGN.md (BAT BUOC - design tokens)
- .agent/rules/PROJECT_RULES.md (Sections 11, 12, 21)
- src/components/ui/index.ts (components co san: Button, Input, Badge, Select, Loading, RatingStars, SearchInput)
- src/components/ui/Button.tsx (pattern mau)
- src/components/feedback/empty-state.tsx (empty state co san)
- src/components/icons/solar.tsx (Solar icon set - ICON SET CHINH)
- src/components/layout/AmbientBackground.tsx (WebGL background)
- src/features/tour/components/ (feature components mau)
- src/features/locations/components/ (feature components mau)

Design tokens bat buoc (tu DESIGN.md):
- Colors: primary #8B6A55, background #080808, surface #030303, text-primary #737373, text-secondary #FFFFFF, border #262626
- Typography: Inter (display), SFMono-Regular (body), Inter 14px/400 (label)
- Spacing: 4px base rhythm, scale: 1/4/8/12/16/24/32/48px
- Radii: 4px, 7px, 8px, 12px, 9999px
- Elevation: glass surfaces, 1px border #262626, 12px blur
- Motion: 150ms ease, reveal-up classes, stagger 100ms increments

Icon rules:
- CHINH: Solar iconset tu src/components/icons/solar.tsx
- PHU: @iconscout/react-unicons (import tu @iconscout/react-unicons)
- PHU: lucide-react (cho icons khong co trong Solar)
- KHONG dung icon set khac

Build order (Atomic Design):
1. Atoms: Button variants, Input, Badge, Skeleton, Spinner (src/components/ui/)
2. Molecules: FormField, CardItem, SearchBar (src/features/<feature>/components/ hoac src/components/common/)
3. Organisms: DataTable, FilterPanel, ModalForm (src/features/<feature>/components/)
4. Template: compose organisms thanh page sections

Strict rules:
- KHONG gan data that - chi props interface
- KHONG tao component moi neu da co tuong duong trong src/components/ui/
- Entrance animations: reveal-up CSS classes voi stagger reveal-delay-X (100ms increments)
- Glass surfaces: gradient border shell theo DESIGN.md Elevation section
- Responsive: mobile-first, Tailwind breakpoints

Required outputs:
- src/components/ui/<NewAtom>.tsx (shared atoms moi neu can)
- src/features/<feature>/components/<Component>.tsx (feature components)
- src/components/common/<Shared>.tsx (shared molecules neu dung boi >= 2 features)

---

### 3.6 - 06-data-integration

Kich hoat 06-data-integration

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- API service: src/services/<feature>.service.ts
- UI components: src/features/<feature>/components/
- TanStack Query key prefix: <feature>

Files bat buoc doc truoc:
- .agent/skills/06-data-integration/persona.md
- .agent/skills/06-data-integration/SKILL.md
- .agent/skills/06-data-integration/checklist.md
- .agent/rules/PROJECT_RULES.md (Sections 5, 7, 12, 13, 21)
- src/lib/react-query.ts (QueryClient config)
- src/providers/providers.tsx (QueryClientProvider setup)
- src/services/<feature>.service.ts (service functions)
- src/features/tour/hooks/ (hook patterns mau)
- src/features/locations/hooks/ (hook patterns mau)
- src/hooks/useDebounce.ts (debounce hook co san)
- src/components/feedback/empty-state.tsx (empty state co san)
- src/components/ui/Loading.tsx (loading component co san)

Hook patterns:
- READ: useQuery({ queryKey: [feature, list, params], queryFn: () => service.getList(params), staleTime: 5*60*1000 })
- MUTATION: useMutation({ mutationFn: service.create, onSuccess: () => { queryClient.invalidateQueries({queryKey:[feature]}); toast.success(t(create_success)); }, onError: (err) => toast.error(err.message) })
- Query key strategy: hierarchical [feature, resource, type/id]
- staleTime: 5-30 min cho non-volatile data

Data flow bat buoc:
- service (src/services/) -> hook (src/features/*/hooks/) -> UI component
- KHONG goi API truc tiep trong component
- KHONG hardcode mock data

States bat buoc:
- Loading: Skeleton screens (KHONG dung full-page spinner - tranh CLS)
- Error: normalize error -> toast.error() tu sonner (da xu ly trong axios interceptor)
- Empty: empty-state component hoac hide section (theo PROJECT_RULES Section 21)
- Success: hien thi data that

Server Component pattern (neu applicable):
- Goi API truc tiep (async function)
- Pass data xuong Client Component qua props

Required outputs:
- src/features/<feature>/hooks/use-<resource>.ts
- src/features/<feature>/components/<Component>.tsx (wired with data)
- src/features/<feature>/components/<Component>Skeleton.tsx

---

### 3.7 - 07-interactions

Kich hoat 07-interactions

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- SRS/AC list: <path hoac mo ta>
- Components da build: src/features/<feature>/components/

Files bat buoc doc truoc:
- .agent/skills/07-interactions/persona.md
- .agent/skills/07-interactions/SKILL.md
- .agent/skills/07-interactions/checklist.md
- .agent/rules/PROJECT_RULES.md (Sections 7, 9, 13)
- src/features/<feature>/validators/ (Zod schemas da co)
- src/features/<feature>/hooks/ (hooks da co)
- src/hooks/useDebounce.ts (debounce co san - REUSE, debounce 300ms)
- src/utils/validators.ts (validators co san - REUSE)
- src/utils/format.ts (format helpers co san - REUSE)
- src/messages/vi/<feature>.json
- src/messages/en/<feature>.json

Interaction patterns:
- Form: Zod validation + error messages dung i18n keys (KHONG hardcode text)
- CRUD: useMutation + invalidateQueries sau mutation
- Search: dung useDebounce hook (src/hooks/useDebounce.ts), debounce 300ms
- Pagination: sync query params voi URL (useSearchParams + useRouter)
- Filter/Sort: sync voi URL params
- Confirm dialog: conditional render (KHONG dung window.confirm)
- Toast: sonner toast.success/error/warning (KHONG hardcode message)

Moi interaction phai co:
- Success feedback: toast.success(t(action_success))
- Error feedback: toast.error(normalizedError)
- Loading state: button disabled + spinner trong khi pending

i18n rules:
- Moi user-facing text phai co i18n key
- Cap nhat ca src/messages/vi/ va src/messages/en/ cung luc
- Namespace: dung scoped useTranslations(feature) lam default

Required outputs:
- src/features/<feature>/components/ (form, filter, pagination components)
- src/features/<feature>/hooks/ (interaction hooks)
- Cap nhat src/messages/vi/<feature>.json
- Cap nhat src/messages/en/<feature>.json

---

### 3.8 - 08-auth-permissions

Kich hoat 08-auth-permissions

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- Required roles/permissions: <list: USER/ADMIN/STAFF hoac NONE>
- Protected routes: <routes can protect>

Files bat buoc doc truoc:
- .agent/skills/08-auth-permissions/persona.md
- .agent/skills/08-auth-permissions/SKILL.md
- .agent/skills/08-auth-permissions/checklist.md
- .agent/rules/PROJECT_RULES.md (Section 10)
- src/middleware.ts (Edge middleware - Cloudflare OpenNext, KHONG dung Node Proxy)
- src/store/auth.store.ts (Zustand auth store: user, token, isAuthenticated, login(), logout())
- src/utils/auth.helper.ts (getAccessToken, setAccessToken, clearTokens - dung Cookie js-cookie)
- src/lib/axios.ts (interceptor tu dong gan Bearer token - da co san, KHONG can them)
- src/features/auth/ (auth components, hooks, services mau)
- src/config/routes.ts (AUTH_ROUTES, PROTECTED_ROUTES, DASHBOARD_ROUTES)

Auth architecture hien tai:
- Source of truth: Zustand store (src/store/auth.store.ts) + persist vao localStorage
- Cookie sync: js-cookie qua src/utils/auth.helper.ts (cho Middleware + SSR)
- Token auto-attach: axios interceptor trong src/lib/axios.ts (KHONG can them)
- Refresh token: da xu ly trong src/lib/axios.ts (KHONG duplicate)
- Logout: useAuthStore.getState().logout() -> clearTokens() -> redirect /login

Middleware rules (src/middleware.ts):
- Cloudflare OpenNext: KHONG dung Node Proxy
- Kiem tra token tu Cookie
- Redirect unauthorized -> /login?redirect=<current-route>
- Bao gom locale trong redirect path

Role-based UI pattern:
  const { user } = useAuthStore();
  const canEdit = user?.role === ADMIN;
  {canEdit && <EditButton />}  // conditional render, KHONG CSS hide

Required outputs:
- src/middleware.ts (cap nhat neu can protect route moi)
- src/features/<feature>/components/ (permission-gated UI)
- src/hooks/use-permission.ts (neu can shared permission logic)
- Cap nhat .env.example neu them auth-related env vars

---

### 3.9 - 09-testing

Kich hoat 09-testing

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- SRS/AC: <path hoac mo ta>
- Code scope: src/features/<feature>/, src/app/[locale]/...

Files bat buoc doc truoc:
- .agent/skills/09-testing/persona.md
- .agent/skills/09-testing/SKILL.md
- .agent/skills/09-testing/checklist.md
- .agent/rules/PROJECT_RULES.md (Section 14)
- vitest.config.ts (test environment: jsdom, globals: true, setupFiles: ./src/test/setup.ts)
- package.json (devDependencies: vitest v4, @testing-library/react v16, @testing-library/jest-dom)
- src/features/<feature>/ (code can test)

Testing stack hien tai:
- Unit/Integration: Vitest v4 + @testing-library/react v16 + jsdom
- KHONG co Playwright setup (E2E manual hoac setup moi neu can)
- KHONG co MSW setup (mock truc tiep hoac setup moi neu can)
- Path alias: @/* -> src/* (da config trong vitest.config.ts)

Test file placement:
- Unit tests: src/features/<feature>/__tests__/<Component>.test.tsx
- Hook tests: src/features/<feature>/__tests__/<hook>.test.ts
- Util tests: src/utils/__tests__/<util>.test.ts

Mock strategy (khong co MSW):
- vi.mock(@/services/<feature>.service) -> mock tung function
- vi.mock(@/store/auth.store) -> mock auth state
- vi.mock(next-intl) -> mock useTranslations

States phai test: Loading, Empty, Error, Success

Coverage target: > 80% cho feature code

Required outputs:
- .agent/artifacts/test-cases/YYYY-MM-DD__<feature-slug>__testcases.md
- src/features/<feature>/__tests__/*.test.tsx
- src/features/<feature>/__tests__/*.test.ts

---

### 3.10 - 10-optimization-deploy

Kich hoat 10-optimization-deploy

Context:
- Repo: d:/DATN/danangtrip-web
- Feature slug: <feature-slug>
- Deploy target: Cloudflare Workers (PRIMARY)
- Environment: <dev/staging/prod>

Files bat buoc doc truoc:
- .agent/skills/10-optimization-deploy/persona.md
- .agent/skills/10-optimization-deploy/SKILL.md
- .agent/skills/10-optimization-deploy/checklist.md
- .agent/rules/PROJECT_RULES.md (Sections 6, 12, 14, 17, 21)
- DESIGN.md (motion tokens, animation rules)
- next.config.ts (images.unoptimized: true, compress: true, typescript.ignoreBuildErrors: true)
- open-next.config.ts (Cloudflare OpenNext config)
- wrangler.jsonc (Cloudflare Workers config)
- package.json (build scripts)
- .env.example

Build commands:
- Standard: npm run build (webpack mode, NODE_OPTIONS max-old-space-size=4096)
- Cloudflare: npm run build:cloudflare
- Preview: npm run preview:cloudflare
- Deploy: npm run deploy:cloudflare

Quality gates (PHAI pass truoc khi deploy):
- npm run lint
- npm run typecheck
- npm run check:routes
- npm run build

Performance checklist:
- React.memo cho expensive components (chi khi co evidence)
- dynamic import cho modals, heavy components (Three.js, Lottie)
- next/image cho tat ca images (luu y: images.unoptimized: true trong next.config.ts)
- staleTime hop ly trong TanStack Query hooks
- Entrance animations: reveal-up classes voi stagger reveal-delay-X (100ms increments)
- KHONG premature optimize

SEO:
- export const metadata: Metadata = { title, description, openGraph } o route level
- generateMetadata cho dynamic pages (tours/[slug], locations/[slug], blog/[slug])
- JSON-LD structured data cho Tour, Location pages

Cloudflare-specific notes:
- Middleware PHAI dung Edge Runtime (KHONG Node.js APIs)
- images.unoptimized: true (Cloudflare khong ho tro Next.js Image Optimization)
- Environment variables: set trong Cloudflare Dashboard hoac wrangler.jsonc

Smoke test sau deploy:
- Navigate to deployed URL -> page loads
- Test: home, locations, tours, blog, search, auth flow
- Verify i18n (switch vi/en)
- Browser console: khong co errors

Required outputs:
- .agent/artifacts/deploy/YYYY-MM-DD__<feature-slug>__deploy-report.md

---

## 4) Thu tu chay cho 1 feature

1. 01-screen-analysis      -> Output: screen analysis + checklist
2. 02-project-setup        -> Output: project audit (chi lan dau hoac khi co van de)
3. 03-types-api-contract   -> Output: types + validators + service + api contract
4. 04-layout-routing       -> Output: routes + layout + i18n keys
5. 05-ui-components        -> Output: UI components pixel-perfect (khong data)
6. 06-data-integration     -> Output: UI + data that + loading/error/empty states
7. 07-interactions         -> Output: CRUD + filter + search + pagination
8. 08-auth-permissions     -> Output: auth + permissions (neu can)
9. 09-testing              -> Output: test cases + unit tests
10. 10-optimization-deploy -> Output: optimized + deployed

---

## 5) Checklist truoc khi goi hoan thien

- [ ] UI giong Figma (pixel-perfect, responsive, dark mode)
- [ ] Design tokens dung (mau, spacing, radii, motion theo DESIGN.md)
- [ ] API integrate xong, data hien thi dung (khong mock data)
- [ ] Day du states: loading (skeleton), error (toast), empty (empty-state), success
- [ ] Form validate dung business rules (Zod + i18n error messages)
- [ ] Auth/permission hoat dong (conditional render, khong CSS hide)
- [ ] i18n: vi/en dong bo, khong hardcode text
- [ ] Query keys hierarchical, staleTime hop ly
- [ ] Test pass (unit tests)
- [ ] npm run lint pass
- [ ] npm run typecheck pass
- [ ] npm run check:routes pass
- [ ] npm run build pass (khong loi)
- [ ] Deploy thanh cong (Cloudflare), smoke test OK
- [ ] Entrance animations: reveal-up classes voi stagger

---

## 6) Cac loi thuong gap va cach tranh

| Loi | Nguyen nhan | Cach tranh |
|-----|-------------|------------|
| Import type error | Dung import thay vi import type cho types | Dung import type cho type-only imports |
| Hardcode text | Quen i18n | Moi text phai co key trong src/messages/ |
| API call trong component | Bo qua service layer | Luon: service -> hook -> UI |
| CSS hide permission | Nham bao mat | Dung conditional render |
| Duplicate auth store | Tao store moi | Dung useAuthStore tu src/store/auth.store.ts |
| Wrong icon import | Nhieu icon sets | Solar (src/components/icons/solar.tsx) la chinh |
| Node.js API trong middleware | Cloudflare Edge Runtime | Middleware chi dung Edge-compatible APIs |
| Mock data trong production | Quen xoa mock | Empty state hoac hide section, KHONG fake data |
| Missing vi/en sync | Cap nhat 1 locale | Luon cap nhat ca 2 locale cung luc |
| Spinner thay vi skeleton | Quen PROJECT_RULES | Loading = Skeleton screens (tranh CLS) |
