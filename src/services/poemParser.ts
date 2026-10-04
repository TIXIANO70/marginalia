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

/**
 * Convierte texto plano con posibles saltos estróficos en una entidad PoemDocument válida.
 */
export function parseRawTextToPoemDocument(params: {
  id?: string;
  title: string;
  author: string;
  rawText: string;
  status?: 'in-progress' | 'completed';
  originalLabel?: string;
  translationLabel?: string;
  tags?: string[];
}): import('@/domain/poem').PoemDocument {
  const id = params.id ?? `poem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const cleanTitle = params.title.trim() || 'Sin Título';
  const cleanAuthor = params.author.trim() || 'Desconocido';

  // Dividir por bloques de estrofas (doble salto de línea) o por líneas individuales
  const stanzaBlocks = params.rawText.split(/\n\s*\n/).filter((block) => block.trim().length > 0);
  const blocksToProcess = stanzaBlocks.length > 0 ? stanzaBlocks : [params.rawText];

  let currentVerseId = 1;
  const allVerses: import('@/domain/poem').Verse[] = [];
  const stanzas: import('@/domain/poem').Stanza[] = [];

  blocksToProcess.forEach((block, stanzaIdx) => {
    const rawLines = block.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const stanzaVerses: import('@/domain/poem').Verse[] = [];

    rawLines.forEach((lineText, lineIdx) => {
      const isStanzaEnd = lineIdx === rawLines.length - 1;
      const verse: import('@/domain/poem').Verse = {
        id: currentVerseId++,
        text: lineText,
        stanzaIndex: stanzaIdx,
        isStanzaEnd,
      };
      stanzaVerses.push(verse);
      allVerses.push(verse);
    });

    if (stanzaVerses.length > 0) {
      stanzas.push({
        index: stanzaIdx,
        verses: Object.freeze(stanzaVerses),
      });
    }
  });

  return {
    id,
    title: cleanTitle,
    author: cleanAuthor,
    verses: Object.freeze(allVerses),
    stanzas: Object.freeze(stanzas),
    status: params.status ?? 'in-progress',
    originalLabel: params.originalLabel ?? 'Texto Original (Inglés)',
    translationLabel: params.translationLabel ?? 'Versión en Español',
    tags: Object.freeze(params.tags ?? ['Poesía']),
    updatedAt: new Date().toISOString(),
  };
}
