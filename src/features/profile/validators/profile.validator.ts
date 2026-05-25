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
