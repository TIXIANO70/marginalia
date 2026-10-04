/**
 * @file TranslationEditor.tsx
 * @description Editor de texto libre en columna derecha con sincronización visual por línea.
 */

import React, { useMemo } from 'react';
import { PenLine, FileText } from 'lucide-react';
import { splitLines } from '@/services/poemParser';

interface TranslationEditorProps {
  translation: string;
  onChange: (value: string) => void;
  totalVerses: number;
  fontClass: string;
  sizeClasses: { verse: string; number: string };
  scrollRef: React.RefObject<HTMLDivElement>;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const TranslationEditor: React.FC<TranslationEditorProps> = ({
  translation,
  onChange,
  totalVerses,
  fontClass,
  sizeClasses,
  scrollRef,
  onScroll,
}) => {
  const lines = useMemo(() => splitLines(translation), [translation]);
  const linesCount = Math.max(lines.length, totalVerses);

  return (
    <div className="flex flex-col h-full bg-canto-paper/40 relative">
      {/* Cabecera de la columna */}
      <div className="p-3 border-b border-canto-border/80 bg-canto-paper/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PenLine className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-semibold uppercase tracking-wider text-canto-muted">
            Traducción / Notas Libres (Español)
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-canto-light font-mono">
            {translation.trim() ? `${lines.length} líneas escritas` : 'Columna en blanco'}
          </span>
        </div>
      </div>

      {/* Editor tipo bloc de notas alineado */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 flex flex-col"
      >
        <div className="max-w-xl w-full mx-auto flex-1 flex flex-col">
          {/* Título de la columna de traducción */}
          <div className="text-center mb-8 pb-4 border-b border-canto-border/50">
            <h2 className="font-classic text-2xl sm:text-3xl font-bold text-canto-text/80 tracking-wide mb-1">
              Versión en Español
            </h2>
            <p className="text-xs sm:text-sm text-canto-muted italic font-serif">
              Traducción y notas líricas personales
            </p>
          </div>

          {/* Área editable principal */}
          <div className="relative flex-1 min-h-[450px] flex">
            {/* Margen con números de línea alineados */}
            <div
              className="w-8 pr-2 select-none font-mono text-right text-canto-light/50 border-r border-canto-border/40 py-1 space-y-1"
              aria-hidden="true"
            >
              {Array.from({ length: linesCount }, (_, i) => (
                <div key={i + 1} className={`${sizeClasses.number} leading-relaxed`}>
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Editor de texto textarea */}
            <div className="flex-1 pl-4 relative">
              {!translation.trim() && (
                <div className="absolute top-2 left-4 text-canto-light/60 pointer-events-none text-xs sm:text-sm italic flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500/60" />
                  Escribe aquí tu traducción verso a verso. Cada salto de línea coincide con el verso izquierdo...
                </div>
              )}
              <textarea
                value={translation}
                onChange={(e) => onChange(e.target.value)}
                placeholder=""
                aria-label="Editor de traducción de versos"
                spellCheck="false"
                className={`w-full h-full min-h-[500px] resize-none bg-transparent outline-none text-canto-text ${fontClass} ${sizeClasses.verse} leading-relaxed tracking-wide placeholder-transparent`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
