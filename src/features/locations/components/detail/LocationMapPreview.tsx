"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Map as MapIcon } from "@/components/icons/solar";
import type { Location } from "@/types";
import "leaflet/dist/leaflet.css";

interface LocationMapPreviewProps {
  location: Location;
  showMapLink?: boolean;
}

const createLocationIcon = () =>
  L.divIcon({
    className: "location-detail-marker",
    html: `
      <div class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-primary shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" class="h-5 w-5">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clip-rule="evenodd" />
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

export default function LocationMapPreview({
  location,
  showMapLink = true,
}: LocationMapPreviewProps) {
  const t = useTranslations("locations");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const coords = useMemo(() => {
    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return null;
    }

    return { lat, lng };
  }, [location.latitude, location.longitude]);

  useEffect(() => {
    if (!coords || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([coords.lat, coords.lng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    markerRef.current = L.marker([coords.lat, coords.lng], {
      icon: createLocationIcon(),
    })
      .addTo(map)
      .bindPopup(location.name);

    mapRef.current = map;

    const resizeTimer = window.setTimeout(() => {
      if (mapRef.current !== map) return;
      try {
        map.invalidateSize();
      } catch {
        // Leaflet can throw if the container was removed before the delayed resize runs.
      }
    }, 200);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [coords, location.name]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !coords) return;

    const latLng = L.latLng(coords.lat, coords.lng);
    markerRef.current?.setLatLng(latLng);
    map.setView(latLng, 16);
  }, [coords]);

  if (!coords) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[28px] border border-border bg-[#f7f7f7]">
        <MapIcon className="h-12 w-12 text-on-surface-variant/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        {showMapLink && (
          <Link
            href={`/map?location_id=${location.id}`}
            className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-on-surface-subtle shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:border-primary hover:text-primary"
          >
            <MapIcon className="h-4 w-4 text-primary" />
            {t("detail.view_on_map")}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="location-detail-map relative aspect-video w-full overflow-hidden rounded-[28px] border border-border bg-[#f7f7f7] shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/15 via-transparent to-transparent" />
      {showMapLink && (
        <Link
          href={`/map?location_id=${location.id}`}
          className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/95 px-4 py-2 text-xs font-semibold text-on-surface-subtle shadow-[0_12px_24px_rgba(15,23,42,0.08)] backdrop-blur transition hover:border-primary hover:text-primary"
        >
          <MapIcon className="h-4 w-4 text-primary" />
          {t("detail.view_on_map")}
        </Link>
      )}

      <style jsx global>{`
        .location-detail-map .leaflet-container {
          height: 100%;
          width: 100%;
          background: #f7f7f7;
          font-family: inherit;
        }

        .location-detail-map .leaflet-control-attribution {
          display: none;
        }

        .location-detail-map .leaflet-control-zoom {
          margin-left: 12px !important;
          margin-top: 12px !important;
          border: 1px solid #e7e7e7 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.12);
        }

        .location-detail-map .leaflet-control-zoom a {
          width: 34px !important;
          height: 34px !important;
          line-height: 32px !important;
          border-bottom-color: #ececec !important;
          background: rgba(255, 255, 255, 0.95) !important;
          color: #1f2937 !important;
          font-size: 18px !important;
          font-weight: 800 !important;
        }

        .location-detail-map .leaflet-control-zoom a:hover {
          background: #fff1f3 !important;
          color: #ff385c !important;
        }
      `}</style>
    </div>
  );
}
