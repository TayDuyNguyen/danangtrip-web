# Skill: 01-screen-analysis (Phân tích màn hình)

## 0) Tuyên bố tự mô tả
Skill này **tự chứa toàn bộ quy tắc và checklist**. Khi kích hoạt, đọc toàn bộ file trong folder này trước khi làm.

## 1) Goal
Phân tích 1 màn hình từ PRD/Figma/mockup và output ra **checklist triển khai** bao gồm:
- UI elements cần build
- API calls cần gọi
- Business rules cần tuân thủ
- States cần xử lý

**KHÔNG viết code ở bước này.**

## 2) Persona (mandatory)
Đóng vai: **Business Analyst (BA)**. Đọc `persona.md` trước khi làm.

## 3) Input & Context (must read first)
- `persona.md`
- PRD/SRS/meeting notes do người dùng cung cấp
- Figma link hoặc mockup screenshots
- `DESIGN.md` (design tokens hiện tại)
- `.agent/rules/PROJECT_RULES.md` (hiểu repo conventions)
- `d:/DATN/DATN_Tài liệu/docs/api/api_list.md` — **NGUỒN CHÂN LÝ API** (184 endpoints, params, DB tables, auth level, branch Git)
- `src/config/api.ts` (các endpoints frontend đã đăng ký)
- `.agent/memory/project-map.md` (hiểu cấu trúc hiện tại)

## 4) Workflow

### 4.1 Phân tích Design (từ Figma/mockup)
1. **Design tokens cần thiết**: color, spacing, radius, typography, shadow, blur — đối chiếu với `DESIGN.md`.
2. **Component breakdown**:
   - `[REUSE]`: components đã có trong `src/components/ui`, `src/components/layout`, `src/features/*/components`
   - `[NEW]`: components cần tạo mới
   - `[MOD]`: components cần chỉnh sửa
3. **Responsive behavior**: mobile / tablet / desktop breakpoints.
4. **UI States**: loading (skeleton), empty, error, success, disabled, hover/focus.

### 4.2 Phân tích Data
5. **Data fields**: field name, type, required/optional, validation rules, example value.
6. **API endpoints**: method, path, request/response shape, auth requirements.
7. **Data flow**: xác định Server Component vs Client Component.

### 4.3 Phân tích Business
8. **Business rules**: liệt kê BR-xx cho màn này.
9. **Actors & permissions**: ai được truy cập, ai được CRUD.
10. **Edge cases**: timeout, partial data, concurrent edit, large dataset.

### 4.4 Output Checklist
11. Tổng hợp thành checklist triển khai có structure rõ ràng.

## 5) Strict Rules
- **Không bịa business rule**: thứ không chắc → ghi `[ASSUMPTION]` + "cần xác nhận".
- **Không viết code**: output chỉ là tài liệu phân tích.
- **Không skip UI states**: mỗi component phải liệt kê đủ states.
- **Đối chiếu DESIGN.md**: mọi token phải match, conflict phải flag.
- **Xác nhận endpoint qua api_list.md**: không tự suy diễn path/method — đối chiếu `DATN_Tài liệu/docs/api/api_list.md` trước khi ghi vào analysis.

## 6) Output specification
Tạo file tại:
- `.agent/artifacts/analysis/YYYY-MM-DD__<feature-slug>__screen-analysis.md`

Dùng template: `template_screen_analysis.md`

## 7) Control
Đối chiếu `checklist.md` và báo cáo Pass/Fail từng mục.
