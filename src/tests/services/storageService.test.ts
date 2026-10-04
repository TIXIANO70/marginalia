import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService, IStorageBackend } from '@/services/storageService';
import { DEFAULT_READER_SETTINGS } from '@/domain/settings';

class MockStorageBackend implements IStorageBackend {
  private map = new Map<string, string>();

  getItem(key: string): string | null {
    return this.map.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

describe('Service: storageService.ts', () => {
  let backend: MockStorageBackend;
  let service: StorageService;

  beforeEach(() => {
    backend = new MockStorageBackend();
    service = StorageService.getInstance(backend);
  });

  it('debe guardar y recuperar la traducción libre de un poema', () => {
    expect(service.getTranslation('poem-1')).toBe('');
    service.saveTranslation('poem-1', 'Texto traducido');
    expect(service.getTranslation('poem-1')).toBe('Texto traducido');
  });

  it('debe guardar y recuperar hilos de comentarios válidos', () => {
    const threads = [
      {
        id: 't-1',
        verseStart: 1,
        verseEnd: 3,
        resolved: false,
        createdAt: '2026-10-04T00:00:00.000Z',
        comments: [
          {
            id: 'c-1',
            author: 'Tiziano',
            content: 'Test comment',
            createdAt: '2026-10-04T00:00:00.000Z',
          },
        ],
      },
    ];

    service.saveComments('poem-1', threads);
    const recovered = service.getComments('poem-1');
    expect(recovered).toHaveLength(1);
    expect(recovered[0].id).toBe('t-1');
  });

  it('debe guardar y recuperar configuraciones tipográficas', () => {
    expect(service.getSettings()).toEqual(DEFAULT_READER_SETTINGS);

    service.saveSettings({
      fontFamily: 'mono',
      fontSize: 'xl',
      syncScroll: false,
    });

    const recovered = service.getSettings();
    expect(recovered.fontFamily).toBe('mono');
    expect(recovered.fontSize).toBe('xl');
    expect(recovered.syncScroll).toBe(false);
  });

  it('debe limpiar los datos del poema sin afectar otras configuraciones', () => {
    service.saveTranslation('poem-1', 'Verso traducido');
    service.clearPoemData('poem-1');
    expect(service.getTranslation('poem-1')).toBe('');
  });
});
