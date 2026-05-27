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
      <div className="glass-surface rounded-xl p-12 border border-white/5 flex flex-col items-center justify-center text-center space-y-6 reveal-up">
        <div className="w-16 h-16 bg-[#171717] rounded-full border border-white/5 flex items-center justify-center text-on-surface-subtle">
          <IoShoppingBagOutline className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t("empty_title")}</h3>
          <p className="text-sm text-on-surface-variant leading-relaxed">{t("empty_desc")}</p>
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
