import type { PaymentMethod, PaymentStatus } from "./booking.types";

export interface CreatePaymentPayload {
  booking_id: number;
  payment_method: Extract<PaymentMethod, "bank_transfer" | "sepay" | "momo" | "vnpay" | "zalopay">;
  return_url?: string;
}

export interface RetryPaymentPayload {
  return_url?: string;
  payment_method?: Extract<PaymentMethod, "bank_transfer" | "sepay" | "momo" | "vnpay" | "zalopay">;
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
  sepay_checkout?: SepayCheckout | null;
}

export interface PaymentCreateResult {
  payment?: Payment;
  payment_url?: string;
  transaction_code?: string;
  booking_code?: string;
  sepay_checkout?: SepayCheckout | null;
  [key: string]: unknown;
}

export interface SepayCheckout {
  provider: "sepay";
  merchant_id?: string | null;
  environment?: string | null;
  transaction_code: string;
  booking_code: string;
  amount: number;
  currency: "VND";
  transfer_content: string;
  qr_content: string;
  qr_image_url: string;
  return_url?: string | null;
  bank: {
    bank_code: string;
    account_no: string;
    account_name: string;
  };
}
