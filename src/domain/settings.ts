/**
 * @file settings.ts
 * @description Modelos de configuración tipográfica y experiencia de lectura.
 */

export type FontFamily = 'serif-literary' | 'serif-classic' | 'sans-warm' | 'mono';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export interface ReaderSettings {
  readonly fontFamily: FontFamily;
  readonly fontSize: FontSize;
  readonly syncScroll: boolean;
}

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  fontFamily: 'serif-literary',
  fontSize: 'base',
  syncScroll: true,
};

export const FONT_FAMILY_CLASSES: Record<FontFamily, string> = {
  'serif-literary': 'font-literary',
  'serif-classic': 'font-classic',
  'sans-warm': 'font-warm-sans',
  'mono': 'font-poetic-mono',
};

export const FONT_SIZE_CLASSES: Record<FontSize, { verse: string; number: string }> = {
  'sm': { verse: 'text-sm leading-relaxed', number: 'text-xs' },
  'base': { verse: 'text-base leading-relaxed', number: 'text-xs' },
  'lg': { verse: 'text-lg leading-loose', number: 'text-sm' },
  'xl': { verse: 'text-xl leading-loose', number: 'text-sm' },
};

export const FONT_OPTIONS: Array<{ value: FontFamily; label: string; description: string }> = [
  { value: 'serif-literary', label: 'Serif Literaria', description: 'Lora / Merriweather' },
  { value: 'serif-classic', label: 'Serif Clásica', description: 'Playfair Display' },
  { value: 'sans-warm', label: 'Sans Cálida', description: 'Plus Jakarta Sans' },
  { value: 'mono', label: 'Mono Poética', description: 'Space Mono' },
];

export const FONT_SIZE_OPTIONS: Array<{ value: FontSize; label: string }> = [
  { value: 'sm', label: 'A-' },
  { value: 'base', label: 'A' },
  { value: 'lg', label: 'A+' },
  { value: 'xl', label: 'A++' },
];
