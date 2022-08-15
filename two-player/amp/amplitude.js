/*
 * Two-Player Amplitude-Match Activity Javascript File
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

let goalAmplitude = 2;

function loadColors() {
    colorMode(HSB, 360, 100, 100);

    gridColor = color(0, 0, 40);

    // blue to gray
    gradientColors = [
        color(215, 95, 96),
        color(215, 88, 91),
        color(215, 81, 84),
        color(215, 72, 77),
        color(215, 64, 72),
        color(215, 45, 62),
        color(215, 35, 58),
        color(214, 11, 49),
        color(0, 0, 46)
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
        // updatePlayer(player1, angle);
        // calculateFillColor(player1);
        ellipse(player1.x, player1.y, playerLineWeight);

        // player 2
        // updatePlayer(player2, angle);
        // calculateFillColor(player2);
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

function calculateFillColor(player) {
    playerAmp = abs(y - midHeight);
    distanceToGoal = abs(goalInPixels - playerAmp);


    if (distanceToGoal < 21) {
        index = round(distanceToGoal / 3);
        fill(gradientColors[index]);

        if (index < 4) {
            reachedAmp = true;
        }
    } else if (distanceToGoal) {
        fill(gradientColors[8]);
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