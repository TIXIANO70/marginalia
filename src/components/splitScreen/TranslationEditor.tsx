/**
 * @file TranslationEditor.tsx
 * @description Columna derecha con selector de Modo Edición / Modo Lectura, texto centrado, alineación vertical precisa de números y soporte para comentar versos individuales o rangos.
 */

import React, { useState, useMemo, useRef } from 'react';
import { PenLine, BookOpen, Edit3, Check, MessageSquarePlus, X, FileText, Plus, Minus } from 'lucide-react';
import { splitLines, AlignedVersePair } from '@/services/poemParser';
import { VerseRange } from '@/domain/comment';
import { VerseItem } from './VerseItem';

interface TranslationEditorProps {
  translation: string;
  onChange: (value: string) => void;
  alignedPairs: AlignedVersePair[];
  totalVerses: number;
  translationLabel?: string;
  onUpdateLabel?: (label: string) => void;
  fontClass: string;
  sizeClasses: { verse: string; number: string };
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;

  // Props para Modo Lectura
  selectionRange: VerseRange | null;
  focusedThreadRange?: VerseRange | null;
  isVerseSelected: (verseId: number) => boolean;
  onSelectVerse: (verseId: number, isShiftKey: boolean) => void;
  onClearSelection: () => void;
  onOpenNewComment: (range?: VerseRange) => void;
  hasCommentsOnVerse: (verseId: number) => boolean;
  getCommentsCount: (verseId: number) => number;
}

