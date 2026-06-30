import {
  User,
  Lock,
  BookOpen,
  Heart,
  Bell,
  Coins,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PROTECTED_ROUTES } from "@/config/routes";

export interface ProfileNavItem {
  key: string;
  labelKey: string;
  href: string;
  icon: LucideIcon;
}

export const PROFILE_NAV_ITEMS: ProfileNavItem[] = [
  { key: "profile", labelKey: "sidebar.profile", href: PROTECTED_ROUTES.PROFILE, icon: User },
  { key: "change_password", labelKey: "sidebar.change_password", href: PROTECTED_ROUTES.PASSWORD, icon: Lock },
  { key: "ratings", labelKey: "sidebar.ratings", href: PROTECTED_ROUTES.RATINGS, icon: Star },
  { key: "recommendations", labelKey: "sidebar.recommendations", href: PROTECTED_ROUTES.RECOMMENDATIONS, icon: Sparkles },
  { key: "bookings", labelKey: "sidebar.bookings", href: PROTECTED_ROUTES.BOOKINGS, icon: BookOpen },
  { key: "points", labelKey: "sidebar.points", href: PROTECTED_ROUTES.POINTS, icon: Coins },
  { key: "favorites", labelKey: "sidebar.favorites", href: PROTECTED_ROUTES.FAVORITES, icon: Heart },
  { key: "notifications", labelKey: "sidebar.notifications", href: PROTECTED_ROUTES.NOTIFICATIONS, icon: Bell },
  { key: "delete_account", labelKey: "sidebar.delete_account", href: PROTECTED_ROUTES.DELETE_ACCOUNT, icon: Trash2 },
];
