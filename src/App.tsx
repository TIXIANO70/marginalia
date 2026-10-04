/**
 * @file App.tsx
 * @description Componente raíz de la SPA Canto: integración de estado, vista dividida y comentarios.
 */

import React, { useMemo } from 'react';
import { Header } from '@/components/header/Header';
import { SplitScreenLayout } from '@/components/splitScreen/SplitScreenLayout';
import { CommentsSidebar } from '@/components/comments/CommentsSidebar';
import { NewCommentModal } from '@/components/comments/NewCommentModal';
import { usePoemState } from '@/state/usePoemState';
import { useCommentState } from '@/state/useCommentState';
import { useReaderSettings } from '@/state/useReaderSettings';
import { VerseRange } from '@/domain/comment';

export const App: React.FC = () => {
  const {
    poem,
    translation,
    setTranslation,
    clearTranslation,
    isSaving,
  } = usePoemState();

  const {
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
  } = useCommentState(poem.id);

  const {
    settings,
    fontClass,
    sizeClasses,
    setFontFamily,
    setFontSize,
  } = useReaderSettings();

  // Calcular el rango del hilo enfocado para resaltado bidireccional en el poema
  const focusedThreadRange = useMemo<VerseRange | null>(() => {
    if (!focusedThreadId) return null;
    const thread = threads.find((t) => t.id === focusedThreadId);
    if (!thread) return null;
    return { start: thread.verseStart, end: thread.verseEnd };
  }, [focusedThreadId, threads]);

  // Al hacer clic en un verso, si tiene comentarios, enfocar el primer hilo en el panel
  const handleSelectVerse = (verseId: number, isShiftKey: boolean) => {
    selectVerse(verseId, isShiftKey);
    const verseThreads = getThreadsForVerse(verseId);
    if (verseThreads.length > 0 && !isShiftKey) {
      setFocusedThreadId(verseThreads[0].id);
      setIsSidebarOpen(true);
    }
  };

  const getCommentsCountForVerse = (verseId: number): number => {
    return getThreadsForVerse(verseId).filter((t) => !t.resolved).length;
  };

  return (
    <div className="min-h-screen flex flex-col bg-canto-bg text-canto-text">
      {/* Barra de cabecera superior */}
      <Header
        title={poem.title}
        author={poem.author}
        fontFamily={settings.fontFamily}
        fontSize={settings.fontSize}
        onFontFamilyChange={setFontFamily}
        onFontSizeChange={setFontSize}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
        activeCommentsCount={activeThreads.length}
        isSaving={isSaving}
        onResetTranslation={clearTranslation}
      />

      {/* Área principal con división de pantalla y sidebar de comentarios */}
      <main className="flex-1 flex overflow-hidden">
        <SplitScreenLayout
          poem={poem}
          translation={translation}
          onTranslationChange={setTranslation}
          selectionRange={selectionRange}
          focusedThreadRange={focusedThreadRange}
          isVerseSelected={isVerseSelected}
          onSelectVerse={handleSelectVerse}
          onClearSelection={clearSelection}
          onOpenNewComment={openNewCommentModal}
          hasCommentsOnVerse={hasCommentsOnVerse}
          getCommentsCount={getCommentsCountForVerse}
          fontClass={fontClass}
          sizeClasses={sizeClasses}
          syncScroll={settings.syncScroll}
        />

        {/* Panel lateral de comentarios estilo Google Docs */}
        <CommentsSidebar
          isOpen={isSidebarOpen}
          activeThreads={activeThreads}
          resolvedThreads={resolvedThreads}
          focusedThreadId={focusedThreadId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setIsSidebarOpen(false)}
          onFocusThread={setFocusedThreadId}
          onReply={replyToThread}
          onToggleResolve={toggleResolveThread}
          onDelete={deleteThread}
        />
      </main>

      {/* Modal flotante para crear nuevo comentario */}
      <NewCommentModal
        isOpen={isNewCommentModalOpen}
        range={selectionRange}
        onClose={closeNewCommentModal}
        onSubmit={createThread}
      />
    </div>
  );
};
export default App;
