import type { LegacyEmitterConfig } from '../types/config';

const cache = new Map<string, LegacyEmitterConfig>();

/**
 * Ensures color values have '#' prefix for the color picker UI.
 */
function normalizeColors(config: LegacyEmitterConfig): LegacyEmitterConfig {
  if (!config.color) return config;

  const ensureHash = (c: string) => (c.startsWith('#') ? c : `#${c}`);

  return {
    ...config,
    color: {
      start: ensureHash(config.color.start),
      end: ensureHash(config.color.end),
    },
  };
}

/**
 * Loads a preset emitter config by path. Caches results to avoid re-fetching.
 */
export async function loadPresetConfig(configPath: string): Promise<LegacyEmitterConfig> {
  const cached = cache.get(configPath);
  if (cached) return cached;

  const response = await fetch(configPath);
  if (!response.ok) {
    throw new Error(`Failed to load preset: ${configPath}`);
  }

  const raw = (await response.json()) as LegacyEmitterConfig;
  const config = normalizeColors(raw);
  cache.set(configPath, config);
  return config;
}
