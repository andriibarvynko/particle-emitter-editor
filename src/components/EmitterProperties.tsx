import type { Dispatch } from 'react';
import type { EditorState } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { NumberInput } from './NumberInput';
import { CollapsibleSection } from './CollapsibleSection';
import { SpawnTypeFields } from './SpawnTypeFields';

interface Props {
  config: EditorState;
  dispatch: Dispatch<EditorAction>;
}

export function EmitterProperties({ config, dispatch }: Props) {
  // Map spawn variant to simple type string for the dropdown
  const spawnType = config.spawn.variant === 'spawnShape'
    ? (config.spawn.shape.type === 'torus'
      ? (config.spawn.shape.innerRadius > 0 ? 'ring' : 'circle')
      : config.spawn.shape.type)
    : config.spawn.variant === 'spawnBurst' ? 'burst' : 'point';

  return (
    <CollapsibleSection title="Emitter Properties">
      <div className="form-row">
        <label className="form-label" title="Seconds between spawns">Spawn Frequency</label>
        <div className="form-field">
          <NumberInput value={config.frequency}
            onChange={(v) => dispatch({ type: 'SET_FREQUENCY', frequency: v > 0 ? v : 0.001 })}
            min={0.001} step={0.001} />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Emitter lifetime (-1 = infinite)">Emitter Lifetime</label>
        <div className="form-field">
          <NumberInput value={config.emitterLifetime}
            onChange={(v) => dispatch({ type: 'SET_EMITTER_LIFETIME', emitterLifetime: v })}
            min={-1} step={0.01} />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Max particles alive at once">Max Particles</label>
        <div className="form-field">
          <NumberInput value={config.maxParticles}
            onChange={(v) => dispatch({ type: 'SET_MAX_PARTICLES', maxParticles: Math.max(1, Math.round(v)) })}
            min={1} step={1} />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Particles per spawn wave">Particles/Wave</label>
        <div className="form-field">
          <NumberInput value={config.particlesPerWave}
            onChange={(v) => dispatch({ type: 'SET_PARTICLES_PER_WAVE', particlesPerWave: Math.max(1, Math.round(v)) })}
            min={1} step={1} />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Chance to spawn (0-1)">Spawn Chance</label>
        <div className="form-field">
          <NumberInput value={config.spawnChance}
            onChange={(v) => dispatch({ type: 'SET_SPAWN_CHANCE', spawnChance: Math.max(0, Math.min(1, v)) })}
            min={0} max={1} step={0.01} />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Spawn shape type">Spawn Type</label>
        <div className="form-field">
          <select className="select-input" value={spawnType}
            onChange={(e) => {
              const val = e.target.value;
              switch (val) {
                case 'point':
                  dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnPoint' } });
                  break;
                case 'rect':
                  dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnShape', shape: { type: 'rect', x: 0, y: 0, w: 100, h: 100 } } });
                  break;
                case 'circle':
                  dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnShape', shape: { type: 'torus', x: 0, y: 0, radius: 50, innerRadius: 0, affectRotation: false } } });
                  break;
                case 'ring':
                  dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnShape', shape: { type: 'torus', x: 0, y: 0, radius: 50, innerRadius: 20, affectRotation: true } } });
                  break;
                case 'burst':
                  dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnBurst', spacing: 0, start: 0, distance: 0 } });
                  break;
              }
            }}>
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
        <label className="form-label" title="Spawn position offset">Spawn Position</label>
        <div className="form-field form-field-pair">
          <NumberInput value={config.pos.x} onChange={(v) => dispatch({ type: 'SET_POS', x: v })} tooltip="X" />
          <NumberInput value={config.pos.y} onChange={(v) => dispatch({ type: 'SET_POS', y: v })} tooltip="Y" />
        </div>
      </div>

      <div className="form-row">
        <label className="form-label" title="Add particles to back of display list">Add At Back</label>
        <div className="form-field">
          <input type="checkbox" checked={config.addAtBack}
            onChange={(e) => dispatch({ type: 'SET_ADD_AT_BACK', addAtBack: e.target.checked })} />
        </div>
      </div>
    </CollapsibleSection>
  );
}
