/**
 * @file CommentThreadCard.tsx
 * @description Tarjeta de hilo de comentarios individual estilo Google Docs con respuestas, resolución y foco bidireccional.
 */

import React, { useState } from 'react';
import { Check, Trash2, CornerDownRight, Send, MessageSquare } from 'lucide-react';
import { CommentThread } from '@/domain/comment';

interface CommentThreadCardProps {
  thread: CommentThread;
  isFocused: boolean;
  onFocus: () => void;
  onReply: (threadId: string, author: string, content: string) => void;
  onToggleResolve: (threadId: string) => void;
  onDelete: (threadId: string) => void;
}

export const CommentThreadCard: React.FC<CommentThreadCardProps> = ({
  thread,
  isFocused,
  onFocus,
  onReply,
  onToggleResolve,
  onDelete,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');

  const rangeLabel =
    thread.verseStart === thread.verseEnd
      ? `Verso ${thread.verseStart}`
      : `Versos ${thread.verseStart}–${thread.verseEnd}`;

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    onReply(thread.id, replyAuthor || 'Lector', replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  const initialComment = thread.comments[0];
  const replies = thread.comments.slice(1);

  return (
    <div
      onClick={onFocus}
      className={`rounded-xl p-3.5 border transition-all duration-200 cursor-pointer shadow-xs ${
        isFocused
          ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300/60 shadow-md'
          : thread.resolved
          ? 'bg-canto-card/60 border-canto-border/70 opacity-75'
          : 'bg-canto-card border-canto-border hover:border-amber-300/80 hover:bg-amber-50/30'
      }`}
    >
      {/* Cabecera del hilo */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-canto-border/50">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-200">
            <MessageSquare className="w-3 h-3 text-amber-700" />
            {rangeLabel}
          </span>
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
              thread.column === 'translation'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200/80'
            }`}
          >
            {thread.column === 'translation' ? 'Traducción' : 'Original'}
          </span>
        </div>

        {/* Acciones del hilo: Resolver y Eliminar */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onToggleResolve(thread.id)}
            className={`p-1 rounded-md transition text-xs flex items-center gap-1 ${
              thread.resolved
                ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                : 'text-canto-muted hover:text-emerald-700 hover:bg-emerald-50'
            }`}
            title={thread.resolved ? 'Reabrir comentario' : 'Marcar como resuelto'}
            aria-label={thread.resolved ? 'Reabrir comentario' : 'Marcar como resuelto'}
          >
            <Check className="w-3.5 h-3.5" />
            {thread.resolved && <span className="text-[10px]">Resuelto</span>}
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Eliminar este hilo de comentarios?')) {
                onDelete(thread.id);
              }
            }}
            className="p-1 rounded-md text-canto-muted hover:text-red-700 hover:bg-red-50 transition"
            title="Eliminar hilo"
            aria-label="Eliminar hilo"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comentario principal */}
      {initialComment && (
        <div className="space-y-1 mb-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-canto-text">{initialComment.author}</span>
            <span className="text-[10px] text-canto-light font-mono">
              {new Date(initialComment.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs text-canto-text/90 leading-relaxed font-sans whitespace-pre-wrap">
            {initialComment.content}
          </p>
        </div>
      )}

      {/* Lista de Respuestas */}
      {replies.length > 0 && (
        <div className="mt-3 pt-2 border-t border-canto-border/40 space-y-2 pl-2 border-l-2 border-amber-300">
          {replies.map((reply) => (
            <div key={reply.id} className="text-xs space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-canto-text text-[11px]">{reply.author}</span>
                <span className="text-[9px] text-canto-light font-mono">
                  {new Date(reply.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-canto-text/90 whitespace-pre-wrap">{reply.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Formulario / Botón de Responder */}
      <div className="mt-2 pt-1" onClick={(e) => e.stopPropagation()}>
        {!isReplying ? (
          <button
            onClick={() => setIsReplying(true)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 hover:text-amber-800 transition"
          >
            <CornerDownRight className="w-3 h-3" />
            Responder
          </button>
        ) : (
          <form onSubmit={handleSubmitReply} className="space-y-1.5 mt-2">
            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={replyAuthor}
              onChange={(e) => setReplyAuthor(e.target.value)}
              className="w-full text-xs px-2 py-1 rounded border border-canto-border bg-white text-canto-text outline-none focus:border-amber-500"
            />
            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Escribe una respuesta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                autoFocus
                className="flex-1 text-xs px-2 py-1 rounded border border-canto-border bg-white text-canto-text outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-2 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded text-xs transition"
              >
                <Send className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-2 py-1 text-canto-muted hover:text-canto-text rounded text-xs transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
