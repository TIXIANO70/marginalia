import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePoemState } from '@/state/usePoemState';
import { storageService } from '@/services/storageService';

describe('State Hook: usePoemState', () => {
  it('debe inicializar con el poema por defecto y traducción vacía', () => {
    storageService.clearPoemData('gone-gone-gone-phillip-phillips');
    const { result } = renderHook(() => usePoemState());

    expect(result.current.poem.title).toBe('Gone, Gone, Gone');
    expect(result.current.translation).toBe('');
    expect(result.current.alignedPairs.length).toBeGreaterThan(0);
  });

  it('debe actualizar la traducción y persistirla con debounce', async () => {
    vi.useFakeTimers();
    const saveSpy = vi.spyOn(storageService, 'saveTranslation');

    const { result } = renderHook(() => usePoemState());

    act(() => {
      result.current.setTranslation('Primera estrofa traducida');
    });

    expect(result.current.translation).toBe('Primera estrofa traducida');
    expect(result.current.isSaving).toBe(true);

    // Avanzar timer de debounce
    act(() => {
      vi.advanceTimersByTime(350);
    });

    expect(saveSpy).toHaveBeenCalledWith('gone-gone-gone-phillip-phillips', 'Primera estrofa traducida');
    expect(result.current.isSaving).toBe(false);

    vi.useRealTimers();
  });

  it('debe limpiar la traducción', () => {
    const { result } = renderHook(() => usePoemState());

    act(() => {
      result.current.setTranslation('Texto a borrar');
    });

    act(() => {
      result.current.clearTranslation();
    });

    expect(result.current.translation).toBe('');
  });
});
