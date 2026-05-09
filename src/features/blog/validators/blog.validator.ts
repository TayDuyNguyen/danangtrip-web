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
