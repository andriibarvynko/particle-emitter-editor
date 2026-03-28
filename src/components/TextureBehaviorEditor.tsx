import { type Dispatch, useState } from 'react';
import type { TextureBehavior, AnimConfig } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { CollapsibleSection } from './CollapsibleSection';
import { NumberInput } from './NumberInput';

interface Props {
  texture: TextureBehavior;
  dispatch: Dispatch<EditorAction>;
  onAddImage: () => void;
}

type TextureVariant = TextureBehavior['variant'];

const VARIANT_LABELS: Record<TextureVariant, string> = {
  textureSingle: 'Single Texture',
  textureRandom: 'Random Textures',
  textureOrdered: 'Ordered Textures',
  animatedSingle: 'Animated (Single)',
  animatedRandom: 'Animated (Random)',
};

const DEFAULT_ANIM: AnimConfig = { framerate: 24, loop: false, textures: [] };

function getDefaultForVariant(variant: TextureVariant, current: TextureBehavior): TextureBehavior {
  // Preserve existing textures when switching variants
  const urls = getStaticTextures(current);

  switch (variant) {
    case 'textureSingle':
      return { variant: 'textureSingle', texture: urls[0] ?? '' };
    case 'textureRandom':
      return { variant: 'textureRandom', textures: urls };
    case 'textureOrdered':
      return { variant: 'textureOrdered', textures: urls };
    case 'animatedSingle':
      return { variant: 'animatedSingle', anim: { ...DEFAULT_ANIM, textures: urls } };
    case 'animatedRandom':
      return {
        variant: 'animatedRandom',
        anims: urls.length > 0 ? [{ ...DEFAULT_ANIM, textures: urls }] : [],
      };
  }
}

function getStaticTextures(tex: TextureBehavior): string[] {
  switch (tex.variant) {
    case 'textureSingle':
      return tex.texture ? [tex.texture] : [];
    case 'textureRandom':
    case 'textureOrdered':
      return tex.textures;
    case 'animatedSingle':
      return tex.anim.textures;
    case 'animatedRandom':
      return tex.anims.flatMap((a) => a.textures);
  }
}

