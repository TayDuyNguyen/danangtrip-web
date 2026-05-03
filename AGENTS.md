# DanangTrip Web - Agent Prompt Playbook (Pipeline 10 Bước)

Tài liệu này chứa các **Master Prompts** để điều khiển AI/Codex (Gemini/Claude/GPT-4) thực hiện việc code UI từ Figma và tích hợp API từ A đến Z, bám sát kiến trúc của `danangtrip-web` thông qua bộ 10 skills trong `.agent/skills/`.

Mục tiêu của bộ prompt này:
- Bắt buộc AI đọc rule, hiểu rule và sử dụng đúng skill folder.
- Không quên context trong quá trình làm dài.
- Tự động mồi AI chạy tuần tự từ bước 1 (Analysis) đến bước 10 (Deploy), dừng chờ đúng lúc.

---

## 1. MỘT PROMPT CHẠY TỪ A → Z (Master Auto-Run Prompt)

Sử dụng prompt này khi bạn muốn AI tự động phân tích và chạy toàn bộ pipeline. Prompt này ép AI phải "nhìn" vào bộ kỹ năng (skills), tự định vị mình đang ở đâu, và tuân thủ tuyệt đối quy trình.

**Hãy copy và paste prompt dưới đây vào AI:**

> **SYSTEM BOOTSTRAP & MASTER EXECUTION INSTRUCTIONS**
> 
> Act as the **Principal AI Engineer** for the repository `d:/DATN/danangtrip-web`. You are about to execute a full 10-step A→Z feature implementation pipeline for a new screen/feature.
> 
> **FEATURE CONTEXT:**
> - Feature Name/Slug: `[NHẬP TÊN FEATURE, VD: user-profile]`
> - Figma Link: `[NHẬP LINK FIGMA]`
> - PRD/API Docs: `[NHẬP ĐƯỜNG DẪN HOẶC MÔ TẢ]`
> 
> **MANDATORY RULES OF ENGAGEMENT:**
> 1. You MUST operate strictly using the 10 skills defined in `.agent/skills/STACK_SKILLS_INDEX.md`. Do NOT use your generic knowledge; rely ONLY on the conventions, templates, and checklists within this repository.
> 2. For each step `X` in the pipeline (from 01 to 10), before you do ANY work, you MUST read the following files in `.agent/skills/[skill-id]/`:
>    - `SKILL.md` (to understand the goal and workflow)
>    - `persona.md` (to adopt the exact persona required, e.g., BA, Architect, QA)
>    - `checklist.md` (to know your acceptance criteria)
>    - `template_*.md` (if it exists, use it exactly for your output)
> 3. You must also read `.agent/rules/PROJECT_RULES.md` and `DESIGN.md` as your ultimate source of truth for code quality and UI tokens.
> 
> **EXECUTION PIPELINE:**
> You will execute the following steps sequentially. (Note: Step 02 can be skipped if the project is already running).
> - **[01-screen-analysis]**: Analyze the requirements and Figma. Produce the analysis artifact.
> - **[02-project-setup]**: Setup/audit base project.
> - **[03-types-api-contract]**: Define TS types, Zod schemas, and API service.
> - **[04-layout-routing]**: Create routes, metadata, layout, and i18n structure.
> - **[05-ui-components]**: Build UI using Atomic Design, matching DESIGN.md tokens.
> - **[06-data-integration]**: Wire API to UI using TanStack Query, handling loading/error/empty states.
> - **[07-interactions]**: Implement forms, CRUD, search, pagination.
> - **[08-auth-permissions]**: Apply role-based rendering and middleware protection.
> - **[09-testing]**: Write test cases, MSW mocks, and unit tests.
> - **[10-optimization-deploy]**: Check Lighthouse rules, build, and deploy.
> 
> **YOUR RESPONSE FORMAT FOR EVERY STEP:**
> To ensure you never lose context, your output for each step MUST end with this exact block:
> ```
> 🛠️ **CURRENT SKILL**: `[Skill Name]` completed.
> ✅ **CHECKLIST VERIFIED**: [List 2-3 key checklist items you just passed from checklist.md]
> 📂 **FILES CREATED/MODIFIED**: [List files]
> ⏳ **NEXT SKILL**: `[Next Skill Name]`. 
> 🛑 "Xin hãy gõ 'tiếp tục' hoặc 'next' để tôi thực hiện skill tiếp theo, hoặc đưa ra feedback để tôi sửa lại bước này."
> ```
> 
> **Now, begin with Step 01: `01-screen-analysis`. Read its folder contents, adopt the Business Analyst persona, execute the analysis, output the artifact, and wait for my command.**

