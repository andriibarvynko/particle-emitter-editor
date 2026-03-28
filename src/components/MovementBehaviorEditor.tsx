import type { Dispatch } from 'react';
import type { MovementBehavior } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';
import { ValueListEditor } from './ValueListEditor';
import { NumberInput } from './NumberInput';

interface Props {
  movement: MovementBehavior;
  dispatch: Dispatch<EditorAction>;
}

type Variant = MovementBehavior['variant'];

const VARIANT_LABELS: Record<Variant, string> = {
  moveSpeed: 'Speed (Animated)',
  moveSpeedStatic: 'Speed (Static)',
  moveAcceleration: 'Acceleration',
  movePath: 'Path',
  none: 'None',
};

export function MovementBehaviorEditor({ movement, dispatch }: Props) {
  const set = (m: MovementBehavior) => dispatch({ type: 'SET_MOVEMENT', movement: m });

  const switchVariant = (v: Variant) => {
    switch (v) {
      case 'moveSpeed':
        set({ variant: 'moveSpeed', speed: { list: [{ value: 200, time: 0 }, { value: 100, time: 1 }] }, minMult: 1 });
        break;
      case 'moveSpeedStatic':
        set({ variant: 'moveSpeedStatic', min: 100, max: 200 });
        break;
      case 'moveAcceleration':
        set({ variant: 'moveAcceleration', accel: { x: 0, y: 0 }, minStart: 0, maxStart: 0, rotate: false, maxSpeed: 0 });
        break;
      case 'movePath':
        set({ variant: 'movePath', path: 'sin(x/10) * 20', speed: { list: [{ value: 200, time: 0 }, { value: 100, time: 1 }] }, minMult: 1 });
        break;
      case 'none':
        set({ variant: 'none' });
        break;
    }
  };

  return (
    <CollapsibleSection title="Movement">
      <div className="form-row">
        <label className="form-label">Type</label>
        <div className="form-field">
          <select className="select-input" value={movement.variant} onChange={(e) => switchVariant(e.target.value as Variant)}>
            {Object.entries(VARIANT_LABELS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {movement.variant === 'moveSpeed' && (
        <>
          <ValueListEditor
            list={movement.speed}
            onChange={(list) => set({ ...movement, speed: list })}
            valueLabel="Speed"
            min={0}
          />
          <div className="form-row">
            <label className="form-label">Min Multiplier</label>
            <div className="form-field">
              <NumberInput value={movement.minMult} onChange={(v) => set({ ...movement, minMult: v })} min={0.001} max={1} step={0.01} />
            </div>
          </div>
        </>
      )}

      {movement.variant === 'moveSpeedStatic' && (
        <div className="form-row">
          <label className="form-label">Speed Range</label>
          <div className="form-field form-field-pair">
            <NumberInput value={movement.min} onChange={(v) => set({ ...movement, min: v })} min={0} tooltip="Min speed" />
            <NumberInput value={movement.max} onChange={(v) => set({ ...movement, max: v })} min={0} tooltip="Max speed" />
          </div>
        </div>
      )}

      {movement.variant === 'moveAcceleration' && (
        <>
          <div className="form-row">
            <label className="form-label">Acceleration</label>
            <div className="form-field form-field-pair">
              <NumberInput value={movement.accel.x} onChange={(v) => set({ ...movement, accel: { ...movement.accel, x: v } })} tooltip="X" />
              <NumberInput value={movement.accel.y} onChange={(v) => set({ ...movement, accel: { ...movement.accel, y: v } })} tooltip="Y" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Initial Speed</label>
            <div className="form-field form-field-pair">
              <NumberInput value={movement.minStart} onChange={(v) => set({ ...movement, minStart: v })} min={0} tooltip="Min" />
              <NumberInput value={movement.maxStart} onChange={(v) => set({ ...movement, maxStart: v })} min={0} tooltip="Max" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label">Max Speed</label>
            <div className="form-field">
              <NumberInput value={movement.maxSpeed} onChange={(v) => set({ ...movement, maxSpeed: v })} min={0} tooltip="0 = unlimited" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" title="Auto-rotate particles to match movement direction">Rotate</label>
            <div className="form-field">
              <input type="checkbox" checked={movement.rotate} onChange={(e) => set({ ...movement, rotate: e.target.checked })} />
            </div>
          </div>
        </>
      )}

      {movement.variant === 'movePath' && (
        <>
          <div className="form-row">
            <label className="form-label" title="Math expression: sin(x/10)*20, cos(x/100)*30, pow(x/10,2)/2">Path</label>
            <div className="form-field">
              <input
                type="text"
                className="number-input"
                value={movement.path}
                onChange={(e) => set({ ...movement, path: e.target.value })}
                placeholder="sin(x/10) * 20"
              />
            </div>
          </div>
          <ValueListEditor
            list={movement.speed}
            onChange={(list) => set({ ...movement, speed: list })}
            valueLabel="Speed"
            min={0}
          />
          <div className="form-row">
            <label className="form-label">Min Multiplier</label>
            <div className="form-field">
              <NumberInput value={movement.minMult} onChange={(v) => set({ ...movement, minMult: v })} min={0.001} max={1} step={0.01} />
            </div>
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}
