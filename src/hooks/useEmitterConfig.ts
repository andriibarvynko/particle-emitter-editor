import { useReducer } from 'react';
import { DEFAULT_CONFIG, type LegacyEmitterConfig } from '../types/config';

export type ConfigAction =
  | { type: 'SET_FULL_CONFIG'; config: LegacyEmitterConfig }
  | { type: 'SET_ALPHA'; start?: number; end?: number }
  | {
      type: 'SET_SCALE';
      start?: number;
      end?: number;
      minimumScaleMultiplier?: number;
    }
  | { type: 'SET_COLOR'; start?: string; end?: string }
  | {
      type: 'SET_SPEED';
      start?: number;
      end?: number;
      minimumSpeedMultiplier?: number;
    }
  | { type: 'SET_ACCELERATION'; x?: number; y?: number }
  | { type: 'SET_MAX_SPEED'; maxSpeed: number }
  | { type: 'SET_START_ROTATION'; min?: number; max?: number }
  | { type: 'SET_NO_ROTATION'; noRotation: boolean }
  | { type: 'SET_ROTATION_SPEED'; min?: number; max?: number }
  | { type: 'SET_LIFETIME'; min?: number; max?: number }
  | { type: 'SET_BLEND_MODE'; blendMode: string }
  | { type: 'SET_CUSTOM_EASE'; ease: LegacyEmitterConfig['ease'] | undefined }
  | { type: 'SET_EXTRA_DATA'; extraData: unknown | undefined }
  | { type: 'SET_FREQUENCY'; frequency: number }
  | { type: 'SET_EMITTER_LIFETIME'; emitterLifetime: number }
  | { type: 'SET_MAX_PARTICLES'; maxParticles: number }
  | { type: 'SET_SPAWN_POS'; x?: number; y?: number }
  | { type: 'SET_ADD_AT_BACK'; addAtBack: boolean }
  | { type: 'SET_SPAWN_TYPE'; spawnType: LegacyEmitterConfig['spawnType'] }
  | { type: 'SET_SPAWN_RECT'; x?: number; y?: number; w?: number; h?: number }
  | {
      type: 'SET_SPAWN_CIRCLE';
      x?: number;
      y?: number;
      r?: number;
      minR?: number;
    }
  | { type: 'SET_BURST'; particlesPerWave?: number; particleSpacing?: number; angleStart?: number };

function configReducer(state: LegacyEmitterConfig, action: ConfigAction): LegacyEmitterConfig {
  switch (action.type) {
    case 'SET_FULL_CONFIG':
      return action.config;

    case 'SET_ALPHA':
      return {
        ...state,
        alpha: {
          start: action.start ?? state.alpha.start,
          end: action.end ?? state.alpha.end,
        },
      };

    case 'SET_SCALE':
      return {
        ...state,
        scale: {
          start: action.start ?? state.scale.start,
          end: action.end ?? state.scale.end,
          minimumScaleMultiplier:
            action.minimumScaleMultiplier ?? state.scale.minimumScaleMultiplier,
        },
      };

    case 'SET_COLOR':
      return {
        ...state,
        color: {
          start: action.start ?? state.color.start,
          end: action.end ?? state.color.end,
        },
      };

    case 'SET_SPEED':
      return {
        ...state,
        speed: {
          start: action.start ?? state.speed.start,
          end: action.end ?? state.speed.end,
          minimumSpeedMultiplier:
            action.minimumSpeedMultiplier ?? state.speed.minimumSpeedMultiplier,
        },
      };

    case 'SET_ACCELERATION':
      return {
        ...state,
        acceleration: {
          x: action.x ?? state.acceleration?.x ?? 0,
          y: action.y ?? state.acceleration?.y ?? 0,
        },
      };

    case 'SET_MAX_SPEED':
      return { ...state, maxSpeed: action.maxSpeed };

    case 'SET_START_ROTATION':
      return {
        ...state,
        startRotation: {
          min: action.min ?? state.startRotation.min,
          max: action.max ?? state.startRotation.max,
        },
      };

    case 'SET_NO_ROTATION':
      return { ...state, noRotation: action.noRotation };

    case 'SET_ROTATION_SPEED':
      return {
        ...state,
        rotationSpeed: {
          min: action.min ?? state.rotationSpeed?.min ?? 0,
          max: action.max ?? state.rotationSpeed?.max ?? 0,
        },
      };

    case 'SET_LIFETIME':
      return {
        ...state,
        lifetime: {
          min: action.min ?? state.lifetime.min,
          max: action.max ?? state.lifetime.max,
        },
      };

    case 'SET_BLEND_MODE':
      return { ...state, blendMode: action.blendMode };

    case 'SET_CUSTOM_EASE':
      return { ...state, ease: action.ease };

    case 'SET_EXTRA_DATA':
      return { ...state, extraData: action.extraData };

    case 'SET_FREQUENCY':
      return { ...state, frequency: action.frequency };

    case 'SET_EMITTER_LIFETIME':
      return { ...state, emitterLifetime: action.emitterLifetime };

    case 'SET_MAX_PARTICLES':
      return { ...state, maxParticles: action.maxParticles };

    case 'SET_SPAWN_POS':
      return {
        ...state,
        pos: {
          x: action.x ?? state.pos.x,
          y: action.y ?? state.pos.y,
        },
      };

    case 'SET_ADD_AT_BACK':
      return { ...state, addAtBack: action.addAtBack };

    case 'SET_SPAWN_TYPE':
      return { ...state, spawnType: action.spawnType };

    case 'SET_SPAWN_RECT':
      return {
        ...state,
        spawnRect: {
          x: action.x ?? state.spawnRect?.x ?? 0,
          y: action.y ?? state.spawnRect?.y ?? 0,
          w: action.w ?? state.spawnRect?.w ?? 0,
          h: action.h ?? state.spawnRect?.h ?? 0,
        },
      };

    case 'SET_SPAWN_CIRCLE':
      return {
        ...state,
        spawnCircle: {
          x: action.x ?? state.spawnCircle?.x ?? 0,
          y: action.y ?? state.spawnCircle?.y ?? 0,
          r: action.r ?? state.spawnCircle?.r ?? 0,
          minR: action.minR ?? state.spawnCircle?.minR ?? 0,
        },
      };

    case 'SET_BURST':
      return {
        ...state,
        particlesPerWave: action.particlesPerWave ?? state.particlesPerWave ?? 1,
        particleSpacing: action.particleSpacing ?? state.particleSpacing ?? 0,
        angleStart: action.angleStart ?? state.angleStart ?? 0,
      };

    default:
      return state;
  }
}

export function useEmitterConfig(initialConfig?: LegacyEmitterConfig) {
  return useReducer(configReducer, initialConfig ?? DEFAULT_CONFIG);
}
