export type MapProvider = "vietmap" | "goong" | "osm";

const vietmapApiKey = process.env.NEXT_PUBLIC_VIETMAP_API_KEY?.trim() ?? "";
const goongMaptilesKey = process.env.NEXT_PUBLIC_GOONG_MAPTILES_KEY?.trim() ?? "";

export function resolveMapProvider(): MapProvider {
  if (vietmapApiKey) return "vietmap";
  if (goongMaptilesKey) return "goong";
  return "osm";
}

export function usesVietnameseMapData() {
  const provider = resolveMapProvider();
  return provider === "vietmap" || provider === "goong";
}

export function getVietmapApiKey() {
  return vietmapApiKey;
}

export function getGoongMaptilesKey() {
  return goongMaptilesKey;
}

export function getVietmapStyleUrl(apiKey = vietmapApiKey) {
  return `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${apiKey}`;
}

export const GOONG_MAP_STYLE_URL =
  "https://tiles.goong.io/assets/goong_map_web.json";

/** Lãnh thổ Việt Nam (đất liền + vùng biển) — dùng khi có bản đồ VN */
export const VIETNAM_MAP_BOUNDS = {
  southWest: [8.0, 102.0] as [number, number],
  northEast: [23.5, 110.5] as [number, number],
};

/** Miền Trung — giới hạn OSM fallback, tránh nhãn tranh chấp phía đông */
export const CENTRAL_VIETNAM_BOUNDS = {
  southWest: [14.4, 106.4] as [number, number],
  northEast: [17.3, 109.4] as [number, number],
};

export function getExploreMapBounds() {
  return usesVietnameseMapData() ? VIETNAM_MAP_BOUNDS : CENTRAL_VIETNAM_BOUNDS;
}
