import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCommentState } from '@/state/useCommentState';
import { storageService } from '@/services/storageService';

describe('State Hook: useCommentState', () => {
  const poemId = 'test-poem';

  it('debe gestionar el ciclo de selección de versos y creación de hilos', () => {
    storageService.clearPoemData(poemId);
    const { result } = renderHook(() => useCommentState(poemId));

    // Seleccionar verso 1
    act(() => {
      result.current.selectVerse(1);
    });
    expect(result.current.selectionRange).toEqual({ start: 1, end: 1 });
    expect(result.current.isVerseSelected(1)).toBe(true);
    expect(result.current.isVerseSelected(2)).toBe(false);

    // Extender selección con Shift al verso 4
    act(() => {
      result.current.selectVerse(4, true);
    });
    expect(result.current.selectionRange).toEqual({ start: 1, end: 4 });

    // Crear hilo
    act(() => {
      result.current.createThread('Tiziano', 'Comentario de prueba');
    });

    expect(result.current.threads).toHaveLength(1);
    expect(result.current.activeThreads).toHaveLength(1);
    expect(result.current.selectionRange).toBeNull();
    expect(result.current.hasCommentsOnVerse(2)).toBe(true);

    // Responder al hilo
    const threadId = result.current.threads[0].id;
    act(() => {
      result.current.replyToThread(threadId, 'Revisor', 'Respuesta de prueba');
    });
    expect(result.current.threads[0].comments).toHaveLength(2);

    // Resolver hilo
    act(() => {
      result.current.toggleResolveThread(threadId);
    });
    expect(result.current.activeThreads).toHaveLength(0);
    expect(result.current.resolvedThreads).toHaveLength(1);
    expect(result.current.hasCommentsOnVerse(2)).toBe(false); // Resueltos no marcan como comentario activo

    // Eliminar hilo
    act(() => {
      result.current.deleteThread(threadId);
    });
    expect(result.current.threads).toHaveLength(0);
  });
});
