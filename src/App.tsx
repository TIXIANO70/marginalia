/**
 * @file App.tsx
 * @description Componente raíz de la SPA Canto: integración de biblioteca de letras, vista dividida y comentarios.
 */

import React, { useMemo } from 'react';
import { Header } from '@/components/header/Header';
import { SplitScreenLayout } from '@/components/splitScreen/SplitScreenLayout';
import { CommentsSidebar } from '@/components/comments/CommentsSidebar';
import { LibrarySidebar } from '@/components/sidebar/LibrarySidebar';
import { NewPoemModal } from '@/components/sidebar/NewPoemModal';
import { NewCommentModal } from '@/components/comments/NewCommentModal';
import { useLibraryState } from '@/state/useLibraryState';
import { usePoemState } from '@/state/usePoemState';
import { useCommentState } from '@/state/useCommentState';
import { useReaderSettings } from '@/state/useReaderSettings';
import { VerseRange } from '@/domain/comment';

export const App: React.FC = () => {
  // Estado de la biblioteca de canciones (ChatGPT / Gemini style sidebar)
  const {
    activePoemId,
    activePoem,
    isLibraryOpen,
    isNewPoemModalOpen,
    searchQuery,
    filteredPoems,
    selectPoem,
    createNewPoem,
    updatePoemStatus,
    updatePoemLabels,
    deletePoem,
    setSearchQuery,
    setIsLibraryOpen,
    toggleLibrary,
    setIsNewPoemModalOpen,
  } = useLibraryState();

  // Estado del poema activo y su traducción
  const {
    poem,
    translation,
    setTranslation,
    alignedPairs,
    clearTranslation,
    isSaving,
  } = usePoemState(activePoem);

  // Estado del sistema de comentarios (soporte dual de columnas)
  const {
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

  // Estado de configuración tipográfica
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

  // Selección en Columna Original
  const handleSelectOriginalVerse = (verseId: number, isShiftKey: boolean) => {
    selectVerse(verseId, 'original', isShiftKey);
    const verseThreads = getThreadsForVerse(verseId, 'original');
    if (verseThreads.length > 0 && !isShiftKey) {
      setFocusedThreadId(verseThreads[0].id);
      setIsSidebarOpen(true);
    }
  };

  // Selección en Columna de Traducción (Modo Lectura)
  const handleSelectTranslationVerse = (verseId: number, isShiftKey: boolean) => {
    selectVerse(verseId, 'translation', isShiftKey);
    const verseThreads = getThreadsForVerse(verseId, 'translation');
    if (verseThreads.length > 0 && !isShiftKey) {
      setFocusedThreadId(verseThreads[0].id);
      setIsSidebarOpen(true);
    }
  };

  // Actualización de titulares de columnas
  const handleUpdateOriginalLabel = (label: string) => {
    updatePoemLabels(poem.id, { originalLabel: label });
  };

  const handleUpdateTranslationLabel = (label: string) => {
    updatePoemLabels(poem.id, { translationLabel: label });
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
        isLibraryOpen={isLibraryOpen}
        onToggleLibrary={toggleLibrary}
        activeCommentsCount={activeThreads.length}
        isSaving={isSaving}
        onResetTranslation={clearTranslation}
      />

      {/* Área principal: Biblioteca lateral izquierda + Vista dividida + Comentarios derecha */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Barra lateral izquierda de biblioteca de letras (estilo ChatGPT/Gemini) */}
        <LibrarySidebar
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          poems={filteredPoems}
          activePoemId={activePoemId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectPoem={selectPoem}
          onOpenNewPoemModal={() => setIsNewPoemModalOpen(true)}
          onToggleStatus={(id, currentStatus) =>
            updatePoemStatus(id, currentStatus === 'completed' ? 'in-progress' : 'completed')
          }
          onDeletePoem={deletePoem}
        />

        {/* Contenedor central de pantalla dividida */}
        <SplitScreenLayout
          poem={poem}
          translation={translation}
          alignedPairs={alignedPairs}
          onTranslationChange={setTranslation}
          onUpdateOriginalLabel={handleUpdateOriginalLabel}
          onUpdateTranslationLabel={handleUpdateTranslationLabel}
          fontClass={fontClass}
          sizeClasses={sizeClasses}
          syncScroll={settings.syncScroll}
          // Columna Original
          originalSelectionRange={selectedColumn === 'original' ? selectionRange : null}
          focusedThreadRange={focusedThreadRange}
          isOriginalVerseSelected={(id) => isVerseSelected(id, 'original')}
          onSelectOriginalVerse={handleSelectOriginalVerse}
          onClearOriginalSelection={clearSelection}
          onOpenOriginalComment={(range) => openNewCommentModal(range, 'original')}
          hasOriginalComments={(id) => hasCommentsOnVerse(id, 'original')}
          getOriginalCommentsCount={(id) => getThreadsForVerse(id, 'original').filter((t) => !t.resolved).length}
          // Columna de Traducción
          translationSelectionRange={selectedColumn === 'translation' ? selectionRange : null}
          isTranslationVerseSelected={(id) => isVerseSelected(id, 'translation')}
          onSelectTranslationVerse={handleSelectTranslationVerse}
          onClearTranslationSelection={clearSelection}
          onOpenTranslationComment={(range) => openNewCommentModal(range, 'translation')}
          hasTranslationComments={(id) => hasCommentsOnVerse(id, 'translation')}
          getTranslationCommentsCount={(id) => getThreadsForVerse(id, 'translation').filter((t) => !t.resolved).length}
        />

        {/* Panel lateral derecho de comentarios estilo Google Docs */}
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

      {/* Modal para crear nueva letra */}
      <NewPoemModal
        isOpen={isNewPoemModalOpen}
        onClose={() => setIsNewPoemModalOpen(false)}
        onSubmit={createNewPoem}
      />

      {/* Modal flotante para crear nuevo comentario */}
      <NewCommentModal
        isOpen={isNewCommentModalOpen}
        range={selectionRange}
        column={selectedColumn}
        totalVerses={poem.verses.length}
        onClose={closeNewCommentModal}
        onSubmit={createThread}
      />
    </div>
  );
};

export default App;
