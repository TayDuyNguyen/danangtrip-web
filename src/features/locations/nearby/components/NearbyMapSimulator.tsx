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
    <div className="relative min-h-[500px] overflow-hidden rounded-2xl border border-[#262626] bg-[#030303]/60 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col gap-3 border-b border-[#262626] bg-[#030303]/70 backdrop-blur-md px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#8b6a55]">
            {t("nearby.radius.label") || "Search radius"} {radius} km
          </p>
          <h2 className="mt-1 text-lg font-black text-white">
            {activeLocation?.name || t("nearby.map.user_marker") || "Your position"}
          </h2>
          <p className="mt-1 text-xs font-semibold text-[#737373] flex flex-wrap items-center gap-1.5">
            <span>GPS: {mapTarget.lat.toFixed(5)}, {mapTarget.lng.toFixed(5)}</span>
            {mapTarget.address && (
              <>
                <span className="text-[#3b3b3b] font-normal">·</span>
                <span className="text-[#a3a3a3] font-medium truncate max-w-[200px] sm:max-w-[320px] lg:max-w-[380px]" title={mapTarget.address}>
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
                className="inline-flex items-center justify-center rounded-xl bg-[#8b6a55] hover:bg-[#5c3822] px-4 py-2.5 text-xs font-black text-white transition leading-none h-10 shadow-md"
              >
                {t("nearby.map.view_details") ? t("nearby.map.view_details").replace(" →", "") : "Chi tiết"}
              </a>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#262626] bg-[#111111] hover:bg-white/5 px-4 py-2.5 text-xs font-black text-white transition leading-none h-10 shadow-sm"
              >
                <IoWalkOutline className="text-sm text-[#1a73e8]" />
                Google Maps
              </a>
            </>
          )}

          {activeLocation && <div className="h-6 w-px bg-[#262626] mx-1 hidden sm:block" />}

          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(10, value - 1))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#262626] bg-[#111111] text-lg font-black text-white transition hover:border-[#8b6a55] hover:bg-[#8b6a55]/10"
            aria-label="Zoom out"
          >
            -
          </button>
          <span className="min-w-12 rounded-xl border border-[#262626] bg-[#111111] px-3 py-2 text-center text-xs font-black text-white">
            {zoom}
          </span>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(17, value + 1))}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#262626] bg-[#111111] text-lg font-black text-white transition hover:border-[#8b6a55] hover:bg-[#8b6a55]/10"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="relative h-[430px] bg-[#080808] z-0">
        <LeafletNearbyMap
          userCoords={userCoords}
          selectedLocation={selectedLocation}
          zoom={zoom}
        />
      </div>
    </div>
  );
}
