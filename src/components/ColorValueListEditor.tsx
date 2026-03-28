import type { ValueList, ValueStep } from '../types/editorState';
import { ColorPicker } from './ColorPicker';
import { NumberInput } from './NumberInput';

interface Props {
  list: ValueList<string>;
  onChange: (list: ValueList<string>) => void;
}

export function ColorValueListEditor({ list, onChange }: Props) {
  const steps = list.list;

  const updateStep = (index: number, patch: Partial<ValueStep<string>>) => {
    const next = steps.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onChange({ ...list, list: next });
  };

  const addStep = () => {
    const len = steps.length;
    if (len < 2) {
      onChange({ ...list, list: [...steps, { value: '#ffffff', time: 1 }] });
      return;
    }
    const prev = steps[len - 2]!;
    const last = steps[len - 1]!;
    const midTime = +(((prev.time + last.time) / 2).toFixed(3));
    const next = [...steps.slice(0, len - 1), { value: prev.value, time: midTime }, last];
    onChange({ ...list, list: next });
  };

  const removeStep = (index: number) => {
    if (steps.length <= 2) return;
    onChange({ ...list, list: steps.filter((_, i) => i !== index) });
  };

  return (
    <div className="value-list-editor">
      <div className="value-list-header">
        <span className="vle-col-time">Time</span>
        <span className="vle-col-value">Color</span>
        <span className="vle-col-action" />
      </div>
      {steps.map((s, i) => {
        const isFirst = i === 0;
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="value-list-row">
            <div className="vle-col-time">
              {isFirst || isLast ? (
                <span className="vle-fixed-time">{s.time}</span>
              ) : (
                <NumberInput
                  value={s.time}
                  onChange={(v) => updateStep(i, { time: Math.max(0, Math.min(1, v)) })}
                  min={0}
                  max={1}
                  step={0.01}
                />
              )}
            </div>
            <div className="vle-col-value">
              <ColorPicker value={s.value} onChange={(v) => updateStep(i, { value: v })} />
            </div>
            <div className="vle-col-action">
              {!isFirst && !isLast && steps.length > 2 && (
                <button className="vle-remove" onClick={() => removeStep(i)} title="Remove keyframe">
                  &times;
                </button>
              )}
            </div>
          </div>
        );
      })}
      <button className="btn btn-block vle-add" onClick={addStep}>
        + Keyframe
      </button>
    </div>
  );
}
