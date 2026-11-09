import React from 'react';
import { DashboardProvider, useDashboard } from './state/DashboardContext';

// 1. Modern Glass Components
import { StatusHeader } from './components/common/StatusHeader';
import { AmbientMode } from './components/modes/AmbientMode';
import { MorningMode } from './components/modes/MorningMode';
import { EveningMode } from './components/modes/EveningMode';
import { RaceWeekendMode } from './components/modes/RaceWeekendMode';
import { FinanceTicker } from './components/common/FinanceTicker';

// 2. Retro TUI Components
import { TuiHeader } from './components/tui/TuiHeader';
import { TuiMorningMode } from './components/tui/TuiMorningMode';
import { TuiEveningMode } from './components/tui/TuiEveningMode';
import { TuiRaceWeekendMode } from './components/tui/TuiRaceWeekendMode';
import { TuiAmbientMode } from './components/tui/TuiAmbientMode';
import { TuiFinanceTicker } from './components/tui/TuiFinanceTicker';

// 3. Neo-Brutalist Components
import { BrutalistHeader } from './components/brutalist/BrutalistHeader';
import { BrutalistMorningMode } from './components/brutalist/BrutalistMorningMode';
import { BrutalistEveningMode } from './components/brutalist/BrutalistEveningMode';
import { BrutalistRaceWeekendMode } from './components/brutalist/BrutalistRaceWeekendMode';
import { BrutalistAmbientMode } from './components/brutalist/BrutalistAmbientMode';
import { BrutalistFinanceTicker } from './components/brutalist/BrutalistFinanceTicker';

// 4. Swiss Minimal Components
import { MinimalHeader } from './components/minimal/MinimalHeader';
import { MinimalMorningMode } from './components/minimal/MinimalMorningMode';
import { MinimalEveningMode } from './components/minimal/MinimalEveningMode';
import { MinimalRaceWeekendMode } from './components/minimal/MinimalRaceWeekendMode';
import { MinimalAmbientMode } from './components/minimal/MinimalAmbientMode';
import { MinimalFinanceTicker } from './components/minimal/MinimalFinanceTicker';

// 5. Cyber HUD Components
import { HudHeader } from './components/hud/HudHeader';
import { HudMorningMode } from './components/hud/HudMorningMode';
import { HudEveningMode } from './components/hud/HudEveningMode';
import { HudRaceWeekendMode } from './components/hud/HudRaceWeekendMode';
import { HudAmbientMode } from './components/hud/HudAmbientMode';
import { HudFinanceTicker } from './components/hud/HudFinanceTicker';

// 6. Paper & Ink (E-Ink) Components
import { EinkHeader } from './components/eink/EinkHeader';
import { EinkMorningMode } from './components/eink/EinkMorningMode';
import { EinkEveningMode } from './components/eink/EinkEveningMode';
import { EinkRaceWeekendMode } from './components/eink/EinkRaceWeekendMode';
import { EinkAmbientMode } from './components/eink/EinkAmbientMode';
import { EinkFinanceTicker } from './components/eink/EinkFinanceTicker';

// 7. 80s Synthwave Components
import { RetrowaveHeader } from './components/retrowave/RetrowaveHeader';
import { RetrowaveMorningMode } from './components/retrowave/RetrowaveMorningMode';
import { RetrowaveEveningMode } from './components/retrowave/RetrowaveEveningMode';
import { RetrowaveRaceWeekendMode } from './components/retrowave/RetrowaveRaceWeekendMode';
import { RetrowaveAmbientMode } from './components/retrowave/RetrowaveAmbientMode';
import { RetrowaveFinanceTicker } from './components/retrowave/RetrowaveFinanceTicker';

// 8. Soft Neumorphic Components
import { NeumorphicHeader } from './components/neumorphic/NeumorphicHeader';
import { NeumorphicMorningMode } from './components/neumorphic/NeumorphicMorningMode';
import { NeumorphicEveningMode } from './components/neumorphic/NeumorphicEveningMode';
import { NeumorphicRaceWeekendMode } from './components/neumorphic/NeumorphicRaceWeekendMode';
import { NeumorphicAmbientMode } from './components/neumorphic/NeumorphicAmbientMode';
import { NeumorphicFinanceTicker } from './components/neumorphic/NeumorphicFinanceTicker';

