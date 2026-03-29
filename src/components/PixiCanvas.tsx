import type { RefObject } from 'react';

interface PixiCanvasProps {
  containerRef: RefObject<HTMLDivElement | null>;
  particleCount: number;
  fps: number;
}

export function PixiCanvas({ containerRef, particleCount, fps }: PixiCanvasProps) {
  return (
    <div className="canvas-area">
      <div className="stage-info">
        <span>FPS: {fps}</span>
        <span>{particleCount} Particles</span>
      </div>
      <div className="pixi-container" ref={containerRef} />
    </div>
  );
}
