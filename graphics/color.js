



function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// RGB values are in range [0, 1)]
function solid(r, g, b) {
    return "#" + componentToHex(Math.floor(r * 256)) + componentToHex(Math.floor(g * 256)) + componentToHex(Math.floor(b * 256));
}

function gradient(r, g, b) {
    return "#" + componentToHex(Math.floor(r * 256)) + componentToHex(Math.floor(g * 256)) + componentToHex(Math.floor(b * 256));
}

function olorNegative(r, g, b) {
    return "#" + componentToHex(Math.floor(256 - r * 256)) + componentToHex(Math.floor(256 - g * 256)) + componentToHex(Math.floor(256 - b * 256));
}