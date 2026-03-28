# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Particle Emitter Editor — a web-based interactive tool for creating PixiJS particle emitters. Users visually configure particle effects (alpha, scale, color, speed, rotation, spawn shape, etc.) with real-time preview and can export/import configurations as JSON (V1 legacy and V3 behavior-based formats).

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint on `src/` |

## Tech Stack

- **PixiJS v8** — rendering engine (WebGL2/WebGPU, async init, Assets API)
- **@barvynkoa/particle-emitter** — particle system (22 behavior types, `upgradeConfig()` for V1→V3 conversion)
- **React 19** + **TypeScript** — UI framework
- **Vite** — build tool

## Architecture

### Internal format: EditorState with behavior slots

The internal state uses `EditorState` (`src/types/editorState.ts`) with typed behavior slots per category. Each slot is a discriminated union — conflicts between behavior variants are structurally impossible.

```
EditorState = {
  // Emitter-level: lifetime, frequency, maxParticles, pos, addAtBack, particlesPerWave, spawnChance
  // Behavior slots (discriminated unions):
  texture:  textureSingle | textureRandom | textureOrdered | animatedSingle | animatedRandom
  alpha:    alpha (keyframes) | alphaStatic | none
  scale:    scale (keyframes) | scaleStatic | none
  color:    color (keyframes) | colorStatic | none
  movement: moveSpeed | moveSpeedStatic | moveAcceleration | movePath | none
  rotation: rotation | rotationStatic | noRotation | none
  spawn:    spawnPoint | spawnBurst | spawnShape
  blendMode: blendMode | none
}
```

### Data flow

```
UI → dispatch(EditorAction) → useReducer(EditorState)
  → useMemo: editorStateToV3() → EmitterConfigV3
    → PixiEditor.loadConfig(v3Config)
    → localStorage persist
    → export/download
```

Import: V1 JSON → `upgradeConfig()` → V3 → `v3ToEditorState()` → EditorState
Import: V3 JSON → `v3ToEditorState()` → EditorState
Export: EditorState → `editorStateToV3()` → V3 JSON download

### Key source files

- `src/types/editorState.ts` — `EditorState`, all behavior union types, `DEFAULT_EDITOR_STATE`
- `src/utils/configSerializer.ts` — `editorStateToV3()`, `v3ToEditorState()`, `v1ToEditorState()`, `extractTextureUrls()`, `detectConfigVersion()`
- `src/hooks/useEditorState.ts` — `useReducer` with 17 typed actions (SET_STATE + 8 emitter props + 8 behavior slots)
- `src/App.tsx` — Root component: owns EditorState, computes V3 via useMemo, wires PixiEditor
- `src/pixi/PixiEditor.ts` — Pure PixiJS class: accepts `EmitterConfigV3` directly, extracts texture URLs for pre-loading
- `src/pixi/usePixiEditor.ts` — React hook managing PixiEditor lifecycle
- `src/types/presets.ts` — `PRESETS[]`, `IMAGE_MAP` constants

### Color normalization

Library uses bare hex (`"ff0000"`), UI uses `"#ff0000"`. Conversion happens in `configSerializer.ts` at the serialization boundary (`stripHash` / `ensureHash`).

### Key directories

- `public/images/` — 14 particle PNG sprites
- `public/presets/` — 20 preset emitter JSON configs (V1 format, auto-converted on load)
- `src/components/` — React components (form sections, dialogs, reusable inputs)
- `src/hooks/` — State management hooks
- `src/utils/` — Config serializer, file utilities, preset loader

### Data persistence

Native `localStorage` with key `editorState` (JSON-serialized EditorState). Stage color stored separately as `stageColor`. Debounced writes (300ms).
