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
  refreshToken?: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  full_name?: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string | null;
}

export interface RegisterResponse {
  user: User;
  token?: string;
  refreshToken?: string;
}

export type RefreshTokenResponse = LoginResponse;
export type FormRegister = RegisterRequest;
export type LoginForm = LoginRequest;
