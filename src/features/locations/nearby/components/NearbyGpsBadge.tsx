"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { IoAlertCircleOutline } from "@/components/icons/solar";
import type { GPSStatusType } from "../hooks/useNearbyLocations";
import { useGpsAddress } from "../hooks/useGpsAddress";

interface NearbyGpsBadgeProps {
  status: GPSStatusType;
  coords?: { lat: number; lng: number } | null;
  locale?: string;
}

export default function NearbyGpsBadge({
  status,
  coords = null,
  locale = "vi",
}: NearbyGpsBadgeProps) {
  const t = useTranslations("locations");
  const { data: address, isLoading: isAddressLoading } = useGpsAddress(
    coords,
    locale,
    status === "approved"
  );

  const badge = useMemo(() => {
    if (status === "requesting") {
      return {
        className: "border-amber-500/20 bg-amber-500/10 text-amber-600",
        dotClassName: "bg-amber-500 animate-pulse",
        label: t("nearby.gps_status.requesting"),
      };
    }
    if (status === "approved") {
      let label = t("nearby.gps_status.active_fallback");

      if (coords) {
        if (address) {
          label = `${address} · ${t("nearby.gps_status.updated")}`;
        } else if (isAddressLoading) {
          label = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} · ${t("nearby.gps_status.resolving")}`;
        } else {
          label = `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} · ${t("nearby.gps_status.updated")}`;
        }
      }

      return {
        className: "border-primary/20 bg-primary/10 text-primary",
        dotClassName: "bg-primary",
        label,
      };
    }
    return {
      className: "border-rose-500/20 bg-rose-500/10 text-rose-500",
      dotClassName: "bg-rose-500",
      label: t("nearby.gps_status.denied"),
    };
  }, [address, coords, isAddressLoading, status, t]);

  return (
    <div
      className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}
      title={badge.label}
    >
      {status === "denied" || status === "error" ? (
        <IoAlertCircleOutline className="shrink-0 text-sm" />
      ) : (
        <span className={`h-2 w-2 shrink-0 rounded-full ${badge.dotClassName}`} />
      )}
      <span className="truncate">{badge.label}</span>
    </div>
  );
}
