import { useRef, useState } from 'react';
import { ALL_IMAGE_OPTIONS } from '../types/presets';
import { readFileAsDataURL } from '../utils/fileUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  onAddImage: (url: string) => void;
}

export function ImageDialog({ open, onClose, onAddImage }: Props) {
  const [selectedImage, setSelectedImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (open && dialogRef.current && !dialogRef.current.open) {
    dialogRef.current.showModal();
  }

  const handleClose = () => {
    dialogRef.current?.close();
    setSelectedImage('');
    onClose();
  };

  const handleConfirm = async () => {
    // Priority: preset > file upload
    if (selectedImage) {
      onAddImage(selectedImage);
      handleClose();
      return;
    }

    const files = fileInputRef.current?.files;
    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const dataUrl = await readFileAsDataURL(file);
        onAddImage(dataUrl);
      }
      handleClose();
      return;
    }
  };

  return (
    <dialog ref={dialogRef} className="editor-dialog" onClose={handleClose}>
      <h3>Add Particle Image</h3>

      <div className="dialog-field">
        <label>Default Images</label>
        <select
          className="select-input"
          value={selectedImage}
          onChange={(e) => setSelectedImage(e.target.value)}
        >
          <option value="">- Select Image -</option>
          {ALL_IMAGE_OPTIONS.map((img) => (
            <option key={img.id} value={img.path}>
              {img.label}
            </option>
          ))}
        </select>
      </div>

      <div className="dialog-field">
        <label>Upload Image</label>
        <input ref={fileInputRef} type="file" accept="image/*" multiple />
      </div>

      <div className="dialog-actions">
        <button className="btn" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleConfirm}>
          Add
        </button>
      </div>
    </dialog>
  );
}
