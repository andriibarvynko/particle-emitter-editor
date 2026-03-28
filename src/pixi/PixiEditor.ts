import { Application, Assets, Container, Graphics, Rectangle } from 'pixi.js';
import { Emitter } from '@barvynkoa/particle-emitter';
import type { EmitterConfigV3 } from '@barvynkoa/particle-emitter';
import { extractTextureUrls } from '../utils/configSerializer';

export class PixiEditor {
  private app: Application;
  private emitterContainer: Container;
  private background: Graphics;
  private emitter: Emitter | null = null;
  private emitterEnableTimer = 0;
  private _destroyed = false;
  private _ready: Promise<void> | null = null;

  onParticleCountUpdate?: (count: number) => void;

  constructor() {
    this.app = new Application();
    this.emitterContainer = new Container();
    this.background = new Graphics();
  }

  init(canvasParent: HTMLElement): Promise<void> {
    this._ready = this._init(canvasParent);
    return this._ready;
  }

  private async _init(canvasParent: HTMLElement): Promise<void> {
    await this.app.init({
      resizeTo: canvasParent,
      backgroundColor: 0x999999,
      antialias: true,
    });

    if (this._destroyed) return;

    canvasParent.appendChild(this.app.canvas);

    // Background fill
    this.drawBackground();
    this.app.stage.addChild(this.background);
    this.app.stage.addChild(this.emitterContainer);

    // Events
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height);

    this.app.stage.on('pointermove', this.onPointerMove);
    this.app.stage.on('pointerleave', this.onPointerLeave);
    this.app.stage.on('pointerenter', this.onPointerEnter);
    this.app.stage.on('pointerup', this.onPointerUp);

    // Resize handling
    this.app.renderer.on('resize', this.onResize);

    // Update loop
    this.app.ticker.add(this.update);
  }

  async loadConfig(v3Config: EmitterConfigV3): Promise<void> {
    await this._ready;
    if (this._destroyed) return;

    // Pre-load all textures referenced in behaviors
    const urls = extractTextureUrls(v3Config);
    for (const url of urls) {
      if (!Assets.cache.has(url)) {
        try {
          await Assets.load(url);
        } catch (e) {
          console.warn('Failed to load texture:', url, e);
        }
      }
    }

    // Destroy existing emitter
    if (this.emitter) {
      this.emitter.destroy();
      this.emitter = null;
    }

    // Create new emitter
    try {
      this.emitter = new Emitter(this.emitterContainer, v3Config);
      this.emitter.emit = true;
      this.centerEmitter();
      this.emitterEnableTimer = 0;
    } catch (e) {
      console.error('Failed to create emitter:', e);
    }
  }

  async setBackgroundColor(hexColor: string): Promise<void> {
    await this._ready;
    if (this._destroyed) return;

    const color = parseInt(hexColor.replace('#', ''), 16);
    this.app.renderer.background.color = color;
    this.background.clear();
    this.background.rect(0, 0, this.app.screen.width, this.app.screen.height);
    this.background.fill(color);
  }

  destroy(): void {
    this._destroyed = true;
    if (this.emitter) {
      this.emitter.destroy();
      this.emitter = null;
    }
    // Only destroy if init completed (renderer exists)
    if (this.app.renderer) {
      this.app.destroy(true);
    }
  }

  private drawBackground(): void {
    this.background.clear();
    this.background.rect(0, 0, this.app.screen.width, this.app.screen.height);
    this.background.fill(0x999999);
  }

  private centerEmitter = (): void => {
    if (!this.emitter) return;
    this.emitter.updateOwnerPos(this.app.screen.width / 2, this.app.screen.height / 2);
  };

  private onResize = (): void => {
    this.drawBackground();
    this.app.stage.hitArea = new Rectangle(0, 0, this.app.screen.width, this.app.screen.height);
    this.centerEmitter();
  };

  private update = (): void => {
    if (!this.emitter || this._destroyed) return;

    try {
      this.emitter.update(this.app.ticker.deltaMS / 1000);
    } catch {
      // Config may produce runtime errors (e.g. invalid path expression).
      // Kill the broken emitter so it doesn't spam errors every frame.
      this.emitter.emit = false;
      this.emitter.cleanup();
      return;
    }

    // Re-enable emitter after it finishes a cycle
    if (!this.emitter.emit && this.emitterEnableTimer <= 0) {
      this.emitterEnableTimer = 1000 + this.emitter.maxLifetime * 1000;
    } else if (this.emitterEnableTimer > 0) {
      this.emitterEnableTimer -= this.app.ticker.deltaMS;
      if (this.emitterEnableTimer <= 0) {
        this.emitter.emit = true;
      }
    }

    this.onParticleCountUpdate?.(this.emitter.particleCount);
  };

  private onPointerMove = (event: { global: { x: number; y: number } }): void => {
    if (!this.emitter) return;
    this.emitter.updateOwnerPos(event.global.x, event.global.y);
  };

  private onPointerLeave = (): void => {
    if (!this.emitter) return;
    this.centerEmitter();
    this.emitter.resetPositionTracking();
  };

  private onPointerEnter = (): void => {
    if (!this.emitter) return;
    this.emitter.resetPositionTracking();
  };

  private onPointerUp = (): void => {
    if (!this.emitter) return;
    this.emitter.resetPositionTracking();
    this.emitter.emit = true;
    this.emitterEnableTimer = 0;
  };
}
