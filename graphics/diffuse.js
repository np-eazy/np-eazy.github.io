class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) { this.x += other.x; }
    subtract(other) { this.y += other.y; }
    createSum(other) { return new Point(this.x + other.x, this.y + other.y); }
    createDelta(other) { return Point(other.x - this.x, other.y - this.y); }
    createInterpolation(other, fraction) { return Point(this.x + fraction * (other.x  - this.x), this.y + fraction * (other.y  - this.y)); }
    normSquared() { return this.x * this.x + this.y * this.y };
    norm() { return Math.sqrt(this.normSquared()); }
    distanceSquared(other) { return this.createDelta(other).normSquared(); }
    distance(other) { return this.createDelta(other).norm(); }
}

class Grid {
    constructor(xSize, ySize) {
        this.array = new Array(ySize);
        this.xSize = xSize;
        this.ySize = ySize;
        for (var y = 0; y < ySize; y++) {
            this.array[y] = new Array(xSize);
            for (var x = 0; x < xSize; x++) {
                this.array[y][x] = 0;
            }
        }
    }
    getVal(x, y) { return this.array[y][x]; }
    setVal(x, y, val) { this.array[y][x] = val; }

    // Desctructive addition of new grid
    add(other) { 
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                this.array[y][x] += other.array[y][x];
            }        
        }
    }

    // Desctructive subtraction of new grid
    subtract(other) { 
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                this.array[y][x] -= other.array[y][x];
            }        
        }
    }

    // Destructive scaling of all grid values
    scale(factor) {
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                this.array[y][x] *= factor;
            }        
        }
    }

    // Destructively blend with another grid
    interpolate(other, fraction) { 
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                this.array[y][x] = this.array[y][x] + fraction * (other.array[y][x] - this.array[y][x]);
            }        
        }
    }

    // Deepcopy this grid's values to another grid
    copyTo(other) {
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                other.setVal(x, y, 
                    this.getVal(x, y));
            }        
        }
    }

    // Constructive addition of new grid
    createSum(other) {
        var newGrid = new Grid(this.xSize, this.ySize);
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                newGrid.array[y][x] = this.array[y][x] + other.array[y][x];
            }        
        }
        return newGrid;
    }

    // Constructive subtraction of new grid
    createDelta(other) { 
        var newGrid = new Grid(this.xSize, this.ySize);
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                newGrid.array[y][x] = this.array[y][x] + other.array[y][x];
            }        
        }
        return newGrid;
    }

    // Destructive scaling of all grid values
    createScale(factor) {
        var newGrid = new Grid(this.xSize, this.ySize);
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                newGrid.array[y][x] = this.array[y][x] * factor;
            }        
        }
        return newGrid;
    }

    createInterpolation(other, fraction) { 
        var newGrid = new Grid(this.xSize, this.ySize);
        for (var y = 0; y < this.ySize; y++) {
            for (var x = 0; x < this.xSize; x++) {
                newGrid.array[y][x] = this.array[y][x] + fraction * (other.array[y][x] - this.array[y][x]);
            }        
        }
        return newGrid;
    }
}

// import { Point, Grid } from "graphicUtils.js";

var X = 0;
var Y = 1;

var GRID_SIZE = [75, 25];

function emptyGrid() {
    return new Grid(GRID_SIZE[X], GRID_SIZE[Y]);
}

var FLUCTUATION_RADIUS = 10;
var FLUCTUATION_MAGNITUDE = 0.5;
var DECAY_FACTOR = 0.95;

var MAX_SWAP_RANGE = 3;
var SWAPS_PER_FRAME = 300; // Number of diffusion swaps per frame
var SWAP_FRACTION = 0.95; // Amount of mixing per frame

// Global variables for fitting animation to webpage size. I need to change my code
// so this scales with the webpage size.
var G0 = [0, 0];
var G1 = [960, 480];



var T = 10;
var MOVE_RATE = 0.2;
var VECOCITY_DECAY_RATE = 1;
var VWEIGHT = 10;

var CELL_SIZE = [(G1[X] - G0[X]) / GRID_SIZE[X], (G1[Y] - G0[Y]) / GRID_SIZE[Y]];

