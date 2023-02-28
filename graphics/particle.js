class Particle {
    constructor(x, y, world, neighbors) {
        this.x = x;
        this.y = y;
        this.world = world;
        this.neighbors = neighbors;
        this.alive = true;
    }

    render(canvas) {
        
    }

    update(cursorX, cursorY, click, hold) {
        this.x += 0;
        this.y += 0;
        this.alive = true;
    } 
}