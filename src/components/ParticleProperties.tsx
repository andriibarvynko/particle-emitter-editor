import type { Dispatch } from 'react';
import type { EditorState } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';
import { CollapsibleSection } from './CollapsibleSection';

interface Props {
  config: EditorState;
  dispatch: Dispatch<EditorAction>;
}

export function ParticleProperties({ config, dispatch }: Props) {
  // Extract values from behavior slots
  const alphaStart = config.alpha.variant === 'alpha' ? config.alpha.alpha.list[0]?.value ?? 1 : config.alpha.variant === 'alphaStatic' ? config.alpha.alpha : 1;
  const alphaEnd = config.alpha.variant === 'alpha' ? config.alpha.alpha.list[config.alpha.alpha.list.length - 1]?.value ?? 1 : alphaStart;

  const scaleStart = config.scale.variant === 'scale' ? config.scale.scale.list[0]?.value ?? 1 : config.scale.variant === 'scaleStatic' ? config.scale.min : 1;
  const scaleEnd = config.scale.variant === 'scale' ? config.scale.scale.list[config.scale.scale.list.length - 1]?.value ?? 1 : config.scale.variant === 'scaleStatic' ? config.scale.max : 1;
  const scaleMinMult = config.scale.variant === 'scale' ? config.scale.minMult : 1;

  const colorStart = config.color.variant === 'color' ? config.color.color.list[0]?.value ?? '#ffffff' : config.color.variant === 'colorStatic' ? config.color.color : '#ffffff';
  const colorEnd = config.color.variant === 'color' ? config.color.color.list[config.color.color.list.length - 1]?.value ?? '#ffffff' : colorStart;

  const speedStart = config.movement.variant === 'moveSpeed' ? config.movement.speed.list[0]?.value ?? 0 : config.movement.variant === 'moveSpeedStatic' ? config.movement.min : config.movement.variant === 'moveAcceleration' ? config.movement.minStart : 0;
  const speedEnd = config.movement.variant === 'moveSpeed' ? config.movement.speed.list[config.movement.speed.list.length - 1]?.value ?? 0 : config.movement.variant === 'moveSpeedStatic' ? config.movement.max : config.movement.variant === 'moveAcceleration' ? config.movement.maxStart : 0;
  const speedMinMult = config.movement.variant === 'moveSpeed' ? config.movement.minMult : 1;

  const accelX = config.movement.variant === 'moveAcceleration' ? config.movement.accel.x : 0;
  const accelY = config.movement.variant === 'moveAcceleration' ? config.movement.accel.y : 0;
  const maxSpeed = config.movement.variant === 'moveAcceleration' ? config.movement.maxSpeed : 0;

  const rotMinStart = config.rotation.variant === 'rotation' ? config.rotation.minStart : config.rotation.variant === 'rotationStatic' ? config.rotation.min : 0;
  const rotMaxStart = config.rotation.variant === 'rotation' ? config.rotation.maxStart : config.rotation.variant === 'rotationStatic' ? config.rotation.max : 0;
  const rotMinSpeed = config.rotation.variant === 'rotation' ? config.rotation.minSpeed : 0;
  const rotMaxSpeed = config.rotation.variant === 'rotation' ? config.rotation.maxSpeed : 0;
  const noRotation = config.rotation.variant === 'noRotation';

  const blendMode = config.blendMode.variant === 'blendMode' ? config.blendMode.blendMode : 'normal';

  // Helpers to dispatch behavior slot updates
  const setAlpha = (start: number, end: number) => {
    if (start === end) {
      dispatch({ type: 'SET_ALPHA', alpha: { variant: 'alphaStatic', alpha: start } });
    } else {
      dispatch({
        type: 'SET_ALPHA',
        alpha: { variant: 'alpha', alpha: { list: [{ value: start, time: 0 }, { value: end, time: 1 }] } },
      });
    }
  };

  const setScale = (start: number, end: number, minMult?: number) => {
    dispatch({
      type: 'SET_SCALE',
      scale: {
        variant: 'scale',
        scale: { list: [{ value: start, time: 0 }, { value: end, time: 1 }] },
        minMult: minMult ?? scaleMinMult,
      },
    });
  };

  const setColor = (start: string, end: string) => {
    if (start === end) {
      dispatch({ type: 'SET_COLOR', color: { variant: 'colorStatic', color: start } });
    } else {
      dispatch({
        type: 'SET_COLOR',
        color: { variant: 'color', color: { list: [{ value: start, time: 0 }, { value: end, time: 1 }] } },
      });
    }
  };

  const setSpeed = (start: number, end: number, minMult?: number) => {
    if (config.movement.variant === 'moveAcceleration') {
      dispatch({
        type: 'SET_MOVEMENT',
        movement: { ...config.movement, minStart: start, maxStart: end },
      });
    } else {
      dispatch({
        type: 'SET_MOVEMENT',
        movement: {
          variant: 'moveSpeed',
          speed: { list: [{ value: start, time: 0 }, { value: end, time: 1 }] },
          minMult: minMult ?? speedMinMult,
        },
      });
    }
  };

  return (
    <CollapsibleSection title="Particle Properties">
      {/* Alpha */}
      <div className="form-row">
        <label className="form-label" title="Transparency from 0 to 1">Alpha Start</label>
        <div className="form-field">
          <input type="range" className="range-input" min={0} max={1} step={0.01} value={alphaStart}
            onChange={(e) => setAlpha(parseFloat(e.target.value), alphaEnd)} />
          <span className="range-value">{alphaStart.toFixed(2)}</span>
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Transparency from 0 to 1">Alpha End</label>
        <div className="form-field">
          <input type="range" className="range-input" min={0} max={1} step={0.01} value={alphaEnd}
            onChange={(e) => setAlpha(alphaStart, parseFloat(e.target.value))} />
          <span className="range-value">{alphaEnd.toFixed(2)}</span>
        </div>
      </div>

      {/* Scale */}
      <div className="form-row">
        <label className="form-label" title="Scale of the particles">Scale</label>
        <div className="form-field form-field-pair">
          <NumberInput value={scaleStart} onChange={(v) => setScale(v, scaleEnd)} min={0.001} step={0.01} tooltip="Starting scale" />
          <NumberInput value={scaleEnd} onChange={(v) => setScale(scaleStart, v)} min={0.001} step={0.01} tooltip="Ending scale" />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Random multiplier for scale variation">Min Scale Mult</label>
        <div className="form-field">
          <NumberInput value={scaleMinMult} onChange={(v) => setScale(scaleStart, scaleEnd, v)} min={0.001} step={0.01} />
        </div>
      </div>

      {/* Color */}
      <div className="form-row">
        <label className="form-label" title="Color tint">Color</label>
        <div className="form-field form-field-pair">
          <ColorPicker value={colorStart} onChange={(v) => setColor(v, colorEnd)} tooltip="Starting color" />
          <ColorPicker value={colorEnd} onChange={(v) => setColor(colorStart, v)} tooltip="Ending color" />
        </div>
      </div>

      {/* Speed */}
      <div className="form-row">
        <label className="form-label" title="Speed of particles">Speed</label>
        <div className="form-field form-field-pair">
          <NumberInput value={speedStart} onChange={(v) => setSpeed(v, speedEnd)} tooltip="Starting speed" />
          <NumberInput value={speedEnd} onChange={(v) => setSpeed(speedStart, v)} tooltip="Ending speed" />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Random multiplier for speed variation">Min Speed Mult</label>
        <div className="form-field">
          <NumberInput value={speedMinMult} onChange={(v) => setSpeed(speedStart, speedEnd, v)} min={0.001} step={0.01} />
        </div>
      </div>

      {/* Acceleration */}
      <div className="form-row">
        <label className="form-label" title="Acceleration of particles">Acceleration</label>
        <div className="form-field form-field-pair">
          <NumberInput value={accelX} onChange={(v) => {
            if (config.movement.variant === 'moveAcceleration') {
              dispatch({ type: 'SET_MOVEMENT', movement: { ...config.movement, accel: { x: v, y: accelY } } });
            } else {
              dispatch({ type: 'SET_MOVEMENT', movement: { variant: 'moveAcceleration', accel: { x: v, y: accelY }, minStart: speedStart, maxStart: speedEnd, rotate: false, maxSpeed: 0 } });
            }
          }} tooltip="X acceleration" />
          <NumberInput value={accelY} onChange={(v) => {
            if (config.movement.variant === 'moveAcceleration') {
              dispatch({ type: 'SET_MOVEMENT', movement: { ...config.movement, accel: { x: accelX, y: v } } });
            } else {
              dispatch({ type: 'SET_MOVEMENT', movement: { variant: 'moveAcceleration', accel: { x: accelX, y: v }, minStart: speedStart, maxStart: speedEnd, rotate: false, maxSpeed: 0 } });
            }
          }} tooltip="Y acceleration" />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Maximum speed for accelerating particles">Max Speed</label>
        <div className="form-field">
          <NumberInput value={maxSpeed} onChange={(v) => {
            if (config.movement.variant === 'moveAcceleration') {
              dispatch({ type: 'SET_MOVEMENT', movement: { ...config.movement, maxSpeed: v } });
            }
          }} />
        </div>
      </div>

      {/* Rotation */}
      <div className="form-row">
        <label className="form-label" title="Starting rotation angle in degrees">Start Rotation</label>
        <div className="form-field form-field-pair">
          <NumberInput value={rotMinStart} onChange={(v) => {
            if (config.rotation.variant === 'rotation') {
              dispatch({ type: 'SET_ROTATION', rotation: { ...config.rotation, minStart: v } });
            } else {
              dispatch({ type: 'SET_ROTATION', rotation: { variant: 'rotationStatic', min: v, max: rotMaxStart } });
            }
          }} tooltip="Min rotation" />
          <NumberInput value={rotMaxStart} onChange={(v) => {
            if (config.rotation.variant === 'rotation') {
              dispatch({ type: 'SET_ROTATION', rotation: { ...config.rotation, maxStart: v } });
            } else {
              dispatch({ type: 'SET_ROTATION', rotation: { variant: 'rotationStatic', min: rotMinStart, max: v } });
            }
          }} tooltip="Max rotation" />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Disable rotation">No Rotation</label>
        <div className="form-field">
          <input type="checkbox" checked={noRotation} onChange={(e) => {
            if (e.target.checked) {
              dispatch({ type: 'SET_ROTATION', rotation: { variant: 'noRotation', rotation: 0 } });
            } else {
              dispatch({ type: 'SET_ROTATION', rotation: { variant: 'rotationStatic', min: 0, max: 360 } });
            }
          }} />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="Rotation speed in degrees/sec">Rotation Speed</label>
        <div className="form-field form-field-pair">
          <NumberInput value={rotMinSpeed} onChange={(v) => {
            const rot = config.rotation.variant === 'rotation' ? config.rotation : { variant: 'rotation' as const, minStart: rotMinStart, maxStart: rotMaxStart, minSpeed: 0, maxSpeed: 0, accel: 0 };
            dispatch({ type: 'SET_ROTATION', rotation: { ...rot, minSpeed: v } });
          }} tooltip="Min speed" />
          <NumberInput value={rotMaxSpeed} onChange={(v) => {
            const rot = config.rotation.variant === 'rotation' ? config.rotation : { variant: 'rotation' as const, minStart: rotMinStart, maxStart: rotMaxStart, minSpeed: 0, maxSpeed: 0, accel: 0 };
            dispatch({ type: 'SET_ROTATION', rotation: { ...rot, maxSpeed: v } });
          }} tooltip="Max speed" />
        </div>
      </div>

      {/* Lifetime */}
      <div className="form-row">
        <label className="form-label" title="Particle lifetime in seconds">Lifetime</label>
        <div className="form-field form-field-pair">
          <NumberInput value={config.lifetime.min} onChange={(v) => dispatch({ type: 'SET_LIFETIME', min: v })} min={0.001} step={0.01} tooltip="Min lifetime" />
          <NumberInput value={config.lifetime.max} onChange={(v) => dispatch({ type: 'SET_LIFETIME', max: v })} min={0.001} step={0.01} tooltip="Max lifetime" />
        </div>
      </div>

      {/* Blend Mode */}
      <div className="form-row">
        <label className="form-label" title="Blend mode">Blend Mode</label>
        <div className="form-field">
          <select className="select-input" value={blendMode}
            onChange={(e) => dispatch({ type: 'SET_BLEND_MODE', blendMode: { variant: 'blendMode', blendMode: e.target.value } })}>
            <option value="normal">Normal</option>
            <option value="add">Add</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>
  );
}
