/**
 * @file NewPoemModal.tsx
 * @description Modal para crear una nueva letra lírica en la biblioteca de Canto.
 */

import React, { useState } from 'react';
import { PlusCircle, X, BookOpen } from 'lucide-react';
import { PoemStatus } from '@/domain/poem';

interface NewPoemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    title: string;
    author: string;
    rawText: string;
    status: PoemStatus;
    originalLabel?: string;
    translationLabel?: string;
    tags?: string[];
  }) => void;
}

export const NewPoemModal: React.FC<NewPoemModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<PoemStatus>('in-progress');
  const [originalLabel, setOriginalLabel] = useState('Texto Original (Inglés)');
  const [translationLabel, setTranslationLabel] = useState('Versión en Español');
  const [tagInput, setTagInput] = useState('Canción');
  const [rawText, setRawText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      author: author.trim() || 'Desconocido',
      rawText,
      status,
      originalLabel: originalLabel.trim() || 'Texto Original (Inglés)',
      translationLabel: translationLabel.trim() || 'Versión en Español',
      tags: tags.length > 0 ? tags : ['Lírica'],
    });

    // Limpiar campos
    setTitle('');
    setAuthor('');
    setRawText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-canto-card border border-canto-border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-3 border-b border-canto-border/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shadow-2xs">
              <BookOpen className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="text-base font-bold text-canto-text">Nueva Letra / Canto</h3>
              <p className="text-xs text-canto-muted">Agregá una obra para leer y traducir en paralelo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-canto-muted hover:text-canto-text hover:bg-stone-100 transition"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-canto-muted mb-1">
                Título de la Canción / Poema *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. The Sound of Silence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-canto-muted mb-1">
                Autor / Intérprete
              </label>
              <input
                type="text"
                placeholder="Ej. Simon & Garfunkel"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Estado de la obra */}
          <div>
            <label className="block text-xs font-semibold text-canto-muted mb-1">
              Estado de la Traducción
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('in-progress')}
                className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  status === 'in-progress'
                    ? 'bg-amber-100/90 text-amber-900 border-amber-400 font-semibold'
                    : 'border-canto-border bg-canto-card text-canto-muted hover:bg-amber-50'
                }`}
              >
                <span className="text-amber-600 font-bold">...</span>
                <span>En progreso</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                  status === 'completed'
                    ? 'bg-emerald-100/90 text-emerald-900 border-emerald-400 font-semibold'
                    : 'border-canto-border bg-canto-card text-canto-muted hover:bg-emerald-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Terminado</span>
              </button>
            </div>
          </div>

          {/* Encabezados de pantalla configurables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-canto-muted mb-1">
                Título Columna 1 (Original)
              </label>
              <input
                type="text"
                value={originalLabel}
                onChange={(e) => setOriginalLabel(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-canto-muted mb-1">
                Título Columna 2 (Traducción)
              </label>
              <input
                type="text"
                value={translationLabel}
                onChange={(e) => setTranslationLabel(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-canto-muted mb-1">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              placeholder="Ej. Canción, Rock, Clásico"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full text-xs px-3 py-1.5 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white transition"
            />
          </div>

          {/* Texto de versos */}
          <div>
            <label className="block text-xs font-semibold text-canto-muted mb-1">
              Letra Original (versos con saltos de línea) *
            </label>
            <textarea
              required
              rows={8}
              placeholder="Pegá aquí la letra original...&#10;Cada línea será un verso numerado.&#10;Dejá una línea en blanco entre estrofas."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-canto-border bg-canto-paper/50 text-canto-text outline-none focus:border-amber-500 focus:bg-white resize-none font-mono transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-canto-border/60">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-canto-border text-xs font-medium text-canto-muted hover:text-canto-text hover:bg-canto-paper transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !rawText.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Crear Letra</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
