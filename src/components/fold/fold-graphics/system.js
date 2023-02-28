import {X, Y, G0, G1, MAX_GRID_BUFFER_SIZE, GRID_SIZE,
    MOVE_RATE, SWAPS_PER_FRAME, MAX_SWAP_RANGE, SWAP_FRACTION, FLUCTUATION_MAGNITUDE,
    VECOCITY_DECAY_RATE, DECAY_FACTOR, FLUCTUATION_RADIUS, VWEIGHT} from './graphic-utils.js';

import {Grid} from '../../../utils/grid';
import {interpolate, randint, stoc} from '../../../utils/functions';


function clip(c) {
    return [Math.min(Math.max(0, c[X]), GRID_SIZE[X] - 1), Math.min(Math.max(0, c[Y]), GRID_SIZE[Y] - 1)];
}

// Randomly sample from the entire grid
function gridSample() {
    return [randint(0, GRID_SIZE[X]), randint(0, GRID_SIZE[Y])];
}

// Sample from the axis-aligned square of length 2d+1 centered on x, y
function boxSample(c, d) {
    var dx = randint(0 - d, d + 1);
    var dy = randint(0 - d, d + 1);
    return clip([c[X] + dx, c[Y] + dy]);
}

function neighbor(c, d, v) {
    return boxSample([c[X] + stoc(v[X]), c[Y] + stoc(v[Y])], d);
}

function transfer(grid, x1, y1, x2, y2, amt1, amt2) {
    var cell1 = grid.getVal(x1, y1);
    var cell2 = grid.getVal(x2, y2);

    grid.setVal(x1, y1, 
        interpolate(cell1, cell2, 
            amt1));
    grid.setVal(x2, y2, 
        interpolate(cell1, cell2, 
            amt2));
}


function step(mainGrid, maxSwapRange, swapFraction, xVelocityGrid, yVelocityGrid) {
    var cellA = gridSample();
    var cellB = neighbor(cellA, maxSwapRange, 
        [xVelocityGrid.getVal(cellA[X], cellA[Y]), yVelocityGrid.getVal(cellA[X], cellA[Y])]);
    if (cellB[X] == clip(cellB)[X] && cellB[Y] == clip(cellB)[Y]) {
        // If the neighbor is valid, mix
        transfer(
            mainGrid, 
            cellA[X], cellA[Y], 
            Math.floor(cellB[X]), Math.floor(cellB[Y]), 
            swapFraction, swapFraction);
    } else {
        // Else, just drain
        mainGrid.setVal(cellA[X], cellA[Y], 
            mainGrid.getVal(cellA[X], cellA[Y]) * (1 - swapFraction));
    }
}

function emptyGrid() {
    return new Grid(GRID_SIZE[X], GRID_SIZE[Y]);
}

const System = class {
    constructor ({}) {
        this.timer = 0;
        this.smoothGrid = emptyGrid();
        this.totalGrid = emptyGrid();
        this.gridStream = [emptyGrid()];

        this.currGridBufferSize = 1;
        this.canvasSize = [G1[X] - G0[X], G1[Y] - G0[Y]];
        this.ticks = 0;

        this.mainGrid = emptyGrid();
        this.vxGrid = emptyGrid();
        this.vyGrid = emptyGrid();
    }

    addGridFrame(newGrid) {
        // Add to the total grid
        this.totalGrid.add(newGrid);
        
        if (this.currGridBufferSize == MAX_GRID_BUFFER_SIZE) {
            // If buffer is full, take out bottom of stream and set values to incoming grid
            // And recalculate sliding total
            var last = this.gridStream.shift();
            this.totalGrid.subtract(last);
            newGrid.copyTo(last);
            this.gridStream.push(last);

        } else {
            // If buffer isn't full, add a copy of current and up counter
            var newArr = emptyGrid();
            newGrid.copyTo(newArr);
            this.gridStream.push(newArr);
            this.currGridBufferSize++;
        }
        
        this.smoothGrid.interpolate(
            this.totalGrid.createScale(1 / this.currGridBufferSize),
            MOVE_RATE
        );
    }

    pull(grid, center, target, range) {
        center[X] = Math.floor(center[X]);
        center[Y] = Math.floor(center[Y]);
        var ax = Math.max(0, center[X] - range);
        var bx = Math.min(grid.xSize - 1, (center[X] + range) + 1);
        var ay = Math.max(0, center[Y] - range);
        var by = Math.min(grid.ySize - 1, (center[Y] + range) + 1);
        for (var x = ax; x <= bx; x++) {
            for (var y = ay; y <= by; y++) {
                var dx = x - center[X];
                var dy = y - center[Y];
                var r2 = dx * dx + dy * dy;
                grid.setVal(x, y, 
                    interpolate(grid.getVal(x, y), target, 
                        FLUCTUATION_MAGNITUDE / (r2 + 1)
                    )
                );
            }
        }
    }

    update(increment) {
        // addFrame(mouse);
        this.addGridFrame(this.mainGrid);

        // Run a number of Stochastic diffusion/flow iterations
        for (var i = 0; i < SWAPS_PER_FRAME; i++) {
            step(this.mainGrid, MAX_SWAP_RANGE, SWAP_FRACTION, this.vxGrid, this.vyGrid);
        }

        this.mainGrid.scale(DECAY_FACTOR);
        this.vxGrid.scale(VECOCITY_DECAY_RATE);
        this.vyGrid.scale(VECOCITY_DECAY_RATE);

        if (this.timer % 2 == 0) {
            var fx = randint(0, GRID_SIZE[X] - 1);
            var fy = randint(0, GRID_SIZE[Y] - 1);

            var vx = (Math.random() - 0.5) * 5;
            var vy = (Math.random() - 0.5) * 5;
            var size = Math.random() * 15;

            var dx = (Math.random() - 0.5) * 5;
            var dy = (Math.random() - 0.5) * 5;

            //this.mainGrid[fy][fx] += 0.5 * Math.random();
            this.pull(this.mainGrid, [fx, fy], size, FLUCTUATION_RADIUS);
            this.pull(this.vxGrid, [fx, fy], -vx * VWEIGHT, FLUCTUATION_RADIUS);
            this.pull(this.vyGrid, [fx, fy], -vy * VWEIGHT, FLUCTUATION_RADIUS);
            
            fx += dx * 2;
            fy += dy * 2;
            var f = clip([fx, fy]);
            fx = f[X];
            fy = f[Y];

            //this.mainGrid[fy][fx] += 0.5 * Math.random();
            this.pull(this.mainGrid, [fx, fy], -size, FLUCTUATION_RADIUS);
            this.pull(this.vxGrid, [fx, fy], vx * VWEIGHT, FLUCTUATION_RADIUS);
            this.pull(this.vyGrid, [fx, fy], vy * VWEIGHT, FLUCTUATION_RADIUS);
        }
        this.timer++;
        return this;
    }
}

export default System;