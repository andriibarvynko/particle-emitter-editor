import { useEffect, useCallback, useState, useRef } from 'react';
import { usePixiEditor } from './pixi/usePixiEditor';
import { useEmitterConfig } from './hooks/useEmitterConfig';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PRESETS, IMAGE_MAP, DEFAULT_PRESET_ID } from './types/presets';
import type { LegacyEmitterConfig } from './types/config';

import { loadPresetConfig } from './utils/presetLoader';
import { downloadJson } from './utils/fileUtils';
import { PixiCanvas } from './components/PixiCanvas';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { ParticleProperties } from './components/ParticleProperties';
import { EmitterProperties } from './components/EmitterProperties';
import { StageProperties } from './components/StageProperties';
import { ImageManager } from './components/ImageManager';
import { ConfigDialog } from './components/ConfigDialog';
import { ImageDialog } from './components/ImageDialog';
import './App.css';

export function App() {
  const { containerRef, loadConfig, setBackgroundColor, particleCount } = usePixiEditor();
  const [config, dispatch] = useEmitterConfig();
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [stageColor, setStageColor] = useLocalStorage('stageColor', '#999999');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const initializedRef = useRef(false);

  // Load initial preset on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const hash = window.location.hash.replace('#', '');

    // Try loading from localStorage
    const savedConfig = localStorage.getItem('customConfig');
    const savedImages = localStorage.getItem('customImages');

    if (hash) {
      loadPreset(hash);
    } else if (savedConfig && savedImages) {
      try {
        const parsedConfig = JSON.parse(savedConfig) as LegacyEmitterConfig;
        const parsedImages = JSON.parse(savedImages) as string[];
        dispatch({ type: 'SET_FULL_CONFIG', config: parsedConfig });
        setImageUrls(parsedImages);
      } catch {
        loadPreset(DEFAULT_PRESET_ID);
      }
    } else {
      loadPreset(DEFAULT_PRESET_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push config + images to PixiJS whenever they change
  useEffect(() => {
    if (imageUrls.length === 0) return;

    const timer = setTimeout(() => {
      loadConfig(config, imageUrls);
    }, 16);

    return () => clearTimeout(timer);
  }, [config, imageUrls, loadConfig]);

  // Persist config to localStorage (debounced)
  useEffect(() => {
    if (!initializedRef.current) return;
    const timer = setTimeout(() => {
      localStorage.setItem('customConfig', JSON.stringify(config));
      localStorage.setItem('customImages', JSON.stringify(imageUrls));
    }, 300);
    return () => clearTimeout(timer);
  }, [config, imageUrls]);

  // Apply stage color
  useEffect(() => {
    setBackgroundColor(stageColor);
  }, [stageColor, setBackgroundColor]);

  const loadPreset = useCallback(
    async (presetId: string) => {
      const preset = PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      window.location.hash = `#${presetId}`;
      const presetConfig = await loadPresetConfig(preset.configPath);
      dispatch({ type: 'SET_FULL_CONFIG', config: presetConfig });

      const urls = preset.imageIds.map((id) => IMAGE_MAP[id]).filter(Boolean) as string[];
      setImageUrls(urls);
    },
    [dispatch],
  );

  const handleRefresh = useCallback(() => {
    if (imageUrls.length > 0) {
      loadConfig(config, imageUrls);
    }
  }, [config, imageUrls, loadConfig]);

  const handleDownload = useCallback(() => {
    downloadJson(config, 'emitter.json');
  }, [config]);

  const handleLoadConfig = useCallback(
    (newConfig: LegacyEmitterConfig) => {
      window.location.hash = '';
      dispatch({ type: 'SET_FULL_CONFIG', config: newConfig });
    },
    [dispatch],
  );

  const handleAddImage = useCallback(
    (url: string) => {
      setImageUrls((prev) => [...prev, url]);
    },
    [],
  );

  const handleRemoveImage = useCallback((index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleStageColorChange = useCallback(
    (color: string) => {
      setStageColor(color);
    },
    [setStageColor],
  );

  return (
    <div className="app-layout">
      <PixiCanvas containerRef={containerRef} particleCount={particleCount} />
      <Sidebar>
        <Toolbar
          onRefresh={handleRefresh}
          onLoad={() => setConfigDialogOpen(true)}
          onDownload={handleDownload}
        />
        <ParticleProperties config={config} dispatch={dispatch} />
        <ImageManager
          imageUrls={imageUrls}
          onAddImage={() => setImageDialogOpen(true)}
          onRemoveImage={handleRemoveImage}
        />
        <EmitterProperties config={config} dispatch={dispatch} />
        <StageProperties stageColor={stageColor} onColorChange={handleStageColorChange} />
      </Sidebar>

      <ConfigDialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        onLoadPreset={loadPreset}
        onLoadConfig={handleLoadConfig}
      />
      <ImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onAddImage={handleAddImage}
      />
    </div>
  );
}
