/*
    For Everlaw application: This is all code for the animated background design of my webpage:
    https://joey-j-zhu.github.io
    I was inspired by quantum fluctuation simulations and tried to replicate a similar
    pattern in this script. All code written by me.
*/

// Enums to make indexing a little more convenient
var X = 0;
var Y = 1;

var T = 35;

// ALL Grids take on this size

// Global variables for fitting animation to webpage size. I need to change my code
// so this scales with the webpage size.
var G0 = [0, 0];
var G1 = [960, 540];

// I kinda eyeballed most of the colors and color functions
var BASE_COLOR = "#606060";
var BG_COLOR = "#101010";
var SHADOW_OFFSET = 5;

let X_SHIFT = 480;
let Y_SHIFT = 270;

function drawLine(canvas, p1, p2, color, width) {
    
    canvas.lineWidth = width;
    canvas.strokeStyle = color;

    canvas.beginPath();
    canvas.moveTo(p1.x + X_SHIFT, p1.y + Y_SHIFT);
    canvas.lineTo(p2.x + X_SHIFT, p2.y + Y_SHIFT);
    canvas.stroke();

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

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var ORIGIN = new Point(0, 0);

class Line {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }
}

function drawLines(canvas, lines, color, width) {
    for (let i = 0; i < lines.length; i++) {
        drawLine(canvas, lines[i].p1, lines[i].p2, color, width);
    }
}


function distSquared(p1, p2) {
    return ((p2.x - p1.x) * (p2.x - p1.x) +  (p2.y - p1.y) * (p2.y - p1.y) );
}

function dist(p1, p2) {
    return Math.sqrt(distSquared(p1, p2));
}

function generateHexagon(centerX, centerY,  radius, angle) {
    var lines = [];
    let angleIncrement = 60 * Math.PI / 180;
    for (let i = 0; i < 6; i++) {
        lines.push(new Line(
            new Point(
                centerX + radius * Math.cos(angle + angleIncrement * i), 
                centerY + radius * Math.sin(angle + angleIncrement * i)),
            new Point(
                centerX + radius * Math.cos(angle + angleIncrement * (i  + 1)), 
                centerY + radius * Math.sin(angle + angleIncrement * (i + 1)))
            ));
    }
    return lines;
}

function generateHexagonGrid(size, borderOffset, range) {
    var lines = [];
    let iRatio = 1.5;
    let jRatio = Math.sqrt(3) / 2;
    for (let i = -Math.floor(range / iRatio); i <= Math.ceil(range / iRatio); i++) {
        for (let j = -Math.floor(range / jRatio); j <= Math.ceil(range / jRatio); j++) {
            if ((i + j) %  2 == 0) {
                lines = lines.concat(generateHexagon(i * iRatio * size, j * jRatio * size, size * borderOffset, 0));
            }
        }
    }
    return lines;
}

function hyperbolicTransformation(point, lambda) {
    var scale = 1 / (1 +  lambda * dist(ORIGIN, point));  
    if (scale < 0) scale = NaN;
    return new Point(point.x * scale, point.y * scale);
}

function hyperbolicWarp(lines, lambda) {
    newLines = [];
    for (let i = 0; i < lines.length; i++) {
            newLines.push(new Line(
                hyperbolicTransformation(lines[i].p1, lambda),
                hyperbolicTransformation(lines[i].p2, lambda)));
    }
    return newLines;
}


function twistTransformation(point, lambda, cap) {
    var angle = Math.max(lambda * dist(ORIGIN, point), cap);
    return new Point(point.x * Math.cos(angle) + point.y * Math.sin(angle), point.x * -Math.sin(angle) + point.y * Math.cos(angle));
}

function twistWarp(lines, lambda, cap) {
    newLines = [];
    for (let i = 0; i < lines.length; i++) {
            newLines.push(new Line(
                twistTransformation(lines[i].p1, lambda, cap),
                twistTransformation(lines[i].p2, lambda, cap)));
    }
    return newLines;
}



// Flip a coin weighted p for True

 

// CANVAS

canvasSize = [G1[X] - G0[X], G1[Y] - G0[Y]];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Shapes and color

let HEX_SIZE = 30;
let BORDER_OFFSET = 0.9;
let RANGE = 16;
let WARP_AMPLITUDE = 0.003;
let TWIST_AMPLITUDE = 0.03;

var warpLambda = WARP_AMPLITUDE;
var twistLambda = TWIST_AMPLITUDE;




// INITIALIZATION
let staticLines = generateHexagonGrid(HEX_SIZE, BORDER_OFFSET, RANGE);
var ticks = 0;

function render(canvas) {
    var lines = hyperbolicWarp(staticLines, warpLambda);
    lines = twistWarp(lines, twistLambda, 6.28);
    drawLines(canvas, lines, "#FFFFFF", 1);
}

function update() {
    warpLambda = Math.sin(ticks / 120) * WARP_AMPLITUDE;
    twistLambda =  Math.cos(ticks / 120) * TWIST_AMPLITUDE;
    ticks++;
}


function mainloop() {
    requestAnimationFrame(mainloop);
    ctx.clearRect(0, 0, canvasSize[X], canvasSize[Y]);
    render(ctx);
    update();
}

/* 
window.addEventListener('mousemove', function(e) {
    var cRect = canvas.getBoundingClientRect();
    mouse[X] = e.x - cRect.left;
    mouse[Y] = e.y - cRect.top;
});
*/

mainloop();






