type NominatimAddress = {
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  city_district?: string;
  city?: string;
  town?: string;
  state?: string;
  country?: string;
};

type NominatimReverseResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

export function formatReverseGeocodeLabel(
  data: NominatimReverseResponse,
  locale: string
) {
  const address = data.address;
  if (!address) {
    return data.display_name ?? "";
  }

  const street = address.road ?? address.neighbourhood;
  const district =
    address.suburb ?? address.quarter ?? address.city_district ?? address.town;
  const city = address.city ?? address.town ?? address.state;

  const parts = [street, district, city].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(", ");
  }

  return data.display_name ?? (locale === "en" ? "Current location" : "Vị trí hiện tại");
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  locale: string
): Promise<string> {
  const language = locale === "en" ? "en" : "vi";
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("accept-language", language);

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "DanangTrip/1.0 (contact@danangtrip.local)",
    },
  });

  if (!response.ok) {
    throw new Error("Reverse geocode failed");
  }

  const data = (await response.json()) as NominatimReverseResponse;
  const label = formatReverseGeocodeLabel(data, locale);

  if (label) return label;

  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}
