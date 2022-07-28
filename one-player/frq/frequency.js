let x;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background("#000");

    x = 0;
}

function draw() {

    if (x > width) {
        noLoop();
    }

    x = x + 5;

    ellipse(x, angle + 100, 20);
}