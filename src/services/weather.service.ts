import type { Weather, ApiResponse } from "@/types";

export const weatherService = {
  getWeather: async (): Promise<ApiResponse<Weather>> => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=16.0544&longitude=108.2022&current=temperature_2m,weather_code"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather from Open-Meteo");
      }
      const data = await response.json();
      const current = data?.current;
      if (!current) {
        throw new Error("Invalid weather data structure");
      }

      const temp = Math.round(current.temperature_2m);
      const code = current.weather_code;

      // Map weather code to condition and emoji icon
      let condition = "cloudy";
      let icon = "⛅";

      if (code === 0 || code === 1) {
        condition = "sunny";
        icon = "☀️";
      } else if (
        (code >= 51 && code <= 67) || 
        (code >= 80 && code <= 82) || 
        (code >= 95 && code <= 99)
      ) {
        condition = "rainy";
        icon = "🌧️";
      }

      return {
        success: true,
        data: {
          temp,
          condition,
          icon,
        },
        message: "Weather data fetched successfully from Open-Meteo",
      };
    } catch (error) {
      console.error("Weather fetch error:", error);
      // Return fallback to prevent UI crash
      return {
        success: true,
        data: {
          temp: 28, // Reasonable default temp for Da Nang
          condition: "sunny",
          icon: "☀️",
        },
        message: "Failed to fetch current weather, using fallback",
      };
    }
  }
};
