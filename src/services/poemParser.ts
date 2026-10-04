/**
 * @file poemParser.ts
 * @description Funciones de procesamiento de texto, alineación de versos y sincronización de renglones.
 */

export interface AlignedVersePair {
  readonly verseId: number;
  readonly originalText: string;
  readonly translationText: string;
  readonly isStanzaEnd?: boolean;
}

/**
 * Divide un texto en líneas preservando líneas vacías para saltos estróficos.
 */
export function splitLines(text: string): string[] {
  if (!text) return [];
  return text.split(/\r?\n/);
}

/**
 * Une un conjunto de líneas en un único bloque de texto con saltos de línea estándar.
 */
export function joinLines(lines: readonly string[]): string {
  return lines.join('\n');
}

/**
 * Alinea la traducción escrita libremente en el bloc de notas con los versos de la obra original.
 * Cada salto de línea (renglón N) se vincula con el verso N del original.
 */
export function alignTranslationToVerses(
  originalVerses: readonly { id: number; text: string; isStanzaEnd?: boolean }[],
  rawTranslation: string
): AlignedVersePair[] {
  const translationLines = splitLines(rawTranslation);

  return originalVerses.map((verse, index) => {
    const translationText = translationLines[index] ?? '';
    return {
      verseId: verse.id,
      originalText: verse.text,
      translationText,
      isStanzaEnd: verse.isStanzaEnd,
    };
  });
}

/**
 * Actualiza una línea específica de la traducción en base al ID de verso,
 * expandiendo el texto si es necesario.
 */
export function updateTranslationLine(
  currentTranslation: string,
  verseId: number,
  newLineContent: string,
  totalVerses: number
): string {
  const lines = splitLines(currentTranslation);
  const targetIndex = verseId - 1;

  // Rellenar líneas intermedias si el usuario editó una línea más avanzada
  while (lines.length < totalVerses) {
    lines.push('');
  }

  lines[targetIndex] = newLineContent;
  return joinLines(lines);
}
