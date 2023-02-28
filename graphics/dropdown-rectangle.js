import Particle from "particle";
import  * as draw from "draw";
import  * as color from "color";


class DropdownRectangle extends Particle {
    constructor(x, y, length, width, world, neighbors) {
        super(x, y, world, neighbors);
        this.length = length;
        this.width = width;
    }

    render(canvas) {
        draw.rect(canvas, x0, y0, x0+length, y0+length, color.solid(1, 4, 7));
    }

    update(cursorX, cursorY, click, hold) {}
    }
}