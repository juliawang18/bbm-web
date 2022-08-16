/*
 * Two-Player Function-Match Activity Javascript File
*/

let midHeight;
let gridHeight;
let boxSize;

let gridColor;
let gradientColors = [];

let playerSpeed;
let playerLineWeight;

let gameIsPlaying = false;

let player1;
let player2;

let targetPoints = new Object();

function func(x) {
    return sin(x);
}

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(141, 19, 40);

    // correct to incorrect gradient
    gradientColors = [
        color(8, 60, 100),
        color(8, 56, 94),
        color(8, 54, 90),
        color(8, 47, 81),
        color(9, 42, 76),
        color(9, 36, 71),
        color(11, 25, 62),
        color(20, 13, 51),
        color(144, 4, 50),
        color(177, 15, 51)
    ]
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

    populateTargetPoints();

    // initial background sketch
    drawPlayerViews();
    drawGrid();
    drawFunctions();
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
        calculateFillColor(player1);
        ellipse(player1.x, player1.y, playerLineWeight);

        // player 2
        updatePlayerCoords(player2, angle2);
        calculateFillColor(player2);
        ellipse(player2.x, player2.y, playerLineWeight);
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

    document.getElementById("player1Score").innerHTML = round((player1.numCorrect / Object.keys(targetPoints).length) * 100);
    document.getElementById("player2Score").innerHTML = round((player1.numCorrect / Object.keys(targetPoints).length) * 100);

    let hideStatsModal = document.getElementById('hideStatsModal');
    hideStatsModal.style.display = "block";

    // let player2Modal = document.getElementById('player2Modal');
    // player2Modal.style.display = "block";

}

function updatePlayerCoords(player, angle) {
    player.x = player.x + playerSpeed;
    player.y = lerp(player.y, angle * player.sensitivity + player.midHeight, 0.05);

}

function populateTargetPoints() {
    for (let i = 0; i < width; i += playerSpeed) {
        targetPoints[i] = func(i / (boxSize)) * (boxSize);
    }

}

function calculateFillColor(player) {
    distance = abs(targetPoints[player.x] - (player.y - player.midHeight));

    if (distance < 120) {
        index = round(distance / 13);
        fill(gradientColors[index]);
        if (index < 5) {
            player.numCorrect += 1;
        }
    } else if (distance) {
        fill(gradientColors[9]);
    }

}

function drawPlayerViews() {
    noStroke();

    fill(0, 0.1);
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

function drawFunctions() {
    // set pen
    stroke(gridColor);
    strokeWeight(playerLineWeight * 0.8);

    // draw function
    for (let i = 0; i < width; i += 30) {
        point(i, func(i / (boxSize)) * (boxSize) + player1.midHeight);
    }

    for (let i = 0; i < width; i += 30) {
        point(i, func(i / (boxSize)) * (boxSize) + player2.midHeight);
    }
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}