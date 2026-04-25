"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { locationService } from "@/services/location.service";
import { getOrCreateBrowseSessionId } from "@/utils/browse-session";

/**
 * Fires POST /locations/{id}/view once per mount (deduped) for anonymous session tracking.
 */
export function useLocationRecordView(locationId: number) {
  const sentRef = useRef(false);
  const { mutate } = useMutation({
    mutationFn: () => locationService.recordView(locationId, getOrCreateBrowseSessionId()),
    retry: false,
  });

  useEffect(() => {
    if (sentRef.current) {
      return;
    }
    sentRef.current = true;
    mutate();
  }, [locationId, mutate]);
}
