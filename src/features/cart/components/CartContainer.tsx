"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useCartQuery, useRemoveCartItem, useClearCart } from "../hooks/useCartQueries";
import { CartList } from "./CartList";
import { CartSummary } from "./CartSummary";
import { Loading } from "@/components/ui";
import { toast } from "sonner";

export function CartContainer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const guestItems = useCartStore((state) => state.guestItems);
  const { data: userItems = [], isLoading: isQueryLoading } = useCartQuery();

  const items = isAuthenticated ? userItems : guestItems;
  const isLoading = isAuthenticated && isQueryLoading;

  // --- Selection State ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [prevItemsLength, setPrevItemsLength] = useState(0);

  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: clearCart } = useClearCart();

  useEffect(() => {
    if (items.length > prevItemsLength) {
      // Auto-select newly added items
      const newIds = items.map((i) => i.id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds((prev) => {
        const unique = new Set([...prev, ...newIds]);
        return Array.from(unique);
      });
    } else if (items.length < prevItemsLength) {
      // Filter out deleted items
      const currentIds = items.map((i) => i.id);
      setSelectedIds((prev) => prev.filter((id) => currentIds.includes(id)));
    }
    setPrevItemsLength(items.length);
  }, [items, prevItemsLength]);

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    
    const confirmMsg = locale === "vi" 
      ? `Bạn có chắc muốn xóa ${selectedIds.length} mục đã chọn?`
      : `Are you sure you want to delete ${selectedIds.length} selected items?`;
      
    if (!window.confirm(confirmMsg)) return;

    if (selectedIds.length === items.length) {
      clearCart(undefined, {
        onSuccess: () => {
          toast.success(locale === "vi" ? "Đã xóa toàn bộ giỏ hàng" : "Cleared cart successfully");
        }
      });
    } else {
      selectedIds.forEach((id) => {
        const item = items.find((i) => i.id === id);
        if (item) {
          removeItem({ id: item.id, scheduleId: item.tour_schedule_id });
        }
      });
      toast.success(locale === "vi" ? "Đã xóa các mục đã chọn" : "Removed selected items");
    }
  };

  const handleDeleteAll = () => {
    if (items.length === 0) return;

    const confirmMsg = locale === "vi"
      ? "Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?"
      : "Are you sure you want to delete all items from your cart?";

    if (!window.confirm(confirmMsg)) return;

    clearCart(undefined, {
      onSuccess: () => {
        toast.success(locale === "vi" ? "Đã xóa toàn bộ giỏ hàng" : "Cleared cart successfully");
      }
    });
  };

  if (!isMounted) {
    return (
      <div className="design-container design-section py-24 md:py-32">
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="design-container design-section py-24 md:py-32">
      {/* Title Header */}
      <div className="mb-10 reveal-up">
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
          {t("title")}
        </h1>
        <p className="text-sm text-on-surface-variant mt-2 max-w-xl font-medium leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 w-full space-y-4">
            {/* Selection Bar */}
            {items.length > 0 && (
              <div className="glass-surface rounded-xl p-4 border border-white/5 flex items-center justify-between reveal-up">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-white font-medium select-none">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="w-4.5 h-4.5 rounded border-white/10 bg-[#171717] text-primary focus:ring-0 focus:ring-offset-0 accent-primary cursor-pointer"
                  />
                  <span>
                    {locale === "vi" ? "Chọn tất cả" : "Select all"} ({items.length})
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  {selectedIds.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      {locale === "vi" ? `Xóa mục đã chọn (${selectedIds.length})` : `Delete selected (${selectedIds.length})`}
                    </button>
                  )}
                  <button
                    onClick={handleDeleteAll}
                    className="text-xs font-bold uppercase tracking-wider text-on-surface-subtle hover:text-white transition-colors cursor-pointer"
                  >
                    {locale === "vi" ? "Xóa tất cả" : "Xóa tất cả"}
                  </button>
                </div>
              </div>
            )}

            <CartList 
              items={items} 
              selectedIds={selectedIds}
              onToggleSelect={(id) => {
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                );
              }}
            />
          </div>

          {/* Checkout Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-4 w-full">
              <CartSummary items={items.filter((i) => selectedIds.includes(i.id))} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
