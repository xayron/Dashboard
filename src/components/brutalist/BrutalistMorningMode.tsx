import React from 'react';
import { useDashboard } from '../../state/DashboardContext';
import { BrutalistBox } from './BrutalistBox';
import { CheckSquare, Square, Calendar, ArrowUpRight, Sun, CloudRain } from 'lucide-react';

export const BrutalistMorningMode: React.FC = () => {
  const { now, weather, aqi, events, tasks, toggleTask } = useDashboard();

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between overflow-hidden bg-[#111111] text-white select-none">
      <div className="grid grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Huge Brutalist Clock & Weather (Cols 1-4) */}
        <div className="col-span-4 flex flex-col space-y-4">
          <BrutalistBox
            title="CLOCK"
            badge="IST +05:30"
            badgeColor="bg-cyan-400 text-black"
            shadowColor="shadow-[5px_5px_0px_#00f0ff]"
          >
            <div className="py-2 text-center">
              <div className="text-7xl font-black tracking-tight text-white flex items-baseline justify-center">
                <span>{hours}:{minutes}</span>
                <span className="text-3xl text-yellow-400 ml-2 font-mono">:{seconds}</span>
              </div>
              <div className="mt-3 py-1.5 bg-white text-black font-black text-xs uppercase tracking-widest border border-black shadow-[2px_2px_0px_#000]">
                {dateFormatted}
              </div>
            </div>
          </BrutalistBox>

          <BrutalistBox
            title="METEO"
            badge={`${weather.temperature}°C`}
            badgeColor="bg-yellow-400 text-black"
            className="flex-1"
          >
            <div className="space-y-3 pt-1 text-xs font-bold">
              <div className="flex justify-between items-center p-2 bg-neutral-900 border border-white/20">
                <span className="text-neutral-400 uppercase">CONDITION:</span>
                <span className="text-yellow-300 uppercase">{weather.condition}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-900 border border-white/20">
                <span className="text-neutral-400 uppercase">FEELS LIKE:</span>
                <span className="text-white">{weather.apparentTemperature}°C</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-900 border border-white/20">
                <span className="text-neutral-400 uppercase">AIR QUALITY:</span>
                <span className="text-cyan-400 font-black">AQI {aqi.usAqi} • {aqi.label.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-neutral-900 border border-white/20">
                <span className="text-neutral-400 uppercase">SUNRISE / SET:</span>
                <span className="text-white">{weather.sunrise} / {weather.sunset}</span>
              </div>
            </div>
          </BrutalistBox>
        </div>

        {/* Center Column: Agenda & Schedule (Cols 5-8) */}
        <div className="col-span-4 flex flex-col">
          <BrutalistBox
            title="TODAY'S SCHEDULE"
            badge={`${events.length} EVENTS`}
            badgeColor="bg-fuchsia-400 text-black"
            shadowColor="shadow-[5px_5px_0px_#e879f9]"
            className="h-full"
          >
            <div className="space-y-3 overflow-y-auto max-h-[58vh] pr-1">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-neutral-900 border-2 border-white/80 shadow-[3px_3px_0px_#fff]"
                >
                  <div className="flex items-center justify-between text-[11px] font-black text-yellow-400 uppercase">
                    <span>{evt.startTime} — {evt.endTime}</span>
                    <span className="px-1.5 py-0.2 bg-white text-black font-bold text-[9px] uppercase">
                      {evt.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-1 leading-snug">{evt.title}</h4>
                  {evt.location && (
                    <p className="text-[11px] text-neutral-400 mt-1 uppercase">📍 {evt.location}</p>
                  )}
                </div>
              ))}
            </div>
          </BrutalistBox>
        </div>

        {/* Right Column: Mission Tasks (Cols 9-12) */}
        <div className="col-span-4 flex flex-col">
          <BrutalistBox
            title="ACTION ITEMS"
            badge={`${tasks.filter(t => !t.completed).length} PENDING`}
            badgeColor="bg-lime-400 text-black"
            shadowColor="shadow-[5px_5px_0px_#a3e635]"
            className="h-full"
          >
            <div className="space-y-2.5 overflow-y-auto max-h-[58vh] pr-1">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 border-2 cursor-pointer flex items-center justify-between transition-all ${
                    task.completed
                      ? 'bg-neutral-900/60 border-neutral-700 text-neutral-500 line-through'
                      : 'bg-black border-white shadow-[3px_3px_0px_#fff] text-white hover:translate-x-0.5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {task.completed ? (
                      <CheckSquare size={16} className="text-lime-400 shrink-0" />
                    ) : (
                      <Square size={16} className="text-yellow-400 shrink-0" />
                    )}
                    <span className="text-xs font-bold truncate">{task.title}</span>
                  </div>
                  {task.dueTime && (
                    <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-neutral-800 text-neutral-300 shrink-0 ml-2">
                      {task.dueTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </BrutalistBox>
        </div>
      </div>
    </div>
  );
};
