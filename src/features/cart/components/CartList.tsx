"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CartItemRow } from "./CartItemRow";
import type { CartItem } from "@/types";
import { IoShoppingBagOutline } from "@/components/icons/solar";

interface CartListProps {
  items: CartItem[];
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
}

export function CartList({ items, selectedIds = [], onToggleSelect }: CartListProps) {
  const t = useTranslations("cart");

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded-[28px] border border-border bg-white p-12 text-center shadow-[0_18px_54px_rgba(15,23,42,0.08)] reveal-up">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-[#f7f7f7] text-on-surface-subtle">
          <IoShoppingBagOutline className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-bold uppercase tracking-tight text-on-surface">{t("empty_title")}</h3>
          <p className="text-sm leading-relaxed text-on-surface-subtle">{t("empty_desc")}</p>
        </div>
        <Link
          href="/tours"
          className="inline-flex items-center justify-center px-6 h-12 bg-primary hover:bg-[#a37d65] text-white text-xs font-black uppercase tracking-widest rounded-full transition-colors shadow-lg shadow-primary/20"
        >
          {t("back_to_tours")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemRow 
          key={item.id} 
          item={item} 
          isSelected={selectedIds.includes(item.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
}
