// I haven't figured out Node.js yet so to I'm just copy-pasting the other js file.

// ALL Grids take on this size

var X = 0;
var Y = 1;

var SIZE = [48, 24];

var MOUSE_RANGE = [20, 20];
var RAND_RANGE = 1;

var FEED_RATE = 0.2;
var FADE_RATE = 1;

var SWAPS = 60; // Number of diffusion swaps per frame
var MIX_COEF = 0.75; // Amount of mixing per frame

var MOVE_RATE = 0.2;

var VECOCITY_DECAY_RATE = 1;
var VWEIGHT = 100000000;

var G0 = [0, 0];
var G1 = [960, 480];
var CELL_SIZE = [(G1[X] - G0[X]) / SIZE[X], (G1[Y] - G0[Y]) / SIZE[Y]];

var RAD = 48;
var BASE = 1;

// The window size when calculating moving averages for smoothing
var MOUSE_BUFFER = 10;
var MAX_GRID_BUFFER_SIZE = 15;

var BASE_COLOR = "#606060";
var BG_COLOR = "404040";
var SHADOW_OFFSET = 5;




// DIFFUSE GRID

function grid(c) {
    var a = new Array(c[Y]);
    for (var y = 0; y < SIZE[Y]; y++) {
        a[y] = new Array(c[X]);
        for (var x = 0; x < SIZE[X]; x++) {
            a[y][x] = 0;
        }
    }
    return a;
}

function randint(a, b) {
    return (a + Math.floor(Math.random() * (b - a)));
}

// Flip a coin weighted p for True
function flip(p) {
    return (Math.random() < p);
}

function clip(c) {
    return [Math.min(Math.max(0, c[X]), SIZE[X] - 1), Math.min(Math.max(0, c[Y]), SIZE[Y] - 1)];
}

// Randomly sample from the entire grid
function gridSample() {
    return [randint(0, SIZE[X]), randint(0, SIZE[Y])];
}

// Sample from the axis-aligned square of length 2d+1 centered on x, y
function boxSample(c, d) {
    var dx = randint(0 - d, d + 1);
    var dy = randint(0 - d, d + 1);
    return clip([c[X] + dx, c[Y] + dy]);
}


function stoc(n) {
    var fn = Math.floor(n);
    var d = self.flip(n - fn);
    if (d == true) {
        return fn + 1;
    } else {
        return fn;
    }
}

function neighbor(c, d, v) {
    return boxSample([c[X] + stoc(v[X]), c[Y] + stoc(v[Y])], d);
}


// P must be an array
function sampleFilter(arr) {
    var x = 0;
    var y = 0;
    var finished = false;
    while (!finished) {
        var s = gridSample;
        finished = flip(arr[y][x]);
    }
}

function transfer(arr, x1, y1, x2, y2, amt1, amt2) {
    var cell1 = arr[y1][x1];
    var cell2 = arr[y2][x2];
    arr[y1][x1] = cell1 + amt1 * (cell2 - cell1);
    arr[y2][x2] = cell2 + amt2 * (cell1 - cell2);
}

function step(arr, d, diffusion, vx, vy) {
    var nc;
    var c = gridSample();
    //console.log(vx[c[Y]][c[X]], vy[c[Y]][c[X]]);
    nc = neighbor(c, d, [vx[c[Y]][c[X]], vy[c[Y]][c[X]]]);
    if (nc == clip(nc)) {
        // If the neighbor is valid, mix
        transfer(arr, c[X], c[Y], nc[X], nc[Y], diffusion, diffusion);
    } else {
        // Else, just drain
        arr[c[Y]][c[X]] *= (1 - diffusion);
    }
}





// CURSOR

var mouse = [0, 0];
var currentBuffer = 1;

function globalToLocal(c) {
    return [SIZE[X] * (c[X] - G0[X]) / (G1[X] - G0[X]), SIZE[Y] * (c[Y] - G0[Y]) / (G1[Y] - G0[Y])];
}

function localToGlobal(c) {
    return [G0[X] + (G1[X] - G0[X]) * c[X] / SIZE[X], G0[Y] + (G1[Y] - G0[Y]) * c[Y] / SIZE[Y]];
}

var cursorStream = [globalToLocal(mouse)]

var totalC = [mouse[X], mouse[Y]];
var smoothC = [mouse[X], mouse[Y]];
var prevC = globalToLocal([mouse[X], mouse[Y]]);

function heat(grid, c) {
    c[X] = Math.floor(c[X]);
    c[Y] = Math.floor(c[Y]);
    var ax = Math.max(0, c[X] - MOUSE_RANGE[X]);
    var bx = Math.min(SIZE[X] - 1, (c[X] + MOUSE_RANGE[X]) + 1);
    var ay = Math.max(0, c[Y] - MOUSE_RANGE[Y]);
    var by = Math.min(SIZE[Y] - 1, (c[Y] + MOUSE_RANGE[Y]) + 1);
    console.log(ax, c[X], c[Y]);
    for (var x = ax; x <= bx; x++) {
        for (var y = ay; y < by; y++) {
            var dx = x - c[X];
            var dy = y - c[Y];
            var r2 = dx * dx + dy * dy;
            grid[y][x] = grid[y][x] + FEED_RATE / (r2 + 1);
        }
    }
}

