import type { Dispatch } from 'react';
import type { AlphaBehavior } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';
import { ValueListEditor } from './ValueListEditor';

interface Props {
  alpha: AlphaBehavior;
  dispatch: Dispatch<EditorAction>;
}

type Variant = AlphaBehavior['variant'];

export function AlphaBehaviorEditor({ alpha, dispatch }: Props) {
  const set = (a: AlphaBehavior) => dispatch({ type: 'SET_ALPHA', alpha: a });

  const switchVariant = (v: Variant) => {
    switch (v) {
      case 'alpha':
        set({ variant: 'alpha', alpha: { list: [{ value: 1, time: 0 }, { value: 0, time: 1 }] } });
        break;
      case 'alphaStatic':
        set({ variant: 'alphaStatic', alpha: 1 });
        break;
      case 'none':
        set({ variant: 'none' });
        break;
    }
  };

  return (
    <CollapsibleSection title="Alpha">
      <div className="form-row">
        <label className="form-label">Type</label>
        <div className="form-field">
          <select className="select-input" value={alpha.variant} onChange={(e) => switchVariant(e.target.value as Variant)}>
            <option value="alpha">Animated</option>
            <option value="alphaStatic">Static</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      {alpha.variant === 'alpha' && (
        <ValueListEditor
          list={alpha.alpha}
          onChange={(list) => set({ variant: 'alpha', alpha: list })}
          valueLabel="Alpha"
          min={0}
          max={1}
          step={0.01}
        />
      )}

      {alpha.variant === 'alphaStatic' && (
        <div className="form-row">
          <label className="form-label">Alpha</label>
          <div className="form-field">
            <input
              type="range"
              className="range-input"
              min={0}
              max={1}
              step={0.01}
              value={alpha.alpha}
              onChange={(e) => set({ variant: 'alphaStatic', alpha: parseFloat(e.target.value) })}
            />
            <span className="range-value">{alpha.alpha.toFixed(2)}</span>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
