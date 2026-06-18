import type { PaginatedResponse } from "./api.types";
import type { Tour, TourSchedule } from "./entities.types";

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "success" | "failed" | "refunded" | "unpaid" | "partially_paid";
export type PaymentMethod = "bank_transfer" | "credit_card" | "paypal" | "cash" | "momo" | "vnpay" | "zalopay" | "sepay" | "payos";

export interface BookingQuantityPayload {
  tour_id: number;
  tour_schedule_id: number;
  quantity_adult: number;
  quantity_child?: number | null;
  quantity_infant?: number | null;
  promotion_code?: string;
  user_voucher_code?: string;
}

export interface CreateBookingPayload extends BookingQuantityPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: string | null;
  customer_note?: string | null;
  payment_method: PaymentMethod;
}

export interface BookingListParams {
  search?: string;
  booking_status?: BookingStatus | "all";
  payment_status?: PaymentStatus | "all";
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
  sort_by?: "id" | "created_at" | "booked_at" | "booking_code" | "total_amount" | "booking_status" | "payment_status";
  sort_order?: "asc" | "desc";
}

export interface BookingItem {
  id: number;
  booking_id: number;
  tour_id: number;
  tour_schedule_id: number;
  item_type: string;
  item_name: string;
  travel_date: string;
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
  unit_price_adult: string | number;
  unit_price_child: string | number;
  unit_price_infant: string | number;
  subtotal: string | number;
  status: string;
  tour?: Tour;
  tour_schedule?: TourSchedule;
}

export interface BookingPaymentSession {
  id: number;
  transaction_code: string;
  amount: string | number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_gateway: string | null;
  created_at: string | null;
  expires_at: string | null;
}

export interface BookingRefundRequest {
  id: number;
  refund_code: string;
  reason_type: "cancellation" | "overpayment" | "admin_adjustment" | "legacy_refund";
  requested_amount: string | number;
  approved_amount?: string | number | null;
  refund_percent: string | number;
  status: "pending" | "processing" | "completed" | "failed" | "rejected";
  transfer_reference?: string | null;
  requested_at?: string | null;
  completed_at?: string | null;
}

export interface Booking {
  id: number;
  booking_code: string;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string | null;
  customer_note: string | null;
  total_amount: string | number;
  discount_amount: string | number;
  final_amount: string | number;
  deposit_amount: string | number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  cancellation_reason: string | null;
  booked_at: string;
  confirmed_at: string | null;
  cancelled_at: string | null;
  completed_at: string | null;
  latest_pending_payment?: BookingPaymentSession | null;
  refund_requests?: BookingRefundRequest[];
  items?: BookingItem[];
  booking_items?: BookingItem[];
}

export interface BookingCalculation {
  breakdown?: {
    adult: { quantity: number; unit_price: number | string; subtotal: number | string };
    child: { quantity: number; unit_price: number | string; subtotal: number | string };
    infant: { quantity: number; unit_price: number | string; subtotal: number | string };
  };
  total_amount: number | string;
  tour_discount?: number | string;
  promotion_discount?: number | string;
  voucher_discount?: number | string;
  coupon_discount?: number | string;
  discount_amount?: number | string;
  final_amount: number | string;
  deposit_amount?: number | string;
  available_seats?: number;
  applied_promotion?: {
    id: number;
    code: string;
    name: string;
    discount_type: "percent" | "fixed";
    discount_value: string | number;
    coupon_discount_amount: number;
  } | null;
  applied_user_voucher?: {
    id: number;
    code: string;
    name: string;
    discount_type: "percent" | "fixed";
    discount_value: string | number;
    voucher_discount_amount: number;
  } | null;
}

export interface CancelBookingPayload {
  cancellation_reason: string;
  refund_bank_code?: string;
  refund_account_no?: string;
  refund_account_name?: string;
}

export interface RefundPreview {
  booking_id: number;
  booking_code: string;
  departure_at: string;
  hours_before_departure: number;
  paid_amount: number;
  refund_percent: number;
  refund_amount: number;
  cancellation_fee: number;
  policy_code: string;
  grace_period_applied: boolean;
  requires_bank_details: boolean;
}

export type BookingListResponse = PaginatedResponse<Booking>;