// 9. Obsidian Intelligence Components
import { ObsidianHeader } from './components/obsidian/ObsidianHeader';
import { ObsidianMorningMode } from './components/obsidian/ObsidianMorningMode';
import { ObsidianEveningMode } from './components/obsidian/ObsidianEveningMode';
import { ObsidianRaceWeekendMode } from './components/obsidian/ObsidianRaceWeekendMode';
import { ObsidianAmbientMode } from './components/obsidian/ObsidianAmbientMode';
import { ObsidianFinanceTicker } from './components/obsidian/ObsidianFinanceTicker';

// 10. Andhbhakt Civic Transparency Components
import { CivicHeader } from './components/civic/CivicHeader';
import { CivicMorningMode } from './components/civic/CivicMorningMode';
import { CivicEveningMode } from './components/civic/CivicEveningMode';
import { CivicRaceWeekendMode } from './components/civic/CivicRaceWeekendMode';
import { CivicAmbientMode } from './components/civic/CivicAmbientMode';
import { CivicFinanceTicker } from './components/civic/CivicFinanceTicker';

// Global Kiosk Controls & Settings
import { KioskControls } from './components/kiosk/KioskControls';
import { SettingsModal } from './components/settings/SettingsModal';

const DashboardContent: React.FC = () => {
  const { activeMode, uiStyle, theme, colorMode } = useDashboard();
  const isLight = colorMode === 'light';

  const renderActiveMode = () => {
    switch (uiStyle) {
      case 'tui':
        switch (activeMode) {
          case 'race':
            return <TuiRaceWeekendMode />;
          case 'evening':
            return <TuiEveningMode />;
          case 'morning':
            return <TuiMorningMode />;
          case 'ambient':
          default:
            return <TuiAmbientMode />;
        }

      case 'brutalist':
        switch (activeMode) {
          case 'race':
            return <BrutalistRaceWeekendMode />;
          case 'evening':
            return <BrutalistEveningMode />;
          case 'morning':
            return <BrutalistMorningMode />;
          case 'ambient':
          default:
            return <BrutalistAmbientMode />;
        }

      case 'minimal':
        switch (activeMode) {
          case 'race':
            return <MinimalRaceWeekendMode />;
          case 'evening':
            return <MinimalEveningMode />;
          case 'morning':
            return <MinimalMorningMode />;
          case 'ambient':
          default:
            return <MinimalAmbientMode />;
        }

      case 'hud':
        switch (activeMode) {
          case 'race':
            return <HudRaceWeekendMode />;
          case 'evening':
            return <HudEveningMode />;
          case 'morning':
            return <HudMorningMode />;
          case 'ambient':
          default:
            return <HudAmbientMode />;
        }

      case 'eink':
        switch (activeMode) {
          case 'race':
            return <EinkRaceWeekendMode />;
          case 'evening':
            return <EinkEveningMode />;
          case 'morning':
            return <EinkMorningMode />;
          case 'ambient':
          default:
            return <EinkAmbientMode />;
        }

      case 'retrowave':
        switch (activeMode) {
          case 'race':
            return <RetrowaveRaceWeekendMode />;
          case 'evening':
            return <RetrowaveEveningMode />;
          case 'morning':
            return <RetrowaveMorningMode />;
          case 'ambient':
          default:
            return <RetrowaveAmbientMode />;
        }

      case 'neumorphic':
        switch (activeMode) {
          case 'race':
            return <NeumorphicRaceWeekendMode />;
          case 'evening':
            return <NeumorphicEveningMode />;
          case 'morning':
            return <NeumorphicMorningMode />;
          case 'ambient':
          default:
            return <NeumorphicAmbientMode />;
        }

      case 'obsidian':
        switch (activeMode) {
          case 'race':
            return <ObsidianRaceWeekendMode />;
          case 'evening':
            return <ObsidianEveningMode />;
          case 'morning':
            return <ObsidianMorningMode />;
          case 'ambient':
          default:
            return <ObsidianAmbientMode />;
        }

      case 'civic':
        switch (activeMode) {
          case 'race':
            return <CivicRaceWeekendMode />;
          case 'evening':
            return <CivicEveningMode />;
          case 'morning':
            return <CivicMorningMode />;
          case 'ambient':
          default:
            return <CivicAmbientMode />;
        }

      case 'modern':
      default:
        switch (activeMode) {
          case 'race':
            return <RaceWeekendMode />;
          case 'evening':
            return <EveningMode />;
          case 'morning':
            return <MorningMode />;
          case 'ambient':
          default:
            return <AmbientMode />;
        }
    }
  };

  const renderHeader = () => {
    switch (uiStyle) {
      case 'tui':
        return <TuiHeader />;
      case 'brutalist':
        return <BrutalistHeader />;
      case 'minimal':
        return <MinimalHeader />;
      case 'hud':
        return <HudHeader />;
      case 'eink':
        return <EinkHeader />;
      case 'retrowave':
        return <RetrowaveHeader />;
      case 'neumorphic':
        return <NeumorphicHeader />;
      case 'obsidian':
        return <ObsidianHeader />;
      case 'civic':
        return <CivicHeader />;
      case 'modern':
      default:
        return <StatusHeader />;
    }
  };

  const renderFinanceTicker = () => {
    if (activeMode === 'ambient' || activeMode === 'evening') return null;

    switch (uiStyle) {
      case 'tui':
        return <TuiFinanceTicker />;
      case 'brutalist':
        return <BrutalistFinanceTicker />;
      case 'minimal':
        return <MinimalFinanceTicker />;
      case 'hud':
        return <HudFinanceTicker />;
      case 'eink':
        return <EinkFinanceTicker />;
      case 'retrowave':
        return <RetrowaveFinanceTicker />;
      case 'neumorphic':
        return <NeumorphicFinanceTicker />;
      case 'obsidian':
        return <ObsidianFinanceTicker />;
      case 'civic':
        return <CivicFinanceTicker />;
      case 'modern':
      default:
        return <FinanceTicker mode="ticker" />;
    }
  };

  // Background styling per design style and color mode
  const getBackgroundStyle = () => {
    if (isLight) {
      switch (uiStyle) {
        case 'eink':
          return { backgroundColor: '#f5f2eb' };
        case 'neumorphic':
          return { backgroundColor: '#e2e8f0' };
        case 'brutalist':
          return { backgroundColor: '#ffffff' };
        case 'civic':
        case 'tui':
        case 'hud':
        case 'minimal':
        case 'retrowave':
        case 'obsidian':
        case 'modern':
        default:
          return { backgroundColor: 'var(--color-bg-base, #f8fafc)' };
      }
    }

    // Dark Mode
    switch (uiStyle) {
      case 'eink':
        return { backgroundColor: '#1c1917' };
      case 'civic':
      case 'tui':
      case 'brutalist':
      case 'minimal':
      case 'hud':
      case 'retrowave':
      case 'neumorphic':
      case 'obsidian':
      case 'modern':
      default:
        return { backgroundColor: 'var(--color-bg-base, #030712)' };
    }
  };

  const getFontClass = () => {
    if (uiStyle === 'tui' || uiStyle === 'hud') return 'font-mono';
    if (uiStyle === 'eink') return 'font-serif';
    return 'font-sans';
  };

  return (
    <div
      data-theme={theme}
      data-style={uiStyle}
      data-color-mode={colorMode}
      style={getBackgroundStyle()}
      className={`relative w-screen h-screen overflow-hidden ${
        isLight ? 'text-slate-900' : 'text-white'
      } flex flex-col select-none transition-colors duration-500 ${getFontClass()}`}
    >
      {/* Background ambient radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-700 opacity-90"
        style={{ backgroundImage: 'var(--bg-radial)' }}
      />

      {/* Top Status Header */}
      {renderHeader()}

      {/* Main Mode View Container */}
      <main className="relative flex-1 w-full min-h-0 overflow-hidden transition-all duration-500 ease-in-out">
        {renderActiveMode()}
      </main>

      {/* Persistent Bottom Financial Strip in Morning and Race Weekend */}
      {renderFinanceTicker()}

      {/* Floating Kiosk Quick Switcher Controls */}
      <KioskControls />

      {/* Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default App;
