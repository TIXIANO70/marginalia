import { describe, it, expect } from 'vitest';
import {
  normalizeVerseRange,
  isVerseInThread,
  areRangesOverlapping,
  createCommentThread,
  addReplyToThread,
  toggleThreadResolved,
  CommentThread,
} from '@/domain/comment';

describe('Domain: comment.ts', () => {
  it('debe normalizar rangos invirtiendo inicio y fin si es necesario', () => {
    const range = normalizeVerseRange(10, 3);
    expect(range.start).toBe(3);
    expect(range.end).toBe(10);
  });

  it('debe impedir valores negativos o menores a 1 en el rango', () => {
    const range = normalizeVerseRange(-5, 0);
    expect(range.start).toBe(1);
    expect(range.end).toBe(1);
  });

  it('debe detectar correctamente si un verso está dentro del rango del hilo', () => {
    const mockThread: CommentThread = {
      id: 'thread-1',
      verseStart: 5,
      verseEnd: 8,
      resolved: false,
      createdAt: '2026-10-04T00:00:00.000Z',
      comments: [],
    };

    expect(isVerseInThread(4, mockThread)).toBe(false);
    expect(isVerseInThread(5, mockThread)).toBe(true);
    expect(isVerseInThread(7, mockThread)).toBe(true);
    expect(isVerseInThread(8, mockThread)).toBe(true);
    expect(isVerseInThread(9, mockThread)).toBe(false);
  });

  it('debe detectar solapamiento de rangos de versos', () => {
    expect(areRangesOverlapping({ start: 1, end: 4 }, { start: 3, end: 6 })).toBe(true);
    expect(areRangesOverlapping({ start: 1, end: 2 }, { start: 3, end: 5 })).toBe(false);
    expect(areRangesOverlapping({ start: 5, end: 10 }, { start: 6, end: 8 })).toBe(true);
  });

  it('debe crear un nuevo hilo de comentarios inmutable con el mensaje inicial', () => {
    const thread = createCommentThread({
      id: 'thread-test',
      range: { start: 2, end: 4 },
      author: 'Tiziano',
      content: 'Excelente verso lírico',
      timestamp: '2026-10-04T12:00:00.000Z',
    });

    expect(thread.id).toBe('thread-test');
    expect(thread.verseStart).toBe(2);
    expect(thread.verseEnd).toBe(4);
    expect(thread.resolved).toBe(false);
    expect(thread.comments).toHaveLength(1);
    expect(thread.comments[0].author).toBe('Tiziano');
    expect(thread.comments[0].content).toBe('Excelente verso lírico');
  });

  it('debe agregar respuestas a un hilo existente sin mutar el original', () => {
    const initialThread = createCommentThread({
      id: 'thread-test',
      range: { start: 1, end: 1 },
      author: 'Lector 1',
      content: 'Primer comentario',
    });

    const updatedThread = addReplyToThread(initialThread, {
      id: 'reply-1',
      author: 'Lector 2',
      content: 'Totalmente de acuerdo',
      timestamp: '2026-10-04T12:05:00.000Z',
    });

    expect(initialThread.comments).toHaveLength(1);
    expect(updatedThread.comments).toHaveLength(2);
    expect(updatedThread.comments[1].author).toBe('Lector 2');
    expect(updatedThread.comments[1].content).toBe('Totalmente de acuerdo');
  });

  it('debe alternar el estado resuelto/activo de un hilo', () => {
    const thread = createCommentThread({
      id: 'thread-test',
      range: { start: 1, end: 1 },
      author: 'Lector',
      content: 'Duda resuelta',
    });

    expect(thread.resolved).toBe(false);
    const resolved = toggleThreadResolved(thread);
    expect(resolved.resolved).toBe(true);
    const reopened = toggleThreadResolved(resolved);
    expect(reopened.resolved).toBe(false);
  });
});
