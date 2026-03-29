import { useEffect, useRef, useState } from 'react';
import { Assets, Texture } from 'pixi.js';

interface Props {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Checks if a string looks like a loadable URL (vs a spritesheet frame name).
 */
function isUrl(ref: string): boolean {
  return (
    ref.startsWith('data:') ||
    ref.startsWith('http') ||
    ref.startsWith('./') ||
    ref.startsWith('/') ||
    ref.startsWith('blob:')
  );
}

/**
 * Tries to render a PixiJS texture (e.g. spritesheet frame) to a data URL
 * by extracting the frame region from the atlas source image.
 */
function renderFrameToDataUrl(frameName: string): string | null {
  try {
    const texture = Assets.get<Texture>(frameName);
    if (!texture?.source?.resource) return null;

    const frame = texture.frame;
    const source = texture.source.resource;

    // source.resource is an ImageBitmap or HTMLImageElement
    if (!('width' in source)) return null;

    const canvas = document.createElement('canvas');
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      source as CanvasImageSource,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      0,
      0,
      frame.width,
      frame.height,
    );
    return canvas.toDataURL();
  } catch {
    return null;
  }
}

/**
 * Displays a texture preview. Works with both regular image URLs and
 * PixiJS spritesheet frame names (extracts from atlas via canvas).
 */
export function SpritePreview({ src, alt = 'Texture', className }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const retryRef = useRef(0);

  useEffect(() => {
    if (!src || isUrl(src)) {
      setDataUrl(null);
      return;
    }

    // For spritesheet frame names, try to extract from PixiJS cache.
    // The spritesheet may not be loaded yet, so retry a few times.
    const tryExtract = () => {
      const url = renderFrameToDataUrl(src);
      if (url) {
        setDataUrl(url);
        retryRef.current = 0;
      } else if (retryRef.current < 10) {
        retryRef.current++;
        setTimeout(tryExtract, 200);
      }
    };
    retryRef.current = 0;
    tryExtract();
  }, [src]);

  if (!src) return null;

  // Regular URL — use native img
  if (isUrl(src) && !dataUrl) {
    return <img src={src} alt={alt} className={className} />;
  }

  // Spritesheet frame — use extracted data URL
  if (dataUrl) {
    return <img src={dataUrl} alt={alt} className={className} />;
  }

  // Fallback: show frame name as text
  return <span className="sprite-preview-fallback">{src.split('/').pop()}</span>;
}
