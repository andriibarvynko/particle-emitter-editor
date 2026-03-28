import type { Dispatch } from 'react';
import type { LegacyEmitterConfig } from '../types/config';
import type { ConfigAction } from '../hooks/useEmitterConfig';
import { NumberInput } from './NumberInput';
import { CollapsibleSection } from './CollapsibleSection';
import { SpawnTypeFields } from './SpawnTypeFields';

interface Props {
  config: LegacyEmitterConfig;
  dispatch: Dispatch<ConfigAction>;
}

export function EmitterProperties({ config, dispatch }: Props) {
  return (
    <CollapsibleSection title="Emitter Properties">
      <div className="form-row">
        <label className="form-label" title="Seconds between each particle being spawned">
          Spawn Frequency
        </label>
        <div className="form-field">
          <NumberInput
            value={config.frequency}
            onChange={(v) => dispatch({ type: 'SET_FREQUENCY', frequency: v > 0 ? v : 0.001 })}
            min={0.001}
            step={0.001}
          />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Emitter lifetime in seconds (-1 for infinite)">
          Emitter Lifetime
        </label>
        <div className="form-field">
          <NumberInput
            value={config.emitterLifetime}
            onChange={(v) => dispatch({ type: 'SET_EMITTER_LIFETIME', emitterLifetime: v })}
            min={-1}
            step={0.01}
          />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Maximum number of particles alive at once">
          Max Particles
        </label>
        <div className="form-field">
          <NumberInput
            value={config.maxParticles}
            onChange={(v) =>
              dispatch({ type: 'SET_MAX_PARTICLES', maxParticles: Math.max(1, Math.round(v)) })
            }
            min={1}
            step={1}
          />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Spawn shape type">Spawn Type</label>
        <div className="form-field">
          <select
            className="select-input"
            value={config.spawnType}
            onChange={(e) =>
              dispatch({
                type: 'SET_SPAWN_TYPE',
                spawnType: e.target.value as LegacyEmitterConfig['spawnType'],
              })
            }
          >
            <option value="point">Point</option>
            <option value="rect">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="ring">Ring</option>
            <option value="burst">Burst</option>
          </select>
        </div>
      </div>

      <SpawnTypeFields config={config} dispatch={dispatch} />

      <div className="form-row">
        <label className="form-label" title="Position relative to the emitter's owner">
          Spawn Position
        </label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.pos.x}
            onChange={(v) => dispatch({ type: 'SET_SPAWN_POS', x: v })}
            tooltip="X Position"
          />
          <NumberInput
            value={config.pos.y}
            onChange={(v) => dispatch({ type: 'SET_SPAWN_POS', y: v })}
            tooltip="Y Position"
          />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Add particles to the back of the display list">
          Add At Back
        </label>
        <div className="form-field">
          <input
            type="checkbox"
            checked={config.addAtBack}
            onChange={(e) => dispatch({ type: 'SET_ADD_AT_BACK', addAtBack: e.target.checked })}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
