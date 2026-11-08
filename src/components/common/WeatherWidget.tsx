import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudRainWind,
  CloudLightning,
  Droplets,
  Wind,
  Compass,
  ShieldAlert,
} from 'lucide-react';
import { useDashboard } from '../../state/DashboardContext';

interface WeatherWidgetProps {
  layout?: 'compact' | 'card' | 'detailed';
  className?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  layout = 'card',
  className = '',
}) => {
  const { weather, aqi } = useDashboard();

  const renderIcon = (code: number, isDay: boolean, size: number = 32) => {
    switch (code) {
      case 0:
        return isDay ? <Sun size={size} className="text-amber-400" /> : <Moon size={size} className="text-indigo-300" />;
      case 1:
        return isDay ? <Sun size={size} className="text-amber-300" /> : <Moon size={size} className="text-indigo-200" />;
      case 2:
        return isDay ? <CloudSun size={size} className="text-amber-300" /> : <CloudMoon size={size} className="text-indigo-300" />;
      case 3:
        return <Cloud size={size} className="text-gray-300" />;
      case 45:
      case 48:
        return <CloudFog size={size} className="text-gray-400" />;
      case 51:
      case 53:
      case 55:
        return <CloudDrizzle size={size} className="text-blue-300" />;
      case 61:
      case 63:
      case 65:
        return <CloudRain size={size} className="text-blue-400" />;
      case 71:
      case 73:
      case 75:
        return <CloudSnow size={size} className="text-blue-200" />;
      case 80:
      case 81:
      case 82:
        return <CloudRainWind size={size} className="text-cyan-400" />;
      case 95:
      case 96:
      case 99:
        return <CloudLightning size={size} className="text-yellow-400" />;
      default:
        return <Sun size={size} className="text-amber-400" />;
    }
  };

  if (layout === 'compact') {
    return (
      <div className={`flex items-center space-x-3 glass-panel px-4 py-2 rounded-2xl ${className}`}>
        {renderIcon(weather.conditionCode, weather.isDay, 28)}
        <div className="flex flex-col">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono-numbers text-white">{weather.temperature}°C</span>
            <span className="text-xs text-gray-300 font-medium">{weather.condition}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400 font-mono-numbers">
            <span>H: {weather.highTemp}°</span>
            <span>L: {weather.lowTemp}°</span>
            <span className="flex items-center text-blue-400"><Droplets size={12} className="mr-0.5" />{weather.rainProbability}%</span>
          </div>
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-full font-semibold ml-auto border"
          style={{
            borderColor: `${aqi.color}60`,
            backgroundColor: `${aqi.color}25`,
            color: aqi.color,
          }}
        >
          AQI {aqi.usAqi}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-panel rounded-3xl p-6 shadow-xl relative overflow-hidden ${className}`}>
      {/* Background ambient gradient */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Current temp and condition */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-extrabold font-mono-numbers tracking-tight text-white">
              {weather.temperature}°
            </span>
            <span className="text-xl text-gray-300 font-medium font-mono-numbers">C</span>
          </div>
          <div className="text-lg text-gray-200 font-semibold mt-0.5">{weather.condition}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Feels like <span className="font-mono-numbers text-gray-300 font-medium">{weather.apparentTemperature}°C</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="p-3 glass-pill rounded-2xl mb-2">
            {renderIcon(weather.conditionCode, weather.isDay, 44)}
          </div>
          {/* AQI Badge */}
          <div
            className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border backdrop-blur-md"
            style={{
              borderColor: `${aqi.color}60`,
              backgroundColor: `${aqi.color}20`,
              color: aqi.color,
            }}
          >
            <ShieldAlert size={12} />
            <span>AQI {aqi.usAqi}</span>
            <span className="opacity-75 text-[10px]">({aqi.label})</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-white/10 text-xs">
        <div className="flex flex-col">
          <span className="text-gray-400">High / Low</span>
          <span className="font-mono-numbers font-semibold text-white mt-0.5">
            {weather.highTemp}° / {weather.lowTemp}°
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 flex items-center"><Droplets size={11} className="mr-1 text-blue-400" />Rain %</span>
          <span className="font-mono-numbers font-semibold text-blue-300 mt-0.5">
            {weather.rainProbability}%
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 flex items-center"><Wind size={11} className="mr-1 text-teal-400" />Wind</span>
          <span className="font-mono-numbers font-semibold text-white mt-0.5">
            {weather.windSpeed} km/h
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 flex items-center"><Sun size={11} className="mr-1 text-amber-400" />UV Index</span>
          <span className="font-mono-numbers font-semibold text-amber-300 mt-0.5">
            {weather.uvIndex} (Mod)
          </span>
        </div>
      </div>

      {/* Hourly Forecast strip */}
      {layout === 'detailed' && weather.hourly && weather.hourly.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">
            Upcoming Hours
          </div>
          <div className="flex items-center justify-between space-x-2 overflow-x-auto pb-1">
            {weather.hourly.slice(0, 6).map((h, i) => (
              <div key={i} className="flex flex-col items-center flex-1 min-w-[50px] p-2 rounded-xl bg-white/5">
                <span className="text-[11px] text-gray-400 font-mono-numbers">{h.time}</span>
                <div className="my-1.5">{renderIcon(h.conditionCode, true, 20)}</div>
                <span className="text-xs font-bold font-mono-numbers text-white">{h.temp}°</span>
                {h.pop > 15 && (
                  <span className="text-[10px] text-blue-400 font-mono-numbers flex items-center mt-0.5">
                    <Droplets size={8} className="mr-0.5" />{h.pop}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
