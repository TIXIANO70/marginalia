/**
 * @file useReaderSettings.ts
 * @description Hook de gestión de configuración tipográfica y preferencias visuales.
 */

import { useState, useCallback, useEffect } from 'react';
import {
  ReaderSettings,
  FontFamily,
  FontSize,
  DEFAULT_READER_SETTINGS,
  FONT_FAMILY_CLASSES,
  FONT_SIZE_CLASSES,
} from '@/domain/settings';
import { storageService } from '@/services/storageService';

export interface UseReaderSettingsReturn {
  settings: ReaderSettings;
  fontClass: string;
  sizeClasses: { verse: string; number: string };
  setFontFamily: (family: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
  toggleSyncScroll: () => void;
  resetSettings: () => void;
}

export function useReaderSettings(): UseReaderSettingsReturn {
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    return storageService.getSettings();
  });

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  const setFontFamily = useCallback((fontFamily: FontFamily) => {
    setSettings((prev) => ({ ...prev, fontFamily }));
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setSettings((prev) => ({ ...prev, fontSize }));
  }, []);

  const toggleSyncScroll = useCallback(() => {
    setSettings((prev) => ({ ...prev, syncScroll: !prev.syncScroll }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_READER_SETTINGS);
  }, []);

  const fontClass = FONT_FAMILY_CLASSES[settings.fontFamily] ?? FONT_FAMILY_CLASSES['serif-literary'];
  const sizeClasses = FONT_SIZE_CLASSES[settings.fontSize] ?? FONT_SIZE_CLASSES['base'];

  return {
    settings,
    fontClass,
    sizeClasses,
    setFontFamily,
    setFontSize,
    toggleSyncScroll,
    resetSettings,
  };
}
