"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useMergeCart } from "../hooks/useCartQueries";

export function CartSync() {
  const { isAuthenticated } = useAuthStore();
  const guestItems = useCartStore((state) => state.guestItems);
  const { mutate: mergeCart } = useMergeCart();

  useEffect(() => {
    if (isAuthenticated && guestItems.length > 0) {
      const payload = {
        items: guestItems.map((item) => ({
          tour_id: item.tour_id,
          tour_schedule_id: item.tour_schedule_id,
          quantity_adult: item.quantity_adult,
          quantity_child: item.quantity_child,
          quantity_infant: item.quantity_infant,
        })),
      };

      mergeCart(payload);
    }
  }, [isAuthenticated, guestItems, mergeCart]);

  return null;
}
