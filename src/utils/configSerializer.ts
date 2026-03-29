import { upgradeConfig } from '@barvynkoa/particle-emitter';
import type { EmitterConfigV3, BehaviorEntry } from '@barvynkoa/particle-emitter';
import {
  DEFAULT_EDITOR_STATE,
  type EditorState,
  type AnimConfig,
  type AnimFrame,
  type SpawnShapeConfig,
} from '../types/editorState';

// ─── Color helpers ───

function stripHash(c: string): string {
  return c.startsWith('#') ? c.slice(1) : c;
}

function ensureHash(c: string): string {
  return c.startsWith('#') ? c : `#${c}`;
}

// ─── Format detection ───

export function detectConfigVersion(json: unknown): 'v1' | 'v3' {
  if (typeof json === 'object' && json !== null && 'behaviors' in json) return 'v3';
  return 'v1';
}

// ─── EditorState → EmitterConfigV3 ───

export function editorStateToV3(state: EditorState): EmitterConfigV3 {
  const behaviors: BehaviorEntry[] = [];

  // Texture (required)
  switch (state.texture.variant) {
    case 'textureSingle':
      behaviors.push({ type: 'textureSingle', config: { texture: state.texture.texture } });
      break;
    case 'textureRandom':
      behaviors.push({ type: 'textureRandom', config: { textures: state.texture.textures } });
      break;
    case 'textureOrdered':
      behaviors.push({ type: 'textureOrdered', config: { textures: state.texture.textures } });
      break;
    case 'animatedSingle':
      behaviors.push({
        type: 'animatedSingle',
        config: { anim: serializeAnimConfig(state.texture.anim) },
      });
      break;
    case 'animatedRandom':
      behaviors.push({
        type: 'animatedRandom',
        config: { anims: state.texture.anims.map(serializeAnimConfig) },
      });
      break;
  }

  // Alpha
  if (state.alpha.variant === 'alpha') {
    behaviors.push({ type: 'alpha', config: { alpha: state.alpha.alpha } });
  } else if (state.alpha.variant === 'alphaStatic') {
    behaviors.push({ type: 'alphaStatic', config: { alpha: state.alpha.alpha } });
  }

  // Scale
  if (state.scale.variant === 'scale') {
    behaviors.push({
      type: 'scale',
      config: { scale: state.scale.scale, minMult: state.scale.minMult },
    });
  } else if (state.scale.variant === 'scaleStatic') {
    behaviors.push({
      type: 'scaleStatic',
      config: { min: state.scale.min, max: state.scale.max },
    });
  }

  // Color
  if (state.color.variant === 'color') {
    const colorList = {
      ...state.color.color,
      list: state.color.color.list.map((s) => ({ ...s, value: stripHash(s.value) })),
    };
    behaviors.push({ type: 'color', config: { color: colorList } });
  } else if (state.color.variant === 'colorStatic') {
    behaviors.push({ type: 'colorStatic', config: { color: stripHash(state.color.color) } });
  }

  // Movement
  switch (state.movement.variant) {
    case 'moveSpeed':
      behaviors.push({
        type: 'moveSpeed',
        config: { speed: state.movement.speed, minMult: state.movement.minMult },
      });
      break;
    case 'moveSpeedStatic':
      behaviors.push({
        type: 'moveSpeedStatic',
        config: { min: state.movement.min, max: state.movement.max },
      });
      break;
    case 'moveAcceleration':
      behaviors.push({
        type: 'moveAcceleration',
        config: {
          accel: state.movement.accel,
          minStart: state.movement.minStart,
          maxStart: state.movement.maxStart,
          rotate: state.movement.rotate,
          maxSpeed: state.movement.maxSpeed || undefined,
        },
      });
      break;
    case 'movePath':
      behaviors.push({
        type: 'movePath',
        config: {
          path: state.movement.path,
          speed: state.movement.speed,
          minMult: state.movement.minMult,
        },
      });
      break;
  }

  // Rotation
  switch (state.rotation.variant) {
    case 'rotation':
      behaviors.push({
        type: 'rotation',
        config: {
          minStart: state.rotation.minStart,
          maxStart: state.rotation.maxStart,
          minSpeed: state.rotation.minSpeed,
          maxSpeed: state.rotation.maxSpeed,
          accel: state.rotation.accel,
        },
      });
      break;
    case 'rotationStatic':
      behaviors.push({
        type: 'rotationStatic',
        config: { min: state.rotation.min, max: state.rotation.max },
      });
      break;
    case 'noRotation':
      behaviors.push({
        type: 'noRotation',
        config: { rotation: state.rotation.rotation },
      });
      break;
  }

  // Spawn (required)
  switch (state.spawn.variant) {
    case 'spawnPoint':
      behaviors.push({ type: 'spawnPoint', config: {} });
      break;
    case 'spawnBurst':
      behaviors.push({
        type: 'spawnBurst',
        config: {
          spacing: state.spawn.spacing,
          start: state.spawn.start,
          distance: state.spawn.distance,
        },
      });
      break;
    case 'spawnShape':
      behaviors.push({ type: 'spawnShape', config: serializeSpawnShape(state.spawn.shape) });
      break;
  }

  // Blend mode
  if (state.blendMode.variant === 'blendMode' && state.blendMode.blendMode !== 'normal') {
    behaviors.push({ type: 'blendMode', config: { blendMode: state.blendMode.blendMode } });
  }

  return {
    lifetime: state.lifetime,
    frequency: state.frequency,
    emitterLifetime: state.emitterLifetime <= 0 ? undefined : state.emitterLifetime,
    maxParticles: state.maxParticles,
    pos: state.pos,
    addAtBack: state.addAtBack || undefined,
    particlesPerWave: state.particlesPerWave > 1 ? state.particlesPerWave : undefined,
    spawnChance: state.spawnChance < 1 ? state.spawnChance : undefined,
    behaviors,
  };
}

