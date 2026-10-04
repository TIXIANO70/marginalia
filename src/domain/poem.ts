/**
 * @file poem.ts
 * @description Modelos de dominio puros para poemas, versos y estrofas.
 */

export interface Verse {
  /** Número de verso ordinal (1-indexed) */
  readonly id: number;
  /** Contenido lírico del verso */
  readonly text: string;
  /** Índice de la estrofa a la que pertenece (0-indexed) */
  readonly stanzaIndex: number;
  /** Indica si es la última línea de una estrofa (para separación visual) */
  readonly isStanzaEnd?: boolean;
}

export interface Stanza {
  /** Índice de la estrofa (0-indexed) */
  readonly index: number;
  /** Versos que componen la estrofa */
  readonly verses: readonly Verse[];
}

export interface PoemDocument {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly verses: readonly Verse[];
  readonly stanzas: readonly Stanza[];
}
