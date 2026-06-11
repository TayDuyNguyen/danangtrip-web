import { z } from "zod";

export const bookingSchema = z.object({
  tour_id: z.number(),
  tour_schedule_id: z.number().min(1, "validation.schedule_required"),
  quantity_adult: z.number().min(1, "validation.adult_required"),
  quantity_child: z.number().min(0).default(0),
  quantity_infant: z.number().min(0).default(0),
  customer_name: z.string().min(2, "validation.name_min"),
  customer_email: z.string().email("validation.email_invalid"),
  customer_phone: z.string().regex(/^\+?[0-9\s\-\.\(\)]{9,20}$/, "validation.phone_invalid"),
  customer_address: z.string().optional().nullable(),
  customer_note: z.string().optional().nullable(),
  promotion_code: z.string().optional().nullable(),
  user_voucher_code: z.string().optional().nullable(),
  payment_method: z.enum(["momo", "vnpay", "zalopay", "bank_transfer", "sepay"]),
  agree_terms: z.boolean().refine((val) => val === true, {
    message: "validation.terms_required",
  }),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const cancelBookingSchema = z.object({
  cancellation_reason: z.string().min(10, "cancel_reason_min_error"),
});

export type CancelBookingFormValues = z.infer<typeof cancelBookingSchema>;

