import { useRef, useState } from 'react';
import { PRESETS } from '../types/presets';
import { readFileAsText } from '../utils/fileUtils';
import type { LegacyEmitterConfig } from '../types/config';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoadPreset: (presetId: string) => void;
  onLoadConfig: (config: LegacyEmitterConfig) => void;
}

export function ConfigDialog({ open, onClose, onLoadPreset, onLoadConfig }: Props) {
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

  const handleConfirm = async () => {
    setError('');

    // Priority: preset > file upload > paste
    if (selectedPreset) {
      onLoadPreset(selectedPreset);
      handleClose();
      return;
    }

    const files = fileInputRef.current?.files;
    if (files && files.length > 0) {
      try {
        const text = await readFileAsText(files[0]!);
        const config = JSON.parse(text) as LegacyEmitterConfig;
        onLoadConfig(config);
        handleClose();
      } catch {
        setError('Invalid JSON file');
      }
      return;
    }

    if (pasteValue) {
      try {
        const config = JSON.parse(pasteValue) as LegacyEmitterConfig;
        onLoadConfig(config);
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
        <label>Upload JSON File</label>
        <input ref={fileInputRef} type="file" accept=".json,application/json" />
      </div>

      <div className="dialog-field">
        <label>Paste JSON</label>
        <textarea
          className="textarea-input"
          rows={5}
          value={pasteValue}
          onChange={(e) => setPasteValue(e.target.value)}
          placeholder='{"alpha": {"start": 1, "end": 0}, ...}'
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
