import type { Dispatch } from 'react';
import type { BlendModeBehavior } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';

interface Props {
  blendMode: BlendModeBehavior;
  dispatch: Dispatch<EditorAction>;
}

export function BlendModeBehaviorEditor({ blendMode, dispatch }: Props) {
  const set = (b: BlendModeBehavior) => dispatch({ type: 'SET_BLEND_MODE', blendMode: b });

  const isEnabled = blendMode.variant === 'blendMode';
  const currentMode = isEnabled ? blendMode.blendMode : 'normal';

  return (
    <CollapsibleSection title="Blend Mode" defaultOpen={false}>
      <div className="form-row">
        <label className="form-label">Enabled</label>
        <div className="form-field">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => {
              if (e.target.checked) {
                set({ variant: 'blendMode', blendMode: 'normal' });
              } else {
                set({ variant: 'none' });
              }
            }}
          />
        </div>
      </div>

      {isEnabled && (
        <div className="form-row">
          <label className="form-label">Mode</label>
          <div className="form-field">
            <select
              className="select-input"
              value={currentMode}
              onChange={(e) => set({ variant: 'blendMode', blendMode: e.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="add">Add</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
            </select>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
