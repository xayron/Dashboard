import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { HudBox } from './HudBox';
import { Target, CheckCircle2, CircleDashed, Terminal, Compass } from 'lucide-react';

export const HudMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#030712] font-mono text-cyan-100 select-none">
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Tactical Chrono & Sensor Grid (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <HudBox title="CHRONO_TELEMETRY" code="SYNC//GPS" glowColor="cyan">
            <div className="flex flex-col items-center justify-center py-3">
              <div className="text-6xl font-black text-white tracking-widest flex items-baseline">
                <span className="text-cyan-300 drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  {hours}:{minutes}
                </span>
                <span className="text-2xl text-amber-400 ml-2 animate-pulse">:{seconds}</span>
              </div>
              <div className="text-xs text-cyan-400 font-bold mt-2 tracking-widest border-t border-cyan-500/20 pt-2 w-full text-center">
                DATE: {dateFormatted}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                SOLAR: UP {weather.sunrise} // DOWN {weather.sunset}
              </div>
            </div>
          </HudBox>

          <HudBox title="ATMOSPHERIC_SENSORS" code="LOC://SURFACE" glowColor="cyan" className="flex-1">
            <div className="space-y-2.5 pt-1 text-xs">
              <div className="flex justify-between items-center p-2 bg-cyan-950/20 border border-cyan-500/20">
                <span className="text-gray-400">TEMPERATURE:</span>
                <span className="text-cyan-300 font-bold text-sm">{weather.temperature}°C (FEEL: {weather.apparentTemperature}°C)</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-950/20 border border-cyan-500/20">
                <span className="text-gray-400">ATMOSPHERE:</span>
                <span className="text-white font-bold uppercase">{weather.condition}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-950/20 border border-cyan-500/20">
                <span className="text-gray-400">AIR_QUALITY_INDEX:</span>
                <span className="text-emerald-400 font-bold">AQI {aqi.usAqi} [{aqi.label.toUpperCase()}]</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-cyan-950/20 border border-cyan-500/20">
                <span className="text-gray-400">HUMIDITY // WIND:</span>
                <span className="text-cyan-300 font-bold">{weather.humidity}% // {weather.windSpeed} KM/H</span>
              </div>
            </div>
          </HudBox>
        </div>

        {/* Center Column: Mission Timetable (Cols 5-8) */}
        <div className="col-span-4 flex flex-col">
          <HudBox title="MISSION_SCHEDULE" code={`${events.length}_OPERATIONS`} glowColor="amber" className="h-full">
            <div className="space-y-3 overflow-y-auto max-h-[58vh] pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-[#061122]/80 border-l-2 border-amber-400 border-t border-r border-b border-cyan-500/20"
                >
                  <div className="flex items-center justify-between text-[11px] text-amber-400">
                    <span>⏱ {evt.startTime} - {evt.endTime}</span>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest">
                      [{evt.category}]
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 leading-snug">{evt.title}</h4>
                  {evt.location && (
                    <p className="text-[11px] text-gray-400 mt-1">SECTOR: {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </HudBox>
        </div>

        {/* Right Column: Tactical Action Directives (Cols 9-12) */}
        <div className="col-span-4 flex flex-col">
          <HudBox title="TACTICAL_DIRECTIVES" code="QUEUE" glowColor="emerald" className="h-full">
            <div className="space-y-2.5 overflow-y-auto max-h-[58vh] pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-2.5 border cursor-pointer flex items-center justify-between transition-all ${
                    task.completed
                      ? 'bg-black/60 border-gray-800 text-gray-600 line-through'
                      : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {task.completed ? (
                      <CheckCircle2 size={15} className="text-gray-600 shrink-0" />
                    ) : (
                      <CircleDashed size={15} className="text-emerald-400 shrink-0 animate-spin-slow" />
                    )}
                    <span className="text-xs truncate">{task.title}</span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[10px] text-cyan-400 font-mono shrink-0 ml-2">
                      [{task.dueTime}]
                    </span>
                  )}
                </div>
              ))}
            </div>
          </HudBox>
        </div>
      </div>
    </div>
  );
};
