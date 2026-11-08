import React from 'react';
import { DashboardProvider, useDashboard } from './state/DashboardContext';
import { StatusHeader } from './components/common/StatusHeader';
import { AmbientMode } from './components/modes/AmbientMode';
import { MorningMode } from './components/modes/MorningMode';
import { EveningMode } from './components/modes/EveningMode';
import { RaceWeekendMode } from './components/modes/RaceWeekendMode';
import { FinanceTicker } from './components/common/FinanceTicker';
import { KioskControls } from './components/kiosk/KioskControls';
import { SettingsModal } from './components/settings/SettingsModal';

// TUI Variants
import { TuiHeader } from './components/tui/TuiHeader';
import { TuiMorningMode } from './components/tui/TuiMorningMode';
import { TuiEveningMode } from './components/tui/TuiEveningMode';
import { TuiRaceWeekendMode } from './components/tui/TuiRaceWeekendMode';
import { TuiAmbientMode } from './components/tui/TuiAmbientMode';
import { TuiFinanceTicker } from './components/tui/TuiFinanceTicker';

const DashboardContent: React.FC = () => {
  const { activeMode, uiStyle } = useDashboard();

  const isTui = uiStyle === 'tui';

  const renderActiveMode = () => {
    if (isTui) {
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
    }

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
  };

  return (
    <div
      style={{ backgroundColor: isTui ? '#000000' : 'var(--color-bg-base, #030712)' }}
      className={`relative w-screen h-screen overflow-hidden text-white flex flex-col select-none transition-colors duration-700 ${
        isTui ? 'font-mono' : 'font-sans'
      }`}
    >
      {/* Background ambient radial highlight (only in modern mode) */}
      {!isTui && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
          style={{ backgroundImage: 'var(--bg-radial)' }}
        />
      )}

      {/* Top Status Header */}
      {isTui ? <TuiHeader /> : <StatusHeader />}

      {/* Main Mode View Container */}
      <main className="relative flex-1 w-full min-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        {renderActiveMode()}
      </main>

      {/* Persistent Bottom Financial Strip in Morning and Race Weekend */}
      {activeMode !== 'ambient' && activeMode !== 'evening' && (
        isTui ? <TuiFinanceTicker /> : <FinanceTicker mode="ticker" />
      )}

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
