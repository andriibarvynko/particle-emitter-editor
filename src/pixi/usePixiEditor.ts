import { useRef, useEffect, useCallback, useState } from 'react';
import { PixiEditor } from './PixiEditor';
import type { LegacyEmitterConfig } from '../types/config';

export function usePixiEditor() {
  const editorRef = useRef<PixiEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particleCount, setParticleCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const editor = new PixiEditor();
    editorRef.current = editor;

    // Throttle particle count updates to avoid excessive re-renders
    let lastCountUpdate = 0;
    editor.onParticleCountUpdate = (count) => {
      const now = performance.now();
      if (now - lastCountUpdate > 250) {
        lastCountUpdate = now;
        setParticleCount(count);
      }
    };

    editor.init(container);

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
  }, []);

  const loadConfig = useCallback(async (config: LegacyEmitterConfig, imageUrls: string[]) => {
    await editorRef.current?.loadConfig(config, imageUrls);
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    editorRef.current?.setBackgroundColor(color);
  }, []);

  return { containerRef, loadConfig, setBackgroundColor, particleCount };
}
