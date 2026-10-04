import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReaderSettings } from '@/state/useReaderSettings';
import { DEFAULT_READER_SETTINGS } from '@/domain/settings';

describe('State Hook: useReaderSettings', () => {
  it('debe permitir cambiar de tipografía y tamaño de fuente', () => {
    const { result } = renderHook(() => useReaderSettings());

    expect(result.current.settings.fontFamily).toBe(DEFAULT_READER_SETTINGS.fontFamily);

    act(() => {
      result.current.setFontFamily('serif-classic');
    });
    expect(result.current.settings.fontFamily).toBe('serif-classic');
    expect(result.current.fontClass).toContain('font-classic');

    act(() => {
      result.current.setFontSize('xl');
    });
    expect(result.current.settings.fontSize).toBe('xl');
    expect(result.current.sizeClasses.verse).toContain('text-xl');

    act(() => {
      result.current.toggleSyncScroll();
    });
    expect(result.current.settings.syncScroll).toBe(false);

    act(() => {
      result.current.resetSettings();
    });
    expect(result.current.settings).toEqual(DEFAULT_READER_SETTINGS);
  });
});
