"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { useTranslations } from "next-intl";
import { SOVEREIGNTY_MARKERS } from "@/features/locations/explore/constants/sovereignty-markers";
import {
  createSovereigntyMarkerIcon,
  buildSovereigntyPopupHtml,
} from "@/features/locations/explore/utils/sovereignty-marker-icon";
import "leaflet/dist/leaflet.css";

const MAP_MARKERS = [
  { name: "Ba Na Hills", coords: [15.9984, 107.9968] as [number, number] },
  { name: "Sơn Trà", coords: [16.1213, 108.2778] as [number, number] },
  { name: "Mỹ Khê", coords: [16.0612, 108.2464] as [number, number] },
];

const createCustomIcon = (name: string) =>
  L.divIcon({
    className: "home-mini-map-marker",
    html: `
      <div class="flex flex-col items-center group cursor-pointer">
        <div class="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-primary shadow-lg animate-bounce duration-1000">
          <span class="text-[10px]">📍</span>
        </div>
        <span class="mt-0.5 whitespace-nowrap rounded border border-border bg-white/95 px-1 py-0.5 text-xs font-semibold text-on-surface shadow-md">
          ${name}
        </span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 26],
  });

export default function LeafletMiniMap() {
  const t = useTranslations("locations");
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Center Đà Nẵng
    const map = L.map(mapContainerRef.current, {
      attributionControl: false,
      zoomControl: true,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      dragging: true,
    }).setView([16.0544, 108.15], 10);

    // OpenStreetMap tile layer matches the standard map page style
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    MAP_MARKERS.forEach((marker) => {
      L.marker(marker.coords, {
        icon: createCustomIcon(marker.name),
      })
        .addTo(map)
        .bindPopup(marker.name);
    });

    SOVEREIGNTY_MARKERS.forEach((point) => {
      const label = point.id === "hoangSa" ? {
        title: t("explore.sovereignty.hoang_sa_title"),
        claim: t("explore.sovereignty.hoang_sa_claim"),
      } : {
        title: t("explore.sovereignty.truong_sa_title"),
        claim: t("explore.sovereignty.truong_sa_claim"),
      };

      L.marker([point.lat, point.lng], {
        icon: createSovereigntyMarkerIcon(label.title, label.claim),
        zIndexOffset: 1200,
        interactive: true,
      })
        .bindPopup(
          buildSovereigntyPopupHtml(label.title, label.claim),
          { maxWidth: 260, className: "explore-sovereignty-popup-wrapper" }
        )
        .addTo(map);
    });

    mapRef.current = map;

    // Force Leaflet to re-calculate container size to prevent broken tiles.
    const resizeTimer = window.setTimeout(() => {
      if (mapRef.current !== map) return;
      try {
        map.invalidateSize();
      } catch {
        // Leaflet can throw if the container was removed before the delayed resize runs.
      }
    }, 300);

    return () => {
      window.clearTimeout(resizeTimer);
      map.remove();
      mapRef.current = null;
    };
  }, [t]);

  return (
    <div className="w-full h-full relative home-mini-map-leaflet">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      <style jsx global>{`
        .home-mini-map-leaflet .leaflet-container {
          height: 100%;
          width: 100%;
          background: #f7f7f7 !important;
          border-radius: 12px;
        }
        
        .home-mini-map-leaflet .leaflet-bar {
          border: 1px solid #e7e7e7 !important;
          border-radius: 6px !important;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08) !important;
          margin-top: 8px !important;
          margin-left: 8px !important;
        }

        .home-mini-map-leaflet .leaflet-bar a {
          width: 24px !important;
          height: 24px !important;
          line-height: 22px !important;
          background: rgba(255, 255, 255, 0.95) !important;
          color: #1f2937 !important;
          border-bottom: 1px solid #ececec !important;
          font-size: 14px !important;
          font-weight: 900 !important;
          transition: all 0.2s;
        }

        .home-mini-map-leaflet .leaflet-bar a:hover {
          background: #fff1f3 !important;
          color: #ff385c !important;
        }

        .explore-sovereignty-marker {
          background: transparent !important;
          border: none !important;
        }
        .explore-sovereignty-marker__wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          width: 168px;
        }
        .explore-sovereignty-marker__flag {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 9999px;
          border: 2px solid #ffffff;
          background: #ffffff;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22);
        }
        .explore-sovereignty-marker__label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 6px 10px;
          border-radius: 12px;
          border: 1px solid #fecdd3;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.14);
          text-align: center;
        }
        .explore-sovereignty-marker__label strong {
          font-size: 11px;
          line-height: 1.3;
          font-weight: 800;
          color: #da251d;
        }
        .explore-sovereignty-marker__label span {
          font-size: 10px;
          line-height: 1.3;
          font-weight: 700;
          color: #334155;
        }
        .explore-sovereignty-popup-wrapper .leaflet-popup-content-wrapper {
          border-radius: 14px;
          border: 1px solid #fecdd3;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
        }
        .explore-sovereignty-popup {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 4px 2px;
          text-align: center;
        }
        .explore-sovereignty-popup__flag {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 9999px;
          border: 2px solid #fecdd3;
          background: #fff7f8;
        }
        .explore-sovereignty-popup__title {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: #da251d;
        }
        .explore-sovereignty-popup__claim {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
        }
      `}</style>
    </div>
  );
}
