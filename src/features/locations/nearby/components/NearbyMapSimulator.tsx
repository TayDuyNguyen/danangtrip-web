"use client";

import { useMemo, useState } from "react";
import type { Location } from "@/types";
import { PUBLIC_ROUTES } from "@/config/routes";
import { IoWalkOutline } from "@/components/icons/solar";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const LeafletNearbyMap = dynamic(
  () => import("./LeafletNearbyMap"),
  { ssr: false }
);

interface NearbyMapSimulatorProps {
  userCoords: { lat: number; lng: number } | null;
  radius: number;
  selectedLocation: (Location & { distance?: number }) | null;
}

const DA_NANG_CENTER = { lat: 16.0611, lng: 108.2274 };

export default function NearbyMapSimulator({
  userCoords,
  radius,
  selectedLocation,
}: NearbyMapSimulatorProps) {
  const t = useTranslations("locations");
  const [zoom, setZoom] = useState(13);

  const activeLocation = selectedLocation;

  const directionsUrl = useMemo(() => {
    if (!activeLocation) return "";
    const lat = Number(activeLocation.latitude);
    const lng = Number(activeLocation.longitude);
    if (userCoords) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }, [activeLocation, userCoords]);

  const mapTarget = useMemo(() => {
    if (activeLocation) {
      const lat = Number(activeLocation.latitude);
      const lng = Number(activeLocation.longitude);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng, label: activeLocation.name, address: activeLocation.address };
      }
    }

    if (userCoords) {
      return { 
        ...userCoords, 
        label: t("nearby.map.user_marker") || "Your position",
        address: t("nearby.map.user_address") || "Đà Nẵng, Việt Nam"
      };
    }

    return { ...DA_NANG_CENTER, label: "Da Nang", address: "Đà Nẵng, Việt Nam" };
  }, [activeLocation, t, userCoords]);


  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-3 border-b border-border bg-white px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-primary">
            {t("nearby.radius.label") || "Search radius"} {radius} km
          </p>
          <h2 className="mt-1 text-lg font-semibold text-on-surface">
            {activeLocation?.name || t("nearby.map.user_marker") || "Your position"}
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-on-surface-subtle">
            <span>GPS: {mapTarget.lat.toFixed(5)}, {mapTarget.lng.toFixed(5)}</span>
            {mapTarget.address && (
              <>
                <span className="font-normal text-[#c4c4c4]">·</span>
                <span className="max-w-[200px] truncate font-medium text-on-surface-subtle sm:max-w-[320px] lg:max-w-[380px]" title={mapTarget.address}>
                  {mapTarget.address}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeLocation && (
            <>
              <a
                href={PUBLIC_ROUTES.LOCATION_DETAIL(activeLocation.slug)}
                className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-[#5c3822] px-4 py-2.5 text-xs font-black text-white transition leading-none h-10 shadow-md"
              >
                {t("nearby.map.view_details") ? t("nearby.map.view_details").replace(" →", "") : "Chi tiết"}
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border bg-[#fafafa] px-4 py-2.5 text-xs font-black text-on-surface transition leading-none shadow-sm hover:bg-white"
              >
                <IoWalkOutline className="text-sm text-[#1a73e8]" />
                Google Maps
              </a>
            </>
          )}

          {activeLocation && <div className="mx-1 hidden h-6 w-px bg-border sm:block" />}

          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(10, value - 1))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-[#fafafa] text-lg font-black text-on-surface transition hover:border-primary hover:bg-primary/10"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="min-w-12 rounded-xl border border-border bg-[#fafafa] px-3 py-2 text-center text-xs font-black text-on-surface">
            {zoom}
          </span>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(17, value + 1))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-[#fafafa] text-lg font-black text-on-surface transition hover:border-primary hover:bg-primary/10"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative z-0 h-[430px] bg-[#f5f5f5]">
        <LeafletNearbyMap
          userCoords={userCoords}
          selectedLocation={selectedLocation}
          zoom={zoom}
        />
      </div>
    </div>
  );
}
