import type { Dispatch } from 'react';
import type { LegacyEmitterConfig } from '../types/config';
import type { ConfigAction } from '../hooks/useEmitterConfig';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';
import { CollapsibleSection } from './CollapsibleSection';

interface Props {
  config: LegacyEmitterConfig;
  dispatch: Dispatch<ConfigAction>;
}

export function ParticleProperties({ config, dispatch }: Props) {
  return (
    <CollapsibleSection title="Particle Properties">
      {/* Alpha */}
      <div className="form-row">
        <label className="form-label" title="Transparency of the particles from 0 (transparent) to 1 (opaque)">
          Alpha Start
        </label>
        <div className="form-field">
          <input
            type="range"
            className="range-input"
            min={0}
            max={1}
            step={0.01}
            value={config.alpha.start}
            onChange={(e) => dispatch({ type: 'SET_ALPHA', start: parseFloat(e.target.value) })}
          />
          <span className="range-value">{config.alpha.start.toFixed(2)}</span>
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Transparency of the particles from 0 (transparent) to 1 (opaque)">
          Alpha End
        </label>
        <div className="form-field">
          <input
            type="range"
            className="range-input"
            min={0}
            max={1}
            step={0.01}
            value={config.alpha.end}
            onChange={(e) => dispatch({ type: 'SET_ALPHA', end: parseFloat(e.target.value) })}
          />
          <span className="range-value">{config.alpha.end.toFixed(2)}</span>
        </div>
      </div>

      {/* Scale */}
      <div className="form-row">
        <label className="form-label" title="Scale of the particles">Scale</label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.scale.start}
            onChange={(v) => dispatch({ type: 'SET_SCALE', start: v })}
            min={0.001}
            step={0.01}
            tooltip="Starting scale"
          />
          <NumberInput
            value={config.scale.end}
            onChange={(v) => dispatch({ type: 'SET_SCALE', end: v })}
            min={0.001}
            step={0.01}
            tooltip="Ending scale"
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="A value between minimum scale multiplier and 1 is randomly generated and multiplied with start and end scale">
          Min Scale Multiplier
        </label>
        <div className="form-field">
          <NumberInput
            value={config.scale.minimumScaleMultiplier ?? 1}
            onChange={(v) => dispatch({ type: 'SET_SCALE', minimumScaleMultiplier: v })}
            min={0.001}
            step={0.01}
          />
        </div>
      </div>

      {/* Color */}
      <div className="form-row">
        <label className="form-label" title="Color of the particles">Color</label>
        <div className="form-field form-field-pair">
          <ColorPicker
            value={config.color.start}
            onChange={(v) => dispatch({ type: 'SET_COLOR', start: v })}
            tooltip="Starting color"
          />
          <ColorPicker
            value={config.color.end}
            onChange={(v) => dispatch({ type: 'SET_COLOR', end: v })}
            tooltip="Ending color"
          />
        </div>
      </div>

      {/* Speed */}
      <div className="form-row">
        <label className="form-label" title="Speed of the particles">Speed</label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.speed.start}
            onChange={(v) => dispatch({ type: 'SET_SPEED', start: v })}
            tooltip="Starting speed"
          />
          <NumberInput
            value={config.speed.end}
            onChange={(v) => dispatch({ type: 'SET_SPEED', end: v })}
            tooltip="Ending speed"
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="A value between minimum speed multiplier and 1 is randomly generated and multiplied with start and end speed">
          Min Speed Multiplier
        </label>
        <div className="form-field">
          <NumberInput
            value={config.speed.minimumSpeedMultiplier ?? 1}
            onChange={(v) => dispatch({ type: 'SET_SPEED', minimumSpeedMultiplier: v })}
            min={0.001}
            step={0.01}
          />
        </div>
      </div>

      {/* Acceleration */}
      <div className="form-row">
        <label className="form-label" title="Acceleration of particles">Acceleration</label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.acceleration?.x ?? 0}
            onChange={(v) => dispatch({ type: 'SET_ACCELERATION', x: v })}
            tooltip="X acceleration"
          />
          <NumberInput
            value={config.acceleration?.y ?? 0}
            onChange={(v) => dispatch({ type: 'SET_ACCELERATION', y: v })}
            tooltip="Y acceleration"
          />
        </div>
      </div>

      {/* Max Speed */}
      <div className="form-row">
        <label className="form-label" title="Maximum speed for accelerating particles">Maximum Speed</label>
        <div className="form-field">
          <NumberInput
            value={config.maxSpeed ?? 0}
            onChange={(v) => dispatch({ type: 'SET_MAX_SPEED', maxSpeed: v })}
          />
        </div>
      </div>

      {/* Start Rotation */}
      <div className="form-row">
        <label className="form-label" title="Angle at which particles are pointed when emitted in degrees">
          Start Rotation
        </label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.startRotation.min}
            onChange={(v) => dispatch({ type: 'SET_START_ROTATION', min: v })}
            tooltip="Minimum rotation"
          />
          <NumberInput
            value={config.startRotation.max}
            onChange={(v) => dispatch({ type: 'SET_START_ROTATION', max: v })}
            tooltip="Maximum rotation"
          />
        </div>
      </div>

      {/* No Rotation */}
      <div className="form-row">
        <label className="form-label" title="If particles should never rotate">No Rotation</label>
        <div className="form-field">
          <input
            type="checkbox"
            checked={config.noRotation ?? false}
            onChange={(e) => dispatch({ type: 'SET_NO_ROTATION', noRotation: e.target.checked })}
          />
        </div>
      </div>

      {/* Rotation Speed */}
      <div className="form-row">
        <label className="form-label" title="Speed in degrees per second that particles rotate">
          Rotation Speed
        </label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.rotationSpeed?.min ?? 0}
            onChange={(v) => dispatch({ type: 'SET_ROTATION_SPEED', min: v })}
            tooltip="Minimum rotation speed"
          />
          <NumberInput
            value={config.rotationSpeed?.max ?? 0}
            onChange={(v) => dispatch({ type: 'SET_ROTATION_SPEED', max: v })}
            tooltip="Maximum rotation speed"
          />
        </div>
      </div>

      {/* Lifetime */}
      <div className="form-row">
        <label className="form-label" title="Lifetime of each particle in seconds">Lifetime</label>
        <div className="form-field form-field-pair">
          <NumberInput
            value={config.lifetime.min}
            onChange={(v) => dispatch({ type: 'SET_LIFETIME', min: v })}
            min={0.001}
            step={0.01}
            tooltip="Minimum lifetime"
          />
          <NumberInput
            value={config.lifetime.max}
            onChange={(v) => dispatch({ type: 'SET_LIFETIME', max: v })}
            min={0.001}
            step={0.01}
            tooltip="Maximum lifetime"
          />
        </div>
      </div>

      {/* Blend Mode */}
      <div className="form-row">
        <label className="form-label" title="Blend mode of particles">Blend Mode</label>
        <div className="form-field">
          <select
            className="select-input"
            value={config.blendMode ?? 'normal'}
            onChange={(e) => dispatch({ type: 'SET_BLEND_MODE', blendMode: e.target.value })}
          >
            <option value="normal">Normal</option>
            <option value="add">Add</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
          </select>
        </div>
      </div>

      {/* Custom Ease */}
      <div className="form-row">
        <label className="form-label" title="Custom ease as JSON array">Custom Ease</label>
        <div className="form-field">
          <textarea
            className="textarea-input"
            value={config.ease ? JSON.stringify(config.ease) : ''}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) {
                dispatch({ type: 'SET_CUSTOM_EASE', ease: undefined });
                return;
              }
              try {
                const parsed = JSON.parse(val);
                if (Array.isArray(parsed)) {
                  dispatch({ type: 'SET_CUSTOM_EASE', ease: parsed });
                }
              } catch {
                // Ignore invalid JSON while typing
              }
            }}
            rows={2}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}
