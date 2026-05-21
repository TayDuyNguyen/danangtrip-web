import type { Weather, ApiResponse } from "@/types";

export const weatherService = {
  getWeather: async (): Promise<ApiResponse<Weather>> =>
    Promise.resolve({
      success: true,
      data: {
        temp: 0,
        condition: "unknown",
        icon: "01d",
      },
      message: "Weather endpoint is not available in current API",
    }),
};
