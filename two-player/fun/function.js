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

    gridColor = color(0, 0, 40);

    // blue to orange
    gradientColors = [
        color(218, 89, 96),
        color(222, 82, 94),
        color(227, 74, 92),
        color(239, 61, 88),
        color(250, 61, 85),
        color(263, 62, 82),
        color(274, 64, 80),
        color(293, 61, 72),
        color(306, 59, 71),
        color(329, 61, 77),
        color(339, 62, 81),
        color(354, 63, 87),
        color(3, 67, 91),
        color(13, 82, 98)
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

    playerSpeed = 5;
    playerLineWeight = boxSize / 5;

    player1 = new Player(0, 0, color(0, 0, 5), midHeight * 0.5, 15);
    player2 = new Player(0, 0, color(0, 0, 10), midHeight * 1.5, 15);

    populateTargetPoints();

    // initial background sketch
    drawPlayerViews();
    drawGrid();
    drawXAxes();
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
        updatePlayer(player1, angle);
        calculateFillColor(player1);
        ellipse(player1.x, player1.y, playerLineWeight);

        // player 2
        updatePlayer(player2, angle);
        calculateFillColor(player2);
        ellipse(player2.x, player2.y, playerLineWeight);
    }

}

function startGame() {
    let hideModal = document.getElementById('hideModal');
    hideModal.style.display = "none";

    noStroke();

    // instantiate players
    player1.y = angle * player1.sensitivity + player1.midHeight;
    player2.y = angle * player2.sensitivity + player2.midHeight;

    gameIsPlaying = true;

    loop();
}

function endGame() {
    gameIsPlaying = false;

    document.getElementById("player1Score").innerHTML = round((player1.numCorrect / Object.keys(targetPoints).length) * 100);
    document.getElementById("player2Score").innerHTML = round((player1.numCorrect / Object.keys(targetPoints).length) * 100);

    let player1Modal = document.getElementById('player1Modal');
    player1Modal.style.display = "block";

    let player2Modal = document.getElementById('player2Modal');
    player2Modal.style.display = "block";

}

function updatePlayer(player, angle) {
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

    if (distance < 60) {
        index = round(distance / 5);
        fill(gradientColors[index]);
        if (index < 5) {
            player.numCorrect += 1;
        }
    } else if (distance) {
        fill(gradientColors[13]);
    }

}

function drawPlayerViews() {
    noStroke();

    fill(player1.backgroundColor);
    rect(0, 0, width, midHeight);

    fill(player2.backgroundColor);
    rect(0, midHeight, width, height);
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

function drawXAxes() {
    // set pen
    stroke(0);
    strokeWeight(4);
    setLineDash([0, 0]);

    // draw x-axis
    line(0, midHeight, width, midHeight);

    // set pen
    stroke(gridColor);
    strokeWeight(8);

    line(0, player1.midHeight, width, player1.midHeight);
    line(0, player2.midHeight, width, player2.midHeight);
}

function setLineDash(list) {
    drawingContext.setLineDash(list);
}