import { describe, it, expect } from 'vitest';
import {
  splitLines,
  joinLines,
  alignTranslationToVerses,
  updateTranslationLine,
} from '@/services/poemParser';

describe('Service: poemParser.ts', () => {
  it('debe dividir texto en líneas preservando saltos de línea Windows y Unix', () => {
    const textUnix = 'Línea 1\nLínea 2\nLínea 3';
    expect(splitLines(textUnix)).toEqual(['Línea 1', 'Línea 2', 'Línea 3']);

    const textWindows = 'Línea 1\r\nLínea 2\r\nLínea 3';
    expect(splitLines(textWindows)).toEqual(['Línea 1', 'Línea 2', 'Línea 3']);
  });

  it('debe retornar arreglo vacío ante texto vacío o nulo', () => {
    expect(splitLines('')).toEqual([]);
  });

  it('debe unir líneas con saltos de línea estándar', () => {
    expect(joinLines(['Verso 1', 'Verso 2'])).toBe('Verso 1\nVerso 2');
  });

  it('debe alinear la traducción escrita en el bloc con los versos originales', () => {
    const originalVerses = [
      { id: 1, text: 'When life leaves you high and dry' },
      { id: 2, text: "I'll be at your door tonight" },
      { id: 3, text: 'If you need help, if you need help' },
    ];

    const rawTranslation = 'Cuando la vida te deje desamparado\nEstaré en tu puerta esta noche';
    const aligned = alignTranslationToVerses(originalVerses, rawTranslation);

    expect(aligned).toHaveLength(3);
    expect(aligned[0]).toEqual({
      verseId: 1,
      originalText: 'When life leaves you high and dry',
      translationText: 'Cuando la vida te deje desamparado',
      isStanzaEnd: undefined,
    });
    expect(aligned[1]).toEqual({
      verseId: 2,
      originalText: "I'll be at your door tonight",
      translationText: 'Estaré en tu puerta esta noche',
      isStanzaEnd: undefined,
    });
    // El verso 3 no fue traducido aún -> debe ser string vacío
    expect(aligned[2].translationText).toBe('');
  });

  it('debe actualizar una línea específica y rellenar intermedias si faltan', () => {
    const initialText = 'Línea 1';
    const updated = updateTranslationLine(initialText, 3, 'Línea 3 traducida', 4);
    const lines = splitLines(updated);

    expect(lines[0]).toBe('Línea 1');
    expect(lines[1]).toBe('');
    expect(lines[2]).toBe('Línea 3 traducida');
  });
});
