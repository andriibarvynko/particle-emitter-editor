import type { Dispatch } from 'react';
import type { EditorState } from '../types/editorState';
import type { EditorAction } from '../hooks/useEditorState';
import { NumberInput } from './NumberInput';

interface Props {
  config: EditorState;
  dispatch: Dispatch<EditorAction>;
}

export function SpawnTypeFields({ config, dispatch }: Props) {
  const spawn = config.spawn;

  if (spawn.variant === 'spawnShape' && spawn.shape.type === 'rect') {
    const s = spawn.shape;
    const update = (patch: Partial<typeof s>) =>
      dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnShape', shape: { ...s, ...patch } } });

    return (
      <>
        <div className="form-row">
          <label className="form-label">Rect Position</label>
          <div className="form-field form-field-pair">
            <NumberInput value={s.x} onChange={(v) => update({ x: v })} tooltip="X" />
            <NumberInput value={s.y} onChange={(v) => update({ y: v })} tooltip="Y" />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Rect Size</label>
          <div className="form-field form-field-pair">
            <NumberInput value={s.w} onChange={(v) => update({ w: v })} tooltip="Width" />
            <NumberInput value={s.h} onChange={(v) => update({ h: v })} tooltip="Height" />
          </div>
        </div>
      </>
    );
  }

  if (spawn.variant === 'spawnShape' && spawn.shape.type === 'torus') {
    const s = spawn.shape;
    const update = (patch: Partial<typeof s>) =>
      dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnShape', shape: { ...s, ...patch } } });

    return (
      <>
        <div className="form-row">
          <label className="form-label">{s.innerRadius > 0 ? 'Ring' : 'Circle'} Position</label>
          <div className="form-field form-field-pair">
            <NumberInput value={s.x} onChange={(v) => update({ x: v })} tooltip="X" />
            <NumberInput value={s.y} onChange={(v) => update({ y: v })} tooltip="Y" />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Radius</label>
          <div className="form-field form-field-pair">
            {s.innerRadius > 0 && (
              <NumberInput value={s.innerRadius} onChange={(v) => update({ innerRadius: v })} min={0} tooltip="Inner Radius" />
            )}
            <NumberInput value={s.radius} onChange={(v) => update({ radius: v })} min={0} tooltip="Outer Radius" />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Affect Rotation</label>
          <div className="form-field">
            <input type="checkbox" checked={s.affectRotation}
              onChange={(e) => update({ affectRotation: e.target.checked })} />
          </div>
        </div>
      </>
    );
  }

  if (spawn.variant === 'spawnBurst') {
    const update = (patch: Partial<typeof spawn>) =>
      dispatch({ type: 'SET_SPAWN', spawn: { ...spawn, ...patch } });

    return (
      <>
        <div className="form-row">
          <label className="form-label">Particle Spacing</label>
          <div className="form-field">
            <NumberInput value={spawn.spacing} onChange={(v) => update({ spacing: v })} min={0} tooltip="Degrees between particles" />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Start Angle</label>
          <div className="form-field">
            <NumberInput value={spawn.start} onChange={(v) => update({ start: v })} tooltip="Starting angle" />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Distance</label>
          <div className="form-field">
            <NumberInput value={spawn.distance} onChange={(v) => update({ distance: v })} min={0} tooltip="Distance from center" />
          </div>
        </div>
      </>
    );
  }

  if (spawn.variant === 'spawnShape' && spawn.shape.type === 'polygonalChain') {
    const s = spawn.shape;
    const setChains = (chains: typeof s.chains) =>
      dispatch({ type: 'SET_SPAWN', spawn: { variant: 'spawnShape', shape: { type: 'polygonalChain', chains } } });

    return (
      <>
        {s.chains.map((chain, ci) => (
          <div key={ci} className="poly-chain-group">
            <div className="form-row">
              <label className="form-label">Chain {ci + 1}</label>
              <div className="form-field">
                <button className="btn" style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={() => {
                    const last = chain[chain.length - 1] ?? { x: 0, y: 0 };
                    const updated = [...s.chains];
                    updated[ci] = [...chain, { x: last.x + 50, y: last.y }];
                    setChains(updated);
                  }}>+ Point</button>
                {s.chains.length > 1 && (
                  <button className="btn btn-danger" style={{ fontSize: 11, padding: '2px 8px', marginLeft: 4 }}
                    onClick={() => setChains(s.chains.filter((_, i) => i !== ci))}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            {chain.map((pt, pi) => (
              <div key={pi} className="form-row">
                <label className="form-label" style={{ fontSize: 10 }}>Point {pi + 1}</label>
                <div className="form-field form-field-pair">
                  <NumberInput value={pt.x} onChange={(v) => {
                    const updated = [...s.chains];
                    updated[ci] = chain.map((p, i) => i === pi ? { ...p, x: v } : p);
                    setChains(updated);
                  }} tooltip="X" />
                  <NumberInput value={pt.y} onChange={(v) => {
                    const updated = [...s.chains];
                    updated[ci] = chain.map((p, i) => i === pi ? { ...p, y: v } : p);
                    setChains(updated);
                  }} tooltip="Y" />
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="form-row">
          <label className="form-label">&nbsp;</label>
          <div className="form-field">
            <button className="btn btn-block" onClick={() => setChains([...s.chains, [{ x: 0, y: 0 }, { x: 100, y: 0 }]])}>
              + Add Chain
            </button>
          </div>
        </div>
      </>
    );
  }

  return null;
}
