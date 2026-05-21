"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useUserBookings } from "../hooks/useBookingQueries";
import { BookingHistoryCard } from "./BookingHistoryCard";
import { CancelBookingDialog } from "./CancelBookingDialog";
import { SearchInput, Button } from "@/components/ui";
import { EmptyState } from "@/components/feedback/empty-state";
import { StandardPagination } from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { InfoCircle } from "@/components/icons/solar";
import type { Booking, BookingStatus } from "@/types";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/config";

const BOOKING_STATUS_TABS: Array<BookingStatus | "all"> = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

interface BookingsSearchFieldProps {
  initialValue: string;
  isLoading: boolean;
  placeholder: string;
  onDebouncedChange: (value: string) => void;
}

function BookingsSearchField({
  initialValue,
  isLoading,
  placeholder,
  onDebouncedChange,
}: BookingsSearchFieldProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 400);

  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onDebouncedChange(debouncedValue);
    }
  }, [debouncedValue, initialValue, onDebouncedChange]);

  return (
    <SearchInput
      value={value}
      onChange={setValue}
      placeholder={placeholder}
      isLoading={isLoading}
      aria-label={placeholder}
    />
  );
}

export function BookingsHistoryClient() {
  const t = useTranslations("tour.history");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const rawStatus = searchParams.get("booking_status");
  const activeTab = BOOKING_STATUS_TABS.includes(rawStatus as BookingStatus | "all")
    ? (rawStatus as BookingStatus | "all")
    : "all";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [selectedCancelBooking, setSelectedCancelBooking] = useState<Booking | null>(null);

  const updateQueryParams = useCallback(
    (
      updates: Record<string, string | null>,
      options?: { replace?: boolean; scroll?: boolean }
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
          return;
        }

        params.set(key, value);
      });

      const nextQuery = params.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

      if (options?.replace) {
        router.replace(nextUrl, { scroll: options.scroll ?? false });
        return;
      }

      router.push(nextUrl, { scroll: options?.scroll ?? false });
    },
    [pathname, router, searchParams]
  );

  const queryParams = useMemo(
    () => ({
      search: searchQuery || undefined,
      booking_status: activeTab === "all" ? undefined : activeTab,
      page,
      per_page: 5,
    }),
    [activeTab, page, searchQuery]
  );

  const { data: bookingsResponse, isLoading, isError, refetch } = useUserBookings(queryParams);

  const bookings = bookingsResponse?.data || [];
  const totalPages = bookingsResponse?.last_page || 1;
  const currentPage = bookingsResponse?.current_page || 1;

  const tabs: { key: BookingStatus | "all"; label: string }[] = [
    { key: "all", label: t("tabs.all") },
    { key: "pending", label: t("tabs.pending") },
    { key: "confirmed", label: t("tabs.confirmed") },
    { key: "completed", label: t("tabs.completed") },
    { key: "cancelled", label: t("tabs.cancelled") },
  ];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Search and Tabs Header Panel */}
      <div className="glass-shell shadow-lg rounded-2xl border-white/5 overflow-hidden">
        <div className="glass-inner bg-surface-container-low p-6 space-y-6">
          
          {/* Controls: Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <BookingsSearchField
              key={searchQuery}
              initialValue={searchQuery}
              onDebouncedChange={(value) =>
                updateQueryParams(
                  {
                    search: value || null,
                    page: "1",
                  },
                  { replace: true, scroll: false }
                )
              }
              placeholder={t("search_placeholder")}
              isLoading={isLoading}
            />
          </div>

          {/* Filter Tabs */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center overflow-x-auto no-scrollbar gap-2 pb-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      updateQueryParams(
                        {
                          booking_status: tab.key === "all" ? null : tab.key,
                          page: "1",
                        },
                        { scroll: false }
                      );
                    }}
                    className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-100"
                        : "bg-surface-container border border-border text-on-surface-variant hover:text-white hover:border-primary/45 active:scale-95"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Main List Rendering */}
      {isError ? (
        <div className="rounded-2xl border border-border bg-surface-container p-8 text-center shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <InfoCircle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-on-surface font-semibold mb-4">{t("error_load")}</p>
          <Button
            onClick={() => refetch()}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-95"
          >
            {t("button_retry")}
          </Button>
        </div>
      ) : isLoading ? (
        // Premium Skeleton Area
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-surface border border-border p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-44 h-36 rounded-xl bg-surface-container shrink-0" />
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-surface-container rounded w-1/4" />
                <div className="h-6 bg-surface-container rounded w-3/4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  <div className="h-10 bg-surface-container rounded" />
                  <div className="h-10 bg-surface-container rounded" />
                  <div className="h-10 bg-surface-container rounded" />
                </div>
                <div className="h-px bg-border/50 my-2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 bg-surface-container rounded w-32" />
                  <div className="h-8 bg-surface-container rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        // Empty State
        <div className="glass-shell rounded-2xl">
          <div className="glass-inner bg-surface-container-low/50">
            <EmptyState
              title={t("empty_title")}
              description={t("empty_desc")}
              action={
                <Link href={ROUTES.TOURS}>
                  <Button className="rounded-full bg-primary px-8 py-3 font-bold text-white shadow-xl shadow-primary/20 hover:scale-102 transition-transform">
                    {t("empty_cta")}
                  </Button>
                </Link>
              }
            />
          </div>
        </div>
      ) : (
        // Bookings Cards List
        <div className="space-y-6">
          {bookings.map((booking, idx) => (
            <BookingHistoryCard
              key={booking.id}
              booking={booking}
              index={idx}
              onCancelClick={(b) => setSelectedCancelBooking(b)}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 flex justify-center reveal-up">
              <StandardPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) =>
                  updateQueryParams({ page: String(p) }, { scroll: true })
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Cancel Request Dialog */}
      {selectedCancelBooking && (
        <CancelBookingDialog
          isOpen={!!selectedCancelBooking}
          onClose={() => setSelectedCancelBooking(null)}
          bookingId={selectedCancelBooking.id}
          onSubmitSuccess={() => refetch()}
        />
      )}

    </div>
  );
}
