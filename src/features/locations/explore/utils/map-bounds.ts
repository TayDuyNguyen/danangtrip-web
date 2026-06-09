import L from "leaflet";

/** Giới hạn bản đồ trong phạm vi lãnh thổ Việt Nam (bao gồm Hoàng Sa, Trường Sa) */
export const VIETNAM_MAP_BOUNDS = L.latLngBounds(
  [7.5, 102.0],
  [23.5, 117.0]
);
