import type { Dispatch } from 'react';
import type { LegacyEmitterConfig } from '../types/config';
import type { ConfigAction } from '../hooks/useEmitterConfig';
import { NumberInput } from './NumberInput';

interface Props {
  config: LegacyEmitterConfig;
  dispatch: Dispatch<ConfigAction>;
}

export function SpawnTypeFields({ config, dispatch }: Props) {
  switch (config.spawnType) {
    case 'rect':
      return (
        <>
          <div className="form-row">
            <label className="form-label" title="Rectangle relative to spawn position">
              Emission Rectangle
            </label>
            <div className="form-field form-field-pair">
              <NumberInput
                value={config.spawnRect?.x ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_RECT', x: v })}
                tooltip="X Position"
              />
              <NumberInput
                value={config.spawnRect?.y ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_RECT', y: v })}
                tooltip="Y Position"
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">&nbsp;</label>
            <div className="form-field form-field-pair">
              <NumberInput
                value={config.spawnRect?.w ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_RECT', w: v })}
                tooltip="Width"
              />
              <NumberInput
                value={config.spawnRect?.h ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_RECT', h: v })}
                tooltip="Height"
              />
            </div>
          </div>
        </>
      );

    case 'circle':
      return (
        <>
          <div className="form-row">
            <label className="form-label" title="Circle relative to spawn position">
              Emission Circle
            </label>
            <div className="form-field form-field-pair">
              <NumberInput
                value={config.spawnCircle?.x ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', x: v })}
                tooltip="X Position"
              />
              <NumberInput
                value={config.spawnCircle?.y ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', y: v })}
                tooltip="Y Position"
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">&nbsp;</label>
            <div className="form-field">
              <NumberInput
                value={config.spawnCircle?.r ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', r: v })}
                min={0}
                tooltip="Radius"
              />
            </div>
          </div>
        </>
      );

    case 'ring':
      return (
        <>
          <div className="form-row">
            <label className="form-label" title="Ring relative to spawn position">
              Emission Ring
            </label>
            <div className="form-field form-field-pair">
              <NumberInput
                value={config.spawnCircle?.x ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', x: v })}
                tooltip="X Position"
              />
              <NumberInput
                value={config.spawnCircle?.y ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', y: v })}
                tooltip="Y Position"
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">&nbsp;</label>
            <div className="form-field form-field-pair">
              <NumberInput
                value={config.spawnCircle?.minR ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', minR: v })}
                min={0}
                tooltip="Minimum Radius"
              />
              <NumberInput
                value={config.spawnCircle?.r ?? 0}
                onChange={(v) => dispatch({ type: 'SET_SPAWN_CIRCLE', r: v })}
                min={0}
                tooltip="Maximum Radius"
              />
            </div>
          </div>
        </>
      );

    case 'burst':
      return (
        <>
          <div className="form-row">
            <label className="form-label" title="Number of particles per burst wave">
              Particles per Wave
            </label>
            <div className="form-field">
              <NumberInput
                value={config.particlesPerWave ?? 1}
                onChange={(v) => dispatch({ type: 'SET_BURST', particlesPerWave: v })}
                min={1}
                step={1}
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" title="Spacing in degrees between particles in a wave">
              Particle Spacing
            </label>
            <div className="form-field">
              <NumberInput
                value={config.particleSpacing ?? 0}
                onChange={(v) => dispatch({ type: 'SET_BURST', particleSpacing: v })}
                min={0}
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" title="Starting angle for each wave">Start Angle</label>
            <div className="form-field">
              <NumberInput
                value={config.angleStart ?? 0}
                onChange={(v) => dispatch({ type: 'SET_BURST', angleStart: v })}
              />
            </div>
          </div>
        </>
      );

    default:
      return null;
  }
}