export function TextureBehaviorEditor({ texture, dispatch, onAddImage }: Props) {
  const setTexture = (tex: TextureBehavior) => dispatch({ type: 'SET_TEXTURE', texture: tex });

  return (
    <CollapsibleSection title="Textures">
      {/* Variant selector */}
      <div className="form-row">
        <label className="form-label">Type</label>
        <div className="form-field">
          <select
            className="select-input"
            value={texture.variant}
            onChange={(e) => setTexture(getDefaultForVariant(e.target.value as TextureVariant, texture))}
          >
            {Object.entries(VARIANT_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Variant-specific UI */}
      {texture.variant === 'textureSingle' && (
        <SingleTextureEditor texture={texture.texture} setTexture={setTexture} onAddImage={onAddImage} />
      )}
      {(texture.variant === 'textureRandom' || texture.variant === 'textureOrdered') && (
        <TextureListEditor
          textures={texture.textures}
          onChange={(textures) => setTexture({ ...texture, textures })}
          onAddImage={onAddImage}
        />
      )}
      {texture.variant === 'animatedSingle' && (
        <AnimatedEditor
          anim={texture.anim}
          onChange={(anim) => setTexture({ variant: 'animatedSingle', anim })}
          onAddImage={onAddImage}
        />
      )}
      {texture.variant === 'animatedRandom' && (
        <AnimatedRandomEditor
          anims={texture.anims}
          onChange={(anims) => setTexture({ variant: 'animatedRandom', anims })}
          onAddImage={onAddImage}
        />
      )}
    </CollapsibleSection>
  );
}

// ─── Sub-components ───

function SingleTextureEditor({
  texture,
  setTexture,
  onAddImage,
}: {
  texture: string;
  setTexture: (tex: TextureBehavior) => void;
  onAddImage: () => void;
}) {
  return (
    <div className="form-row">
      <label className="form-label">Image</label>
      <div className="form-field">
        {texture ? (
          <div className="image-thumbnail">
            <img src={texture} alt="Particle" />
            <button
              className="image-remove-btn"
              onClick={() => setTexture({ variant: 'textureSingle', texture: '' })}
            >
              &times;
            </button>
          </div>
        ) : (
          <button className="btn btn-block" onClick={onAddImage}>
            + Select Image
          </button>
        )}
      </div>
    </div>
  );
}

function TextureListEditor({
  textures,
  onChange,
  onAddImage,
}: {
  textures: string[];
  onChange: (textures: string[]) => void;
  onAddImage: () => void;
}) {
  return (
    <>
      <div className="form-row">
        <label className="form-label">Images</label>
        <div className="form-field">
          <button className="btn btn-block" onClick={onAddImage}>
            + Add Image
          </button>
        </div>
      </div>
      {textures.length > 0 && (
        <div className="image-list-full">
          {textures.map((url, i) => (
            <div key={`${url}-${i}`} className="image-thumbnail">
              <img src={url} alt={`Texture ${i}`} />
              <button
                className="image-remove-btn"
                onClick={() => onChange(textures.filter((_, idx) => idx !== i))}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AnimatedEditor({
  anim,
  onChange,
  onAddImage,
}: {
  anim: AnimConfig;
  onChange: (anim: AnimConfig) => void;
  onAddImage: () => void;
}) {
  return (
    <>
      <div className="form-row">
        <label className="form-label" title="Frames per second. -1 = match particle lifetime">
          Framerate
        </label>
        <div className="form-field">
          <NumberInput
            value={anim.framerate}
            onChange={(v) => onChange({ ...anim, framerate: v })}
            min={-1}
            step={1}
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" title="-1 = auto-fit to particle lifetime">
          Match Lifetime
        </label>
        <div className="form-field">
          <input
            type="checkbox"
            checked={anim.framerate === -1}
            onChange={(e) => onChange({ ...anim, framerate: e.target.checked ? -1 : 24 })}
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Loop</label>
        <div className="form-field">
          <input
            type="checkbox"
            checked={anim.loop}
            onChange={(e) => onChange({ ...anim, loop: e.target.checked })}
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label">Frames</label>
        <div className="form-field">
          <button className="btn btn-block" onClick={onAddImage}>
            + Add Frame
          </button>
        </div>
      </div>
      {anim.textures.length > 0 && (
        <div className="image-list-full">
          {anim.textures.map((url, i) => (
            <div key={`${url}-${i}`} className="image-thumbnail image-thumbnail-numbered">
              <span className="frame-number">{i + 1}</span>
              <img src={url} alt={`Frame ${i + 1}`} />
              <button
                className="image-remove-btn"
                onClick={() =>
                  onChange({ ...anim, textures: anim.textures.filter((_, idx) => idx !== i) })
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AnimatedRandomEditor({
  anims,
  onChange,
  onAddImage,
}: {
  anims: AnimConfig[];
  onChange: (anims: AnimConfig[]) => void;
  onAddImage: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeAnim = anims[activeIndex];

  return (
    <>
      <div className="form-row">
        <label className="form-label">Animations</label>
        <div className="form-field">
          <button
            className="btn btn-block"
            onClick={() => {
              onChange([...anims, { ...DEFAULT_ANIM }]);
              setActiveIndex(anims.length);
            }}
          >
            + Add Animation
          </button>
        </div>
      </div>

      {anims.length > 0 && (
        <>
          <div className="form-row">
            <label className="form-label">Active</label>
            <div className="form-field">
              <select
                className="select-input"
                value={activeIndex}
                onChange={(e) => setActiveIndex(parseInt(e.target.value))}
              >
                {anims.map((_, i) => (
                  <option key={i} value={i}>
                    Animation {i + 1} ({anims[i]?.textures.length ?? 0} frames)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeAnim && (
            <>
              <AnimatedEditor
                anim={activeAnim}
                onChange={(updated) => {
                  const next = [...anims];
                  next[activeIndex] = updated;
                  onChange(next);
                }}
                onAddImage={onAddImage}
              />
              <div className="form-row">
                <label className="form-label">&nbsp;</label>
                <div className="form-field">
                  <button
                    className="btn btn-block btn-danger"
                    onClick={() => {
                      const next = anims.filter((_, i) => i !== activeIndex);
                      onChange(next);
                      setActiveIndex(Math.max(0, activeIndex - 1));
                    }}
                  >
                    Remove Animation {activeIndex + 1}
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
