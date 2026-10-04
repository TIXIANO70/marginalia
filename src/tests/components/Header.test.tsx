import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/header/Header';

describe('Component: Header', () => {
  it('debe renderizar título, autor y botones de control', () => {
    const onFontFamilyChange = vi.fn();
    const onFontSizeChange = vi.fn();
    const onToggleSidebar = vi.fn();
    const onResetTranslation = vi.fn();

    render(
      <Header
        title="Gone, Gone, Gone"
        author="Phillip Phillips"
        fontFamily="serif-literary"
        fontSize="base"
        onFontFamilyChange={onFontFamilyChange}
        onFontSizeChange={onFontSizeChange}
        isSidebarOpen={false}
        onToggleSidebar={onToggleSidebar}
        activeCommentsCount={2}
        isSaving={false}
        onResetTranslation={onResetTranslation}
      />
    );

    expect(screen.getByText('Gone, Gone, Gone')).toBeInTheDocument();
    expect(screen.getByText(/Phillip Phillips/i)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('debe abrir el menú de fuentes y permitir cambiar de tipografía', () => {
    const onFontFamilyChange = vi.fn();

    render(
      <Header
        title="Gone, Gone, Gone"
        author="Phillip Phillips"
        fontFamily="serif-literary"
        fontSize="base"
        onFontFamilyChange={onFontFamilyChange}
        onFontSizeChange={vi.fn()}
        isSidebarOpen={false}
        onToggleSidebar={vi.fn()}
        activeCommentsCount={0}
        isSaving={false}
        onResetTranslation={vi.fn()}
      />
    );

    const fontDropdownBtn = screen.getByLabelText('Seleccionar tipografía');
    fireEvent.click(fontDropdownBtn);

    // Debe mostrar las opciones de fuentes
    const playfairOption = screen.getByText('Serif Clásica');
    fireEvent.click(playfairOption);

    expect(onFontFamilyChange).toHaveBeenCalledWith('serif-classic');
  });

  it('debe alternar el panel de comentarios al presionar el botón de comentarios', () => {
    const onToggleSidebar = vi.fn();

    render(
      <Header
        title="Gone, Gone, Gone"
        author="Phillip Phillips"
        fontFamily="serif-literary"
        fontSize="base"
        onFontFamilyChange={vi.fn()}
        onFontSizeChange={vi.fn()}
        isSidebarOpen={false}
        onToggleSidebar={onToggleSidebar}
        activeCommentsCount={0}
        isSaving={false}
        onResetTranslation={vi.fn()}
      />
    );

    const sidebarBtn = screen.getByLabelText('Alternar panel de comentarios');
    fireEvent.click(sidebarBtn);

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});
