# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Particle Emitter Editor — a web-based interactive tool for creating PixiJS particle emitters. Users visually configure particle effects (alpha, scale, color, speed, rotation, spawn shape, etc.) with real-time preview and can export/import configurations as JSON.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint on `src/` |

## Tech Stack

- **PixiJS v8** — rendering engine (WebGL2/WebGPU, async init, Assets API)
- **@barvynkoa/particle-emitter** — particle system (behavior-based config + legacy V1 format support via `upgradeConfig()`)
- **React 19** + **TypeScript** — UI framework
- **Vite** — build tool
- **CSS** — plain CSS (no preprocessor, no modules)

## Architecture

### Config format strategy

The UI works with the **legacy V1 config format** (simple start/end pairs for alpha, scale, color, speed). Conversion to V3 behavior-based format happens only at the rendering boundary via `upgradeConfig()` in `src/utils/configAdapter.ts`. All 20 preset JSON files in `public/presets/` use this V1 format.

### Data flow

```
React form fields → useReducer (LegacyEmitterConfig) → useEffect → PixiEditor.loadConfig()
                                                                          ↓
                                                                    upgradeConfig() → Emitter
```

### Key source files

- `src/App.tsx` — Root component: owns config state, image state, wires PixiEditor to React UI
- `src/pixi/PixiEditor.ts` — Pure PixiJS class (no React): Application init, Emitter lifecycle, mouse tracking, background
- `src/pixi/usePixiEditor.ts` — React hook managing PixiEditor lifecycle, exposes `loadConfig()` and `setBackgroundColor()`
- `src/hooks/useEmitterConfig.ts` — `useReducer` with typed actions for every config property group
- `src/utils/configAdapter.ts` — `legacyToV3()` wraps `upgradeConfig()` from the particle library
- `src/types/config.ts` — `LegacyEmitterConfig` interface + `DEFAULT_CONFIG`
- `src/types/presets.ts` — `PRESETS[]`, `IMAGE_MAP`, `ALL_IMAGE_OPTIONS` constants (compiled from old config.json)

### Key directories

- `public/images/` — 14 particle PNG sprites
- `public/presets/` — 20 preset emitter JSON configs (V1 format)
- `src/components/` — React components (form sections, dialogs, reusable inputs)
- `src/hooks/` — State management hooks
- `src/utils/` — Config adapter, file utilities, preset loader
- `deploy/` — Legacy build output (kept for reference, not used by new build)

### Data persistence

Native `localStorage` with keys: `customConfig`, `customImages`, `stageColor`. Debounced writes (300ms).
