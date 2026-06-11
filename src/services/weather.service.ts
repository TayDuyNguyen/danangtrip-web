import type { Weather, ApiResponse } from "@/types";

export const weatherService = {
  getWeather: async (): Promise<ApiResponse<Weather>> => {
    try {
      const response = await fetch("/api/weather", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message: "Weather data is temporarily unavailable",
        };
      }

      return (await response.json()) as ApiResponse<Weather>;
    } catch {
      return {
        success: false,
        message: "Weather data is temporarily unavailable",
      };
    }
  },
};
