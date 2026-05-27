import type { Weather, ApiResponse } from "@/types";

const DA_NANG_LATITUDE = 16.0544;
const DA_NANG_LONGITUDE = 108.2022;
const PRECIPITATION_THRESHOLD_MM = 0.2;
const FORECAST_HOURS = 6;

const isRainCode = (code: number) =>
  (code >= 51 && code <= 67) ||
  (code >= 80 && code <= 82) ||
  (code >= 95 && code <= 99);

const toNumberArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value.map(Number).filter(Number.isFinite);
};

export const weatherService = {
  getWeather: async (): Promise<ApiResponse<Weather>> => {
    try {
      const params = new URLSearchParams({
        latitude: String(DA_NANG_LATITUDE),
        longitude: String(DA_NANG_LONGITUDE),
        current: "temperature_2m,weather_code,precipitation,rain,showers",
        hourly: "precipitation_probability,precipitation,rain,showers,weather_code",
        timezone: "Asia/Bangkok",
        forecast_hours: String(FORECAST_HOURS),
      });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`
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
      const code = Number(current.weather_code);
      const currentPrecipitation =
        Number(current.precipitation ?? 0) + Number(current.rain ?? 0) + Number(current.showers ?? 0);
      const hourly = data?.hourly ?? {};
      const precipitationProbabilities = toNumberArray(hourly.precipitation_probability).slice(0, FORECAST_HOURS);
      const hourlyPrecipitation = toNumberArray(hourly.precipitation).slice(0, FORECAST_HOURS);
      const hourlyRain = toNumberArray(hourly.rain).slice(0, FORECAST_HOURS);
      const hourlyShowers = toNumberArray(hourly.showers).slice(0, FORECAST_HOURS);
      const maxRainProbability = precipitationProbabilities.length
        ? Math.max(...precipitationProbabilities)
        : 0;
      const maxHourlyPrecipitation = Math.max(
        0,
        ...hourlyPrecipitation,
        ...hourlyRain,
        ...hourlyShowers
      );
      const isCurrentlyRaining =
        isRainCode(code) ||
        currentPrecipitation >= PRECIPITATION_THRESHOLD_MM;

      let condition = "cloudy";
      let icon = "⛅";

      if (isCurrentlyRaining) {
        condition = "rainy";
        icon = "🌧️";
      } else if (code === 0 || code === 1) {
        condition = "sunny";
        icon = "☀️";
      }

      return {
        success: true,
        data: {
          temp,
          condition,
          icon,
          rainProbability: maxRainProbability,
          precipitation: Math.max(currentPrecipitation, maxHourlyPrecipitation),
          forecastHours: FORECAST_HOURS,
        },
        message: "Weather data fetched successfully from Open-Meteo",
      };
    } catch (error) {
      console.error("Weather fetch error:", error);
      return {
        success: false,
        message: "Failed to fetch weather from Open-Meteo",
      };
    }
  }
};
