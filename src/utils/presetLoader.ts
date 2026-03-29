import type { EditorState } from '../types/editorState';
import { v1ToEditorState, v3ToEditorState, detectConfigVersion } from './configSerializer';
import { replaceTextureRefs } from './textureResolver';
import { PRESETS, IMAGE_MAP } from '../types/presets';

const cache = new Map<string, EditorState>();

/**
 * Builds a map from bare filenames (e.g. "particle.png") to full URLs
 * for resolving texture references in V3 presets.
 */
function buildTextureUrlMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const [, fullPath] of Object.entries(IMAGE_MAP)) {
    const basename = fullPath.split('/').pop();
    if (basename) {
      map.set(basename, fullPath);
    }
  }
  return map;
}

const textureUrlMap = buildTextureUrlMap();

/**
 * Loads a preset by ID and returns an EditorState.
 * Handles both V1 (legacy) and V3 (behavior-based) preset formats.
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
  const version = detectConfigVersion(raw);

  let state: EditorState;

  if (version === 'v3') {
    state = v3ToEditorState(raw);
    // Resolve bare filenames to full image URLs (for non-spritesheet presets)
    state = replaceTextureRefs(state, textureUrlMap);
  } else {
    const imageUrls = preset.imageIds
      .map((id) => IMAGE_MAP[id])
      .filter((url): url is string => !!url);
    state = v1ToEditorState(raw, imageUrls);
  }

  // Attach spritesheet paths so PixiEditor can pre-load them
  if (preset.spritesheets?.length) {
    state = { ...state, spritesheets: preset.spritesheets };
  }

  cache.set(presetId, state);
  return state;
}
