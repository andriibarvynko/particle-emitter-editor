export interface PresetDefinition {
  id: string;
  label: string;
  configPath: string;
  imageIds: string[];
}

export const IMAGE_MAP: Record<string, string> = {
  particle: '/images/particle.png',
  smokeparticle: '/images/smokeparticle.png',
  HardRain: '/images/HardRain.png',
  Bubbles50px: '/images/Bubbles50px.png',
  Bubbles99px: '/images/Bubbles99px.png',
  CartoonSmoke: '/images/CartoonSmoke.png',
  Fire: '/images/Fire.png',
  HardCircle: '/images/HardCircle.png',
  Pixel25px: '/images/Pixel25px.png',
  Pixel50px: '/images/Pixel50px.png',
  Pixel100px: '/images/Pixel100px.png',
  Snow50px: '/images/Snow50px.png',
  Snow100px: '/images/Snow100px.png',
  Sparks: '/images/Sparks.png',
};

export const ALL_IMAGE_OPTIONS: Array<{ id: string; label: string; path: string }> = Object.entries(
  IMAGE_MAP,
).map(([id, path]) => ({
  id,
  label: `${id}.png`,
  path,
}));

export const PRESETS: PresetDefinition[] = [
  { id: 'trail', label: 'Trail', configPath: '/presets/trail.json', imageIds: ['particle'] },
  {
    id: 'flame',
    label: 'Flame',
    configPath: '/presets/flame.json',
    imageIds: ['particle', 'Fire'],
  },
  {
    id: 'gas',
    label: 'Gas',
    configPath: '/presets/gas.json',
    imageIds: ['smokeparticle', 'particle'],
  },
  { id: 'smoke', label: 'Smoke', configPath: '/presets/smoke.json', imageIds: ['smokeparticle'] },
  {
    id: 'explosion',
    label: 'Explosion 1',
    configPath: '/presets/explosion.json',
    imageIds: ['particle'],
  },
  {
    id: 'explosion2',
    label: 'Explosion 2',
    configPath: '/presets/explosion2.json',
    imageIds: ['particle'],
  },
  {
    id: 'explosion3',
    label: 'Explosion 3',
    configPath: '/presets/explosion3.json',
    imageIds: ['particle'],
  },
  {
    id: 'megamanDeath',
    label: 'Megaman Death',
    configPath: '/presets/megamanDeath.json',
    imageIds: ['particle'],
  },
  {
    id: 'pixieDust',
    label: 'Pixie Dust',
    configPath: '/presets/pixieDust.json',
    imageIds: ['particle'],
  },
  { id: 'rain', label: 'Rain', configPath: '/presets/rain.json', imageIds: ['HardRain'] },
  {
    id: 'bubbles',
    label: 'Bubbles',
    configPath: '/presets/bubbles.json',
    imageIds: ['Bubbles99px'],
  },
  {
    id: 'bubbleSpray',
    label: 'Bubble Spray',
    configPath: '/presets/bubbleSpray.json',
    imageIds: ['Bubbles99px'],
  },
  {
    id: 'bubbleStream',
    label: 'Bubble Stream',
    configPath: '/presets/bubbleStream.json',
    imageIds: ['Bubbles99px'],
  },
  {
    id: 'bubblesVertical',
    label: 'Vertical Bubbles',
    configPath: '/presets/bubblesVertical.json',
    imageIds: ['Bubbles99px'],
  },
  {
    id: 'cartoonSmoke',
    label: 'Cartoon Smoke',
    configPath: '/presets/cartoonSmoke.json',
    imageIds: ['CartoonSmoke'],
  },
  {
    id: 'cartoonSmokeBlast',
    label: 'Cartoon Smoke Blast',
    configPath: '/presets/cartoonSmokeBlast.json',
    imageIds: ['CartoonSmoke'],
  },
  {
    id: 'pixelTrail',
    label: 'Pixel Trail',
    configPath: '/presets/pixelTrail.json',
    imageIds: ['Pixel100px', 'Pixel50px', 'Pixel25px'],
  },
  { id: 'snow', label: 'Snow', configPath: '/presets/snow.json', imageIds: ['Snow100px'] },
  { id: 'sparks', label: 'Sparks', configPath: '/presets/sparks.json', imageIds: ['Sparks'] },
  {
    id: 'fountain',
    label: 'Fountain',
    configPath: '/presets/fountain.json',
    imageIds: ['Sparks'],
  },
];

export const DEFAULT_PRESET_ID = 'pixieDust';
