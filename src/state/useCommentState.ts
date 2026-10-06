/**
 * @file useCommentState.ts
 * @description Hook de gestión de estado para hilos de comentarios estilo Google Docs con soporte dual de columnas.
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  CommentThread,
  VerseRange,
  normalizeVerseRange,
  createCommentThread,
  addReplyToThread,
  toggleThreadResolved,
  isVerseInThread,
} from '@/domain/comment';
import { storageService } from '@/services/storageService';

export interface UseCommentStateReturn {
  threads: CommentThread[];
  activeThreads: CommentThread[];
  resolvedThreads: CommentThread[];
  selectionRange: VerseRange | null;
  selectedColumn: 'original' | 'translation';
  focusedThreadId: string | null;
  isSidebarOpen: boolean;
  isNewCommentModalOpen: boolean;
  activeTab: 'active' | 'resolved';

  // Acciones de selección
  selectVerse: (
    verseId: number,
    columnOrShift?: 'original' | 'translation' | boolean,
    isShiftKey?: boolean
  ) => void;
  clearSelection: () => void;
  setSelectionRange: (range: VerseRange | null | ((prev: VerseRange | null) => VerseRange | null)) => void;
  isVerseSelected: (verseId: number, column?: 'original' | 'translation') => boolean;

  // Acciones de hilos
  openNewCommentModal: (range?: VerseRange, column?: 'original' | 'translation') => void;
  closeNewCommentModal: () => void;
  createThread: (author: string, content: string, customRange?: VerseRange) => void;
  replyToThread: (threadId: string, author: string, content: string) => void;
  toggleResolveThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;

  // Navegación e UI
  setFocusedThreadId: (id: string | null) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: 'active' | 'resolved') => void;

  // Helpers de consulta
  getThreadsForVerse: (verseId: number, column?: 'original' | 'translation') => CommentThread[];
  hasCommentsOnVerse: (verseId: number, column?: 'original' | 'translation') => boolean;
}

export function useCommentState(poemId: string): UseCommentStateReturn {
  const [threads, setThreads] = useState<CommentThread[]>(() => {
    return storageService.getComments(poemId);
  });
  const [selectionRange, setSelectionRange] = useState<VerseRange | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<'original' | 'translation'>('original');
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isNewCommentModalOpen, setIsNewCommentModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

  // Sincronizar hilos al cambiar de obra activa
  useEffect(() => {
    setThreads(storageService.getComments(poemId));
    setSelectionRange(null);
    setFocusedThreadId(null);
  }, [poemId]);

  // Guardar en Storage al cambiar threads
  useEffect(() => {
    storageService.saveComments(poemId, threads);
  }, [poemId, threads]);

  const activeThreads = useMemo(() => {
    return threads
      .filter((t) => !t.resolved)
      .sort((a, b) => a.verseStart - b.verseStart);
  }, [threads]);

  const resolvedThreads = useMemo(() => {
    return threads
      .filter((t) => t.resolved)
      .sort((a, b) => a.verseStart - b.verseStart);
  }, [threads]);

  const selectVerse = useCallback(
    (
      verseId: number,
      columnOrShift: 'original' | 'translation' | boolean = 'original',
      isShiftKey: boolean = false
    ) => {
      const shift = typeof columnOrShift === 'boolean' ? columnOrShift : isShiftKey;
      const col = typeof columnOrShift === 'string' ? columnOrShift : 'original';
      setSelectedColumn(col);
      setSelectionRange((prev) => {
        if (!prev || !shift) {
          return { start: verseId, end: verseId };
        }
        return normalizeVerseRange(prev.start, verseId);
      });
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelectionRange(null);
  }, []);

  const isVerseSelected = useCallback(
    (verseId: number, column?: 'original' | 'translation'): boolean => {
      if (!selectionRange) return false;
      if (column && selectedColumn !== column) return false;
      return verseId >= selectionRange.start && verseId <= selectionRange.end;
    },
    [selectionRange, selectedColumn]
  );

  const openNewCommentModal = useCallback(
    (customRange?: VerseRange, column?: 'original' | 'translation') => {
      if (customRange) {
        setSelectionRange(customRange);
      }
      if (column) {
        setSelectedColumn(column);
      }
      setIsNewCommentModalOpen(true);
      setIsSidebarOpen(true);
    },
    []
  );

  const closeNewCommentModal = useCallback(() => {
    setIsNewCommentModalOpen(false);
  }, []);

  const createThread = useCallback(
    (author: string, content: string, customRange?: VerseRange) => {
      const effectiveRange = customRange || selectionRange;
      if (!effectiveRange || !content.trim()) return;

      const newThread = createCommentThread({
        id: `thread-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        range: effectiveRange,
        column: selectedColumn,
        author,
        content,
      });

      setThreads((prev) => [...prev, newThread]);
      setFocusedThreadId(newThread.id);
      setIsNewCommentModalOpen(false);
      clearSelection();
      setActiveTab('active');
    },
    [selectionRange, selectedColumn, clearSelection]
  );

  const replyToThread = useCallback(
    (threadId: string, author: string, content: string) => {
      if (!content.trim()) return;
      const replyId = `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      setThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? addReplyToThread(thread, { id: replyId, author, content })
            : thread
        )
      );
    },
    []
  );

  const toggleResolveThread = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? toggleThreadResolved(thread) : thread
      )
    );
  }, []);

  const deleteThread = useCallback(
    (threadId: string) => {
      setThreads((prev) => prev.filter((thread) => thread.id !== threadId));
      if (focusedThreadId === threadId) {
        setFocusedThreadId(null);
      }
    },
    [focusedThreadId]
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const getThreadsForVerse = useCallback(
    (verseId: number, column?: 'original' | 'translation'): CommentThread[] => {
      return threads.filter((t) => isVerseInThread(verseId, t, column));
    },
    [threads]
  );

  const hasCommentsOnVerse = useCallback(
    (verseId: number, column?: 'original' | 'translation'): boolean => {
      return threads.some((t) => !t.resolved && isVerseInThread(verseId, t, column));
    },
    [threads]
  );

  return {
    threads,
    activeThreads,
    resolvedThreads,
    selectionRange,
    selectedColumn,
    focusedThreadId,
    isSidebarOpen,
    isNewCommentModalOpen,
    activeTab,
    selectVerse,
    clearSelection,
    setSelectionRange,
    isVerseSelected,
    openNewCommentModal,
    closeNewCommentModal,
    createThread,
    replyToThread,
    toggleResolveThread,
    deleteThread,
    setFocusedThreadId,
    setIsSidebarOpen,
    toggleSidebar,
    setActiveTab,
    getThreadsForVerse,
    hasCommentsOnVerse,
  };
}
