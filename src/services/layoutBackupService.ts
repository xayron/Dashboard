import type {
  GridLayoutBackup,
  MorningWidgetId,
  F1WidgetId,
  MorningWidgetLayoutItem,
  F1WidgetLayoutItem,
  F1WidgetSize,
} from '../types/dashboard';

export const DEFAULT_MORNING_SLOT_LAYOUT: Record<MorningWidgetId, MorningWidgetLayoutItem> = {
  clock:        { col: 1, row: 1, colSpan: 4, rowSpan: 1 },
  weather:      { col: 1, row: 2, colSpan: 4, rowSpan: 2 },
  timeProgress: { col: 1, row: 4, colSpan: 4, rowSpan: 1 },
  calendar:     { col: 5, row: 1, colSpan: 4, rowSpan: 2 },
  tasks:        { col: 5, row: 3, colSpan: 4, rowSpan: 1 },
  traffic:      { col: 5, row: 4, colSpan: 4, rowSpan: 1 },
  markets:      { col: 9, row: 1, colSpan: 4, rowSpan: 2 },
  news:         { col: 9, row: 3, colSpan: 4, rowSpan: 1 },
  aqi:          { col: 9, row: 4, colSpan: 4, rowSpan: 1 },
};

export const DEFAULT_MORNING_ACTIVE_WIDGETS: MorningWidgetId[] = [
  'clock',
  'weather',
  'timeProgress',
  'calendar',
  'tasks',
  'traffic',
  'markets',
  'news',
  'aqi',
];

export const DEFAULT_F1_SLOT_LAYOUT: Record<F1WidgetId, F1WidgetLayoutItem> = {
  countdown:        { col: 1,  row: 1, colSpan: 6, rowSpan: 1 },
  circuitTelemetry: { col: 7,  row: 1, colSpan: 6, rowSpan: 1 },
  schedule:         { col: 1,  row: 2, colSpan: 3, rowSpan: 2 },
  standings:        { col: 4,  row: 2, colSpan: 3, rowSpan: 2 },
  titleBattle:      { col: 7,  row: 2, colSpan: 3, rowSpan: 1 },
  pitstop:          { col: 10, row: 2, colSpan: 3, rowSpan: 1 },
  qualifying:       { col: 7,  row: 3, colSpan: 3, rowSpan: 1 },
  upcomingRaces:    { col: 10, row: 3, colSpan: 3, rowSpan: 1 },
  news:             { col: 1,  row: 4, colSpan: 6, rowSpan: 2 },
  podium:           { col: 7,  row: 4, colSpan: 6, rowSpan: 1 },
};

export const DEFAULT_F1_ACTIVE_WIDGETS: F1WidgetId[] = [
  'countdown',
  'schedule',
  'standings',
  'circuitTelemetry',
  'titleBattle',
  'pitstop',
  'qualifying',
  'upcomingRaces',
  'news',
  'podium',
];

const SNAPSHOT_STORAGE_KEY = 'dashboard_quick_layout_snapshot';

/**
 * Creates a structured JSON backup object from active localStorage layouts.
 */
export function createLayoutBackup(scope: 'all' | 'morning' | 'f1' = 'all'): GridLayoutBackup {
  const backup: GridLayoutBackup = {
    version: 1,
    appName: 'Smart Display Dashboard',
    exportedAt: new Date().toISOString(),
    scope,
  };

  if (scope === 'all' || scope === 'morning') {
    let slotLayout: Record<MorningWidgetId, MorningWidgetLayoutItem> = DEFAULT_MORNING_SLOT_LAYOUT;
    let activeWidgets: MorningWidgetId[] = DEFAULT_MORNING_ACTIVE_WIDGETS;

    try {
      const savedLayout = localStorage.getItem('dashboard_morning_slot_layout');
      if (savedLayout) {
        slotLayout = JSON.parse(savedLayout);
      }
      const savedActive = localStorage.getItem('dashboard_morning_active_widgets');
      if (savedActive) {
        activeWidgets = JSON.parse(savedActive);
      }
    } catch (e) {
      console.warn('Failed to parse morning layout from localStorage', e);
    }

    backup.morning = {
      activeWidgets,
      slotLayout,
    };
  }

  if (scope === 'all' || scope === 'f1') {
    let slotLayout: Record<F1WidgetId, F1WidgetLayoutItem> = DEFAULT_F1_SLOT_LAYOUT;
    let activeWidgets: F1WidgetId[] = DEFAULT_F1_ACTIVE_WIDGETS;
    let widgetSizes: Record<F1WidgetId, F1WidgetSize> | undefined;

    try {
      const savedLayout = localStorage.getItem('dashboard_f1_slot_layout');
      if (savedLayout) {
        slotLayout = JSON.parse(savedLayout);
      }
      const savedActive = localStorage.getItem('dashboard_f1_active_widgets');
      if (savedActive) {
        activeWidgets = JSON.parse(savedActive);
      }
      const savedSizes = localStorage.getItem('dashboard_f1_widget_sizes');
      if (savedSizes) {
        widgetSizes = JSON.parse(savedSizes);
      }
    } catch (e) {
      console.warn('Failed to parse F1 layout from localStorage', e);
    }

    backup.f1 = {
      activeWidgets,
      slotLayout,
      widgetSizes,
    };
  }

  return backup;
}

