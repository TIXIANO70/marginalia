import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';
import { storageService } from '@/services/storageService';

describe('Component: Canto App Integration', () => {
  beforeEach(() => {
    storageService.clearPoemData('gone-gone-gone-phillip-phillips');
  });

  it('debe renderizar la cabecera con el título de la canción y el autor', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Canto/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Gone, Gone, Gone/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Phillip Phillips/i)[0]).toBeInTheDocument();
  });

  it('debe renderizar los primeros versos en la columna izquierda y el editor libre a la derecha', () => {
    render(<App />);

    // Verificación de versos del poema original
    expect(screen.getByText('When life leaves you high and dry')).toBeInTheDocument();
    expect(screen.getByText("I'll be at your door tonight")).toBeInTheDocument();

    // Verificación de la columna derecha vacía de base
    const textarea = screen.getByRole('textbox', { name: /Editor de traducción/i }) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('');
  });

  it('debe permitir escribir en el editor de traducción y actualizar su valor', () => {
    render(<App />);

    const textarea = screen.getByRole('textbox', { name: /Editor de traducción/i }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'Cuando la vida te deje desamparado' } });

    expect(textarea.value).toBe('Cuando la vida te deje desamparado');
  });

  it('debe permitir seleccionar un verso y abrir el diálogo de comentarios', () => {
    render(<App />);

    const firstVerse = screen.getByText('When life leaves you high and dry');
    fireEvent.click(firstVerse);

    // Debe aparecer el botón flotante "+ Comentar"
    const commentButton = screen.getByRole('button', { name: /^Comentar$/i });
    expect(commentButton).toBeInTheDocument();

    // Al hacer clic, se abre el modal
    fireEvent.click(commentButton);
    expect(screen.getByRole('heading', { name: /Añadir Comentario/i })).toBeInTheDocument();

    // Redactar y publicar
    const contentInput = screen.getByPlaceholderText(/Escribe tus observaciones/i);
    fireEvent.change(contentInput, { target: { value: 'Metáfora sobre la fidelidad absoluta.' } });

    const submitBtn = screen.getByRole('button', { name: /Publicar Comentario/i });
    fireEvent.click(submitBtn);

    // Verificar que el comentario aparece en el panel lateral
    expect(screen.getByText('Metáfora sobre la fidelidad absoluta.')).toBeInTheDocument();
    expect(screen.getByText('Verso 1')).toBeInTheDocument();
  });
});
