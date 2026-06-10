"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Location } from "@/types";
import { PUBLIC_ROUTES } from "@/config/routes";
import { getLocationMapsUrl } from "@/features/locations/utils/map-url";
import {
  createCategoryMarkerIcon,
  buildLocationPopupHtml,
} from "../utils/category-marker-icon";
import { getLocationCategoryMeta, getLocationCoords } from "../utils/location-category";
import { SOVEREIGNTY_MARKERS } from "../constants/sovereignty-markers";
import { VIETNAM_MAP_BOUNDS } from "../utils/map-bounds";
import {
  buildSovereigntyPopupHtml,
  createSovereigntyMarkerIcon,
} from "../utils/sovereignty-marker-icon";
import "leaflet/dist/leaflet.css";

if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).L = L;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("leaflet-routing-machine");
}

const DA_NANG_CENTER: [number, number] = [16.0611, 108.2274];

interface LeafletExploreMapProps {
  locale: string;
  locations: Location[];
  selectedLocationId: number | null;
  mapFocusNonce?: number;
  hoveredLocationId: number | null;
  userCoords: { lat: number; lng: number } | null;
  showRoute: boolean;
  onSelectLocation: (location: Location) => void;
  popupLabels: {
    detail: string;
    maps: string;
  };
  sovereigntyLabels: {
    hoangSa: { title: string; claim: string };
    truongSa: { title: string; claim: string };
  };
}

function withLocalePath(path: string, locale: string) {
  return locale === "vi" ? path : `/${locale}${path}`;
}

