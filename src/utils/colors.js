export function componentToHex(color) {
    var c = Math.min(255, Math.max(0, Math.round(color)))
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function interpolateColor(colorA, colorB, t, interpolationFunction) {
    return new Color ({
        red: interpolationFunction(colorA.red, colorB.red, t),
        green: interpolationFunction(colorA.green, colorB.green, t),
        blue: interpolationFunction(colorA.blue, colorB.blue, t),
    })
}

export class Color {
    constructor({red, green, blue}) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    // Descructively interpolate colors to avoid piling up Color instances
    interpolateTo(colorB, t, interpolationFunction) {
        this.red = interpolationFunction(this.red, colorB.red, t);
        this.green = interpolationFunction(this.green, colorB.green, t);
        this.blue = interpolationFunction(this.blue, colorB.blue, t);
    }

    getHex() {
        return "#" + componentToHex(this.red) + componentToHex(this.green) + componentToHex(this.blue);
    }
}

export const THEME_GRAY_6B = new Color({red: 45, green: 42, blue: 52});
export const THEME_GRAY_4B = new Color({red: 63, green: 57, blue: 68});
export const THEME_GRAY_2B = new Color({red: 78, green: 70, blue: 66});
export const THEME_GRAY_4H = new Color({red: 159, green: 149, blue: 173});
export const THEME_GRAY_6H = new Color({red: 182, green: 173, blue: 196});
export const THEME_GREEN = new Color({red: 84, green: 239, blue: 209});
export const THEME_BLUE = new Color({red: 66, green: 210, blue: 234});
export const THEME_MAGENTA = new Color({red: 234, green: 75, blue: 166});
export const THEME_ORANGE = new Color({red: 239, green: 142, blue: 46});
export const WHITE = new Color({red: 255, green: 255, blue: 255});

export const THEME_GRAY_6B_HEX = THEME_GRAY_6B.getHex();
export const THEME_GRAY_4B_HEX = THEME_GRAY_4B.getHex();
export const THEME_GRAY_2B_HEX = THEME_GRAY_2B.getHex();
export const THEME_GRAY_4H_HEX = THEME_GRAY_4H.getHex();
export const THEME_GRAY_6H_HEX = THEME_GRAY_6H.getHex();
export const THEME_GREEN_HEX = THEME_GREEN.getHex();
export const THEME_BLUE_HEX = THEME_BLUE.getHex();
export const THEME_MAGENTA_HEX = THEME_MAGENTA.getHex();
export const THEME_ORANGE_HEX = THEME_ORANGE.getHex();

export function themeTransientCycle(startColor, endColor, t, interpolationFunction) {
    var baseColor;
    var bgColor = interpolateColor(startColor, endColor, t, interpolationFunction);
    if (t < 0.2) {
        baseColor = interpolateColor(startColor, THEME_GREEN, (t - 0) / 0.2, interpolationFunction);
    } else if (t < 0.35) {
        baseColor = interpolateColor(THEME_GREEN, THEME_BLUE, (t - 0.2) / 0.15, interpolationFunction);
    } else if (t < 0.5) {
        baseColor = interpolateColor(THEME_BLUE, THEME_MAGENTA, (t - 0.35) / 0.15, interpolationFunction);
    } else if (t < 0.65) {
        baseColor = interpolateColor(THEME_MAGENTA, THEME_ORANGE, (t - 0.5) / 0.15, interpolationFunction);
    } else if (t < 0.8) {
        baseColor = interpolateColor(THEME_ORANGE, THEME_GREEN, (t - 0.65) / 0.15, interpolationFunction);
    } else {
        baseColor = interpolateColor(THEME_BLUE, endColor, (t - 0.8) / 0.2, interpolationFunction);
    }
    return interpolateColor(baseColor, bgColor, 0.7, interpolationFunction);
}


console.log(THEME_GRAY_6B_HEX,
    THEME_GRAY_4B_HEX, 
    THEME_GRAY_2B_HEX, 
    THEME_GRAY_4H_HEX, 
    THEME_GRAY_6H_HEX, 
    THEME_GREEN_HEX, 
    THEME_BLUE_HEX, 
    THEME_MAGENTA_HEX, 
    THEME_ORANGE_HEX);