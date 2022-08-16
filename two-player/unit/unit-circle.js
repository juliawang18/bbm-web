/*
 * Two-Player Unit Circle Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;
let endPos;

let gridColor;
let unitCircleColor;

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(188, 38, 60);
    unitCircleColor = color(144, 44, 89);
}

function preload() {
    loadColors();
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    midHeight = height / 2;
    gridHeight = 12;
    boxSize = height / gridHeight;
    endPos = boxSize * 14;

    playerSpeed = float(sessionStorage.getItem("speed")) + 3;
    playerLineWeight = boxSize / 3;

    player1 = new Player(0, 0, color(64, 48, 100), midHeight * 0.5, float(sessionStorage.getItem("sensitivityP1")) * 2.5 + 10);
    player2 = new Player(0, 0, color(194, 75, 62), midHeight * 1.5, float(sessionStorage.getItem("sensitivityP2")) * 2.5 + 10);

    // initial background sketch
    drawPlayerViews();
    drawGrid();
    drawAxes();
}

function draw() {

    if (!gameIsPlaying) {
        noLoop();
    } else {
        if (player1.x > endPos) {
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

        // unit circle
        x = -(player2.y - midHeight * 1.5);
        y = player1.y - midHeight * 0.5;

        fill(unitCircleColor);
        ellipse((endPos + width) / 2 + x, midHeight + y, playerLineWeight);
    }

}

function startGame() {
    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();

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

    // player 1
    fill(0, 0.4);
    rect(0, 0, endPos, height / 2);

    // unit circle
    fill(100, 0.1);
    rect(endPos, 0, width - endPos, height);
}

function drawGrid() {
    // set pen
    stroke(gridColor);
    strokeWeight(0.75);
    setLineDash([5, 5]);

    // draw vertical grid lines
    for (let i = boxSize; i < endPos; i += boxSize) {
        line(i, 0, i, height);
    }

    for (let i = (endPos + width) / 2; i < width; i += boxSize) {
        line(i, 0, i, height);
    }

    for (let i = (endPos + width) / 2; i > endPos; i -= boxSize) {
        line(i, 0, i, height);
    }

    // draw horiz. grid lines
    for (let i = boxSize; i < height; i += boxSize) {
        line(0, i, width, i);
    }

}

function drawAxes() {
    // set pen
    stroke(gridColor);
    strokeWeight(4);
    setLineDash([0, 0]);

    // draw x-axis
    line(0, player1.midHeight, endPos, player1.midHeight);
    line(0, player2.midHeight, endPos, player2.midHeight);

    // draw unit circle axes
    line(endPos, midHeight, width, midHeight);
    line((endPos + width) / 2, 0, (endPos + width) / 2, height);

}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}