# API Contract: Blog theo Danh mục (user-blog-by-category)

- **Date**: 2026-05-24
- **Feature Slug**: `user-blog-by-category`

---

## 1. Endpoints & Transport

This feature utilizes two main public endpoints on the Laravel API:

### 1.1 Get Paginated Blogs List
- **Method / Path**: `GET /v1/blog`
- **Auth required**: No (Public)
- **Role restrictions**: None
- **Request parameters**:
  - `category_id` (integer | optional): Filters posts by category ID. Checked against existing `blog_categories.id`.
  - `page` (integer | optional): Starts at 1.
  - `per_page` (integer | optional): Limit per page (default 9, max 100).
  - `sort` (string | optional): `latest` (default) or `popular`.

- **Response envelope** (standard Laravel paginated structure wrapped in axios interceptor ApiResponse):
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "title": "Kinh nghiệm du lịch Đà Nẵng tự túc",
        "slug": "kinh-nghiem-du-lich-da-nang-tu-tuc",
        "excerpt": "Cẩm nang chia sẻ những kinh nghiệm đi lại, ăn uống...",
        "content": "<p>Nội dung chi tiết...</p>",
        "featured_image": "/images/discovery/bana-hills.png",
        "author_id": 2,
        "view_count": 856,
        "status": "published",
        "published_at": "2026-05-24T12:00:00.000000Z",
        "created_at": "2026-05-24T12:00:00.000000Z",
        "updated_at": "2026-05-24T12:00:00.000000Z",
        "author": {
          "id": 2,
          "full_name": "Nguyễn Văn A",
          "avatar": "/images/avatars/user-1.png"
        },
        "categories": [
          {
            "id": 1,
            "name": "Du lịch Đà Nẵng",
            "slug": "du-lich-da-nang"
          }
        ]
      }
    ],
    "first_page_url": ".../blog?page=1",
    "from": 1,
    "last_page": 5,
    "last_page_url": ".../blog?page=5",
    "next_page_url": ".../blog?page=2",
    "path": ".../blog",
    "per_page": 9,
    "prev_page_url": null,
    "to": 9,
    "total": 45
  },
  "message": "Success"
}
```

### 1.2 Get Categories List
- **Method / Path**: `GET /v1/blog/categories`
- **Auth required**: No (Public)
- **Response shape**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Du lịch Đà Nẵng",
      "slug": "du-lich-da-nang",
      "post_count": 12,
      "posts_count": 12
    }
  ],
  "message": "Success"
}
```

---

## 2. TypeScript Types

Expected structures in `src/features/blog/types/index.ts`:

```typescript
export interface BlogFilterParams {
  page?: number;
  per_page?: number;
  category_id?: number | string;
  search?: string;
  sort?: 'latest' | 'popular' | 'oldest';
  tag?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
  post_count: number;
}

export interface BlogSidebarData {
  categories: BlogCategory[];
  popular_posts: BlogPost[];
  tags: string[];
}
```

---

## 3. Boundary Validators

Using Zod (`src/features/blog/validators/blog.validator.ts`):

```typescript
import { z } from "zod";

export const blogFilterSchema = z.object({
  page: z.number().int().min(1).optional(),
  per_page: z.number().int().min(1).max(100).optional(),
  category_id: z.union([z.number().int(), z.string()]).optional(),
  search: z.string().optional(),
  sort: z.enum(['latest', 'popular', 'oldest']).optional(),
  tag: z.string().optional(),
});

export type BlogFilterInput = z.infer<typeof blogFilterSchema>;
```

---

## 4. Service Actions

Axios transport interface in `src/services/blog.service.ts`:

- `blogService.getLatest(params)`: Sends `GET /blog` with parameters, returning paginated blog posts.
- `blogService.getSidebarData()`: Calls `GET /blog/categories` and `GET /blog?sort=popular&per_page=5` concurrently, compiling the sidebar dataset.

No modifications to transport methods are required as they already fully map parameters.
