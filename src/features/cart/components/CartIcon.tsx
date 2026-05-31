"use client";

import { Link } from "@/i18n/navigation";
import { IoShoppingBagOutline } from "@/components/icons/solar";
import { useCartStore } from "@/store/cart.store";

export function CartIcon() {
  const guestItems = useCartStore((state) => state.guestItems);
  const cartItemsCount = guestItems.length;

  return (
    <Link
      href="/cart"
      className="relative flex cursor-pointer items-center justify-center rounded-full border border-border bg-white p-2 text-on-surface shadow-sm transition-colors hover:border-primary/30 hover:bg-[#f7f7f7] hover:text-primary"
    >
      <IoShoppingBagOutline className="w-5 h-5" />
      {cartItemsCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center border border-background shadow-lg">
          {cartItemsCount}
        </span>
      )}
    </Link>
  );
}
