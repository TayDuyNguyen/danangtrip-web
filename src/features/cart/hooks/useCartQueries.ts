import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import type { AddToCartPayload, UpdateCartPayload, MergeCartPayload, Tour, TourSchedule } from "@/types";

export function useCartQuery() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.get().then((res) => res.data),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const addGuestItem = useCartStore((state) => state.addGuestItem);

  return useMutation({
    mutationFn: (payload: AddToCartPayload & { tour?: Tour; tour_schedule?: TourSchedule }) => {
      if (isAuthenticated) {
        const { tour, tour_schedule, ...apiPayload } = payload;
        return cartService.store(apiPayload).then((res) => res.data);
      } else {
        addGuestItem({
          tour_id: payload.tour_id,
          tour_schedule_id: payload.tour_schedule_id,
          quantity_adult: payload.quantity_adult,
          quantity_child: payload.quantity_child ?? 0,
          quantity_infant: payload.quantity_infant ?? 0,
          tour: payload.tour,
          tour_schedule: payload.tour_schedule,
        });
        return Promise.resolve(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const updateGuestQuantity = useCartStore((state) => state.updateGuestQuantity);

  return useMutation({
    mutationFn: ({ id, scheduleId, payload }: { id: number; scheduleId: number; payload: UpdateCartPayload }) => {
      if (isAuthenticated) {
        return cartService.update(id, payload).then((res) => res.data);
      } else {
        updateGuestQuantity(scheduleId, payload.quantity_adult, payload.quantity_child, payload.quantity_infant);
        return Promise.resolve(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const removeGuestItem = useCartStore((state) => state.removeGuestItem);

  return useMutation({
    mutationFn: ({ id, scheduleId }: { id: number; scheduleId: number }) => {
      if (isAuthenticated) {
        return cartService.delete(id).then((res) => res.data);
      } else {
        removeGuestItem(scheduleId);
        return Promise.resolve(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const clearGuestCart = useCartStore((state) => state.clearGuestCart);

  return useMutation({
    mutationFn: () => {
      if (isAuthenticated) {
        return cartService.clear().then((res) => res.data);
      } else {
        clearGuestCart();
        return Promise.resolve(null);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useMergeCart() {
  const queryClient = useQueryClient();
  const clearGuestCart = useCartStore((state) => state.clearGuestCart);

  return useMutation({
    mutationFn: (payload: MergeCartPayload) =>
      cartService.merge(payload).then((res) => {
        clearGuestCart();
        return res.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
