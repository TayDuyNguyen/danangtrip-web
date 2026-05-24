# Screen Analysis: Blog theo Danh mục (user-blog-by-category)

- **Feature Slug**: `user-blog-by-category`
- **Screen Name**: Blog theo Danh mục
- **Public Route**: `/blog?category_id={id}`
- **Target Page Path**: `src/app/[locale]/(main)/(public)/blog/page.tsx`
- **Target Feature Folder**: `src/features/blog`
- **Primary Document**: `D:\DATN\DATN_Document\docs\page\user_blog_by_category.md`
- **Supporting Document**: `D:\DATN\DATN_Document\docs\page\user_blog_list.md`

---

## 1. Purpose of the Screen
This screen displays blog posts filtered under a specific blog category (e.g., "Tham quan", "Ẩm thực") in the Da Nang Trip application. It is the same route and layout as the main Blog List page (`/blog`), but loaded with a specific `category_id` query parameter. It is a public screen accessible without logging in.

---

## 2. API Contract & Parameters

### Primary Endpoint
- **GET** `/blog`
- **Supported parameters**:
  - `category_id` (integer): ID of the blog category to filter posts
  - `page` (integer): Page number (starts at 1)
  - `per_page` (integer): Posts limit per page (default 9)
  - `sort` (string): Order of posts, either `latest` or `popular`

### Supporting Endpoint
- **GET** `/blog/categories`
- **Response shape**: Returns a list of blog categories, including ID, name, slug, and post count:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Du lịch Đà Nẵng",
      "slug": "du-lich-da-nang",
      "post_count": 12
    }
  ]
}
```

---

## 3. Reusable Patterns & Components
Since the screen shares the exact same layout as the main Blog List page, we can reuse these existing structures:
- **`BlogContent`** (`src/features/blog/components/BlogContent.tsx`): The main content organizer containing lists, headers, skeletons, and layouts.
- **`BlogSidebar`** (`src/features/blog/components/BlogSidebar.tsx`): Displays categories, popular posts, and tags.
- **`PostCard`** / `FeaturedPost`: Standard visual components for rendering post item previews.
- **`BlogCategoryScrollRow`** (`src/features/blog/components/BlogCategoryScrollRow.tsx`): Already defined in the folder but not yet imported or rendered. We will wire it into the `BlogContent` shell.

---

## 4. Gaps and Mismatches Identified
- **Category Tabs Integration**: `BlogCategoryScrollRow` exists but is currently completely unreferenced. It needs to be integrated at the top of `BlogContent` to display horizontal category pills with scrolling arrows.
- **Theme Color Discrepancy**: The original screen requirement document asks for `#0066CC` (blue) highlight states for active categories/tabs. However, according to `DESIGN.md`, the platform theme specifies `#8B6A55` as the primary accent and `#080808` as the dark background. We will use the `#8B6A55` primary color to keep visual coherence.
- **Invalid Category query state**: If an invalid `category_id` is passed, the UI must show a specific not-found notification with a CTA to return to `/blog` rather than crashing or showing a raw error.
- **Empty Category state**: If a category exists but contains 0 articles, it should show a specific localized message: `"Chưa có bài viết trong danh mục này"` (VI) / `"No articles in this category yet"` (EN).
- **Layout Shift (CLS)**: The current loading flow changes the whole rendering structure, causing layout shift. Restructuring it to keep the sidebar and category tabs visible as skeletons will yield a much smoother transition.

---

## 5. Potential Risks & Safety Measures
- **Risk**: Adding category parameters validation inside `BlogContent.tsx` might trigger false-positive invalid states while `categories` list is still loading.
  - *Mitigation*: Ensure the invalid state is only triggered when `isLoading` for category data is false, the category list is loaded, and the category ID is not found in the list.
- **Risk**: Type mismatch during comparisons (e.g. `filters.category_id` parsed as a string vs `cat.id` which is a number).
  - *Mitigation*: Perform type coercion explicitly (e.g. `Number(selectedCategoryId) === cat.id`).
