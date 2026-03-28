export type { EmitterConfigV1, EmitterConfigV3, RandNumber, BehaviorEntry } from '@barvynkoa/particle-emitter';

/**
 * The legacy config format used by the editor UI.
 * This matches EmitterConfigV1 from the particle-emitter library.
 * The UI works with this format internally; conversion to V3 happens
 * only when passing to the Emitter via upgradeConfig().
 */
export interface LegacyEmitterConfig {
  alpha: { start: number; end: number };
  scale: { start: number; end: number; minimumScaleMultiplier?: number };
  color: { start: string; end: string };
  speed: { start: number; end: number; minimumSpeedMultiplier?: number };
  acceleration?: { x: number; y: number };
  maxSpeed?: number;
  startRotation: { min: number; max: number };
  noRotation?: boolean;
  rotationSpeed?: { min: number; max: number };
  lifetime: { min: number; max: number };
  blendMode?: string;
  ease?: Array<{ s: number; cp: number; e: number }>;
  extraData?: unknown;
  frequency: number;
  emitterLifetime: number;
  maxParticles: number;
  pos: { x: number; y: number };
  addAtBack: boolean;
  spawnType: 'point' | 'rect' | 'circle' | 'ring' | 'burst';
  spawnRect?: { x: number; y: number; w: number; h: number };
  spawnCircle?: { x: number; y: number; r: number; minR?: number };
  particlesPerWave?: number;
  particleSpacing?: number;
  angleStart?: number;
}

export const DEFAULT_CONFIG: LegacyEmitterConfig = {
  alpha: { start: 1, end: 0 },
  scale: { start: 1, end: 0.3 },
  color: { start: '#ffffff', end: '#ffffff' },
  speed: { start: 200, end: 100 },
  startRotation: { min: 0, max: 360 },
  rotationSpeed: { min: 0, max: 0 },
  lifetime: { min: 0.5, max: 1 },
  frequency: 0.008,
  emitterLifetime: -1,
  maxParticles: 1000,
  pos: { x: 0, y: 0 },
  addAtBack: false,
  spawnType: 'point',
  blendMode: 'normal',
};
