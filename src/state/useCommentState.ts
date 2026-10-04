/**
 * @file useCommentState.ts
 * @description Hook de gestión de estado para hilos de comentarios estilo Google Docs.
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
  focusedThreadId: string | null;
  isSidebarOpen: boolean;
  isNewCommentModalOpen: boolean;
  activeTab: 'active' | 'resolved';

  // Acciones de selección
  selectVerse: (verseId: number, isShiftKey?: boolean) => void;
  clearSelection: () => void;
  isVerseSelected: (verseId: number) => boolean;

  // Acciones de hilos
  openNewCommentModal: (range?: VerseRange) => void;
  closeNewCommentModal: () => void;
  createThread: (author: string, content: string) => void;
  replyToThread: (threadId: string, author: string, content: string) => void;
  toggleResolveThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;

  // Navegación e UI
  setFocusedThreadId: (id: string | null) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: 'active' | 'resolved') => void;

  // Helpers de consulta
  getThreadsForVerse: (verseId: number) => CommentThread[];
  hasCommentsOnVerse: (verseId: number) => boolean;
}

export function useCommentState(poemId: string): UseCommentStateReturn {
  const [threads, setThreads] = useState<CommentThread[]>(() => {
    return storageService.getComments(poemId);
  });
  const [selectionRange, setSelectionRange] = useState<VerseRange | null>(null);
  const [focusedThreadId, setFocusedThreadId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isNewCommentModalOpen, setIsNewCommentModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'active' | 'resolved'>('active');

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
    (verseId: number, isShiftKey: boolean = false) => {
      setSelectionRange((prev) => {
        if (!prev || !isShiftKey) {
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
    (verseId: number): boolean => {
      if (!selectionRange) return false;
      return verseId >= selectionRange.start && verseId <= selectionRange.end;
    },
    [selectionRange]
  );

  const openNewCommentModal = useCallback((customRange?: VerseRange) => {
    if (customRange) {
      setSelectionRange(customRange);
    }
    setIsNewCommentModalOpen(true);
    setIsSidebarOpen(true);
  }, []);

  const closeNewCommentModal = useCallback(() => {
    setIsNewCommentModalOpen(false);
  }, []);

  const createThread = useCallback(
    (author: string, content: string) => {
      if (!selectionRange || !content.trim()) return;

      const newThread = createCommentThread({
        id: `thread-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        range: selectionRange,
        author,
        content,
      });

      setThreads((prev) => [...prev, newThread]);
      setFocusedThreadId(newThread.id);
      setIsNewCommentModalOpen(false);
      clearSelection();
      setActiveTab('active');
    },
    [selectionRange, clearSelection]
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
    (verseId: number): CommentThread[] => {
      return threads.filter((t) => isVerseInThread(verseId, t));
    },
    [threads]
  );

  const hasCommentsOnVerse = useCallback(
    (verseId: number): boolean => {
      return threads.some((t) => !t.resolved && isVerseInThread(verseId, t));
    },
    [threads]
  );

  return {
    threads,
    activeThreads,
    resolvedThreads,
    selectionRange,
    focusedThreadId,
    isSidebarOpen,
    isNewCommentModalOpen,
    activeTab,
    selectVerse,
    clearSelection,
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
