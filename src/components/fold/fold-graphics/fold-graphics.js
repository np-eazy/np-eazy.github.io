
import {X, Y, GRID_SIZE, T, G0, G1, BASE, RAD} from './graphic-utils.js';

function clip1d(a) {
    return Math.min(Math.max(0, a), 0.9999);
}

// The colors here are on unit scale to make calculations easier in lieu of importing utils/colors.js
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(r * 256)) + componentToHex(Math.floor(g * 256)) + componentToHex(Math.floor(b * 256));
}

function localToGlobal(c) {
    return [G0[X] + (G1[X] - G0[X]) * c[X] / GRID_SIZE[X], G0[Y] + (G1[Y] - G0[Y]) * c[Y] / GRID_SIZE[Y]];
}

function drawLine(canvas, c1, c2, width, color) {
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    canvas.beginPath();
    canvas.moveTo(c1[X], c1[Y]);
    canvas.lineTo(c2[X], c2[Y]);
    canvas.stroke();
}

function drawDiagCross(canvas, center, length, color) {
    length = Math.max(0, length);
    if (length > 0) {
        drawLine(canvas, 
            [center[X] - length, center[Y] - length], 
            [center[X] + length, center[Y] + length], 
            2, color);
        drawLine(canvas, 
            [center[X] + length, center[Y] - length], 
            [center[X] - length, center[Y] + length], 
            2, color);
    }
}

const FoldGraphics = ({
    system,
}) => {
    function render(canvas, grid, glow) {
        var center;
        var length;
        for (var y = 0; y < GRID_SIZE[Y]; y++) {
            for (var x = 10; x < GRID_SIZE[X]-5; x++) {
                length = BASE + RAD * (grid.getVal(x, y)) * 2;
                center = localToGlobal([x + 0.5, y + 0.5]);
                
                // Get grid colors
                var r = 0.4 + 0.006 * (x + y) + 0.05 * Math.sin(system.timer * 0.24 / T);
                var g = 0.3 + 0.002 * (x - y) + 0.04 * Math.cos(system.timer * 0.48 / T );
                var b = 0.45 - 0.006 * (x / 2 + y) - 0.1 * Math.sin(system.timer * 0.89 / T);
                
                // Invert if negative
                if (grid.getVal(x, y) < 0) {
                    r = 1 - r;
                    g = 1 - g;
                    b = 1 - b;
                }
                
                // Render checkerboard of crosses
                if ((x + y) % 2 == 0) {
                    // Linear dodge for more engaging colors
                    var blur = Math.min(1, Math.max(0, glow - (y-25)/5));
                    r = clip1d(r * (1 + 2 * blur * grid.getVal(x, y) * grid.getVal(x, y)));
                    g = clip1d(g * (1 + 1.5 * blur * grid.getVal(x, y) * grid.getVal(x, y)));
                    b = clip1d(b * (1 + 0.75 * blur * grid.getVal(x, y) * grid.getVal(x, y)));
                    
                    var hex = rgbToHex(r, g, b);
                    drawDiagCross(canvas, [center[X], center[Y]], Math.min(10, Math.abs(length) * 1.3), hex);
                }
            }
        }
    }

    var canv = document.getElementById("fold-graphics");
    var ctx = canv != null ? canv.getContext('2d') : null;

    if (ctx != null && system != undefined) {
        ctx.clearRect(G0[X], G0[Y], G1[X], G1[Y]);
        render(ctx, system.smoothGrid, 8);
    }
};

export default FoldGraphics;


