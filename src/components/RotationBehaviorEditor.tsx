import type { Dispatch } from 'react';
import type { RotationBehavior } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';
import { NumberInput } from './NumberInput';

interface Props {
  rotation: RotationBehavior;
  dispatch: Dispatch<EditorAction>;
}

type Variant = RotationBehavior['variant'];

const VARIANT_LABELS: Record<Variant, string> = {
  rotation: 'Dynamic',
  rotationStatic: 'Static',
  noRotation: 'No Rotation',
  none: 'None',
};

export function RotationBehaviorEditor({ rotation, dispatch }: Props) {
  const set = (r: RotationBehavior) => dispatch({ type: 'SET_ROTATION', rotation: r });

  const switchVariant = (v: Variant) => {
    switch (v) {
      case 'rotation':
        set({ variant: 'rotation', minStart: 0, maxStart: 360, minSpeed: 0, maxSpeed: 0, accel: 0 });
        break;
      case 'rotationStatic':
        set({ variant: 'rotationStatic', min: 0, max: 360 });
        break;
      case 'noRotation':
        set({ variant: 'noRotation', rotation: 0 });
        break;
      case 'none':
        set({ variant: 'none' });
        break;
    }
  };

  return (
    <CollapsibleSection title="Rotation">
      <div className="form-row">
        <label className="form-label">Type</label>
        <div className="form-field">
          <select className="select-input" value={rotation.variant} onChange={(e) => switchVariant(e.target.value as Variant)}>
            {Object.entries(VARIANT_LABELS).map(([k, label]) => (
              <option key={k} value={k}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {rotation.variant === 'rotation' && (
        <>
          <div className="form-row">
            <label className="form-label" title="Initial rotation angle range in degrees">Start Angle</label>
            <div className="form-field form-field-pair">
              <NumberInput value={rotation.minStart} onChange={(v) => set({ ...rotation, minStart: v })} tooltip="Min" />
              <NumberInput value={rotation.maxStart} onChange={(v) => set({ ...rotation, maxStart: v })} tooltip="Max" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" title="Rotation speed in degrees/sec">Speed</label>
            <div className="form-field form-field-pair">
              <NumberInput value={rotation.minSpeed} onChange={(v) => set({ ...rotation, minSpeed: v })} tooltip="Min" />
              <NumberInput value={rotation.maxSpeed} onChange={(v) => set({ ...rotation, maxSpeed: v })} tooltip="Max" />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label" title="Rotational acceleration in degrees/sec²">Acceleration</label>
            <div className="form-field">
              <NumberInput value={rotation.accel} onChange={(v) => set({ ...rotation, accel: v })} />
            </div>
          </div>
        </>
      )}

      {rotation.variant === 'rotationStatic' && (
        <div className="form-row">
          <label className="form-label" title="Random angle range in degrees">Angle Range</label>
          <div className="form-field form-field-pair">
            <NumberInput value={rotation.min} onChange={(v) => set({ ...rotation, min: v })} tooltip="Min" />
            <NumberInput value={rotation.max} onChange={(v) => set({ ...rotation, max: v })} tooltip="Max" />
          </div>
        </div>
      )}

      {rotation.variant === 'noRotation' && (
        <div className="form-row">
          <label className="form-label" title="Locked rotation angle">Locked Angle</label>
          <div className="form-field">
            <NumberInput value={rotation.rotation} onChange={(v) => set({ ...rotation, rotation: v })} />
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
