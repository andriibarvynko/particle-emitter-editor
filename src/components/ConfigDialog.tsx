import { useRef, useState } from 'react';
import { PRESETS } from '../types/presets';
import { readFileAsText } from '../utils/fileUtils';
import { detectConfigVersion, v3ToEditorState, v1ToEditorState } from '../utils/configSerializer';
import type { EditorState } from '../types/editorState';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoadPreset: (presetId: string) => void;
  onLoadState: (state: EditorState) => void;
}

export function ConfigDialog({ open, onClose, onLoadPreset, onLoadState }: Props) {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [pasteValue, setPasteValue] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (open && dialogRef.current && !dialogRef.current.open) {
    dialogRef.current.showModal();
  }

  const handleClose = () => {
    dialogRef.current?.close();
    setSelectedPreset('');
    setPasteValue('');
    setError('');
    onClose();
  };

  const parseConfig = (json: unknown): EditorState => {
    const version = detectConfigVersion(json);
    if (version === 'v3') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return v3ToEditorState(json as any);
    } else {
      // V1 config — no image URLs available from paste/file, textures stay empty
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return v1ToEditorState(json as any, []);
    }
  };

  const handleConfirm = async () => {
    setError('');

    if (selectedPreset) {
      onLoadPreset(selectedPreset);
      handleClose();
      return;
    }

    const files = fileInputRef.current?.files;
    if (files && files.length > 0) {
      try {
        const text = await readFileAsText(files[0]!);
        const json = JSON.parse(text);
        onLoadState(parseConfig(json));
        handleClose();
      } catch {
        setError('Invalid JSON file');
      }
      return;
    }

    if (pasteValue) {
      try {
        const json = JSON.parse(pasteValue);
        onLoadState(parseConfig(json));
        handleClose();
      } catch {
        setError('Invalid JSON');
      }
      return;
    }
  };

  return (
    <dialog ref={dialogRef} className="editor-dialog" onClose={handleClose}>
      <h3>Load Configuration</h3>

      <div className="dialog-field">
        <label>Default Emitters</label>
        <select
          className="select-input"
          value={selectedPreset}
          onChange={(e) => setSelectedPreset(e.target.value)}
        >
          <option value="">- Select Preset -</option>
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dialog-field">
        <label>Upload JSON File (V1 or V3)</label>
        <input ref={fileInputRef} type="file" accept=".json,application/json" />
      </div>

      <div className="dialog-field">
        <label>Paste JSON (V1 or V3)</label>
        <textarea
          className="textarea-input"
          rows={5}
          value={pasteValue}
          onChange={(e) => setPasteValue(e.target.value)}
          placeholder='{"behaviors": [...]} or {"alpha": {"start": 1, "end": 0}, ...}'
        />
      </div>

      {error && <p className="dialog-error">{error}</p>}

      <div className="dialog-actions">
        <button className="btn" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleConfirm}>
          Open
        </button>
      </div>
    </dialog>
  );
}
