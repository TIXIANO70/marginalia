/**
 * @file useLibraryState.ts
 * @description Hook para la gestión del catálogo de letras (ChatGPT/Gemini style sidebar) y estados de progreso.
 */

import { useState, useCallback, useMemo } from 'react';
import { PoemDocument, PoemStatus } from '@/domain/poem';
import { storageService } from '@/services/storageService';
import { parseRawTextToPoemDocument } from '@/services/poemParser';

export interface UseLibraryStateReturn {
  poems: PoemDocument[];
  activePoemId: string;
  activePoem: PoemDocument;
  isLibraryOpen: boolean;
  isNewPoemModalOpen: boolean;
  searchQuery: string;
  filteredPoems: PoemDocument[];

  // Acciones
  selectPoem: (id: string) => void;
  createNewPoem: (params: {
    title: string;
    author: string;
    rawText: string;
    status: PoemStatus;
    originalLabel?: string;
    translationLabel?: string;
    tags?: string[];
  }) => PoemDocument;
  updatePoemStatus: (id: string, status: PoemStatus) => void;
  updatePoemLabels: (id: string, labels: { originalLabel?: string; translationLabel?: string }) => void;
  deletePoem: (id: string) => void;

  // UI state
  setSearchQuery: (query: string) => void;
  setIsLibraryOpen: (isOpen: boolean) => void;
  toggleLibrary: () => void;
  setIsNewPoemModalOpen: (isOpen: boolean) => void;
}

export function useLibraryState(): UseLibraryStateReturn {
  const [poems, setPoems] = useState<PoemDocument[]>(() => {
    return storageService.getAllPoems();
  });

  const [activePoemId, setActivePoemId] = useState<string>(() => {
    return storageService.getActivePoemId();
  });

  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isNewPoemModalOpen, setIsNewPoemModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activePoem = useMemo(() => {
    const found = poems.find((p) => p.id === activePoemId);
    return found ?? poems[0];
  }, [poems, activePoemId]);

  const filteredPoems = useMemo(() => {
    if (!searchQuery.trim()) return poems;
    const query = searchQuery.toLowerCase();
    return poems.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }, [poems, searchQuery]);

  const selectPoem = useCallback((id: string) => {
    setActivePoemId(id);
    storageService.setActivePoemId(id);
  }, []);

  const createNewPoem = useCallback(
    (params: {
      title: string;
      author: string;
      rawText: string;
      status: PoemStatus;
      originalLabel?: string;
      translationLabel?: string;
      tags?: string[];
    }) => {
      const newPoem = parseRawTextToPoemDocument(params);
      storageService.savePoem(newPoem);
      setPoems(storageService.getAllPoems());
      selectPoem(newPoem.id);
      setIsNewPoemModalOpen(false);
      return newPoem;
    },
    [selectPoem]
  );

  const updatePoemStatus = useCallback((id: string, status: PoemStatus) => {
    setPoems((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p));
      const target = updated.find((p) => p.id === id);
      if (target) {
        storageService.savePoem(target);
      }
      return updated;
    });
  }, []);

  const updatePoemLabels = useCallback(
    (id: string, labels: { originalLabel?: string; translationLabel?: string }) => {
      setPoems((prev) => {
        const updated = prev.map((p) => {
          if (p.id !== id) return p;
          return {
            ...p,
            originalLabel: labels.originalLabel ?? p.originalLabel,
            translationLabel: labels.translationLabel ?? p.translationLabel,
            updatedAt: new Date().toISOString(),
          };
        });
        const target = updated.find((p) => p.id === id);
        if (target) {
          storageService.savePoem(target);
        }
        return updated;
      });
    },
    []
  );

  const deletePoem = useCallback(
    (id: string) => {
      storageService.deletePoem(id);
      const remaining = storageService.getAllPoems();
      setPoems(remaining);
      setActivePoemId(storageService.getActivePoemId());
    },
    []
  );

  const toggleLibrary = useCallback(() => {
    setIsLibraryOpen((prev) => !prev);
  }, []);

  return {
    poems,
    activePoemId,
    activePoem,
    isLibraryOpen,
    isNewPoemModalOpen,
    searchQuery,
    filteredPoems,
    selectPoem,
    createNewPoem,
    updatePoemStatus,
    updatePoemLabels,
    deletePoem,
    setSearchQuery,
    setIsLibraryOpen,
    toggleLibrary,
    setIsNewPoemModalOpen,
  };
}
