import { z } from "zod";

/**
 * Validator for Newsletter subscription form.
 * Uses /contacts endpoint as a fallback for newsletter subscription.
 */
export const newsletterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().default("newsletter"),
  message: z.string().default("Subscribe to newsletter from Blog Detail"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
