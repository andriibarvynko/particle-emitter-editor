import type { EditorState } from '../types/editorState';
import { v1ToEditorState } from './configSerializer';
import { PRESETS, IMAGE_MAP } from '../types/presets';

const cache = new Map<string, EditorState>();

/**
 * Loads a preset by ID and returns an EditorState.
 * V1 preset configs are auto-converted via upgradeConfig → v3ToEditorState.
 */
export async function loadPreset(presetId: string): Promise<EditorState | null> {
  const preset = PRESETS.find((p) => p.id === presetId);
  if (!preset) return null;

  const cached = cache.get(presetId);
  if (cached) return cached;

  const response = await fetch(preset.configPath);
  if (!response.ok) {
    throw new Error(`Failed to load preset: ${preset.configPath}`);
  }

  const raw = await response.json();

  // Resolve image URLs from preset's imageIds
  const imageUrls = preset.imageIds
    .map((id) => IMAGE_MAP[id])
    .filter((url): url is string => !!url);

  const state = v1ToEditorState(raw, imageUrls);
  cache.set(presetId, state);
  return state;
}
