// Shapes and colors
function line(canvas, c1, c2, width, color) {
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    // draw a red line
    canvas.beginPath();
    canvas.moveTo(c1[X], c1[Y]);
    canvas.lineTo(c2[X], c2[Y]);
    canvas.stroke();
}

function circle(canvas, c, radius) {
    canvas.beginPath();
    canvas.arc(c[X], c[Y], radius, 0 , 2 * Math.PI);
    canvas.fillStyle = BASE_COLOR;
    canvas.fill();
}

function rect(canvas, x0, y0, x1, y1, color) {
    canvas.beginPath();
    canvas.rect(x0, y0, x1, y1);
    canvas.fillStyle = color;
    canvas.fill();
}
