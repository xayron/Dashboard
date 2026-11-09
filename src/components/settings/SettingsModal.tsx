import React, { useState } from 'react';
import {
  X,
  Server,
  Cloud,
  Moon,
  Sun,
  Save,
  Check,
  Image as ImageIcon,
  RotateCcw,
  FolderOpen,
  Palette,
} from 'lucide-react';
import { useDashboard, UI_STYLES } from '../../state/DashboardContext';
import { haService, getSavedHAConfig, saveHAConfig } from '../../services/homeAssistant';
import { getSavedCoords, saveCoords, type WeatherCoords } from '../../services/weatherService';
import { photoService } from '../../services/photoService';
import { THEMES, type ThemeId } from '../../types/theme';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    theme,
    setTheme,
    uiStyle,
    setUiStyle,
    colorMode,
    setColorMode,
  } = useDashboard();

  const [haConfig, setHaConfig] = useState(getSavedHAConfig());
  const [coords, setCoords] = useState<WeatherCoords>(getSavedCoords());
  const [activeTab, setActiveTab] = useState<'ha' | 'weather' | 'photos' | 'themes' | 'display'>('themes');
  const [isSaved, setIsSaved] = useState(false);
  const [photoSource, setPhotoSource] = useState(photoService.getSource());
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');

  if (!isSettingsOpen) return null;

  const handleSaveHA = () => {
    haService.updateConfig(haConfig);
    saveHAConfig(haConfig);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveWeather = () => {
    saveCoords(coords);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    window.location.reload();
  };

  const handleAddPhoto = () => {
    if (!customPhotoUrl.trim()) return;
    const current = [...photoService.getPhotos()];
    current.unshift({
      id: `custom-${Date.now()}`,
      url: customPhotoUrl.trim(),
      title: 'Custom Photo',
      location: 'Personal Gallery',
      aspectRatio: 1.6,
      orientation: 'landscape',
      credit: 'User Added',
    });
    photoService.saveCustomPhotos(current);
    setCustomPhotoUrl('');
    setPhotoSource('custom');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleResetPhotos = () => {
    photoService.resetToShowcase();
    setPhotoSource('showcase');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const CITY_PRESETS = [
    { city: 'New Delhi', latitude: 28.6139, longitude: 77.2090 },
    { city: 'Mumbai', latitude: 19.0760, longitude: 72.8777 },
    { city: 'Bengaluru', latitude: 12.9716, longitude: 77.5946 },
    { city: 'Kolkata', latitude: 22.5726, longitude: 88.3639 },
    { city: 'Hyderabad', latitude: 17.3850, longitude: 78.4867 },
    { city: 'London', latitude: 51.5074, longitude: -0.1278 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <h2 className="text-xl font-bold font-display text-white">Dashboard Settings</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
              Smart Display Config
            </span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-white/10 px-6 pt-2 bg-white/5 space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'themes'
                ? 'bg-slate-900 text-white border-t border-x border-white/15'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Palette size={14} />
            <span>Styles & Themes</span>
          </button>
          <button
            onClick={() => setActiveTab('ha')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'ha'
                ? 'bg-slate-900 text-white border-t border-x border-white/15'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Server size={14} />
            <span>Home Assistant</span>
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'weather'
                ? 'bg-slate-900 text-white border-t border-x border-white/15'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Cloud size={14} />
            <span>Weather & AQI</span>
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'photos'
                ? 'bg-slate-900 text-white border-t border-x border-white/15'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ImageIcon size={14} />
            <span>Photos & Storage</span>
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'display'
                ? 'bg-slate-900 text-white border-t border-x border-white/15'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Moon size={14} />
            <span>Display & Sleep</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
          {/* THEMES & STYLES TAB */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* SECTION 1: UI DESIGN STYLES */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-white">Visual Design Styles</h3>
                  <span className="text-[11px] text-gray-400 font-mono">Press &apos;T&apos; to quick cycle</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Switch the overarching visual interface paradigm. Each design style features its own custom typography, borders, headers, and mode layouts.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {UI_STYLES.map((style) => {
                    const isSelected = uiStyle === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => setUiStyle(style.id)}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-600/15 border-blue-500 shadow-lg ring-1 ring-blue-500/50'
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-white">{style.name}</h4>
                            {isSelected && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500 text-white">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-blue-400">{style.tagline}</p>
                          <p className="text-[11px] text-gray-400 mt-1 leading-snug line-clamp-2">
                            {style.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400 font-mono flex items-center justify-between">
                          <span>STYLE ID: {style.id.toUpperCase()}</span>
                          {isSelected && <Check size={12} className="text-blue-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: INTERFACE COLOR MODE (LIGHT / DARK) */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      {colorMode === 'dark' ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-amber-400" />}
                      <span>Interface Mode (Light / Dark)</span>
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Toggle Light or Dark mode. Both modes dynamically integrate your chosen theme color palette across all 10 styles.
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 p-1 bg-black/40 rounded-xl border border-white/10 shrink-0">
                    <button
                      onClick={() => setColorMode('dark')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        colorMode === 'dark'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Moon size={13} />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => setColorMode('light')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                        colorMode === 'light'
                          ? 'bg-amber-400 text-black shadow-md font-extrabold'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Sun size={13} />
                      <span>Light</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 3: COLOR PALETTES */}
              <div className="pt-4 border-t border-white/10">
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-white mb-1">Color Palette</h3>
                  <p className="text-xs text-gray-400">
                    Signature accent hues, glows, and indicators applied dynamically across all dashboard design styles.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                {(Object.keys(THEMES) as ThemeId[]).map((tId) => {
                  const t = THEMES[tId];
                  const isSelected = theme === tId;
                  const activePalette = colorMode === 'light' ? t.lightColors : t.colors;
                  return (
                    <div
                      key={tId}
                      onClick={() => setTheme(tId)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'border-white/50 shadow-xl ring-2'
                          : 'border-white/10 hover:border-white/25 bg-white/5'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.08)' : undefined,
                        borderColor: isSelected ? activePalette.accent : undefined,
                      }}
                    >
                      <div>
                        {/* Top: Name & Swatches */}
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-sm font-bold text-white">{t.name}</h4>
                          {/* 3-color palette preview */}
                          <div className="flex space-x-1 items-center">
                            {activePalette.swatches.map((c, i) => (
                              <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-[11px] font-semibold" style={{ color: activePalette.accent }}>
                          {t.tagline}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                          {t.description}
                        </p>
                      </div>

                      {/* Active indicator */}
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-gray-400 uppercase font-mono">
                          {tId}
                        </span>
                        {isSelected && (
                          <span className="flex items-center text-[11px] font-bold" style={{ color: activePalette.accent }}>
                            <Check size={13} className="mr-1" /> Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

          {activeTab === 'ha' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <h4 className="text-sm font-semibold text-white">Simulated Mock Mode</h4>
                  <p className="text-xs text-gray-400">Use realistic live mock data when HA server is offline</p>
                </div>
                <input
                  type="checkbox"
                  checked={haConfig.useMock}
                  onChange={(e) => setHaConfig({ ...haConfig, useMock: e.target.checked })}
                  className="w-5 h-5 rounded accent-blue-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Home Assistant Base URL
                </label>
                <input
                  type="text"
                  value={haConfig.haUrl}
                  disabled={haConfig.useMock}
                  onChange={(e) => setHaConfig({ ...haConfig, haUrl: e.target.value })}
                  placeholder="http://homeassistant.local:8123"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Long-Lived Access Token
                </label>
                <input
                  type="password"
                  value={haConfig.accessToken}
                  disabled={haConfig.useMock}
                  onChange={(e) => setHaConfig({ ...haConfig, accessToken: e.target.value })}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Generated in your HA User Profile → Long-Lived Access Tokens.
                </p>
              </div>

              {!haConfig.useMock && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    Target Media Player Entity
                  </label>
                  <select
                    value={haConfig.preferredMediaPlayer || ''}
                    onChange={(e) => setHaConfig({ ...haConfig, preferredMediaPlayer: e.target.value || undefined })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Auto-Detect Active Player (Playing &gt; Paused)</option>
                    {haService.getAvailableMediaPlayers().map(p => (
                      <option key={p.entity_id} value={p.entity_id}>
                        {p.friendly_name} ({p.entity_id}) • {p.state}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Select a specific speaker or let the dashboard automatically track whichever speaker starts playing.
                  </p>
                </div>
              )}

              <button
                onClick={handleSaveHA}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all"
              >
                {isSaved ? <Check size={16} /> : <Save size={16} />}
                <span>{isSaved ? 'Saved & Reconnected!' : 'Save Home Assistant Config'}</span>
              </button>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  City Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {CITY_PRESETS.map((p) => (
                    <button
                      key={p.city}
                      onClick={() => setCoords(p)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left ${
                        coords.city === p.city
                          ? 'bg-blue-600/30 text-white border-blue-500'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {p.city}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={coords.latitude}
                    onChange={(e) => setCoords({ ...coords, latitude: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={coords.longitude}
                    onChange={(e) => setCoords({ ...coords, longitude: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveWeather}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all"
              >
                {isSaved ? <Check size={16} /> : <Save size={16} />}
                <span>{isSaved ? 'Saved!' : 'Save & Refresh Weather'}</span>
              </button>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center space-x-2 text-white font-bold text-sm mb-1">
                  <FolderOpen size={16} className="text-blue-400" />
                  <span>Local Directory Storage</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  You can drop any photos (<code className="text-blue-300">.jpg</code>, <code className="text-blue-300">.png</code>, <code className="text-blue-300">.webp</code>) into the local folder:
                </p>
                <div className="mt-2 p-2.5 rounded-xl bg-black/60 font-mono text-xs text-emerald-400 select-all border border-white/10">
                  Dashboard/public/photos/
                </div>
                <p className="text-[11px] text-gray-400 mt-2">
                  The dashboard automatically scans this directory via the built-in <code className="text-gray-300">/api/photos</code> endpoint, calculates aspect ratios, and serves them.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                  Add Custom Photo URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                  <button
                    onClick={handleAddPhoto}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="text-xs text-gray-400">
                  Current Source:{' '}
                  <span className="font-bold text-white capitalize">{photoSource}</span> (
                  {photoService.getPhotos().length} photos)
                </div>
                <button
                  onClick={handleResetPhotos}
                  className="px-3 py-1.5 rounded-xl glass-pill text-xs font-semibold text-gray-300 hover:text-white flex items-center space-x-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Reset to Showcase</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-4 text-xs text-gray-300">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-1">Kiosk Hardware Specifications</h4>
                <p className="text-gray-400 leading-relaxed">
                  Display target: Full HD (1920x1080) at 100% DPI scale.
                  Auto-sleep: Screen sleeps between 00:00 and 06:00 IST via DPMS or smart plug.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-bold text-white mb-2">Chromium Kiosk Flags</h4>
                <pre className="p-3 rounded-xl bg-black/60 font-mono text-[11px] text-gray-300 overflow-x-auto">
{`chromium-browser \\
  --noerrdialogs \\
  --disable-infobars \\
  --kiosk \\
  --disable-pinch \\
  --overscroll-history-navigation=0 \\
  http://localhost:3000`}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
