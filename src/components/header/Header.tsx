/**
 * @file Header.tsx
 * @description Barra superior con controles tipográficos, selector de fuentes y acceso al panel de comentarios.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Type,
  MessageSquare,
  SlidersHorizontal,
  RotateCcw,
  Check,
  CheckCircle2,
  PanelLeft,
} from 'lucide-react';
import { FontFamily, FontSize, FONT_OPTIONS, FONT_SIZE_OPTIONS } from '@/domain/settings';

interface HeaderProps {
  title: string;
  author: string;
  fontFamily: FontFamily;
  fontSize: FontSize;
  onFontFamilyChange: (family: FontFamily) => void;
  onFontSizeChange: (size: FontSize) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isLibraryOpen: boolean;
  onToggleLibrary: () => void;
  activeCommentsCount: number;
  isSaving: boolean;
  onResetTranslation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  author,
  fontFamily,
  fontSize,
  onFontFamilyChange,
  onFontSizeChange,
  isSidebarOpen,
  onToggleSidebar,
  isLibraryOpen,
  onToggleLibrary,
  activeCommentsCount,
  isSaving,
  onResetTranslation,
}) => {
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const fontMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target as Node)) {
        setIsFontMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentFont = FONT_OPTIONS.find((f) => f.value === fontFamily) ?? FONT_OPTIONS[0];

  return (
    <header className="sticky top-0 z-30 bg-canto-paper/95 backdrop-blur-sm border-b border-canto-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Toggle Biblioteca y Metadatos de la obra */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Botón de Biblioteca estilo ChatGPT/Gemini */}
          <button
            onClick={onToggleLibrary}
            className={`p-2 rounded-lg border transition shadow-2xs ${
              isLibraryOpen
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-canto-card text-canto-muted hover:text-canto-text border-canto-border hover:bg-amber-50'
            }`}
            title="Alternar biblioteca de letras (sidebar)"
            aria-label="Alternar biblioteca de letras"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-canto-accent flex-shrink-0 shadow-xs hidden sm:flex">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-classic text-xl font-bold tracking-tight text-canto-text truncate">
                Canto
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800 font-medium hidden md:inline">
                Dual
              </span>
            </div>
            <p className="text-xs text-canto-muted truncate">
              {title} <span className="opacity-60">• {author}</span>
            </p>
          </div>
        </div>

        {/* Estado de guardado y Controles Centrales/Derecha */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Indicador de persistencia */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-canto-light">
            {isSaving ? (
              <span className="inline-flex items-center gap-1 text-amber-600 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Guardando...
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-stone-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Guardado
              </span>
            )}
          </div>

          {/* Selector de Tipografía */}
          <div className="relative" ref={fontMenuRef}>
            <button
              onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-canto-border bg-canto-card hover:bg-amber-50/50 text-xs font-medium text-canto-text shadow-xs transition"
              aria-label="Seleccionar tipografía"
              title="Cambiar tipografía"
            >
              <Type className="w-4 h-4 text-canto-accent" />
              <span className="hidden sm:inline">{currentFont.label}</span>
              <SlidersHorizontal className="w-3 h-3 text-canto-muted opacity-60" />
            </button>

            {isFontMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-canto-border bg-canto-card p-2 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-[11px] font-semibold text-canto-muted uppercase tracking-wider px-2 py-1">
                  Tipografía de Lectura
                </div>
                <div className="space-y-1 mt-1">
                  {FONT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onFontFamilyChange(option.value);
                        setIsFontMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition ${
                        fontFamily === option.value
                          ? 'bg-amber-100/70 text-canto-accent font-semibold'
                          : 'hover:bg-amber-50 text-canto-text'
                      }`}
                    >
                      <div>
                        <div>{option.label}</div>
                        <div className="text-[10px] text-canto-muted">{option.description}</div>
                      </div>
                      {fontFamily === option.value && <Check className="w-4 h-4 text-canto-accent" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selector de Tamaño de Fuente */}
          <div className="hidden sm:flex items-center rounded-lg border border-canto-border bg-canto-card p-0.5 shadow-xs">
            {FONT_SIZE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onFontSizeChange(opt.value)}
                className={`px-2 py-1 rounded text-xs font-medium transition ${
                  fontSize === opt.value
                    ? 'bg-amber-100 text-canto-accent shadow-xs'
                    : 'text-canto-muted hover:text-canto-text'
                }`}
                title={`Tamaño ${opt.label}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Botón de Limpiar Traducción */}
          <button
            onClick={() => {
              if (window.confirm('¿Deseas reiniciar la traducción a su estado vacío original?')) {
                onResetTranslation();
              }
            }}
            className="p-2 rounded-lg border border-canto-border bg-canto-card text-canto-muted hover:text-red-700 hover:bg-red-50 transition shadow-xs"
            title="Reiniciar traducción"
            aria-label="Reiniciar traducción"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Botón de Comentarios (Google Docs Style) */}
          <button
            onClick={onToggleSidebar}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition shadow-xs text-xs font-medium ${
              isSidebarOpen
                ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                : 'bg-canto-card text-canto-text border-canto-border hover:bg-amber-50'
            }`}
            aria-label="Alternar panel de comentarios"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comentarios</span>
            {activeCommentsCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSidebarOpen ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {activeCommentsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
