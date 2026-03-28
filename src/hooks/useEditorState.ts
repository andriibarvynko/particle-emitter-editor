import { useReducer } from 'react';
import {
  DEFAULT_EDITOR_STATE,
  type EditorState,
  type TextureBehavior,
  type AlphaBehavior,
  type ScaleBehavior,
  type ColorBehavior,
  type MovementBehavior,
  type RotationBehavior,
  type SpawnBehavior,
  type BlendModeBehavior,
} from '../types/editorState';

export type EditorAction =
  | { type: 'SET_STATE'; state: EditorState }
  | { type: 'SET_LIFETIME'; min?: number; max?: number }
  | { type: 'SET_FREQUENCY'; frequency: number }
  | { type: 'SET_EMITTER_LIFETIME'; emitterLifetime: number }
  | { type: 'SET_MAX_PARTICLES'; maxParticles: number }
  | { type: 'SET_POS'; x?: number; y?: number }
  | { type: 'SET_ADD_AT_BACK'; addAtBack: boolean }
  | { type: 'SET_PARTICLES_PER_WAVE'; particlesPerWave: number }
  | { type: 'SET_SPAWN_CHANCE'; spawnChance: number }
  | { type: 'SET_TEXTURE'; texture: TextureBehavior }
  | { type: 'SET_ALPHA'; alpha: AlphaBehavior }
  | { type: 'SET_SCALE'; scale: ScaleBehavior }
  | { type: 'SET_COLOR'; color: ColorBehavior }
  | { type: 'SET_MOVEMENT'; movement: MovementBehavior }
  | { type: 'SET_ROTATION'; rotation: RotationBehavior }
  | { type: 'SET_SPAWN'; spawn: SpawnBehavior }
  | { type: 'SET_BLEND_MODE'; blendMode: BlendModeBehavior };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_STATE':
      return action.state;
    case 'SET_LIFETIME':
      return {
        ...state,
        lifetime: {
          min: action.min ?? state.lifetime.min,
          max: action.max ?? state.lifetime.max,
        },
      };
    case 'SET_FREQUENCY':
      return { ...state, frequency: action.frequency };
    case 'SET_EMITTER_LIFETIME':
      return { ...state, emitterLifetime: action.emitterLifetime };
    case 'SET_MAX_PARTICLES':
      return { ...state, maxParticles: action.maxParticles };
    case 'SET_POS':
      return { ...state, pos: { x: action.x ?? state.pos.x, y: action.y ?? state.pos.y } };
    case 'SET_ADD_AT_BACK':
      return { ...state, addAtBack: action.addAtBack };
    case 'SET_PARTICLES_PER_WAVE':
      return { ...state, particlesPerWave: action.particlesPerWave };
    case 'SET_SPAWN_CHANCE':
      return { ...state, spawnChance: action.spawnChance };
    case 'SET_TEXTURE':
      return { ...state, texture: action.texture };
    case 'SET_ALPHA':
      return { ...state, alpha: action.alpha };
    case 'SET_SCALE':
      return { ...state, scale: action.scale };
    case 'SET_COLOR':
      return { ...state, color: action.color };
    case 'SET_MOVEMENT':
      return { ...state, movement: action.movement };
    case 'SET_ROTATION':
      return { ...state, rotation: action.rotation };
    case 'SET_SPAWN':
      return { ...state, spawn: action.spawn };
    case 'SET_BLEND_MODE':
      return { ...state, blendMode: action.blendMode };
    default:
      return state;
  }
}

export function useEditorState(initial?: EditorState) {
  return useReducer(editorReducer, initial ?? DEFAULT_EDITOR_STATE);
}
