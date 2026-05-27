import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartState {
  guestItems: CartItem[];
  addGuestItem: (item: Omit<CartItem, "id" | "user_id" | "created_at" | "updated_at">) => void;
  updateGuestQuantity: (scheduleId: number, adult: number, child: number, infant: number) => void;
  removeGuestItem: (scheduleId: number) => void;
  clearGuestCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      guestItems: [],

      addGuestItem: (item) =>
        set((state) => {
          const existingIndex = state.guestItems.findIndex(
            (i) => i.tour_schedule_id === item.tour_schedule_id
          );

          if (existingIndex > -1) {
            const updated = [...state.guestItems];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity_adult: updated[existingIndex].quantity_adult + item.quantity_adult,
              quantity_child: updated[existingIndex].quantity_child + item.quantity_child,
              quantity_infant: updated[existingIndex].quantity_infant + item.quantity_infant,
            };
            return { guestItems: updated };
          }

          const newItem: CartItem = {
            id: Date.now() + Math.random(),
            user_id: 0,
            ...item,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          return { guestItems: [...state.guestItems, newItem] };
        }),

      updateGuestQuantity: (scheduleId, adult, child, infant) =>
        set((state) => ({
          guestItems: state.guestItems.map((i) =>
            i.tour_schedule_id === scheduleId
              ? {
                  ...i,
                  quantity_adult: adult,
                  quantity_child: child,
                  quantity_infant: infant,
                  updated_at: new Date().toISOString(),
                }
              : i
          ),
        })),

      removeGuestItem: (scheduleId) =>
        set((state) => ({
          guestItems: state.guestItems.filter((i) => i.tour_schedule_id !== scheduleId),
        })),

      clearGuestCart: () => set({ guestItems: [] }),
    }),
    {
      name: "danangtrip-guest-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
