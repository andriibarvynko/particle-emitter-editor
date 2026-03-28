import { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { usePixiEditor } from './pixi/usePixiEditor';
import { useEditorState } from './hooks/useEditorState';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_PRESET_ID } from './types/presets';
import type { EditorState } from './types/editorState';
import { editorStateToV3, v1ToEditorState } from './utils/configSerializer';
import { loadPreset } from './utils/presetLoader';
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
  const [state, dispatch] = useEditorState();
  const [stageColor, setStageColor] = useLocalStorage('stageColor', '#999999');
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const initializedRef = useRef(false);

  // Compute V3 config from editor state
  const v3Config = useMemo(() => editorStateToV3(state), [state]);

  // Load initial preset on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const hash = window.location.hash.replace('#', '');

    // Try loading from localStorage (new format)
    const savedState = localStorage.getItem('editorState');
    if (hash) {
      handleLoadPreset(hash);
    } else if (savedState) {
      try {
        const parsed = JSON.parse(savedState) as EditorState;
        dispatch({ type: 'SET_STATE', state: parsed });
      } catch {
        handleLoadPreset(DEFAULT_PRESET_ID);
      }
    } else {
      // Migrate from old localStorage format
      const oldConfig = localStorage.getItem('customConfig');
      const oldImages = localStorage.getItem('customImages');
      if (oldConfig && oldImages) {
        try {
          const migrated = v1ToEditorState(JSON.parse(oldConfig), JSON.parse(oldImages));
          dispatch({ type: 'SET_STATE', state: migrated });
          localStorage.removeItem('customConfig');
          localStorage.removeItem('customImages');
        } catch {
          handleLoadPreset(DEFAULT_PRESET_ID);
        }
      } else {
        handleLoadPreset(DEFAULT_PRESET_ID);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push V3 config to PixiJS whenever state changes
  useEffect(() => {
    // Skip if no textures configured
    const hasTex =
      (state.texture.variant === 'textureSingle' && state.texture.texture) ||
      (state.texture.variant === 'textureRandom' && state.texture.textures.length > 0) ||
      (state.texture.variant === 'textureOrdered' && state.texture.textures.length > 0) ||
      (state.texture.variant === 'animatedSingle' && state.texture.anim.textures.length > 0) ||
      (state.texture.variant === 'animatedRandom' && state.texture.anims.length > 0);

    if (!hasTex) return;

    const timer = setTimeout(() => {
      loadConfig(v3Config);
    }, 16);

    return () => clearTimeout(timer);
  }, [v3Config, loadConfig, state.texture]);

  // Persist state to localStorage (debounced)
  useEffect(() => {
    if (!initializedRef.current) return;
    const timer = setTimeout(() => {
      localStorage.setItem('editorState', JSON.stringify(state));
    }, 300);
    return () => clearTimeout(timer);
  }, [state]);

  // Apply stage color
  useEffect(() => {
    setBackgroundColor(stageColor);
  }, [stageColor, setBackgroundColor]);

  const handleLoadPreset = useCallback(
    async (presetId: string) => {
      const presetState = await loadPreset(presetId);
      if (presetState) {
        window.location.hash = `#${presetId}`;
        dispatch({ type: 'SET_STATE', state: presetState });
      }
    },
    [dispatch],
  );

  const handleRefresh = useCallback(() => {
    loadConfig(v3Config);
  }, [v3Config, loadConfig]);

  const handleDownload = useCallback(() => {
    downloadJson(v3Config, 'emitter.json');
  }, [v3Config]);

  const handleLoadState = useCallback(
    (newState: EditorState) => {
      window.location.hash = '';
      dispatch({ type: 'SET_STATE', state: newState });
    },
    [dispatch],
  );

  // Image management (works with texture behavior slot)
  const imageUrls = useMemo(() => {
    const tex = state.texture;
    if (tex.variant === 'textureSingle') return tex.texture ? [tex.texture] : [];
    if (tex.variant === 'textureRandom' || tex.variant === 'textureOrdered') return tex.textures;
    return [];
  }, [state.texture]);

  const handleAddImage = useCallback(
    (url: string) => {
      const tex = state.texture;
      if (tex.variant === 'textureRandom') {
        dispatch({ type: 'SET_TEXTURE', texture: { ...tex, textures: [...tex.textures, url] } });
      } else if (tex.variant === 'textureOrdered') {
        dispatch({ type: 'SET_TEXTURE', texture: { ...tex, textures: [...tex.textures, url] } });
      } else if (tex.variant === 'textureSingle') {
        dispatch({ type: 'SET_TEXTURE', texture: { variant: 'textureSingle', texture: url } });
      } else {
        // Switch to textureRandom if currently animated or other
        dispatch({ type: 'SET_TEXTURE', texture: { variant: 'textureRandom', textures: [url] } });
      }
    },
    [state.texture, dispatch],
  );

  const handleRemoveImage = useCallback(
    (index: number) => {
      const tex = state.texture;
      if (tex.variant === 'textureRandom') {
        dispatch({
          type: 'SET_TEXTURE',
          texture: { ...tex, textures: tex.textures.filter((_, i) => i !== index) },
        });
      } else if (tex.variant === 'textureOrdered') {
        dispatch({
          type: 'SET_TEXTURE',
          texture: { ...tex, textures: tex.textures.filter((_, i) => i !== index) },
        });
      }
    },
    [state.texture, dispatch],
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
        <ParticleProperties config={state} dispatch={dispatch} />
        <ImageManager
          imageUrls={imageUrls}
          onAddImage={() => setImageDialogOpen(true)}
          onRemoveImage={handleRemoveImage}
        />
        <EmitterProperties config={state} dispatch={dispatch} />
        <StageProperties stageColor={stageColor} onColorChange={setStageColor} />
      </Sidebar>

      <ConfigDialog
        open={configDialogOpen}
        onClose={() => setConfigDialogOpen(false)}
        onLoadPreset={handleLoadPreset}
        onLoadState={handleLoadState}
      />
      <ImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onAddImage={handleAddImage}
      />
    </div>
  );
}
