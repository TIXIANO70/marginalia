/**
 * @file NewCommentModal.tsx
 * @description Diálogo para redactar y adjuntar comentarios a uno o múltiples versos.
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquarePlus, X, Send, Plus, Minus } from 'lucide-react';
import { VerseRange } from '@/domain/comment';

interface NewCommentModalProps {
  isOpen: boolean;
  range: VerseRange | null;
  column?: 'original' | 'translation';
  totalVerses?: number;
  onClose: () => void;
  onSubmit: (author: string, content: string, customRange?: VerseRange) => void;
}

export const NewCommentModal: React.FC<NewCommentModalProps> = ({
  isOpen,
  range,
  column = 'original',
  totalVerses = 100,
  onClose,
  onSubmit,
}) => {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [startVerse, setStartVerse] = useState<number>(1);
  const [endVerse, setEndVerse] = useState<number>(1);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && range) {
      setContent('');
      setStartVerse(range.start);
      setEndVerse(range.end);
      setTimeout(() => {
        contentInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, range]);

  if (!isOpen || !range) return null;

  const columnLabel = column === 'translation' ? 'Traducción' : 'Original';
  const isMultiVerse = startVerse !== endVerse;
  const rangeLabel = isMultiVerse
    ? `Versos ${startVerse} al ${endVerse} (${columnLabel})`
    : `Verso ${startVerse} (${columnLabel})`;

  const handleStartChange = (val: number) => {
    const validVal = Math.max(1, Math.min(val, endVerse));
    setStartVerse(validVal);
  };

  const handleEndChange = (val: number) => {
    const validVal = Math.max(startVerse, Math.min(val, totalVerses));
    setEndVerse(validVal);
  };

  const handleExpandRange = (delta: number) => {
    setEndVerse((prev) => Math.max(startVerse, Math.min(prev + delta, totalVerses)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    const finalRange: VerseRange = {
      start: Math.min(startVerse, endVerse),
      end: Math.max(startVerse, endVerse),
    };
    onSubmit(author.trim() || 'Lector', content.trim(), finalRange);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-canto-card border border-canto-border p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between border-b border-canto-border/60 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-canto-accent">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-canto-text">Añadir Comentario</h3>
              <p className="text-[11px] text-amber-800 font-semibold">{rangeLabel}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-canto-muted hover:text-canto-text hover:bg-stone-100 transition"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector interactivo de rango de versos */}
        <div className="bg-canto-paper/70 p-3 rounded-xl border border-canto-border/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-canto-muted">
            <span>Rango de versos abarcados:</span>
            {isMultiVerse && (
              <span className="text-amber-800 font-bold">
                {endVerse - startVerse + 1} versos seleccionados
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label htmlFor="start-verse-input" className="text-xs text-canto-muted">Desde:</label>
              <input
                id="start-verse-input"
                type="number"
                min={1}
                max={endVerse}
                value={startVerse}
                onChange={(e) => handleStartChange(parseInt(e.target.value, 10) || 1)}
                className="w-14 text-xs font-mono text-center font-bold px-1.5 py-1 rounded-md border border-canto-border bg-white text-canto-text outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <label htmlFor="end-verse-input" className="text-xs text-canto-muted">Hasta:</label>
              <input
                id="end-verse-input"
                type="number"
                min={startVerse}
                max={totalVerses}
                value={endVerse}
                onChange={(e) => handleEndChange(parseInt(e.target.value, 10) || startVerse)}
                className="w-14 text-xs font-mono text-center font-bold px-1.5 py-1 rounded-md border border-canto-border bg-white text-canto-text outline-none focus:border-amber-500 shadow-2xs"
              />
            </div>
            {/* Atajos de expansión */}
            <div className="flex items-center gap-1 ml-auto">
              {isMultiVerse && (
                <button
                  type="button"
                  onClick={() => handleExpandRange(-1)}
                  className="flex items-center gap-0.5 px-2 py-1 text-[11px] font-medium rounded-md bg-stone-100 hover:bg-stone-200 text-canto-muted hover:text-canto-text transition"
                  title="Reducir 1 verso"
                >
                  <Minus className="w-3 h-3" />
                  <span>1</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleExpandRange(1)}
                disabled={endVerse >= totalVerses}
                className="flex items-center gap-0.5 px-2 py-1 text-[11px] font-semibold rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 transition disabled:opacity-40"
                title="Ampliar al siguiente verso"
              >
                <Plus className="w-3 h-3" />
                <span>+1 verso</span>
              </button>
            </div>
          </div>
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
              placeholder="Escribe tus observaciones, referencias o significado de los versos..."
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
              className="px-3.5 py-1.5 rounded-lg border border-canto-border text-xs font-medium text-canto-muted hover:text-canto-text hover:bg-canto-paper transition"
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