/**
 * Triggers a file download in the browser containing the backup JSON.
 */
export function downloadLayoutBackup(scope: 'all' | 'morning' | 'f1' = 'all'): void {
  const backup = createLayoutBackup(scope);
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `smart-display-${scope}-layout-backup-${dateStr}.json`;

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates the structure and integrity of an imported layout backup.
 */
export function validateLayoutBackup(data: unknown): {
  valid: boolean;
  error?: string;
  backup?: GridLayoutBackup;
} {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Backup data is not a valid JSON object.' };
  }

  const obj = data as Partial<GridLayoutBackup>;

  if (obj.version !== 1 && obj.appName !== 'Smart Display Dashboard') {
    // If missing explicit metadata, check if it directly contains morning or f1 layouts
    if (!obj.morning && !obj.f1) {
      return {
        valid: false,
        error: 'Invalid layout backup format: Missing Morning or F1 layout configuration.',
      };
    }
  }

  if (!obj.morning && !obj.f1) {
    return {
      valid: false,
      error: 'The backup file does not contain Morning or F1 grid layout configurations.',
    };
  }

  // Validate morning slot layout structure if present
  if (obj.morning) {
    if (!obj.morning.slotLayout || typeof obj.morning.slotLayout !== 'object') {
      return { valid: false, error: 'Invalid Morning slot layout definition.' };
    }
    for (const [id, item] of Object.entries(obj.morning.slotLayout)) {
      if (!item || typeof item.col !== 'number' || typeof item.row !== 'number' || typeof item.colSpan !== 'number' || typeof item.rowSpan !== 'number') {
        return { valid: false, error: `Invalid layout coordinates for morning widget "${id}".` };
      }
    }
  }

  // Validate F1 slot layout structure if present
  if (obj.f1) {
    if (!obj.f1.slotLayout || typeof obj.f1.slotLayout !== 'object') {
      return { valid: false, error: 'Invalid F1 slot layout definition.' };
    }
    for (const [id, item] of Object.entries(obj.f1.slotLayout)) {
      if (!item || typeof item.col !== 'number' || typeof item.row !== 'number' || typeof item.colSpan !== 'number' || typeof item.rowSpan !== 'number') {
        return { valid: false, error: `Invalid layout coordinates for F1 widget "${id}".` };
      }
    }
  }

  const validated: GridLayoutBackup = {
    version: 1,
    appName: 'Smart Display Dashboard',
    exportedAt: obj.exportedAt || new Date().toISOString(),
    scope: obj.scope || (obj.morning && obj.f1 ? 'all' : obj.morning ? 'morning' : 'f1'),
    morning: obj.morning,
    f1: obj.f1,
  };

  return { valid: true, backup: validated };
}

/**
 * Applies a validated layout backup to localStorage and dispatches sync events.
 */
