"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  Coins,
  Copy,
  Gift,
  History,
  Sparkles,
  TicketPercent,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { usePointOverview, useRedeemPointReward } from "../hooks/usePointQueries";
import type { PointReward, PointTransaction, UserVoucher } from "@/types";
import { formatDate, formatPriceVND } from "@/utils/format";
import { Loading } from "@/components/ui";

function discountLabel(
  item: Pick<PointReward | UserVoucher, "discount_type" | "discount_value">,
  locale: string
) {
  return item.discount_type === "percent"
    ? `${Number(item.discount_value)}%`
    : formatPriceVND(item.discount_value, locale === "vi" ? "vi-VN" : "en-US");
}

export function PointWalletClient() {
  const t = useTranslations("settings");
  const locale = useLocale();
  const { data, isLoading, isFetching } = usePointOverview();
  const redeemMutation = useRedeemPointReward();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeVouchers = useMemo(
    () => (data?.vouchers ?? []).filter((voucher) => voucher.status === "active"),
    [data?.vouchers]
  );

  const copyVoucher = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1600);
  };

  if (isLoading || !data) {
    return (
      <div className="space-y-6" aria-busy="true">
        {/* Overview Card Skeleton */}
        <div className="overflow-hidden rounded-2xl border border-border bg-white p-5 sm:p-7 animate-pulse">
          <div className="mb-6 flex items-start gap-3">
            <div className="size-11 shrink-0 rounded-xl bg-surface-container" />
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-surface-container" />
              <div className="h-4 w-64 rounded bg-surface-container" />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-surface-container-low p-4 space-y-3">
                <div className="size-9 rounded-lg bg-surface-container" />
                <div className="h-7 w-20 rounded bg-surface-container" />
                <div className="h-3.5 w-24 rounded bg-surface-container" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Rewards Card */}
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-7 animate-pulse space-y-5">
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-surface-container" />
              <div className="h-4 w-72 rounded bg-surface-container" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/4 rounded bg-surface-container" />
                      <div className="h-5 w-1/2 rounded bg-surface-container" />
                    </div>
                    <div className="h-8 w-16 rounded bg-surface-container" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-surface-container" />
                  <div className="h-10 w-full rounded-xl bg-surface-container mt-3" />
                </div>
              ))}
            </div>
          </div>

          {/* Vouchers/History Card */}
          <div className="rounded-2xl border border-border bg-white p-5 sm:p-7 animate-pulse space-y-5">
            <div className="h-6 w-36 rounded bg-surface-container" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-dashed border-border p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="h-5 w-2/3 rounded bg-surface-container" />
                      <div className="h-4 w-1/3 rounded bg-surface-container" />
                    </div>
                    <div className="h-7 w-12 rounded bg-surface-container" />
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-1.5">
                      <div className="h-3 w-16 rounded bg-surface-container" />
                      <div className="h-3 w-24 rounded bg-surface-container" />
                    </div>
                    <div className="h-9 w-24 rounded-lg bg-surface-container" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: t("points.available_points"),
      value: data.balance.available_points.toLocaleString(locale),
      icon: Coins,
      tone: "bg-primary/10 text-primary",
    },
    {
      label: t("points.lifetime_earned"),
      value: data.balance.lifetime_earned.toLocaleString(locale),
      icon: TrendingUp,
      tone: "bg-emerald-50 text-emerald-600",
    },
    {
      label: t("points.lifetime_spent"),
      value: data.balance.lifetime_spent.toLocaleString(locale),
      icon: TrendingDown,
      tone: "bg-amber-50 text-amber-600",
    },
    {
      label: t("points.active_vouchers"),
      value: activeVouchers.length.toLocaleString(locale),
      icon: TicketPercent,
      tone: "bg-sky-50 text-sky-600",
    },
  ];

  return (
    <div className="relative min-h-[300px] space-y-6">
      {isFetching && !isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px] transition-all duration-300">
          <Loading type="spin" color="#FF385C" height={45} width={45} />
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-outline-variant bg-surface p-5 sm:p-7">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">{t("points.heading")}</h1>
            <p className="mt-1 text-sm text-on-surface-subtle">{t("points.description")}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <div key={label} className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
              <div className={`mb-3 flex size-9 items-center justify-center rounded-lg ${tone}`}>
                <Icon className="size-4.5" aria-hidden="true" />
              </div>
              <p className="text-2xl font-bold text-on-surface">{value}</p>
              <p className="mt-1 text-xs font-medium text-on-surface-subtle">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-outline-variant bg-surface p-5 sm:p-7">
        <div className="mb-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
            <Gift className="size-5 text-primary" aria-hidden="true" />
            {t("points.rewards_title")}
          </h2>
          <p className="mt-1 text-sm text-on-surface-subtle">{t("points.rewards_description")}</p>
        </div>

        {data.rewards.length === 0 ? (
          <EmptyState icon={Gift} text={t("points.no_rewards")} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.rewards.map((reward) => {
              const canRedeem = data.balance.available_points >= reward.required_points;
              const isRedeeming =
                redeemMutation.isPending && String(redeemMutation.variables) === String(reward.id);

              return (
                <article key={reward.id} className="flex flex-col rounded-xl border border-outline-variant p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase text-primary">{reward.code}</p>
                      <h3 className="mt-1 font-bold text-on-surface">{reward.name}</h3>
                    </div>
                    <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
                      -{discountLabel(reward, locale)}
                    </span>
                  </div>
                  {reward.description && (
                    <p className="mt-3 line-clamp-2 text-sm text-on-surface-subtle">{reward.description}</p>
                  )}
                  <div className="mt-4 space-y-1 text-xs text-on-surface-subtle">
                    <p>{t("points.min_order", { amount: formatPriceVND(reward.min_order_amount) })}</p>
                    <p>{t("points.expires_in", { days: reward.expires_in_days })}</p>
                  </div>
                  <button
                    type="button"
                    disabled={!canRedeem || redeemMutation.isPending}
                    onClick={() => redeemMutation.mutate(reward.id)}
                    className="mt-4 h-11 rounded-xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-outline-variant disabled:text-on-surface-subtle"
                  >
                    {isRedeeming
                      ? t("points.redeeming")
                      : canRedeem
                        ? `${t("points.redeem")} · ${t("points.required_points", { points: reward.required_points })}`
                        : t("points.insufficient_points")}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-outline-variant bg-surface p-5 sm:p-7">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-on-surface">
            <TicketPercent className="size-5 text-primary" aria-hidden="true" />
            {t("points.vouchers_title")}
          </h2>
          {activeVouchers.length === 0 ? (
            <EmptyState icon={TicketPercent} text={t("points.no_vouchers")} />
          ) : (
            <div className="space-y-3">
              {activeVouchers.map((voucher) => (
                <article key={voucher.id} className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-on-surface">{voucher.name}</p>
                      <p className="mt-1 font-mono text-sm font-bold text-primary">{voucher.code}</p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-primary">
                      -{discountLabel(voucher, locale)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-on-surface-subtle">
                    <div>
                      <p>{t("points.min_order", { amount: formatPriceVND(voucher.min_order_amount) })}</p>
                      {voucher.expires_at && (
                        <p>{t("points.expires_at", { date: formatDate(voucher.expires_at, locale) })}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => copyVoucher(voucher.code)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-outline-variant bg-surface px-3 font-semibold text-on-surface transition hover:border-primary hover:text-primary"
                    >
                      {copiedCode === voucher.code ? (
                        <Check className="size-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="size-3.5" aria-hidden="true" />
                      )}
                      {copiedCode === voucher.code ? t("points.copied") : t("points.copy_code")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-outline-variant bg-surface p-5 sm:p-7">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-on-surface">
            <History className="size-5 text-primary" aria-hidden="true" />
            {t("points.history_title")}
          </h2>
          {data.recent_transactions.length === 0 ? (
            <EmptyState icon={History} text={t("points.no_history")} />
          ) : (
            <div className="divide-y divide-outline-variant">
              {data.recent_transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  locale={locale}
                  label={t(`points.${transaction.type}`)}
                  balanceLabel={t("points.points_balance_after", {
                    points: transaction.balance_after.toLocaleString(locale),
                  })}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function TransactionRow({
  transaction,
  locale,
  label,
  balanceLabel,
}: {
  transaction: PointTransaction;
  locale: string;
  label: string;
  balanceLabel: string;
}) {
  const isPositive = transaction.type === "earn" || transaction.type === "reversal";

  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-on-surface">
          {transaction.description || label}
        </p>
        <p className="mt-1 text-xs text-on-surface-subtle">
          {transaction.created_at ? formatDate(transaction.created_at, locale) : label} · {balanceLabel}
        </p>
      </div>
      <span className={`shrink-0 font-bold ${isPositive ? "text-emerald-600" : "text-primary"}`}>
        {isPositive ? "+" : "-"}
        {Math.abs(transaction.points).toLocaleString(locale)}
      </span>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: typeof Gift;
  text: string;
}) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl bg-surface-container-low p-5 text-center">
      <Icon className="mb-2 size-6 text-on-surface-subtle" aria-hidden="true" />
      <p className="text-sm text-on-surface-subtle">{text}</p>
    </div>
  );
}
