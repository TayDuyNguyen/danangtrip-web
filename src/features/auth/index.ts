// Auth Feature - Barrel Export
export { useAuth } from "./hooks/use-auth";
export { useAuthStore } from "@/store/auth.store";
export { authService } from "@/services/auth.service";
export { LoginForm } from "./components/login-form";
export { RegisterForm } from "./components/register-form";
export { VerifyEmailForm } from "./components/verify-email-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { ResetPasswordForm } from "./components/reset-password-form";
export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordData,
  ResetPasswordData,
} from "./types/auth.types";
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  type LoginSchema,
  type RegisterSchema,
  type ForgotPasswordSchema,
  type ResetPasswordSchema,
  type VerifyEmailSchema,
} from "./validators/auth.schema";

