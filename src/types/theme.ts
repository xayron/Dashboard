export type ThemeId =
  | 'obsidian'
  | 'cyberpunk'
  | 'amber'
  | 'nordic'
  | 'emerald'
  | 'monochrome';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  colors: {
    bg: string;
    card: string;
    accent: string;
    border: string;
    swatches: [string, string, string]; // [bg, accent, secondary]
  };
}

export const THEMES: Record<ThemeId, ThemeDefinition> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Deep',
    tagline: 'Modern Dark Slate (Default)',
    description: 'Clean deep onyx canvas with subtle indigo-blue glass cards and crisp borders.',
    colors: {
      bg: '#030712',
      card: 'rgba(15, 23, 42, 0.72)',
      accent: '#3b82f6',
      border: 'rgba(255, 255, 255, 0.08)',
      swatches: ['#030712', '#3b82f6', '#6366f1'],
    },
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    tagline: 'Electric Magenta & Cyan',
    description: 'High-energy midnight purple aesthetic with glowing neon pink and cyan highlights.',
    colors: {
      bg: '#090314',
      card: 'rgba(28, 10, 48, 0.72)',
      accent: '#ec4899',
      border: 'rgba(236, 72, 153, 0.22)',
      swatches: ['#090314', '#ec4899', '#06b6d4'],
    },
  },
  amber: {
    id: 'amber',
    name: 'Midnight Amber',
    tagline: 'Warm Cozy Espresso',
    description: 'Ultra-warm low-blue-light dark palette with golden amber accents. Ideal for relaxing evenings.',
    colors: {
      bg: '#0a0805',
      card: 'rgba(30, 24, 16, 0.75)',
      accent: '#f59e0b',
      border: 'rgba(245, 158, 11, 0.2)',
      swatches: ['#0a0805', '#f59e0b', '#d97706'],
    },
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Frost',
    tagline: 'Arctic Icy Blue',
    description: 'Deep glacial fjord navy paired with icy sky-blue and teal crystalline glass panels.',
    colors: {
      bg: '#060e17',
      card: 'rgba(12, 29, 48, 0.72)',
      accent: '#38bdf8',
      border: 'rgba(56, 189, 248, 0.2)',
      swatches: ['#060e17', '#38bdf8', '#14b8a6'],
    },
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Matrix',
    tagline: 'Deep Forest Green',
    description: 'Sophisticated botanical dark theme with vibrant emerald and jade luminescence.',
    colors: {
      bg: '#02120a',
      card: 'rgba(6, 36, 22, 0.72)',
      accent: '#10b981',
      border: 'rgba(16, 185, 129, 0.2)',
      swatches: ['#02120a', '#10b981', '#34d399'],
    },
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome OLED',
    tagline: 'Pure True Black & Silver',
    description: 'Engineered for zero light-bleed on OLED/IPS displays. Infinite contrast with pure black and titanium silver.',
    colors: {
      bg: '#000000',
      card: 'rgba(18, 18, 18, 0.88)',
      accent: '#f3f4f6',
      border: 'rgba(255, 255, 255, 0.16)',
      swatches: ['#000000', '#ffffff', '#9ca3af'],
    },
  },
};