---

## 2. PROMPT CHẠY TỪNG BƯỚC (Manual Step-by-Step)

Nếu bạn không muốn AI tự động nhảy cóc, mà muốn điều khiển từng bước thật cẩn thận, hãy dùng `STACK_SKILLS_INDEX.md` làm gốc. Đây là mẫu prompt gọi trực tiếp 1 skill cụ thể (Ví dụ: `05-ui-components`):

**Copy và paste:**

> Kích hoạt skill: `[NHẬP TÊN SKILL, VD: 05-ui-components]`
> 
> **Context:**
> - Repo: `d:/DATN/danangtrip-web`
> - Feature slug: `[FEATURE_SLUG]`
> - Reference: `[LINK FIGMA HOẶC ĐƯỜNG DẪN OUTPUT TỪ BƯỚC TRƯỚC]`
> - PRD/API Docs: Đọc tài liệu tại `D:\DATN\DATN_Tài liệu`
> 
> **Yêu cầu bắt buộc:**
> 1. Đọc ngay `persona.md` trong `.agent/skills/[tên-skill]/` và nhập vai tương ứng.
> 2. Đọc `SKILL.md` để lấy workflow và tuân thủ 100%.
> 3. Áp dụng `PROJECT_RULES.md` và `DESIGN.md`.
> 4. Thực hiện các thay đổi code / document cần thiết.
> 5. Làm xong, lấy file `checklist.md` ra tự chấm điểm Pass/Fail cho từng dòng và báo cáo.
> 6. Trả về format: `DONE | DOING | NEXT`.

---

## 3. PROMPT REVIEW / FIX BUG (Giữ nguyên bối cảnh)

Khi code xong màn hình mà bị lỗi (hoặc bạn muốn AI review lại dựa trên chuẩn của repo), hãy dùng prompt này để ép AI dò lỗi theo system thay vì tự đoán mò:

**Copy và paste:**

> Kích hoạt quy trình Review / Fix Bug cho repo `d:/DATN/danangtrip-web`
> 
> **Context:**
> - File / Route bị lỗi: `[ĐƯỜNG DẪN FILE]`
> - Mô tả lỗi: `[MÔ TẢ NGẮN GỌN]`
> 
> **Quy trình Audit (Vui lòng đọc và tuân thủ):**
> 1. Đọc lại `.agent/rules/PROJECT_RULES.md` (chú ý phần Architecture, Data Integration, i18n, Error Handling).
> 2. Kiểm tra lại luồng data theo rule: `Service → TanStack Query Hook → UI`. API có gọi trực tiếp trong UI không? (Nếu có là sai).
> 3. Kiểm tra UI States: Đã có đủ Skeleton (loading), Empty state, Error Boundary/Toast chưa?
> 4. Kiểm tra i18n: Có hardcode text không? (Tuyệt đối cấm).
> 5. Kiểm tra Types: Có lọt chữ `any` nào không?
> 
> **Action:**
> - Phân tích nguyên nhân gốc rễ (Root Cause).
> - Viết code fix trực tiếp.
> - Chạy `npm run typecheck` và `npm run lint` sau khi sửa.
> - Trả về danh sách file đã đổi và kết quả test.
