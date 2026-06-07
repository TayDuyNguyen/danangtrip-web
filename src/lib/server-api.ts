import "server-only";

type QueryValue = string | number | boolean | string[] | number[] | null | undefined;

type ApiEnvelope<T> = {
  data?: T;
  success?: boolean;
  code?: number;
  message?: string;
};

const SERVER_FETCH_TIMEOUT_MS = 10_000;

function getApiBaseUrl() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is required for server rendering");
  }

  return baseUrl;
}

function buildUrl(pathname: string, params?: Record<string, QueryValue>) {
  const url = new URL(`${getApiBaseUrl()}${pathname.startsWith("/") ? pathname : `/${pathname}`}`);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === null || value === undefined || value === "") continue;

    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, String(item));
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url;
}

export async function serverApiGet<T>(
  pathname: string,
  options: {
    locale?: string;
    params?: Record<string, QueryValue>;
    revalidate?: number | false;
  } = {},
): Promise<T> {
  const response = await fetch(buildUrl(pathname, options.params), {
    headers: {
      Accept: "application/json",
      "Accept-Language": options.locale || "vi",
    },
    cache: options.revalidate === false ? "no-store" : undefined,
    next: typeof options.revalidate === "number" ? { revalidate: options.revalidate } : undefined,
    signal: AbortSignal.timeout(SERVER_FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T> | T;

  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as ApiEnvelope<T>).data;
    if (data === undefined) throw new Error("API response did not include data");
    return data;
  }

  return payload as T;
}
