"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Location } from "@/types";
import "leaflet/dist/leaflet.css";

// Prevent server-side compile failures for leaflet-routing-machine
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).L = L;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet-routing-machine");
}

interface LeafletNearbyMapProps {
  userCoords: { lat: number; lng: number } | null;
  selectedLocation: (Location & { distance?: number }) | null;
  zoom: number;
}

// Custom markers using premium SVG styling
const createUserIcon = () => {
  return L.divIcon({
    className: "custom-user-marker",
    html: `
      <div class="relative flex items-center justify-center h-6 w-6">
        <span class="absolute inline-flex h-full w-full rounded-full bg-[#1a73e8] opacity-40 animate-ping"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#1a73e8] border-2 border-white shadow-md"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const createDestIcon = () => {
  return L.divIcon({
    className: "custom-dest-marker",
    html: `
      <div class="flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ea4335" class="w-8 h-8 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

export default function LeafletNearbyMap({
  userCoords,
  selectedLocation,
  zoom,
}: LeafletNearbyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routingControlRef = useRef<any>(null);
  const markersRef = useRef<{ user?: L.Marker; destination?: L.Marker }>({});

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = userCoords
      ? ([userCoords.lat, userCoords.lng] as [number, number])
      : ([16.0611, 108.2274] as [number, number]);

    const map = L.map(mapContainerRef.current, {
      zoomControl: false, // Disables default zoom buttons
      attributionControl: false,
    }).setView(initialCenter, zoom);

    // Standard OpenStreetMap tiles (bright light theme like Google Maps)
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
      }
    ).addTo(map);

    mapRef.current = map;

    // Force map size recalculation after a minor delay to avoid gray rendering boxes.
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Sync zoom level from parent props
  useEffect(() => {
    const map = mapRef.current;
    if (map && map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }
  }, [zoom]);

  // 3. Handle coordinate and selection updates
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    if (markersRef.current.user) {
      markersRef.current.user.remove();
      markersRef.current.user = undefined;
    }
    if (markersRef.current.destination) {
      markersRef.current.destination.remove();
      markersRef.current.destination = undefined;
    }

    // Clear existing routes
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    const hasUser = !!userCoords;
    const hasDest =
      !!selectedLocation &&
      Number.isFinite(Number(selectedLocation.latitude)) &&
      Number.isFinite(Number(selectedLocation.longitude));

    const userLatLng = hasUser ? L.latLng(userCoords!.lat, userCoords!.lng) : null;
    const destLatLng = hasDest
      ? L.latLng(Number(selectedLocation!.latitude), Number(selectedLocation!.longitude))
      : null;

    // Case A: Both user coordinates and selected destination are active -> Draw Route
    if (userLatLng && destLatLng) {
      const userMarker = L.marker(userLatLng, { icon: createUserIcon() }).addTo(map);
      const destMarker = L.marker(destLatLng, { icon: createDestIcon() }).addTo(map);

      markersRef.current.user = userMarker;
      markersRef.current.destination = destMarker;

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routingControl = (L as any).Routing.control({
          waypoints: [userLatLng, destLatLng],
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          show: false,
          createMarker: () => null, // Marker drawing is handled manually above
          lineOptions: {
            styles: [
              { color: "#ffffff", weight: 6, opacity: 0.8 },
              { color: "#1a73e8", weight: 4, opacity: 0.95 }, // Google Maps Blue Route Line
            ],
          },
        }).addTo(map);

        routingControlRef.current = routingControl;
      } catch (err) {
        console.error("Leaflet routing control initialization failed:", err);
      }
    }
    // Case B: Only User GPS location is active
    else if (userLatLng) {
      const userMarker = L.marker(userLatLng, { icon: createUserIcon() }).addTo(map);
      markersRef.current.user = userMarker;
      map.setView(userLatLng, 14);
    }
    // Case C: Only Destination is active
    else if (destLatLng) {
      const destMarker = L.marker(destLatLng, { icon: createDestIcon() }).addTo(map);
      markersRef.current.destination = destMarker;
      map.setView(destLatLng, 14);
    }
    // Case D: Default Center
    else {
      map.setView([16.0611, 108.2274], 13);
    }
  }, [userCoords, selectedLocation]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* CSS overrides to hide leaflet elements we do not want */}
      <style jsx global>{`
        .leaflet-routing-container,
        .leaflet-routing-error {
          display: none !important;
        }
        .leaflet-bar {
          border: 1px solid #dddddd !important;
          background-color: #ffffff !important;
          border-radius: 12px !important;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12) !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background-color: #ffffff !important;
          color: #222222 !important;
          border-bottom: 1px solid #ebebeb !important;
          transition: all 0.2s;
        }
        .leaflet-bar a:hover {
          background-color: #f7f7f7 !important;
          color: #ff385c !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          margin-top: 16px !important;
          margin-left: 16px !important;
        }
      `}</style>
    </div>
  );
}
