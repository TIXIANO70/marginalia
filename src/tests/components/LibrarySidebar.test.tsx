import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LibrarySidebar } from '@/components/sidebar/LibrarySidebar';
import { DEFAULT_POEM } from '@/services/defaultPoem';

describe('Component: LibrarySidebar', () => {
  it('debe renderizar la lista de obras y permitir buscar', () => {
    const onSearchChange = vi.fn();
    const onSelectPoem = vi.fn();
    const onOpenNewPoemModal = vi.fn();
    const onToggleStatus = vi.fn();
    const onDeletePoem = vi.fn();

    render(
      <LibrarySidebar
        isOpen={true}
        onClose={vi.fn()}
        poems={[DEFAULT_POEM]}
        activePoemId={DEFAULT_POEM.id}
        searchQuery=""
        onSearchChange={onSearchChange}
        onSelectPoem={onSelectPoem}
        onOpenNewPoemModal={onOpenNewPoemModal}
        onToggleStatus={onToggleStatus}
        onDeletePoem={onDeletePoem}
      />
    );

    expect(screen.getByText('Biblioteca de Letras')).toBeInTheDocument();
    expect(screen.getByText('Gone, Gone, Gone')).toBeInTheDocument();
    expect(screen.getByText('En progreso')).toBeInTheDocument();

    // Pulsar botón de nueva letra
    const newBtn = screen.getByRole('button', { name: /Nueva Letra \/ Canto/i });
    fireEvent.click(newBtn);
    expect(onOpenNewPoemModal).toHaveBeenCalledTimes(1);

    // Alternar estado
    const statusBtn = screen.getByText('En progreso');
    fireEvent.click(statusBtn);
    expect(onToggleStatus).toHaveBeenCalledWith(DEFAULT_POEM.id, 'in-progress');
  });
});
