import type { RefObject } from 'react';

interface PixiCanvasProps {
  containerRef: RefObject<HTMLDivElement | null>;
  particleCount: number;
}

export function PixiCanvas({ containerRef, particleCount }: PixiCanvasProps) {
  return (
    <div className="canvas-area">
      <div className="stage-info">
        <span>{particleCount} Particles</span>
      </div>
      <div className="pixi-container" ref={containerRef} />
    </div>
  );
}
