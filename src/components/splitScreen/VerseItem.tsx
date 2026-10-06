/**
 * @file VerseItem.tsx
 * @description Componente de presentación para un verso individual con número centrado verticalmente y acción de comentar en hover.
 */

import React from 'react';
import { MessageSquare, MessageSquarePlus } from 'lucide-react';
import { Verse } from '@/domain/poem';

interface VerseItemProps {
  verse: Verse;
  isSelected: boolean;
  hasComments: boolean;
  commentsCount: number;
  isFocused: boolean;
  fontClass: string;
  sizeClasses: { verse: string; number: string };
  onClick: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onAddComment?: () => void;
}

export const VerseItem: React.FC<VerseItemProps> = React.memo(({
  verse,
  isSelected,
  hasComments,
  commentsCount,
  isFocused,
  fontClass,
  sizeClasses,
  onClick,
  onMouseDown,
  onMouseEnter,
  onAddComment,
}) => {
  // Estados visuales de selección y comentario
  let highlightStyles = 'hover:bg-amber-50/70 text-canto-text border border-transparent';

  if (isSelected) {
    highlightStyles = 'bg-amber-100/90 text-amber-950 font-medium shadow-xs border-amber-300 ring-1 ring-amber-300';
  } else if (isFocused) {
    highlightStyles = 'bg-amber-200/90 text-amber-950 font-medium border-amber-500 ring-2 ring-amber-500 shadow-xs';
  } else if (hasComments) {
    highlightStyles = 'bg-amber-50/90 text-canto-text border-amber-200/80 border-b-2 border-b-amber-400';
  }

  return (
    <div
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      data-verse-id={verse.id}
      className={`group relative flex items-center justify-center px-10 py-2.5 rounded-lg cursor-pointer transition-all duration-150 select-none ${highlightStyles}`}
    >
      {/* 1) Número de verso centrado verticalmente al medio de la caja */}
      <span
        className={`absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 text-center select-none font-mono text-canto-light opacity-50 group-hover:opacity-100 transition ${sizeClasses.number} ${
          isSelected ? 'text-amber-800 font-bold opacity-100' : ''
        }`}
        title={`Verso ${verse.id}`}
      >
        {verse.id}
      </span>

      {/* 2) Texto poético centrado */}
      <p className={`text-center max-w-lg ${fontClass} ${sizeClasses.verse} tracking-wide`}>
        {verse.text}
      </p>

      {/* 3) Acciones en margen derecho: botón de comentar en hover y badge de comentarios existentes */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        {/* Botón '+' visible en hover para comentar este verso inmediatamente */}
        {onAddComment && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddComment();
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 shadow-2xs border border-amber-300/60"
            title={`Comentar verso ${verse.id}`}
            aria-label={`Comentar verso ${verse.id}`}
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Badge de comentarios existentes */}
        {hasComments && (
          <span
            className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-full border border-amber-300 shadow-2xs"
            title={`${commentsCount} comentario(s) en este verso`}
          >
            <MessageSquare className="w-3 h-3 text-amber-600" />
            {commentsCount}
          </span>
        )}
      </div>
    </div>
  );
});

VerseItem.displayName = 'VerseItem';