function pull(grid, c, target) {
    c[X] = Math.floor(c[X]);
    c[Y] = Math.floor(c[Y]);
    var ax = Math.max(0, c[X] - MOUSE_RANGE[X]);
    var bx = Math.min(SIZE[X] - 1, (c[X] + MOUSE_RANGE[X]) + 1);
    var ay = Math.max(0, c[Y] - MOUSE_RANGE[Y]);
    var by = Math.min(SIZE[Y] - 1, (c[Y] + MOUSE_RANGE[Y]) + 1);
    for (var x = ax; x <= bx; x++) {
        for (var y = ay; y <= by; y++) {
            var dx = x - c[X];
            var dy = y - c[Y];
            var r2 = dx * dx + dy * dy;
            grid[y][x] += (target - grid[y][x]) * FEED_RATE / (r2 + 1);
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

var smoothGrid = grid(SIZE);
var totalGrid = grid(SIZE);

var gridStream = [grid(SIZE)];

var currGridBufferSize = 1;


function addGridFrame(newGrid) {
    // Add to the total grid
    for (var y = 0; y < SIZE[Y]; y++) {
        for (var x = 0; x < SIZE[X]; x++) {
            totalGrid[y][x] += newGrid[y][x];
        }
    }
    
    if (currGridBufferSize == MAX_GRID_BUFFER_SIZE) {
        // If buffer is full, take out bottom of stream and set values to incoming grid
        // And recalculate sliding total
        var last = gridStream.shift();
        for (var y = 0; y < SIZE[Y]; y++) {
            for (var x = 0; x < SIZE[X]; x++) {
                totalGrid[y][x] -= last[y][x];
                last[y][x] = newGrid[y][x];
            }
        }
        gridStream.push(last);
    } else {
        // If buffer isn't full, add a copy of current and up counter
        var newArr = grid(SIZE);
        for (var y = 0; y < SIZE[Y]; y++) {
            for (var x = 0; x < SIZE[X]; x++) {
                newArr[y][x] = newGrid[y][x];
            }
        }
        gridStream.push(newArr);
        currGridBufferSize++;
    }
    
    // Pull smooth grid to buffer average
    for (var y = 0; y < SIZE[Y]; y++) {
        for (var x = 0; x < SIZE[X]; x++) {
            smoothGrid[y][x] += (totalGrid[y][x] / currGridBufferSize - smoothGrid[y][x]) * MOVE_RATE;
        }
    }
}






// CANVAS

canvasSize = [G1[X] - G0[X], G1[Y] - G0[Y]];

var canvas = document.getElementById("myCanvas2");
var ctx = canvas.getContext("2d");
var ticks = 0;

// Grids: mainGrid concerns the actual display/heat values
// A vector field is stored in vxGrid and vyGrid
var mainGrid = grid(SIZE);
var vxGrid = grid(SIZE);
var vyGrid = grid(SIZE);

function drawCircle(canvas, c, radius) {
    canvas.beginPath();
    canvas.arc(c[X], c[Y], radius, 0 , 2 * Math.PI);
    canvas.fillStyle = BASE_COLOR;
    canvas.fill();
}

function drawRect(canvas, c0, c1, color) {
    canvas.beginPath();
    canvas.rect(c0[X], c0[Y], c1[X], c1[Y]);
    canvas.fillStyle = BASE_COLOR;
    canvas.fill();
}

function drawCross(canvas, center, length, thickness, color) {
    drawRect(canvas, [center[X] - thickness, center[Y] - length], [thickness * 2, length * 2], color);
    drawRect(canvas, [center[X] - length, center[Y] - thickness], [length * 2, thickness * 2], color);
}

function headline(canvas, message) {
    canvas.font = "96px Raleway";
    canvas.textAlign = "center";
    canvas.fillStyle = "#282828";
    canvas.fillText(message, (G1[X] - G0[X]) / 2, (G1[Y] - G0[Y]) / 2 + SHADOW_OFFSET);
    canvas.fillStyle = "#ffffff";
    canvas.fillText(message, (G1[X] - G0[X]) / 2, (G1[Y] - G0[Y]) / 2);
}

// Displays an array of shapes with parameters from the smoothed-out grid
// TODO: y loop cut short because last one doesn't render. Fix it
function render(canvas, grid) {
    var c;
    for (var y = 0; y < SIZE[Y] - 1; y++) {
        for (var x = 0; x < SIZE[X]; x++) {
            c = localToGlobal([x + 0.5, y + 0.5]);
            drawCross(canvas, c, BASE + RAD * grid[y][x], 1, BASE_COLOR);
            //drawCircle(canvas, c, BASE + RAD * grid[y][x]);
        }
    }
    headline(canvas, "JOEY ZHU");
}

// Updates the grid
function update() {
    // Update streams
    addFrame(mouse);
    addGridFrame(mainGrid);

    // Run a number of Stochastic diffusion/flow iterations
    for (var i = 0; i < SWAPS; i++) {
        step(mainGrid, RAND_RANGE, MIX_COEF, vxGrid, vyGrid);
    }

    // Update 
    pull(mainGrid, globalToLocal(smoothC), 1);
    var vel = globalToLocal(mouseV())
    heat(vxGrid, globalToLocal(smoothC), VWEIGHT * vel[X]);
    heat(vyGrid, globalToLocal(smoothC), VWEIGHT * vel[Y]);

    for (var y = 0; y < SIZE[Y]; y++) {
        for (var x = 0; x < SIZE[X]; x++) {
            mainGrid[y][x] = mainGrid[y][x] * FADE_RATE;
            vxGrid[y][x] = vxGrid[y][x] * VECOCITY_DECAY_RATE;
            vyGrid[y][x] = vyGrid[y][x] * VECOCITY_DECAY_RATE;
        }
    }
    ticks++;
}




// INTERFACE

function mainloop() {
    requestAnimationFrame(mainloop);
    ctx.clearRect(0, 0, canvasSize[X], canvasSize[Y]);
    render(ctx, smoothGrid);
    update();
}

window.addEventListener('mousemove', function(e) {
    var cRect = canvas.getBoundingClientRect();
    mouse[X] = e.x - cRect.left;
    mouse[Y] = e.y - cRect.top;
});





mainloop();






