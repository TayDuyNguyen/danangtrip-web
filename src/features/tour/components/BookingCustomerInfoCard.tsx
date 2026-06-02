"use client";

import { useTranslations } from "next-intl";
import { IoPersonOutline, Phone, IoMailOutline, IoHomeOutline, MessageSquare } from "@/components/icons/solar";
import type { Booking } from "@/types";

interface BookingCustomerInfoCardProps {
  booking: Booking;
}

export function BookingCustomerInfoCard({ booking }: BookingCustomerInfoCardProps) {
  const t = useTranslations("tour.history");

  return (
    <div className="w-full rounded-[20px] border border-border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] md:p-6 reveal-up">
      <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-normal text-on-surface">
        <IoPersonOutline className="w-4.5 h-4.5 text-primary shrink-0" />
        {t("section_customer")}
      </h3>

      <div className="space-y-4 text-xs">
        {/* Full Name */}
        <div className="flex items-start gap-3">
          <IoPersonOutline className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">{t("representative_name")}</span>
            <span className="text-on-surface font-medium text-sm mt-0.5">{booking.customer_name}</span>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/30">
          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">{t("representative_phone")}</span>
              <span className="text-on-surface font-medium mt-0.5">{booking.customer_phone}</span>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <IoMailOutline className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">{t("representative_email")}</span>
              <span className="text-on-surface font-medium mt-0.5 select-all">{booking.customer_email}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="flex items-start gap-3 pt-3 border-t border-border/30">
          <IoHomeOutline className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">{t("representative_address")}</span>
            <span className="text-on-surface font-medium mt-0.5 leading-relaxed">
              {booking.customer_address || "—"}
            </span>
          </div>
        </div>

        {/* Special Notes */}
        <div className="flex items-start gap-3 pt-3 border-t border-border/30">
          <MessageSquare className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-normal text-on-surface-subtle">{t("representative_note")}</span>
            <span className="text-on-surface font-medium mt-0.5 leading-relaxed">
              {booking.customer_note || t("no_note")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
