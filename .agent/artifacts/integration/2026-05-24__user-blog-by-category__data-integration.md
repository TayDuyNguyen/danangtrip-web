# Data Integration: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`

---

## 1. Data Sources Mapping

| Data Source | Service Method | Purpose | Ownership |
|---|---|---|---|
| `GET /v1/blog` | `blogService.getLatest` | Fetch paginated, category-filtered blog posts. | Client Query (`useBlogPosts`) |
| `GET /v1/blog/categories` | `blogService.getSidebarData` | Fetch categories list and popular posts. | Client Query (`useBlogSidebar`) |

---

## 2. Query Strategy

We utilize the existing hierarchical react-query hooks inside `src/features/blog/hooks/useBlog.ts`:

- **`useBlogPosts(filters)`**:
  - Query Key: `["blog", "list", filters]`
  - staleTime: 5 minutes (`5 * 60 * 1000`)
  - Trigger: Auto-triggers on mount or when `filters` changes (e.g. `category_id`, `page` updates).

- **`useBlogSidebar()`**:
  - Query Key: `["blog", "sidebar"]`
  - staleTime: 15 minutes (`15 * 60 * 1000`)
  - Trigger: Auto-triggers on mount.

---

## 3. UI States & Skeletons Flow

### 3.1 Skeleton Screen (CLS Avoidance)
To prevent Cumulative Layout Shift, when `useBlogSidebar` or `useBlogPosts` is in `isLoading` state:
- Category tabs row renders `CategoryTabsSkeleton` (5 gray rounded pills) if categories are still loading.
- Sidebar renders `SidebarSkeleton` if categories/popular posts are loading.
- Posts list area renders `FeaturedPostSkeleton` + `PostCardSkeleton` grid if posts are loading.

This splits loading states locally, keeping elements stable.

### 3.2 Empty & Invalid States
- **Invalid Category**: When `useBlogSidebar` is loaded, but the `category_id` parameter from URL does not match any ID in the categories list, we halt grid query renders and display the invalid category card.
- **Empty Category**: When a valid category is selected but the post query returns an empty collection (`posts.length === 0`), we display the empty category message, recommending other categories or a reset button.

---

## 4. Expected File Modifications

- `src/features/blog/components/BlogSkeleton.tsx` - Implement `CategoryTabsSkeleton`.
- `src/features/blog/components/BlogContent.tsx` - Layout updates integrating scroll row and loading flow logic.
- `src/features/blog/components/BlogSidebar.tsx` - Safe type comparison for selected categories.
- `src/messages/vi/blog.json` / `src/messages/en/blog.json` - i18n messages sync.
