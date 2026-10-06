/**
 * @file storageService.ts
 * @description Servicio de persistencia desacoplado para LocalStorage con fallback en memoria.
 */

import { PoemDocument } from '@/domain/poem';
import { CommentThread } from '@/domain/comment';
import { ReaderSettings, DEFAULT_READER_SETTINGS } from '@/domain/settings';
import { DEFAULT_POEM } from './defaultPoem';

export interface IStorageBackend {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Fallback en memoria para entornos de testing (Node/jsdom limitado) o modo incógnito restringido.
 */
class InMemoryStorage implements IStorageBackend {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

/**
 * Detecta y obtiene un backend de almacenamiento seguro.
 */
function resolveStorageBackend(): IStorageBackend {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const testKey = '__canto_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    }
  } catch {
    // Si localStorage está bloqueado o da error de seguridad, recurrimos a memoria
  }
  return new InMemoryStorage();
}

export class StorageService {
  private static instance: StorageService;
  private backend: IStorageBackend;
  private readonly PREFIX = 'canto:v1';

  private constructor(backend?: IStorageBackend) {
    this.backend = backend ?? resolveStorageBackend();
  }

  public static getInstance(customBackend?: IStorageBackend): StorageService {
    if (!StorageService.instance || customBackend) {
      StorageService.instance = new StorageService(customBackend);
    }
    return StorageService.instance;
  }

  private getKey(category: string, identifier?: string): string {
    return identifier ? `${this.PREFIX}:${category}:${identifier}` : `${this.PREFIX}:${category}`;
  }

  // --- Traducción libre ---
  public getTranslation(poemId: string): string {
    try {
      const data = this.backend.getItem(this.getKey('translation', poemId));
      return data ?? '';
    } catch {
      return '';
    }
  }

  public saveTranslation(poemId: string, text: string): void {
    try {
      this.backend.setItem(this.getKey('translation', poemId), text);
    } catch (error) {
      console.warn('[StorageService] Error al guardar traducción:', error);
    }
  }

  // --- Hilos de Comentarios ---
  public getComments(poemId: string): CommentThread[] {
    try {
      const raw = this.backend.getItem(this.getKey('comments', poemId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public saveComments(poemId: string, threads: CommentThread[]): void {
    try {
      this.backend.setItem(this.getKey('comments', poemId), JSON.stringify(threads));
    } catch (error) {
      console.warn('[StorageService] Error al guardar comentarios:', error);
    }
  }

  // --- Configuración de Lectura ---
  public getSettings(): ReaderSettings {
    try {
      const raw = this.backend.getItem(this.getKey('settings'));
      if (!raw) return DEFAULT_READER_SETTINGS;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_READER_SETTINGS,
        ...parsed,
      };
    } catch {
      return DEFAULT_READER_SETTINGS;
    }
  }

  public saveSettings(settings: ReaderSettings): void {
    try {
      this.backend.setItem(this.getKey('settings'), JSON.stringify(settings));
    } catch (error) {
      console.warn('[StorageService] Error al guardar configuración:', error);
    }
  }

  // --- Catálogo de Obras (Biblioteca de Letras) ---
  public getAllPoems(): PoemDocument[] {
    try {
      const raw = this.backend.getItem(this.getKey('library'));
      if (!raw) {
        // Inicializar con la obra por defecto directamente sin recursión circular
        this.backend.setItem(this.getKey('library'), JSON.stringify([DEFAULT_POEM]));
        return [DEFAULT_POEM];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [DEFAULT_POEM];
    } catch {
      return [DEFAULT_POEM];
    }
  }

  public savePoem(poem: PoemDocument): void {
    try {
      const poems = this.getAllPoems();
      const existingIndex = poems.findIndex((p) => p.id === poem.id);
      let updated: PoemDocument[];
      if (existingIndex >= 0) {
        updated = [...poems];
        updated[existingIndex] = poem;
      } else {
        updated = [poem, ...poems];
      }
      this.backend.setItem(this.getKey('library'), JSON.stringify(updated));
    } catch (error) {
      console.warn('[StorageService] Error al guardar obra en biblioteca:', error);
    }
  }

  public deletePoem(poemId: string): void {
    try {
      const poems = this.getAllPoems().filter((p) => p.id !== poemId);
      this.backend.setItem(
        this.getKey('library'),
        JSON.stringify(poems.length > 0 ? poems : [DEFAULT_POEM])
      );
      this.clearPoemData(poemId);
      if (this.getActivePoemId() === poemId) {
        this.setActivePoemId(poems.length > 0 ? poems[0].id : DEFAULT_POEM.id);
      }
    } catch (error) {
      console.warn('[StorageService] Error al eliminar obra de biblioteca:', error);
    }
  }

  public getActivePoemId(): string {
    try {
      const activeId = this.backend.getItem(this.getKey('activePoemId'));
      return activeId || DEFAULT_POEM.id;
    } catch {
      return DEFAULT_POEM.id;
    }
  }

  public setActivePoemId(id: string): void {
    try {
      this.backend.setItem(this.getKey('activePoemId'), id);
    } catch (error) {
      console.warn('[StorageService] Error al establecer obra activa:', error);
    }
  }

  // --- Limpieza ---
  public clearPoemData(poemId: string): void {
    try {
      this.backend.removeItem(this.getKey('translation', poemId));
      this.backend.removeItem(this.getKey('comments', poemId));
    } catch (error) {
      console.warn('[StorageService] Error al limpiar datos del poema:', error);
    }
  }
}

export const storageService = StorageService.getInstance();
