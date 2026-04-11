import { config } from "@/config";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | null>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const buildUrl = (endpoint: string, params?: Record<string, any>) => {
  const url = new URL(endpoint, config.api.url);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
};

export const apiCall = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  const { params, ...fetchOptions } = options;

  const url = buildUrl(endpoint, params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  };

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "An error occurred",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred",
    };
  }
};

export const get = <T = any>(endpoint: string, options?: FetchOptions) => {
  return apiCall<T>(endpoint, { ...options, method: "GET" });
};

export const post = <T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
) => {
  return apiCall<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const put = <T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
) => {
  return apiCall<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const patch = <T = any>(
  endpoint: string,
  body?: any,
  options?: FetchOptions
) => {
  return apiCall<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
};

export const del = <T = any>(endpoint: string, options?: FetchOptions) => {
  return apiCall<T>(endpoint, { ...options, method: "DELETE" });
};
