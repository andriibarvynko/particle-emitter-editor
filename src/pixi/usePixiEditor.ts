import { useRef, useEffect, useCallback, useState } from 'react';
import { PixiEditor } from './PixiEditor';
import type { EmitterConfigV3 } from '@barvynkoa/particle-emitter';

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

  const loadConfig = useCallback(async (v3Config: EmitterConfigV3) => {
    await editorRef.current?.loadConfig(v3Config);
  }, []);

  const setBackgroundColor = useCallback((color: string) => {
    editorRef.current?.setBackgroundColor(color);
  }, []);

  return { containerRef, loadConfig, setBackgroundColor, particleCount };
}
