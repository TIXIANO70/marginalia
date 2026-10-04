/**
 * @file usePoemState.ts
 * @description Hook de gestión de estado para el poema original y la traducción libre del usuario.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { PoemDocument } from '@/domain/poem';
import { DEFAULT_POEM } from '@/services/defaultPoem';
import { alignTranslationToVerses, AlignedVersePair } from '@/services/poemParser';
import { storageService } from '@/services/storageService';

export interface UsePoemStateReturn {
  poem: PoemDocument;
  translation: string;
  setTranslation: (text: string) => void;
  alignedPairs: AlignedVersePair[];
  clearTranslation: () => void;
  isSaving: boolean;
}

export function usePoemState(initialPoem: PoemDocument = DEFAULT_POEM): UsePoemStateReturn {
  const [poem] = useState<PoemDocument>(initialPoem);
  const [translation, setTranslationState] = useState<string>(() => {
    return storageService.getTranslation(initialPoem.id);
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Guardado persistente con debounce de 300ms
  const setTranslation = useCallback((newText: string) => {
    setTranslationState(newText);
    setIsSaving(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      storageService.saveTranslation(poem.id, newText);
      setIsSaving(false);
    }, 300);
  }, [poem.id]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const alignedPairs = useMemo(() => {
    return alignTranslationToVerses(poem.verses, translation);
  }, [poem.verses, translation]);

  const clearTranslation = useCallback(() => {
    setTranslationState('');
    storageService.saveTranslation(poem.id, '');
  }, [poem.id]);

  return {
    poem,
    translation,
    setTranslation,
    alignedPairs,
    clearTranslation,
    isSaving,
  };
}
