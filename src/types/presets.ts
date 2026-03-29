const BASE = import.meta.env.BASE_URL;

export interface PresetDefinition {
  id: string;
  label: string;
  configPath: string;
  imageIds: string[];
}

export const IMAGE_MAP: Record<string, string> = {
  particle: `${BASE}images/particle.png`,
  smokeparticle: `${BASE}images/smokeparticle.png`,
  HardRain: `${BASE}images/HardRain.png`,
  Bubbles50px: `${BASE}images/Bubbles50px.png`,
  Bubbles99px: `${BASE}images/Bubbles99px.png`,
  CartoonSmoke: `${BASE}images/CartoonSmoke.png`,
  Fire: `${BASE}images/Fire.png`,
  HardCircle: `${BASE}images/HardCircle.png`,
  Pixel25px: `${BASE}images/Pixel25px.png`,
  Pixel50px: `${BASE}images/Pixel50px.png`,
  Pixel100px: `${BASE}images/Pixel100px.png`,
  Snow50px: `${BASE}images/Snow50px.png`,
  Snow100px: `${BASE}images/Snow100px.png`,
  Sparks: `${BASE}images/Sparks.png`,
};

export const ALL_IMAGE_OPTIONS: Array<{ id: string; label: string; path: string }> = Object.entries(
  IMAGE_MAP,
).map(([id, path]) => ({
  id,
  label: `${id}.png`,
  path,
}));

export const PRESETS: PresetDefinition[] = [
  { id: 'trail', label: 'Trail', configPath: `${BASE}presets/trail.json`, imageIds: ['particle'] },
  { id: 'flame', label: 'Flame', configPath: `${BASE}presets/flame.json`, imageIds: ['particle', 'Fire'] },
  { id: 'gas', label: 'Gas', configPath: `${BASE}presets/gas.json`, imageIds: ['smokeparticle', 'particle'] },
  { id: 'smoke', label: 'Smoke', configPath: `${BASE}presets/smoke.json`, imageIds: ['smokeparticle'] },
  { id: 'explosion', label: 'Explosion 1', configPath: `${BASE}presets/explosion.json`, imageIds: ['particle'] },
  { id: 'explosion2', label: 'Explosion 2', configPath: `${BASE}presets/explosion2.json`, imageIds: ['particle'] },
  { id: 'explosion3', label: 'Explosion 3', configPath: `${BASE}presets/explosion3.json`, imageIds: ['particle'] },
  { id: 'megamanDeath', label: 'Megaman Death', configPath: `${BASE}presets/megamanDeath.json`, imageIds: ['particle'] },
  { id: 'pixieDust', label: 'Pixie Dust', configPath: `${BASE}presets/pixieDust.json`, imageIds: ['particle'] },
  { id: 'rain', label: 'Rain', configPath: `${BASE}presets/rain.json`, imageIds: ['HardRain'] },
  { id: 'bubbles', label: 'Bubbles', configPath: `${BASE}presets/bubbles.json`, imageIds: ['Bubbles99px'] },
  { id: 'bubbleSpray', label: 'Bubble Spray', configPath: `${BASE}presets/bubbleSpray.json`, imageIds: ['Bubbles99px'] },
  { id: 'bubbleStream', label: 'Bubble Stream', configPath: `${BASE}presets/bubbleStream.json`, imageIds: ['Bubbles99px'] },
  { id: 'bubblesVertical', label: 'Vertical Bubbles', configPath: `${BASE}presets/bubblesVertical.json`, imageIds: ['Bubbles99px'] },
  { id: 'cartoonSmoke', label: 'Cartoon Smoke', configPath: `${BASE}presets/cartoonSmoke.json`, imageIds: ['CartoonSmoke'] },
  { id: 'cartoonSmokeBlast', label: 'Cartoon Smoke Blast', configPath: `${BASE}presets/cartoonSmokeBlast.json`, imageIds: ['CartoonSmoke'] },
  { id: 'pixelTrail', label: 'Pixel Trail', configPath: `${BASE}presets/pixelTrail.json`, imageIds: ['Pixel100px', 'Pixel50px', 'Pixel25px'] },
  { id: 'snow', label: 'Snow', configPath: `${BASE}presets/snow.json`, imageIds: ['Snow100px'] },
  { id: 'sparks', label: 'Sparks', configPath: `${BASE}presets/sparks.json`, imageIds: ['Sparks'] },
  { id: 'fountain', label: 'Fountain', configPath: `${BASE}presets/fountain.json`, imageIds: ['Sparks'] },
];

export const DEFAULT_PRESET_ID = 'pixieDust';