var RAD = 15;
var BASE = 0;

// The window size when calculating moving averages for smoothing
var MOUSE_BUFFER = 32;
var MAX_GRID_BUFFER_SIZE = 8;

// I kinda eyeballed most of the colors and color functions
var BASE_COLOR = "#606060";
var BG_COLOR = "#101010";
var SHADOW_OFFSET = 5;


// DIFFUSE GRID
function grid(c) {
    var a = new Array(c[Y]);
    for (var y = 0; y < GRID_SIZE[Y]; y++) {
        a[y] = new Array(c[X]);
        for (var x = 0; x < GRID_SIZE[X]; x++) {
            a[y][x] = 0;
        }
    }
    return a;
}

// Return a random integer in [a, b)
function randint(a, b) {
    return (a + Math.floor(Math.random() * (b - a)));
}

// Flip a coin weighted p for True
function coinFlip(p) {
    return (Math.random() < p);
}

// Clip the input between 0 and 1
function clip(c) {
    return [Math.min(Math.max(0, c[X]), GRID_SIZE[X] - 1), Math.min(Math.max(0, c[Y]), GRID_SIZE[Y] - 1)];
}

function clip1d(a) {
    return Math.min(Math.max(0, a), 0.9999);
}

// Randomly sample from the entire grid
function gridSample() {
    return [randint(0, GRID_SIZE[X]), randint(0, GRID_SIZE[Y])];
}

// Sample from the axis-aligned square of length 2d+1 centered on x, y
function boxSample(c, d) {
    var dx = randint(0 - d, d + 1);
    var dy = randint(0 - d, d + 1);
    return [c[X] + dx, c[Y] + dy];
}

// Chance of stochastically incrementing a number to calculate diffusion
function stoc(n) {
    var fn = Math.floor(n);
    var d = coinFlip(n - fn);
    if (d == true) {
        return fn + 1;
    } else {
        return fn;
    }
}

function neighbor(c, d, v) {  
    return boxSample(clip([(c[X] + stoc(v[X])) % GRID_SIZE[X], c[Y] + stoc(v[Y])]), 0);
    //return boxSample(c, d);
}

// P must be an array
function sampleFilter(arr) {
    var x = 0;
    var y = 0;
    var finished = false;
    while (!finished) {
        var s = gridSample;
        finished = coinFlip(arr[y][x]);
    }
}

function interpolate(a, b, fraction) {
    return a + fraction * (b - a);
}

// Mix the values at these two points and change their values accordingly
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

// A single "step" in the diffusion simulation which mixes values at two points.
// Each timestep computes many of these at a time, randomly selecting nearby pairs of points.
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



// CURSOR

var mouse = [0, 0];
var currentBuffer = 1;

function globalToLocal(c) {
    return [GRID_SIZE[X] * (c[X] - G0[X]) / (G1[X] - G0[X]), GRID_SIZE[Y] * (c[Y] - G0[Y]) / (G1[Y] - G0[Y])];
}

function localToGlobal(c) {
    return [G0[X] + (G1[X] - G0[X]) * c[X] / GRID_SIZE[X], G0[Y] + (G1[Y] - G0[Y]) * c[Y] / GRID_SIZE[Y]];
}

// Keep track of the cursor's last 10 positions to make a moving average to smooth out
// cursor tracking. I don't actually implement this in the current version, which is entirely
// randomly generated.
var cursorStream = [globalToLocal(mouse)]

var totalC = [mouse[X], mouse[Y]];
var smoothC = [mouse[X], mouse[Y]];
var prevC = globalToLocal([mouse[X], mouse[Y]]);

