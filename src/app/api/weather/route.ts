import { NextResponse } from "next/server";
import type { ApiResponse, Weather } from "@/types";

const DA_NANG_LATITUDE = 16.0544;
const DA_NANG_LONGITUDE = 108.2022;
const PRECIPITATION_THRESHOLD_MM = 0.2;
const FORECAST_HOURS = 6;
const REQUEST_TIMEOUT_MS = 5_000;

const isRainCode = (code: number) =>
  (code >= 51 && code <= 67) ||
  (code >= 80 && code <= 82) ||
  (code >= 95 && code <= 99);

const toNumberArray = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];
  return value.map(Number).filter(Number.isFinite);
};

const weatherResponse = (weather: Weather, provider: string) =>
  NextResponse.json<ApiResponse<Weather>>(
    {
      success: true,
      data: weather,
      message: `Weather data fetched successfully from ${provider}`,
    },
    {
      headers: {
        "Cache-Control":
          "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );

const unavailableResponse = () =>
  NextResponse.json<ApiResponse<Weather>>(
    {
      success: false,
      message: "Weather data is temporarily unavailable",
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );

async function fetchOpenMeteoWeather(): Promise<Weather | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      latitude: String(DA_NANG_LATITUDE),
      longitude: String(DA_NANG_LONGITUDE),
      current: "temperature_2m,weather_code,precipitation,rain,showers",
      hourly:
        "precipitation_probability,precipitation,rain,showers,weather_code",
      timezone: "Asia/Ho_Chi_Minh",
      forecast_hours: String(FORECAST_HOURS),
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
        next: {
          revalidate: 300,
        },
      },
    );

    if (!response.ok) return null;

    const data = await response.json();
    const current = data?.current;
    if (!current || !Number.isFinite(Number(current.temperature_2m))) {
      return null;
    }

    const temp = Math.round(Number(current.temperature_2m));
    const code = Number(current.weather_code);
    const currentPrecipitation =
      Number(current.precipitation ?? 0) +
      Number(current.rain ?? 0) +
      Number(current.showers ?? 0);
    const hourly = data?.hourly ?? {};
    const precipitationProbabilities = toNumberArray(
      hourly.precipitation_probability,
    ).slice(0, FORECAST_HOURS);
    const hourlyPrecipitation = toNumberArray(hourly.precipitation).slice(
      0,
      FORECAST_HOURS,
    );
    const hourlyRain = toNumberArray(hourly.rain).slice(0, FORECAST_HOURS);
    const hourlyShowers = toNumberArray(hourly.showers).slice(
      0,
      FORECAST_HOURS,
    );
    const maxRainProbability = precipitationProbabilities.length
      ? Math.max(...precipitationProbabilities)
      : 0;
    const maxHourlyPrecipitation = Math.max(
      0,
      ...hourlyPrecipitation,
      ...hourlyRain,
      ...hourlyShowers,
    );
    const isCurrentlyRaining =
      isRainCode(code) || currentPrecipitation >= PRECIPITATION_THRESHOLD_MM;

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
      temp,
      condition,
      icon,
      rainProbability: maxRainProbability,
      precipitation: Math.max(currentPrecipitation, maxHourlyPrecipitation),
      forecastHours: FORECAST_HOURS,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWttrWeather(): Promise<Weather | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("https://wttr.in/DaNang?format=j1", {
      headers: {
        Accept: "application/json",
        "User-Agent": "DanangTrip/1.0",
      },
      signal: controller.signal,
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const current = data?.current_condition?.[0];
    if (!current || !Number.isFinite(Number(current.temp_C))) return null;

    const code = Number(current.weatherCode);
    const precipitation = Number(current.precipMM ?? 0);
    const hourly = Array.isArray(data?.weather?.[0]?.hourly)
      ? data.weather[0].hourly.slice(0, 3)
      : [];
    const rainProbability = Math.max(
      0,
      ...hourly.map((item: { chanceofrain?: unknown }) =>
        Number(item.chanceofrain ?? 0),
      ),
    );
    const isRaining =
      precipitation >= PRECIPITATION_THRESHOLD_MM ||
      rainProbability >= 50 ||
      ![113, 116, 119, 122].includes(code);

    let condition = "cloudy";
    let icon = "⛅";

    if (isRaining) {
      condition = "rainy";
      icon = "🌧️";
    } else if (code === 113) {
      condition = "sunny";
      icon = "☀️";
    }

    return {
      temp: Math.round(Number(current.temp_C)),
      condition,
      icon,
      rainProbability,
      precipitation,
      forecastHours: FORECAST_HOURS,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const openMeteoWeather = await fetchOpenMeteoWeather();
  if (openMeteoWeather) {
    return weatherResponse(openMeteoWeather, "Open-Meteo");
  }

  const wttrWeather = await fetchWttrWeather();
  if (wttrWeather) {
    return weatherResponse(wttrWeather, "wttr.in");
  }

  return unavailableResponse();
}
