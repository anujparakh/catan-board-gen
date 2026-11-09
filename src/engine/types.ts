export type Resource = 'wood' | 'brick' | 'sheep' | 'wheat' | 'ore';
export type Terrain = Resource | 'desert';
export type HarborType = Resource | 'any'; // 'any' = 3:1, resource = 2:1
export type Edge = 0 | 1 | 2 | 3 | 4 | 5; // E, SE, SW, W, NW, NE

export const RESOURCES: readonly Resource[] = ['wood', 'brick', 'sheep', 'wheat', 'ore'];

export interface Hex {
  col: number;
  row: number;
}

export interface Tile {
  id: string; // `${col},${row}`
  hex: Hex;
  terrain: Terrain;
  number: number | null; // null on desert
}

export interface Harbor {
  hex: Hex;
  edge: Edge;
  type: HarborType;
}

export interface BoardSpec {
  id: string;
  name: string;
  players: number; // max players, used for start-spot fairness
  rows: number[];
  terrain: Record<Terrain, number>;
  numbers: number[];
  harbors: Record<HarborType, number>;
}

export interface Settings {
  specId: string;
  rules: Record<string, boolean>; // rule id -> on/off
  seed?: number; // omit = random
}

export interface Board {
  specId: string;
  seed: number;
  tiles: Tile[];
  harbors: Harbor[];
}

export interface Corner {
  x: number; // unit-size pixel position
  y: number;
  tiles: number[]; // indices into Board.tiles
}

/** Everything derived from a spec's shape, computed once per spec. */
export interface Ctx {
  hexes: Hex[];
  index: Map<string, number>; // hex id -> tile index
  neighbours: number[][];
  coast: { hex: Hex; edge: Edge }[];
  corners: Corner[];
}
