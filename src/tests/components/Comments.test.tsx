import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CommentsSidebar } from '@/components/comments/CommentsSidebar';
import { NewCommentModal } from '@/components/comments/NewCommentModal';
import { CommentThread } from '@/domain/comment';

describe('Component: CommentsSidebar & CommentThreadCard', () => {
  const mockThreads: CommentThread[] = [
    {
      id: 'thread-1',
      verseStart: 1,
      verseEnd: 2,
      resolved: false,
      createdAt: '2026-10-04T12:00:00.000Z',
      comments: [
        {
          id: 'c-1',
          author: 'Tiziano',
          content: 'Primer verso muy potente',
          createdAt: '2026-10-04T12:00:00.000Z',
        },
      ],
    },
  ];

  it('debe renderizar hilos activos correctamente', () => {
    render(
      <CommentsSidebar
        isOpen={true}
        activeThreads={mockThreads}
        resolvedThreads={[]}
        focusedThreadId={null}
        activeTab="active"
        onTabChange={vi.fn()}
        onClose={vi.fn()}
        onFocusThread={vi.fn()}
        onReply={vi.fn()}
        onToggleResolve={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Comentarios y Glosas')).toBeInTheDocument();
    expect(screen.getByText('Versos 1–2')).toBeInTheDocument();
    expect(screen.getByText('Tiziano')).toBeInTheDocument();
    expect(screen.getByText('Primer verso muy potente')).toBeInTheDocument();
  });

  it('debe permitir responder a un hilo de comentarios', () => {
    const onReply = vi.fn();

    render(
      <CommentsSidebar
        isOpen={true}
        activeThreads={mockThreads}
        resolvedThreads={[]}
        focusedThreadId={null}
        activeTab="active"
        onTabChange={vi.fn()}
        onClose={vi.fn()}
        onFocusThread={vi.fn()}
        onReply={onReply}
        onToggleResolve={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const replyBtn = screen.getByRole('button', { name: /Responder/i });
    fireEvent.click(replyBtn);

    const replyInput = screen.getByPlaceholderText('Escribe una respuesta...');
    fireEvent.change(replyInput, { target: { value: 'Completamente de acuerdo con el análisis' } });

    const submitBtn = replyInput.parentElement?.querySelector('button[type="submit"]');
    expect(submitBtn).toBeInTheDocument();
    fireEvent.click(submitBtn!);

    expect(onReply).toHaveBeenCalledWith(
      'thread-1',
      'Lector',
      'Completamente de acuerdo con el análisis'
    );
  });

  it('debe permitir resolver un hilo de comentarios', () => {
    const onToggleResolve = vi.fn();

    render(
      <CommentsSidebar
        isOpen={true}
        activeThreads={mockThreads}
        resolvedThreads={[]}
        focusedThreadId={null}
        activeTab="active"
        onTabChange={vi.fn()}
        onClose={vi.fn()}
        onFocusThread={vi.fn()}
        onReply={vi.fn()}
        onToggleResolve={onToggleResolve}
        onDelete={vi.fn()}
      />
    );

    const resolveBtn = screen.getByLabelText('Marcar como resuelto');
    fireEvent.click(resolveBtn);

    expect(onToggleResolve).toHaveBeenCalledWith('thread-1');
  });
});

describe('Component: NewCommentModal con rango multiverso interactivo', () => {
  it('debe permitir ajustar el rango de versos y enviar el comentario con el rango final', () => {
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <NewCommentModal
        isOpen={true}
        range={{ start: 2, end: 2 }}
        column="original"
        totalVerses={59}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('Añadir Comentario')).toBeInTheDocument();
    expect(screen.getByText('Verso 2 (Original)')).toBeInTheDocument();

    // Ampliar con botón "+1 verso"
    const addVerseBtn = screen.getByRole('button', { name: /\+1 verso/i });
    fireEvent.click(addVerseBtn);

    expect(screen.getByText('Versos 2 al 3 (Original)')).toBeInTheDocument();
    expect(screen.getByText('2 versos seleccionados')).toBeInTheDocument();

    // Completar autor y comentario
    const authorInput = screen.getByPlaceholderText('Ej. Tiziano');
    fireEvent.change(authorInput, { target: { value: 'Tiziano Espinoza' } });

    const commentInput = screen.getByPlaceholderText(/Escribe tus observaciones/i);
    fireEvent.change(commentInput, { target: { value: 'Análisis detallado de ambos versos' } });

    // Publicar comentario
    const submitBtn = screen.getByRole('button', { name: /Publicar Comentario/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      'Tiziano Espinoza',
      'Análisis detallado de ambos versos',
      { start: 2, end: 3 }
    );
  });
});
