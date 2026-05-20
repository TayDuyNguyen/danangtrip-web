import { z } from "zod";

export const tourFiltersSchema = z.object({
  search: z.string().optional(),
  tour_category_id: z.coerce.number().int().positive().optional(),
  price_min: z.coerce.number().int().nonnegative().optional(),
  price_max: z.coerce.number().int().nonnegative().optional(),
  duration: z.string().optional(),
  available_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  available_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").optional(),
  sort_by: z.enum(["created_at", "price_adult", "view_count", "name", "rating_avg", "booking_count"]).optional(),
  sort_order: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  per_page: z.coerce.number().int().positive().max(100).optional(),
}).refine(data => {
  if (data.price_min !== undefined && data.price_max !== undefined) {
    return data.price_min <= data.price_max;
  }
  return true;
}, {
  message: "Minimum price must be less than or equal to maximum price",
  path: ["price_max"],
}).refine(data => {
  if (data.available_from !== undefined && data.available_to !== undefined) {
    return new Date(data.available_from) <= new Date(data.available_to);
  }
  return true;
}, {
  message: "Start date must be before or equal to end date",
  path: ["available_to"],
});

export type TourFiltersInput = z.infer<typeof tourFiltersSchema>;
