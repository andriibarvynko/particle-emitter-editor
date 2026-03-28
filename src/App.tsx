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
import { TextureBehaviorEditor } from './components/TextureBehaviorEditor';
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

  // Handle image added from ImageDialog — routes into the texture behavior
  const handleAddImage = useCallback(
    (url: string) => {
      const tex = state.texture;
      switch (tex.variant) {
        case 'textureSingle':
          dispatch({ type: 'SET_TEXTURE', texture: { variant: 'textureSingle', texture: url } });
          break;
        case 'textureRandom':
          dispatch({ type: 'SET_TEXTURE', texture: { ...tex, textures: [...tex.textures, url] } });
          break;
        case 'textureOrdered':
          dispatch({ type: 'SET_TEXTURE', texture: { ...tex, textures: [...tex.textures, url] } });
          break;
        case 'animatedSingle':
          dispatch({
            type: 'SET_TEXTURE',
            texture: { ...tex, anim: { ...tex.anim, textures: [...tex.anim.textures, url] } },
          });
          break;
        case 'animatedRandom': {
          // Add to last animation, or create a new one
          if (tex.anims.length === 0) {
            dispatch({
              type: 'SET_TEXTURE',
              texture: {
                ...tex,
                anims: [{ framerate: 24, loop: false, textures: [url] }],
              },
            });
          } else {
            const anims = [...tex.anims];
            const last = anims[anims.length - 1]!;
            anims[anims.length - 1] = { ...last, textures: [...last.textures, url] };
            dispatch({ type: 'SET_TEXTURE', texture: { ...tex, anims } });
          }
          break;
        }
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
        <TextureBehaviorEditor
          texture={state.texture}
          dispatch={dispatch}
          onAddImage={() => setImageDialogOpen(true)}
        />
        <ParticleProperties config={state} dispatch={dispatch} />
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
