
import {X, Y, G0, G1 } from './graphic-utils.js';
import { WHITE, THEME_GRAY_6B, interpolateColor, THEME_GRAY_4B, THEME_BLUE, THEME_MAGENTA, THEME_ORANGE } from '../../../utils/colors';
import { interpolateTrig } from '../../../utils/functions.js';
import { themeTransientCycle } from '../../../utils/colors';

// The colors here are on unit scale to make calculations easier in lieu of importing utils/colors.js
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function drawCircle(canvas, c, radius, color) {
    canvas.beginPath();
    canvas.arc(c[X], c[Y], radius, 0 , 2 * Math.PI);
    canvas.fillStyle = color;
    canvas.fill();
}

function project(x, y, z, t) {
    var period = 1 / 100;
    var newX = x * Math.cos(t * period) + z * Math.sin(t * period);
    var newY = y;
    var newZ = x * -Math.sin(t * period) + z * Math.cos(t * period);
    var parallax = 0.02;
    var centerX = 0;
    var centerY = 0;
    newX += (newX - centerX) * newZ * parallax;
    newY += (newY - centerY) * newZ * parallax;

    var scale = 66;
    return [(newX + 1) * scale + 600, (newY + 1) * scale + 200];
}

const AtomGraphics = ({
    atom,
}) => {
    //atom.particles.sort((p1, p2) => p1.z > p2.z ? 1 : (p1.z < p2.z ? -1 : 0));
    function render(canvas) {
        atom.particles.sort((particleA, particleB) => particleA.z > particleB.z ? 1 : (particleA.z < particleB.z ? -1 : 0));
        for (var i = 0; i < atom.particles.length; i++) {
            canvas.globalAlpha = 0.25;
            var p = atom.particles[i];
            var period = 1 / 100;
            var newZ = p.x * -Math.sin(atom.timer * period) + p.z * Math.cos(atom.timer * period);
            var dxnColor = p.color;
            var color = interpolateColor(THEME_GRAY_6B, dxnColor, Math.max(0, Math.min(2, (2 + newZ) / 2.0)), interpolateTrig);
            var point = project(p.x, p.y, p.z, atom.timer);
            drawCircle(canvas, [point[0], point[1]], Math.max(1, Math.min(2, (2 + newZ))), color.getHex(), atom.timer);
        }
    }

    var canv = document.getElementById("fold-graphics");
    var ctx = canv != null ? canv.getContext('2d') : null;

    if (ctx != null && atom != undefined) {
        ctx.clearRect(G0[X], G0[Y], G1[X], G1[Y]);
        render(ctx);
    }
};

export default AtomGraphics;


