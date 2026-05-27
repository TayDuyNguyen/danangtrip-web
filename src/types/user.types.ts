import type { UserRole } from "@/utils/constants";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  birthdate?: string | null;
  gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
  city?: string | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface UpdateUserInput {
  name?: string;
  full_name?: string;
  phone?: string;
  avatar?: string;
  birthdate?: string | null;
  gender?: "male" | "female" | "other" | null;
  city?: string | null;
}

export interface UpdateProfileInput {
  full_name?: string;
  phone?: string | null;
  birthdate?: string | null;
  city?: string | null;
  bio?: string;
  address?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | null;
}

export interface ChangePasswordInput {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UserPreferences {
  language: "vi" | "en";
  currency: "VND" | "USD";
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    marketing: boolean;
  };
}