function serializeAnimConfig(anim: AnimConfig) {
  return {
    framerate: anim.framerate,
    loop: anim.loop,
    textures: anim.textures,
  };
}

function serializeSpawnShape(shape: SpawnShapeConfig) {
  switch (shape.type) {
    case 'rect':
      return { type: 'rect', data: { x: shape.x, y: shape.y, w: shape.w, h: shape.h } };
    case 'torus':
      return {
        type: 'torus',
        data: {
          x: shape.x,
          y: shape.y,
          radius: shape.radius,
          innerRadius: shape.innerRadius,
          affectRotation: shape.affectRotation,
        },
      };
    case 'polygonalChain':
      return { type: 'polygonalChain', data: shape.chains };
  }
}

// ─── EmitterConfigV3 → EditorState ───

export function v3ToEditorState(config: EmitterConfigV3): EditorState {
  const state: EditorState = structuredClone(DEFAULT_EDITOR_STATE);

  // Emitter-level
  state.lifetime = config.lifetime;
  state.frequency = config.frequency;
  state.emitterLifetime = config.emitterLifetime ?? -1;
  state.maxParticles = config.maxParticles ?? 1000;
  state.pos = config.pos ?? { x: 0, y: 0 };
  state.addAtBack = config.addAtBack ?? false;
  state.particlesPerWave = config.particlesPerWave ?? 1;
  state.spawnChance = config.spawnChance ?? 1;

  for (const b of config.behaviors) {
    switch (b.type) {
      // Texture
      case 'textureSingle':
        state.texture = {
          variant: 'textureSingle',
          texture: typeof b.config.texture === 'string' ? b.config.texture : '',
        };
        break;
      case 'textureRandom':
        state.texture = {
          variant: 'textureRandom',
          textures: (b.config.textures ?? []).map((t: unknown) =>
            typeof t === 'string' ? t : '',
          ),
        };
        break;
      case 'textureOrdered':
        state.texture = {
          variant: 'textureOrdered',
          textures: (b.config.textures ?? []).map((t: unknown) =>
            typeof t === 'string' ? t : '',
          ),
        };
        break;
      case 'animatedSingle':
        state.texture = {
          variant: 'animatedSingle',
          anim: parseAnimConfig(b.config.anim),
        };
        break;
      case 'animatedRandom':
        state.texture = {
          variant: 'animatedRandom',
          anims: (b.config.anims ?? []).map(parseAnimConfig),
        };
        break;

      // Alpha
      case 'alpha':
        state.alpha = { variant: 'alpha', alpha: b.config.alpha };
        break;
      case 'alphaStatic':
        state.alpha = { variant: 'alphaStatic', alpha: b.config.alpha };
        break;

      // Scale
      case 'scale':
        state.scale = {
          variant: 'scale',
          scale: b.config.scale,
          minMult: b.config.minMult ?? 1,
        };
        break;
      case 'scaleStatic':
        state.scale = { variant: 'scaleStatic', min: b.config.min, max: b.config.max };
        break;

      // Color
      case 'color':
        state.color = {
          variant: 'color',
          color: {
            ...b.config.color,
            list: b.config.color.list.map((s: { value: string; time: number }) => ({
              ...s,
              value: ensureHash(s.value),
            })),
          },
        };
        break;
      case 'colorStatic':
        state.color = { variant: 'colorStatic', color: ensureHash(b.config.color) };
        break;

      // Movement
      case 'moveSpeed':
        state.movement = {
          variant: 'moveSpeed',
          speed: b.config.speed,
          minMult: b.config.minMult ?? 1,
        };
        break;
      case 'moveSpeedStatic':
        state.movement = {
          variant: 'moveSpeedStatic',
          min: b.config.min,
          max: b.config.max,
        };
        break;
      case 'moveAcceleration':
        state.movement = {
          variant: 'moveAcceleration',
          accel: b.config.accel ?? { x: 0, y: 0 },
          minStart: b.config.minStart ?? 0,
          maxStart: b.config.maxStart ?? 0,
          rotate: b.config.rotate ?? false,
          maxSpeed: b.config.maxSpeed ?? 0,
        };
        break;
      case 'movePath':
        state.movement = {
          variant: 'movePath',
          path: b.config.path ?? '',
          speed: b.config.speed,
          minMult: b.config.minMult ?? 1,
        };
        break;

      // Rotation
      case 'rotation':
        state.rotation = {
          variant: 'rotation',
          minStart: b.config.minStart ?? 0,
          maxStart: b.config.maxStart ?? 0,
          minSpeed: b.config.minSpeed ?? 0,
          maxSpeed: b.config.maxSpeed ?? 0,
          accel: b.config.accel ?? 0,
        };
        break;
      case 'rotationStatic':
        state.rotation = { variant: 'rotationStatic', min: b.config.min ?? 0, max: b.config.max ?? 0 };
        break;
      case 'noRotation':
        state.rotation = { variant: 'noRotation', rotation: b.config.rotation ?? 0 };
        break;

      // Spawn
      case 'spawnPoint':
        state.spawn = { variant: 'spawnPoint' };
        break;
      case 'spawnBurst':
        state.spawn = {
          variant: 'spawnBurst',
          spacing: b.config.spacing ?? 0,
          start: b.config.start ?? 0,
          distance: b.config.distance ?? 0,
        };
        break;
      case 'spawnShape':
        state.spawn = { variant: 'spawnShape', shape: parseSpawnShape(b.config) };
        break;

      // Blend mode
      case 'blendMode':
        state.blendMode = { variant: 'blendMode', blendMode: b.config.blendMode ?? 'normal' };
        break;
    }
  }

  return state;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAnimConfig(raw: any): AnimConfig {
  return {
    framerate: raw?.framerate ?? 24,
    loop: raw?.loop ?? false,
    textures: Array.isArray(raw?.textures)
      ? raw.textures.map((t: unknown) => {
          if (typeof t === 'string') return t;
          if (typeof t === 'object' && t !== null && 'texture' in t) {
            const obj = t as { texture: string; count?: number };
            return obj.count != null ? { texture: obj.texture, count: obj.count } : obj.texture;
          }
          return '';
        }).filter((t: AnimFrame) => t !== '')
      : [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseSpawnShape(raw: any): SpawnShapeConfig {
  const type = raw?.type;
  const data = raw?.data;

  if (type === 'rect') {
    return { type: 'rect', x: data?.x ?? 0, y: data?.y ?? 0, w: data?.w ?? 0, h: data?.h ?? 0 };
  }
  if (type === 'torus') {
    return {
      type: 'torus',
      x: data?.x ?? 0,
      y: data?.y ?? 0,
      radius: data?.radius ?? 0,
      innerRadius: data?.innerRadius ?? 0,
      affectRotation: data?.affectRotation ?? false,
    };
  }
  if (type === 'polygonalChain') {
    const chains = Array.isArray(data)
      ? Array.isArray(data[0]) ? data : [data]
      : [];
    return { type: 'polygonalChain', chains };
  }
  // Default to rect
  return { type: 'rect', x: 0, y: 0, w: 0, h: 0 };
}

// ─── V1 → EditorState ───

export function v1ToEditorState(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any,
  imageUrls: string[],
): EditorState {
  // Normalize V1 colors: strip '#' (upgradeConfig expects bare hex)
  const normalized = { ...config };
  if (normalized.color) {
    normalized.color = {
      start: stripHash(normalized.color.start ?? 'ffffff'),
      end: stripHash(normalized.color.end ?? 'ffffff'),
    };
  }

  const v3 = upgradeConfig(normalized, imageUrls);
  return v3ToEditorState(v3);
}

// ─── Extract texture URLs for pre-loading ───

export function extractTextureUrls(v3: EmitterConfigV3): string[] {
  const urls: string[] = [];

  for (const b of v3.behaviors) {
    switch (b.type) {
      case 'textureSingle':
        if (typeof b.config.texture === 'string') urls.push(b.config.texture);
        break;
      case 'textureRandom':
      case 'textureOrdered':
        for (const t of b.config.textures ?? []) {
          if (typeof t === 'string') urls.push(t);
        }
        break;
      case 'animatedSingle':
        collectAnimTextures(b.config.anim, urls);
        break;
      case 'animatedRandom':
        for (const anim of b.config.anims ?? []) {
          collectAnimTextures(anim, urls);
        }
        break;
    }
  }

  return [...new Set(urls)];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectAnimTextures(anim: any, urls: string[]): void {
  if (!anim?.textures) return;
  for (const t of anim.textures) {
    if (typeof t === 'string') urls.push(t);
    else if (typeof t?.texture === 'string') urls.push(t.texture);
  }
}
