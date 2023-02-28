export const X = 0;
export const Y = 1;
export const GRID_SIZE = [64, 32];

// const MOUSE_RANGE = [20, 20];
export const RAND_RANGE = 1;

export const FEED_RATE = 0.2;
export const FADE_RATE = 1;

export const MAX_SWAP_RANGE = 3;
export const SWAPS_PER_FRAME = 250; // Number of diffusion swaps per frame
export const SWAP_FRACTION = 0.75; // Amount of mixing per frame
export const FLUCTUATION_RADIUS = 15;
export const FLUCTUATION_MAGNITUDE = 0.5;
export const DECAY_FACTOR = 0.98;

export const MOVE_RATE = 0.4;
export const T = 10;
export const VECOCITY_DECAY_RATE = 0.9;
export const VWEIGHT = 10;

export const G0 = [0, 0];
export const G1 = [1400, 700];
export const CELL_SIZE = [(G1[X] - G0[X]) / GRID_SIZE[X], (G1[Y] - G0[Y]) / GRID_SIZE[Y]];

export const RAD = 8;
export const BASE = 1;

// var MOUSE_BUFFER = 10;
export var MAX_GRID_BUFFER_SIZE = 10;

export var BASE_COLOR = "#808080";
export var BG_COLOR = "505050";
export var SHADOW_OFFSET = 5;