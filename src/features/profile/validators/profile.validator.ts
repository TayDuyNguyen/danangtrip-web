import { z } from "zod";
import { ERROR_MESSAGES, REGEX } from "@/utils/constants";

/**
 * Validation schema for the Change Password form
 */
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, ERROR_MESSAGES.REQUIRED),
    password: z
      .string()
      .min(8, ERROR_MESSAGES.INVALID_PASSWORD)
      .regex(REGEX.PASSWORD, ERROR_MESSAGES.INVALID_PASSWORD),
    password_confirmation: z.string().min(1, ERROR_MESSAGES.REQUIRED),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: ERROR_MESSAGES.PASSWORD_MISMATCH,
    path: ["password_confirmation"],
  });

/**
 * Inferred type from changePasswordSchema
 */
export type ChangePasswordFormInput = z.infer<typeof changePasswordSchema>;

/**
 * Validation schema for the Delete Account form
 */
export const deleteAccountSchema = z.object({
  confirmCheckbox: z.boolean().refine((val) => val === true, {
    message: "error.delete_account_confirm",
  }),
  password: z.string().min(1, ERROR_MESSAGES.REQUIRED),
});

/**
 * Inferred type from deleteAccountSchema
 */
export type DeleteAccountFormInput = z.infer<typeof deleteAccountSchema>;

/**
 * Validation schema for the Update Profile form
 */
export const updateProfileSchema = z.object({
  full_name: z.string().min(1, { message: ERROR_MESSAGES.REQUIRED }),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || REGEX.PHONE.test(val), {
      message: ERROR_MESSAGES.INVALID_PHONE,
    }),
  birthdate: z.string().nullable().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say", ""]).nullable().optional(),
  city: z.string().nullable().optional(),
});

/**
 * Inferred type from updateProfileSchema
 */
export type UpdateProfileFormInput = z.infer<typeof updateProfileSchema>;

