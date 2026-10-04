/**
 * @file VerseItem.tsx
 * @description Componente de presentación para un verso individual con soporte de selección y resaltado lírico.
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';
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
}) => {
  // Estados visuales de selección y comentario
  let highlightStyles = 'hover:bg-amber-50/60 text-canto-text';

  if (isSelected) {
    highlightStyles = 'bg-amber-100 text-amber-950 font-medium shadow-xs ring-1 ring-amber-300';
  } else if (isFocused) {
    highlightStyles = 'bg-amber-200/80 text-amber-950 font-medium ring-2 ring-amber-500';
  } else if (hasComments) {
    highlightStyles = 'bg-amber-50/90 text-canto-text border-b-2 border-amber-400/80';
  }

  return (
    <div
      onClick={onClick}
      data-verse-id={verse.id}
      className={`group relative flex items-baseline justify-center px-4 py-1.5 rounded-md cursor-pointer transition-all duration-150 select-none ${highlightStyles}`}
    >
      {/* Número de verso discreto en el margen izquierdo */}
      <span
        className={`absolute left-2 select-none font-mono text-canto-light opacity-50 group-hover:opacity-90 transition ${sizeClasses.number} ${
          isSelected ? 'text-amber-800 font-bold opacity-100' : ''
        }`}
      >
        {verse.id}
      </span>

      {/* Texto poético centrado */}
      <p className={`text-center max-w-lg ${fontClass} ${sizeClasses.verse} tracking-wide`}>
        {verse.text}
      </p>

      {/* Indicador de comentarios en el margen derecho */}
      {hasComments && (
        <span
          className="absolute right-2 inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-amber-700 bg-amber-100/90 px-1.5 py-0.5 rounded-full border border-amber-300/80 shadow-2xs"
          title={`${commentsCount} comentario(s) en este verso`}
        >
          <MessageSquare className="w-3 h-3 text-amber-600" />
          {commentsCount}
        </span>
      )}
    </div>
  );
});

VerseItem.displayName = 'VerseItem';
