/**
 * @file OriginalColumn.tsx
 * @description Columna lírica izquierda con versos centrados y selector contextual de comentarios.
 */

import React, { useRef } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import { PoemDocument } from '@/domain/poem';
import { VerseRange } from '@/domain/comment';
import { VerseItem } from './VerseItem';

interface OriginalColumnProps {
  poem: PoemDocument;
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
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const OriginalColumn: React.FC<OriginalColumnProps> = ({
  poem,
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
  scrollRef,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isVerseFocused = (verseId: number): boolean => {
    if (!focusedThreadRange) return false;
    return verseId >= focusedThreadRange.start && verseId <= focusedThreadRange.end;
  };

  return (
    <div className="flex flex-col h-full bg-canto-card border-r border-canto-border relative">
      {/* Cabecera de la columna */}
      <div className="p-3 border-b border-canto-border/80 bg-canto-paper/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-canto-muted">
            Texto Original (Inglés)
          </span>
        </div>
        <span className="text-xs text-canto-light font-mono">
          {poem.verses.length} versos
        </span>
      </div>

      {/* Contenedor scrolleable de versos */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 space-y-6"
      >
        {/* Título poético centrado */}
        <div className="text-center mb-8 pb-4 border-b border-canto-border/50 max-w-md mx-auto">
          <h2 className="font-classic text-2xl sm:text-3xl font-bold text-canto-text tracking-wide mb-1">
            {poem.title}
          </h2>
          <p className="text-xs sm:text-sm text-canto-muted italic font-serif">
            {poem.author}
          </p>
        </div>

        {/* Estrofas y versos */}
        <div ref={containerRef} className="space-y-6 max-w-xl mx-auto">
          {poem.stanzas.map((stanza) => (
            <div
              key={stanza.index}
              className="space-y-1 relative py-1 border-l-2 border-transparent hover:border-amber-200 transition-colors"
            >
              {stanza.verses.map((verse) => (
                <VerseItem
                  key={verse.id}
                  verse={verse}
                  isSelected={isVerseSelected(verse.id)}
                  hasComments={hasCommentsOnVerse(verse.id)}
                  commentsCount={getCommentsCount(verse.id)}
                  isFocused={isVerseFocused(verse.id)}
                  fontClass={fontClass}
                  sizeClasses={sizeClasses}
                  onClick={(e) => onSelectVerse(verse.id, e.shiftKey)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Barra de acción flotante cuando hay versos seleccionados (Estilo Google Docs) */}
      {selectionRange && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 bg-canto-text text-amber-50 px-3.5 py-2 rounded-full shadow-xl border border-amber-900/20 backdrop-blur-sm">
            <span className="text-xs font-medium text-amber-200/90 pl-1">
              {selectionRange.start === selectionRange.end
                ? `Verso ${selectionRange.start}`
                : `Versos ${selectionRange.start}–${selectionRange.end}`}
            </span>
            <div className="h-3 w-px bg-amber-200/30"></div>
            <button
              onClick={() => onOpenNewComment(selectionRange)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Comentar</span>
            </button>
            <button
              onClick={onClearSelection}
              className="p-1 rounded-full text-amber-300 hover:text-white hover:bg-white/10 transition"
              title="Cancelar selección"
              aria-label="Cancelar selección"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
