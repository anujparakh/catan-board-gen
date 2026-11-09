import type { HarborType, Terrain } from '../../engine';
import { icons } from './icons';

export const terrainTheme: Record<Terrain, { label: string; color: string; icon: string }> = {
  wood: { label: 'Wood', color: 'var(--color-wood)', icon: icons.wood },
  brick: { label: 'Brick', color: 'var(--color-brick)', icon: icons.brick },
  sheep: { label: 'Sheep', color: 'var(--color-sheep)', icon: icons.sheep },
  wheat: { label: 'Wheat', color: 'var(--color-wheat)', icon: icons.wheat },
  ore: { label: 'Ore', color: 'var(--color-ore)', icon: icons.ore },
  desert: { label: 'Desert', color: 'var(--color-desert)', icon: icons.desert },
};

export const harborLabel = (type: HarborType) =>
  type === 'any' ? '3:1 harbor, any resource' : `2:1 harbor, ${terrainTheme[type].label}`;
