/**
 * @file SplitScreenLayout.tsx
 * @description Contenedor de pantalla dividida con sincronización suave de scroll y soporte dual de columnas.
 */

import React, { useRef, useCallback } from 'react';
import { PoemDocument } from '@/domain/poem';
import { VerseRange } from '@/domain/comment';
import { AlignedVersePair } from '@/services/poemParser';
import { OriginalColumn } from './OriginalColumn';
import { TranslationEditor } from './TranslationEditor';

interface SplitScreenLayoutProps {
  poem: PoemDocument;
  translation: string;
  alignedPairs: AlignedVersePair[];
  onTranslationChange: (text: string) => void;
  onUpdateOriginalLabel?: (label: string) => void;
  onUpdateTranslationLabel?: (label: string) => void;
  fontClass: string;
  sizeClasses: { verse: string; number: string };
  syncScroll: boolean;

  // Selección y comentarios para columna original
  originalSelectionRange: VerseRange | null;
  focusedThreadRange?: VerseRange | null;
  isOriginalVerseSelected: (verseId: number) => boolean;
  onSelectOriginalVerse: (verseId: number, isShiftKey: boolean) => void;
  onClearOriginalSelection: () => void;
  onOpenOriginalComment: (range?: VerseRange) => void;
  hasOriginalComments: (verseId: number) => boolean;
  getOriginalCommentsCount: (verseId: number) => number;

  // Selección y comentarios para columna de traducción
  translationSelectionRange: VerseRange | null;
  isTranslationVerseSelected: (verseId: number) => boolean;
  onSelectTranslationVerse: (verseId: number, isShiftKey: boolean) => void;
  onClearTranslationSelection: () => void;
  onOpenTranslationComment: (range?: VerseRange) => void;
  hasTranslationComments: (verseId: number) => boolean;
  getTranslationCommentsCount: (verseId: number) => number;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  poem,
  translation,
  alignedPairs,
  onTranslationChange,
  onUpdateOriginalLabel,
  onUpdateTranslationLabel,
  fontClass,
  sizeClasses,
  syncScroll,
  originalSelectionRange,
  focusedThreadRange,
  isOriginalVerseSelected,
  onSelectOriginalVerse,
  onClearOriginalSelection,
  onOpenOriginalComment,
  hasOriginalComments,
  getOriginalCommentsCount,
  translationSelectionRange,
  isTranslationVerseSelected,
  onSelectTranslationVerse,
  onClearTranslationSelection,
  onOpenTranslationComment,
  hasTranslationComments,
  getTranslationCommentsCount,
}) => {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const activeScrollerRef = useRef<'left' | 'right' | null>(null);

  const handleLeftScroll = useCallback(() => {
    if (!syncScroll || activeScrollerRef.current === 'right') return;
    activeScrollerRef.current = 'left';

    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;
    if (!leftEl || !rightEl) return;

    const maxScrollLeft = leftEl.scrollHeight - leftEl.clientHeight;
    const maxScrollRight = rightEl.scrollHeight - rightEl.clientHeight;

    if (maxScrollLeft > 0 && maxScrollRight > 0) {
      const scrollRatio = leftEl.scrollTop / maxScrollLeft;
      rightEl.scrollTop = scrollRatio * maxScrollRight;
    }

    requestAnimationFrame(() => {
      activeScrollerRef.current = null;
    });
  }, [syncScroll]);

  const handleRightScroll = useCallback(() => {
    if (!syncScroll || activeScrollerRef.current === 'left') return;
    activeScrollerRef.current = 'right';

    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;
    if (!leftEl || !rightEl) return;

    const maxScrollLeft = leftEl.scrollHeight - leftEl.clientHeight;
    const maxScrollRight = rightEl.scrollHeight - rightEl.clientHeight;

    if (maxScrollLeft > 0 && maxScrollRight > 0) {
      const scrollRatio = rightEl.scrollTop / maxScrollRight;
      leftEl.scrollTop = scrollRatio * maxScrollLeft;
    }

    requestAnimationFrame(() => {
      activeScrollerRef.current = null;
    });
  }, [syncScroll]);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-canto-border h-[calc(100vh-4rem)] overflow-hidden">
      {/* Columna Izquierda: Original */}
      <OriginalColumn
        poem={poem}
        selectionRange={originalSelectionRange}
        focusedThreadRange={focusedThreadRange}
        isVerseSelected={isOriginalVerseSelected}
        onSelectVerse={onSelectOriginalVerse}
        onClearSelection={onClearOriginalSelection}
        onOpenNewComment={onOpenOriginalComment}
        onUpdateLabel={onUpdateOriginalLabel}
        hasCommentsOnVerse={hasOriginalComments}
        getCommentsCount={getOriginalCommentsCount}
        fontClass={fontClass}
        sizeClasses={sizeClasses}
        scrollRef={leftScrollRef}
        onScroll={handleLeftScroll}
      />

      {/* Columna Derecha: Traducción libre (Modo Lectura / Edición) */}
      <TranslationEditor
        translation={translation}
        onChange={onTranslationChange}
        alignedPairs={alignedPairs}
        totalVerses={poem.verses.length}
        translationLabel={poem.translationLabel}
        onUpdateLabel={onUpdateTranslationLabel}
        fontClass={fontClass}
        sizeClasses={sizeClasses}
        scrollRef={rightScrollRef}
        onScroll={handleRightScroll}
        selectionRange={translationSelectionRange}
        focusedThreadRange={focusedThreadRange}
        isVerseSelected={isTranslationVerseSelected}
        onSelectVerse={onSelectTranslationVerse}
        onClearSelection={onClearTranslationSelection}
        onOpenNewComment={onOpenTranslationComment}
        hasCommentsOnVerse={hasTranslationComments}
        getCommentsCount={getTranslationCommentsCount}
      />
    </div>
  );
};
