/**
 * @file CommentsSidebar.tsx
 * @description Panel lateral deslizable para gestión de hilos de comentarios estilo Google Docs.
 */

import React from 'react';
import { MessageSquare, CheckCircle, X, Sparkles } from 'lucide-react';
import { CommentThread } from '@/domain/comment';
import { CommentThreadCard } from './CommentThreadCard';

interface CommentsSidebarProps {
  isOpen: boolean;
  activeThreads: CommentThread[];
  resolvedThreads: CommentThread[];
  focusedThreadId: string | null;
  activeTab: 'active' | 'resolved';
  onTabChange: (tab: 'active' | 'resolved') => void;
  onClose: () => void;
  onFocusThread: (id: string) => void;
  onReply: (threadId: string, author: string, content: string) => void;
  onToggleResolve: (threadId: string) => void;
  onDelete: (threadId: string) => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  isOpen,
  activeThreads,
  resolvedThreads,
  focusedThreadId,
  activeTab,
  onTabChange,
  onClose,
  onFocusThread,
  onReply,
  onToggleResolve,
  onDelete,
}) => {
  if (!isOpen) return null;

  const currentThreads = activeTab === 'active' ? activeThreads : resolvedThreads;

  return (
    <aside
      className="w-80 sm:w-96 border-l border-canto-border bg-canto-paper/95 backdrop-blur-md flex flex-col h-[calc(100vh-4rem)] flex-shrink-0 z-20 shadow-lg animate-in slide-in-from-right duration-200"
      aria-label="Panel de comentarios"
    >
      {/* Cabecera del panel */}
      <div className="p-4 border-b border-canto-border bg-canto-card/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold text-canto-text">Comentarios y Glosas</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-canto-muted hover:text-canto-text hover:bg-stone-100 transition"
          aria-label="Cerrar panel de comentarios"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selector de pestañas: Activos / Resueltos */}
      <div className="flex border-b border-canto-border bg-canto-card/30 p-1">
        <button
          onClick={() => onTabChange('active')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'active'
              ? 'bg-amber-100 text-amber-900 shadow-2xs'
              : 'text-canto-muted hover:text-canto-text'
          }`}
        >
          <span>Activos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 border border-amber-200">
            {activeThreads.length}
          </span>
        </button>

        <button
          onClick={() => onTabChange('resolved')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
            activeTab === 'resolved'
              ? 'bg-amber-100 text-amber-900 shadow-2xs'
              : 'text-canto-muted hover:text-canto-text'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Resueltos</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/80 border border-amber-200">
            {resolvedThreads.length}
          </span>
        </button>
      </div>

      {/* Lista de hilos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {currentThreads.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-canto-text">
                {activeTab === 'active'
                  ? 'No hay comentarios activos'
                  : 'No hay comentarios resueltos'}
              </p>
              <p className="text-[11px] text-canto-muted mt-1 max-w-[220px]">
                {activeTab === 'active'
                  ? 'Seleccioná uno o más versos en la columna izquierda y hacé clic en "Comentar" para iniciar un hilo de análisis.'
                  : 'Los comentarios marcados como resueltos se archivan aquí.'}
              </p>
            </div>
          </div>
        ) : (
          currentThreads.map((thread) => (
            <CommentThreadCard
              key={thread.id}
              thread={thread}
              isFocused={focusedThreadId === thread.id}
              onFocus={() => onFocusThread(thread.id)}
              onReply={onReply}
              onToggleResolve={onToggleResolve}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </aside>
  );
};
