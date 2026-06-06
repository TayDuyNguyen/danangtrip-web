import type { PaymentMethod, PaymentStatus } from "./booking.types";

export interface CreatePaymentPayload {
  booking_id: number;
  payment_method: Extract<PaymentMethod, "bank_transfer" | "payos" | "momo" | "vnpay" | "zalopay">;
  return_url?: string;
}

export interface RetryPaymentPayload {
  return_url?: string;
  payment_method?: Extract<PaymentMethod, "bank_transfer" | "payos" | "momo" | "vnpay" | "zalopay">;
}

export interface Payment {
  id: number;
  booking_id: number;
  transaction_code: string;
  amount: string | number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_gateway: string | null;
  gateway_response?: Record<string, unknown> | null;
  paid_at: string | null;
  refunded_at: string | null;
  refund_reason: string | null;
  payment_url?: string;
}

export interface PaymentCreateResult {
  payment?: Payment;
  payment_url?: string;
  transaction_code?: string;
  booking_code?: string;
  [key: string]: unknown;
}
