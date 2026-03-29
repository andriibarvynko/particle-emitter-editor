// ─── Value list type (matches library's PropertyNode list format) ───

export interface ValueStep<T> {
  value: T;
  time: number;
}

export interface ValueList<T> {
  list: ValueStep<T>[];
  isStepped?: boolean;
}

// ─── Animated texture config ───

export type AnimFrame = string | { texture: string; count: number };

export interface AnimConfig {
  framerate: number; // -1 = match particle lifetime
  loop: boolean;
  textures: AnimFrame[]; // URLs/asset keys, or objects with repeat count
}

// ─── Behavior category types (discriminated unions) ───

export type TextureBehavior =
  | { variant: 'textureSingle'; texture: string }
  | { variant: 'textureRandom'; textures: string[] }
  | { variant: 'textureOrdered'; textures: string[] }
  | { variant: 'animatedSingle'; anim: AnimConfig }
  | { variant: 'animatedRandom'; anims: AnimConfig[] };

export type AlphaBehavior =
  | { variant: 'alpha'; alpha: ValueList<number> }
  | { variant: 'alphaStatic'; alpha: number }
  | { variant: 'none' };

export type ScaleBehavior =
  | { variant: 'scale'; scale: ValueList<number>; minMult: number }
  | { variant: 'scaleStatic'; min: number; max: number }
  | { variant: 'none' };

export type ColorBehavior =
  | { variant: 'color'; color: ValueList<string> }
  | { variant: 'colorStatic'; color: string }
  | { variant: 'none' };

export type MovementBehavior =
  | { variant: 'moveSpeed'; speed: ValueList<number>; minMult: number }
  | { variant: 'moveSpeedStatic'; min: number; max: number }
  | {
      variant: 'moveAcceleration';
      accel: { x: number; y: number };
      minStart: number;
      maxStart: number;
      rotate: boolean;
      maxSpeed: number;
    }
  | { variant: 'movePath'; path: string; speed: ValueList<number>; minMult: number }
  | { variant: 'none' };

export type RotationBehavior =
  | {
      variant: 'rotation';
      minStart: number;
      maxStart: number;
      minSpeed: number;
      maxSpeed: number;
      accel: number;
    }
  | { variant: 'rotationStatic'; min: number; max: number }
  | { variant: 'noRotation'; rotation: number }
  | { variant: 'none' };

export type SpawnBehavior =
  | { variant: 'spawnPoint' }
  | { variant: 'spawnBurst'; spacing: number; start: number; distance: number }
  | { variant: 'spawnShape'; shape: SpawnShapeConfig };

export type SpawnShapeConfig =
  | { type: 'rect'; x: number; y: number; w: number; h: number }
  | {
      type: 'torus';
      x: number;
      y: number;
      radius: number;
      innerRadius: number;
      affectRotation: boolean;
    }
  | { type: 'polygonalChain'; chains: Array<Array<{ x: number; y: number }>> };

export type BlendModeBehavior =
  | { variant: 'blendMode'; blendMode: string }
  | { variant: 'none' };

// ─── Full editor state ───

export interface EditorState {
  lifetime: { min: number; max: number };
  frequency: number;
  emitterLifetime: number; // -1 = infinite
  maxParticles: number;
  pos: { x: number; y: number };
  addAtBack: boolean;
  particlesPerWave: number;
  spawnChance: number;

  texture: TextureBehavior;
  alpha: AlphaBehavior;
  scale: ScaleBehavior;
  color: ColorBehavior;
  movement: MovementBehavior;
  rotation: RotationBehavior;
  spawn: SpawnBehavior;
  blendMode: BlendModeBehavior;

  /** Spritesheet JSON URLs to pre-load (registers frame names in Assets cache) */
  spritesheets?: string[];
}

export const DEFAULT_EDITOR_STATE: EditorState = {
  lifetime: { min: 0.5, max: 1 },
  frequency: 0.008,
  emitterLifetime: -1,
  maxParticles: 1000,
  pos: { x: 0, y: 0 },
  addAtBack: false,
  particlesPerWave: 1,
  spawnChance: 1,

  texture: { variant: 'textureRandom', textures: [] },
  alpha: {
    variant: 'alpha',
    alpha: { list: [{ value: 1, time: 0 }, { value: 0, time: 1 }] },
  },
  scale: {
    variant: 'scale',
    scale: { list: [{ value: 1, time: 0 }, { value: 0.3, time: 1 }] },
    minMult: 1,
  },
  color: { variant: 'colorStatic', color: '#ffffff' },
  movement: {
    variant: 'moveSpeed',
    speed: { list: [{ value: 200, time: 0 }, { value: 100, time: 1 }] },
    minMult: 1,
  },
  rotation: { variant: 'rotationStatic', min: 0, max: 360 },
  spawn: { variant: 'spawnPoint' },
  blendMode: { variant: 'none' },
};
