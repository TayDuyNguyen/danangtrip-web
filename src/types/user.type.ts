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
  phone?: string;
  avatar?: string;
}

export interface UpdateProfileInput {
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
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
