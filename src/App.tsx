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

const DashboardContent: React.FC = () => {
  const { activeMode } = useDashboard();

  const renderActiveMode = () => {
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
      style={{ backgroundColor: 'var(--color-bg-base, #030712)' }}
      className="relative w-screen h-screen overflow-hidden text-white flex flex-col font-sans select-none transition-colors duration-700"
    >
      {/* Background ambient radial highlight matching current theme */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-700"
        style={{ backgroundImage: 'var(--bg-radial)' }}
      />

      {/* Top Status Header */}
      <StatusHeader />

      {/* Main Mode View Container */}
      <main className="relative flex-1 w-full min-h-0 overflow-hidden transition-all duration-700 ease-in-out">
        {renderActiveMode()}
      </main>

      {/* Persistent Bottom Financial Strip in Morning and Race Weekend */}
      {activeMode !== 'ambient' && activeMode !== 'evening' && (
        <FinanceTicker mode="ticker" />
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
