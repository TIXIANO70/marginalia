# 📜 Marginalia

> **A minimalist split-screen parallel reader, translator, and verse annotation workbench for poetry and lyrics.**  
> *Una estación de trabajo minimalista de pantalla dividida para lectura paralela, traducción lírica y anotación de versos estilo Google Docs.*

---

## 🇪🇸 Descripción General

**Marginalia** es una Single Page Application (SPA) inspirada en los manuscritos y códices clásicos, diseñada para escritores, traductores y amantes de la poesía y la música lírica. Permite contrastar un texto poético original frente a su traducción o adaptación en tiempo real, sincronizando visualmente cada verso y permitiendo redactar glosas y comentarios anidados sobre versos específicos.

### ✨ Características Principales

*   **Pantalla Dividida Sincronizada (Split-Screen):**
    *   **Columna Original:** Renderizado lírico centrado con numeración de versos alineada verticalmente al medio de cada estrofa.
    *   **Columna de Traducción:** Editor libre centrado (`text-center`) donde cada salto de línea se alinea con el verso correspondiente.
    *   **Modo Solo Lectura vs. Modo Edición:** Alternancia con un clic para visualizar la traducción como cajas de versos acentuadas con resaltado y hover.
    *   **Titulares Personalizables:** Edición inline tanto del encabezado original como del de traducción (ej. *"Texte Original (Français)"* / *"Traduzione Italiana"*).
    *   **Desplazamiento Suave sin Bloqueos:** Sincronización de scroll bidireccional optimizada con `requestAnimationFrame` que permite recorrer obras completas sin clamping.
*   **Anotación y Glosas (Estilo Google Docs):**
    *   Acceso instantáneo con botón `+` visible en hover al pasar el cursor sobre cualquier verso.
    *   Barra flotante contextual al seleccionar rangos de uno o múltiples versos.
    *   Soporte para comentar tanto en el texto original como en la traducción (en modo lectura).
    *   Panel lateral derecho deslizable con hilos de conversación, respuestas anidadas, resolución y eliminación de comentarios.
    *   Resaltado bidireccional entre las tarjetas de comentarios y los versos líricos.
*   **Biblioteca de Letras (Estilo ChatGPT / Gemini):**
    *   Panel lateral izquierdo deslizable con buscador por título, autor o etiquetas.
    *   Modal `+ Nueva Letra` para cargar nuevas obras poéticas o canciones.
    *   Gestión de estados visuales: 🟢 **Terminado** y 🟠 **... En progreso** con alternancia interactiva inmediata.
*   **Experiencia Tipográfica Cálida:**
    *   Paleta tonal basada en pergamino, marfil (`#FAF7F2`) y acentos ámbar/terracota (`#B45309`).
    *   Selector con 4 tipografías literarias: *Serif Literaria* (Lora), *Serif Clásica* (Playfair Display), *Sans Cálida* (Plus Jakarta Sans) y *Mono Poética* (Space Mono).
    *   Control de escala de fuente (`A-`, `A`, `A+`, `A++`).
*   **Persistencia Local Transparente:**
    *   Almacenamiento automático y seguro en `LocalStorage` con debounce de 300ms y fallback en memoria.

---

## 🇬🇧 Overview

**Marginalia** is a minimalist SPA inspired by ancient manuscripts, built for writers, translators, and poetry lovers. It offers a synchronized split-screen environment to read and translate lyrics side-by-side, while providing rich, contextual verse commenting just like Google Docs.

### ✨ Key Features

*   **Synchronized Dual Pane:** Side-by-side columns with line-by-line sync and vertically centered verse markers.
*   **Dual Mode Translation Column:** Switch effortlessly between **Edit Mode** (freeform notepad) and **Reading Mode** (styled interactive verse boxes).
*   **Inline Editable Column Headers:** Customize both column titles for any language pair (e.g., Latin to English, French to Spanish).
*   **Google Docs Style Annotations:** Hover `+` icon on every verse, floating action bar for multi-verse selection, and sliding comment sidebar with reply threads and resolve status.
*   **Library Drawer:** ChatGPT/Gemini style drawer to manage multiple works, filter by title/tag, and toggle between 🟢 Completed and 🟠 In Progress.
*   **Warm Literary Aesthetics:** Editorial typography palette, four custom literary fonts, and responsive layout.
*   **Local Persistence:** Safe auto-saving via `LocalStorage` with debouncing and memory fallback.

---

## 🛠️ Stack Tecnológico / Tech Stack

*   **Framework UI:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
*   **Bundler & Tooling:** [Vite 6](https://vitejs.dev/)
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Iconos:** [Lucide React](https://lucide.dev/)
*   **Testing:** [Vitest 5](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) + `@vitest/coverage-v8`
*   **Arquitectura:** Clean Architecture (Domain, Services, Custom Hooks, Presentation Components)

---

## 🚀 Instalación y Uso / Getting Started

### Prerrequisitos
*   [Node.js](https://nodejs.org/) $\ge$ 20.x
*   npm $\ge$ 9.x

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/TIXIANO70/marginalia.git
cd marginalia

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`.

---

## 🧪 Pruebas y Calidad / Testing & Code Quality

El proyecto cuenta con una cobertura de pruebas automatizadas superior al **94%** en lógica de estado y dominio, con auditoría de código validada por `code-analyzer` (**Score: 9.67 / 10.0**).

```bash
# Verificación estricta de tipos TypeScript
npm run typecheck

# Ejecutar la suite completa de pruebas unitarias y de integración (38 tests)
npm run test:run

# Generar reporte de cobertura con v8
npm run test:run -- --coverage

# Compilar para producción
npm run build
```

---

## 📁 Arquitectura del Código / Code Architecture

```
src/
├── domain/                  # Entidades y tipos de dominio puros (sin React)
│   ├── poem.ts              # Modelos: Verse, Stanza, PoemDocument, PoemStatus
│   ├── comment.ts           # Modelos: CommentThread, CommentItem, VerseRange
│   └── settings.ts          # Modelos: TypographyConfig (fuentes, tamaños)
├── services/                # Lógica de negocio y persistencia agnóstica
│   ├── storageService.ts    # Persistencia desacoplada con fallback en memoria
│   ├── poemParser.ts        # Parser/sincronizador de versos y saltos de línea
│   └── defaultPoem.ts       # Obra inicial: "Gone, Gone, Gone" (Phillip Phillips)
├── state/                   # Hooks personalizados de gestión de estado
│   ├── useLibraryState.ts   # Catálogo de canciones, estados y modales
│   ├── usePoemState.ts      # Estado de la obra activa y traducción debounced
│   ├── useCommentState.ts   # Hilos de comentarios y soporte dual de columnas
│   └── useReaderSettings.ts # Tipografía, tamaño de letra y scroll
├── components/              # Componentes de presentación desacoplados
│   ├── header/              # Barra superior y selectores tipográficos
│   ├── sidebar/             # Biblioteca de letras (ChatGPT style) y modales
│   ├── splitScreen/         # Columnas Original y Traducción con scroll
│   └── comments/            # Panel lateral y tarjetas estilo Google Docs
└── tests/                   # 12 suites de pruebas (unitarias e integración)
```

---

## 📄 Licencia / License

MIT © [Tiziano Espinoza](https://github.com/TIXIANO70)
