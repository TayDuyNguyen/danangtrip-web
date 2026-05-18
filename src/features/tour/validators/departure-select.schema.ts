import { z } from "zod";

export const departureSelectSchema = z.object({
  tour_schedule_id: z.number().min(1, "vui lòng chọn ngày khởi hành"),
  quantity_adult: z.number().min(1, "tối thiểu 1 người lớn"),
  quantity_child: z.number().min(0).default(0),
  quantity_infant: z.number().min(0).default(0),
});

export type DepartureSelectFormValues = z.infer<typeof departureSelectSchema>;
