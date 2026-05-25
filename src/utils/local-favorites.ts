const LOCAL_FAVORITE_LOCATIONS_KEY = "danangtrip_local_favorite_locations";

const readFavoriteLocationIds = () => {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(LOCAL_FAVORITE_LOCATIONS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => Number.isInteger(id)) : [];
  } catch {
    return [];
  }
};

const writeFavoriteLocationIds = (ids: number[]) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(LOCAL_FAVORITE_LOCATIONS_KEY, JSON.stringify(Array.from(new Set(ids))));
};

export const localFavoriteLocations = {
  list() {
    return readFavoriteLocationIds();
  },

  has(locationId: number) {
    return readFavoriteLocationIds().includes(locationId);
  },

  add(locationId: number) {
    writeFavoriteLocationIds([...readFavoriteLocationIds(), locationId]);
  },

  remove(locationId: number) {
    writeFavoriteLocationIds(readFavoriteLocationIds().filter((id) => id !== locationId));
  },

  clear() {
    if (typeof window === "undefined") return;

    window.localStorage.removeItem(LOCAL_FAVORITE_LOCATIONS_KEY);
  },
};
