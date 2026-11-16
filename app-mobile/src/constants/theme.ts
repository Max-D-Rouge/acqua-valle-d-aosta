/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://unistyl.es/), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

// Colori dell'app, con il nome del loro ruolo (regola 60-30-10):
// 60% superfici neutre, 30% colore secondario (blu scuro dell'identità), 10% colore d'accento (azioni).
// Gli avvisi e i pericoli sono colori di servizio, fuori dalla regola. Per cambiare l'aspetto si cambiano questi valori.
export const Palette = {
  // 60% - superfici e sfondi
  superficie: '#ffffff',
  sfondo: '#f7f5f2',
  bordo: '#c5ccd3',
  // 30% - colore secondario (titoli, intestazioni)
  secondario: '#18395a',
  testo: '#4a5560',
  testoSfumato: '#7a8590',
  testoTenue: '#6b7680',
  // 10% - colore d'accento (pulsanti e azioni principali)
  accento: '#2563eb',
  // colori di servizio
  avviso: '#b45309',
  avvisoSfondo: '#fff3cd',
  avvisoTesto: '#5c4400',
  pericolo: '#d64545',
  ok: '#1f9d55',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
