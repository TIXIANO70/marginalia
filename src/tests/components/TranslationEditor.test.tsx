import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { TranslationEditor } from '@/components/splitScreen/TranslationEditor';

describe('Component: TranslationEditor', () => {
  const dummyPairs = [
    {
      verseId: 1,
      originalText: 'When life leaves you high and dry',
      translationText: 'Cuando la vida te deje desamparado',
    },
    {
      verseId: 2,
      originalText: "I'll be at your door tonight",
      translationText: 'Estaré en tu puerta esta noche',
    },
  ];

  it('debe permitir alternar entre Modo Edición y Modo Lectura', () => {
    const dummyRef = { current: document.createElement('div') } as unknown as React.RefObject<HTMLDivElement>;

    render(
      <TranslationEditor
        translation="Cuando la vida te deje desamparado\nEstaré en tu puerta esta noche"
        onChange={vi.fn()}
        alignedPairs={dummyPairs}
        totalVerses={2}
        translationLabel="Versión en Español"
        fontClass="font-literary"
        sizeClasses={{ verse: 'text-base', number: 'text-xs' }}
        scrollRef={dummyRef}
        selectionRange={null}
        isVerseSelected={() => false}
        onSelectVerse={vi.fn()}
        onClearSelection={vi.fn()}
        onOpenNewComment={vi.fn()}
        hasCommentsOnVerse={() => false}
        getCommentsCount={() => 0}
      />
    );

    // En modo edición por defecto: hay un textarea
    expect(screen.getByRole('textbox', { name: /Editor de traducción/i })).toBeInTheDocument();

    // Cambiar a Modo Lectura
    const readModeBtn = screen.getByRole('button', { name: /Lectura/i });
    fireEvent.click(readModeBtn);

    // En modo lectura: el textarea desaparece y se muestran los versos como cajas
    expect(screen.queryByRole('textbox', { name: /Editor de traducción/i })).not.toBeInTheDocument();
    expect(screen.getByText('Cuando la vida te deje desamparado')).toBeInTheDocument();
    expect(screen.getByText('Estaré en tu puerta esta noche')).toBeInTheDocument();
  });

  it('debe permitir editar el título de la columna inline', () => {
    const onUpdateLabel = vi.fn();
    const dummyRef = { current: document.createElement('div') } as unknown as React.RefObject<HTMLDivElement>;

    render(
      <TranslationEditor
        translation=""
        onChange={vi.fn()}
        alignedPairs={dummyPairs}
        totalVerses={2}
        translationLabel="Versión en Español"
        onUpdateLabel={onUpdateLabel}
        fontClass="font-literary"
        sizeClasses={{ verse: 'text-base', number: 'text-xs' }}
        scrollRef={dummyRef}
        selectionRange={null}
        isVerseSelected={() => false}
        onSelectVerse={vi.fn()}
        onClearSelection={vi.fn()}
        onOpenNewComment={vi.fn()}
        hasCommentsOnVerse={() => false}
        getCommentsCount={() => 0}
      />
    );

    // Clic en el título para editarlo
    const titleBtn = screen.getByTitle(/Hacé clic para editar el nombre de la columna/i);
    fireEvent.click(titleBtn);

    const input = screen.getByRole('textbox', { name: /Editar título de columna/i });
    fireEvent.change(input, { target: { value: 'Traducción al Italiano' } });

    const saveBtn = screen.getByLabelText('Guardar título');
    fireEvent.click(saveBtn);

    expect(onUpdateLabel).toHaveBeenCalledWith('Traducción al Italiano');
  });
});
