import { z } from "zod";
import { ERROR_MESSAGES } from "@/utils/constants";

// Regex patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(EMAIL_REGEX, ERROR_MESSAGES.INVALID_EMAIL),
  password: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  rememberMe: z.boolean().optional(),
});

// Register schema
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, ERROR_MESSAGES.MIN_LENGTH)
      .max(50, ERROR_MESSAGES.MAX_LENGTH),
    email: z
      .string()
      .min(1, ERROR_MESSAGES.REQUIRED)
      .regex(EMAIL_REGEX, ERROR_MESSAGES.INVALID_EMAIL),
    phone: z
      .string()
      .regex(PHONE_REGEX, ERROR_MESSAGES.INVALID_PHONE)
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.INVALID_PASSWORD),
    confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: "error.terms_required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, ERROR_MESSAGES.REQUIRED)
    .regex(EMAIL_REGEX, ERROR_MESSAGES.INVALID_EMAIL),
});

// Reset password schema
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, ERROR_MESSAGES.REQUIRED),
    password: z
      .string()
      .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(PASSWORD_REGEX, ERROR_MESSAGES.INVALID_PASSWORD),
    confirmPassword: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: ERROR_MESSAGES.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

// Type exports
export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
