"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { IoShoppingBagOutline } from "@/components/icons/solar";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useCartQuery } from "../hooks/useCartQueries";

export function CartIcon() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const { isAuthenticated } = useAuthStore();
  const guestItems = useCartStore((state) => state.guestItems);
  const { data: userItems = [] } = useCartQuery();

  const cartItemsCount = isMounted ? (isAuthenticated ? userItems.length : guestItems.length) : 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 text-on-surface hover:text-primary transition-colors flex items-center justify-center rounded-full bg-surface-container-high/40 hover:bg-surface-container-high border border-white/5"
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
