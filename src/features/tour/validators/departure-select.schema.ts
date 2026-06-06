import { z } from "zod";

export const departureSelectSchema = z.object({
  tour_schedule_id: z.number().min(1, "booking.validation.schedule_required"),
  quantity_adult: z.number().int().min(1, "booking.validation.adult_required"),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export type DepartureSelectFormValues = z.infer<typeof departureSelectSchema>;
