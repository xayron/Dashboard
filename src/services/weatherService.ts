import type { AQIData, WeatherData } from '../types/dashboard';

// Default coordinates: New Delhi, India (IST time zone) or configurable via localStorage
export interface WeatherCoords {
  latitude: number;
  longitude: number;
  city: string;
}

const DEFAULT_COORDS: WeatherCoords = {
  latitude: 28.6139,
  longitude: 77.2090,
  city: 'New Delhi',
};

const COORDS_KEY = 'dashboard_weather_coords';

export const getSavedCoords = (): WeatherCoords => {
  try {
    const raw = localStorage.getItem(COORDS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse weather coords', e);
  }
  return DEFAULT_COORDS;
};

export const saveCoords = (coords: WeatherCoords): void => {
  localStorage.setItem(COORDS_KEY, JSON.stringify(coords));
};

// Map WMO Weather Interpretation Codes to friendly labels and Lucide icons
export const getWeatherCondition = (code: number, isDay: boolean = true): { label: string; icon: string } => {
  switch (code) {
    case 0:
      return { label: isDay ? 'Clear Sky' : 'Clear Night', icon: isDay ? 'Sun' : 'Moon' };
    case 1:
      return { label: 'Mainly Clear', icon: isDay ? 'Sun' : 'Moon' };
    case 2:
      return { label: 'Partly Cloudy', icon: isDay ? 'CloudSun' : 'CloudMoon' };
    case 3:
      return { label: 'Overcast', icon: 'Cloud' };
    case 45:
    case 48:
      return { label: 'Foggy', icon: 'CloudFog' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: 'CloudDrizzle' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', icon: 'CloudRain' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snowfall', icon: 'CloudSnow' };
    case 80:
    case 81:
    case 82:
      return { label: 'Rain Showers', icon: 'CloudRainWind' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: 'CloudLightning' };
    default:
      return { label: 'Clear', icon: isDay ? 'Sun' : 'Moon' };
  }
};

const mapAQIToInfo = (usAqi: number): { label: AQIData['label']; color: string } => {
  if (usAqi <= 50) return { label: 'Good', color: '#10b981' };
  if (usAqi <= 100) return { label: 'Moderate', color: '#f59e0b' };
  if (usAqi <= 150) return { label: 'Unhealthy for Sensitive', color: '#f97316' };
  if (usAqi <= 200) return { label: 'Unhealthy', color: '#ef4444' };
  if (usAqi <= 300) return { label: 'Very Unhealthy', color: '#8b5cf6' };
  return { label: 'Hazardous', color: '#7f1d1d' };
};

export const fetchWeatherData = async (coords: WeatherCoords = getSavedCoords()): Promise<{ weather: WeatherData; aqi: AQIData }> => {
  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto&forecast_days=6`;

    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.latitude}&longitude=${coords.longitude}&current=pm10,pm2_5,us_aqi&timezone=auto`;

    const [wRes, aRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(aqiUrl),
    ]);

    if (!wRes.ok || !aRes.ok) {
      throw new Error('Open-Meteo returned non-200');
    }

    const wData = await wRes.json();
    const aData = await aRes.json();

    const current = wData.current;
    const daily = wData.daily;
    const hourly = wData.hourly;

    const sunriseStr = daily?.sunrise?.[0] ? new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '06:15';
    const sunsetStr = daily?.sunset?.[0] ? new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '18:10';

    // Format hourly next 8 intervals
    const nowHour = new Date().getHours();
    const formattedHourly: WeatherData['hourly'] = [];
    if (hourly?.time) {
      for (let i = nowHour; i < Math.min(nowHour + 8, hourly.time.length); i++) {
        formattedHourly.push({
          time: new Date(hourly.time[i]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          temp: Math.round(hourly.temperature_2m[i]),
          pop: hourly.precipitation_probability?.[i] ?? 0,
          conditionCode: hourly.weather_code[i] ?? 0,
        });
      }
    }

    // Format 5-day daily forecast
    const formattedDaily: WeatherData['daily'] = [];
    if (daily?.time) {
      for (let i = 1; i < Math.min(6, daily.time.length); i++) {
        const d = new Date(daily.time[i]);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        formattedDaily.push({
          day: dayName,
          date: daily.time[i],
          high: Math.round(daily.temperature_2m_max[i]),
          low: Math.round(daily.temperature_2m_min[i]),
          conditionCode: daily.weather_code[i],
          rainProb: daily.precipitation_probability_max?.[i] ?? 0,
        });
      }
    }

    const cond = getWeatherCondition(current.weather_code, current.is_day === 1);

    const weather: WeatherData = {
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      condition: cond.label,
      conditionCode: current.weather_code,
      highTemp: Math.round(daily?.temperature_2m_max?.[0] ?? current.temperature_2m + 4),
      lowTemp: Math.round(daily?.temperature_2m_min?.[0] ?? current.temperature_2m - 5),
      rainProbability: daily?.precipitation_probability_max?.[0] ?? 10,
      humidity: Math.round(current.relative_humidity_2m),
      uvIndex: Math.round(daily?.uv_index_max?.[0] ?? 4),
      windSpeed: Math.round(current.wind_speed_10m),
      sunrise: sunriseStr,
      sunset: sunsetStr,
      isDay: current.is_day === 1,
      hourly: formattedHourly,
      daily: formattedDaily,
    };

    const usAqi = aData?.current?.us_aqi ? Math.round(aData.current.us_aqi) : 85;
    const aqiInfo = mapAQIToInfo(usAqi);

    const aqi: AQIData = {
      pm25: Math.round(aData?.current?.pm2_5 ?? 32),
      pm10: Math.round(aData?.current?.pm10 ?? 64),
      usAqi,
      label: aqiInfo.label,
      color: aqiInfo.color,
    };

    return { weather, aqi };
  } catch (err) {
    console.warn('Using offline/cached weather & AQI fallback data:', err);
    return getFallbackWeatherAndAQI();
  }
};

