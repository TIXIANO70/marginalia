import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLibraryState } from '@/state/useLibraryState';

describe('State Hook: useLibraryState', () => {
  it('debe inicializar con la biblioteca por defecto y permitir alternar el drawer', () => {
    const { result } = renderHook(() => useLibraryState());

    expect(result.current.poems.length).toBeGreaterThan(0);
    expect(result.current.activePoem).toBeDefined();
    expect(result.current.isLibraryOpen).toBe(false);

    act(() => {
      result.current.toggleLibrary();
    });
    expect(result.current.isLibraryOpen).toBe(true);
  });

  it('debe permitir crear una nueva letra, cambiar estado y buscar por título', () => {
    const { result } = renderHook(() => useLibraryState());

    act(() => {
      result.current.createNewPoem({
        title: 'Bohemian Rhapsody',
        author: 'Queen',
        rawText: 'Is this the real life?\nIs this just fantasy?\n\nCaught in a landslide',
        status: 'in-progress',
        tags: ['Rock'],
      });
    });

    expect(result.current.activePoem.title).toBe('Bohemian Rhapsody');
    expect(result.current.activePoem.verses.length).toBe(3);
    expect(result.current.activePoem.status).toBe('in-progress');

    // Cambiar estado a terminado
    act(() => {
      result.current.updatePoemStatus(result.current.activePoem.id, 'completed');
    });
    expect(result.current.activePoem.status).toBe('completed');

    // Buscar letra
    act(() => {
      result.current.setSearchQuery('Queen');
    });
    expect(result.current.filteredPoems).toHaveLength(1);
    expect(result.current.filteredPoems[0].title).toBe('Bohemian Rhapsody');

    act(() => {
      result.current.setSearchQuery('');
    });
  });

  it('debe permitir actualizar titulares personalizados de columnas', () => {
    const { result } = renderHook(() => useLibraryState());

    act(() => {
      result.current.updatePoemLabels(result.current.activePoem.id, {
        originalLabel: 'Texte Original (Français)',
        translationLabel: 'Traduction Espagnole',
      });
    });

    expect(result.current.activePoem.originalLabel).toBe('Texte Original (Français)');
    expect(result.current.activePoem.translationLabel).toBe('Traduction Espagnole');
  });
});
