/**
 * @file comment.ts
 * @description Modelos de dominio y funciones puras para el sistema de comentarios estilo Google Docs.
 */

export interface CommentItem {
  readonly id: string;
  readonly author: string;
  readonly content: string;
  readonly createdAt: string; // ISO 8601
}

export interface VerseRange {
  readonly start: number;
  readonly end: number;
}

export interface CommentThread {
  readonly id: string;
  readonly verseStart: number;
  readonly verseEnd: number;
  readonly resolved: boolean;
  readonly createdAt: string; // ISO 8601
  readonly comments: readonly CommentItem[];
}

/**
 * Determina si un número de verso se encuentra comprendido dentro del rango de un hilo.
 */
export function isVerseInThread(verseId: number, thread: CommentThread): boolean {
  return verseId >= thread.verseStart && verseId <= thread.verseEnd;
}

/**
 * Normaliza y valida un rango de versos (garantiza que start <= end y sean positivos).
 */
export function normalizeVerseRange(start: number, end: number): VerseRange {
  const min = Math.max(1, Math.min(start, end));
  const max = Math.max(1, Math.max(start, end));
  return { start: min, end: max };
}

/**
 * Comprueba si dos rangos de versos se superponen.
 */
export function areRangesOverlapping(rangeA: VerseRange, rangeB: VerseRange): boolean {
  return rangeA.start <= rangeB.end && rangeB.start <= rangeA.end;
}

/**
 * Crea un nuevo hilo de comentarios inmutable.
 */
export function createCommentThread(params: {
  id: string;
  range: VerseRange;
  author: string;
  content: string;
  timestamp?: string;
}): CommentThread {
  const now = params.timestamp ?? new Date().toISOString();
  const initialComment: CommentItem = {
    id: `${params.id}-item-1`,
    author: params.author.trim() || 'Lector',
    content: params.content.trim(),
    createdAt: now,
  };

  return {
    id: params.id,
    verseStart: params.range.start,
    verseEnd: params.range.end,
    resolved: false,
    createdAt: now,
    comments: [initialComment],
  };
}

/**
 * Agrega un nuevo mensaje de respuesta a un hilo de forma inmutable.
 */
export function addReplyToThread(
  thread: CommentThread,
  reply: { id: string; author: string; content: string; timestamp?: string }
): CommentThread {
  const newComment: CommentItem = {
    id: reply.id,
    author: reply.author.trim() || 'Lector',
    content: reply.content.trim(),
    createdAt: reply.timestamp ?? new Date().toISOString(),
  };

  return {
    ...thread,
    comments: [...thread.comments, newComment],
  };
}

/**
 * Alterna el estado de resolución de un hilo.
 */
export function toggleThreadResolved(thread: CommentThread): CommentThread {
  return {
    ...thread,
    resolved: !thread.resolved,
  };
}