const createUserIcon = () =>
  L.divIcon({
    className: "explore-user-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:24px;height:24px">
        <span style="position:absolute;width:24px;height:24px;border-radius:9999px;background:#1a73e8;opacity:0.35"></span>
        <span style="position:relative;width:14px;height:14px;border-radius:9999px;background:#1a73e8;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25)"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export default function LeafletExploreMap({
  locale,
  locations,
  selectedLocationId,
  mapFocusNonce = 0,
  hoveredLocationId,
  userCoords,
  showRoute,
  onSelectLocation,
  popupLabels,
  sovereigntyLabels,
}: LeafletExploreMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const sovereigntyLayerRef = useRef<L.LayerGroup | null>(null);
  const markerByIdRef = useRef<Map<number, L.Marker>>(new Map());
  const locationByIdRef = useRef<Map<number, Location>>(new Map());
  const userMarkerRef = useRef<L.Marker | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const routingControlRef = useRef<any>(null);
  const onSelectRef = useRef(onSelectLocation);
  const hasFittedBoundsRef = useRef(false);

  useEffect(() => {
    onSelectRef.current = onSelectLocation;
  }, [onSelectLocation]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      maxBounds: VIETNAM_MAP_BOUNDS,
      maxBoundsViscosity: 0.85,
    }).setView(DA_NANG_CENTER, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    sovereigntyLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    const markerById = markerByIdRef.current;
    const locationById = locationByIdRef.current;

    const resizeTimer = window.setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      window.clearTimeout(resizeTimer);
      markerById.clear();
      locationById.clear();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
      sovereigntyLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const layer = sovereigntyLayerRef.current;
    if (!layer) return;

    layer.clearLayers();

    const labelById = {
      hoangSa: sovereigntyLabels.hoangSa,
      truongSa: sovereigntyLabels.truongSa,
    };

    SOVEREIGNTY_MARKERS.forEach((point) => {
      const label = labelById[point.id];
      const marker = L.marker([point.lat, point.lng], {
        icon: createSovereigntyMarkerIcon(label.title, label.claim),
        zIndexOffset: 1200,
        interactive: true,
      });

      marker.bindPopup(
        buildSovereigntyPopupHtml(label.title, label.claim),
        { maxWidth: 260, className: "explore-sovereignty-popup-wrapper" }
      );

      marker.addTo(layer);
    });
  }, [sovereigntyLabels]);

  const applyMarkerIcon = (
    marker: L.Marker,
    location: Location,
    isSelected: boolean,
    isHovered: boolean
  ) => {
    const category = getLocationCategoryMeta(location);
    marker.setIcon(
      createCategoryMarkerIcon(category.iconKey, category.iconBackground, {
        selected: isSelected,
        hovered: isHovered,
      })
    );
  };

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    markerByIdRef.current.clear();
    locationByIdRef.current.clear();

    locations.forEach((location) => {
      const coords = getLocationCoords(location);
      if (!coords) return;

      const category = getLocationCategoryMeta(location);
      const marker = L.marker([coords.lat, coords.lng], {
        icon: createCategoryMarkerIcon(category.iconKey, category.iconBackground),
      });

      marker.bindPopup(
        buildLocationPopupHtml({
          name: location.name,
          address: location.address,
          categoryName: category.name,
          rating: location.avg_rating,
          detailHref: withLocalePath(
            PUBLIC_ROUTES.LOCATION_DETAIL(location.slug),
            locale
          ),
          mapsHref: getLocationMapsUrl(location),
          detailLabel: popupLabels.detail,
          mapsLabel: popupLabels.maps,
        }),
        { maxWidth: 260, className: "explore-map-popup" }
      );

      marker.on("click", () => {
        onSelectRef.current(location);
        marker.openPopup();
      });

      marker.addTo(layer);
      markerByIdRef.current.set(location.id, marker);
      locationByIdRef.current.set(location.id, location);
    });

    hasFittedBoundsRef.current = false;
  }, [locale, locations, popupLabels.detail, popupLabels.maps]);

  useEffect(() => {
    markerByIdRef.current.forEach((marker, id) => {
      const location = locationByIdRef.current.get(id);
      if (!location) return;
      applyMarkerIcon(
        marker,
        location,
        selectedLocationId === id,
        hoveredLocationId === id
      );
    });
  }, [hoveredLocationId, selectedLocationId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedLocationId || mapFocusNonce === 0) return;

    const selected = locations.find((item) => item.id === selectedLocationId);
    const coords = selected ? getLocationCoords(selected) : null;
    if (!coords) return;

    map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 15), {
      duration: 0.8,
    });
    markerByIdRef.current.get(selectedLocationId)?.openPopup();
  }, [selectedLocationId, locations, mapFocusNonce]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }

    if (!userCoords) return;

    const userLatLng = L.latLng(userCoords.lat, userCoords.lng);
    userMarkerRef.current = L.marker(userLatLng, { icon: createUserIcon() }).addTo(map);

    const selected = selectedLocationId
      ? locations.find((item) => item.id === selectedLocationId)
      : null;
    const destCoords = selected ? getLocationCoords(selected) : null;

    if (showRoute && destCoords) {
      const destLatLng = L.latLng(destCoords.lat, destCoords.lng);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const routingControl = (L as any).Routing.control({
          waypoints: [userLatLng, destLatLng],
          routeWhileDragging: false,
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          show: false,
          createMarker: () => null,
          lineOptions: {
            styles: [
              { color: "#ffffff", weight: 6, opacity: 0.85 },
              { color: "#1a73e8", weight: 4, opacity: 0.95 },
            ],
          },
        }).addTo(map);

        routingControlRef.current = routingControl;
      } catch (error) {
        console.error("Explore map routing failed:", error);
      }
      return;
    }

    if (!selectedLocationId && !hasFittedBoundsRef.current) {
      map.setView(userLatLng, 14);
    }
  }, [userCoords, showRoute, selectedLocationId, locations]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || hasFittedBoundsRef.current || locations.length === 0) return;

    const bounds: L.LatLngExpression[] = locations
      .map((location) => getLocationCoords(location))
      .filter((coords): coords is { lat: number; lng: number } => coords !== null)
      .map((coords) => [coords.lat, coords.lng] as L.LatLngExpression);

    if (userCoords) {
      bounds.push([userCoords.lat, userCoords.lng]);
    }

    if (bounds.length > 1) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [80, 80], maxZoom: 14 });
      hasFittedBoundsRef.current = true;
    }
  }, [locations, userCoords]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full" />
      <style jsx global>{`
        .explore-category-marker,
        .explore-user-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-routing-container,
        .leaflet-routing-error {
          display: none !important;
        }
        .explore-map-popup .leaflet-popup-content-wrapper {
          border-radius: 14px;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
          border: 1px solid #e2e8f0;
        }
        .explore-map-popup .leaflet-popup-tip {
          box-shadow: none;
        }
        .leaflet-control-zoom {
          border: none !important;
          margin-right: 16px !important;
          margin-bottom: 16px !important;
        }
        .leaflet-control-zoom a {
          border-radius: 10px !important;
          border: 1px solid #e2e8f0 !important;
          color: #334155 !important;
          background: #ffffff !important;
        }
        .leaflet-control-zoom a:hover {
          color: #ff385c !important;
          background: #fff7f8 !important;
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
