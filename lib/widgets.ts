type UtilityWidgetsData = {
  city: string;
  weather: {
    temperatureC: number;
    windKph: number;
    condition: string;
  };
  airQuality: {
    aqi: number | null;
    pm25: number | null;
    pm10: number | null;
  };
  forex: {
    usd: number | null;
    eur: number | null;
  };
  updatedAt: string;
};

const weatherCodeLabels: Record<number, string> = {
  0: "Clear",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Cloudy",
  45: "Fog",
  51: "Light drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  80: "Showers",
  95: "Thunderstorm",
};

function roundIfNumber(value: unknown, digits = 1) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }

  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function weatherLabel(code: unknown) {
  if (typeof code !== "number") {
    return "Weather update";
  }

  return weatherCodeLabels[code] || "Weather update";
}

function nowStamp() {
  return new Date().toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

const fallbackWidgets: UtilityWidgetsData = {
  city: "Delhi",
  weather: {
    temperatureC: 30,
    windKph: 12,
    condition: "Weather update",
  },
  airQuality: {
    aqi: null,
    pm25: null,
    pm10: null,
  },
  forex: {
    usd: null,
    eur: null,
  },
  updatedAt: nowStamp(),
};

export async function getUtilityWidgets(): Promise<UtilityWidgetsData> {
  const weatherUrl =
    "https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,weather_code,wind_speed_10m&timezone=Asia%2FKolkata";
  const airQualityUrl =
    "https://air-quality-api.open-meteo.com/v1/air-quality?latitude=28.6139&longitude=77.2090&current=us_aqi,pm2_5,pm10&timezone=Asia%2FKolkata";
  const forexUrl = "https://api.frankfurter.app/latest?from=INR&to=USD,EUR";

  try {
    const [weatherRes, aqiRes, forexRes] = await Promise.all([
      fetch(weatherUrl, { next: { revalidate: 3600 } }),
      fetch(airQualityUrl, { next: { revalidate: 3600 } }),
      fetch(forexUrl, { next: { revalidate: 3600 } }),
    ]);

    const weatherPayload = weatherRes.ok ? ((await weatherRes.json()) as { current?: Record<string, unknown> }) : {};
    const aqiPayload = aqiRes.ok ? ((await aqiRes.json()) as { current?: Record<string, unknown> }) : {};
    const forexPayload = forexRes.ok ? ((await forexRes.json()) as { rates?: Record<string, unknown> }) : {};

    const weatherCurrent = weatherPayload.current || {};
    const aqiCurrent = aqiPayload.current || {};
    const rates = forexPayload.rates || {};

    return {
      city: "Delhi",
      weather: {
        temperatureC: roundIfNumber(weatherCurrent.temperature_2m) ?? fallbackWidgets.weather.temperatureC,
        windKph: roundIfNumber(weatherCurrent.wind_speed_10m) ?? fallbackWidgets.weather.windKph,
        condition: weatherLabel(weatherCurrent.weather_code),
      },
      airQuality: {
        aqi: roundIfNumber(aqiCurrent.us_aqi, 0),
        pm25: roundIfNumber(aqiCurrent.pm2_5),
        pm10: roundIfNumber(aqiCurrent.pm10),
      },
      forex: {
        usd: roundIfNumber(rates.USD, 4),
        eur: roundIfNumber(rates.EUR, 4),
      },
      updatedAt: nowStamp(),
    };
  } catch {
    return fallbackWidgets;
  }
}
