import type { EditorState, TextureBehavior, AnimConfig } from '../types/editorState';

/**
 * Extracts all texture string references from an EditorState.
 */
export function extractTextureRefs(state: EditorState): string[] {
  const refs: string[] = [];
  collectFromTextureBehavior(state.texture, refs);
  return [...new Set(refs)];
}

function collectFromTextureBehavior(tex: TextureBehavior, refs: string[]): void {
  switch (tex.variant) {
    case 'textureSingle':
      if (tex.texture) refs.push(tex.texture);
      break;
    case 'textureRandom':
    case 'textureOrdered':
      refs.push(...tex.textures.filter(Boolean));
      break;
    case 'animatedSingle':
      refs.push(...tex.anim.textures.filter(Boolean));
      break;
    case 'animatedRandom':
      for (const anim of tex.anims) {
        refs.push(...anim.textures.filter(Boolean));
      }
      break;
  }
}

/**
 * Replaces texture references in an EditorState using a mapping from old name to new URL.
 * Matching is done by filename (basename), so "coin_7.png" matches "/some/path/coin_7.png".
 */
export function replaceTextureRefs(
  state: EditorState,
  urlMap: Map<string, string>,
): EditorState {
  return {
    ...state,
    texture: replaceInTextureBehavior(state.texture, urlMap),
  };
}

function resolveUrl(ref: string, urlMap: Map<string, string>): string {
  // Direct match
  if (urlMap.has(ref)) return urlMap.get(ref)!;
  // Match by basename
  const basename = ref.split('/').pop() ?? ref;
  if (urlMap.has(basename)) return urlMap.get(basename)!;
  return ref;
}

function replaceInTextureBehavior(
  tex: TextureBehavior,
  urlMap: Map<string, string>,
): TextureBehavior {
  switch (tex.variant) {
    case 'textureSingle':
      return { ...tex, texture: resolveUrl(tex.texture, urlMap) };
    case 'textureRandom':
      return { ...tex, textures: tex.textures.map((t) => resolveUrl(t, urlMap)) };
    case 'textureOrdered':
      return { ...tex, textures: tex.textures.map((t) => resolveUrl(t, urlMap)) };
    case 'animatedSingle':
      return { ...tex, anim: replaceInAnimConfig(tex.anim, urlMap) };
    case 'animatedRandom':
      return { ...tex, anims: tex.anims.map((a) => replaceInAnimConfig(a, urlMap)) };
  }
}

function replaceInAnimConfig(anim: AnimConfig, urlMap: Map<string, string>): AnimConfig {
  return { ...anim, textures: anim.textures.map((t) => resolveUrl(t, urlMap)) };
}
