/**
 * @file OriginalColumn.tsx
 * @description Columna lírica izquierda con versos centrados, título editable y acciones de comentario.
 */

import React, { useState, useRef } from 'react';
import { MessageSquarePlus, X, Edit3, Check, Plus, Minus } from 'lucide-react';
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
  onUpdateLabel?: (newLabel: string) => void;
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
  onUpdateLabel,
  hasCommentsOnVerse,
  getCommentsCount,
  fontClass,
  sizeClasses,
  scrollRef,
  onScroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [customLabel, setCustomLabel] = useState(poem.originalLabel ?? 'Texto Original (Inglés)');
  const [isDragging, setIsDragging] = useState(false);

  const handleSaveLabel = () => {
    setIsEditingLabel(false);
    if (customLabel.trim() && onUpdateLabel) {
      onUpdateLabel(customLabel.trim());
    }
  };

  const isVerseFocused = (verseId: number): boolean => {
    if (!focusedThreadRange) return false;
    return verseId >= focusedThreadRange.start && verseId <= focusedThreadRange.end;
  };

  const handleMouseDownVerse = (verseId: number) => {
    setIsDragging(true);
    onSelectVerse(verseId, false);
  };

  const handleMouseEnterVerse = (verseId: number) => {
    if (isDragging) {
      onSelectVerse(verseId, true);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="flex flex-col h-full min-h-0 bg-canto-card border-r border-canto-border relative"
    >
      {/* Cabecera de la columna con titular editable */}
      <div className="p-3 border-b border-canto-border/80 bg-canto-paper/60 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 flex-shrink-0"></span>
          {isEditingLabel ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveLabel()}
                autoFocus
                className="text-xs font-semibold px-2 py-0.5 rounded border border-amber-400 bg-white text-canto-text outline-none flex-1 max-w-xs"
              />
              <button
                onClick={handleSaveLabel}
                className="p-1 rounded text-amber-700 hover:bg-amber-100"
                title="Guardar título"
                aria-label="Guardar título"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingLabel(true)}
              className="group flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-canto-muted hover:text-canto-text transition truncate text-left"
              title="Hacé clic para editar el nombre de la columna"
            >
              <span className="truncate">{customLabel}</span>
              <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-70 transition flex-shrink-0" />
            </button>
          )}
        </div>
        <span className="text-xs text-canto-light font-mono flex-shrink-0">
          {poem.verses.length} versos
        </span>
      </div>

      {/* Contenedor scrolleable de versos con padding inferior amplio para scroll completo */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 pb-40 space-y-6"
      >
        {/* Título poético centrado con altura mínima normalizada */}
        <div className="text-center mb-8 pb-4 border-b border-canto-border/50 max-w-md mx-auto min-h-[96px] flex flex-col justify-center">
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
                  onMouseDown={() => handleMouseDownVerse(verse.id)}
                  onMouseEnter={() => handleMouseEnterVerse(verse.id)}
                  onAddComment={() => onOpenNewComment({ start: verse.id, end: verse.id })}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Barra de acción flotante cuando hay versos seleccionados */}
      {selectionRange && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5 bg-canto-text text-amber-50 px-4 py-2 rounded-full shadow-2xl border border-amber-800/40 backdrop-blur-md">
            <span className="text-xs font-semibold text-amber-200 pl-1">
              {selectionRange.start === selectionRange.end
                ? `Verso ${selectionRange.start}`
                : `Versos ${selectionRange.start}–${selectionRange.end}`}
            </span>
            {/* Controles para ampliar o contraer rango de versos */}
            <div className="flex items-center gap-1 px-1 bg-white/10 rounded-full">
              <button
                type="button"
                onClick={() => {
                  if (selectionRange.start < selectionRange.end) {
                    onSelectVerse(selectionRange.end - 1, true);
                  }
                }}
                disabled={selectionRange.start === selectionRange.end}
                className="p-0.5 rounded-full text-amber-200 hover:text-white disabled:opacity-30 transition"
                title="Reducir 1 verso"
                aria-label="Reducir 1 verso"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectionRange.end < poem.verses.length) {
                    onSelectVerse(selectionRange.end + 1, true);
                  }
                }}
                disabled={selectionRange.end >= poem.verses.length}
                className="p-0.5 rounded-full text-amber-200 hover:text-white disabled:opacity-30 transition"
                title="Ampliar al siguiente verso"
                aria-label="Ampliar al siguiente verso"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="h-3 w-px bg-amber-200/30"></div>
            <button
              onClick={() => onOpenNewComment(selectionRange)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition"
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