// Pull the area of the grid near the cursor towards a target value.
function pull(grid, center, target, range) {
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

function addFrame(gc) {
    var c = gc;
    // Add to top of stream
    cursorStream.push([c[X], c[Y]]);
    totalC[X] += c[X];
    totalC[Y] += c[Y];
    
    if (currentBuffer == MOUSE_BUFFER) {
        // If stream is at size, take out bottom
        var last = cursorStream.shift();
        totalC[X] = totalC[X] - last[X];
        totalC[Y] = totalC[Y] - last[Y];
    } else {
        currentBuffer++;
    }
    prevC[X] = smoothC[X];
    prevC[Y] = smoothC[Y];
    
    smoothC[X] = smoothC[X] + (totalC[X] / currentBuffer - smoothC[X]) * MOVE_RATE;
    smoothC[Y] = smoothC[Y] + (totalC[Y] / currentBuffer - smoothC[Y]) * MOVE_RATE;
}

function mouseV() {
    return [smoothC[X] - prevC[X], smoothC[Y] - prevC[Y]];
}




// GRID BUFFER

var smoothGrid = emptyGrid(); 
var totalGrid = emptyGrid();
var gridStream = [emptyGrid()];

var currGridBufferSize = 1;


function addGridFrame(newGrid) {
    // Add to the total grid
    /* for (var y = 0; y < GRID_SIZE[Y]; y++) {
        for (var x = 0; x < GRID_SIZE[X]; x++) {
            totalGrid[y][x] += newGrid[y][x];
        }
    } */
    totalGrid.add(newGrid);
    
    if (currGridBufferSize == MAX_GRID_BUFFER_SIZE) {
        // If buffer is full, take out bottom of stream and set values to incoming grid
        // And recalculate sliding total
        var last = gridStream.shift();
        /* for (var y = 0; y < GRID_SIZE[Y]; y++) {
            for (var x = 0; x < GRID_SIZE[X]; x++) {
                totalGrid[y][x] -= last[y][x];
                last[y][x] = newGrid[y][x];
            }
        } */
        totalGrid.subtract(last);
        newGrid.copyTo(last);
        
        gridStream.push(last);
    } else {
        // If buffer isn't full, add a copy of current and up counter
        var newArr = emptyGrid();
        /* for (var y = 0; y < GRID_SIZE[Y]; y++) {
            for (var x = 0; x < GRID_SIZE[X]; x++) {
                newArr[y][x] = newGrid[y][x];
            }
        } */
        newGrid.copyTo(newArr);
        gridStream.push(newArr);
        currGridBufferSize++;
    }
    
    // Pull smooth grid to buffer average
    /* 
    for (var y = 0; y < GRID_SIZE[Y]; y++) {
        for (var x = 0; x < GRID_SIZE[X]; x++) {
            smoothGrid[y][x] += (totalGrid[y][x] / currGridBufferSize - smoothGrid[y][x]) * MOVE_RATE;
        }
    } */
    smoothGrid.interpolate(
        totalGrid.createScale(1 / currGridBufferSize),
        MOVE_RATE
    );
}






// CANVAS

canvasSize = [G1[X] - G0[X], G1[Y] - G0[Y]];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ticks = 0;

// A vector field is stored in vxGrid and vyGrid
var mainGrid = emptyGrid();
var vxGrid = emptyGrid();
var vyGrid = emptyGrid();


// Shapes and colors
function drawLine(canvas, c1, c2, width, color) {
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    // draw a red line
    canvas.beginPath();
    canvas.moveTo(c1[X], c1[Y]);
    canvas.lineTo(c2[X], c2[Y]);
    canvas.stroke();
}


function drawCircle(canvas, c, radius) {
    canvas.beginPath();
    canvas.arc(c[X], c[Y], radius, 0 , 2 * Math.PI);
    canvas.fillStyle = BASE_COLOR;
    canvas.fill();
}

function drawRect(canvas, c0, c1, color) {
    canvas.beginPath();
    canvas.rect(c0[X], c0[Y], c1[X], c1[Y]);
    canvas.fillStyle = color;
    canvas.fill();
}

function drawCross(canvas, center, length, thickness, color) {
    drawRect(canvas, [center[X] - thickness, center[Y] - length], [thickness, length * 2 - thickness], color);
    drawRect(canvas, [center[X] - length, center[Y] - thickness], [length * 2 - thickness, thickness], color);
}

function drawDiagCross(canvas, center, length, thickness, color, mult, jump) {
    function transform(c) {     
        c[Y] += 4 * Math.sin(0.01 * c[X] + 0.01 * c[Y] - 0.02 * ticks) * (1 - Math.exp(-ticks / 5000));
        c[X] += 6 * Math.cos(0.01 * c[X] - 0.01 * c[Y] - 0.02 * ticks) * (1 - Math.exp(-ticks / 5000));
        var stretch = (c[Y] - G1[Y]) * (c[Y] - G1[Y]);
        var newX = (c[X] - G1[X] / 2) * (1 + b * stretch) + G1[X] / 2;
        var newY = c[Y] - a * stretch + d * (c[X] - G1[X] / 2) * (c[X] - G1[X] / 2);

        var mouseForce = 6 *  warp / (0.7 + 0.001 * mag2([smoothC[X] - newX, smoothC[Y] - newY]));
        // newX += (smoothC[X] - newX) * mouseForce;
        newY += (smoothC[Y] - newY) * mouseForce + jump;
        return [newX, newY];
    }

    length = Math.max(0, length - 0.45) * mult;
    if (length > 0) {
        var a = 0.0001;
        var b = 0.00001;
        var d = 0.0003;
        var warp = Math.sqrt(Math.sqrt(mag2(mouseV())) / 12) / 4;
        drawLine(canvas, 
            transform([center[X] - length, center[Y] - length]), 
            transform([center[X] + length, center[Y] + length]), 
            thickness, color);
        drawLine(canvas, 
            transform([center[X] + length, center[Y] - length]), 
            transform([center[X] - length, center[Y] + length]), 
            thickness, color);
    }
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// RGB values are in range [0, 1)]
function rgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(r * 256)) + componentToHex(Math.floor(g * 256)) + componentToHex(Math.floor(b * 256));
}

function nrgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(256 - r * 256)) + componentToHex(Math.floor(256 - g * 256)) + componentToHex(Math.floor(256 - b * 256));
}

function headline(canvas, message) {
    canvas.font = "48px Raleway";
    canvas.textAlign = "center";
    canvas.fillStyle = "#080808";
    canvas.fillText(message, (G1[X] - G0[X]) / 2, (G1[Y] - G0[Y]) * 9 / 10 + SHADOW_OFFSET + 24);
    canvas.fillStyle = "#ffffff";
    canvas.fillText(message, (G1[X] - G0[X]) / 2, (G1[Y] - G0[Y]) * 9 / 10 + 24);
}

// Displays an array of shapes with parameters from the smoothed-out grid
// TODO: y loop cut short because last one doesn't render. Fix it
function render(canvas, grid , xOffset, yOffset , bgRed, bgGreen, bgBlue, blend, glow, xShift, mult) {
    var c;
    var l;
    for (var y = 0; y < GRID_SIZE[Y]; y++) {
        for (var x = 0; x < GRID_SIZE[X]; x++) {
            var xPrime = (x + xShift) % GRID_SIZE[X];
            l = BASE + RAD * (grid.getVal(xPrime, y)) * 2;
            c = localToGlobal([x + 0.5, y + 0.5]);

            var r = 0.4 + 0.006 * (x + y) + 0.05 * Math.sin(ticks * 0.24 / T);
            var g = 0.3 + 0.002 * (x - y) + 0.04 * Math.cos(ticks * 0.48 / T );
            var b = 0.45 - 0.006 * (x / 2 + y) - 0.1 * Math.sin(ticks * 0.89 / T);
            
            if (grid.getVal(xPrime, y) < 0) {
                r = 1 - r;
                g = 1 - g;
                b = 1 - b;
            }
            
            
            if ((x + y) % 2 == 0) {
                var fog = Math.min(1, Math.max(0, blend + y/15));
                r += fog * (bgRed - r);
                g += fog * (bgGreen - g);
                b += fog * (bgBlue - b);

                var blur = Math.min(1, Math.max(0, glow - (y-25)/5));;
                r = clip1d(r * (1 + 2 * blur  * grid.getVal(xPrime, y) * grid.getVal(xPrime, y)));
                g = clip1d(g * (1 + 1.5 * blur  * grid.getVal(xPrime, y) * grid.getVal(xPrime, y)));
                b = clip1d(b * (1 + 0.75 * blur   * grid.getVal(xPrime, y) * grid.getVal(xPrime, y)));

                var hex = rgbToHex(r, g, b);
                drawDiagCross(canvas, [c[X] + xOffset, c[Y] + yOffset], Math.min(10, Math.abs(l)), 1, hex, mult, grid.getVal(xPrime, y) * 5);
            //drawCircle(canvas, c, BASE + RAD * grid[y][x]);
            }
        }
    }
    headline(canvas, "JOEY ZHU");
}

