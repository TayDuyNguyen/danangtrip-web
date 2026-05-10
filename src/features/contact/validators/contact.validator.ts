import { z } from "zod";

/**
 * Validation schema for contact form submission
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "name_min_2")
    .max(100, "name_max_100")
    .trim(),
  email: z
    .string()
    .email("email_invalid")
    .min(5, "email_min_5")
    .max(100, "email_max_100")
    .trim(),
  phone: z
    .string()
    .regex(/^(0|\+84)(3|5|7|8|9)[0-9]{8}$/, "phone_invalid")
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .max(200, "subject_max_200")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "message_min_10")
    .max(1000, "message_max_1000")
    .trim(),
});

/**
 * Inferred type from contact schema
 */
export type ContactInput = z.infer<typeof contactSchema>;
