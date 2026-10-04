/**
 * @file SplitScreenLayout.tsx
 * @description Contenedor de pantalla dividida con sincronización bidireccional de scroll.
 */

import React, { useRef, useCallback } from 'react';
import { PoemDocument } from '@/domain/poem';
import { VerseRange } from '@/domain/comment';
import { OriginalColumn } from './OriginalColumn';
import { TranslationEditor } from './TranslationEditor';

interface SplitScreenLayoutProps {
  poem: PoemDocument;
  translation: string;
  onTranslationChange: (text: string) => void;
  selectionRange: VerseRange | null;
  focusedThreadRange?: VerseRange | null;
  isVerseSelected: (verseId: number) => boolean;
  onSelectVerse: (verseId: number, isShiftKey: boolean) => void;
  onClearSelection: () => void;
  onOpenNewComment: (range?: VerseRange) => void;
  hasCommentsOnVerse: (verseId: number) => boolean;
  getCommentsCount: (verseId: number) => number;
  fontClass: string;
  sizeClasses: { verse: string; number: string };
  syncScroll: boolean;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = ({
  poem,
  translation,
  onTranslationChange,
  selectionRange,
  focusedThreadRange,
  isVerseSelected,
  onSelectVerse,
  onClearSelection,
  onOpenNewComment,
  hasCommentsOnVerse,
  getCommentsCount,
  fontClass,
  sizeClasses,
  syncScroll,
}) => {
  const leftScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingLeft = useRef(false);
  const isSyncingRight = useRef(false);

  const handleLeftScroll = useCallback(() => {
    if (!syncScroll || isSyncingLeft.current) return;
    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;
    if (!leftEl || !rightEl) return;

    isSyncingRight.current = true;
    const maxScrollLeft = leftEl.scrollHeight - leftEl.clientHeight;
    const scrollRatio = maxScrollLeft > 0 ? leftEl.scrollTop / maxScrollLeft : 0;
    const maxScrollRight = rightEl.scrollHeight - rightEl.clientHeight;

    rightEl.scrollTop = scrollRatio * maxScrollRight;
    requestAnimationFrame(() => {
      isSyncingRight.current = false;
    });
  }, [syncScroll]);

  const handleRightScroll = useCallback(() => {
    if (!syncScroll || isSyncingRight.current) return;
    const leftEl = leftScrollRef.current;
    const rightEl = rightScrollRef.current;
    if (!leftEl || !rightEl) return;

    isSyncingLeft.current = true;
    const maxScrollRight = rightEl.scrollHeight - rightEl.clientHeight;
    const scrollRatio = maxScrollRight > 0 ? rightEl.scrollTop / maxScrollRight : 0;
    const maxScrollLeft = leftEl.scrollHeight - leftEl.clientHeight;

    leftEl.scrollTop = scrollRatio * maxScrollLeft;
    requestAnimationFrame(() => {
      isSyncingLeft.current = false;
    });
  }, [syncScroll]);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-canto-border h-[calc(100vh-4rem)] overflow-hidden">
      {/* Columna Izquierda: Original */}
      <OriginalColumn
        poem={poem}
        selectionRange={selectionRange}
        focusedThreadRange={focusedThreadRange}
        isVerseSelected={isVerseSelected}
        onSelectVerse={onSelectVerse}
        onClearSelection={onClearSelection}
        onOpenNewComment={onOpenNewComment}
        hasCommentsOnVerse={hasCommentsOnVerse}
        getCommentsCount={getCommentsCount}
        fontClass={fontClass}
        sizeClasses={sizeClasses}
        scrollRef={leftScrollRef}
        onScroll={handleLeftScroll}
      />

      {/* Columna Derecha: Traducción libre */}
      <TranslationEditor
        translation={translation}
        onChange={onTranslationChange}
        totalVerses={poem.verses.length}
        fontClass={fontClass}
        sizeClasses={sizeClasses}
        scrollRef={rightScrollRef}
        onScroll={handleRightScroll}
      />
    </div>
  );
};
