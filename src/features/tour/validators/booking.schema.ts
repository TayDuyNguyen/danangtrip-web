import { z } from "zod";

export const bookingSchema = z.object({
  tour_id: z.number(),
  tour_schedule_id: z.number().min(1, "vui lòng chọn ngày khởi hành"),
  quantity_adult: z.number().min(1, "tối thiểu 1 người lớn"),
  quantity_child: z.number().min(0).default(0),
  quantity_infant: z.number().min(0).default(0),
  customer_name: z.string().min(2, "tên tối thiểu 2 ký tự"),
  customer_email: z.string().email("email không hợp lệ"),
  customer_phone: z.string().regex(/^[0-9]{10,11}$/, "số điện thoại không hợp lệ"),
  customer_address: z.string().optional().nullable(),
  customer_note: z.string().optional().nullable(),
  payment_method: z.enum(["momo", "vnpay", "zalopay", "bank_transfer", "payos"]),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: "bạn phải đồng ý với điều khoản",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const cancelBookingSchema = z.object({
  cancellation_reason: z.string().min(10, "cancel_reason_min_error"),
});

export type CancelBookingFormValues = z.infer<typeof cancelBookingSchema>;