function mag2(c) {
    return c[X] * c[X] + c[Y] * c[Y];
}

// Updates the grid
function update() {
    // Update streams
    addFrame(mouse);
    addGridFrame(mainGrid);

    // Run a number of Stochastic diffusion/flow iterations
    for (var i = 0; i < SWAPS_PER_FRAME; i++) {
        step(mainGrid, MAX_SWAP_RANGE, SWAP_FRACTION, vxGrid, vyGrid);
    }

    // Update 
    var vel = globalToLocal(mouseV());

    /* for (var y = 0; y < GRID_SIZE[Y]; y++) {
        for (var x = 0; x < GRID_SIZE[X]; x++) {
            mainGrid[y][x] = mainGrid[y][x] * DECAY_FACTOR;
            vxGrid[y][x] = vxGrid[y][x] * VECOCITY_DECAY_RATE;
            vyGrid[y][x] = vyGrid[y][x] * VECOCITY_DECAY_RATE;
        }
    } */
    mainGrid.scale(DECAY_FACTOR);
    vxGrid.scale(VECOCITY_DECAY_RATE);
    vyGrid.scale(VECOCITY_DECAY_RATE);

    if (ticks % 4 == 0) {
        var fx = randint(0, GRID_SIZE[X] - 1);
        var fy = randint(0, GRID_SIZE[Y] - 1);

        var vx = (Math.random() - 0.5) * 5;
        var vy = (Math.random() - 0.5) * 5;
        var size = Math.random() * 15;

        var dx = (Math.random() - 0.5) * 5;
        var dy = (Math.random() - 0.5) * 5;

        //mainGrid[fy][fx] += 0.5 * Math.random();
        pull(mainGrid, [fx, fy], size, FLUCTUATION_RADIUS);
        pull(vxGrid, [fx, fy], -vx * VWEIGHT, FLUCTUATION_RADIUS);
        pull(vyGrid, [fx, fy], -vy * VWEIGHT, FLUCTUATION_RADIUS);
        
        fx += dx * 2;
        fy += dy * 2;
        var f = clip([fx, fy]);
        fx = f[X];
        fy = f[Y];

        //mainGrid[fy][fx] += 0.5 * Math.random();
        pull(mainGrid, [fx, fy], -size, FLUCTUATION_RADIUS);
        pull(vxGrid, [fx, fy], vx * VWEIGHT, FLUCTUATION_RADIUS);
        pull(vyGrid, [fx, fy], vy * VWEIGHT, FLUCTUATION_RADIUS);
    }

    ticks++;
}




// INTERFACE
var bg = 0.1;
function mainloop() {
    requestAnimationFrame(mainloop);
    ctx.clearRect(0, 0, canvasSize[X], canvasSize[Y]);

    var speed = 10 - 7.7 * (1 - Math.exp(-ticks / 500));
    var yRot =  1;
    var xRot = 0;
    render(ctx, smoothGrid, -(ticks / speed) % (CELL_SIZE[X] * 2)  - 4 * xRot, -4 * yRot,
            bg, bg, bg, 0.2,
            0, 2 * Math.trunc((ticks / speed) / (CELL_SIZE[X] * 2)), 0.6);

    render(ctx, smoothGrid, -(ticks / speed) % (CELL_SIZE[X] * 2), 0,
            bg, bg, bg, -0.5,
            8, 2 * Math.trunc((ticks / speed) / (CELL_SIZE[X] * 2)), 1.3);
    update();
}

window.addEventListener('mousemove', function(e) {
    var cRect = canvas.getBoundingClientRect();
    mouse[X] = e.x - cRect.left;
    mouse[Y] = e.y - cRect.top;
});



mainloop();