export function applyLayoutBackup(backup: GridLayoutBackup): {
  success: boolean;
  restored: string[];
  error?: string;
} {
  const restored: string[] = [];

  try {
    if (backup.morning) {
      if (backup.morning.slotLayout) {
        localStorage.setItem(
          'dashboard_morning_slot_layout',
          JSON.stringify(backup.morning.slotLayout)
        );
      }
      if (Array.isArray(backup.morning.activeWidgets) && backup.morning.activeWidgets.length > 0) {
        localStorage.setItem(
          'dashboard_morning_active_widgets',
          JSON.stringify(backup.morning.activeWidgets)
        );
      }
      restored.push('Morning Briefing Grid');
    }

    if (backup.f1) {
      if (backup.f1.slotLayout) {
        localStorage.setItem(
          'dashboard_f1_slot_layout',
          JSON.stringify(backup.f1.slotLayout)
        );
      }
      if (Array.isArray(backup.f1.activeWidgets) && backup.f1.activeWidgets.length > 0) {
        localStorage.setItem(
          'dashboard_f1_active_widgets',
          JSON.stringify(backup.f1.activeWidgets)
        );
      }
      if (backup.f1.widgetSizes) {
        localStorage.setItem(
          'dashboard_f1_widget_sizes',
          JSON.stringify(backup.f1.widgetSizes)
        );
      }
      restored.push('Formula 1 Race Grid');
    }

    // Dispatch global CustomEvent for instant reactive updates in all mounted components
    window.dispatchEvent(
      new CustomEvent<GridLayoutBackup>('dashboard_layout_restored', {
        detail: backup,
      })
    );

    return { success: true, restored };
  } catch (e: any) {
    return {
      success: false,
      restored,
      error: e?.message || 'Failed to save layout to localStorage.',
    };
  }
}

/**
 * Reads a JSON file uploaded by the user, validates it, and applies it.
 */
export async function readBackupFromFile(file: File): Promise<{
  success: boolean;
  restored?: string[];
  error?: string;
}> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        const validation = validateLayoutBackup(parsed);

        if (!validation.valid || !validation.backup) {
          resolve({ success: false, error: validation.error || 'Invalid backup file structure.' });
          return;
        }

        const result = applyLayoutBackup(validation.backup);
        resolve(result);
      } catch (err: any) {
        resolve({
          success: false,
          error: `Could not parse JSON file: ${err?.message || 'Unknown syntax error'}`,
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: 'Failed to read backup file.' });
    };

    reader.readAsText(file);
  });
}

/**
 * Saves current layouts as an instant Quick Snapshot in browser storage.
 */
export function saveQuickSnapshot(): { success: boolean; timestamp: string } {
  const backup = createLayoutBackup('all');
  const timestamp = new Date().toISOString();

  try {
    localStorage.setItem(
      SNAPSHOT_STORAGE_KEY,
      JSON.stringify({ backup, timestamp })
    );
    return { success: true, timestamp };
  } catch (e) {
    return { success: false, timestamp };
  }
}

/**
 * Returns saved Quick Snapshot data if available.
 */
export function getQuickSnapshot(): {
  backup: GridLayoutBackup;
  timestamp: string;
} | null {
  try {
    const raw = localStorage.getItem(SNAPSHOT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.backup && parsed.timestamp) {
      return parsed;
    }
  } catch (e) {}
  return null;
}

/**
 * Restores the saved Quick Snapshot.
 */
export function restoreQuickSnapshot(): {
  success: boolean;
  restored?: string[];
  error?: string;
} {
  const snapshot = getQuickSnapshot();
  if (!snapshot) {
    return { success: false, error: 'No saved layout snapshot found in local storage.' };
  }
  return applyLayoutBackup(snapshot.backup);
}

/**
 * Resets layouts to factory defaults and applies them.
 */
export function resetLayoutsToDefault(scope: 'all' | 'morning' | 'f1' = 'all'): {
  success: boolean;
  restored: string[];
} {
  const backup: GridLayoutBackup = {
    version: 1,
    appName: 'Smart Display Dashboard',
    exportedAt: new Date().toISOString(),
    scope,
  };

  if (scope === 'all' || scope === 'morning') {
    backup.morning = {
      activeWidgets: DEFAULT_MORNING_ACTIVE_WIDGETS,
      slotLayout: DEFAULT_MORNING_SLOT_LAYOUT,
    };
  }

  if (scope === 'all' || scope === 'f1') {
    backup.f1 = {
      activeWidgets: DEFAULT_F1_ACTIVE_WIDGETS,
      slotLayout: DEFAULT_F1_SLOT_LAYOUT,
    };
  }

  const result = applyLayoutBackup(backup);
  return { success: result.success, restored: result.restored };
}
