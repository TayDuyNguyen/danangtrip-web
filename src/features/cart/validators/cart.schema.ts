import { z } from "zod";

export const addToCartSchema = z.object({
  tour_id: z.number().int().positive("Invalid Tour ID"),
  tour_schedule_id: z.number().int().positive("Invalid Schedule ID"),
  quantity_adult: z.number().int().min(1, "At least 1 adult is required"),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export const updateCartSchema = z.object({
  quantity_adult: z.number().int().min(1, "At least 1 adult is required"),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export const mergeCartSchema = z.object({
  items: z.array(
    z.object({
      tour_id: z.number().int().positive(),
      tour_schedule_id: z.number().int().positive(),
      quantity_adult: z.number().int().min(1),
      quantity_child: z.number().int().min(0),
      quantity_infant: z.number().int().min(0),
    })
  ),
});

export type AddToCartValues = z.infer<typeof addToCartSchema>;
export type UpdateCartValues = z.infer<typeof updateCartSchema>;
export type MergeCartValues = z.infer<typeof mergeCartSchema>;
