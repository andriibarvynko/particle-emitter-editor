import type { Dispatch } from 'react';
import type { ScaleBehavior } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';
import { ValueListEditor } from './ValueListEditor';
import { NumberInput } from './NumberInput';

interface Props {
  scale: ScaleBehavior;
  dispatch: Dispatch<EditorAction>;
}

type Variant = ScaleBehavior['variant'];

export function ScaleBehaviorEditor({ scale, dispatch }: Props) {
  const set = (s: ScaleBehavior) => dispatch({ type: 'SET_SCALE', scale: s });

  const switchVariant = (v: Variant) => {
    switch (v) {
      case 'scale':
        set({ variant: 'scale', scale: { list: [{ value: 1, time: 0 }, { value: 0.3, time: 1 }] }, minMult: 1 });
        break;
      case 'scaleStatic':
        set({ variant: 'scaleStatic', min: 0.5, max: 1 });
        break;
      case 'none':
        set({ variant: 'none' });
        break;
    }
  };

  return (
    <CollapsibleSection title="Scale">
      <div className="form-row">
        <label className="form-label">Type</label>
        <div className="form-field">
          <select className="select-input" value={scale.variant} onChange={(e) => switchVariant(e.target.value as Variant)}>
            <option value="scale">Animated</option>
            <option value="scaleStatic">Static</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      {scale.variant === 'scale' && (
        <>
          <ValueListEditor
            list={scale.scale}
            onChange={(list) => set({ ...scale, scale: list })}
            valueLabel="Scale"
            min={0}
            step={0.01}
          />
          <div className="form-row">
            <label className="form-label" title="Random multiplier between this value and 1">Min Multiplier</label>
            <div className="form-field">
              <NumberInput value={scale.minMult} onChange={(v) => set({ ...scale, minMult: v })} min={0.001} max={1} step={0.01} />
            </div>
          </div>
        </>
      )}

      {scale.variant === 'scaleStatic' && (
        <div className="form-row">
          <label className="form-label">Range</label>
          <div className="form-field form-field-pair">
            <NumberInput value={scale.min} onChange={(v) => set({ ...scale, min: v })} min={0} step={0.01} tooltip="Min scale" />
            <NumberInput value={scale.max} onChange={(v) => set({ ...scale, max: v })} min={0} step={0.01} tooltip="Max scale" />
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
