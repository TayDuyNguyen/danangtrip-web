import type { PaginatedResponse } from "./api.types";

export type PointTransactionType = "earn" | "spend" | "reversal" | "adjust";
export type PointTransactionStatus = "pending" | "approved" | "rejected";
export type PointVoucherStatus = "active" | "used" | "expired" | "cancelled";
export type PointDiscountType = "percent" | "fixed";

export interface UserPointBalance {
  id: number;
  user_id: number;
  available_points: number;
  lifetime_earned: number;
  lifetime_spent: number;
  created_at?: string;
  updated_at?: string;
}

export interface PointReward {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  required_points: number;
  discount_type: PointDiscountType;
  discount_value: string | number;
  max_discount_amount?: string | number | null;
  min_order_amount: string | number;
  expires_in_days: number;
  usage_limit_per_user: number;
  status: "active" | "inactive";
}

export interface UserVoucher {
  id: number;
  user_id: number;
  point_reward_id?: number | null;
  code: string;
  name: string;
  discount_type: PointDiscountType;
  discount_value: string | number;
  max_discount_amount?: string | number | null;
  min_order_amount: string | number;
  expires_at?: string | null;
  used_at?: string | null;
  status: PointVoucherStatus;
}

export interface PointTransaction {
  id: number;
  user_id: number;
  type: PointTransactionType;
  points: number;
  balance_after: number;
  source_type?: string | null;
  source_id?: number | null;
  description?: string | null;
  status: PointTransactionStatus;
  created_at?: string;
}

export interface PointOverview {
  balance: UserPointBalance;
  rewards: PointReward[];
  vouchers: UserVoucher[];
  recent_transactions: PointTransaction[];
}

export type PointTransactionsResponse = PaginatedResponse<PointTransaction>;
