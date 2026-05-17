import { User } from "./user.types";

/**
 * Auth request and response types ported from source project
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string | null;
}

export type RegisterResponse =
  | User
  | {
      user: User;
      token?: string;
    };

export type RefreshTokenResponse = LoginResponse;
export type FormRegister = RegisterRequest;
export type LoginForm = LoginRequest;

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface VerifyEmailRequest {
  token?: string;
  code?: string;
}
