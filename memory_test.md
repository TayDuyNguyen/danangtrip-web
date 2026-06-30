# QA memory — danangtrip-web

| ID | Module | Loại | Severity | Phát hiện | Đề xuất | File / vùng | Auto? | Trạng thái |
|----|--------|------|----------|-----------|---------|-------------|-------|------------|
| IMP_HOME_001 | home | UX | P2 | Header desktop chỉ hiện icon nav; label ẩn đến khi hover/xl | Thêm `aria-label` hoặc luôn hiện text trên lg | `Header.tsx` | TC_HOME_001 | **fixed** |
| IMP_HOME_002 | home | Function | P1 | Testcase doc TC_HOME_003 ghi chọn ngày + redirect `/tours` | Cập nhật doc (đã sửa); cân nhắc date filter nếu product cần | `Hero.tsx` | TC_HOME_003 | fixed-doc |
| IMP_HOME_003 | home | Function | P1 | TC_HOME_004 doc ghi click danh mục → tour; có 2 carousel | Tách TC 004a/004b trong doc | `CategoryGrid.tsx`, `TourCategories.tsx` | ✅ | fixed-doc |
| IMP_HOME_004 | home | UX | P2 | Carousel prev/next chỉ hiện khi hover | `lg:opacity-70` mặc định trên desktop | `FeaturedTours.tsx`, … | TC_HOME_005 | **fixed** |
| IMP_HOME_005 | home | UI/UX | P3 | Footer social disabled khi config thiếu URL | Seed `app_config.social_links` đầy đủ cho QA | `Footer.tsx` | manual | open |
| IMP_HOME_006 | home | UX/a11y | P1 | Dot slide hero không click được | Controlled `slideIndex` + `onClick` trên dots | `Hero.tsx`, `IntroScene.tsx` | TC_HOME_009 | **fixed** |
| IMP_SEARCH_001 | search | Doc | P2 | Doc TC_SEARCH_002 ghi tab Bài viết | UI chỉ 3 tab; doc đã sửa | `12_search.md` | TC_SEARCH_002 | fixed-doc |
| IMP_SEARCH_002 | search | Doc | P3 | Empty title doc nhúng từ khóa | Thực tế: "Không tìm thấy kết quả" cố định | `SearchResultsClient.tsx` | TC_SEARCH_003 | fixed-doc |
| IMP_SEARCH_003 | search | Doc | P3 | Doc TC_SEARCH_001 ghi "Kết quả tìm kiếm cho …" | Thực tế: `found_results` rich text | `search.json` | TC_SEARCH_001 | fixed-doc |
| IMP_SEARCH_004 | search | Function | P1 | Nút "Tìm kiếm" không `commitSearch`; Enter dùng `inputValue` cũ | `onSubmit` + `event.currentTarget.value` trên Enter | `SearchInput.tsx`, `SearchResultHeader.tsx` | TC_SEARCH_009 | **fixed** |
