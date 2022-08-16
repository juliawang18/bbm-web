/*
 * Two-Player Calibration Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let gridColor;
let playerLineColor;

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(0, 0, 40);
    playerLineColor = color(175, 100, 76);
}

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 12;
    boxSize = height / gridHeight;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerLineWeight = boxSize / 4;

    player1 = new Player(0, 0, midHeight * 0.5, float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10);
    player2 = new Player(0, 0, midHeight * 1.5, float(sessionStorage.getItem("sensitivityP2")) * 2.5 + 10);

    // initial background sketch
    drawPlayerViews();
    drawGrid();
    drawXAxes();
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
        ellipse(player1.x, player1.y, playerLineWeight);

        // player 2
        updatePlayerCoords(player2, angle2);
        ellipse(player2.x, player2.y, playerLineWeight);
    }

}

function startGame() {
    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();
    fill(playerLineColor);

    // instantiate players
    player1.y = angle1 * player1.sensitivity + player1.midHeight;
    player2.y = angle2 * player2.sensitivity + player2.midHeight;

    gameIsPlaying = true;

    loop();
}

function endGame() {
    gameIsPlaying = false;

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

}

function updatePlayerCoords(player, angle) {
    player.x = player.x + playerSpeed;
    player.y = lerp(player.y, angle * player.sensitivity + player.midHeight, 0.05);

}

function drawPlayerViews() {
    noStroke();

    fill(0, 0.4);
    rect(0, 0, width, height / 2);
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

function drawXAxes() {
    // set pen
    stroke(gridColor);
    strokeWeight(4);
    setLineDash([0, 0]);

    // draw x-axis
    line(0, player1.midHeight, width, player1.midHeight);
    line(0, player2.midHeight, width, player2.midHeight);

}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}