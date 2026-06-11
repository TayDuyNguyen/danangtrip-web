"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Copy, Check, Tag } from "lucide-react";
import { toast } from "sonner";
import { formatPriceVND } from "@/utils/format";

interface CouponCardProps {
  coupon: {
    id: number;
    code: string;
    name: string;
    description?: string | null;
    discount_type: "percent" | "fixed";
    discount_value: number | string;
    min_order_amount?: number | string | null;
    max_discount_amount?: number | string | null;
    ends_at?: string | null;
  };
  onApply?: (code: string) => void;
  isApplied?: boolean;
}

export function CouponCard({ coupon, onApply, isApplied = false }: CouponCardProps) {
  const t = useTranslations("tour.booking");
  const locale = useLocale();
  const [copied, setCopied] = useState(false);

  const valueNum = Number(coupon.discount_value);
  const minOrderNum = coupon.min_order_amount ? Number(coupon.min_order_amount) : 0;
  const isPercent = coupon.discount_type === "percent";

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(t("promo_copy_success", { code: coupon.code, defaultValue: `Mã ${coupon.code} đã được sao chép!` }));
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      role={onApply ? "button" : undefined}
      tabIndex={onApply ? 0 : undefined}
      onClick={() => onApply?.(coupon.code)}
      onKeyDown={(event) => {
        if (!onApply) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onApply(coupon.code);
        }
      }}
      className={`relative flex items-center justify-between rounded-2xl border bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.03)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] hover:scale-[1.01] ${
        onApply ? "cursor-pointer" : ""
      } ${
        isApplied
          ? "border-primary bg-primary/[0.035] shadow-[0_0_0_3px_rgba(255,56,92,0.12),0_14px_34px_rgba(255,56,92,0.14)]"
          : "border-border hover:border-primary/20"
      }`}
    >
      {/* Left ticket notched cutout */}
      <div className="absolute -left-[9px] top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full border-r border-border bg-[#fafafa] z-10" />

      {/* Right ticket notched cutout */}
      <div className="absolute -right-[9px] top-1/2 h-4.5 w-4.5 -translate-y-1/2 rounded-full border-l border-border bg-[#fafafa] z-10" />

      {/* Main content grid */}
      <div className="flex gap-4 items-center min-w-0 flex-1">
        {/* Left Side: discount circle badge */}
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="text-base font-extrabold leading-none">
            {isPercent ? `${valueNum}%` : `${valueNum >= 1000 ? valueNum / 1000 : valueNum}k`}
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest mt-0.5 opacity-80">
            OFF
          </span>
        </div>

        {/* Middle: Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-primary">
              <Tag size={11} className="shrink-0" />
              {coupon.code}
            </span>
            {isApplied && (
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-tight">
                Đã áp dụng
              </span>
            )}
          </div>
          <h4 className="text-xs font-black text-on-surface line-clamp-1 truncate uppercase" title={coupon.name}>
            {coupon.name}
          </h4>
          {coupon.description && (
            <p className="text-[10px] text-on-surface-subtle font-medium line-clamp-1" title={coupon.description}>
              {coupon.description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-bold uppercase tracking-tight text-on-surface-subtle">
            {minOrderNum > 0 ? (
              <span>Đơn tối thiểu: {formatPriceVND(minOrderNum)}</span>
            ) : (
              <span>Không tối thiểu</span>
            )}
            {coupon.ends_at && (
              <span className="text-red-400">
                Hạn dùng: {formatDate(coupon.ends_at)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right side buttons */}
      <div className="flex items-center gap-2 pl-3 z-20 shrink-0">
        <button
          onClick={handleCopy}
          type="button"
          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all hover:scale-105 active:scale-95 ${
            copied
              ? "border-green-500/20 bg-green-50 text-green-500"
              : "border-border bg-white text-on-surface-subtle hover:text-primary hover:border-primary/30"
          }`}
          title="Sao chép mã"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>

        {onApply && (
          <button
            onClick={() => onApply(coupon.code)}
            type="button"
            className={`h-8 rounded-lg px-3.5 text-xs font-black uppercase transition-all hover:scale-105 active:scale-95 ${
              isApplied
                ? "bg-green-500/10 border border-green-500/20 text-green-500"
                : "bg-primary text-white hover:bg-primary-hover shadow-xs"
            }`}
          >
            {isApplied ? "Đã dùng" : "Dùng"}
          </button>
        )}
      </div>
    </div>
  );
}
