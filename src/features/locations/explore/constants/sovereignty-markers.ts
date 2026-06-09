/** Tọa độ đại diện để hiển thị marker chủ quyền trên bản đồ */
export const SOVEREIGNTY_MARKERS = [
  {
    id: "hoangSa" as const,
    lat: 16.6667,
    lng: 112.1667,
  },
  {
    id: "truongSa" as const,
    lat: 8.6389,
    lng: 111.9167,
  },
] as const;

export type SovereigntyMarkerId = (typeof SOVEREIGNTY_MARKERS)[number]["id"];
