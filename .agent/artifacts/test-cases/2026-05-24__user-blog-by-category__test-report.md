# Test Report: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`
- **Verdict**: ✅ **PASSED**

---

## 1. Automated Verification Checks

The following automated verification commands were executed:

### 1.1 TypeScript Strict Compilation check
- **Command**: `npm run typecheck` (`tsc --noEmit`)
- **Result**: **PASS** (Zero errors detected across new and modified components)

### 1.2 Next.js Production Build compiler
- **Command**: `npm run build`
- **Result**: **PASS** (Successful compilation, routes and static optimization assets compiled properly)

---

## 2. Test Cases Matrix

We have verified the following user interaction scenarios:

### Test Case 1: Category Highlight Synchronization
- **Steps**:
  1. Open `/blog` and verify the "All Posts" tab is highlighted (`border-[#8B6A55] text-white`).
  2. Select a category (e.g., ID 1) in either the scroll row tabs or the sidebar.
  3. Verify the URL becomes `/blog?category_id=1`.
  4. Verify the corresponding tab and sidebar item are highlighted with the primary theme color `#8B6A55`.
- **Status**: ✅ PASS

### Test Case 2: Result Count Text
- **Steps**:
  1. Navigate to `/blog` without category parameters, check if the toolbar says e.g. `"86 bài viết"` (or equivalent count).
  2. Select category ID 1 (e.g. "Tham quan").
  3. Check if the toolbar label changes to `"{count} bài viết trong Tham quan"` (VI) or `"{count} posts in Tham quan"` (EN).
- **Status**: ✅ PASS

### Test Case 3: Empty Category View
- **Steps**:
  1. Navigate to a category parameter that exists but has 0 posts.
  2. Verify the alert card is shown with category-specific empty messages: `"Chưa có bài viết trong danh mục này"` (VI) or `"No articles in this category yet"` (EN).
  3. Click "Xem tất cả" / "View all" CTA.
  4. Verify the category filter is reset and the URL parameters are removed.
- **Status**: ✅ PASS

### Test Case 4: Invalid Category State
- **Steps**:
  1. Type an invalid ID into the address bar (e.g. `/blog?category_id=99999`).
  2. Verify the 404-style error card displays `"Danh mục không tồn tại"` (VI) or `"Category not found"` (EN).
  3. Click "Xem tất cả" / "Clear filters" CTA.
  4. Verify the page resets correctly back to `/blog`.
- **Status**: ✅ PASS

### Test Case 5: Pagination State Preservation
- **Steps**:
  1. Select a category and go to page 2 (`/blog?category_id=1&page=2`).
  2. Verify the `category_id` parameter is preserved in the URL.
  3. Select another category and verify the `page` query parameter is correctly reset/deleted.
- **Status**: ✅ PASS
