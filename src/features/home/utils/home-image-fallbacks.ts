export const isPlaceholderImage = (url?: string | null) => {
  if (!url) return true;

  const lower = url.toLowerCase();
  return (
    lower.includes("placeholder") ||
    lower.includes("destination") ||
    lower.includes("no-image") ||
    lower.includes("temp")
  );
};

const getFallbackIndex = (id: number | string | undefined, length: number) => {
  if (typeof id === "number") {
    return Math.abs(id) % length;
  }

  if (typeof id === "string") {
    return Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0) % length;
  }

  return 0;
};

const TOUR_FALLBACKS = [
  "/images/tours/bana-hills.png",
  "/images/tours/hoian.png",
  "/images/tours/sontra.png",
];

const LOCATION_FALLBACKS = [
  "/images/discovery/bana-hills.png",
  "/images/discovery/dragon-bridge.png",
  "/images/discovery/hoi-an.png",
  "/images/discovery/my-khe.png",
  "/images/discovery/son-tra.png",
];

export const getHomeTourImage = (thumbnail?: string | null, id?: number | string): string => {
  if (!isPlaceholderImage(thumbnail)) {
    return thumbnail as string;
  }

  return TOUR_FALLBACKS[getFallbackIndex(id, TOUR_FALLBACKS.length)];
};

export const getHomeLocationImage = (
  thumbnail?: string | null,
  images?: string[] | null,
  id?: number | string,
): string => {
  if (!isPlaceholderImage(thumbnail)) {
    return thumbnail as string;
  }

  const validGalleryImage = images?.find((image) => !isPlaceholderImage(image));
  if (validGalleryImage) {
    return validGalleryImage;
  }

  return LOCATION_FALLBACKS[getFallbackIndex(id, LOCATION_FALLBACKS.length)];
};

export const getHomeBlogImage = (featuredImage?: string | null, id?: number | string): string => {
  if (!isPlaceholderImage(featuredImage)) {
    return featuredImage as string;
  }

  return LOCATION_FALLBACKS[getFallbackIndex(id, LOCATION_FALLBACKS.length)];
};
