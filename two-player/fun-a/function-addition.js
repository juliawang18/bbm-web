/*
 * Function-Addition Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let gridColor;
let sumColor;

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(188, 25, 30);
    sumColor = color(197, 63, 34);
}

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 8;
    boxSize = height / gridHeight;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerLineWeight = boxSize / 5;

    player1 = new Player(0, 0, color(64, 48, 100), float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10);
    player2 = new Player(0, 0, color(193, 83, 75), float(sessionStorage.getItem("sensitivityP2")) * 2.5 + 10);

    // initial background sketch
    drawGrid();
    drawXAxis();

}

function draw() {

    if (!gameIsPlaying) {
        noLoop();
    } else {
        if (player1.x > width) {
            noLoop();
            endGame();
        }

        // player 1
        updatePlayerCoords(player1, angle1);
        fill(player1.color);
        ellipse(player1.x, player1.y, playerLineWeight);

        // player 2
        updatePlayerCoords(player2, angle2);
        fill(player2.color);
        ellipse(player2.x, player2.y, playerLineWeight);

        // sum
        fill(sumColor);
        newY = map(player1.y, 0, height, -midHeight, midHeight)
        ellipse(player2.x, player2.y + newY, playerLineWeight);
    }

}

function startGame() {
    gameIsPlaying = true;

    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();

    player1.y = angle1 * player1.sensitivity + midHeight;
    player2.y = angle2 * player2.sensitivity + midHeight;

    loop();
}

function endGame() {
    gameIsPlaying = false;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function updatePlayerCoords(player, angle) {
    player.x = player.x + playerSpeed;
    player.y = lerp(player.y, angle * player.sensitivity + midHeight, 0.05);

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