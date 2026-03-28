import { CollapsibleSection } from './CollapsibleSection';
import { ColorPicker } from './ColorPicker';

interface Props {
  stageColor: string;
  onColorChange: (color: string) => void;
}

export function StageProperties({ stageColor, onColorChange }: Props) {
  return (
    <CollapsibleSection title="Stage Properties">
      <div className="form-row">
        <label className="form-label" title="Background color of the stage">Background</label>
        <div className="form-field">
          <ColorPicker value={stageColor} onChange={onColorChange} />
        </div>
      </div>
    </CollapsibleSection>
  );
}
