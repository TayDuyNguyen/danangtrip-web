import type { Tour, TourSchedule } from "./entities.types";

export interface CartItem {
  id: number;
  user_id: number;
  tour_id: number;
  tour_schedule_id: number;
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
  created_at: string;
  updated_at: string;
  tour?: Tour;
  tour_schedule?: TourSchedule;
}

export interface AddToCartPayload {
  tour_id: number;
  tour_schedule_id: number;
  quantity_adult: number;
  quantity_child?: number;
  quantity_infant?: number;
}

export interface UpdateCartPayload {
  quantity_adult: number;
  quantity_child: number;
  quantity_infant: number;
}

export interface MergeCartPayload {
  items: Array<{
    tour_id: number;
    tour_schedule_id: number;
    quantity_adult: number;
    quantity_child: number;
    quantity_infant: number;
  }>;
}