export const getFallbackWeatherAndAQI = (): { weather: WeatherData; aqi: AQIData } => {
  return {
    weather: {
      temperature: 24,
      apparentTemperature: 25,
      condition: 'Partly Cloudy',
      conditionCode: 2,
      highTemp: 28,
      lowTemp: 19,
      rainProbability: 15,
      humidity: 58,
      uvIndex: 5,
      windSpeed: 12,
      sunrise: '06:22',
      sunset: '18:04',
      isDay: true,
      hourly: [
        { time: 'Now', temp: 24, pop: 10, conditionCode: 2 },
        { time: '11:00', temp: 26, pop: 10, conditionCode: 1 },
        { time: '13:00', temp: 28, pop: 15, conditionCode: 1 },
        { time: '15:00', temp: 27, pop: 20, conditionCode: 2 },
        { time: '17:00', temp: 25, pop: 15, conditionCode: 2 },
        { time: '19:00', temp: 23, pop: 5, conditionCode: 0 },
        { time: '21:00', temp: 21, pop: 5, conditionCode: 0 },
      ],
      daily: [
        { day: 'Tue', date: '2026-11-10', high: 29, low: 18, conditionCode: 1, rainProb: 10 },
        { day: 'Wed', date: '2026-11-11', high: 28, low: 19, conditionCode: 2, rainProb: 20 },
        { day: 'Thu', date: '2026-11-12', high: 27, low: 18, conditionCode: 61, rainProb: 65 },
        { day: 'Fri', date: '2026-11-13', high: 26, low: 17, conditionCode: 3, rainProb: 30 },
        { day: 'Sat', date: '2026-11-14', high: 28, low: 18, conditionCode: 0, rainProb: 5 },
      ],
    },
    aqi: {
      pm25: 38,
      pm10: 72,
      usAqi: 107,
      label: 'Unhealthy for Sensitive',
      color: '#f97316',
    },
  };
};
