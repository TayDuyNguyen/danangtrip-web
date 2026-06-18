"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { SepayCheckout } from "@/types";
import { formatCurrency } from "@/utils/format";

interface Props {
  checkout: SepayCheckout;
}

export function SepayQrCard({ checkout }: Props) {
  const t = useTranslations("tour.payment.sepay");
  const locale = useLocale();
  const [qrLoadFailed, setQrLoadFailed] = useState(false);
  const safeAmount = Math.max(0, Number(checkout.amount || 0));

  if (safeAmount <= 0) {
    return null;
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-md rounded-[28px] border border-border bg-white p-6 text-left shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="text-center">
        <h3 className="text-lg font-bold text-on-surface">{t("title")}</h3>
        <p className="mt-1 text-sm leading-6 text-on-surface-subtle">
          {t("description")}
        </p>
      </div>

      <div className="mt-5 flex justify-center">
        {qrLoadFailed ? (
          <a
            href={checkout.qr_image_url}
            target="_blank"
            rel="noreferrer"
            className="flex h-64 w-64 items-center justify-center rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center text-sm font-bold leading-6 text-primary transition-colors hover:bg-primary/10"
          >
            {t("open_qr_link")}
          </a>
        ) : (
          <Image
            src={checkout.qr_image_url}
            alt={t("qr_alt")}
            width={256}
            height={256}
            unoptimized
            onError={() => setQrLoadFailed(true)}
            className="h-64 w-64 rounded-3xl border border-border bg-white object-contain p-3"
          />
        )}
      </div>

      <div className="mt-5 space-y-3 rounded-3xl border border-border bg-[#f7f7f7] p-4">
        <InfoRow label={t("bank")} value={checkout.bank.bank_code} />
        <InfoRow label={t("account_no")} value={checkout.bank.account_no} copyable />
        <InfoRow label={t("account_name")} value={checkout.bank.account_name} />
        <InfoRow
          label={t("amount")}
          value={formatCurrency(safeAmount, "VND", locale === "vi" ? "vi-VN" : "en-US")}
          copyValue={String(safeAmount)}
          copyable
        />
        <InfoRow label={t("transfer_content")} value={checkout.transfer_content} copyable important />
      </div>

      <p className="mt-4 text-center text-xs font-medium leading-5 text-on-surface-subtle">
        {t("auto_confirm_note")}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
  copyValue,
  copyable = false,
  important = false,
}: {
  label: string;
  value: string;
  copyValue?: string;
  copyable?: boolean;
  important?: boolean;
}) {
  const t = useTranslations("tour.payment.sepay");

  const copyText = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(copyValue || value);
  };

  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-subtle">{label}</span>
      <div className="flex max-w-[65%] items-center gap-2 text-right">
        <span className={important ? "font-black text-primary" : "font-bold text-on-surface"}>
          {value}
        </span>
        {copyable && (
          <button
            type="button"
            onClick={copyText}
            className="rounded-full border border-border bg-white px-2 py-1 text-[11px] font-semibold text-on-surface-subtle transition-colors hover:border-primary hover:text-primary"
          >
            {t("copy")}
          </button>
        )}
      </div>
    </div>
  );
}
