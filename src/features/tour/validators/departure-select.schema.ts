import { z } from "zod";

export const departureSelectSchema = z.object({
  tour_schedule_id: z.number().min(1, "Vui lòng chọn ngày khởi hành hợp lệ."),
  quantity_adult: z.number().int().min(1, "Phải có ít nhất 1 người lớn."),
  quantity_child: z.number().int().min(0).default(0),
  quantity_infant: z.number().int().min(0).default(0),
});

export type DepartureSelectFormValues = z.infer<typeof departureSelectSchema>;
