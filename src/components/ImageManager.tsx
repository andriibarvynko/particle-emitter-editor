interface Props {
  imageUrls: string[];
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
}

export function ImageManager({ imageUrls, onAddImage, onRemoveImage }: Props) {
  return (
    <div className="image-manager">
      <div className="form-row">
        <label className="form-label" title="Images that each particle will be given randomly when spawned">
          Particle Images
        </label>
        <div className="form-field">
          <button className="btn btn-block" onClick={onAddImage}>
            + Add Image
          </button>
        </div>
      </div>
      <div className="image-list">
        {imageUrls.map((url, index) => (
          <div key={`${url}-${index}`} className="image-thumbnail">
            <img src={url} alt={`Particle ${index}`} />
            <button
              className="image-remove-btn"
              onClick={() => onRemoveImage(index)}
              title="Remove image"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
