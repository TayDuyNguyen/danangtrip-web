"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
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
        <span class="text-[8px] text-[#dfcfc5] font-black mt-0.5 bg-surface-container-high/90 px-1 py-0.5 rounded border border-border whitespace-nowrap shadow-md">
          ${name}
        </span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 26],
  });

export default function LeafletMiniMap() {
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

    // CartoDB Dark Matter tile layer matches the premium dark UI perfectly!
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 18,
    }).addTo(map);

    MAP_MARKERS.forEach((marker) => {
      L.marker(marker.coords, {
        icon: createCustomIcon(marker.name),
      })
        .addTo(map)
        .bindPopup(marker.name);
    });

    mapRef.current = map;

    // Force Leaflet to re-calculate container size to prevent broken tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full relative home-mini-map-leaflet">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      <style jsx global>{`
        .home-mini-map-leaflet .leaflet-container {
          height: 100%;
          width: 100%;
          background: #080808 !important;
          border-radius: 12px;
        }
        
        .home-mini-map-leaflet .leaflet-bar {
          border: 1px solid #262626 !important;
          border-radius: 6px !important;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
          margin-top: 8px !important;
          margin-left: 8px !important;
        }

        .home-mini-map-leaflet .leaflet-bar a {
          width: 24px !important;
          height: 24px !important;
          line-height: 22px !important;
          background: #111111 !important;
          color: #d4d4d4 !important;
          border-bottom: 1px solid #262626 !important;
          font-size: 14px !important;
          font-weight: 900 !important;
          transition: all 0.2s;
        }

        .home-mini-map-leaflet .leaflet-bar a:hover {
          background: #8b6a55 !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
