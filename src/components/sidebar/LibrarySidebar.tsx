/**
 * @file LibrarySidebar.tsx
 * @description Barra lateral izquierda estilo ChatGPT/Gemini con biblioteca de letras, buscador y estados (🟢 Terminado / 🟠 ... En progreso).
 */

import React from 'react';
import { PlusCircle, Search, Trash2, X, Music } from 'lucide-react';
import { PoemDocument, PoemStatus } from '@/domain/poem';

interface LibrarySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  poems: PoemDocument[];
  activePoemId: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPoem: (id: string) => void;
  onOpenNewPoemModal: () => void;
  onToggleStatus: (id: string, currentStatus: PoemStatus) => void;
  onDeletePoem: (id: string) => void;
}

export const LibrarySidebar: React.FC<LibrarySidebarProps> = ({
  isOpen,
  onClose,
  poems,
  activePoemId,
  searchQuery,
  onSearchChange,
  onSelectPoem,
  onOpenNewPoemModal,
  onToggleStatus,
  onDeletePoem,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      className="w-80 sm:w-88 border-r border-canto-border bg-canto-paper/95 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] flex-shrink-0 z-20 shadow-xl animate-in slide-in-from-left duration-200"
      aria-label="Biblioteca de letras"
    >
      {/* Cabecera de la biblioteca */}
      <div className="p-4 border-b border-canto-border bg-canto-card/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold text-canto-text">Biblioteca de Letras</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-canto-muted hover:text-canto-text hover:bg-stone-100 transition"
            aria-label="Cerrar biblioteca"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Botón "+ Nueva Letra" estilo ChatGPT/Gemini */}
        <button
          onClick={onOpenNewPoemModal}
          className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Letra / Canto</span>
        </button>

        {/* Buscador de obras */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-canto-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, autor o tag..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-canto-border bg-white text-canto-text outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Lista de canciones guardadas */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {poems.length === 0 ? (
          <div className="p-6 text-center text-xs text-canto-muted">
            No se encontraron letras registradas.
          </div>
        ) : (
          poems.map((poem) => {
            const isActive = poem.id === activePoemId;
            const isCompleted = poem.status === 'completed';

            return (
              <div
                key={poem.id}
                onClick={() => onSelectPoem(poem.id)}
                className={`group relative p-3 rounded-xl border transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-amber-100/90 border-amber-400 text-canto-text shadow-xs ring-1 ring-amber-300'
                    : 'bg-canto-card border-canto-border/80 hover:bg-amber-50/50 hover:border-amber-300/80 text-canto-text'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold truncate tracking-tight">{poem.title}</h3>
                    <p className="text-[11px] text-canto-muted truncate italic font-serif">
                      {poem.author}
                    </p>
                  </div>

                  {/* Botón de eliminar (oculto en hover salvo si hay confirmación) */}
                  {poems.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Eliminar la obra "${poem.title}" y sus traducciones?`)) {
                          onDeletePoem(poem.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-canto-muted hover:text-red-700 transition"
                      title="Eliminar obra"
                      aria-label="Eliminar obra"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Footer de la tarjeta: Estado y Tags */}
                <div className="mt-2 pt-2 border-t border-canto-border/40 flex items-center justify-between gap-2">
                  {/* Badge de estado con toggle interactivo */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStatus(poem.id, poem.status);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold transition border ${
                      isCompleted
                        ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                        : 'bg-amber-100/80 text-amber-900 border-amber-300 hover:bg-amber-200'
                    }`}
                    title="Hacé clic para alternar entre 'En progreso' y 'Terminado'"
                  >
                    {isCompleted ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Terminado</span>
                      </>
                    ) : (
                      <>
                        <span className="text-amber-700 font-extrabold tracking-tighter">...</span>
                        <span>En progreso</span>
                      </>
                    )}
                  </button>

                  {/* Etiquetas / Cantidad de versos */}
                  <div className="flex items-center gap-1">
                    {poem.tags && poem.tags.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-canto-paper text-canto-muted border border-canto-border/60">
                        {poem.tags[0]}
                      </span>
                    )}
                    <span className="text-[10px] text-canto-light font-mono">
                      {poem.verses.length}v
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
