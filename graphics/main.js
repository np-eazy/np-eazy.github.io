import Particle from "particle";

const particles = [];

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var mouseX = 0;
var mouseY = 0;

function mainloop() {
    // Render
    requestAnimationFrame(mainloop);
    ctx.clearRect(0, 0, canvasSize[X], canvasSize[Y]);
    for (const particle of particles) {
        particle.render(canvas);
    }
    
    // Update
    for (const particle of particles) {
        particle.update(mouseX, mouseY, mouseClick, mouseHold);
    }
}

window.addEventListener('mousemove', function(e) {
    var cRect = canvas.getBoundingClientRect();
    mouseX = e.x - cRect.left;
    mouseY = e.y - cRect.top;
});
for (const particle of particles) {
    particle.initialize();
}
mainloop();
