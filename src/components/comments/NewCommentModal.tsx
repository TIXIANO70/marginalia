/**
 * @file NewCommentModal.tsx
 * @description Diálogo para redactar y adjuntar un nuevo comentario a los versos seleccionados.
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, X, Send } from 'lucide-react';
import { VerseRange } from '@/domain/comment';

interface NewCommentModalProps {
  isOpen: boolean;
  range: VerseRange | null;
  onClose: () => void;
  onSubmit: (author: string, content: string) => void;
}

export const NewCommentModal: React.FC<NewCommentModalProps> = ({
  isOpen,
  range,
  onClose,
  onSubmit,
}) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setContent('');
      setTimeout(() => {
        contentInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen || !range) return null;

  const rangeLabel =
    range.start === range.end ? `Verso ${range.start}` : `Versos ${range.start} al ${range.end}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(author.trim() || 'Lector', content.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-canto-card border border-canto-border p-5 shadow-2xl space-y-4">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-canto-accent">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-canto-text">Añadir Comentario</h3>
              <p className="text-[11px] text-amber-800 font-medium">{rangeLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-canto-muted hover:text-canto-text hover:bg-stone-100 transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-canto-muted mb-1">
              Tu Nombre (opcional)
            </label>
            <input
              type="text"
              placeholder="Ej. Tiziano"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-canto-muted mb-1">
              Comentario o Análisis Lírico
            </label>
            <textarea
              ref={contentInputRef}
              rows={4}
              placeholder="Escribe tus observaciones, referencias o significado del verso..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white resize-none transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-canto-border text-xs font-medium text-canto-muted hover:text-canto-text hover:bg-canto-paper transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar Comentario</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
