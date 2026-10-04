/**
 * @file defaultPoem.ts
 * @description Letra original de "Gone, Gone, Gone" (Phillip Phillips) estructurada líricamente.
 */

import { PoemDocument, Verse, Stanza } from '@/domain/poem';

const RAW_STANZA_TEXTS: string[][] = [
  // Estrofa 1 (Verso 1)
  [
    "When life leaves you high and dry",
    "I'll be at your door tonight",
    "If you need help, if you need help",
    "I'll shut down the city lights",
    "I'll lie, cheat, I'll beg and bribe",
    "To make you well, to make you well",
  ],
  // Estrofa 2 (Pre-Chorus)
  [
    "When enemies are at your door",
    "I'll carry you away from more",
    "If you need help, if you need help",
    "Your hope, dangling by a string",
    "I'll share in your suffering",
    "To make you well, to make you well",
  ],
  // Estrofa 3 (Chorus)
  [
    "Give me reasons to believe",
    "That you would do the same for me",
    "And I would do it for you, for you",
    "Baby, I'm not moving on",
    "I'll love you long after you're gone",
    "For you, for you",
    "You will never sleep alone",
    "I'll love you long after you're gone",
    "And long after you're gone, gone, gone",
  ],
  // Estrofa 4 (Verso 2)
  [
    "When you fall like a statue",
    "I'm gon' be there to catch you",
    "Put you on your feet, you on your feet",
    "And if your well is empty",
    "Not a thing will prevent me",
    "Tell me what you need, what do you need",
  ],
  // Estrofa 5 (Chorus)
  [
    "I surrender honestly",
    "You've always done the same for me",
    "So I would do it for you, for you",
    "Baby, I'm not moving on",
    "I'll love you long after you're gone",
    "For you, for you",
    "You will never sleep alone",
    "I'll love you long after you're gone",
    "And long after you're gone, gone, gone",
  ],
  // Estrofa 6 (Bridge)
  [
    "You're my backbone, you're my cornerstone",
    "You're my crutch when my legs stop working",
    "You're my headstart, you're my rugged heart",
    "You're the pulse that I've always needed",
    "Like a drum, baby, don't stop beating",
    "Like a drum, baby, don't stop beating",
    "Like a drum, baby, don't stop beating",
    "Like a drum, my heart never stops beating",
  ],
  // Estrofa 7 (Outro)
  [
    "For you, for you",
    "Baby, I'm not moving on",
    "I'll love you long after you're gone",
    "For you, for you",
    "You will never sleep alone",
    "I'll love you long after you're gone",
    "For you, for you",
    "Baby, I'm not moving on",
    "I'll love you long after you're gone",
    "For you, for you",
    "You will never sleep alone",
    "I'll love you long after you're gone",
    "And long after you're gone, gone, gone",
    "Yeah, long after you're gone, gone, gone",
    "Long after you're gone, gone, gone",
  ],
];

function buildPoemDocument(): PoemDocument {
  let currentVerseId = 1;
  const allVerses: Verse[] = [];
  const stanzas: Stanza[] = [];

  RAW_STANZA_TEXTS.forEach((lines, stanzaIdx) => {
    const stanzaVerses: Verse[] = [];
    lines.forEach((lineText, lineIdx) => {
      const isStanzaEnd = lineIdx === lines.length - 1;
      const verse: Verse = {
        id: currentVerseId++,
        text: lineText,
        stanzaIndex: stanzaIdx,
        isStanzaEnd,
      };
      stanzaVerses.push(verse);
      allVerses.push(verse);
    });

    stanzas.push({
      index: stanzaIdx,
      verses: Object.freeze(stanzaVerses),
    });
  });

  return {
    id: 'gone-gone-gone-phillip-phillips',
    title: 'Gone, Gone, Gone',
    author: 'Phillip Phillips',
    verses: Object.freeze(allVerses),
    stanzas: Object.freeze(stanzas),
    status: 'in-progress',
    originalLabel: 'Texto Original (Inglés)',
    translationLabel: 'Versión en Español',
    tags: Object.freeze(['Canción', 'Folk Rock']),
    updatedAt: new Date().toISOString(),
  };
}

export const DEFAULT_POEM = buildPoemDocument();