export const TranslationEditor: React.FC<TranslationEditorProps> = ({
  translation,
  onChange,
  alignedPairs,
  totalVerses,
  translationLabel = 'Versión en Español',
  onUpdateLabel,
  fontClass,
  sizeClasses,
  scrollRef,
  onScroll,
  selectionRange,
  focusedThreadRange,
  isVerseSelected,
  onSelectVerse,
  onClearSelection,
  onOpenNewComment,
  hasCommentsOnVerse,
  getCommentsCount,
}) => {
  const [mode, setMode] = useState<'edit' | 'read'>('edit');
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [customLabel, setCustomLabel] = useState(translationLabel);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lines = useMemo(() => splitLines(translation), [translation]);
  const linesCount = Math.max(lines.length, totalVerses);

  // Altura calculada para asegurar que el editor y gutter crezcan naturalmente con el contenido
  const editorContentHeight = Math.max(linesCount * 40 + 32, 600);

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
      className="flex flex-col h-full min-h-0 bg-canto-paper/40 relative"
    >
      {/* Cabecera de la columna con título editable y botón de Modo Lectura / Modo Edición */}
      <div className="p-3 border-b border-canto-border/80 bg-canto-paper/60 flex items-center justify-between gap-2">
        {/* Título editable */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0"></span>
          {isEditingLabel ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                type="text"
                aria-label="Editar título de columna"
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

        {/* Toggle Modo Lectura / Modo Edición */}
        <div className="flex items-center gap-1 bg-canto-card p-0.5 rounded-lg border border-canto-border shadow-2xs">
          <button
            onClick={() => setMode('edit')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
              mode === 'edit'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-canto-muted hover:text-canto-text'
            }`}
            title="Modo Edición: Escribir o modificar versos"
          >
            <PenLine className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Edición</span>
          </button>
          <button
            onClick={() => setMode('read')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition ${
              mode === 'read'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-xs'
                : 'text-canto-muted hover:text-canto-text'
            }`}
            title="Modo Lectura: Ver versos centrados y comentar"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Lectura</span>
          </button>
        </div>
      </div>

      {/* Área con scroll unificado y padding inferior amplio para scroll completo */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 pb-40 flex flex-col"
      >
        <div className="max-w-xl w-full mx-auto flex-1 flex flex-col">
          {/* Título de la columna con altura mínima normalizada (96px) */}
          <div className="text-center mb-8 pb-4 border-b border-canto-border/50 min-h-[96px] flex flex-col justify-center">
            <h2 className="font-classic text-2xl sm:text-3xl font-bold text-canto-text/90 tracking-wide mb-1">
              {customLabel}
            </h2>
            <p className="text-xs sm:text-sm text-canto-muted italic font-serif">
              {mode === 'read'
                ? 'Modo lectura activado: seleccioná versos para comentar'
                : 'Edición libre centrada con numeración alineada'}
            </p>
          </div>

          {/* MODO EDICIÓN: Textarea centrada con números de línea pixel-perfect alineados */}
          {mode === 'edit' && (
            <div
              className="relative flex-1 flex"
              style={{ minHeight: `${editorContentHeight}px` }}
            >
              {/* Margen con números de línea: 40px por renglón, centrado vertical idéntico al texto */}
              <div
                className="w-10 pr-2 select-none font-mono text-right text-canto-light/50 border-r border-canto-border/40 py-2 flex flex-col"
                aria-hidden="true"
              >
                {Array.from({ length: linesCount }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`${sizeClasses.number} h-10 leading-10 flex items-center justify-end font-semibold`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea centrada: padding vertical de 8px (py-2) y line-height exacto de 40px (leading-10) */}
              <div className="flex-1 pl-4 relative">
                {!translation.trim() && (
                  <div className="absolute top-4 left-0 right-0 text-center text-canto-light/60 pointer-events-none text-xs sm:text-sm italic flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-amber-500/60" />
                    Escribí aquí tu traducción verso a verso centrada...
                  </div>
                )}
                <textarea
                  ref={textareaRef}
                  value={translation}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder=""
                  aria-label="Editor de traducción de versos"
                  spellCheck="false"
                  style={{ minHeight: `${editorContentHeight}px` }}
                  className={`w-full h-full resize-none bg-transparent outline-none text-center text-canto-text ${fontClass} ${sizeClasses.verse} py-2 leading-10 tracking-wide placeholder-transparent`}
                />
              </div>
            </div>
          )}

          {/* MODO LECTURA: Cajas de versos centradas (VerseItem) respetando estrofas */}
          {mode === 'read' && (
            <div className="space-y-1 py-1">
              {alignedPairs.map((pair) => {
                const verseObj = {
                  id: pair.verseId,
                  text: pair.translationText || '—',
                  stanzaIndex: 0,
                  isStanzaEnd: pair.isStanzaEnd,
                };
                return (
                  <div
                    key={pair.verseId}
                    className={pair.isStanzaEnd ? 'mb-6' : 'mb-1'}
                  >
                    <VerseItem
                      verse={verseObj}
                      isSelected={isVerseSelected(pair.verseId)}
                      hasComments={hasCommentsOnVerse(pair.verseId)}
                      commentsCount={getCommentsCount(pair.verseId)}
                      isFocused={isVerseFocused(pair.verseId)}
                      fontClass={fontClass}
                      sizeClasses={sizeClasses}
                      onClick={(e) => onSelectVerse(pair.verseId, e.shiftKey)}
                      onMouseDown={() => handleMouseDownVerse(pair.verseId)}
                      onMouseEnter={() => handleMouseEnterVerse(pair.verseId)}
                      onAddComment={() => onOpenNewComment({ start: pair.verseId, end: pair.verseId })}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Barra de acción flotante en Modo Lectura cuando hay versos seleccionados */}
      {mode === 'read' && selectionRange && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2.5 bg-canto-text text-amber-50 px-4 py-2 rounded-full shadow-2xl border border-amber-800/40 backdrop-blur-md">
            <span className="text-xs font-semibold text-emerald-200 pl-1">
              {selectionRange.start === selectionRange.end
                ? `Verso ${selectionRange.start} (Traducción)`
                : `Versos ${selectionRange.start}–${selectionRange.end} (Traducción)`}
            </span>
            {/* Controles para ampliar o contraer rango de versos en Modo Lectura */}
            <div className="flex items-center gap-1 px-1 bg-white/10 rounded-full">
              <button
                type="button"
                onClick={() => {
                  if (selectionRange.start < selectionRange.end) {
                    onSelectVerse(selectionRange.end - 1, true);
                  }
                }}
                disabled={selectionRange.start === selectionRange.end}
                className="p-0.5 rounded-full text-emerald-200 hover:text-white disabled:opacity-30 transition"
                title="Reducir 1 verso"
                aria-label="Reducir 1 verso"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectionRange.end < totalVerses) {
                    onSelectVerse(selectionRange.end + 1, true);
                  }
                }}
                disabled={selectionRange.end >= totalVerses}
                className="p-0.5 rounded-full text-emerald-200 hover:text-white disabled:opacity-30 transition"
                title="Ampliar al siguiente verso"
                aria-label="Ampliar al siguiente verso"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="h-3 w-px bg-emerald-200/30"></div>
            <button
              onClick={() => onOpenNewComment(selectionRange)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Comentar</span>
            </button>
            <button
              onClick={onClearSelection}
              className="p-1 rounded-full text-emerald-300 hover:text-white hover:bg-white/10 transition"
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
