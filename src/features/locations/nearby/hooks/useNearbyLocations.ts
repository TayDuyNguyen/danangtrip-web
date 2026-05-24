"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import type { Location } from "@/types";

export type GPSStatusType = "idle" | "requesting" | "approved" | "denied" | "error";

const getGeolocationErrorState = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return {
        status: "denied" as GPSStatusType,
        message: error.message || "Location permission was denied.",
      };
    case error.POSITION_UNAVAILABLE:
      return {
        status: "error" as GPSStatusType,
        message: error.message || "Your current location is unavailable.",
      };
    case error.TIMEOUT:
      return {
        status: "error" as GPSStatusType,
        message: error.message || "Location request timed out.",
      };
    default:
      return {
        status: "error" as GPSStatusType,
        message: error.message || "Unable to detect your location.",
      };
  }
};

interface UseNearbyLocationsProps {
  initialRadius?: number;
  initialSortBy?: string;
}

export function useNearbyLocations({
  initialRadius = 5,
  initialSortBy = "distance",
}: UseNearbyLocationsProps = {}) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<GPSStatusType>("idle");
  const [radius, setRadius] = useState<number>(initialRadius);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Request browser Geolocation access
  const requestGPS = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsStatus("error");
      setErrorMessage("Geolocation is not supported by your browser");
      return;
    }

    setGpsStatus("requesting");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsStatus("approved");
      },
      (error) => {
        const { status, message } = getGeolocationErrorState(error);
        setGpsStatus(status);
        setErrorMessage(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10s timeout
        maximumAge: 60000, // cache coordinates for 60s
      }
    );
  }, []);

  // Proactively auto-trigger GPS search on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      requestGPS();
    }, 0);
    return () => clearTimeout(timer);
  }, [requestGPS]);

  // Manual coordinate override (e.g. fallbacks to districts center coordinate nodes)
  const setManualCoordinates = useCallback((lat: number, lng: number) => {
    setCoords({ lat, lng });
    setGpsStatus("approved");
    setErrorMessage("");
  }, []);

  // React-Query coordinates alignment
  const queryParams = {
    lat: coords?.lat ?? 0,
    lng: coords?.lng ?? 0,
    radius,
    limit: 30, // Get generous list of matches to filter category on client
    sort_by: sortBy === "distance" ? undefined : (sortBy as "avg_rating" | "review_count" | "view_count" | "created_at" | "price_min"), // distance is the default
  };

  const {
    data: rawLocations = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Location[]>({
    queryKey: ["locations", "nearby", coords?.lat, coords?.lng, radius, sortBy],
    queryFn: async () => {
      if (!coords) return [];
      const response = await locationService.getNearby(queryParams);
      if (response.success && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    },
    enabled: !!coords, // Only fetch when valid device coords exist
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  return {
    coords,
    gpsStatus,
    radius,
    sortBy,
    errorMessage,
    locations: rawLocations,
    isLoading: isLoading || gpsStatus === "requesting",
    isError,
    error,
    isFetching,
    setRadius,
    setSortBy,
    requestGPS,
    setManualCoordinates,
    refetch,
  };
}
