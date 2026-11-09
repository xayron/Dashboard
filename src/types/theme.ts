export type ThemeId =
  | 'obsidian'
  | 'cyberpunk'
  | 'amber'
  | 'nordic'
  | 'emerald'
  | 'monochrome';

export interface ThemeColors {
  bg: string;
  card: string;
  accent: string;
  border: string;
  swatches: [string, string, string]; // [bg, accent, secondary]
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  colors: ThemeColors;
  lightColors: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Deep',
    tagline: 'Modern Slate & Royal Blue',
    description: 'Clean onyx dark canvas with indigo glass cards, or crisp ice-slate with royal blue in light mode.',
    colors: {
      bg: '#030712',
      card: 'rgba(15, 23, 42, 0.72)',
      accent: '#3b82f6',
      border: 'rgba(255, 255, 255, 0.08)',
      swatches: ['#030712', '#3b82f6', '#6366f1'],
    },
    lightColors: {
      bg: '#f8fafc',
      card: 'rgba(255, 255, 255, 0.88)',
      accent: '#2563eb',
      border: 'rgba(37, 99, 235, 0.2)',
      swatches: ['#f8fafc', '#2563eb', '#3b82f6'],
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    tagline: 'Electric Magenta & Cyan',
    description: 'High-energy midnight purple with neon pink, or light neon blush with electric magenta accents.',
    colors: {
      bg: '#090314',
      card: 'rgba(28, 10, 48, 0.72)',
      accent: '#ec4899',
      border: 'rgba(236, 72, 153, 0.22)',
      swatches: ['#090314', '#ec4899', '#06b6d4'],
    },
    lightColors: {
      bg: '#fdf4ff',
      card: 'rgba(255, 255, 255, 0.88)',
      accent: '#db2777',
      border: 'rgba(219, 39, 119, 0.2)',
      swatches: ['#fdf4ff', '#db2777', '#0891b2'],
    },
  },
  amber: {
    id: 'amber',
    name: 'Midnight Amber',
    tagline: 'Warm Cozy Espresso & Gold',
    description: 'Ultra-warm low-blue-light dark palette, or warm ivory latte with golden amber highlights.',
    colors: {
      bg: '#0a0805',
      card: 'rgba(30, 24, 16, 0.76)',
      accent: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.2)',
      swatches: ['#0a0805', '#f59e0b', '#d97706'],
    },
    lightColors: {
      bg: '#fffbeb',
      card: 'rgba(255, 255, 255, 0.88)',
      accent: '#d97706',
      border: 'rgba(217, 119, 6, 0.2)',
      swatches: ['#fffbeb', '#d97706', '#f59e0b'],
    },
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Frost',
    tagline: 'Arctic Icy Fjord & Azure',
    description: 'Glacial fjord navy with crystalline glass, or crisp polar snow with deep arctic azure accents.',
    colors: {
      bg: '#060e17',
      card: 'rgba(12, 29, 48, 0.72)',
      accent: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.2)',
      swatches: ['#060e17', '#38bdf8', '#14b8a6'],
    },
    lightColors: {
      bg: '#f0f9ff',
      card: 'rgba(255, 255, 255, 0.88)',
      accent: '#0284c7',
      border: 'rgba(2, 132, 199, 0.2)',
      swatches: ['#f0f9ff', '#0284c7', '#0ea5e9'],
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    tagline: 'Botanical Jade & Forest',
    description: 'Botanical dark green luminescence, or clean mint alabaster with rich emerald green accents.',
    colors: {
      bg: '#02120a',
      card: 'rgba(6, 36, 22, 0.72)',
      accent: '#10b981',
      border: 'rgba(16, 185, 129, 0.2)',
      swatches: ['#02120a', '#10b981', '#34d399'],
    },
    lightColors: {
      bg: '#f0fdf4',
      card: 'rgba(255, 255, 255, 0.88)',
      accent: '#059669',
      border: 'rgba(5, 150, 105, 0.2)',
      swatches: ['#f0fdf4', '#059669', '#10b981'],
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome OLED',
    tagline: 'High-Contrast Black & White',
    description: 'Zero light-bleed true black for OLED, or pristine gallery paper white with bold onyx black accents.',
    colors: {
      bg: '#000000',
      card: 'rgba(18, 18, 18, 0.88)',
      accent: '#f3f4f6',
      border: 'rgba(255, 255, 255, 0.16)',
      swatches: ['#000000', '#ffffff', '#9ca3af'],
    },
    lightColors: {
      bg: '#ffffff',
      card: 'rgba(248, 250, 252, 0.95)',
      accent: '#0f172a',
      border: 'rgba(15, 23, 42, 0.18)',
      swatches: ['#ffffff', '#0f172a', '#475569'],
    },
  },
};
