/*
 * Calibration Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let backgroundColor;
let gridColor;
let playerLineColor;

let playerSpeed;
let playerSensitivity;
let playerLineWeight;

let gameIsPlaying = false;

let x;
let y;

function loadColors() {
    colorMode(HSB, 360, 100, 100);
    
    backgroundColor = color(0, 0, 0);
    gridColor = color(0, 0, 40);
    playerLineColor = color(175, 100, 76);
}

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(backgroundColor);

    midHeight = height / 2;
    gridHeight = 8;
    boxSize = height / gridHeight;

    playerSpeed = 5;
    playerLineWeight = boxSize / 5;
    playerSensitivity = 15;
    
    x = 0;

    // initial background sketch
    drawGrid();
    drawXAxis();
}

function draw() {

    if (!gameIsPlaying) {
        noLoop();
    } else {
        if (x > width) {
            noLoop();
            endGame();
        }
    
        x = x + playerSpeed;
        y = lerp(y, angle * playerSensitivity + midHeight, 0.05);

        ellipse(x, y, playerLineWeight);
    }

}

function startGame() {
    gameIsPlaying = true;

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();
    fill(playerLineColor);

    y = angle * playerSensitivity + midHeight;
    
    loop();
}

function endGame() {
    gameIsPlaying = false;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function drawGrid() {
    // set pen
    stroke(gridColor);
    strokeWeight(0.75);
    setLineDash([5, 5]);

    // draw vertical grid lines
    for (let i = boxSize; i < width; i += boxSize) {
        line(i, 0, i, height);
    }

    // draw horiz. grid lines
    for (let i = boxSize; i < height; i += boxSize) {
        line(0, i, width, i);
    }

}

function drawXAxis() {
     // set pen
     stroke(gridColor);
     strokeWeight(8);
     setLineDash([0, 0]);
 
     // draw x-axis
     line(0, midHeight, width, midHeight);
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}