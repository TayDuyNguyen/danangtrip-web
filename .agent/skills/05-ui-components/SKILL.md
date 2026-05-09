# Skill: 05-ui-components (Xây dựng UI Components — Atomic Design)

## 0) Tuyên bố tự mô tả
Skill này chịu trách nhiệm build UI components theo Atomic Design methodology, pixel-perfect với Figma, tuân thủ `DESIGN.md` tokens.

## 1) Goal
Build UI components **từ trong ra ngoài** theo Atomic Design:
1. **Atoms**: Button, Input, Badge, Avatar, Skeleton...
2. **Molecules**: SearchBar, FormField, CardItem...
3. **Organisms**: DataTable, FilterPanel, ModalForm...
4. **Templates**: Compose organisms thành sections của màn

Output: **UI giống Figma 100%, responsive, tuân thủ design tokens**.

## 2) Persona (mandatory)
Đóng vai: **UI/UX Designer + Senior Software Engineer**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- `DESIGN.md` (design tokens — BẮT BUỘC đọc)
- `.agent/rules/PROJECT_RULES.md` (Sections 11, 12, 21)
- Screen analysis: `.agent/artifacts/analysis/`
- Figma link/mockup (do user cung cấp)
- Existing components: `src/components/ui/`, `src/components/layout/`, `src/components/common/`
- Existing feature components: `src/features/*/components/`

## 4) Workflow

### 4.1 Design Token Alignment
1. Đối chiếu Figma với `DESIGN.md`:
   - Colors: `#8B6A55` primary, `#080808` background, etc.
   - Typography: Inter display, SFMono body
   - Spacing: 4px base rhythm
   - Radii: 4px, 7px, 8px, 12px, 9999px
   - Elevation: glass surfaces, 1px borders, 12px blur
2. Nếu Figma có token mới → flag, KHÔNG tự thêm vào `DESIGN.md`.

### 4.2 Reuse Audit
3. Scan `src/components/ui/` → liệt kê components reusable.
4. Scan `src/components/common/` → liệt kê shared components.
5. Chỉ tạo mới khi KHÔNG có component phù hợp.

### 4.3 Build Atoms (nếu cần tạo mới)
6. Atoms = smallest building blocks:
   - Button variants (primary, secondary, ghost, link)
   - Input fields (text, select, checkbox, radio)
   - Badge, Tag, Avatar, Skeleton, Spinner
7. Placement: `src/components/ui/<ComponentName>.tsx`
8. Props interface rõ ràng, typed, no `any`.

### 4.4 Build Molecules
9. Molecules = atoms kết hợp:
   - SearchBar = Input + Button + Icon
   - FormField = Label + Input + ErrorMessage
   - CardItem = Image + Title + Badge + Actions
10. Placement: `src/features/<feature>/components/` hoặc `src/components/common/`

### 4.5 Build Organisms
11. Organisms = molecules + logic phức tạp:
    - DataTable = Header + Rows + Pagination + Sort indicators
    - FilterPanel = SearchBar + Select + DatePicker + Apply/Reset
    - ModalForm = Dialog + Form + Submit/Cancel
12. Placement: `src/features/<feature>/components/`

### 4.6 Compose Template
13. Template = Compose organisms thành page section:
    - Header section
    - Content area (table/list/grid)
    - Sidebar (filters/details)
    - Footer/pagination

### 4.7 Responsive & States
14. Responsive: mobile-first, Tailwind breakpoints.
15. States qua props:
    - `isLoading` → render Skeleton
    - `isEmpty` → render Empty state
    - `error` → render Error state
    - Hover/Focus: CSS transitions theo `DESIGN.md` motion tokens

## 5) Strict Rules
- **Pixel-perfect**: match Figma layout, spacing, typography.
- **Design tokens only**: KHÔNG tự ý dùng colors/spacing ngoài `DESIGN.md`.
- **Reuse first**: KHÔNG tạo component mới nếu đã có tương đương.
- **Props interface**: mỗi component PHẢI có typed props.
- **No data fetching**: components chỉ nhận data qua props — không gọi API trong component.
- **Icons**: chỉ dùng Solar iconset (`@/components/icons/solar` hoặc `lucide-react`).
- **Motion**: theo `DESIGN.md` motion tokens (150ms, ease, cubic-bezier).
- **Glass surfaces**: border gradient shell theo `DESIGN.md` Elevation section.
- **Entrance animations**: `reveal-up` classes cho sections.

## 6) Output specification
Files tạo/sửa:
- `src/components/ui/<NewAtom>.tsx` (shared atoms)
- `src/features/<feature>/components/<Component>.tsx` (feature components)
- `src/components/common/<Shared>.tsx` (shared molecules nếu cần)

## 7) Control
Đối chiếu `checklist.md` và report Pass/Fail.
