import type { Dispatch } from 'react';
import type { ColorBehavior } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';
import { ColorValueListEditor } from './ColorValueListEditor';
import { ColorPicker } from './ColorPicker';

interface Props {
  color: ColorBehavior;
  dispatch: Dispatch<EditorAction>;
}

type Variant = ColorBehavior['variant'];

export function ColorBehaviorEditor({ color, dispatch }: Props) {
  const set = (c: ColorBehavior) => dispatch({ type: 'SET_COLOR', color: c });

  const switchVariant = (v: Variant) => {
    switch (v) {
      case 'color':
        set({ variant: 'color', color: { list: [{ value: '#ffffff', time: 0 }, { value: '#ffffff', time: 1 }] } });
        break;
      case 'colorStatic':
        set({ variant: 'colorStatic', color: '#ffffff' });
        break;
      case 'none':
        set({ variant: 'none' });
        break;
    }
  };

  return (
    <CollapsibleSection title="Color">
      <div className="form-row">
        <label className="form-label">Type</label>
        <div className="form-field">
          <select className="select-input" value={color.variant} onChange={(e) => switchVariant(e.target.value as Variant)}>
            <option value="color">Animated</option>
            <option value="colorStatic">Static</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      {color.variant === 'color' && (
        <ColorValueListEditor
          list={color.color}
          onChange={(list) => set({ variant: 'color', color: list })}
        />
      )}

      {color.variant === 'colorStatic' && (
        <div className="form-row">
          <label className="form-label">Color</label>
          <div className="form-field">
            <ColorPicker value={color.color} onChange={(v) => set({ variant: 'colorStatic', color: v })} />
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
