import { upgradeConfig } from '@barvynkoa/particle-emitter';
import type { EmitterConfigV3 } from '@barvynkoa/particle-emitter';
import type { LegacyEmitterConfig } from '../types/config';

/**
 * Converts the legacy editor config format (V1) + image URLs into the
 * V3 behavior-based format that the Emitter constructor expects.
 */
export function legacyToV3(config: LegacyEmitterConfig, imageUrls: string[]): EmitterConfigV3 {
  // Normalize color values: strip '#' prefix if present (V1 format uses bare hex)
  const normalized = {
    ...config,
    color: config.color
      ? {
          start: config.color.start.replace('#', ''),
          end: config.color.end.replace('#', ''),
        }
      : undefined,
  };

  return upgradeConfig(normalized as Parameters<typeof upgradeConfig>[0], imageUrls);
}
